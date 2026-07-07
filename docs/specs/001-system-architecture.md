# 001 - Rescute System Architecture

**Status:** Draft
**Date:** 2026-06-24
**Related:** None (initial spec)

---

## 1. Goal

Design and implement "Rescute" -- a cat adoption website and donation hub for cat protectors (NGOs/shelters). Two codebases: a Next.js frontend (`rescute/`) and a FastAPI backend (`rescute-api/`). The system supports three access levels: public visitors, foster applicants (authenticated), and protectors (authenticated). An AI-powered cat care Q&A feature uses a pluggable provider abstraction.

---

## 2. System Overview

```
                         +------------------+
                         |   Browser/Client |
                         +--------+---------+
                                  |
                                  | HTTPS
                                  v
                   +-----------------------------+
                   |     rescute/ (Next.js)       |
                   |     App Router + RSC        |
                   |     Port 3000               |
                   +-------------+---------------+
                                 |
                                 | REST / JSON
                                 v
                   +-----------------------------+
                   |   rescute-api/ (FastAPI)      |
                   |   Hexagonal Architecture     |
                   |   Port 8000                  |
                   +------+----------+----+------+
                          |          |    |
                    +-----+    +-----+    +--------+
                    v          v                   v
              +---------+  +----------+    +-------------+
              |PostgreSQL|  | AI Provider|  | File Storage |
              | (DB)     |  | (OpenAI/  |  | (local/S3)   |
              |          |  |  Claude)  |  |              |
              +---------+  +----------+    +-------------+
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12+, async |
| Database | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 (async) + Alembic migrations |
| Auth | JWT (access + refresh tokens), bcrypt |
| AI | Agnostic provider (OpenAI / Anthropic / etc.) via port |
| Validation | Pydantic v2 (backend), Zod (frontend) |
| HTTP Client | Axios (frontend) |
| State Mgmt | React Context + hooks (no Redux -- hackathon simplicity) |

---

## 3. Backend Architecture (Hexagonal)

### 3.1 Layering

```
+----------------------------------------------------------+
|                    Adapters (Driving)                     |
|   REST API (FastAPI routers)                             |
+----------------------------------------------------------+
|                   Application Layer                      |
|   Use Cases / Application Services                       |
+----------------------------------------------------------+
|                    Domain Layer                           |
|   Entities, Value Objects, Domain Services, Port Ifaces  |
+----------------------------------------------------------+
|                   Adapters (Driven)                       |
|   PostgreSQL Repo, AI Provider, File Storage             |
+----------------------------------------------------------+
```

### 3.2 Domain Layer

#### Entities

| Entity | Key Fields |
|--------|-----------|
| `User` | id, email, hashed_password, role (protector/foster), created_at |
| `ProtectorProfile` | id, user_id, org_name, description |
| `FosterProfile` | id, user_id, full_name, city, phone |
| `Cat` | id, protector_id, name, age_months, sex, city, state, fiv_status, felv_status, castrated, vaccinated, dewormed, health_needs, sociability, energy, playfulness, personality, backstory, photos, created_at |
| `AdoptionApplication` | id, cat_id, applicant_name, applicant_email, applicant_phone, message, accepted_terms, status, created_at |
| `FosterApplication` | id, user_id (foster), existing_pets, compatibility, prior_experience, city, cost_aware, status, created_at |
| `DonationPost` | id, protector_id, title, description, type (financial/item), target_amount, current_amount, active, created_at |
| `Partner` | id, name, description, address, cep, city, state, lat, lng, coupon_code, discount_pct |
| `AIChatMessage` | id, session_id, role, content, created_at |

#### Value Objects

- `Location(city, state, cep, lat?, lng?)`
- `HealthProfile(fiv, felv, castrated, vaccinated, dewormed, health_needs)`
- `PersonalityTraits(sociability: 1-5, energy: 1-5, playfulness: 1-5)`
- `ApplicationStatus` enum: `pending`, `under_review`, `approved`, `rejected`
- `UserRole` enum: `protector`, `foster`
- `DonationType` enum: `financial`, `item`
- `Sex` enum: `male`, `female`

### 3.3 Ports (Interfaces)

#### Input Ports (Use Cases)

```
AuthPort:
  register(email, password, role, profile_data) -> User
  login(email, password) -> TokenPair
  get_current_user(token) -> User

CatPort:
  create_cat(protector_id, cat_data) -> Cat
  update_cat(protector_id, cat_id, cat_data) -> Cat
  delete_cat(protector_id, cat_id) -> None
  list_cats(filters) -> List[Cat]
  get_cat(cat_id) -> Cat

AdoptionPort:
  submit_application(cat_id, applicant_data) -> AdoptionApplication
  list_applications(protector_id) -> List[AdoptionApplication]
  update_application_status(protector_id, app_id, status) -> AdoptionApplication

FosterPort:
  submit_application(user_id, questionnaire) -> FosterApplication
  get_my_applications(user_id) -> List[FosterApplication]
  list_applications(protector_id) -> List[FosterApplication]
  update_application_status(protector_id, app_id, status) -> FosterApplication

DonationPort:
  create_post(protector_id, data) -> DonationPost
  list_posts(filters) -> List[DonationPost]
  get_post(post_id) -> DonationPost

PartnerPort:
  list_partners() -> List[Partner]
  search_partners_by_cep(cep) -> List[Partner]

AICarePort:
  ask_question(question, session_id?) -> AIChatMessage
  list_faq() -> List[FAQItem]
```

#### Output Ports (Driven)

```
UserRepository:
  save(user) -> User
  find_by_email(email) -> User | None
  find_by_id(id) -> User | None

CatRepository:
  save(cat) -> Cat
  find_by_id(id) -> Cat | None
  find_all(filters) -> List[Cat]
  delete(id) -> None
  find_by_protector(protector_id) -> List[Cat]

