# Security Hardening — Frontend (`rescute`) — Spec

**Status:** Draft
**Date:** 2026-07-06
**Related:** `docs/security/2026-07-06-full-audit.md`, `docs/HANDOFF.md`, sibling spec `docs/specs/security-hardening-backend-spec.md`

> **Next.js caveat:** `rescute/AGENTS.md` states this is a modified Next.js whose APIs may differ from training data. Before implementing the Route Handler / `cookies()` / `next.config` `headers()` units, the Implementer MUST read the relevant guide under `rescute/node_modules/next/dist/docs/` and heed deprecation notices.

## Goal
Remove the frontend attack surface the audit flagged: the dead fake-session landmine, the open image-proxy/SSRF config, missing security headers, and — the escalated item — session tokens sitting in `localStorage` + a JS-readable cookie where any XSS can exfiltrate a 7-day refresh token.

## Context & Current State
- `src/lib/auth/session.ts:4-17` — `getUserSession()` returns a hardcoded `{ id: '123', name: 'User Profile' }` for any non-empty `session-token` cookie and never validates the JWT. Grep confirms it is imported nowhere except itself (`Glob`/`Grep` verified) — dead today, an instant auth-bypass the moment a server component wires it up.
- `next.config.ts:5-21` — `dangerouslyAllowLocalIP: true` (unconditional) and `remotePatterns: [{ protocol:'https', hostname:'**' }]` turn `/_next/image` into an open proxy that can also reach loopback/internal HTTPS from the edge. No `headers()` block.
- `src/lib/auth/tokens.ts:1-21` — access + refresh tokens in `localStorage`; access token mirrored into a non-`httpOnly`, non-`Secure` `session-token` cookie (`tokens.ts:14`).
- `src/lib/api/client.ts:8-16` — axios request interceptor reads `access_token` from `localStorage` and sets the `Authorization: Bearer` header; response interceptor (`:18-28`) clears storage and redirects on 401.
- `src/lib/auth/context.tsx:27-42` — on mount reads `getAccessToken()` from `localStorage`; `login`/`register` call `setTokens(...)` (`:45-62`).
- `src/middleware.ts:9` — gates `/dashboard`,`/foster` purely on presence of the JS-readable `session-token` cookie.
- The backend deploys on Render, the frontend on Vercel — **different registrable domains**. A cookie set by the backend is not visible to Next.js middleware/route handlers running on the Vercel origin. This constraint drives the design below (the frontend, not the backend, owns the httpOnly cookie).

## Proposed Design

### Escalated design decision — token storage (minimal viable httpOnly-cookie flow)
Adopt the standard **in-memory access token + httpOnly refresh cookie** pattern, with the frontend acting as a thin BFF for auth only. Reasoning: it removes the long-lived (7-day) refresh token from all JS-reachable storage — the exact XSS-exfiltration path the audit flags — while leaving the backend's Bearer auth scheme, and every non-auth API call, untouched (minimal blast radius). Because of the cross-origin Vercel/Render split, the httpOnly cookie must be set on the frontend origin by **Next.js Route Handlers**, not by the backend.

Flow:
- **Access token** lives only in a module-level variable in memory (never `localStorage`, never a JS-readable cookie). Lost on full page reload — re-obtained via silent refresh.
- **Refresh token** is stored in an `httpOnly; Secure; SameSite=Lax; Path=/api/auth` cookie set by a frontend Route Handler. Never readable by client JS → XSS cannot exfiltrate it.
- **Route Handlers** (`src/app/api/auth/{login,register,refresh,logout}/route.ts`) proxy to the FastAPI backend, then set/clear the httpOnly refresh cookie and return `{ user, access_token }` (access token in the JSON body → client memory).
- **Silent refresh:** on app load (and on a 401), the client calls `/api/auth/refresh`; the Route Handler reads the httpOnly cookie, calls the backend `/auth/refresh`, rotates the cookie, and returns a fresh access token to memory.
- **CSRF:** the refresh cookie is `SameSite=Lax` and only consumed by same-origin Route Handlers, so cross-site forgery cannot ride it; the backend refresh endpoint additionally validates the `type:"refresh"` claim (backend spec Unit 3). No separate CSRF token needed at this scale.
- **Route gating:** `middleware.ts` switches from the removed `session-token` cookie to presence of the httpOnly `refresh-token` cookie (still a coarse presence check, now not JS-readable).

