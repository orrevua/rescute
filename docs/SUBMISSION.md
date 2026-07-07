# Hackathon Submission Checklist

Submission period: June 24 – July 7, 2026. All code in both repos was written during this period (verifiable via git history in [orrevua/rescute](https://github.com/orrevua/rescute) and [orrevua/rescute-api](https://github.com/orrevua/rescute-api)).

## Requirement mapping

| Requirement | Where it's satisfied |
|---|---|
| Installable & runnable consistently | README "Run locally" in both repos (Docker Postgres, `.env.example`, migrations, seed) + deployed app (Vercel + Render) |
| English submission materials | Both READMEs, this doc, and all code/comments are English; UI is pt-BR by design (documented in README) |
| Testing instructions + credentials | README → "Testing instructions (for judges)"; seeded account `protetor@rescute.app` / `Rescute123!` |
| Free to access/test | No payment gateway; public deploy is free to use; local setup uses only free tooling |
| No trademarks/copyrighted music in video | ⚠️ Check the demo video before upload |

## Before submitting — fill in / verify

- [ ] **Live URLs**: add the deployed Vercel URL and Render API URL to both READMEs (currently local-setup only).
- [ ] **Neon migration**: run `alembic upgrade head` against the production DB *before* deploying the latest backend (the new `token_version` column is required for login).
- [ ] **Seed the production DB** (`python -m scripts.seed` against Neon) so the judge test account exists in the live app.
- [ ] **Verify Render env vars**: `ENVIRONMENT=production`, `FRONTEND_URL=<vercel url>`, `AI_PROVIDER_KEY` set.
- [ ] **Demo video**: English narration (or English subtitles), no third-party music/trademarks, shows the judge walkthrough from the README.
- [ ] **Kiro Track**: only opt in if Kiro was actually used — this project has no `.kiro` folder (it was built with a Claude Code Architect/Implementer agent workflow, documented in `docs/` specs and handoffs). Do **not** claim Kiro usage.

## Submission form content (suggested)

**One-liner:** Rescute — a cat adoption & donation platform connecting independent cat protectors with adopters, foster homes, and donors, with an AI cat-care assistant.

**How it was built:** Next.js 16 / React 19 / TypeScript / Tailwind 4 frontend on Vercel; FastAPI (hexagonal architecture) + PostgreSQL backend on Render/Neon; OpenAI-powered care chat; spec-driven development with a two-agent (Architect/Implementer) AI workflow, including a full security audit and remediation pass (see `docs/security/` and `docs/specs/`).
