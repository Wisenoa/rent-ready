# Sentry Alerting & Issue Triage Runbook
> Owner: DevOps / Infrastructure
> Last updated: 2026-04-28
> Applies to: RentReady production (rentready.io)

---

## 1. Sentry Projects

| Project | Platform | DSN env var | Purpose |
|---------|----------|-------------|---------|
| `rent-ready` | Next.js (frontend + server) | `NEXT_PUBLIC_SENTRY_DSN` | Full-stack web app |
| `rent-ready-edge` | Edge runtime | `NEXT_PUBLIC_SENTRY_DSN` | Vercel Edge functions |

Both projects share the same Sentry organization: **`wisenoa`**.

Sentry dashboard: https://wisenoa.sentry.io

---

## 2. Alert Thresholds

All alerts are configured in **Sentry UI** under Projects → rent-ready → Alerts.

### 2.1 P0 — Critical Alerts (Immediate Response)

| Alert name | Condition | Threshold | Owner | Notification |
|------------|-----------|-----------|-------|---------------|
| **Site Down / Total Failure** | `status == fatal` OR `error.count > 50 in 10m` | Any occurrence | On-call + CTO | Slack #incidents + PagerDuty |
| **Database Connection Failure** | `message contains "Can't reach database"` OR `exception.type == "PrismaClientKnownRequestError"` with retry-exhausted | > 5 events in 5m | On-call + DevOps | Slack #incidents |
| **Auth System Broken** | `exception.type == "TRPCError"` with `UNAUTHORIZED` > 20% of traffic | > 5% error rate | On-call + DevOps | Slack #incidents |
| **Payment Processing Failure** | `message contains "stripe" OR "payment" OR "checkout"` AND `status != ok` | > 3 events in 5m | On-call + CTO | Slack #incidents + email |

**Response SLA: < 5 minutes.** PagerDuty pages on-call immediately.

### 2.2 P1 — High Alerts

| Alert name | Condition | Threshold | Owner | Notification |
|------------|-----------|-----------|-------|---------------|
| **High Error Rate (API)** | `event.type == error` on `/api/*` routes | > 1% of requests in 5m | DevOps | Slack #alerts |
| **High Error Rate (Frontend)** | `event.type == error` on frontend | > 5% of sessions in 10m | DevOps | Slack #alerts |
| **P95 Latency Spike** | `measured(p95) > 3000ms` on any transaction | > 1 occurrence in 5m | DevOps | Slack #alerts |
| **New Error Type** | `exception.type` never seen before | Any occurrence | DevOps | Slack #alerts |
| **Deployment Regression** | New error fingerprint introduced after deploy | > 3 events after deploy | DevOps | Slack #deployments |

**Response SLA: < 15 minutes.** Slack #alerts during business hours.

### 2.3 P2 — Medium Alerts

| Alert name | Condition | Threshold | Owner | Notification |
|------------|-----------|-----------|-------|---------------|
| **Elevated Latency** | `measured(p95) > 1500ms` on any transaction | > 5 occurrences in 30m | DevOps | Slack #alerts (no page) |
| **Error Budget Burning** | Crash-free rate drops below 98% | Rolling 1h | DevOps | Slack #alerts |
| **Session Replay Errors** | `replayagoggregated_errors > 0` on paying user sessions | > 5 in 1h | DevOps | Slack #alerts |
| **Source Map Upload Failed** | Build step `sentry-cli releases` exit code != 0 | Any occurrence | DevOps | Slack #deployments |

**Response SLA: < 1 hour** during business hours.

### 2.4 P3 — Low Alerts

| Alert name | Condition | Threshold | Owner | Notification |
|------------|-----------|-----------|-------|---------------|
| **Known Non-Actionable** | `ignoreErrors` pattern (AbortError, ResizeObserver loop) | Any | None | No action |
| **Deprecation Warning** | Console `warn` level with deprecation pattern | > 20 in 1h | Assigned | Slack #alerts (async) |

---

## 3. Slack Alert Routing

