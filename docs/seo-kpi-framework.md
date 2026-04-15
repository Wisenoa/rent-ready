# SEO Metrics & KPI Framework — Integrated with Product KPIs
**Issue:** REN-180 | **Owner:** Product Manager | **Date:** 2026-04-15
**Status:** Active | **Review cycle:** Weekly (PM) + Quarterly (CEO)

---

## 1. SEO KPI DASHBOARD

This framework integrates SEO metrics into the core product management process.
Every sprint review includes the SEO health block below.

---

### 1.1 Acquisition KPIs (Source: Google Search Console + GA4)

| KPI | Baseline (Launch) | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|---|
| Organic sessions / month | 0 | 5,000 | 20,000 | 50,000 |
| Non-branded organic clicks | 0 | 4,500 | 18,000 | 45,000 |
| Indexed pages count | 10 | 50 | 150 | 300+ |
| Pages ranking top 10 | 0 | 5 | 20 | 60 |
| Pages ranking top 3 | 0 | 1 | 5 | 20 |
| Sitemap coverage (% indexed) | — | > 90% | > 95% | > 98% |
| Average ranking position (tracked keywords) | — | < 40 | < 25 | < 15 |

**Primary head terms to track weekly (Google Search Console):**

| Keyword | Volume (FR) | Intent | Current Position | Target (6 mo) |
|---|---|---|---|---|
| logiciel gestion locative | 5,400/mo | Commercial | — | Top 10 |
| gestion locative | 22,200/mo | Informational | — | Top 20 |
| quittance loyer gratuit | 8,100/mo | Transactional | — | Top 3 |
| modèle bail location | 6,600/mo | Transactional | — | Top 5 |
| calculateur IRL 2026 | 4,400/mo | Tool | — | Top 3 |
| état des lieux modèle | 9,900/mo | Transactional | — | Top 10 |
| lettre relance loyer impayé | 2,900/mo | Transactional | — | Top 5 |
| bail meublé vs bail vide | 1,600/mo | Informational | — | Top 5 |

---

### 1.2 Conversion KPIs (Source: GA4 + PostHog)

| KPI | Target | Measurement |
|---|---|---|
| Organic traffic → signup rate | > 2% | GA4 goal + PostHog funnel |
| Tool page → signup rate | > 5% | PostHog event: tool_used → signed_up |
| Blog article → signup rate | > 1% | PostHog event: blog_read → signed_up |
| Organic → trial start | > 1.5% | Stripe + GA4 attribution |
| Organic → paid conversion (30-day) | > 15% of trial starters | Stripe |
| Bounce rate (organic landing pages) | < 60% | GA4 |
| Pages per session (organic) | > 2.5 | GA4 |
| Avg session duration (organic) | > 2 min | GA4 |

---

### 1.3 Technical SEO KPIs (Source: Google Search Console + PageSpeed)

| KPI | Target | Tool | Review Frequency |
|---|---|---|---|
| Core Web Vitals LCP | < 2.5s (Good) | PageSpeed Insights | Every deploy |
| Core Web Vitals CLS | < 0.1 (Good) | PageSpeed Insights | Every deploy |
| Core Web Vitals INP | < 200ms (Good) | PageSpeed Insights | Every deploy |
| Mobile usability errors | 0 | Google Search Console | Weekly |
| HTTPS compliance | 100% | GSC Security tab | Monthly |
| Structured data errors | 0 | Rich Results Test | Per page launch |
| Crawl errors (404s) | < 5 | GSC Coverage | Weekly |
| Sitemap freshness | < 24h delay | Automated check | On deploy |
| Robots.txt blocks | 0 unintended | Manual audit | Monthly |
| Canonical URL errors | 0 | Screaming Frog / GSC | Monthly |

---

### 1.4 Content SEO KPIs (Source: GA4 + GSC + Content CMS)

| KPI | Target | Measurement |
|---|---|---|
| Articles published / month | 10+ (Month 1-2), 8+ (Month 3+) | Content calendar |
| Average word count per article | > 1,200 words | CMS metadata |
| Internal links per new page | ≥ 3 outbound, ≥ 2 inbound | Manual audit on publish |
| External backlinks earned / month | 5+ (Month 3+), 20+ (Month 6+) | Ahrefs / GSC |
| Content freshness: articles updated | 20% of library / quarter | CMS last-modified dates |
| Schema markup coverage | 100% of public pages | Rich Results Test |

---

## 2. SEO IMPACT ASSESSMENT PROCESS

For every new feature or page added to the product, the PM runs this checklist **before** adding to sprint:

### SEO Considerations — Mandatory Section in All Specs

