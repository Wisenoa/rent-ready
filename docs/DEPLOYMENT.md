# Deployment Process

## Overview

This document describes the CI/CD pipeline, quality gates, deployment process, and rollback procedures for the rent-ready SaaS platform.

---

## Pipeline Architecture

### CI Pipeline (`.github/workflows/ci.yml`)

Runs on every pull request to `main` or `develop` and on every push to those branches.

| Job | Purpose | Timeout |
|-----|---------|---------|
| `lint` | ESLint validation | 5 min |
| `typecheck` | TypeScript type checking (`tsc --noEmit`) | 5 min |
| `unit-tests` | Vitest unit tests | 10 min |
| `build` | Next.js production build | 15 min |
| `e2e` | Playwright E2E smoke tests | 20 min |
| `lighthouse` | Lighthouse CI performance budgets | 15 min |
| `security` | Snyk vulnerability scan | 5 min |
| `seo-checks` | SEO lint, meta validator, schema validator | 5 min |
| `docker-build` | Docker image build + smoke test | 10 min |
| `notify-failure` | Slack notification on any failure | - |

### Quality Gates

All jobs must pass before merging. The `seo-checks` job uses `continue-on-error: true` so it reports but does not block.

#### Performance Budgets (Lighthouse CI)

| Metric | Threshold | Target |
|--------|-----------|--------|
| Performance Score | ≥ 90 | Lighthouse |
| SEO Score | ≥ 95 | Lighthouse |
| Accessibility Score | ≥ 90 | Lighthouse |
| Best Practices Score | ≥ 90 | Lighthouse |
| FCP | < 1,800ms | Core Web Vitals |
| LCP | < 2,500ms | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| INP | < 200ms | Core Web Vitals |
| TBT | < 200ms | Lighthouse |
| SI | < 3,400ms | Lighthouse |

Audited URLs: `/`, `/pricing`, `/features`, `/demo`

### Deployment Pipeline (`.github/workflows/deploy.yml`)

| Trigger | Environment | Action |
|---------|-------------|--------|
| Push to `develop` | Staging | Auto-deploy |
| Push to `main` | Staging + Production | Sequential deploy |
| Manual dispatch | Staging or Production | On-demand |
| Manual dispatch | Rollback | Revert to previous |

---

## Deployment Flow

### Staging

1. Push to `develop` branch
2. Prisma migrations run against Neon staging DB
3. Vercel build with `NEXT_PUBLIC_APP_URL=$STAGING_APP_URL`
4. Smoke test: `curl /api/health` must return 200
5. Slack notification to `#deployments`

### Production

1. Push to `main` branch (or merge from develop)
2. Staging deploys first (verification)
3. Prisma migrations run against Neon production DB
4. Vercel production build
5. Smoke test: `curl /api/health` must return 200
6. Slack notification to `#deployments`

---

## Required Secrets & Variables

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel CLI authentication token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `NEON_STAGING_DATABASE_URL` | Neon connection string (staging) |
| `NEON_PROD_DATABASE_URL` | Neon connection string (production) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (production, see below) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token (production, see below) |
| `SENTRY_DSN` | Sentry DSN for error tracking |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook (GitHub vars preferred) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `SNYK_TOKEN` | Snyk security scan token (optional) |

---

## Rate Limiting — Redis Configuration

### Overview

The `@upstash/ratelimit` library is used for distributed rate limiting. It requires a Redis backend that speaks HTTP REST (Upstash Serverless Redis protocol). Without Redis configured, the app falls back to an in-memory store — fine for single-instance dev, but unsuitable for production.

### How It Works

```
Request → API Route → @upstash/ratelimit → HTTP REST → Upstash Redis (cloud)
                                              OR
                                    In-memory store (no Redis)
```

### Local Development

No Redis needed. The in-memory fallback activates automatically when `UPSTASH_REDIS_REST_URL` is empty.

### Production Setup (Upstash Serverless Redis)