AdoptionRepository:
  save(app) -> AdoptionApplication
  find_by_id(id) -> AdoptionApplication | None
  find_by_cat(cat_id) -> List[AdoptionApplication]
  find_by_protector_cats(protector_id) -> List[AdoptionApplication]

FosterApplicationRepository:
  save(app) -> FosterApplication
  find_by_id(id) -> FosterApplication | None
  find_by_user(user_id) -> List[FosterApplication]
  find_all() -> List[FosterApplication]

DonationPostRepository:
  save(post) -> DonationPost
  find_by_id(id) -> DonationPost | None
  find_all(filters) -> List[DonationPost]

PartnerRepository:
  find_all() -> List[Partner]
  find_by_location(lat, lng, radius) -> List[Partner]

AIProvider:
  generate_response(prompt, context?) -> str
```

### 3.4 Adapters

| Adapter | Type | Description |
|---------|------|-------------|
| FastAPI Routers | Driving | HTTP REST endpoints, request validation |
| SQLAlchemy Repos | Driven | PostgreSQL persistence implementations |
| AI Adapter | Driven | OpenAI/Anthropic client implementing AIProvider |
| JWT Auth | Driving | Token decode/encode middleware |

### 3.5 Backend Folder Structure

```
rescute-api/
  pyproject.toml
  alembic.ini
  alembic/
    env.py
    versions/
  app/
    main.py                          # FastAPI app factory
    config.py                        # Settings (pydantic-settings)
    dependencies.py                  # DI wiring
    domain/
      entities/
        __init__.py
        user.py                      # User, ProtectorProfile, FosterProfile
        cat.py                       # Cat entity
        adoption.py                  # AdoptionApplication
        foster.py                    # FosterApplication
        donation.py                  # DonationPost
        partner.py                   # Partner
      value_objects.py               # Enums, Location, HealthProfile, etc.
      ports/
        __init__.py
        repositories.py             # All repository interfaces (ABCs)
        ai_provider.py              # AIProvider interface
    application/
      __init__.py
      auth_service.py               # Register, login, token mgmt
      cat_service.py                # Cat CRUD use cases
      adoption_service.py           # Adoption application use cases
      foster_service.py             # Foster application use cases
      donation_service.py           # Donation post use cases
      partner_service.py            # Partner listing use cases
      ai_care_service.py            # AI Q&A use cases
    adapters/
      driving/
        api/
          __init__.py
          router.py                 # Main router aggregator
          auth_router.py
          cat_router.py
          adoption_router.py
          foster_router.py
          donation_router.py
          partner_router.py
          ai_care_router.py
          middleware/
            __init__.py
            auth.py                 # JWT dependency
          schemas/
            __init__.py
            auth.py                 # Request/Response Pydantic models
            cat.py
            adoption.py
            foster.py
            donation.py
            partner.py
            ai_care.py
      driven/
        persistence/
          __init__.py
          database.py               # Async engine + session factory
          models.py                 # SQLAlchemy ORM models (all tables)
          user_repository.py
          cat_repository.py
          adoption_repository.py
          foster_repository.py
          donation_repository.py
          partner_repository.py
        ai/
          __init__.py
          openai_provider.py        # OpenAI implementation
          anthropic_provider.py     # Anthropic implementation (optional)
    tests/
      __init__.py
      conftest.py
      test_auth.py
      test_cats.py
      test_adoption.py
      test_foster.py
```

---

## 4. Frontend Architecture

### 4.1 Design Principles

- Feature-based folder structure (colocation)
- Server Components by default, Client Components only when interactivity is needed
- Shared UI components library (Tailwind)
- API layer abstracted behind service functions
- Auth context for session management
- Simple, hackathon-appropriate -- no over-engineering

### 4.2 Frontend Folder Structure

```
rescute/
  package.json
  tsconfig.json
  next.config.ts
  tailwind.config.ts
  postcss.config.mjs
  .env.local
  public/
    images/
      logo.svg
      hero-banner.jpg
  src/
    app/
      layout.tsx                     # Root layout (header, footer)
      page.tsx                       # Home page
      globals.css
      (public)/
        cats/
          page.tsx                   # Cat listing
          [id]/
            page.tsx                 # Cat profile
        donate/
          page.tsx                   # Donation page
        partners/
          page.tsx                   # Partners listing
        about/
          page.tsx                   # About page
        cat-care/
          page.tsx                   # AI Q&A + FAQ
      (auth)/
        login/
          page.tsx
        register/
          page.tsx
      (protected)/
        foster/
          apply/
            page.tsx                 # Foster application form
          applications/
            page.tsx                 # My foster applications
        dashboard/
          page.tsx                   # Protector dashboard
          cats/
            new/
              page.tsx               # Add cat
            [id]/
              edit/
                page.tsx             # Edit cat
          applications/
            page.tsx                 # View received applications
          donations/
            page.tsx                 # Manage donation posts
            new/
              page.tsx               # Create donation post
    components/
      ui/
        Button.tsx
        Card.tsx
        Input.tsx
        Select.tsx
        Modal.tsx
        Badge.tsx
        Slider.tsx                   # For 1-5 trait scales
        SearchBar.tsx
        FilterBar.tsx
        Navbar.tsx
        Footer.tsx
        HamburgerMenu.tsx
        HeroBanner.tsx
        LoadingSpinner.tsx
      cats/
        CatCard.tsx                  # Card for listing
        CatGallery.tsx               # Photo/video gallery
        CatTraits.tsx                # Sociability/energy/playfulness display
        CatHealthBadges.tsx          # Vaccinated/dewormed/neutered tags
        AdoptionModal.tsx            # Adoption application popup
      foster/
        FosterForm.tsx               # Questionnaire form
        ApplicationStatus.tsx        # Status badge
      donations/
        DonationCard.tsx
        DonationMap.tsx              # Map with partner locations
        CepSearch.tsx                # ZIP code search
      partners/
        PartnerCard.tsx
        CouponBadge.tsx
      ai/
        ChatInput.tsx
        ChatMessage.tsx
        FAQAccordion.tsx
      auth/
        LoginForm.tsx
        RegisterForm.tsx
        RoleSelect.tsx
      dashboard/
        DashboardNav.tsx
        CatForm.tsx                  # Add/edit cat form
        ApplicationList.tsx
        DonationPostForm.tsx
    lib/
      api/
        client.ts                    # Axios instance with interceptors
        auth.ts                      # login, register, refresh
        cats.ts                      # cat CRUD + listing
        adoption.ts                  # submit adoption app
        foster.ts                    # foster app CRUD
        donations.ts                 # donation endpoints
        partners.ts                  # partner listing
        ai-care.ts                   # AI Q&A endpoint
      auth/
        context.tsx                  # AuthContext + AuthProvider
        guard.tsx                    # ProtectedRoute wrapper
        tokens.ts                    # Token storage (localStorage)
      hooks/
        useAuth.ts
        useCats.ts
        useDonations.ts
        usePartners.ts
      types/
        index.ts                     # All TypeScript interfaces/types
      utils/
        format.ts                    # Date formatting, etc.
        validators.ts                # Zod schemas
