# RentReady V1 Architecture Document
**Issue:** REN-633 | **Author:** CTO | **Date:** 2026-05-02
**Status:** Approved — living reference document for the engineering team

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│  Next.js 15 App Router (React Server Components)         │
│  Tailwind CSS v4 + shadcn/ui + Radix Primitives          │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────┐
│                   EDGE / CDN (Vercel)                    │
│  • Static assets from edge                               │
│  • Sentry error tunnel (/api/sentry-error)               │
│  • Security headers (CSP, HSTS, X-Frame-Options)        │
│  • x-robots-tag: noindex on /dashboard/* and /portal/*  │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│              APPLICATION (Next.js Standalone)            │
│  Node.js 20 / Single Docker container / Vercel serverless │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Route Handler│  │ Server       │  │ Server Actions  │  │
│  │ /api/*      │  │ Components   │  │ /lib/actions/* │  │
│  │ (REST API)  │  │ (RSC)        │  │ (Form mutations)│  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                   LIBRARY LAYER                      │  │
│  │ auth-server.ts │ prisma.ts │ quittance-generator.tsx│  │
│  │ ai-sdk         │ stripe.ts │ bail-pdf-generator.tsx │  │
│  │ resend         │ redis     │ irl-calculator.ts     │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
         ┌───────────────┼─────────────────────┐
         ▼               ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐
│  PostgreSQL   │  │    Redis      │  │   MinIO / S3        │
│  (pgbouncer)  │  │  Sessions /   │  │   Documents / PDFs  │
│  Prisma ORM   │  │  Cache / Rate │  │   receipts / photos  │
└───────────────┘  └───────────────┘  └─────────────────────┘
```

### 1.2 Technology Stack Summary

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Frontend** | Next.js App Router | 15.x | RSC by default, minimal client JS |
| **Styling** | Tailwind CSS v4 + shadcn/ui | latest | CSS-first config, Radix primitives |
| **Database** | PostgreSQL 16 + Prisma | 7.x | ACID for financial data |
| **Auth** | Better Auth | 1.5.6 | Session-based, magic links for tenants |
| **PDF Gen** | @react-pdf/renderer | latest | Factur-X French invoice standard |
| **Storage** | MinIO (dev) / S3 (prod) | — | Pre-signed URLs for tenant access |
| **Email** | Resend | latest | React email templates, bounce webhooks |
| **Payments** | Stripe | latest | Subscriptions + webhook + webhook idempotency |
| **AI** | OpenAI via @ai-sdk/openai | latest | Lease analysis, rent drafts, summarization |
| **Hosting** | Vercel (primary) + Docker | — | Zero-config CI/CD, edge network for France |
| **Monitoring** | Sentry | latest | APM + error tracking + source maps |
| **Rate Limiting** | Custom + Redis | — | Per-tenant rate limits on API routes |

### 1.3 URL Structure

```
/                          → Marketing homepage (indexable)
/pricing                   → Pricing page (indexable)
/features                  → Feature pages (indexable)
/gestion-locative           → SEO content (indexable)
/blog                      → Blog index (indexable)
/blog/[slug]               → Blog articles (indexable)
/glossaire-immobilier      → Glossary (indexable)
/guides                    → SEO guides (indexable)
/outils                    → Free tools index (indexable)
/outils/[slug]             → Individual tool pages (indexable)
/templates                 → Template library (indexable)
/templates/[slug]          → Individual template (indexable)
/bail                      → Lease info (indexable)
/quittances                → Receipt info (indexable)
/maintenance               → Maintenance info (indexable)
/comparatif                → Comparison page (indexable)
/locations                  → Locations directory (indexable)
/demo                      → Demo request (indexable)
/mentions-legales          → Legal (indexable)
/politique-confidentialite → Privacy (indexable)
/cgu                       → Terms (indexable)
/login                     → Auth (noindex)
/register                  → Auth (noindex)
/dashboard/*               → App routes (noindex, auth required)
/portal/*                  → Tenant portal (noindex, token auth)
/api/*                     → API routes (noindex)
```

### 1.4 Deployment Topology

- **Vercel**: Primary hosting for Next.js frontend + serverless functions
- **PostgreSQL**: Neon (serverless Postgres) or self-hosted Docker
- **Redis**: Upstash (serverless Redis) for sessions and rate limiting
- **MinIO**: Local dev / Docker; S3-compatible for document storage
- **Docker**: `docker-compose.yml` for local dev parity with production
- **CI/CD**: GitHub Actions → Vercel preview deploys on PR, production on merge to main

---

## 2. Data Model

### 2.1 Entity Relationship Summary

```
User (Bailleur)
  ├── Property (1:N) — properties they own
  │     ├── Unit (1:N) — units within a property
  │     ├── Lease (1:N) — active/terminated leases
  │     │     ├── Transaction (1:N) — rent payments
  │     │     ├── Charge (1:N) — regularizable charges
  │     │     └── Guarantor (1:1) — lease guarantor
  │     ├── MaintenanceTicket (1:N)
  │     └── Expense (1:N) — owner-side expenses
  ├── Tenant (1:N) — tenants across all properties
  │     └── Lease (1:N) — leases for this tenant
  │     └── MaintenanceTicket (1:N)
  │     └── Conversation (1:1 per lease) ←→ User
  │           └── Message (1:N)
  ├── Transaction (1:N)
  ├── Document (1:N)
  ├── BankConnection (1:N)
  │     └── BankWebhookEvent (1:N)
  ├── Expense (1:N)
  ├── Reminder (1:N)
  ├── Notification (1:N)
  ├── AuditLog (1:N)
  └── OrganizationMember (1:N) — future multi-user orgs
```

### 2.2 Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Soft delete on Property** | `deletedAt` nullable | Preserves referential integrity; dashboards filter by `deletedAt IS NULL` |
| **Decimal for money** | Prisma `Decimal` type | Avoids floating-point rounding errors in financial calculations |
| **Session auth** | Better Auth + Redis | Session tokens stored in Redis; magic links for tenants via `TenantAccessToken` |
| **Document storage** | S3/MinIO + `fileUrl` in DB | Documents are immutable after upload; URL points to pre-signed S3 link |
| **Open Banking prep** | `BankConnection` + `BankWebhookEvent` | Bridge/Powens integration scaffolded; not active in V1 |
| **Lease-Conversation** | `@unique([leaseId])` | One conversation per lease; prevents duplicate threads |
| **Transaction status enum** | `PENDING / PARTIAL / PAID / LATE / CANCELLED` | Supports partial payments; `LATE` computed on read (dueDate + grace period) |
| **Stripe webhook idempotency** | `StripeWebhookEvent.stripeEventId UNIQUE` | Prevents duplicate processing on Stripe retry |
| **Maintenance tickets** | Tenant-facing via portal | Tenants submit via magic-link portal; landlords manage in dashboard |

### 2.3 Index Strategy

All indexes defined in Prisma schema (`@@index`). Key indexes:
- `(userId, deletedAt)` on Property — property list queries
- `(userId, status)` on Lease — active lease queries, dashboard
- `(userId, status, paidAt)` on Transaction — collection dashboard
- `(userId, status, dueDate)` on Transaction — overdue detection
- `(userId, leaseId, dueDate)` on Transaction — per-lease payment history
- `(tenantId)` on MaintenanceTicket — tenant portal queries
- `(userId)` on Notification — user notification inbox

### 2.4 What's NOT in V1 (Planned for V2+)

| Model | Status | Notes |
|---|---|---|
| `Organization` + `OrganizationMember` | V2 | Multi-user teams, role assignments per org |
| `Guarantor` (full model) | V2 | Currently a bare relation on Lease; full guarantor details TBD |
| `Reminder` (scheduled) | V2 | Cron job reminders not yet implemented |
| `Invoice` (French Facture) | V2 | Quittances are receipts; Factures are for professionals |
| Open Banking (`BankConnection`) | V2 | Schema exists; Bridge/Powens integration not wired up |
| AI features (full) | V2 | SDK wired up; `ai/summarize-maintenance` and `ai/monthly-summary` routes are empty stubs |

---

## 3. Authentication & Authorization

### 3.1 How Auth Works

**Landlords/Owners** → Better Auth session-based auth
- Email + password OR OAuth (Google)
- Session cookie: `better-auth.session_token` (HttpOnly, Secure, SameSite=Lax)
- Sessions stored in Redis with configurable TTL (default: 30 days)
- Email verification required before full access

**Tenants** → Magic link portal access
- Landlord generates a `TenantAccessToken` for a tenant (or tenant self-registers)
- Token: 64-char random string stored in `TenantAccessToken` table
- Tenant visits `/portal/{token}` to access their lease, quittances, maintenance tickets
- No password for tenants; token-based access with optional expiry

### 3.2 Role Model

| Role | Who | Access |
|---|---|---|
| **LANDLORD** | Property owner | Own properties, units, leases, tenants, transactions, payments |
| **TENANT** | Renter | Own lease, quittances, maintenance requests via portal |
| **ADMIN** | Internal | Not implemented in V1; future support/admin panel |

Row-level security is enforced at the application layer (Prisma queries always include `userId` filter for landlord resources; `tenantId` filter for tenant portal resources). No middleware-level row security in V1.

### 3.3 Auth Middleware Flow

```
Request → Middleware (middleware.ts)
  ├── Check session cookie: better-auth.session_token
  ├── If no token + private route → redirect /login?callbackUrl=...
  ├── If token + /login or /register → redirect /dashboard
  ├── If tenant portal path (/portal/{token}) → validate TenantAccessToken
  └── Attach user context to request headers for API routes
```

---

## 4. API Architecture

### 4.1 REST Conventions

All API routes live in `src/app/api/`.

**Request/Response format**: JSON
**Error format**:
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Human-readable message",
  "details": [{ "field": "email", "message": "Invalid email format" }]
}
```

**Status codes**: 200 (success), 201 (created), 400 (validation), 401 (unauthenticated), 403 (forbidden), 404 (not found), 500 (server error)

### 4.2 API Route Map

```
Authentication
  POST /api/auth/[...all]     → Better Auth handlers (login, register, logout, session)

Properties
  GET    /api/properties       → List user's properties (filter: type, city)
  POST   /api/properties       → Create property
  GET    /api/properties/[id]  → Get single property
  PATCH  /api/properties/[id]  → Update property
  DELETE /api/properties/[id]  → Soft-delete property

Units
  GET    /api/properties/[id]/units     → List units for a property
  POST   /api/properties/[id]/units     → Create unit
  PATCH  /api/units/[id]               → Update unit
  DELETE /api/units/[id]               → Delete unit

Tenants
  GET    /api/tenants           → List user's tenants
  POST   /api/tenants           → Create tenant
  GET    /api/tenants/[id]      → Get single tenant
  PATCH  /api/tenants/[id]      → Update tenant
  DELETE /api/tenants/[id]      → Archive tenant

Leases
  GET    /api/leases            → List leases (filter: status, propertyId, tenantId)
  POST   /api/leases            → Create lease
  GET    /api/leases/[id]       → Get single lease
  PATCH  /api/leases/[id]       → Update lease
  POST   /api/leases/[id]/documents → Upload lease PDF

Payments / Transactions
  GET    /api/payments          → List transactions (filter: status, leaseId, dateRange)
  POST   /api/payments          → Record payment
  GET    /api/payments/[id]     → Get payment
  PATCH  /api/payments/[id]      → Update payment
  GET    /api/payments/[id]/receipt → Download quittance PDF

Guarantors
  GET/POST/PATCH/DELETE /api/leases/[id]/guarantor

Maintenance
  GET    /api/maintenance       → List tickets (filter: status, propertyId)
  POST   /api/maintenance        → Create ticket (tenant-facing)
  PATCH  /api/maintenance/[id]  → Update ticket status (landlord)
  POST   /api/maintenance/[id]/attachments → Upload photos

Communications
  GET    /api/communications     → List conversations
  POST   /api/communications     → Send message
  GET    /api/communications/[id]/messages → Get messages

Documents
  GET    /api/documents         → List user's documents
  POST   /api/documents         → Upload document
  GET    /api/documents/[id]    → Get document
  DELETE /api/documents/[id]    → Delete document

Dashboard
  GET    /api/dashboard/summary → Aggregated KPIs (occupancy, revenue, overdue)

AI (stubs — not wired in V1)
  POST /api/ai/summarize-maintenance
  POST /api/ai/monthly-summary

Webhooks
  POST /api/webhooks/stripe     → Stripe subscription events
  POST /api/webhooks/bank       → Open banking events (Bridge/Powens — V2)

Health
  GET  /api/health              → Health check (returns DB connectivity)

Stripe
  POST /api/stripe/webhook       → Main Stripe webhook receiver
  GET  /api/stripe/portal       → Create customer portal session
  POST /api/stripe/checkout      → Create checkout session
```

### 4.3 API Documentation

OpenAPI spec lives at: `src/app/api/openapi.json` (generated) and `docs/API_OPENAPI_SPEC.yaml`

### 4.4 Error Response Format

```typescript
// Standard error shape used across all API routes
interface ApiError {
  error: string;        // Machine-readable error code (e.g., "VALIDATION_ERROR")
  message: string;      // Human-readable message
  details?: Array<{     // Optional field-level errors
    field: string;
    message: string;
  }>;
}
```

---

## 5. Frontend Architecture

### 5.1 Next.js App Router Structure

```
src/app/
├── (marketing)/          → Route group: public marketing pages (indexable)
│   ├── page.tsx          → Homepage
│   ├── pricing/
│   ├── features/
│   ├── blog/[slug]/
│   ├── outils/[slug]/
│   ├── templates/[slug]/
│   ├── guides/
│   ├── glossaire-immobilier/
│   ├── bail/
│   ├── quittances/
│   └── ...
│
├── (dashboard)/          → Route group: authenticated app (noindex)
│   ├── layout.tsx         → Dashboard layout (sidebar nav)
│   ├── dashboard/
│   ├── properties/
│   ├── leases/
│   ├── tenants/
│   ├── maintenance/
│   ├── billing/
│   ├── fiscal/
│   └── expenses/
│
├── portal/[token]/       → Tenant portal (noindex, token-auth)
│   ├── leases/
│   ├── quittances/
│   └── maintenance/
│
├── api/                  → REST API route handlers
├── login/
└── register/
```

### 5.2 Component Library

- **shadcn/ui** — base component library (buttons, dialogs, forms, etc.)
- **Radix Primitives** — accessible low-level primitives
- **Tailwind CSS v4** — utility-first styling with CSS-variable-based design tokens
- **Lucide React** — consistent icon set
- **Recharts** — dashboard charts
- **date-fns** — date formatting and calculations
- **next/image** — optimized images with AVIF/WebP

### 5.3 State Management

| Scenario | Approach | Notes |
|---|---|---|
| Server data fetching | Server Components + Prisma | RSC default; no client fetch for data |
| Form mutations | Server Actions (`/lib/actions/`) | Progressive enhancement; useActionState for pending states |
| Client-side interactions | React hooks (`useState`, `useReducer`) | Minimal; mostly for UI toggles |
| Global UI state | React Context | Auth session, theme (if needed) |
| Dashboard analytics | Client Components + SWR/fetch | Data changes frequently; real-time feel |

### 5.4 Key Pages

| Page | Route | Notes |
|---|---|---|
| Homepage | `/` | Hero + features + social proof + CTA |
| Property list | `/dashboard/properties` | Cards/table with occupancy status |
| Property detail | `/dashboard/properties/[id]` | Overview + units + leases + financials |
| Lease detail | `/dashboard/leases/[id]` | Lease terms + payment history + documents |
| Tenant portal | `/portal/[token]` | Tenant-facing: lease, receipts, maintenance |
| Marketing tools | `/outils/[slug]` | Free calculators (IRL, rendement, etc.) |
| Template pages | `/templates/[slug]` | Downloadable French legal templates |
| Blog | `/blog/[slug]` | Articles with FAQ schema, related articles |

---

## 6. SEO Architecture

### 6.1 Marketing vs. App Separation

```
Public (indexable)          Private (noindex)
──────────────────────────  ──────────────────────────
(marketing) route group     (dashboard) route group
/tools/[slug]               /portal/[token]
/templates/[slug]           /api/*
/blog/[slug]                /login
/glossaire-immobilier       /register
/bail, /quittances, etc.
```

Enforced in middleware:
- `x-robots-tag: noindex` on `/dashboard/*` and `/portal/*`
- Auth gate on all non-public paths

### 6.2 Programmatic Page Generation

Tools and templates are generated as static pages at build time or ISR:
- `/outils/calculateur-irl`, `/outils/calculateur-rendement`, etc.
- `/templates/bail-location-vide`, `/templates/quittance-loyer`, etc.

Slug → markdown content → React component (via `react-markdown`).

### 6.3 Schema Markup

| Page Type | Schema Type | Purpose |
|---|---|---|
| Tool pages | `SoftwareApplication` + `FAQPage` | Rich results for calculators |
| Template pages | `HowTo` + `DownloadUrl` | Step-by-step + direct download |
| Blog articles | `Article` + `FAQPage` | NewsArticle schema |
| Homepage | `WebApplication` | Sitelinks search box |
| Pricing | `SoftwareApplication` | Price range + offer |

### 6.4 Sitemap Strategy

`sitemap.ts` at root generates all indexable URLs:
- Marketing pages (static)
- Tool pages (from content files)
- Template pages (from content files)
- Blog articles (from content files)
- Guides and glossary pages

`sitemap.xml` is referenced in `robots.txt`.

---

## 7. Infrastructure

### 7.1 CI/CD Pipeline

```
GitHub (main) → GitHub Actions CI
  ├── tsc --noEmit (type check)
  ├── ESLint
  ├── Unit tests (Vitest)
  └── E2E tests (Playwright) → on merge to main

GitHub (main) → Vercel
  └── Production deploy (auto)
```

### 7.2 Environment Strategy

| Env | Used For | Secret Management |
|---|---|---|
| `.env` | Local dev | Manual; gitignored |
| Vercel env vars | Preview + Production | Vercel dashboard |
| `docker-compose.yml` | Local dev parity | Manual |

Key env vars:
- `DATABASE_URL` — Neon Postgres connection string
- `REDIS_URL` — Upstash Redis URL
- `BETTER_AUTH_SECRET` — Session encryption key
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `S3_*` — MinIO/S3 storage credentials

### 7.3 Database Migration Strategy

```bash
# Dev: apply migrations
pnpm prisma migrate dev

# Prod: apply migrations (run in Docker before starting app)
pnpm prisma migrate deploy
```

Migrations live in `prisma/migrations/`. `prisma.config.ts` is used for custom seed scripts.

### 7.4 Docker Setup

- `Dockerfile` — multi-stage build (deps → build → runner)
- `docker-compose.yml` — full local stack (app + Postgres + Redis + MinIO)
- `docker-compose.prod.yml` — production stack (app + managed DB + managed Redis)

---

## 8. Security

### 8.1 Current Security Posture (as of REN-553 audit)

**Implemented:**
- CSP headers (strict, with allowlist for Stripe, Google Analytics, fonts)
- HSTS with includeSubDomains + preload
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Session-based auth (Better Auth) with Redis session store
- Tenant portal magic link tokens (UUID, not guessable)
- Stripe webhook signature verification
- Rate limiting on auth endpoints (via custom middleware + Redis)
- Input validation on API routes (Zod schemas)
- Soft-delete for properties (no hard delete of financial records)
- StripeWebhookEvent idempotency table
- Password hashing via Better Auth's account model
- Permissions-Policy: camera/microphone/geolocation/payment disabled

**Not yet implemented / Known gaps:**
- Row-level security enforcement at DB level (application-layer only in V1)
- No rate limiting on `/api/tenant/*` routes
- No bank webhook signature verification (Bridge/Powens not wired)
- Floating-point money (Prisma `Decimal` used, but server-side arithmetic)
- No Sentry for backend error tracking (frontend only via `@sentry/nextjs`)
- No webhook retry/backoff queue for failed external API calls

### 8.2 Secrets Management

All secrets are environment variables. No secrets are hardcoded or committed to the repo.

---

## 9. Open Questions & Known Gaps

| Question | Status | Owner |
|---|---|---|
| Multi-user organizations (sub-users, roles) | Not started — V2 | CTO |
| Open Banking integration (Bridge/Powens) | Schema ready; not wired | Backend Engineer |
| AI features (maintenance summarization, owner summaries) | SDK wired; routes empty | Backend Engineer |
| Email notification scheduling (cron-based reminders) | Not implemented — V2 | Backend Engineer |
| Webhook retry queue for failed external calls | Not implemented | Backend Engineer |
| Full row-level security at DB level | Not implemented — V2 | CTO |
| Internationalization (i18n) | French only for V1 | All |
| End-to-end tests for critical paths | Not implemented | QA |

---

## 10. Decision Log

| # | Decision | Rationale | Date | Made By |
|---|---|---|---|---|
| 1 | Next.js App Router over separate frontend/backend | RSC minimizes JS; SEO critical; team is full-stack | 2026-04-06 | CTO |
| 2 | Better Auth over NextAuth.js | Session-based (not JWT); magic link support; lighter | 2026-04-06 | CTO |
| 3 | PostgreSQL + Prisma over Supabase | More control; French data residency; familiar stack | 2026-04-06 | CTO |
| 4 | MinIO/S3 for document storage over DB BLOB | Scalable; pre-signed URLs for tenant access; S3-compatible | 2026-04-06 | CTO |
| 5 | @react-pdf/renderer for PDF generation | No external service dependency; full control over French legal format | 2026-04-06 | CTO |
| 6 | Soft delete on Property (deletedAt) over hard delete | Preserves audit trail; financial records depend on properties | 2026-04-06 | CTO |
| 7 | Stripe for subscriptions (not Stripe Connect for marketplace) | V1 = single landlord; Connect adds complexity for V2 | 2026-04-06 | CTO |
| 8 | Magic link for tenant portal over password | Tenants don't have email Verified; magic link is frictionless | 2026-04-06 | CTO |
| 9 | Decimal type for all money fields | French financial calculations require precision; float risks rounding | 2026-04-06 | CTO |
| 10 | (marketing) route group for SEO separation | URL structure preserved; auth handled in middleware | 2026-04-07 | CTO |
| 11 | Vercel for primary hosting | Edge network for French users; zero-config CI/CD; generous free tier | 2026-04-07 | CTO |
| 12 | Prisma 7 over TypeORM | Type-safe queries; migrations; excellent DX; team familiarity | 2026-04-07 | CTO |
| 13 | shadcn/ui + Radix over MUI/Ant | Tree-shakeable; accessible; full design control; no MUI bloat | 2026-04-07 | CTO |
| 14 | Tailwind CSS v4 (CSS-first config) | Rapid iteration; CSS variables for theming; shadcn compatibility | 2026-04-07 | CTO |
| 15 | Sentry for error tracking | APM + error tracking + source maps; 5% sampling in prod | 2026-04-07 | CTO |
| 16 | StripeWebhookEvent for idempotency | Critical for billing accuracy; Stripe docs recommend explicit deduplication | 2026-04-07 | CTO |
| 17 | ISR for marketing pages (Cache-Control headers in next.config) | Fast TTFB; always fresh; no rebuild on every request | 2026-04-07 | CTO |
| 18 | Docker standalone output for self-host option | Enterprise/data sovereignty customers; same binary as Vercel | 2026-04-07 | CTO |
| 19 | No multi-tenant org model in V1 | Keep V1 simple; Organization + OrganizationMember deferred to V2 | 2026-05-02 | CTO |
| 20 | REN-553 security audit findings acknowledged | 3 critical, 4 high, 5 medium findings documented; fixes prioritized | 2026-04-28 | CTO |

---

*This document is the authoritative V1 architecture reference. It supersedes the V1 Technical Architecture Blueprint (REN-90) for day-to-day engineering decisions. Update this document when any architectural decision is made — do not let it go stale.*