1. Create an account at [console.upstash.com](https://console.upstash.com/)
2. Create a new **Serverless Redis** database (choose the region closest to your deployment)
3. Copy the **REST URL** and **REST Token** from the database details page
4. Set them as environment variables in your deployment:

```bash
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_rest_token_here
```

5. Add to GitHub Secrets: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### Docker Production Deploy

```bash
# Build
docker build -t rentready/app:$TAG .

# Run (with Upstash)
docker run -d -p 3000:3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL \
  -e UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN \
  rentready/app:$TAG

# Smoke test
curl -f http://localhost:3000/api/health
```

### Verifying Redis Is Connected

Call `GET /api/health` with auth or from localhost. The `redis` check will show `healthy` when Upstash is configured, or `not_configured` when using the in-memory fallback.

### GitHub Variables

| Variable | Description |
|----------|-------------|
| `STAGING_APP_URL` | e.g., `https://staging.rentready.io` |
| `PROD_APP_URL` | e.g., `https://rentready.io` |
| `TURBO_TEAM` | Turborepo remote cache team |
| `SLACK_WEBHOOK_URL` | Slack webhook URL (preferred over secret) |

---

## Rollback Procedure

### Via GitHub Actions

1. Go to **Actions** tab → **Deploy** workflow
2. Click **Run workflow**
3. Select environment: `rollback`
4. Click **Run workflow**

This will roll back the production Vercel deployment to the previous successful deployment.

### Via Vercel CLI

```bash
vercel ls
# Find the previous deployment ID
vercel rollback <deployment-id>
```

### Manual Rollback

1. Identify the last known good deployment
2. Set `DATABASE_URL` to the rollback target DB (if schema changed)
3. Run: `git revert HEAD && git push`
4. Or use Vercel dashboard to promote a previous deployment

---

## Database Migrations

Migrations run automatically as part of the deployment pipeline **before** the new application is deployed.

```bash
# Run migrations locally (staging)
DATABASE_URL=$NEON_STAGING_DATABASE_URL pnpm exec prisma migrate deploy

# Run migrations locally (production)
DATABASE_URL=$NEON_PROD_DATABASE_URL pnpm exec prisma migrate deploy
```

---

## Environment-Specific Configuration

### Staging
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://staging.rentready.io`
- `SENTRY_ENVIRONMENT=staging`
- Database: Neon staging instance

### Production
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://rentready.io`
- `SENTRY_ENVIRONMENT=production`
- Database: Neon production instance

---

## Docker Deployment

The `docker-build` CI job verifies the `Dockerfile` is always valid.

### Manual Docker Deploy

```bash
# Build
docker build -t rentready/app:$TAG .

# Run
docker run -d -p 3000:3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL \
  -e UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN \
  rentready/app:$TAG

# Smoke test
curl -f http://localhost:3000/api/health
```

### Docker Compose (local development)

```bash
docker compose -f docker-compose.yml up
docker compose -f docker-compose.staging.yml up
```

---

## Health Check Endpoint

`GET /api/health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-23T01:00:00.000Z",
  "version": "0.1.0",
  "db": "connected"
}
```

Used by:
- CI/CD smoke tests
- Vercel health checks
- Uptime monitoring (UptimeRobot)
- Load balancer probes
- Docker health checks

---

## CI Skip Options

For minor documentation-only or CI-only changes:

| Skip | How |
|------|-----|
| Skip E2E tests | Set `SKIP_E2E=1` in the workflow dispatch or commit message: `[skip e2e]` |
| Skip Lighthouse CI | Set `SKIP_LH=1` or commit message: `[skip lighthouse]` |
| Skip entire CI | Not supported (CI is mandatory) |

---

## Notifications

### Slack

Pipeline failures and successful deployments are notified to Slack via the incoming webhook configured in `SLACK_WEBHOOK_URL`.

Channels:
- `#deployments` — successful staging/production deploys
- `#ci-alerts` — pipeline failures (configure via workflow `notify-failure` job)

### GitHub

- PR checks appear as status checks on every PR
- Branch protection rules enforce all checks pass before merge

---

## Monitoring

- **Errors**: Sentry (configured in `sentry.client.config.ts`, `sentry.server.config.ts`)
- **Performance**: Vercel Analytics + Lighthouse CI
- **Uptime**: UptimeRobot monitoring `https://rentready.io/api/health`
- **Logs**: Vercel log drains or Docker `docker logs`
