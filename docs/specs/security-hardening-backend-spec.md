# Security Hardening — Backend (`rescute-api`) — Spec

**Status:** Draft
**Date:** 2026-07-06
**Related:** `docs/security/2026-07-06-full-audit.md`, `docs/HANDOFF.md`, sibling spec `docs/specs/security-hardening-frontend-spec.md`

## Goal
Remediate every audit finding that lives in the FastAPI backend (bounded fixes plus the escalated design calls the audit assigned to the Architect), so the deployed API cannot be trivially auth-bypassed, cost-drained, or used for stored XSS. Scope excludes the audit's confirmed-clean "Not Vulnerable" section.

## Context & Current State
- `SECRET_KEY` fails open to the public constant `"dev-secret-key"` (`app/config.py:6`), consumed at `app/application/auth_service.py:64,77,81` and `app/adapters/inbound/api/middleware/auth.py:23`. `render.yaml:11-12` uses `generateValue: true`, but nothing forces the override, so local/`docker-compose` runs on the weak default.
- Tokens carry only `sub`/`role`/`exp` — no `type` claim (`auth_service.py:75-81`), so an access token is accepted at `/auth/refresh` (`auth_router.py:54-65`) and vice-versa. No server-side revocation exists; logout is client-only.
- `/ai-care/ask` and `/ai-care/chat` (`ai_care_router.py:27-50`) are public, unauthenticated, unthrottled, and each proxies to OpenAI (`openai_provider.py:37-64`, up to 600 tokens).
- Auth routes (`auth_router.py:17,38,54`) have no rate limiting.
- Upload validation trusts client `Content-Type` (`upload_router.py:20`) and uses the user-supplied filename extension verbatim (`upload_router.py:34`); files are served as active content via `StaticFiles` (`main.py:38`).
- `donation_service.contribute` (`donation_service.py:19-26`) blindly does `post.current_amount += amount`. Note: the Pydantic schema **already** enforces `amount: float = Field(gt=0)` (`schemas/donation.py:42`, and intents `:57`); the gap is that the service layer has no defense-in-depth check and `/donations/{id}/contribute` (`donation_router.py:54`) is unauthenticated.
- Verbose errors: raw upstream OpenAI body up to 500 chars (`openai_provider.py:57-60`) surfaced as `detail=str(error)` (`ai_care_router.py:36,50`); raw `ValueError` text echoed in routers (`cat_router.py:49`, `auth_router.py:30`, `donation_router.py:50,63,84`).
- No security-header middleware (`main.py`). CORS unconditionally allows `localhost:3000`/`127.0.0.1:3000` with credentials (`main.py:11-14`).
- No dependency-audit gate in CI (`pip-audit` was not runnable in the audit env).

## Proposed Design

### Escalated design decisions (resolved here — defaults for a hackathon-scale platform)

1. **AI endpoint auth model** — *Keep AI chat public; do not require login.* Cat-care Q&A is a public marketing/UX feature (frontend calls it from `cat-care/page.tsx` with no auth). Gating it behind login would harm the product for zero security benefit beyond what rate limiting already provides. Mitigate cost/DoS with per-IP rate limiting only.
2. **Rate-limiting approach** — *Use `slowapi`* (the idiomatic FastAPI limiter: a `Limiter` keyed on client IP, wired via `app.state.limiter` + an exception handler, applied per-route with decorators). In-process/in-memory storage is acceptable at hackathon scale (single Render worker); no Redis. A shared limiter instance lives in a new `app/rate_limit.py` so routers and `main.py` reference the same object.
3. **Refresh-token revocation/rotation** — *Minimal viable: a `token_version` integer column on `users`.* The refresh token embeds the user's current `ver`; `/auth/refresh` rejects tokens whose `ver` no longer matches; logout (new endpoint) increments `token_version`, invalidating every outstanding refresh token for that user. This gives real server-side revocation and "log out everywhere" with one column and one migration — no new table, no per-token store. Full per-token rotation-reuse detection is deliberately out of scope (see Open Questions).
4. **Donation contribute** — *Keep it a public, unverified pledge tally; do not integrate payments.* No payment gateway exists (confirmed by audit). `current_amount` is documented as an unverified pledge total, not verified funds. Harden with a service-layer `amount > 0` guard (defense-in-depth) and per-IP rate limiting on `contribute` and `intent`. Requiring auth is rejected because donors are anonymous by product design. The residual "an anon can cosmetically inflate a public total" is accepted and flagged; the real fix is a payment gateway, out of scope.