| Slack Channel | Alert types |
|---------------|-------------|
| `#incidents` | P0 alerts only — pages on-call |
| `#alerts` | P1/P2 alerts — no pages, just async |
| `#deployments` | Deployment notifications + regression alerts |

### Slack Message Format (P0/P1)
```
:rotating_light: [P0/P1] <Alert Name>

**What:** <short description>
**Since:** <when it started>
**Impact:** <affected users %, error count>
**First seen:** <first event timestamp>

→ <Link to Sentry issue>
→ <Link to affected transaction/trace>
```

---

## 4. Issue Assignment & Ownership Workflow

### 4.1 New Issue Triage (within 24h of alert firing)

1. Open https://wisenoa.sentry.io → **Issues**
2. Set filter: `assigned: no` + `project: rent-ready` + `first-seen: -24h`
3. For each unassigned issue:
   - **P0/P1:** Assign to `on-call` (rotate weekly). On-call schedule managed in PagerDuty.
   - **P2:** Assign to `devops` (this project)
   - **P3:** Assign to `frontend` or close as `ignored`
4. Add labels: `frontend`, `backend`, `infra`, `auth`, `payments`, `db` (at least one)

### 4.2 Issue States

| State | Meaning | Action |
|-------|---------|--------|
| **Unresolved** | Active error, needs investigation | Assign and investigate |
| **Ignored** | Known non-actionable | Add to `ignoreErrors` in sentry.client.config.ts |
| **Resolved** | Fixed in deploy | Verify fix in next deploy |
| **Merged** | Duplicate of another issue | Link to primary, close duplicate |

### 4.3 Weekly Review

Every Monday at 09:00 (Paris time):
1. Review `#alerts` Slack channel summary
2. Check Sentry **Issue Stats** page — identify trending error families
3. Check **Performance** page — identify slow transactions
4. Create GitHub issues for any unresolved P2/P3 that need code fixes
5. Update this runbook if new error patterns emerge

---

## 5. CI/CD Integration (Automated Issue Triage)

### 5.1 Sentry Release Tracking

On every successful deploy, the pipeline:

1. Creates a Sentry release: `rent-ready@<git-sha>`
2. Associates the deploy with the release
3. Sentry automatically marks issues as "resolved" if no new events occur within 1h of deploy

**This is already configured** in the `deploy.yml` pipeline via `sentry-cli`:

```bash
# After a successful deploy, run:
sentry-cli releases deploys rent-ready@<GITHUB_SHA> new \
  --env production \
  --url "https://rentready.io"
```

**Action required:** Add `SENTRY_AUTH_TOKEN` and `SENTRY_ORG=wisenoa` to GitHub Secrets. The `sentry-cli releases deploys` step must be added to `deploy.yml`.

### 5.2 Deployment Regression Detection

When a new deploy introduces new errors:
1. Sentry fires the **"Deployment Regression"** alert (P1)
2. Pipeline posts to `#deployments` Slack channel
3. DevOps reviews and either:
   - Reverts the deploy (if severe), OR
   - Investigates and creates a fix PR within 2h

---

## 6. SLO Baselines & Error Budget (Sentry)

### 6.1 Crash-Free Rate Targets

| Environment | Target | Measurement |
|-------------|--------|-------------|
| Production | > 99.5% crash-free | Rolling 30 days |
| Staging | > 95% crash-free | Rolling 7 days |

**Crash-free rate** = `(1 - crashed_sessions / total_sessions) * 100`

View in Sentry: Projects → rent-ready → **Releases** → crash-free rate chart.

### 6.2 Error Budget (Monthly)

Based on 99.9% uptime SLO (from ERROR_BUDGET.md):

- Allowed error budget: **43 minutes 49 seconds** of downtime equivalent per month
- If error budget is **< 10% remaining**: freeze non-critical deployments
- If error budget is **exhausted**: halt all production deploys until budget resets

Track error budget burn at: https://wisenoa.sentry.io/projects/rent-ready/?environment=production

### 6.3 Latency SLOs

