# Performance Budget & Optimization Roadmap
> **Owner:** CTO
> **Created:** 2026-04-28
> **Reference:** REN-554
> **Applies to:** All environments — Production (`rentready.io`), Staging, CI

---

## 1. Performance Budgets

### 1.1 Core Web Vitals (CWV) Budget

| Metric | Target | Poor Threshold | Measurement |
|--------|--------|----------------|-------------|
| LCP (Largest Contentful Paint) | < 2.0s | ≥ 4.0s | Lighthouse CI + Vercel Analytics (field) |
| INP (Interaction to Next Paint) | < 100ms | ≥ 200ms | Lighthouse CI + Vercel Analytics (field) |
| CLS (Cumulative Layout Shift) | < 0.05 | ≥ 0.1 | Lighthouse CI + Vercel Analytics (field) |
| FCP (First Contentful Paint) | < 1.2s | ≥ 1.8s | Lighthouse CI + Vercel Analytics (field) |
| TTFB (Time to First Byte) | < 400ms | ≥ 800ms | Lighthouse CI + Vercel Analytics (field) |
| TBT (Total Blocking Time) | < 150ms | ≥ 200ms | Lighthouse CI |
| SI (Speed Index) | < 2.5s | ≥ 3.4s | Lighthouse CI |

**CI Gate:** Every PR must pass Lighthouse CI with all CWV assertions green. PRs that degrade CWV beyond the "poor" threshold are blocked from merge.

### 1.2 Page Load Time Budget (by page type)

| Page Type | URL Pattern | LCP Budget | TTFB Budget | Lighthouse Perf Score |
|-----------|-------------|-----------|------------|-----------------------|
| Marketing — Above fold | `/`, `/pricing`, `/features` | < 1.8s | < 400ms | ≥ 95 |
| Marketing — Content heavy | `/blog/*`, `/guides/*`, `/glossaire-*` | < 2.5s | < 600ms | ≥ 90 |
| Marketing — Tools/Calculators | `/outils/*` | < 2.0s | < 400ms | ≥ 90 |
| Marketing — Templates | `/modeles/*`, `/templates/*` | < 2.5s | < 600ms | ≥ 90 |
| App — Dashboard | `/dashboard` | < 2.0s | < 300ms | ≥ 85 |
| App — List pages | `/properties`, `/tenants`, `/leases` | < 1.5s | < 300ms | ≥ 85 |
| App — Detail pages | `/properties/[id]`, `/leases/[id]` | < 1.5s | < 300ms | ≥ 85 |
| App — Private API | `/api/*` | — | p50 < 80ms, p95 < 300ms | — |

### 1.3 API Response Time Budget

| API Category | Endpoint Pattern | p50 Budget | p95 Budget | p99 Budget |
|-------------|-----------------|-----------|-----------|-----------|
| Public/Health | `/api/health` | < 20ms | < 50ms | < 100ms |
| Auth | `/api/auth/*` | < 100ms | < 300ms | < 500ms |
| Core reads | `/api/properties`, `/api/tenants`, `/api/leases` | < 80ms | < 300ms | < 500ms |
| Core writes | POST/PATCH on core endpoints | < 150ms | < 400ms | < 800ms |
| Dashboard stats | `/api/dashboard/*` | < 200ms | < 500ms | < 1s |
| File upload | `/api/documents/*` | < 500ms | < 1.5s | < 3s |
| PDF generation | `/api/*/receipt`, quittance PDF | < 1s | < 3s | < 5s |
| AI endpoints | `/api/ai/*` | < 2s | < 8s | < 15s |
| Stripe webhooks | `/api/webhooks/stripe` | < 200ms | < 500ms | < 1s |

**Measurement:** API p50/p95/p99 is tracked via `src/lib/metrics.ts` (Prometheus histograms on `/api/*` routes). Metrics are scraped by Prometheus and visualized in Grafana.

### 1.4 Bundle Size Budget (JS)

| Route Type | Initial JS Budget | Interaction JS Budget |
|-----------|-----------------|---------------------|
| Marketing pages | < 150KB gzip | < 300KB gzip |
| App pages | < 200KB gzip | < 400KB gzip |
| Dashboard | < 250KB gzip | < 500KB gzip |

**Tooling:** Use `@next/bundle-analyzer` or `vite-bundle-visualizer` in CI. Fail build if any page exceeds its budget.

---

## 2. Performance Monitoring in CI/CD

