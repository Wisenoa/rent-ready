# Uptime Monitoring & Alerting Runbook
> Owner: DevOps / Infrastructure
> Last updated: 2026-05-21
> Applies to: RentReady production (rent-ready.fr and rentready.io)

---

## 1. Overview

Uptime monitoring detects when the site becomes unavailable or returns errors, so the team can respond before users are heavily impacted. Googlebot penalizes sites with poor uptime, making this critical for SEO as well as user experience.

**SLO target: 99.9% uptime** (43 min downtime/month max). If uptime drops below 99.5%, open a P1 incident.

---

## 2. Monitored Endpoints

All four URLs are monitored via **UptimeRobot** (free tier). Each monitor checks every 5 minutes from multiple geographic locations.

| Monitor Name | URL | Alert Condition |
|---|---|---|
| rent-ready.fr — Homepage | https://rent-ready.fr/ | HTTP status != 2xx |
| rent-ready.fr — IRL 2026 Guide | https://rent-ready.fr/guides/irl-2026 | HTTP status != 2xx |
| rent-ready.fr — Register | https://rent-ready.fr/register | HTTP status != 2xx |
| rent-ready.fr — Login | https://rent-ready.fr/login | HTTP status != 2xx |
| rent-ready.fr — API Health | https://rent-ready.fr/api/health | HTTP status != 200 |

> **Note:** `/api/health` also covered by Sentry alerting (SENTRY_RUNBOOK.md). UptimeRobot provides external, independent verification.

---

## 3. UptimeRobot Configuration

### 3.1 Account

- Dashboard: https://dashboard.uptimerobot.com
- Account type: Free tier (50 monitors, 5-min intervals, email only)
- Upgrade to Pro ($7/mo) for: 1-min intervals, Slack/PagerDuty integration, public status page

### 3.2 Adding a Monitor

1. Log in to UptimeRobot → click **+ Add New Monitor**
2. Configure each monitor:

```
Monitor Type:       HTTP(s)
Friendly Name:      rent-ready.fr — Homepage
URL:                https://rent-ready.fr/
HTTP Method:        GET
Monitoring Interval: 5 minutes (free) / 1 minute (Pro)
Status:             Enabled
```

3. For **Alert When Site Is Down**: set to **1** (alert on first failure, no wait)

### 3.3 Alert Contacts

Configure alert contacts in **My Settings → Alert Contacts**:

| Contact Type | Value | Purpose |
|---|---|---|
| Email | devops@rentready.io | Primary alert |
| Email | cto@rentready.io | CTO escalation |
| Slack webhook | #incidents channel | Real-time notification |

> To add Slack: Create an **Incoming Webhook** in Slack workspace → copy webhook URL → add as "Slack" alert contact in UptimeRobot.

### 3.4 Alert Conditions

By default UptimeRobot fires when:
- HTTP status is NOT 2xx or 3xx
- Response time exceeds 30 seconds (timeout)
- No response received (connection refused)

**Custom alert logic**: Alert fires on **any non-2xx** response for all four application URLs.

---

## 4. Alert Response Procedure

When UptimeRobot fires an alert:

```
Step 1 — Acknowledge
  UptimeRobot sends email/Slack → on-call engineer acknowledges

Step 2 — Classify severity
  P0: Site completely down (all 4 monitors failing)      → Page CTO immediately
  P1: Major route failing (/, /register, /login)          → Respond < 15 min
  P2: Non-critical route failing (/guides/irl-2026)       → Respond < 1h
  P3: Single alert, self-resolved                       → Log and monitor

Step 3 — Check /api/health
  curl https://rent-ready.fr/api/health
  Expected: {"status": "healthy", ...}

Step 4 — Check Vercel dashboard
  https://vercel.com/wisenoa/rent-ready

Step 5 — Check Sentry
  https://wisenoa.sentry.io → look for errors after last deploy

Step 6 — Resolve or escalate
  If self-resolved: log in UptimeRobot, close alert
  If ongoing: invoke incident response per ERROR_BUDGET.md
```

---

## 5. Uptime SLIs

### 5.1 Monthly Uptime Calculation

```
Uptime % = (total minutes in month - downtime minutes) / total minutes in month * 100

Example (30-day month):
  Total:     43,200 minutes
  Downtime:  30 minutes
  Uptime:    (43,200 - 30) / 43,200 * 100 = 99.93%
```

### 5.2 Error Budget

| Uptime | Downtime/month | Status |
|--------|----------------|--------|
| 99.9% (target) | 43 min | On track |
| 99.5% | 3h 39min | P1 — investigate |
| 99.0% | 7h 18min | P0 — freeze non-critical deploys |

### 5.3 Tracking

- UptimeRobot dashboard shows uptime % per monitor per month
- Record monthly uptime in KPI log (see Q2-OKR-PLAN.md)
- If uptime drops below 99.5% for any route, open a post-mortem (see ERROR_BUDGET.md §7)

---

## 6. Synthetic Monitoring (Future — Grafana)

For richer monitoring with real-browser synthetic checks (Core Web Vitals in CI):

> **Planned upgrade:** Migrate to Grafana Cloud + synthetic browser checks for:
> - Real User Monitoring (RUM) — Core Web Vitals from real users
> - Synthetic checks — Lighthouse scores from Grafana's global network
> - dashboards for uptime, latency, and CWV trends

**Setup when upgrading**:
1. Create Grafana Cloud account: https://grafana.com/cloud
2. Add **Grafana Synthetic Monitoring** app
3. Add check per URL: HTTP, 1-min interval, Paris + Frankfurt locations
4. Set SLO: 99.9% uptime, p95 latency < 2s
5. Import existing ERROR_BUDGET.md SLOs into Grafana SLO definitions

---

## 7. Runbook Maintenance

- **Review**: Monthly (aligns with Sentry weekly review)
- **Update triggers**: New production routes, new subdomains, SLA changes
- **Escalation contact**: CTO → DevOps

---

## 8. Key Links

| Resource | URL |
|---|---|
| UptimeRobot Dashboard | https://dashboard.uptimerobot.com |
| Sentry Runbook | `docs/SENTRY_RUNBOOK.md` |
| Error Budget | `docs/ERROR_BUDGET.md` |
| Vercel Deployments | https://vercel.com/wisenoa/rent-ready |
| API Health | https://rent-ready.fr/api/health |
| Sentry | https://wisenoa.sentry.io |

---

*Last reviewed: 2026-05-21*