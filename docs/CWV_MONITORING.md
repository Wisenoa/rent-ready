# Core Web Vitals Monitoring Dashboard

> **Owner:** DevOps / Infrastructure  
> **Last updated:** 2026-04-25  
> **Applicable environments:** Production (`rentready.io`), Staging

---

## Overview

Core Web Vitals (CWV) are real-user performance metrics that directly impact Google search rankings. This document describes the complete monitoring stack for tracking, alerting, and maintaining CWV performance.

**Targets:**
| Metric | Threshold | Type |
|--------|-----------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lab + Field |
| CLS (Cumulative Layout Shift) | < 0.1 | Lab + Field |
| INP (Interaction to Next Paint) | < 200ms | Lab + Field |
| FCP (First Contentful Paint) | < 1.8s | Lab + Field |
| TTFB (Time to First Byte) | < 800ms | Lab + Field |

**Scores (Lighthouse / PageSpeed Insights):**
- Target: > 90/100 for all key marketing pages
- Alert threshold: < 85 triggers investigation

---

## Monitoring Stack

### 1. Real User Monitoring (RUM) — Vercel Analytics

**What:** `@vercel/analytics` tracks real-user CWV sessions automatically in production.  
**Where:** Vercel Dashboard → Analytics → Performance  
**Metrics collected:** LCP, CLS, INP, FCP, TTFB  
**Setup:** `src/lib/web-vitals.ts` + `src/components/web-vitals-provider.tsx`  
**Status:** ✅ Active — wired into `src/app/layout.tsx`

Vercel Analytics aggregates real-user sessions and provides:
- Per-page median CWV distributions
- Trend charts over 30 days
- Device breakdown (mobile/desktop)
- Geographic breakdown

### 2. Lab Data — Lighthouse CI (GitHub Actions)

**What:** Synthetic Lighthouse audits on every PR  
**Where:** `.github/workflows/ci.yml` → `lighthouse` job  
**Config:** `lighthouserc.js`  
**Audited URLs:**
- `http://localhost:3000/`
- `http://localhost:3000/pricing`
- `http://localhost:3000/features`
- `http://localhost:3000/demo`

**Assertions (CI gates):**
```
categories:performance   ≥ 0.90 (90%)
first-contentful-paint   ≤ 1800ms
largest-contentful-paint ≤ 2500ms
cumulative-layout-shift ≤ 0.1
total-blocking-time      ≤ 200ms
speed-index             ≤ 3400ms
interaction-to-next-paint ≤ 200ms
```

**Status:** ✅ Active — runs on every PR and push to main/develop  
**Failure behavior:** PR merge is blocked

### 3. Field Data — CrUX Monitor (PageSpeed Insights API)

**What:** Pulls Chrome UX Report (CrUX) real-user field data for 7 key pages  
**Script:** `scripts/monitor-cwuv.mjs`  
**Workflow:** `.github/workflows/cwuv-monitor.yml` (runs daily at 08:00 UTC)  
**API:** Google PageSpeed Insights v5  
**Strategy:** Mobile (primary for SEO)

**Monitored pages:**
| Page | URL |
|------|-----|
| Homepage | https://rentready.io/ |
| Pricing | https://rentready.io/pricing |
| Features | https://rentready.io/features |
| Demo | https://rentready.io/demo |
| Blog | https://rentready.io/blog |
| Outils | https://rentready.io/outils |
| Templates | https://rentready.io/templates |

**Thresholds (field data):**
```
LCP  < 2500ms = good | ≥ 4000ms = poor
CLS  < 0.1    = good | ≥ 0.25  = poor
INP  < 200ms  = good | ≥ 500ms  = poor
FCP  < 1800ms = good | ≥ 3000ms = poor
TTFB < 800ms  = good | ≥ 1800ms = poor
```

**Alerting:** Slack webhook fires when any metric is poor on any page.  
**Required secrets:**
- `GOOGLE_PAGESPEED_API_KEY` — Google Cloud Console (free tier: 25k calls/day)
- `SLACK_WEBHOOK_URL` — Slack incoming webhook

**Status:** ✅ New — added 2026-04-25 (this update)

### 4. Uptime Monitoring — UptimeRobot

**What:** HTTP health check against `/api/health` every 1–5 minutes  
**Dashboard:** dashboard.uptimerobot.com  
**Alert on:** 3 consecutive failures  
**Status:** ✅ Configured (documented in `ERROR_BUDGET.md`)

---

## Accessing Each Dashboard

| Tool | URL | Purpose |
|------|-----|---------|
| Vercel Analytics | vercel.com/dashboard | Real-user CWV (RUM), page performance |
| GitHub Actions | github.com/.../actions | Lighthouse CI results per PR |
| PageSpeed Insights | pagespeed.web.dev | Manual field + lab data for any URL |
| UptimeRobot | dashboard.uptimerobot.com | Uptime + health monitoring |
| Sentry | sentry.io | JS errors + performance traces |
| Google Search Console | search.google.com/search-console | CWV + indexing health |

---

## Alerting Rules

| Alert | Condition | Action |
|-------|-----------|--------|
| CWV regression | CrUX poor on any page | Slack webhook via `cwuv-monitor.yml` |
| Lighthouse score drop | < 90 on PR | CI gate blocks merge |
| Lighthouse CWV fail | LCP > 2.5s, CLS > 0.1, INP > 200ms on PR | CI gate blocks merge |
| Site health | `/api/health` returns 5xx | UptimeRobot → Slack alert |
| JS errors spike | > 50 new errors in 10 min | Sentry → Slack alert |

---

## Adding New Pages to CrUX Monitor

Edit `scripts/monitor-cwuv.mjs` and add to the `PAGES` array:

```js
const PAGES = [
  // ...existing pages...
  { name: 'New Page', url: `https://${DOMAIN}/new-page` },
];
```

Then commit — the next daily workflow run will include it.

---

## Adding Lighthouse Assertions for New Pages

Edit `lighthouserc.js` → `ci.collect.url`:

```js
url: [
  'http://localhost:3000/',
  'http://localhost:3000/pricing',
  // ...existing...
  'http://localhost:3000/new-page',
],
```

---

## Running CrUX Monitor Locally

```bash
# All pages
GOOGLE_PAGESPEED_API_KEY=your_key node scripts/monitor-cwuv.mjs --alert-slack

# Single URL
GOOGLE_PAGESPEED_API_KEY=your_key node scripts/monitor-cwuv.mjs --url=https://rentready.io/pricing

# JSON output (for scripting)
GOOGLE_PAGESPEED_API_KEY=your_key node scripts/monitor-cwuv.mjs --json
```

Get a Google PageSpeed Insights API key:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create API key or use existing
3. Enable "PageSpeed Insights API"
4. Set `GOOGLE_PAGESPEED_API_KEY` in GitHub Secrets

---

## Performance Budget Summary

| Page | LH Perf Score | LCP target | CLS target | INP target |
|------|-------------|-----------|-----------|-----------|
| Homepage | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Pricing | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Features | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Demo | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Blog | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Outils | ≥ 90 | < 2.5s | < 0.1 | < 200ms |
| Templates | ≥ 90 | < 2.5s | < 0.1 | < 200ms |

---

*This document should be reviewed monthly and after any major frontend deployments.*