This depends on the backend refresh token carrying `type:"refresh"` (backend spec Units 2–3) but does **not** require any backend endpoint signature change — the backend still receives `refresh_token` in the request body from the Route Handler.

## Scope
- In scope: delete `session.ts`; `next.config.ts` (`remotePatterns`, `dangerouslyAllowLocalIP`, `headers()`); `tokens.ts`; `client.ts`; `context.tsx`; `middleware.ts`; new `src/app/api/auth/*/route.ts` handlers.
- Out of scope: backend token changes (sibling spec), the `postcss`/`npm audit` CI gate (owned by the shared CI workflow in the backend spec Unit 14), any redesign of non-auth API calls.

## Interfaces / Models / Endpoints
- New Route Handlers (frontend origin, under `/api/auth`):
  - `POST /api/auth/login` → proxies backend `/auth/login`; sets refresh cookie; returns `{ user, access_token }`.
  - `POST /api/auth/register` → proxies backend `/auth/register`; same.
  - `POST /api/auth/refresh` → reads refresh cookie; proxies backend `/auth/refresh`; rotates cookie; returns `{ access_token }` (and `user` if cheap to include, else client re-fetches `/auth/me`).
  - `POST /api/auth/logout` → proxies backend `/auth/logout` (revokes server-side, backend spec Unit 13); clears the refresh cookie.
- Cookie: `refresh-token`, `httpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800`.
- `tokens.ts`: replace `localStorage` API with in-memory `getAccessToken()/setAccessToken()/clearAccessToken()`; remove all `document.cookie`/`localStorage` refresh-token usage.

## Impact Analysis
- **Breaking behaviour:** access token no longer survives a hard reload — the app must silent-refresh on load. If silent refresh is not wired correctly the user appears logged out after refresh. Unit 7 covers this explicitly.
- **`middleware.ts`** must key off the new cookie name or route gating breaks (Unit 8).
- **Non-auth API calls** are unaffected — `client.ts` still sends `Authorization: Bearer <access token>`, only the token's source changes (memory vs `localStorage`).
- **Tests / manual checks:** verify login→reload→still authenticated (silent refresh), logout clears cookie and server-revokes, XSS cannot read the refresh token (`document.cookie` no longer contains it, `localStorage` empty).
- Units 1–3 (dead code, image config, headers) are independent and can land first with near-zero risk.

## Implementation Units
Dependency-ordered. Units 1–3 are low-risk and independent; Units 4–8 form the auth redesign and must land together (or behind a short-lived branch) and **after** backend spec Units 2–3 are merged.

1. **Delete dead fake session** — files: `rescute/src/lib/auth/session.ts` (lines 4-17) — change: delete the module (verified unused via Grep); if any import surfaces during build, replace with a real JWT check rather than resurrecting the fake identity — acceptance: file removed; `next build` / `tsc --noEmit` passes with no unresolved import. Cite: audit `session.ts:4-17`.

2. **Restrict image proxy + gate local-IP to dev** — files: `rescute/next.config.ts` (lines 4-22) — change: replace `hostname: '**'` with the actual known host(s) — the Render API domain (and Vercel-served assets if any); set `dangerouslyAllowLocalIP` to `process.env.NODE_ENV !== 'production'`; keep the `localhost:8000`/`127.0.0.1:8000` `http` patterns only for dev — acceptance: in a production build the config exposes no `hostname:'**'` and `dangerouslyAllowLocalIP` is `false`. Cite: audit `next.config.ts:5-21`.

