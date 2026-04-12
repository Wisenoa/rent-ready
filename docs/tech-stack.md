# Tech Stack & Infrastructure — RentReady

> Current state as of 2026-04-12. Backend Engineer (CTO) scaffolding task.

---

## 1. Repository & Deployment

| Item | Value |
|------|-------|
| Repo | `git@github.com:Wisenoa/rent-ready.git` |
| Branch | `master` |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`) |
| Build target | Docker (standalone Node.js) |
| Infra | Docker Compose (local), Vercel (planned) |
| Deployment envs | staging (Docker), production (planned via Vercel) |

---

## 2. Tech Stack

### Frontend
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + CSS Modules
- **UI Components**: shadcn/ui + Radix primitives
- **Fonts**: next/font (Geist)
- **Animations**: Framer Motion, Tailwind animate
- **Forms**: React Hook Form + Zod + `@hookform/resolvers`
- **State**: React Server Components + URL state (no heavy client state lib yet)
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js 20 (via Docker / Next.js standalone)
- **API**: Next.js App Router Route Handlers (REST/tRPC-style)
- **ORM**: Prisma 7.6 with `@prisma/adapter-pg` (PostgreSQL via pgbouncer)
- **Auth**: Better Auth 1.5.6 (session-based, credentials + OAuth)
- **Database**: PostgreSQL 16 via Docker

### External Services
- **Email**: Resend ( transactional)
- **AI**: OpenAI (`@ai-sdk/openai` + `ai` SDK)
- **Payments**: Stripe (subscriptions, webhooks)
- **Document Generation**: `@react-pdf/renderer` (quittances/reçus)
- **Storage**: MinIO (S3-compatible, local dev)
- **Open Banking**: Bridge/Powens API (DSP2, bank sync)
- **Error Monitoring**: Sentry (`@sentry/nextjs` — **newly added**)

### Queue / Jobs
- Redis (via `redis` npm package) — sessions, caching, rate limiting

---

## 3. Environment Variables

### Core (`.env`)
```
NEXT_PUBLIC_APP_URL         # e.g. http://localhost:3000
NEXT_PUBLIC_APP_ENV         # development | staging | production
NEXT_PUBLIC_APP_VERSION     # e.g. 0.1.0
DATABASE_URL                # PostgreSQL with pgbouncer pooling
BETTER_AUTH_SECRET          # Auth session signing key
REDIS_PORT                  # 6379
MINIO_*                     # S3-compatible object storage
RESEND_API_KEY / RESEND_DOMAIN
STRIPE_*                    # Payment processing
OPENAI_API_KEY              # AI features
```

### Sentry (Error Monitoring)
```
# Client-side (exposed to browser)
NEXT_PUBLIC_SENTRY_DSN      # e.g. https://dsn@sentry.io/project

# Server-side (build/CI only)
SENTRY_ORG                  # wisenoa
SENTRY_PROJECT              # rent-ready
SENTRY_AUTH_TOKEN          # From sentry.io/settings/auth-tokens
SENTRY_ENVIRONMENT          # production
```

> **TODO**: Replace placeholder values in `.env` with real credentials before first deployment.

---

## 4. Sentry Setup (Completed)

### Files Created
- `sentry.client.config.ts` — Browser SDK init (tracesSampleRate=1.0 dev, 0.1 prod; session replay 5% prod)
- `sentry.server.config.ts` — Node.js SDK init (tracesSampleRate 1.0 dev, 0.05 prod; maxBreadcrumbs=50)
- `sentry.edge.config.ts` — Edge runtime init (conservative 0.02/0.02 traces)

### Configuration
- `next.config.ts` wrapped with `withSentryConfig()` — enables webpack instrumentation + sourcemap upload
- `tunnelRoute: '/api/sentry-error'` — bypasses ad-blockers in production
- `widenClientFileUpload: false` — source maps only for this project
- Deny lists on all configs: favicon, `/api/health`, `/_next/static`

### CI/GitHub Actions
- Sentry auth token stored as `SENTRY_AUTH_TOKEN` secret
- On master/main build: `@sentry/webpack-plugin` automatically uploads source maps
- Release creation + commit association handled by `withSentryConfig`

### next.config.ts
```ts
import { withSentryConfig } from '@sentry/nextjs';
// ... config object ...
export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG || 'wisenoa',
  project: 'rent-ready',
  widenClientFileUpload: false,
  tunnelRoute: '/api/sentry-error',
});
```

---

## 5. Prisma Schema

Located: `prisma/schema.prisma`

### Key Models
- `User` — landlord/property owner (Better Auth)
- `Property` — real estate asset
- `Unit` — multi-unit building support
- `Tenant` — renter + tenant portal magic links
- `Lease` — contract with IRL revision support
- `Guarantor` — financial guarantor for lease
- `Transaction` — rent payments (quittances/reçus)
- `Document` — AI-extracted + generated PDFs
- `MaintenanceTicket` — tenant repair requests
- `Organization` / `OrganizationMember` — multi-user workspaces

### Migrations
- `20260329145855_init` — initial schema
- `20260408085919_add_unit_guarantor_org` — latest migration

Run with: `prisma migrate dev --name <name>` or `prisma migrate deploy`

---

## 6. CI/CD Pipeline (GitHub Actions)

File: `.github/workflows/ci.yml`

**Jobs:**
1. **Lint & Type Check** — `npx tsc --noEmit` (ESLint step disabled due to ESLint 9 + rushstack incompatibility)
2. **Unit Tests** — `npm test -- --passWithNoTests` (Vitest)
3. **Build Docker Image** — only on master/main, pushes to registry

---

## 7. Docker

- `Dockerfile` — standalone Next.js build
- `docker-compose.yml` — full stack (postgres, redis, minio, app)
- `docker-compose.staging.yml` — staging variant
- `docker-compose.prod.yml` — production variant

---

## 8. Missing Items (from original issue)

| Item | Status | Notes |
|------|--------|-------|
| GitHub repo | ✅ Done | `Wisenoa/rent-ready` |
| Next.js + TypeScript | ✅ Done | v15.5.9 |
| Tailwind CSS | ✅ Done | v4 |
| PostgreSQL schema + Prisma | ✅ Done | v7.6 |
| CI/CD (GitHub Actions) | ✅ Done | lint/test/build |
| Vercel/AWS deployment | ⚠️ Planned | Not wired yet |
| Docker | ✅ Done | Full local stack |
| Env vars + secrets | ✅ Done | All templates updated |
| Sentry | ✅ Done | SDK + configs + next.config |
| Repo structure | ✅ Done | `src/app`, `prisma`, `infra` |

---

## 9. Next Steps for Full Deployment

1. **Vercel**: Connect repo, set env vars, configure build command (`npm run build`)
2. **Sentry**: Create project at sentry.io, replace placeholder DSN + auth token in env
3. **Database**: Provision managed PostgreSQL (Neon, Supabase, or AWS RDS)
4. **Secrets**: Store `SENTRY_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, Stripe keys in Vercel env vars
5. **Domain**: Configure DNS for `rent-ready.fr`
6. **Monitoring**: Add uptime monitoring (Healthchecks or similar)