### Contracts
- Token payloads gain `"type": "access" | "refresh"` and refresh tokens gain `"ver": <int>`. `get_current_user` (both `auth_service.py:62` and `middleware/auth.py:17`) MUST reject tokens whose `type != "access"`. `/auth/refresh` MUST reject tokens whose `type != "refresh"` or whose `ver` mismatches. Backward-incompatible: all existing issued tokens become invalid on deploy (acceptable — hackathon, forces re-login).
- Error responses to clients become generic strings; full detail is logged server-side via the module logger. Status codes are unchanged.

## Scope
- In scope: `config.py`, `auth_service.py`, `middleware/auth.py`, `auth_router.py`, `ai_care_router.py`, `openai_provider.py`, `upload_router.py`, `donation_service.py`, `donation_router.py`, `main.py`, `requirements.txt`, new `app/rate_limit.py`, new alembic migration, `models.py`, `user_repository.py`, `user.py` entity, and a root CI workflow.
- Out of scope: object storage for uploads (Render ephemeral FS — durability, not security), migrating `python-jose`→`PyJWT`, real payment integration, per-token rotation-reuse store, the `Not Vulnerable` audit items, `⚪` housekeeping items (seed password, committed PNG).

## Interfaces / Models / Endpoints
- `app/rate_limit.py` (new): `from slowapi import Limiter; from slowapi.util import get_remote_address; limiter = Limiter(key_func=get_remote_address)`.
- `config.py`: `SECRET_KEY: str` (no default) with a `@field_validator` (or startup check) rejecting empty / `"dev-secret-key"` and enforcing `min_length=32`.
- `auth_service.py`: `_create_access_token(...)` adds `"type": "access"`; `_create_refresh_token(user_id, version)` adds `"type": "refresh"`, `"ver": version`; new/updated verification helpers enforce the claim. New method to support logout revocation (increment version) via repository.
- `auth_router.py`: new `POST /auth/logout` (auth-required) that increments the caller's `token_version`.
- `users` table: `token_version INTEGER NOT NULL DEFAULT 0` (migration `004`).
- Security headers added to every response: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security: max-age=63072000; includeSubDomains`, and a conservative `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'`. Uploads additionally get `Content-Disposition: attachment`.

## Impact Analysis
- **Breaking:** removing the `SECRET_KEY` default makes the app refuse to boot without the env var — `docker-compose.yml` and local `.env` MUST set it. The `type`/`ver` claim changes invalidate all existing tokens (forced re-login). These are intended.
- **Dependencies:** add `slowapi` and `filetype` (magic-byte sniffing) to `requirements.txt` (and `pyproject.toml` if kept in sync). Add `pip-audit` as a CI-only tool.
- **Migration:** `004` adds a nullable-safe column with server default `0`; backfill is automatic. Reversible.
- **Tests:** any test that constructs the app without `SECRET_KEY`, or asserts old error strings, or posts to `/auth/refresh` with an access token, will need updating. Add tests: SVG/HTML upload rejected; `amount <= 0` rejected at service; access token rejected at refresh; forged `ver` rejected; rate-limit returns 429.
- **Failure modes:** slowapi in-memory store resets on restart (acceptable). `filetype` sniff on truncated/oversized files returns `None` → treat as invalid.

## Implementation Units
Dependency-ordered. **Units 1–2 are foundational auth changes; everything touching auth is sequenced after them.**

1. **Require `SECRET_KEY` (kill fail-open default)** — files: `rescute-api/app/config.py` (line 6); `rescute-api/docker-compose.yml`; `rescute-api/.env.example` (create if absent) — change: remove the `"dev-secret-key"` default so `SECRET_KEY` is required; add a `field_validator` rejecting empty/`"dev-secret-key"` and requiring `min_length=32`; ensure `docker-compose.yml`/`.env.example` supply a strong local value — acceptance: app raises on boot when `SECRET_KEY` is unset or equals the old default; boots with a 32+ char value. Cite: audit `config.py:6`.