```

### 4.3 State Management

- **Auth state:** React Context (`AuthProvider`) wrapping the app layout. Stores user, tokens, role. Persists tokens in `localStorage`.
- **Server data:** Fetched in Server Components where possible. Client-side fetches use simple `useState`/`useEffect` hooks (no SWR/React Query for hackathon simplicity).
- **Form state:** Controlled components with local `useState`. Zod for validation.
- **No global store.** Context only for auth. Everything else is prop-drilling or co-located state.

### 4.4 Routing & Auth Guards

| Route | Access | Auth |
|-------|--------|------|
| `/` | Public | None |
| `/cats` | Public | None |
| `/cats/[id]` | Public | None |
| `/donate` | Public | None |
| `/partners` | Public | None |
| `/about` | Public | None |
| `/cat-care` | Public | None |
| `/login` | Public | None |
| `/register` | Public | None |
| `/foster/apply` | Foster only | JWT (foster role) |
| `/foster/applications` | Foster only | JWT (foster role) |
| `/dashboard` | Protector only | JWT (protector role) |
| `/dashboard/cats/new` | Protector only | JWT (protector role) |
| `/dashboard/cats/[id]/edit` | Protector only | JWT (protector role) |
| `/dashboard/applications` | Protector only | JWT (protector role) |
| `/dashboard/donations` | Protector only | JWT (protector role) |
| `/dashboard/donations/new` | Protector only | JWT (protector role) |

Auth guard: a `ProtectedRoute` client component that checks the AuthContext and redirects to `/login` if unauthenticated or unauthorized role.

---

## 5. Data Model

### 5.1 Entity Definitions (with types)

#### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| email | string | unique, not null |
| hashed_password | string | not null |
| role | enum(protector, foster) | not null |
| is_active | boolean | default true |
| created_at | datetime | auto |
| updated_at | datetime | auto |

#### ProtectorProfile
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| user_id | UUID | FK -> User, unique |
| org_name | string | not null |
| description | text | nullable |
| phone | string | nullable |
| city | string | nullable |
| state | string | nullable |

#### FosterProfile
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| user_id | UUID | FK -> User, unique |
| full_name | string | not null |
| phone | string | not null |
| city | string | not null |
| state | string | not null |

#### Cat
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| protector_id | UUID | FK -> User, not null |
| name | string | not null |
| age_months | int | not null |
| sex | enum(male, female) | not null |
| city | string | not null |
| state | string | not null |
| fiv_status | boolean | default false |
| felv_status | boolean | default false |
| castrated | boolean | default false |
| vaccinated | boolean | default false |
| dewormed | boolean | default false |
| health_needs | text | nullable |
| sociability | int (1-5) | not null |
| energy | int (1-5) | not null |
| playfulness | int (1-5) | not null |
| personality | text | nullable |
| backstory | text | nullable |
| photos | string[] | JSON array of URLs |
| is_active | boolean | default true |
| created_at | datetime | auto |
| updated_at | datetime | auto |

#### AdoptionApplication
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| cat_id | UUID | FK -> Cat, not null |
| applicant_name | string | not null |
| applicant_email | string | not null |
| applicant_phone | string | not null |
| message | text | nullable |
| accepted_terms | boolean | not null (must be true) |
| status | enum(pending, under_review, approved, rejected) | default pending |
| created_at | datetime | auto |

#### FosterApplication
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| user_id | UUID | FK -> User (foster), not null |
| existing_pets | text | not null |
| compatibility | text | not null |
| prior_experience | text | not null |
| city | string | not null |
| cost_aware | boolean | not null |
| status | enum(pending, under_review, approved, rejected) | default pending |
| created_at | datetime | auto |

#### DonationPost
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| protector_id | UUID | FK -> User, not null |
| title | string | not null |
| description | text | not null |
| type | enum(financial, item) | not null |
| target_amount | decimal | nullable (financial only) |
| current_amount | decimal | default 0 |
| is_active | boolean | default true |
| created_at | datetime | auto |

#### Partner
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto |
| name | string | not null |
| description | text | nullable |
| address | string | not null |
| cep | string | not null |
| city | string | not null |
| state | string | not null |
| lat | float | nullable |
| lng | float | nullable |
| coupon_code | string | nullable |
| discount_pct | int | nullable |
| is_active | boolean | default true |

### 5.2 Relationships

```
User 1 --- 0..1 ProtectorProfile
User 1 --- 0..1 FosterProfile
User (protector) 1 --- * Cat
Cat 1 --- * AdoptionApplication
User (foster) 1 --- * FosterApplication
User (protector) 1 --- * DonationPost
```

---

## 6. API Endpoints

Base URL: `http://localhost:8000/api/v1`

