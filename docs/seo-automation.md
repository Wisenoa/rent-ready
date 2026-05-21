# SEO Automation — Sitemap Ping

> Owner: DevOps / Infrastructure  
> Last updated: 2026-05-21  
> Applies to: RentReady production (rent-ready.fr)

---

## 1. Overview

Every time new content is published (blog posts, calculator pages, guide pages, etc.), Google needs to be notified so it can recrawl and index the new pages quickly.

**What this automation does:**
1. Runs every **Monday at 07:00 UTC** via GitHub Actions
2. Sends the production `sitemap.xml` URL to Google Search Console via the sitemap ping API
3. Logs the result

This replaces manual "Submit to Google" steps and ensures indexing keeps pace with the content publishing cadence.

---

## 2. How It Works

### Trigger

The workflow runs on a schedule and can also be triggered manually from the GitHub Actions UI.

```
Schedule:  0 7 * * 1   # Every Monday at 07:00 UTC
Manual:    workflow_dispatch   # On-demand via GitHub Actions
```

### Sitemap URL

The ping always targets the production sitemap:
```
https://rent-ready.fr/sitemap.xml
```

> **Note:** Next.js serves `/sitemap.xml` automatically from `src/app/sitemap.ts`. The file is regenerated on every build/deploy, so the ping reflects the latest content.

### Google Ping Endpoint

```
GET https://www.google.com/ping?sitemap=https://rent-ready.fr/sitemap.xml
```

Google returns HTTP 200 if the ping is accepted. Any other code triggers a workflow failure alert.

---

## 3. Files

```
.github/workflows/sitemap-ping.yml   # The GitHub Actions workflow
docs/seo-automation.md                # This file
```

---

## 4. Verification

### Check the workflow ran

1. Go to: https://github.com/wisenoa/rent-ready/actions
2. Click **Sitemap Ping — Weekly**
3. Check the latest run status (green checkmark = success)

### Verify Google received the ping

1. Go to https://search.google.com/search-console
2. Select the **rent-ready.fr** property
3. Navigate to **Sitemaps**
4. The "Last read" timestamp should update after the ping

### Manual trigger

```bash
# Via GitHub CLI (if gh is authenticated)
gh workflow run sitemap-ping.yml
```

---

## 5. Troubleshooting

### Workflow fails with non-200 from Google

- Google sometimes rate-limits or returns 500 temporarily. The workflow will auto-retry on the next scheduled run.
- Check https://developers.google.com/search for sitemap errors
- If persistent, manually submit via Google Search Console UI

### Sitemap not found (404)

- Ensure `NEXT_PUBLIC_APP_URL` Vercel project variable is set to `https://rent-ready.fr`
- Check that `src/app/sitemap.ts` exists and builds without errors
- A failed deploy would mean the sitemap route is missing

### No updates in Google Search Console after ping

- Google processes pings asynchronously. Allow 24-48 hours.
- Check the Coverage report in Search Console for indexing status
- New pages may show as "Discovered — currently not indexed" if they need quality evaluation

---

## 6. Related Documentation

| Document | Purpose |
|---|---|
| `docs/runbook.md` | Uptime monitoring and alerting |
| `docs/SENTRY_RUNBOOK.md` | Error monitoring and alerting |
| `docs/ERROR_BUDGET.md` | SLO/error budget tracking |
| `docs/seo-keyword-strategy.md` | SEO strategy and keyword targets |
| `docs/seo-content-roadmap.md` | Content publishing cadence |

---

*Last reviewed: 2026-05-21*