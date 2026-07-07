# Rescute 🐾

**Rescute** is a cat adoption and donation platform that connects independent cat protectors (NGOs, shelters, and rescuers) with adopters, foster homes ("lar temporário"), and donors — plus an AI-powered cat-care assistant for anyone with questions about caring for a cat.

> **Note for judges:** the product UI is in Brazilian Portuguese (pt-BR), the language of its target audience. All documentation, code, and testing instructions are in English. Full testing instructions are below.

- **Live app:** https://rescute.vercel.app
- **Live API (Swagger docs):** https://rescute-api.onrender.com/docs
- **Backend repository:** [orrevua/rescute-api](https://github.com/orrevua/rescute-api) (FastAPI + PostgreSQL)
- **This repository:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4

> The API is hosted on Render's free tier — the first request after idle may take ~1 minute to cold-start.

## What it does

Cat protectors in Brazil are mostly independent volunteers with no tooling: cats are advertised in WhatsApp statuses, donations tracked in notebooks. Rescute gives them one place to:

- **Publish cats for adoption** with photos, health status (vaccinated/dewormed/neutered), and personality traits (sociability, energy, playfulness)
- **Receive adoption and foster-home applications** from interested visitors
- **Post donation needs** (financial or supplies) and collect public pledges
- **List partner clinics and stores** offering discounts to adopters
- **Track everything** from a protector dashboard

Visitors can browse and filter cats, apply to adopt or foster, pledge donations, and ask the **AI cat-care assistant** anything about feline care — no account needed to browse or ask questions.

### Access levels

| Role | What they can do |
|---|---|
| Public visitor | Browse cats, view partners and donation posts, pledge donations, use the AI care chat |
| Authenticated user | Apply to adopt or foster a cat |
| Protector | Everything above + manage cats, donation posts, partners, applications, and dashboard |

## Architecture

```
┌────────────────────┐        ┌─────────────────────┐        ┌────────────┐
│  Next.js frontend   │  REST  │  FastAPI backend     │  SQL   │ PostgreSQL │
│  (Vercel)           │ ─────► │  (Render, hexagonal  │ ─────► │ (Neon)     │
│  App Router, RSC    │        │  ports & adapters)   │        └────────────┘
│  Route Handlers     │        │                      │  HTTPS ┌────────────┐
│  (httpOnly cookies) │        │  AI care service ────┼──────► │ OpenAI API │
└────────────────────┘        └─────────────────────┘        └────────────┘
```

- **Auth:** JWT access token kept in memory only; httpOnly refresh cookie set by Next.js Route Handlers (`src/app/api/auth/*`) that proxy the backend — no tokens in `localStorage`. Server-side revocation via token versioning.
- **Security:** rate limiting, security headers + CSP on both tiers, upload magic-byte validation, dependency-audit CI on both repos. A full security audit and remediation was performed (see `docs/` in each repo).

## Run locally

Prerequisites: Node.js 22+, Python 3.12+, Docker (for Postgres), Git.

### 1. Backend

Follow the [rescute-api README](https://github.com/orrevua/rescute-api#local-setup) — in short: start Postgres via Docker, `pip install -r requirements.txt`, create `.env` from `.env.example`, run `alembic upgrade head` and `python -m scripts.seed`, then `uvicorn app.main:app --reload --port 8000`.

### 2. Frontend (this repo)

```bash
git clone https://github.com/orrevua/rescute.git
cd rescute
npm install

# Point at the local backend
echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1 > .env.local

npm run dev
```

Open http://localhost:3000.

## Testing instructions (for judges)

Test on the live app at **https://rescute.vercel.app** (no setup needed) or locally via the steps above.

**Test account** (created by the backend seed script — a protector managing a cat named Luna):

- **Email:** `protetor@rescute.app`
- **Password:** `Rescute123!`

Suggested walkthrough:

1. **Home page** — browse without logging in; open the cat listing ("Adotar") and view Luna's profile with health/personality details.
2. **AI care chat** — ask a cat-care question (e.g. "Com que frequência devo vacinar meu gato?" or in English — the assistant answers either way). No login required.
3. **Donations** — open the donation posts ("Doar") and make a pledge to "Ração para o inverno".
4. **Register a new account** — sign up as a regular user and submit an adoption or foster application for Luna.
5. **Protector experience** — log in with the test account above; visit the dashboard, add a new cat with a photo upload, create a donation post, and review incoming applications.
6. Log out ("Sair") — this revokes the refresh token server-side.

Everything is free to test; no payment gateway exists (donation amounts are public pledges, not processed charges).

## Repository layout

```
src/
  app/           # App Router pages + API Route Handlers (auth cookie proxy)
  components/    # UI components (Tailwind 4)
  lib/
    api/         # axios client with silent-refresh interceptor
    auth/        # auth context + in-memory token store
  middleware.ts  # route gating via refresh-token cookie
```

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm start` — production build and serve
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check

## Team

Built for the hackathon (June 24 – July 7, 2026) by **Felipe França** (development) and **Xuliana** (product design — all screens and feature flows). All code was written during the submission period.
