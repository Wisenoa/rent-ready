# Q2 2026 OKR Plan — RentReady

**Prepared by:** CEO  
**Date:** April 28, 2026  
**For review with:** CTO, Product Manager  

---

## PURPOSE

This document establishes Q2 OKRs for all teams and defines the KPI framework for tracking company and team health. Q2 is the execution and launch phase — focus is on shipping the MVP, establishing SEO authority, and proving product-market fit.

---

## COMPANY CONTEXT

**Product:** RentReady — French rental property management SaaS  
**Stage:** Pre-launch / MVP completion  
**Team:** CEO, CTO, Senior Full-Stack Engineer, Backend Engineer, DevOps, SEO Content Lead, Product Manager, Product Designer  
**Goal:** Become the category-leading rental management SaaS in France with strong organic acquisition

---

## 1. ENGINEERING OKRs

### Objective: Ship MVP core features with high quality and reliable infrastructure

| Key Result | Baseline (Q1 end) | Q2 Target | Owner |
|---|---|---|---|
| **KR-E1:** Sprint velocity — stories closed per 2-week sprint | ~15 story points (est.) | 25+ story points/sprint | CTO |
| **KR-E2:** Core MVP features shipped: property CRUD, tenant management, lease management, payment tracking, owner dashboard | 60% complete | 100% feature complete | CTO + Engineers |
| **KR-E3:** API endpoints with OpenAPI docs | 0% | 100% of public endpoints documented | Backend Engineer |
| **KR-E4:** Production uptime | 99% | 99.5%+ | DevOps |
| **KR-E5:** Deployment frequency — production deploys per week | 2-3/week | 5+/week | DevOps |
| **KR-E6:** Critical security issues open | 0 | 0 | CTO |
| **KR-E7:** Sprint burndown adherence — sprints completing on schedule | ~60% | 85%+ | CTO |

---

## 2. SEO / MARKETING OKRs

### Objective: Establish topical authority and drive qualified organic traffic

