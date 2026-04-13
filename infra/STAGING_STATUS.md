# Staging Environment — Current Status
**Last updated:** 2026-04-13
**Issue:** REN-104

## Status: READY (pending actual hosting setup)

---

## What Is Configured

### CI/CD Pipeline (`.github/workflows/ci.yml`)
| Job | Trigger | Status |
|-----|---------|--------|
| lint | every push/PR | ✅ Ready |
| test | every push/PR | ✅ Ready |
| build | push to master/main | ✅ Ready |
| deploy-staging | push to master/main | ✅ Ready (needs secrets) |
| vercel-preview | PR opened | ✅ Ready (needs Vercel token) |
| migration-check | every push/PR | ✅ Ready |

### Required GitHub Secrets & Variables

**Set in GitHub → Settings → Secrets and variables → Actions:**

| Name | Type | Purpose | Status |
|------|------|---------|--------|
| `STAGING_HOST` | Secret | Server hostname for deploy-staging | ⚠️ Needs value |
| `STAGING_SSH_KEY` | Secret | SSH key for staging server | ⚠️ Needs value |
| `STAGING_DATABASE_URL` | Secret | Neon staging DB connection string | ⚠️ Needs value |
| `STAGING_STRIPE_KEY` | Secret | Stripe test publishable key | ⚠️ Needs value |
| `DATABASE_URL` | Secret | Default DB (also used in lint/test) | ⚠️ Needs value |
| `VERCEL_TOKEN` | Secret | Vercel API token | ⚠️ Needs value |
| `STAGING_APP_URL` | Variable | Public staging URL | ⚠️ Needs value |

**To configure, run:**
```bash
# Using GitHub CLI (if authenticated)
gh secret set STAGING_HOST --body "staging.your-domain.com"
gh secret set STAGING_DATABASE_URL --body "postgresql://..."
# etc.
```

### Docker Compose Staging Override
- File: `docker-compose.staging.yml` ✅ Exists
- Prisma migrations step included in `deploy-staging` CI job ✅
- Health check curl to `/api/health` ✅

### Health Endpoint
- Route: `GET /api/health` ✅ Implemented
- Returns 200 with full checks (db, redis, storage) ✅

### Sentry
- Environment: `staging` ✅ Configured in `sentry-alerts.yml`
- Alerts defined for: error rate, latency, critical errors, DB failures ✅

### Monitoring Stack
- Prometheus scrape targets defined in `infra/monitoring/prometheus.yml` ✅
- Grafana dashboard: `staging-overview.json` ✅
- Blackbox exporter for `/api/health` probing ✅
- Alert rules for staging in `infra/monitoring/alerts.yml` ✅

---

## Action Required Before Staging Is Live

1. **Register/point `staging.your-domain.com`** to the staging server (or configure Vercel production deployment)
2. **Set all GitHub Secrets** using the table above
3. **Provision Neon staging database** if not already done
4. **Verify SSH access** to the staging server from GitHub Actions runner

---

## Verification Commands

```bash
# After secrets are set, trigger a manual workflow:
# GitHub Actions → CI/CD Pipeline → Run workflow (master branch)

# On staging server, after deploy:
curl -sf https://staging.your-domain.com/api/health | jq .

# Check Docker containers
docker compose -f docker-compose.yml -f docker-compose.staging.yml ps

# View logs
docker compose -f docker-compose.yml -f docker-compose.staging.yml logs -f app
```

---

## Key Files
- Pipeline: `.github/workflows/ci.yml`
- Staging compose: `docker-compose.staging.yml`
- Docs: `infra/README.md`
- DB init: `infra/db/init.sql`
- Monitoring: `infra/monitoring/`