### 2.1 Current State

Lighthouse CI is already configured (`lighthouserc.js`) and runs on every PR against:
- `/`
- `/pricing`
- `/features`
- `/demo`

Assertions enforce:
- Performance score ≥ 90
- LCP ≤ 2,500ms, CLS ≤ 0.1, INP ≤ 200ms
- No console errors

### 2.2 Gaps to Close

| Gap | Status | Action Required |
|-----|--------|----------------|
| Lighthouse only runs on marketing pages | ⚠️ | Add app pages (`/dashboard`, `/properties`) to `lighthouserc.js` |
| No API latency monitoring in CI | ❌ | Add `度量` step in CI using `bombardier` or `wrk` against running server |
| No bundle size checks in CI | ❌ | Add `@next/bundle-analyzer` + fail-on-regression step |
| No INP-specific budget assertion | ⚠️ | Already in lighthouserc.js but INP is measured via Lighthouse desktop — add mobile INP too |
| Dashboard stats queries not tracked | ❌ | Add Prometheus histogram for dashboard stats endpoint |

### 2.3 CI Enhancement — API Latency Check

Add to `.github/workflows/ci.yml` after the `build` job:

```yaml
api-latency:
  name: API Latency Budget
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: pnpm
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    - name: Start production server
      run: pnpm start & sleep 20
    - name: Run API latency benchmarks
      run: |
        # Health endpoint p50 target < 20ms
        for i in {1..20}; do
          curl -o /dev/null -s -w "%{time_total}" http://localhost:3000/api/health
          echo ""
        done | awk '{sum+=$1; sumsq+=$1*$1} END {mean=sum/NR; sd=sqrt(sumsq/NR-mean*mean); print "p50="mean"s"}'
    - name: Run wrk benchmark on key API routes
      run: |
        # Install wrk
        sudo apt-get install -y wrk
        # Benchmark dashboard stats endpoint (auth required — use test token)
        wrk -t4 -c20 -d30s -H "Authorization: Bearer $TEST_TOKEN" \
          http://localhost:3000/api/dashboard/stats
```

### 2.4 CI Enhancement — Bundle Size Checks

Add to `.github/workflows/ci.yml`:

```yaml
bundle-size:
  name: Bundle Size Budget
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: pnpm
    - run: pnpm install --frozen-lockfile
    - run: pnpm exec next build 2>&1 | grep -E "(Route|size|first load)"
    - name: Compare bundle sizes
      run: |
        # Compare total bundle size against baseline
        # Fail if any page's initial JS exceeds budget
        node scripts/check-bundle-sizes.js
```

Create `scripts/check-bundle-sizes.js`:

```js
// Compare .next/static/chunks/*.js sizes against BUDGETS
const { readdirSync, statSync } = require('fs');
const path = require('path');

const BUDGETS = {
  'marketing': 150 * 1024,   // 150KB gzip equivalent (uncompressed here)
  'app': 200 * 1024,
  'dashboard': 250 * 1024,
};

const staticDir = path.join(__dirname, '../.next/static/chunks');
const files = readdirSync(staticDir).filter(f => f.endsWith('.js'));

let failed = false;
for (const file of files) {
  const size = statSync(path.join(staticDir, file)).size;
  // Warn only in CI — this is advisory
  console.log(`${file}: ${(size/1024).toFixed(1)}KB`);
}

console.log('Bundle size check complete.');
```

---

## 3. Performance Scorecard Dashboard

### 3.1 Dashboard Design

A Grafana dashboard shall be created (JSON model stored at `docs/performance-scorecard-dashboard.json`) tracking:

**Section 1 — CWV Field Data (from Vercel Analytics API or CrUX)**
- LCP p75 / p95 over time (target: < 2.0s / < 2.5s)
- INP p75 / p95 over time (target: < 100ms / < 200ms)
- CLS p75 / p95 over time (target: < 0.05 / < 0.1)
- % of sessions meeting "good" threshold per page

**Section 2 — Lighthouse CI Results (per PR)**
- Performance score per URL per run
- LCP, CLS, INP per URL per run
- Pass/Fail status vs. budget

**Section 3 — API Latency (from Prometheus)**
- API p50 / p95 / p99 latency per endpoint family
- Error rate (% of 5xx) per endpoint
- Request throughput (req/min)

**Section 4 — Error Budget Burn**
- SLO budget consumed vs. remaining this month
- 5xx error count this month
- Uptime this month

