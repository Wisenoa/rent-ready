# Error Budget & SLO Policy — RentReady

> Owner: DevOps / Infrastructure  
> Last updated: 2026-04-13  
> Applies to: Production environment (rentready.io)

---

## 1. Service Level Objectives (SLOs)

| Metric | Target | Measurement window |
|--------|--------|-------------------|
| Uptime (availability) | 99.9% | Rolling 30 days |
| API p95 latency | < 1 s | Rolling 7 days |
| API p99 latency | < 3 s | Rolling 7 days |
| Error rate (5xx) | < 0.1% of requests | Rolling 24 hours |
| Core Web Vitals — LCP | < 2.5 s | Monthly median |
| Core Web Vitals — CLS | < 0.1 | Monthly median |

### Uptime math
- 99.9% uptime = 43 minutes 49 seconds of allowed downtime per month
- 99.5% uptime = 3 hours 39 minutes of allowed downtime per month

We target **99.9%**. Once the error budget is exhausted, no non-critical deployments
until the budget resets or the underlying issue is resolved.

---

## 2. What Constitutes an Incident?

An incident is any condition that:

- Causes `/api/health` to return non-200 for more than 1 minute
- Causes any core user-facing API (login, properties, leases, payments) to return
  5xx errors at a rate > 5% over 5 consecutive minutes
- Causes Sentry to fire > 50 new unique errors in < 10 minutes
- Results in data loss or data corruption for any user
- Results in a payment processing failure that cannot be automatically retried

**Not incidents** (tracked separately as bugs):
- Individual UI rendering glitches not affecting functionality
- Slow performance (> SLO target but < 5 s)
- Single-user auth edge cases

---

## 3. Severity Levels

### P0 — Critical (Site Down / Data Loss)
- Definition: Service completely unavailable or data integrity at risk
- Response SLA: **< 5 minutes** (on-call paged immediately)
- Resolution SLA: **< 1 hour**
- Examples: DB connection failure, payment processor down, auth system broken

### P1 — High (Major Feature Broken)
- Definition: A core user flow is broken for all or many users
- Response SLA: **< 15 minutes**
- Resolution SLA: **< 2 hours**
- Examples: Cannot create property, cannot upload document, lease creation fails

### P2 — Medium (Degraded Experience)
- Definition: Feature partially broken or degraded for a subset of users
- Response SLA: **< 1 hour** (next business hours if outside working hours)
- Resolution SLA: **< 8 hours**
- Examples: Slow page loads, minor UI bug affecting workflow

### P3 — Low (Minor / Cosmetic)
- Definition: Cosmetic issues, minor inconvenience, workaround exists
- Response SLA: **Next sprint**
- Resolution SLA: **Next sprint**

---

## 4. Escalation Path

```
User reports / Uptime alert fires
       ↓
  On-call engineer acknowledges (within response SLA)
       ↓
  Assess severity (P0 / P1 / P2 / P3)
       ↓
  P0/P1: Pull in CTO + DevOps immediately
  P2/P3: Create GitHub issue, assign to next sprint
       ↓
  Incident channel opened in Slack: #incidents
       ↓
  Status page updated (if P0/P1)
       ↓
  Resolution deployed + verified
       ↓
  Post-mortem written within 48 hours (P0/P1 mandatory)
```

### Key contacts
| Role | Responsibility |
|------|---------------|
| On-call Engineer | First responder, owns acknowledgement |
| CTO | P0/P1 escalation, architectural decisions |
| DevOps Engineer | Infrastructure, deployment rollback |

---

## 5. Monitoring & Alerting Stack

| Tool | Purpose | Config location |
|------|---------|----------------|
| UptimeRobot (free) | Uptime checks every 1 min against `/api/health` | External — dashboard.uptimerobot.com |
| Sentry | Error capturing (frontend + backend) + SLO tracking | `sentry.client.config.ts`, `sentry.server.config.ts`, `docs/SENTRY_RUNBOOK.md` |
| Vercel Analytics | Core Web Vitals, page performance | Vercel dashboard |
| GitHub Actions | CI/CD build health | `.github/workflows/` |

### Health check endpoint
```
GET https://rentready.io/api/health
```
Expected response (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-04-13T17:00:00.000Z",
  "version": "0.1.0",
  "environment": "production",
  "checks": {
    "database": { "status": "healthy", "latency": 12 },
    "redis": { "status": "not_configured" },
    "storage": { "status": "not_configured" }
  }
}
```

Alert fires when: 3 consecutive checks fail (= ~3 minutes of downtime detected)

---

## 6. Uptime Monitoring Setup (UptimeRobot)

To configure uptime monitoring (requires a free UptimeRobot account at uptimerobot.com):

1. Create account at https://uptimerobot.com (free tier: 50 monitors, 5-min intervals)
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://rentready.io/api/health`
   - Monitoring interval: 1 minute (paid) or 5 minutes (free)
   - Alert when: 3 consecutive failures
3. Add alert contacts: on-call engineer email + Slack webhook
4. (Optional) Public status page for user-facing transparency

Free tier limitations: 5-minute check interval, 50 monitors, email alerts only.
For 1-minute intervals and Slack/PagerDuty integration, upgrade to Pro ($7/mo).

---

## 7. Post-Mortem Template

Every P0/P1 incident requires a post-mortem within 48 hours of resolution.
File as: `docs/postmortems/YYYY-MM-DD-short-title.md`

```markdown
## Incident: [Short title]
**Date:** YYYY-MM-DD  
**Severity:** P0 / P1  
**Duration:** X hours Y minutes  
**Impact:** [What users were affected, how many, what functionality]

## Timeline
- HH:MM — [Event]
- HH:MM — [Event]

## Root Cause
[Technical explanation of what went wrong]

## Resolution
[What was done to resolve the incident]

## Contributing Factors
[What conditions enabled this incident to occur]

## Action Items
| Action | Owner | Due |
|--------|-------|-----|
| [Preventative measure] | [name] | [date] |

## Lessons Learned
[What we learned and how we improve]
```

---

## 8. Error Budget Burn Rate

If the error budget is burning faster than expected:

| Burn rate | Action |
|-----------|--------|
| < 1x (on track) | Normal operations |
| 1–2x (elevated) | Review recent deployments, monitor closely |
| 2–5x (fast burn) | Freeze non-critical deployments, investigate |
| > 5x (critical burn) | Invoke incident response, rollback if needed |

---

*This document should be reviewed quarterly or after any P0/P1 incident.*
