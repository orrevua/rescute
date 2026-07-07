# Rescute Documentation

Project documentation for **Rescute** — a cat adoption and donation platform. The product itself is described in the [main README](../README.md), which also contains setup and testing instructions.

## Contents

- **[SUBMISSION.md](SUBMISSION.md)** — hackathon submission checklist and requirement mapping.

### Design specs (`specs/`)

- **[001 — System Architecture](specs/001-system-architecture.md)** — the founding design document: system overview, hexagonal backend architecture, domain model, API surface, auth model, and the 9-phase implementation plan for both codebases.
- **[002 — Cartoon Design System](specs/002-cartoon-design-system.md)** — the frontend visual language: tokens, components (`cartoon-card`, `cartoon-btn`, `cartoon-input`), and usage rules.
- **[Security Hardening — Backend](specs/security-hardening-backend-spec.md)** / **[Frontend](specs/security-hardening-frontend-spec.md)** — remediation specs produced from the security audit (14 + 8 implementation units, all shipped).

### Security (`security/`)

- **[Full-platform security audit (2026-07-06)](security/2026-07-06-full-audit.md)** — findings across frontend, backend, and deploy config. Every finding was remediated via the hardening specs above; confirmed clean areas include SQL injection, IDOR, and prompt injection.

## Process

The project was built spec-first with a two-agent AI workflow (Architect designs and reviews, Implementer ships one small unit at a time), which is why the documentation above predates and drives the code. The backend repository is [orrevua/rescute-api](https://github.com/orrevua/rescute-api).