### 6.1 Auth (`/auth`)

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| POST | `/auth/register` | None | `{email, password, role, profile: {org_name?, full_name?, ...}}` | `{id, email, role, token}` |
| POST | `/auth/login` | None | `{email, password}` | `{access_token, refresh_token, user: {id, email, role}}` |
| POST | `/auth/refresh` | Refresh token | `{refresh_token}` | `{access_token, refresh_token}` |
| GET | `/auth/me` | JWT | -- | `{id, email, role, profile}` |

### 6.2 Cats (`/cats`)

| Method | Path | Auth | Description | Query/Body |
|--------|------|------|-------------|-----------|
| GET | `/cats` | None | List cats (paginated + filtered) | `?page=&limit=&name=&city=&state=&sex=&age_min=&age_max=` |
| GET | `/cats/{id}` | None | Get cat profile | -- |
| POST | `/cats` | Protector | Create cat | Cat fields (multipart for photos) |
| PUT | `/cats/{id}` | Protector (owner) | Update cat | Cat fields |
| DELETE | `/cats/{id}` | Protector (owner) | Soft-delete cat | -- |
| GET | `/cats/my` | Protector | List my cats | -- |

### 6.3 Adoption Applications (`/adoptions`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/adoptions` | None (public) | Submit adoption application. Body: `{cat_id, applicant_name, applicant_email, applicant_phone, message, accepted_terms}` |
| GET | `/adoptions` | Protector | List applications for my cats. Query: `?status=&cat_id=` |
| GET | `/adoptions/{id}` | Protector | Get single application detail |
| PATCH | `/adoptions/{id}/status` | Protector | Update status. Body: `{status}` |

### 6.4 Foster Applications (`/foster`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/foster/applications` | Foster | Submit foster application. Body: questionnaire fields |
| GET | `/foster/applications/my` | Foster | Get my applications |
| GET | `/foster/applications` | Protector | List all foster applications |
| GET | `/foster/applications/{id}` | Protector | Get single application |
| PATCH | `/foster/applications/{id}/status` | Protector | Update status |

### 6.5 Donations (`/donations`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/donations` | None | List active donation posts. Query: `?type=` |
| GET | `/donations/{id}` | None | Get donation post detail |
| POST | `/donations` | Protector | Create donation post |
| PUT | `/donations/{id}` | Protector (owner) | Update donation post |
| DELETE | `/donations/{id}` | Protector (owner) | Deactivate donation post |

### 6.6 Partners (`/partners`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/partners` | None | List all partners |
| GET | `/partners/search` | None | Search by CEP/location. Query: `?cep=&radius=` |

### 6.7 AI Cat Care (`/ai-care`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/ai-care/ask` | None | Ask a question. Body: `{question, session_id?}`. Response: `{answer, session_id}` |
| GET | `/ai-care/faq` | None | Get pre-built FAQ list. Response: `[{question, answer}]` |

---

## 7. Implementation Units

### Phase 1: Project Scaffolding + Core Backend Structure

#### P1-01: Backend project init
- **Description:** Create `rescute-api/` with `pyproject.toml`, dependencies (fastapi, uvicorn, sqlalchemy, alembic, pydantic, pydantic-settings, python-jose, passlib, bcrypt, asyncpg, httpx), basic `app/main.py` with health check.
- **Files:** `rescute-api/pyproject.toml`, `rescute-api/app/__init__.py`, `rescute-api/app/main.py`, `rescute-api/app/config.py`
- **Dependencies:** None
- **LOC:** ~50

#### P1-02: Backend domain value objects + enums
- **Description:** Create enums (UserRole, ApplicationStatus, DonationType, Sex) and value objects in `domain/value_objects.py`.
- **Files:** `rescute-api/app/domain/__init__.py`, `rescute-api/app/domain/value_objects.py`
- **Dependencies:** P1-01
- **LOC:** ~40

#### P1-03: Backend domain entities -- User
- **Description:** Create User, ProtectorProfile, FosterProfile dataclasses in `domain/entities/user.py`.
- **Files:** `rescute-api/app/domain/entities/__init__.py`, `rescute-api/app/domain/entities/user.py`
- **Dependencies:** P1-02
- **LOC:** ~40

#### P1-04: Backend domain entities -- Cat
- **Description:** Create Cat entity dataclass in `domain/entities/cat.py`.
- **Files:** `rescute-api/app/domain/entities/cat.py`
- **Dependencies:** P1-02
- **LOC:** ~35

#### P1-05: Backend domain entities -- Adoption, Foster, Donation, Partner
- **Description:** Create remaining entity dataclasses.
- **Files:** `rescute-api/app/domain/entities/adoption.py`, `rescute-api/app/domain/entities/foster.py`, `rescute-api/app/domain/entities/donation.py`, `rescute-api/app/domain/entities/partner.py`
- **Dependencies:** P1-02
- **LOC:** ~50

#### P1-06: Backend domain ports -- Repository interfaces
- **Description:** Define all repository ABCs (UserRepository, CatRepository, AdoptionRepository, FosterApplicationRepository, DonationPostRepository, PartnerRepository).
- **Files:** `rescute-api/app/domain/ports/__init__.py`, `rescute-api/app/domain/ports/repositories.py`
- **Dependencies:** P1-03, P1-04, P1-05
- **LOC:** ~50