3. **Frontend security headers** — files: `rescute/next.config.ts` (add `headers()`) — change: add an async `headers()` returning `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, and a `Content-Security-Policy` appropriate for the app (allowing self, the API origin for `connect-src`, and Next inline/style needs) — acceptance: `curl -I` on a page response shows the headers; the app still renders (CSP not over-tight). Consult local Next docs for `headers()` shape. Cite: audit `next.config.ts` (no `headers()`).

4. **Auth Route Handlers (BFF for auth)** — files: `rescute/src/app/api/auth/login/route.ts`, `.../register/route.ts`, `.../refresh/route.ts`, `.../logout/route.ts` (all new) — change: each handler proxies the corresponding backend `/auth/*` endpoint using `NEXT_PUBLIC_API_URL` (server-side), then sets/rotates/clears the `refresh-token` httpOnly cookie (`httpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800`) and returns `{ user?, access_token }` in the JSON body; `refresh` reads the cookie for the backend call; `logout` clears the cookie — acceptance: `POST /api/auth/login` sets an httpOnly `refresh-token` cookie (visible in response `Set-Cookie`, not in `document.cookie`) and returns an access token in the body. Consult local Next docs for Route Handler + `cookies()` API. Cite: audit `tokens.ts:1-21` (escalated).

5. **In-memory token store** — files: `rescute/src/lib/auth/tokens.ts` (lines 1-21) — change: replace `localStorage`/`document.cookie` logic with a module-scoped variable: `getAccessToken()` returns it, `setAccessToken(t)` stores it, `clearAccessToken()` nulls it; remove all refresh-token and `session-token` cookie handling from this file — acceptance: no `localStorage`/`document.cookie` references remain in `tokens.ts`; tokens survive only in memory. Cite: audit `tokens.ts:1-21`.

6. **API client: read memory token + silent-refresh on 401** — files: `rescute/src/lib/api/client.ts` (lines 8-28) — change: request interceptor reads the in-memory access token (Unit 5) instead of `localStorage`; response interceptor, on a first 401, calls `/api/auth/refresh`, stores the new access token, and retries the original request once; on refresh failure, clears the token and redirects to `/login` — acceptance: an expired access token triggers exactly one silent refresh + retry; a genuinely invalid session redirects to `/login`. Cite: audit `client.ts` token handling.

7. **Auth context: silent refresh on load + Route Handler calls** — files: `rescute/src/lib/auth/context.tsx` (lines 27-67) — change: on mount, attempt `/api/auth/refresh` (instead of reading `localStorage`); if it returns an access token, store it and fetch `/auth/me`; `login`/`register` call the new Route Handlers and store the returned access token via `setAccessToken`; `logout` calls `/api/auth/logout` then `clearAccessToken` — acceptance: log in, hard-reload the page, and remain authenticated (silent refresh); logout clears state and cookie. Cite: audit `context.tsx` / `tokens.ts`.

8. **Middleware: gate on httpOnly refresh cookie** — files: `rescute/src/middleware.ts` (line 9) — change: replace `request.cookies.get('session-token')` with `request.cookies.get('refresh-token')` for the `isLoggedIn` check — acceptance: with no `refresh-token` cookie, `/dashboard` redirects to `/login`; after login it does not. Cite: audit `session.ts`/`tokens.ts` cookie usage + `middleware.ts:9`.

## Open Questions
- **Cookie `Path` scope:** `Path=/api/auth` limits the cookie to auth Route Handlers (minimal exposure). If a future server component needs the refresh token for SSR data fetching, widen to `/`. Defaulting to the narrow path.
- **`user` in refresh response:** whether `/api/auth/refresh` returns the `user` object or the client re-fetches `/auth/me` after refresh. Defaulting to a `/auth/me` re-fetch to avoid duplicating user-serialization logic in the Route Handler; revisit if it adds a noticeable load flash.
- **CSP strictness vs. Next inline runtime:** the exact `script-src`/`style-src` needed depends on this modified Next build's inline usage; start permissive-but-bounded (`'self'` + required inline hashes/nonces) and tighten after verifying the app renders.