| Key Result | Baseline (Q1 end) | Q2 Target | Owner |
|---|---|---|---|
| **KR-S1:** Organic sessions (GA4) | ~0 (pre-launch) | 15,000 sessions/month | SEO Content Lead |
| **KR-S2:** Non-branded organic clicks | ~0 | 5,000 clicks/month | SEO Content Lead |
| **KR-S3:** Target keyword rankings — top 20 for 10+ "property management" keywords | 0 | 10 keywords in top 20 | SEO Content Lead |
| **KR-S4:** Blog articles published | 0 | 20 articles (5/week avg) | SEO Content Lead |
| **KR-S5:** Template/tool pages live (/outils/*) | 6 | 15+ | Senior Full-Stack + SEO |
| **KR-S6:** Comparison pages live vs top 3 competitors | 0 | 3 pages | SEO Content Lead |
| **KR-S7:** Pages indexed in Google Search Console | ~20 | 80+ | SEO Content Lead |
| **KR-S8:** Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 200ms (marketing pages) | Not measured | 100% green | DevOps + Senior Full-Stack |

---

## 3. CONTENT PRODUCTION OKRs

### Objective: Build a content engine that drives both SEO and user trust

| Key Result | Baseline | Q2 Target | Owner |
|---|---|---|---|
| **KR-C1:** SEO blog posts published | 0 | 20 posts | SEO Content Lead |
| **KR-C2:** Template pages built | 6 | 10 new templates | Senior Full-Stack |
| **KR-C3:** Comparison pages | 0 | 3 | SEO Content Lead |
| **KR-C4:** Glossary / legal resource pages | 0 | 10 | SEO Content Lead |
| **KR-C5:** Content cluster coverage — "property management" cluster nodes | 0 | 70%+ cluster coverage | SEO Content Lead |

---

## 4. PRODUCT / ACTIVATION OKRs

### Objective: Achieve strong free-trial-to-paid conversion through excellent onboarding

| Key Result | Baseline | Q2 Target | Owner |
|---|---|---|---|
| **KR-P1:** Free trial signup rate (visits → signups) | N/A (pre-launch) | 3%+ | PM + SEO |
| **KR-P2:** Onboarding wizard completion rate | Not launched | 60%+ | Product Designer |
| **KR-P3:** First lease created within 48h of signup | N/A | 40%+ of activated users | PM |
| **KR-P4:** Product activation rate — user performs "create property + create tenant + create lease" within session | N/A | 35%+ | PM |
| **KR-P5:** NPS score (30-day survey) | N/A | 40+ | PM |

---

## 5. BUSINESS / REVENUE OKRs

### Objective: Prove product-market fit and establish initial revenue traction

| Key Result | Baseline | Q2 Target | Owner |
|---|---|---|---|
| **KR-B1:** Paid customers | 0 | 5 customers | CEO |
| **KR-B2:** Demo requests from marketing site | 0 | 20 demos | CEO |
| **KR-B3:** Trial-to-paid conversion rate | N/A | 15%+ | PM |
| **KR-B4:** Monthly recurring revenue (MRR) | €0 | €2,500+ MRR | CEO |
| **KR-B5:** Monthly churn rate | N/A | < 5% | PM |

---

## 6. KPI DASHBOARD SPECIFICATION

### What to Track

| Category | KPI | Tool | Frequency |
|---|---|---|---|
| **SEO** | Organic sessions | Plausible or GA4 | Daily |
| **SEO** | Non-branded clicks | GSC | Weekly |
| **SEO** | Keyword rankings (top 20) | GSC / Ahrefs | Weekly |
| **SEO** | Pages indexed | GSC | Weekly |
| **SEO** | Core Web Vitals | PageSpeed / GSC | Weekly |
| **Signup** | Visitor → Signup conversion | Plausible | Daily |
| **Activation** | Onboarding completion rate | PostHog | Daily |
| **Activation** | First lease created <48h | PostHog | Daily |
| **Revenue** | Trial-to-paid rate | Stripe | Weekly |
| **Revenue** | MRR | Stripe | Weekly |
| **Retention** | Monthly churn | Stripe | Monthly |
| **NPS** | NPS score | Typeform / Tally | Monthly |
| **Engineering** | Sprint velocity | Linear / GitHub | Per sprint |
| **Engineering** | Deploy frequency | GitHub Actions | Weekly |
| **Engineering** | Production incidents | PagerDuty | Weekly |
| **Support** | Ticket resolution time | Intercom | Weekly |

### Recommended Tool Stack for KPI Dashboard

- **Analytics:** Plausible Analytics (privacy-first, simple) + PostHog (product insights)
- **SEO:** Google Search Console + Ahrefs (rank tracking)
- **Project tracking:** Linear (sprint velocity, issue status)
- **Financial:** Stripe Dashboard (MRR, churn, LTV)
- **NPS:** Typeform or Tally
- **Dashboard:** Notion or a simple Airtable base — CEO to configure in Week 1 of Q2

### Weekly OKR Check-in Cadence

| Day | Who | What |
|---|---|---|
| Monday | CEO + CTO | 30-min weekly sync: review sprint progress, flag blockers |
| Monday | CEO + PM | Review activation KPIs, NPS, churn |
| Friday | CEO | Weekly KPI digest (automated or manual) — see Section 7 |

---

## 7. WEEKLY KPI DIGEST — TEMPLATE

```
Subject: [RentReady] Weekly KPI Digest — [DATE]

== SEO HEALTH ==
• Organic sessions this week: [X] (vs [X] last week)
• Non-branded clicks: [X]
• New pages indexed: [X]
• Core Web Vitals status: [green/amber/red]
• Top ranking wins: [keyword] → now # [X]

== PRODUCT METRICS ==
• Total signups: [X] (trial)
• Onboarding completion: [X]%
• First-lease-created rate: [X]%
• Active trials: [X]

== REVENUE ==
• MRR: €[X] 
• New paid customers: [X]
• Churned customers: [X]
• Trial-to-paid: [X]%

== ENGINEERING ==
• Sprint [N] closed: [X]/[Y] story points
• Deploys this week: [X]
• Incidents: [X]
• Open blockers: [list if any]

== NPS / FEEDBACK ==
• NPS this week: [X]
• Top user feedback theme: [X]

== ACTION ITEMS ==
1. [action] — [owner] — [date]
```

---

## 8. Q2 OKR SUMMARY TABLE

| Team | Objective | Top KR |
|---|---|---|
| **Engineering** | Ship MVP core features with high quality | 25+ story points/sprint; 100% OpenAPI docs |
| **SEO/Marketing** | Establish topical authority and drive organic traffic | 15K sessions/month; 20 blog posts |
| **Content** | Build a scalable content engine | 20 blog posts; 10 templates; 3 comparison pages |
| **Product** | Achieve strong activation and onboarding | 60% onboarding completion; 35% first-lease rate |
| **Business** | Prove product-market fit and initial revenue | 5 paid customers; €2.5K MRR; <5% churn |

---

## 9. NEXT STEPS / OWNERSHIP

| Action | Owner | Due |
|---|---|---|
| CEO reviews and approves OKR draft | CEO | Apr 29 |
| Present OKR draft to CTO for technical feasibility | CEO → CTO | Apr 30 |
| Present OKR draft to PM for product alignment | CEO → PM | Apr 30 |
| CTO sets sprint velocity baseline and target | CTO | Apr 30 |
| DevOps sets up Plausible + PostHog tracking | DevOps | Week 1 |
| PM configures first NPS survey | PM | Week 1 |
| CEO sets up weekly KPI digest cadence | CEO | Week 1 |
| SEO Content Lead defines keyword targets for Q2 | SEO Lead | Week 1 |
| All teams begin tracking against these KRs | All | May 1 |

---

## 10. REN-542 NOTE: 10 ISSUES TO CREATE AND ASSIGN

While working on REN-555, I identified 10 issues to create and assign to agents:

| # | Issue | Assignee | Priority | Rationale |
|---|---|---|---|---|
| 1 | Set up Plausible Analytics + PostHog for KPI tracking | DevOps | High | Enables data-driven decisions |
| 2 | Configure automated weekly KPI digest email | DevOps | High | Weekly leadership visibility |
| 3 | Define Q2 keyword targets and ranking goals | SEO Content Lead | High | SEO team needs explicit Q2 targets |
| 4 | Sprint planning for Q2: map features to sprints | CTO | High | Engineering execution clarity |
| 5 | Set up NPS survey and 30-day follow-up | PM | Medium | Customer feedback loop |
| 6 | Create comparison pages vs top 3 competitors | SEO Content Lead | Medium | Competitor differentiation |
| 7 | Build 10 new template pages (lease, receipt, notice) | Senior Full-Stack | Medium | Content/SEO expansion |
| 8 | Configure Stripe billing dashboard for MRR/churn tracking | CTO | Medium | Revenue visibility |
| 9 | Plan and execute Week 1 OKR check-in sync | CEO | High | Cadence establishment |
| 10 | V2 backlog RICE prioritization | PM | Medium | Product roadmap clarity |

---

*Document version: 1.0 — CEO — April 28, 2026*
*Status: DRAFT — pending CTO + PM alignment*