#### P1-07: Backend domain ports -- AI provider interface
- **Description:** Define AIProvider ABC.
- **Files:** `rescute-api/app/domain/ports/ai_provider.py`
- **Dependencies:** P1-01
- **LOC:** ~15

#### P1-08: Backend DB setup -- SQLAlchemy engine + session
- **Description:** Create async engine, session factory, Base model in `adapters/driven/persistence/database.py`.
- **Files:** `rescute-api/app/adapters/__init__.py`, `rescute-api/app/adapters/driven/__init__.py`, `rescute-api/app/adapters/driven/persistence/__init__.py`, `rescute-api/app/adapters/driven/persistence/database.py`
- **Dependencies:** P1-01
- **LOC:** ~35

#### P1-09: Backend ORM models
- **Description:** Create all SQLAlchemy ORM models (users, protector_profiles, foster_profiles, cats, adoption_applications, foster_applications, donation_posts, partners) in `models.py`.
- **Files:** `rescute-api/app/adapters/driven/persistence/models.py`
- **Dependencies:** P1-08, P1-02
- **LOC:** ~120 (exception to 50 LOC -- all table definitions together for cohesion; can split if preferred)

#### P1-10: Alembic init + initial migration
- **Description:** Initialize Alembic with async support, create initial migration for all tables.
- **Files:** `rescute-api/alembic.ini`, `rescute-api/alembic/env.py`, `rescute-api/alembic/versions/001_initial.py`
- **Dependencies:** P1-09
- **LOC:** ~50

#### P1-11: Backend API schemas -- Auth
- **Description:** Create Pydantic request/response schemas for auth endpoints.
- **Files:** `rescute-api/app/adapters/driving/__init__.py`, `rescute-api/app/adapters/driving/api/__init__.py`, `rescute-api/app/adapters/driving/api/schemas/__init__.py`, `rescute-api/app/adapters/driving/api/schemas/auth.py`
- **Dependencies:** P1-02
- **LOC:** ~40

#### P1-12: Backend API router aggregator + CORS
- **Description:** Create main router that includes all sub-routers, configure CORS middleware in `main.py`.
- **Files:** `rescute-api/app/adapters/driving/api/router.py`, update `rescute-api/app/main.py`
- **Dependencies:** P1-01
- **LOC:** ~30

#### P1-13: Frontend project init
- **Description:** Create `rescute/` with Next.js (App Router, TypeScript, Tailwind). Root layout with placeholder header/footer. Home page with hero placeholder.
- **Files:** `rescute/package.json`, `rescute/tsconfig.json`, `rescute/next.config.ts`, `rescute/tailwind.config.ts`, `rescute/postcss.config.mjs`, `rescute/src/app/layout.tsx`, `rescute/src/app/page.tsx`, `rescute/src/app/globals.css`
- **Dependencies:** None
- **LOC:** ~50 (scaffolding via `npx create-next-app`, then adjustments)

#### P1-14: Frontend types definition
- **Description:** Define all TypeScript interfaces/types matching backend entities.
- **Files:** `rescute/src/lib/types/index.ts`
- **Dependencies:** P1-13
- **LOC:** ~50

#### P1-15: Frontend API client setup
- **Description:** Create Axios instance with base URL, interceptors for JWT.
- **Files:** `rescute/src/lib/api/client.ts`
- **Dependencies:** P1-13
- **LOC:** ~35

#### P1-16: Backend dependency injection wiring
- **Description:** Create `dependencies.py` with FastAPI `Depends` factories for DB session, repositories, services.
- **Files:** `rescute-api/app/dependencies.py`
- **Dependencies:** P1-08, P1-06
- **LOC:** ~45

### Phase 2: Auth + Registration

#### P2-01: Backend auth service
- **Description:** Implement `AuthService` with register, login, token creation/verification. Uses bcrypt + python-jose JWT.
- **Files:** `rescute-api/app/application/__init__.py`, `rescute-api/app/application/auth_service.py`
- **Dependencies:** P1-06, P1-02, P1-03
- **LOC:** ~50

#### P2-02: Backend user repository implementation
- **Description:** Implement `UserRepositoryImpl` with SQLAlchemy async queries.
- **Files:** `rescute-api/app/adapters/driven/persistence/user_repository.py`
- **Dependencies:** P1-09, P1-06
- **LOC:** ~50

#### P2-03: Backend JWT auth middleware
- **Description:** Create FastAPI dependency that extracts and validates JWT, returns current user.
- **Files:** `rescute-api/app/adapters/driving/api/middleware/__init__.py`, `rescute-api/app/adapters/driving/api/middleware/auth.py`
- **Dependencies:** P2-01
- **LOC:** ~40

#### P2-04: Backend auth router
- **Description:** Implement `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me` endpoints.
- **Files:** `rescute-api/app/adapters/driving/api/auth_router.py`
- **Dependencies:** P2-01, P2-03, P1-11
- **LOC:** ~50

#### P2-05: Wire auth into main router + DI
- **Description:** Register auth router in main router, add auth service + user repo to DI.
- **Files:** Update `rescute-api/app/adapters/driving/api/router.py`, update `rescute-api/app/dependencies.py`
- **Dependencies:** P2-04, P1-16
- **LOC:** ~20

#### P2-06: Frontend auth context + provider
- **Description:** Create AuthContext with user state, login/logout/register functions, token management.
- **Files:** `rescute/src/lib/auth/context.tsx`, `rescute/src/lib/auth/tokens.ts`
- **Dependencies:** P1-15
- **LOC:** ~50

#### P2-07: Frontend auth API functions
- **Description:** Create API service functions for login, register, refresh, getMe.
- **Files:** `rescute/src/lib/api/auth.ts`
- **Dependencies:** P1-15
- **LOC:** ~35