2. **Add `type` (and `ver`) claims to tokens + verify** — files: `rescute-api/app/application/auth_service.py` (lines 62-73 verify, 75-81 mint); `rescute-api/app/adapters/inbound/api/middleware/auth.py` (lines 22-25) — change: `_create_access_token` adds `"type":"access"`; `_create_refresh_token` adds `"type":"refresh"` (and `"ver"` param, defaulting for now); both `get_current_user` decoders reject `type != "access"`; add a `verify_refresh_token` path that rejects `type != "refresh"` — acceptance: an access token presented to `/auth/refresh` is 401; a refresh token presented to a protected route is 401. Cite: audit `auth_service.py:75-81`, `auth_router.py:54-65`.

3. **Enforce refresh-token `type` at `/auth/refresh`** — files: `rescute-api/app/adapters/inbound/api/auth_router.py` (lines 54-65) — change: refresh endpoint calls the refresh-specific verification (not the access-token `get_current_user`) so only `type:"refresh"` tokens are accepted — acceptance: `POST /auth/refresh` with a valid refresh token succeeds; with an access token returns 401 generic. Cite: audit `auth_router.py:54-65`.

4. **Donation contribute: service-layer `amount > 0` guard** — files: `rescute-api/app/application/donation_service.py` (lines 19-26) — change: raise `ValueError` when `amount <= 0` before mutating `current_amount` (defense-in-depth; schema `gt=0` at `schemas/donation.py:42` remains) — acceptance: `contribute(id, 0)` and negative raise `ValueError`; positive still increments. Cite: audit `donation_service.py:19-26`.

5. **Upload: magic-byte validation + safe extension + attachment header** — files: `rescute-api/app/adapters/inbound/api/upload_router.py` (lines 20-41); `rescute-api/requirements.txt` (add `filetype`) — change: read bytes first (respecting `_MAX_FILE_SIZE`), sniff real type with `filetype`, allowlist only `{jpeg, png, webp}`, derive the extension from the sniffed type (ignore `file.filename`), reject `image/svg+xml`/HTML/anything not in the allowlist; return response including a note that uploads are served `attachment` (header applied in Unit 10) — acceptance: an SVG or HTML body with `Content-Type: image/svg+xml` is 400; a real PNG succeeds and is stored as `<uuid>.png`. Cite: audit `upload_router.py:20-41`.

6. **Generic error messages (stop leaking internals/upstream)** — files: `rescute-api/app/adapters/outbound/ai/openai_provider.py` (lines 57-60); `rescute-api/app/adapters/inbound/api/ai_care_router.py` (lines 35-36,49-50); `rescute-api/app/adapters/inbound/api/auth_router.py` (line 30); `rescute-api/app/adapters/inbound/api/cat_router.py` (line 49); `rescute-api/app/adapters/inbound/api/donation_router.py` (lines 50,63,84) — change: log full detail via module logger; return fixed generic client messages (e.g. "AI service unavailable", "Invalid request") instead of `str(error)`/upstream body; keep existing HTTP status codes and validation-message semantics where user-facing (e.g. login "Invalid email or password" may stay, but internal `RuntimeError`/upstream bodies must not leak) — acceptance: forcing an upstream OpenAI 500 returns a generic message with no provider body; server logs contain the detail. Cite: audit `openai_provider.py:57-60`, `ai_care_router.py:35-36,49-50`, `cat_router.py:49`, `auth_router.py:29-30`.

7. **Rate-limit infrastructure** — files: `rescute-api/app/rate_limit.py` (new); `rescute-api/app/main.py` (lines 20-29); `rescute-api/requirements.txt` (add `slowapi`) — change: create module-level `limiter = Limiter(key_func=get_remote_address)`; in `create_app` set `app.state.limiter = limiter` and register `RateLimitExceeded` → `_rate_limit_exceeded_handler` (429) — acceptance: app boots; a decorated test route returns 429 after its limit. Cite: audit escalation "Auth-wide rate limiting".

8. **Apply rate limits to auth routes** — files: `rescute-api/app/adapters/inbound/api/auth_router.py` (lines 17,38,54) — change: add `@limiter.limit(...)` to register/login/refresh with `request: Request` params (e.g. login `5/minute`, register `3/minute`, refresh `10/minute`, per IP) — acceptance: the 6th login within a minute from one IP returns 429. Cite: audit `auth_router.py:38-51,17,54`.

