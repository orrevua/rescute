# Rescute Documentation

Project documentation for **Rescute** — a cat adoption and donation platform. The product itself is described in the [main README](../README.md), which also contains setup, architecture, and testing instructions.

## Contents

- **[SUBMISSION.md](SUBMISSION.md)** — hackathon submission checklist and requirement mapping.

A full-platform security audit (frontend, backend, deploy config) was performed and every finding remediated before submission — hardening includes typed JWTs with revocation, httpOnly-cookie auth, rate limiting, CSP/security headers, upload content validation, and dependency-audit CI in both repos.

## Process

The project was built spec-first with a two-agent AI workflow (Architect designs and reviews, Implementer ships one small unit at a time). The backend repository is [orrevua/rescute-api](https://github.com/orrevua/rescute-api).