| Metric | Target | Sentry Transaction |
|--------|--------|-------------------|
| API p95 | < 1,000ms | All `/api/*` transactions |
| API p99 | < 3,000ms | All `/api/*` transactions |
| LCP (RUM) | < 2,500ms | Frontend performance |
| CLS (RUM) | < 0.1 | Frontend performance |
| INP (RUM) | < 200ms | Frontend performance |

---

## 7. Sentry Configuration Reference

### 7.1 Environment Variables

```bash
# Required
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/1234567

# Optional — for advanced features
SENTRY_ORG=wisenoa           # Sentry organization slug
SENTRY_PROJECT=rent-ready    # Project slug
SENTRY_AUTH_TOKEN=           # For sentry-cli (CI/CD only — never expose client-side)
```

### 7.2 Source Maps

Source maps are uploaded automatically via `@sentry/nextjs` webpack plugin (configured in `next.config.ts` with `withSentryConfig`).

Manual upload (if needed):
```bash
sentry-cli releases -o wisenoa -p rent-ready files <VERSION> upload-source-maps .next/
```

### 7.3 Ignore Patterns (already configured)

```typescript
// sentry.client.config.ts
ignoreErrors: [
  "Concurrent mutation detected",
  "AbortError",
  "ResizeObserver loop",
  "Non-Error promise rejection captured",
]
```

To add a new ignore pattern, update `sentry.client.config.ts` and open a PR.

---

## 8. Common Alert Response Actions

### 8.1 High Error Rate on `/api/properties`

1. Open Sentry issue → click "Hash" to get fingerprint
2. Go to Traces tab → find slow/erring transactions
3. Check: Is the DB query slow? Is the auth check failing? Is a downstream service down?
4. If DB: check Neon console for long-running queries
5. If auth: check Prisma schema / session handling
6. If integration (Stripe/email): check service status pages

**Quick mitigation:** If the error is in a non-critical route, add `/api/properties` to `denyUrls` temporarily while investigating.

### 8.2 Frontend Error Spike

1. Check Sentry's "User Bugs" view — are errors affecting logged-in users?
2. Look at Session Replay if available (replaysOnErrorSampleRate)
3. Identify if error is browser-specific (check Device/Browser breakdown)
4. If regression: check what changed in the last deploy
5. If new code: revert or hotfix within 2h

### 8.3 Latency Spike After Deploy

1. Check Sentry Performance → Latency histogram
2. Identify slow transaction — is it a specific route or all routes?
3. If DB: check for missing index or N+1 query
4. If external API: check timeout settings
5. If cold start (Edge): wait 5 minutes and re-check
6. If sustained: rollback deploy

### 8.4 Payment/Security Error

1. **DO NOT ignore.** Escalate to CTO immediately.
2. Check Stripe Dashboard for failed payments
3. Check Sentry trace for full request context
4. Do NOT rollback without CTO approval — payments may be in-flight

---

## 9. Alert Suppression & Maintenance Windows

For planned maintenance (e.g., database migration):
1. Go to Sentry → Project → Settings → Alert Rules
2. Set alert to "muted" for the maintenance window
3. Notify `#deployments` channel before muting
4. Unmute immediately after maintenance ends

**Never** mute P0 alerts for more than 1 hour without CTO approval.

---

## 10. Key Links

| Resource | URL |
|----------|-----|
| Sentry Dashboard | https://wisenoa.sentry.io |
| Sentry Issues (rent-ready) | https://wisenoa.sentry.io/projects/rent-ready |
| Sentry Performance | https://wisenoa.sentry.io/performance |
| Sentry Releases | https://wisenoa.sentry.io/releases |
| PagerDuty (on-call) | https://wisenoa.pagerduty.com |
| Status Page | https://rentready.io/status (when configured) |
| GitHub Actions | https://github.com/wisenoa/rent-ready/actions |
| ERROR_BUDGET.md | `docs/ERROR_BUDGET.md` |

---

*This document is reviewed monthly. Last reviewed: 2026-04-28*