```
## SEO Considerations (required for all public-facing features)

**Target keywords:** [list 1-3 primary keywords this feature/page targets]
**Search intent:** [informational / commercial investigation / transactional]
**Estimated monthly search volume:** [FR market estimate]
**Target URL:** [define before build begins]
**Meta title:** [55-60 chars, keyword-led]
**Meta description:** [140-160 chars, benefit-led]
**Schema markup required:** [Article / Product / FAQ / HowTo / Tool / None]
**Internal links:**
  - This page links to: [list 2-3 related pages]
  - This page should receive links from: [list 2-3 pages to update]
**Content dependencies:** [blog article, glossary entry, or tool page needed?]
**Crawl budget impact:** [negligible / low / medium — explain if medium+]
**E-E-A-T considerations:** [author bio needed? legal review needed? sources required?]
```

This section is **non-optional**. Features without it are returned to the author before sprint entry.

---

## 3. QUARTERLY SEO REVIEW PROCESS

### Schedule
- **Q2 2026 review:** July 1, 2026
- **Q3 2026 review:** October 1, 2026
- **Q4 2026 review:** January 1, 2027

### Review Agenda (2-hour session, PM + CEO)

1. Ranking dashboard review (30 min)
   - Top 20 keyword positions vs targets
   - Winners and losers this quarter
   - New keywords entering top 50

2. Traffic & conversion analysis (30 min)
   - Organic sessions trend
   - Conversion funnel: organic → trial → paid
   - Attribution of new signups to content

3. Technical SEO health (20 min)
   - Core Web Vitals pass rate
   - Index coverage changes
   - Crawl errors resolved / new issues

4. Competitive intelligence (20 min)
   - Competitor new pages or ranking movements
   - Content gaps we should close
   - New backlink opportunities

5. Roadmap adjustment (20 min)
   - Reprioritize SEO features based on results
   - Assign Q+1 content priorities
   - Define top 3 SEO focus areas for next quarter

### Quarterly SEO Review Output
- Written report posted as comment on this issue (REN-180)
- Roadmap updates reflected in PRODUCT_ROADMAP.md
- Content calendar updated in seo-content-roadmap.md

---

## 4. SEO IN SPRINT PLANNING

### Sprint Entry Gate (every 2-week sprint)

Before a story enters the sprint backlog, PM verifies:

- [ ] SEO Considerations section is filled in the spec
- [ ] Target URL is unique and defined
- [ ] Meta title + description written
- [ ] Schema markup type identified
- [ ] Internal linking plan drafted

### Minimum SEO Stories Per Sprint

Every sprint must include at least:
- 1 technical SEO story (crawlability, performance, schema, or sitemaps)
- 1 content SEO story (new page, article, or tool)
- 1 conversion SEO story (CTA optimization, landing page test, or signup flow improvement)

### SEO Acceptance Criteria (added to every public-facing story)

```
Given the page is deployed,
Then:
- [ ] PageSpeed score (mobile) >= 85
- [ ] LCP < 2.5 seconds on mobile
- [ ] Meta title present and < 60 characters
- [ ] Meta description present and < 160 characters
- [ ] Schema markup validates in Rich Results Test
- [ ] Canonical URL set correctly
- [ ] Page appears in sitemap.xml within 24h of deploy
- [ ] At least 2 internal links pointing to this page from existing pages
```

---

## 5. SEO DASHBOARD — IMPLEMENTATION PLAN

### Phase 1 (V1 — immediate): Manual Dashboard in Notion / Markdown

Weekly update to this file by PM:
- Pull from Google Search Console (weekly performance report)
- Pull from GA4 (organic channel report)
- Update ranking table for top 20 keywords
- Flag any technical issues from GSC alerts

### Phase 2 (V2 — Q3 2026): Automated SEO Monitoring

Implement lightweight automated monitoring:
- **GSC API** → pull clicks, impressions, average position for tracked keywords
- **PageSpeed API** → run Lighthouse on 10 key pages weekly
- **Uptime monitoring** → alert on 404/500 errors on key SEO pages
- **Sitemap check** → verify sitemap is updated post-deploy

Tools to evaluate:
- Ahrefs Alerts (backlink monitoring, ranking alerts)
- Screaming Frog scheduled crawls (monthly)
- SEOmonitor or Semrush for competitor tracking

### Phase 3 (V3 — 2027): Full SEO Intelligence Layer

- Custom SEO dashboard integrated into admin panel
- Real-time ranking alerts for tracked keywords
- Automated content gap detection vs competitors
- Revenue attribution model tying organic traffic to MRR

---

## 6. CURRENT SEO HEALTH SNAPSHOT

*To be updated weekly by PM*

| Date | Organic Sessions | Indexed Pages | Top 10 Keywords | Core Web Vitals |
|---|---|---|---|---|
| 2026-04-15 | (launch baseline TBD) | (launch baseline TBD) | 0 | (audit pending) |

**Key actions this week:**
- Submit sitemap to Google Search Console
- Set up GA4 organic channel report
- Run initial PageSpeed audit on all published pages
- Identify first 5 pages to track in GSC performance report

---

*Document owner: Product Manager (REN-180)*
*Last updated: 2026-04-15*
*Review cycle: Weekly update, Quarterly deep-dive*