9. **Apply rate limits to AI + donation abuse-prone routes** — files: `rescute-api/app/adapters/inbound/api/ai_care_router.py` (lines 27-50); `rescute-api/app/adapters/inbound/api/donation_router.py` (lines 54-69,72-85) — change: add `@limiter.limit(...)` to `/ai-care/ask`, `/ai-care/chat` (e.g. `10/minute` per IP), and `/donations/{id}/contribute`, `/donations/{id}/intent` (e.g. `10/minute`); AI routes remain public (design decision) — acceptance: exceeding the AI limit returns 429; normal single calls unaffected. Cite: audit `ai_care_router.py:27-50`, `donation_router.py:54-69`.

10. **Security-headers middleware + upload hardening headers** — files: `rescute-api/app/main.py` (add middleware; `app.mount` at line 38) — change: add a middleware that sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, and a strict `Content-Security-Policy` on all responses; ensure `/uploads/*` responses additionally carry `Content-Disposition: attachment` and `nosniff` (custom `StaticFiles` subclass or middleware branch on path) — acceptance: `curl -I` on any route shows the headers; `/uploads/<file>` shows `nosniff` + `attachment`. Cite: audit `main.py` (headers), `main.py:38` (uploads).

11. **Conditional localhost CORS** — files: `rescute-api/app/main.py` (lines 10-17) — change: include `http://localhost:3000` / `http://127.0.0.1:3000` in `allow_origins` only when not production (e.g. gate on an `ENVIRONMENT`/`NODE`-style flag or absence of a production marker); always include `FRONTEND_URL` — acceptance: with the production flag set and `FRONTEND_URL` present, localhost origins are absent from the allowlist. Cite: audit `main.py:10-17,26`.

12. **Refresh-token revocation — migration + model + entity** — files: `rescute-api/alembic/versions/004_user_token_version.py` (new, following `003_partner_negotiations.py` style); `rescute-api/app/adapters/outbound/persistence/models.py` (`UserModel` near line 20); `rescute-api/app/domain/entities/user.py` (`User`, lines 8-16) — change: add `token_version INTEGER NOT NULL DEFAULT 0` column + `token_version: int = 0` on the entity and its ORM↔entity mapping in `user_repository.py` (lines ~149,161) — acceptance: `alembic upgrade head` adds the column with default 0; a fetched `User` exposes `token_version`. Cite: audit escalation "revocation/rotation strategy — needs a store".

13. **Wire `ver` into refresh minting/verification + logout endpoint** — files: `rescute-api/app/application/auth_service.py` (mint at 79-81, verify path); `rescute-api/app/adapters/inbound/api/auth_router.py` (refresh 54-65; new `POST /auth/logout`); `rescute-api/app/adapters/outbound/persistence/user_repository.py` (add increment method) — change: refresh tokens embed the user's current `token_version`; `/auth/refresh` rejects a mismatch (401); `POST /auth/logout` (auth-required) increments `token_version` — acceptance: after calling `/auth/logout`, a previously issued refresh token is rejected at `/auth/refresh`. Cite: audit `auth_router.py:54-65`.

14. **CI dependency-audit gate** — files: `.github/workflows/security-audit.yml` (new, repo root) — change: a workflow (on PR + push to `main`) running `pip-audit` against `rescute-api/requirements.txt` and `npm audit --audit-level=high` in `rescute/`; `npm audit` runs non-fatally for the known transitive `postcss` moderate (`--audit-level=high` excludes it) — do **not** `audit fix --force` — acceptance: workflow runs on a PR and fails on a newly introduced high/critical advisory. Cite: audit SCA finding (`package-lock.json`, backend `pip-audit`).

## Open Questions
- **Payment reality:** `contribute` remains a public unverified pledge tally with no gateway. Confirm product accepts that displayed totals are not verified funds; the only real fix is integrating a payment provider (out of scope). Defaulting to "pledge only, rate-limited."
- **Revocation depth:** `token_version` gives global logout / all-sessions revocation but not per-device or reuse-detection rotation. Adequate for hackathon; revisit if multi-device sessions are needed.
- **CSP tightness:** `default-src 'none'` is strict for an API but may block Swagger UI (`/docs`) assets. If interactive docs are needed in the deployed env, relax CSP for `/docs` only.
