# Hackathon Submission Checklist

Submission period: June 24 – July 7, 2026. All code in both repos was written during this period (verifiable via git history in [orrevua/rescute](https://github.com/orrevua/rescute) and [orrevua/rescute-api](https://github.com/orrevua/rescute-api)).

## Requirement mapping

| Requirement | Where it's satisfied |
|---|---|
| Installable & runnable consistently | README "Run locally" in both repos (Docker Postgres, `.env.example`, migrations, seed) + deployed app (Vercel + Render) |
| English submission materials | UI, both READMEs, this doc, and all code/comments are in English |
| Testing instructions + credentials | README → "Testing instructions (for judges)"; seeded account `protetor@rescute.app` / `Rescute123!` |
| Free to access/test | No payment gateway; public deploy is free to use; local setup uses only free tooling |
| No trademarks/copyrighted music in video | ⚠️ Check the demo video before upload |

## Before submitting — fill in / verify

- [x] **Live URLs**: added to both READMEs — https://rescute.vercel.app and https://rescute-api.onrender.com.
- [x] **Neon migration + seed**: the API now runs `alembic upgrade head` and ensures the judge demo account on startup (rescute-api `46d413c`). Verified live: login with the judge account returns 200 through both the API and the Vercel frontend (httpOnly refresh cookie set).
- [x] **Demo video**: English narration (or English subtitles), no third-party music/trademarks, shows the judge walkthrough from the README.
- [ ] **Kiro Track**: only opt in if Kiro was actually used — this project has no `.kiro` folder (it was built with a Claude Code Architect/Implementer agent workflow, documented in `docs/` specs and handoffs). Do **not** claim Kiro usage.

## Submission form content (suggested)

**One-liner:** Rescute — a cat adoption & donation platform connecting independent cat protectors with adopters, foster homes, and donors, with an AI cat-care assistant.

**How it was built:** Next.js 16 / React 19 / TypeScript / Tailwind 4 frontend on Vercel; FastAPI (hexagonal architecture) + PostgreSQL backend on Render/Neon; OpenAI-powered care chat; spec-driven development with a two-agent (Architect/Implementer) AI workflow, including a full security audit and remediation pass (see `docs/security/` and `docs/specs/`).