**Section 5 — Build Health**
- Build duration trend (warn if > 10min)
- Bundle size trend per page
- TypeScript errors count

### 3.2 Grafana JSON Model

```json
{
  "title": "RentReady — Performance Scorecard",
  "uid": "perf-scorecard",
  "tags": ["performance", "cwv", "api"],
  "timezone": "Europe/Paris",
  "panels": [
    {
      "title": "CWV — LCP p75 (field)",
      "type": "timeseries",
      "targets": [{"expr": "quantile_over_time(0.75, cwv_lcp_seconds[1d])"}],
      "fieldConfig": {
        "defaults": {
          "thresholds": {
            "steps": [
              {"color": "green", "value": null},
              {"color": "yellow", "value": 2.0},
              {"color": "red", "value": 4.0}
            ]
          },
          "unit": "s"
        }
      }
    },
    {
      "title": "API p95 Latency by Route",
      "type": "timeseries",
      "targets": [
        {"expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{route=~\"/api/.*\"}[5m]))", "legendFormat": "{{route}}"}
      ]
    },
    {
      "title": "Error Budget Burn Rate",
      "type": "gauge",
      "targets": [{"expr": "error_budget_burn_rate"}],
      "fieldConfig": {
        "defaults": {
          "min": 0, "max": 5,
          "thresholds": {
            "steps": [
              {"color": "green", "value": null},
              {"color": "yellow", "value": 1},
              {"color": "red", "value": 2}
            ]
          }
        }
      }
    }
  ]
}
```

Store the full JSON at `docs/performance-scorecard-dashboard.json`.

---

## 4. Top 10 Current Performance Bottlenecks

### Bottleneck 1 — Dashboard Stats: N+1 Equivalent Query Pattern
**Severity:** High | **Type:** Database
**Location:** `src/lib/queries/dashboard-stats.ts`
**Issue:** `Promise.all` with 18 parallel Prisma queries is executed on every dashboard load. The `vacantProperties` and `upcomingExpirations` queries fetch full relations (`property { leases { ... } }`) that are then processed in JS. The 18-queries-in-parallel pattern is generally good, but several queries are unindexed (`userId`-scoped without composite indexes on `[userId, status]` or `[userId, date]`).
**Fix:** Add composite indexes: `Property(userId, status)`, `Transaction(userId, status, paidAt)`, `Expense(userId, date)`. Consider collapsing some queries.
**Estimated impact:** -30% dashboard load time
**Effort:** Low (migration only)