#### P2-08: Frontend auth guard component
- **Description:** Create `ProtectedRoute` component that checks auth + role and redirects.
- **Files:** `rescute/src/lib/auth/guard.tsx`
- **Dependencies:** P2-06
- **LOC:** ~30

#### P2-09: Frontend login page + form
- **Description:** Login page with email/password form, error handling, redirect on success.
- **Files:** `rescute/src/app/(auth)/login/page.tsx`, `rescute/src/components/auth/LoginForm.tsx`
- **Dependencies:** P2-06, P2-07
- **LOC:** ~50

#### P2-10: Frontend register page + form
- **Description:** Registration page with role selection, conditional fields (protector vs foster), form validation.
- **Files:** `rescute/src/app/(auth)/register/page.tsx`, `rescute/src/components/auth/RegisterForm.tsx`, `rescute/src/components/auth/RoleSelect.tsx`
- **Dependencies:** P2-06, P2-07
- **LOC:** ~50

### Phase 3: Cat CRUD + Listing/Profile

#### P3-01: Backend cat service
- **Description:** Implement `CatService` with CRUD use cases + listing with filters.
- **Files:** `rescute-api/app/application/cat_service.py`
- **Dependencies:** P1-06, P1-04
- **LOC:** ~50

#### P3-02: Backend cat repository implementation
- **Description:** Implement `CatRepositoryImpl` with filter queries (name search, city/state, sex, age range).
- **Files:** `rescute-api/app/adapters/driven/persistence/cat_repository.py`
- **Dependencies:** P1-09, P1-06
- **LOC:** ~50

#### P3-03: Backend cat API schemas
- **Description:** Create Pydantic schemas for cat request/response (CatCreate, CatUpdate, CatResponse, CatListResponse with pagination).
- **Files:** `rescute-api/app/adapters/driving/api/schemas/cat.py`
- **Dependencies:** P1-02
- **LOC:** ~45

#### P3-04: Backend cat router
- **Description:** Implement `/cats` CRUD + listing endpoints.
- **Files:** `rescute-api/app/adapters/driving/api/cat_router.py`
- **Dependencies:** P3-01, P3-03, P2-03
- **LOC:** ~50

#### P3-05: Wire cat into main router + DI
- **Description:** Register cat router, add cat service + repo to DI.
- **Files:** Update `rescute-api/app/adapters/driving/api/router.py`, update `rescute-api/app/dependencies.py`
- **Dependencies:** P3-04, P1-16
- **LOC:** ~15

#### P3-06: Frontend cat API functions
- **Description:** Create API service for listing cats, getting cat by ID.
- **Files:** `rescute/src/lib/api/cats.ts`
- **Dependencies:** P1-15
- **LOC:** ~30

#### P3-07: Frontend shared UI components (Card, Badge, SearchBar, FilterBar)
- **Description:** Create reusable UI primitives used by cat listing.
- **Files:** `rescute/src/components/ui/Card.tsx`, `rescute/src/components/ui/Badge.tsx`, `rescute/src/components/ui/SearchBar.tsx`, `rescute/src/components/ui/FilterBar.tsx`
- **Dependencies:** P1-13
- **LOC:** ~50 each (split as needed)

#### P3-08: Frontend CatCard component
- **Description:** Cat card with name, age, city, main trait, "ready for adoption" badge.
- **Files:** `rescute/src/components/cats/CatCard.tsx`
- **Dependencies:** P3-07, P1-14
- **LOC:** ~40

#### P3-09: Frontend cat listing page
- **Description:** Cat listing page with top banner, filters (age, sex, city/state), search by name, grid of CatCards.
- **Files:** `rescute/src/app/(public)/cats/page.tsx`
- **Dependencies:** P3-06, P3-08, P3-07
- **LOC:** ~50

#### P3-10: Frontend cat traits + health badges components
- **Description:** Components for sociability/energy/playfulness scale (1-5) and health status badges.
- **Files:** `rescute/src/components/cats/CatTraits.tsx`, `rescute/src/components/cats/CatHealthBadges.tsx`
- **Dependencies:** P1-14
- **LOC:** ~40

#### P3-11: Frontend cat profile page
- **Description:** Cat profile with gallery, personality traits, health info, backstory, "I want to adopt" CTA.
- **Files:** `rescute/src/app/(public)/cats/[id]/page.tsx`, `rescute/src/components/cats/CatGallery.tsx`
- **Dependencies:** P3-06, P3-10
- **LOC:** ~50

### Phase 4: Adoption + Foster Applications

#### P4-01: Backend adoption service
- **Description:** Implement `AdoptionService` -- submit application (public), list by protector, update status.
- **Files:** `rescute-api/app/application/adoption_service.py`
- **Dependencies:** P1-06
- **LOC:** ~40

#### P4-02: Backend adoption repository implementation
- **Description:** Implement `AdoptionRepositoryImpl`.
- **Files:** `rescute-api/app/adapters/driven/persistence/adoption_repository.py`
- **Dependencies:** P1-09, P1-06
- **LOC:** ~40

#### P4-03: Backend adoption schemas + router
- **Description:** Pydantic schemas and `/adoptions` endpoints.
- **Files:** `rescute-api/app/adapters/driving/api/schemas/adoption.py`, `rescute-api/app/adapters/driving/api/adoption_router.py`
- **Dependencies:** P4-01, P2-03
- **LOC:** ~50

#### P4-04: Wire adoption into router + DI
- **Description:** Register adoption router and DI.
- **Files:** Update `rescute-api/app/adapters/driving/api/router.py`, update `rescute-api/app/dependencies.py`
- **Dependencies:** P4-03
- **LOC:** ~10

