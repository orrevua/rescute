# Rescute Documentation

Project documentation for **Rescute** — a cat adoption and donation platform. The product itself is described in the [main README](../README.md), which also contains setup, architecture, and testing instructions.

## Contents

- **[SUBMISSION.md](SUBMISSION.md)** — hackathon submission checklist and requirement mapping.
- **[security/2026-07-06-full-audit.md](security/2026-07-06-full-audit.md)** — full-platform security audit (frontend, backend, deploy config). Every finding was remediated before submission; confirmed clean areas include SQL injection, IDOR, and prompt injection.

## Process

The project was built spec-first with a two-agent AI workflow (Architect designs and reviews, Implementer ships one small unit at a time). The backend repository is [orrevua/rescute-api](https://github.com/orrevua/rescute-api).