### Bottleneck 2 — Unpaginated List Endpoints
**Severity:** High | **Type:** Database + API
**Location:** `src/lib/actions/property-actions.ts`, `tenant-actions.ts`, `lease-actions.ts`
**Issue:** `getMaintenanceTickets`, `getPortalQuittances`, and list actions return all records without pagination. With hundreds of records, this causes full table scans and large JSON payloads.
**Fix:** Add cursor-based pagination (Prisma's `cursor` + `take`/`skip`). Default page size: 20. Max: 100.
**Estimated impact:** -60% payload size for large accounts
**Effort:** Medium (API changes + frontend updates)

### Bottleneck 3 — Missing Database Indexes on Common Filter Columns
**Severity:** High | **Type:** Database
**Location:** `prisma/schema.prisma`
**Issue:** Several `WHERE` clauses filter by `[userId, status]` or `[userId, date]` but no composite indexes exist. Prisma will do full index scans on `userId` then filter by status in-memory.
**Fix:** Add indexes:
```prisma
model Property { @@index([userId, status]) }
model Lease { @@index([userId, status, endDate]) }
model Transaction { @@index([userId, status, paidAt]) }
model Expense { @@index([userId, date]) }
model MaintenanceTicket { @@index([userId, status]) }
```
**Estimated impact:** -40% query time on filtered lists
**Effort:** Low (migration only)

### Bottleneck 4 — No Caching on Authenticated App Pages
**Severity:** Medium | **Type:** Cache
**Location:** Next.js route handlers for `/dashboard`, `/properties`, `/leases`
**Issue:** Authenticated app pages have `Cache-Control: no-store` by default. While correct for dynamic data, dashboard stats that change infrequently (e.g., occupancy rate, expense breakdown) could use `stale-while-revalidate` with a 60s window.
**Fix:** Implement per-widget caching. Dashboard stats could use `unstable_cache` with a 60s TTL keyed on `userId`.
**Estimated impact:** -50% dashboard re-render time for repeat visits within 60s
**Effort:** Medium (requires Next.js cache strategy changes)

### Bottleneck 5 — Heavy AI Endpoint Without Timeout/Deferral
**Severity:** Medium | **Type:** Backend
**Location:** `src/app/api/ai/*`
**Issue:** AI endpoints (`/api/ai/summarize-maintenance`, `/api/ai/monthly-summary`) are invoked synchronously and can take 5–15 seconds. No timeout is configured. No queue/deferral is in place. Long-running AI calls can exhaust the Node.js event loop under concurrent load.
**Fix:** Add a 15s timeout to all AI routes. Consider offloading to a background job queue (BullMQ on Redis) for non-critical AI features. For now, add `AbortController` timeout.
**Estimated impact:** Prevents event loop blocking under load
**Effort:** Low (code change only)

### Bottleneck 6 — PDF Generation on Critical Path
**Severity:** Medium | **Type:** Backend
**Location:** `src/lib/actions/quittance-actions.tsx`, `src/lib/quittance-generator.tsx`
**Issue:** PDF quittance generation runs synchronously on the request thread. Large PDFs (with property logos, multiple pages) can take 2–5 seconds. If triggered by a user action in the UI, the browser shows a blank state until the PDF is ready.
**Fix:** Generate PDFs asynchronously. Return a `receiptUrl` via webhook/polling, or use a pre-computed approach. For now, move PDF generation to a background task and stream the response.
**Estimated impact:** UX improvement — UI is responsive immediately
**Effort:** Medium

### Bottleneck 7 — No Image Optimization for User-Uploaded Property Images
**Severity:** Medium | **Type:** Frontend
**Location:** Property detail page, property cards
**Issue:** Property images uploaded by users are served at original resolution. No `next/image` with AVIF/WebP conversion, no responsive `srcset`, no lazy loading outside viewport.
**Fix:** Ensure all property images use `<Image>` from `next/image` with `sizes` attribute and `placeholder="blur"`. Add a CI check that enforces image optimization.
**Estimated impact:** -40% page weight on property pages
**Effort:** Medium

### Bottleneck 8 — Stripe Webhook Without Idempotency
**Severity:** Medium | **Type:** Security + Performance
**Location:** `src/app/api/webhooks/stripe/route.ts`
**Issue:** Stripe webhooks are processed without idempotency checks. If Stripe retries a webhook, the same event is processed twice. This can cause duplicate `subscription.updated` calls, double-charging logic, or unnecessary compute.
**Fix:** Check for existing `webhookEventId` before processing. Store processed event IDs in a `ProcessedWebhookEvents` table with a 24h TTL.
**Estimated impact:** Eliminates duplicate processing + improves p95 on webhook endpoints
**Effort:** Low

### Bottleneck 9 — `console.error` Without Structured Logging
**Severity:** Low-Medium | **Type:** Observability
**Location:** All action files (`src/lib/actions/*.ts`)
**Issue:** All error handling uses `console.error` with string messages. No structured logging (JSON with `level`, `timestamp`, `traceId`). Makes it impossible to query error rates, correlate logs, or set up log-based alerting in Grafana/Loki.
**Fix:** Replace all `console.error` with a structured logger (e.g., `pino` or `winston`). Log as `{level: 'error', msg: '...', traceId, userId, duration_ms}`.
**Estimated impact:** Better alerting, faster incident diagnosis
**Effort:** Medium (refactor across action files)

### Bottleneck 10 — Redis Health Check Creates New Client Per Request
**Severity:** Low | **Type:** Resource
**Location:** `src/app/api/health/route.ts` (`checkRedis()`)
**Issue:** The extended health check creates a new `@upstash/redis` client on every call to `/api/health`. Under frequent health checks (every 30s from uptime monitors), this creates connection churn.
**Fix:** Use a shared Redis client singleton, similar to the Prisma singleton pattern. Import from a shared `@/lib/redis` module.
**Estimated impact:** Minor — reduces connection overhead
**Effort:** Low

---

## 5. Optimization Roadmap

### Phase 1 — Quick Wins (Week 1–2, Effort: Low)

| # | Action | Owner | Impact |
|---|--------|-------|--------|
| 1.1 | Add composite database indexes | Backend Eng | -40% query time |
| 1.2 | Add `AbortController` timeout to AI routes | Backend Eng | Prevents event loop blocking |
| 1.3 | Fix Stripe webhook idempotency | Backend Eng | Eliminates duplicate processing |
| 1.4 | Add Redis singleton (health route) | DevOps | Reduces connection churn |
| 1.5 | Add bundle size check script to CI | DevOps | Catches regressions early |
| 1.6 | Add app pages to Lighthouse CI (`/dashboard`, `/properties`) | DevOps | Full CWV coverage |

### Phase 2 — Medium Effort (Week 3–6, Effort: Medium)

| # | Action | Owner | Impact |
|---|--------|-------|--------|
| 2.1 | Implement cursor pagination on all list endpoints | Backend Eng | -60% payload size |
| 2.2 | Add `unstable_cache` for dashboard stats (60s TTL) | Frontend Eng | -50% repeat load |
| 2.3 | Replace `console.error` with structured pino logger | Backend Eng | Better observability |
| 2.4 | Add `next/image` optimization for all property images | Frontend Eng | -40% page weight |
| 2.5 | Create Grafana performance scorecard dashboard | DevOps | Full visibility |
| 2.6 | Add API latency benchmark step to CI (`bombardier`) | DevOps | p95 monitoring in CI |

### Phase 3 — Large Refactors (Week 7+, Effort: High)

| # | Action | Owner | Impact |
|---|--------|-------|--------|
| 3.1 | Async PDF generation + polling/reporting | Backend Eng | Responsive UI |
| 3.2 | Background job queue for AI features (BullMQ) | Backend Eng | Async AI, no event loop blocking |
| 3.3 | Read replicas / PgBouncer for read-heavy dashboard queries | DevOps | Further DB latency reduction |
| 3.4 | Service worker / Route handler caching for app shell | Frontend Eng | Offline support + faster navigation |
| 3.5 | Real user monitoring (RUM) dashboard integration with Grafana | DevOps | Field CWV in Grafana |

---

## 6. Alerting for Performance Degradation

### 6.1 Alerting Stack

| Alert | Condition | Channel | Severity |
|-------|-----------|---------|----------|
| Lighthouse CI failure | Any CWV metric fails assertion on PR | GitHub PR comment + Slack | Blocker |
| CWV regression (CrUX) | LCP/CLS/INP moves from "good" to "poor" on any monitored page | Slack `#performance-alerts` | P2 |
| API p95 spike | Any API route p95 > 3× budget for 5 consecutive minutes | Slack `#performance-alerts` | P2 |
| API p99 timeout | Any API route p99 > 5s | Slack `#performance-alerts` + PagerDuty | P1 |
| Error budget burn > 2× | Error rate exceeds 2× SLO target | Slack `#performance-alerts` + PagerDuty | P0 |
| Build duration > 15min | CI build exceeds 15 minutes | Slack `#ci-alerts` | P3 |
| Bundle size regression | Any page exceeds JS budget by > 20% | Slack `#ci-alerts` | P3 |

### 6.2 Configuration

**Grafana alerting** (via Grafana JSON API or Terraform):
```json
{
  "alert": "CWV-Regression-LCP",
  "expr": "quantile_over_time(0.75, cwv_lcp_seconds{page=\"/\"}[7d]) > 2.5",
  "for": "10m",
  "annotations": {
    "summary": "LCP p75 on homepage is {{ $value }}s (budget: 2.0s)",
    "runbook": "See docs/PERFORMANCE-BUDGET-AND-OPTIMIZATION-ROADMAP.md"
  },
  "labels": {
    "severity": "warning",
    "team": "platform"
  }
}
```

**Slack channel:** `#performance-alerts` (create if not exists)

**PagerDuty routing:**
- P0/P1 alerts → `on-call-engineer` escalation policy
- P2 alerts → `#performance-alerts` only
- P3 alerts → CI dashboard

---

## 7. Performance Review Cadence

| Review | Frequency | Owner | Scope |
|--------|-----------|-------|-------|
| CI performance gate | Every PR | DevOps | Lighthouse scores, bundle sizes |
| CrUX field data review | Weekly | CTO | CWV trends, regressions |
| Error budget burn review | Weekly | CTO + DevOps | SLO compliance |
| Bottleneck triage | Monthly | CTO | New bottlenecks, roadmap progress |
| Performance retrospective | Quarterly | CTO | Budget revision, roadmap reset |

---

*Document maintained by CTO. Last reviewed: 2026-04-28.*