#### P4-05: Frontend adoption modal
- **Description:** Modal with terms & conditions checkbox + contact form (name, email, phone, message). Submits to public adoption endpoint.
- **Files:** `rescute/src/components/cats/AdoptionModal.tsx`, `rescute/src/components/ui/Modal.tsx`, `rescute/src/lib/api/adoption.ts`
- **Dependencies:** P3-11, P1-15
- **LOC:** ~50

#### P4-06: Backend foster service
- **Description:** Implement `FosterService` -- submit (foster role), list own, list all (protector), update status.
- **Files:** `rescute-api/app/application/foster_service.py`
- **Dependencies:** P1-06
- **LOC:** ~40

#### P4-07: Backend foster repository + schemas + router
- **Description:** Repository implementation, Pydantic schemas, and `/foster/applications` endpoints.
- **Files:** `rescute-api/app/adapters/driven/persistence/foster_repository.py`, `rescute-api/app/adapters/driving/api/schemas/foster.py`, `rescute-api/app/adapters/driving/api/foster_router.py`
- **Dependencies:** P4-06, P2-03
- **LOC:** ~50 (combined)

#### P4-08: Wire foster into router + DI
- **Description:** Register foster router and DI.
- **Files:** Update router.py, dependencies.py
- **Dependencies:** P4-07
- **LOC:** ~10

#### P4-09: Frontend foster application page + form
- **Description:** Foster application questionnaire (auth required, foster role). Fields: existing pets, compatibility, experience, city, cost awareness.
- **Files:** `rescute/src/app/(protected)/foster/apply/page.tsx`, `rescute/src/components/foster/FosterForm.tsx`, `rescute/src/lib/api/foster.ts`
- **Dependencies:** P2-08, P1-15
- **LOC:** ~50

#### P4-10: Frontend foster "my applications" page
- **Description:** Page showing foster applicant's own applications with status badges.
- **Files:** `rescute/src/app/(protected)/foster/applications/page.tsx`, `rescute/src/components/foster/ApplicationStatus.tsx`
- **Dependencies:** P4-09
- **LOC:** ~40

### Phase 5: Donations

#### P5-01: Backend donation service + repository + router
- **Description:** Implement DonationService, DonationPostRepositoryImpl, schemas, and `/donations` endpoints.
- **Files:** `rescute-api/app/application/donation_service.py`, `rescute-api/app/adapters/driven/persistence/donation_repository.py`, `rescute-api/app/adapters/driving/api/schemas/donation.py`, `rescute-api/app/adapters/driving/api/donation_router.py`
- **Dependencies:** P1-06, P2-03
- **LOC:** ~50 (service+repo), ~50 (schemas+router)

#### P5-02: Wire donation into router + DI
- **Description:** Register donation router and DI.
- **Files:** Update router.py, dependencies.py
- **Dependencies:** P5-01
- **LOC:** ~10

#### P5-03: Frontend donation page
- **Description:** Donation page with two sections: financial (donation post cards with progress) and item donation (map placeholder + CEP search).
- **Files:** `rescute/src/app/(public)/donate/page.tsx`, `rescute/src/components/donations/DonationCard.tsx`, `rescute/src/lib/api/donations.ts`
- **Dependencies:** P1-15
- **LOC:** ~50

#### P5-04: Frontend CEP search + donation map
- **Description:** CEP/ZIP search component that finds nearby partner addresses for item donation. Simple map display (can use static image or embed for hackathon).
- **Files:** `rescute/src/components/donations/CepSearch.tsx`, `rescute/src/components/donations/DonationMap.tsx`
- **Dependencies:** P5-03
- **LOC:** ~40

### Phase 6: Partners + About

#### P6-01: Backend partner service + repository + router
- **Description:** Implement PartnerService, PartnerRepositoryImpl, schemas, and `/partners` endpoints.
- **Files:** `rescute-api/app/application/partner_service.py`, `rescute-api/app/adapters/driven/persistence/partner_repository.py`, `rescute-api/app/adapters/driving/api/schemas/partner.py`, `rescute-api/app/adapters/driving/api/partner_router.py`
- **Dependencies:** P1-06
- **LOC:** ~40 (service+repo), ~30 (schemas+router)

#### P6-02: Wire partner into router + DI
- **Description:** Register partner router and DI.
- **Files:** Update router.py, dependencies.py
- **Dependencies:** P6-01
- **LOC:** ~10

#### P6-03: Frontend partners page
- **Description:** Partner listing with cards. Coupon/discount badges.
- **Files:** `rescute/src/app/(public)/partners/page.tsx`, `rescute/src/components/partners/PartnerCard.tsx`, `rescute/src/components/partners/CouponBadge.tsx`, `rescute/src/lib/api/partners.ts`
- **Dependencies:** P1-15
- **LOC:** ~40

#### P6-04: Frontend about page
- **Description:** Static about/how-it-works page with institutional text.
- **Files:** `rescute/src/app/(public)/about/page.tsx`
- **Dependencies:** P1-13
- **LOC:** ~30

### Phase 7: AI Cat Care

#### P7-01: Backend AI provider adapter -- OpenAI
- **Description:** Implement `OpenAIProvider` adapter that implements `AIProvider` port. Uses httpx to call OpenAI API with a cat-care system prompt.
- **Files:** `rescute-api/app/adapters/driven/ai/__init__.py`, `rescute-api/app/adapters/driven/ai/openai_provider.py`
- **Dependencies:** P1-07
- **LOC:** ~40

#### P7-02: Backend AI care service
- **Description:** Implement `AICareService` with ask_question (delegates to AI provider) and list_faq (hardcoded FAQ data for now).
- **Files:** `rescute-api/app/application/ai_care_service.py`
- **Dependencies:** P1-07, P7-01
- **LOC:** ~35

#### P7-03: Backend AI care schemas + router
- **Description:** Pydantic schemas and `/ai-care` endpoints (ask, faq).
- **Files:** `rescute-api/app/adapters/driving/api/schemas/ai_care.py`, `rescute-api/app/adapters/driving/api/ai_care_router.py`
- **Dependencies:** P7-02
- **LOC:** ~40

#### P7-04: Wire AI care into router + DI
- **Description:** Register AI care router and DI. Add AI_PROVIDER config setting.
- **Files:** Update router.py, dependencies.py, config.py
- **Dependencies:** P7-03
- **LOC:** ~15

#### P7-05: Frontend cat care page
- **Description:** AI Q&A input field with chat-like response display. FAQ section with accordion dropdowns.
- **Files:** `rescute/src/app/(public)/cat-care/page.tsx`, `rescute/src/components/ai/ChatInput.tsx`, `rescute/src/components/ai/ChatMessage.tsx`, `rescute/src/components/ai/FAQAccordion.tsx`, `rescute/src/lib/api/ai-care.ts`
- **Dependencies:** P1-15
- **LOC:** ~50

### Phase 8: Protector Dashboard

#### P8-01: Frontend dashboard layout + nav
- **Description:** Dashboard page with sidebar/tab navigation (My Cats, Applications, Donations). Protected route (protector role).
- **Files:** `rescute/src/app/(protected)/dashboard/page.tsx`, `rescute/src/components/dashboard/DashboardNav.tsx`
- **Dependencies:** P2-08
- **LOC:** ~40

#### P8-02: Frontend dashboard -- cat management
- **Description:** List protector's cats with add/edit/delete. Cat form component (reused for add + edit).
- **Files:** `rescute/src/app/(protected)/dashboard/cats/new/page.tsx`, `rescute/src/app/(protected)/dashboard/cats/[id]/edit/page.tsx`, `rescute/src/components/dashboard/CatForm.tsx`
- **Dependencies:** P3-06, P8-01
- **LOC:** ~50

#### P8-03: Frontend dashboard -- applications management
- **Description:** View received adoption + foster applications. Status update actions.
- **Files:** `rescute/src/app/(protected)/dashboard/applications/page.tsx`, `rescute/src/components/dashboard/ApplicationList.tsx`
- **Dependencies:** P8-01
- **LOC:** ~50

#### P8-04: Frontend dashboard -- donation post management
- **Description:** List/create donation posts. Donation post form.
- **Files:** `rescute/src/app/(protected)/dashboard/donations/page.tsx`, `rescute/src/app/(protected)/dashboard/donations/new/page.tsx`, `rescute/src/components/dashboard/DonationPostForm.tsx`
- **Dependencies:** P5-03, P8-01
- **LOC:** ~50

### Phase 9: Polish

#### P9-01: Frontend Navbar + HamburgerMenu
- **Description:** Responsive navbar with all nav links. Desktop: full nav. Mobile: hamburger menu. Conditional sign-in/profile/logout.
- **Files:** `rescute/src/components/ui/Navbar.tsx`, `rescute/src/components/ui/HamburgerMenu.tsx`
- **Dependencies:** P2-06
- **LOC:** ~50

#### P9-02: Frontend Footer
- **Description:** Footer component with links, branding.
- **Files:** `rescute/src/components/ui/Footer.tsx`
- **Dependencies:** P1-13
- **LOC:** ~25

#### P9-03: Frontend Home page -- full design
- **Description:** Hero banner with CTAs (adopt, donate, foster). Featured cats section. Brief about section.
- **Files:** Update `rescute/src/app/page.tsx`, `rescute/src/components/ui/HeroBanner.tsx`
- **Dependencies:** P3-06, P9-01
- **LOC:** ~50

#### P9-04: Frontend loading + error states
- **Description:** Loading spinner component. Error boundary or fallback UI.
- **Files:** `rescute/src/components/ui/LoadingSpinner.tsx`, `rescute/src/app/error.tsx`, `rescute/src/app/loading.tsx`
- **Dependencies:** P1-13
- **LOC:** ~30

#### P9-05: Backend seed data script
- **Description:** Script to seed dev database with sample cats, partners, donation posts, and FAQ data.
- **Files:** `rescute-api/scripts/seed.py`
- **Dependencies:** P1-10
- **LOC:** ~50

#### P9-06: Docker Compose for local dev
- **Description:** Docker Compose with PostgreSQL service. Optional: backend + frontend containers.
- **Files:** `docker-compose.yml`
- **Dependencies:** P1-01, P1-13
- **LOC:** ~30

---

## 8. Open Questions

1. **File/image uploads for cat photos:** For hackathon, should we use local file storage or skip uploads entirely and use URL strings? **Decision: Use URL strings (paste image URLs). No file upload for MVP.**
2. **Payment integration for financial donations:** Real payment gateway or placeholder? **Decision: Placeholder/mock for hackathon. Show donation post with progress bar, no real checkout.**
3. **Map provider for item donation:** Google Maps, Leaflet, or static? **Decision: Use a simple embedded map or static list for hackathon. Leaflet if time permits.**
4. **Email notifications on application submission:** Out of scope for hackathon.
5. **i18n:** The UI text is in Portuguese (Brazilian), but code (variables, endpoints, comments) stays in English. Content strings will be in pt-BR.

---

## 9. Summary

**Total implementation units:** 56
**Estimated total LOC:** ~2,200
**Phases:** 9 (ordered by dependency)

The architecture prioritizes cohesion and simplicity appropriate for a hackathon while maintaining clean separation of concerns. The hexagonal backend ensures the domain logic is decoupled from FastAPI and PostgreSQL, making it testable and extensible. The frontend uses Next.js conventions with feature-based organization, avoiding unnecessary abstractions.

Start with Phase 1 (scaffolding) and proceed sequentially. Each unit is independently implementable and verifiable.
