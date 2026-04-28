# Q2 Sprint Plan — RentReady Engineering
**Issue:** REN-563 | **Owner:** CTO | **Date:** April 28, 2026
**Status:** Draft | **Horizon:** Q2 2026 (8 sprints x 2 weeks)
**Reference:** Q2 OKR Plan, V1 MVP PRD, V2 Backlog RICE (REN-557)

---

## 1. SPRINT VELOCITY TARGET

| Metric | Baseline | Q2 Target |
|--------|----------|-----------|
| Story points / sprint | ~15 SP (est.) | **25+ SP/sprint** |
| Sprint burndown adherence | ~60% | **85%+** |
| Critical security issues open | 0 | **0** |
| OpenAPI docs coverage | 0% | **100%** |

**Story point scale (used):** 1 = half-day, 2 = 1 day, 3 = 1.5 days, 5 = 2-3 days, 8 = 4-5 days

---

## 2. Q2 ENGINEERING CONTEXT

### Completed V1 Features (as of Apr 28)
- Property CRUD + archive
- Tenant management (list + detail page)
- Lease creation + renewal + detail page + PDF generation
- Rent payment tracking + MarkPaidButton + quittance PDF auto-generation (REN-40)
- Owner dashboard (summary view)
- Onboarding wizard
- Stripe billing (subscription + one-time)
- Maintenance ticket tracking (basic)
- Marketing site: homepage, feature pages, pricing, blog, outils/templates
- SEO infrastructure: sitemap, robots, hreflang, schema markup
- E2E test suite (WCAG 2.1 AA)
- Accessibility audit + fixes
- CI/CD with Sentry alerting
- Prisma production migration workflow

### Remaining V1 Gaps (must ship early Q2)
1. Analytics instrumentation (PostHog events on core actions) — **blocks KR-P1/P3/P4 measurement**
2. Onboarding completion rate tracking
3. Dashboard KPI wiring to real data (some gaps remain)
4. OpenAPI docs for all public endpoints (KR-E3)
5. Backend audit critical fixes (REN-33): PrismaClient singleton, path traversal, webhook idempotency

### V2 Phase 1 Features (from RICE — ship in Q2)
1. **F1: Accounting CSV/PDF export** — RICE 9.00
2. **F3: Inspection reports PDF (etat des lieux)** — RICE 12.00
3. **F2: Tenant portal** — RICE 9.00
4. **F4: Lease renewal workflow + auto-reminder** — RICE 7.00
5. **F18: Smart rent reminders** — RICE 3.20

---

## 3. SPRINT PLAN

### Sprint 0 — "Foundation & Finishing V1" (May 1-14, 2026)
**Theme:** Close V1 gaps, enable Q2 measurement

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S0-1 | Analytics instrumentation (PostHog) | 5 | Senior Full-Stack | Fire events: property.created, tenant.created, lease.created, payment.marked_paid, template.downloaded. Wire to PostHog. Blocks KR-P1/P3/P4 |
| S0-2 | Onboarding wizard completion rate | 3 | Senior Full-Stack | Track onboarding step events; connect to PostHog funnel |
| S0-3 | Backend audit critical fixes (REN-33) | 5 | Backend Engineer | Fix: PrismaClient singleton (health endpoint), path traversal (file upload), Stripe webhook idempotency |
| S0-4 | Dashboard KPI wiring gaps | 3 | Senior Full-Stack | Connect remaining dashboard aggregates to real DB queries |
| S0-5 | OpenAPI docs - public endpoints | 5 | Backend Engineer | Document all /api/* routes: properties, tenants, leases, payments, auth. KR-E3 |

**Total: 21 SP**

---

### Sprint 1 — "Inspection Reports + Accounting Export" (May 15-28, 2026)
**Theme:** V2 highest-RICE features; tax season prep

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S1-1 | Inspection report PDF (F3) - backend | 5 | Backend Engineer | POST /api/inspections, data model, PDF generation logic |
| S1-2 | Inspection report PDF (F3) - frontend | 5 | Senior Full-Stack | /inspections/new, /inspections/[id]/page.tsx, PDF download |
| S1-3 | Accounting CSV/PDF export (F1) - backend | 5 | Backend Engineer | Tax year transactions -> CSV + PDF. Covers: rent, charges, deposits |
| S1-4 | Accounting export (F1) - frontend | 3 | Senior Full-Stack | /accounting/export page, year/property selector, download buttons |
| S1-5 | OpenAPI docs - remaining | 2 | Backend Engineer | Finish any undocumented endpoints |

**Total: 20 SP**

---

### Sprint 2 — "Tenant Portal" (May 29 - Jun 11, 2026)
**Theme:** Virality + activation; tenant self-service

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S2-1 | Tenant portal - auth (magic link) | 3 | Backend Engineer | GET /api/tenant/lease, validate tenant token, serve lease data |
| S2-2 | Tenant portal - quittance history | 3 | Senior Full-Stack | /tenant/quittances - list + download PDFs for tenant |
| S2-3 | Tenant portal - maintenance submission | 5 | Senior Full-Stack | POST /api/tenant/maintenance, form, confirmation flow |
| S2-4 | Tenant portal - profile/contact | 2 | Senior Full-Stack | View/edit tenant contact info, lease summary |
| S2-5 | Tenant invite flow (landlord side) | 3 | Senior Full-Stack | Landlord sends invite -> email with magic link -> tenant onboarding |

**Total: 16 SP**

---

### Sprint 3 — "Lease Renewals + Reminders" (Jun 12-25, 2026)
**Theme:** Retention; prevent lease lapse

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S3-1 | Lease renewal workflow (F4) - backend | 5 | Backend Engineer | Lease status: active->renewal_due at 60 days; renewal form, new lease from template |
| S3-2 | Lease renewal workflow (F4) - frontend | 5 | Senior Full-Stack | /leases/[id]/renew, comparison view, PDF regeneration |
| S3-3 | Smart rent reminders (F18) - backend | 3 | Backend Engineer | Cron: 5 days before due date -> send email reminder; 3 days late -> escalation |
| S3-4 | Smart rent reminders (F18) - frontend | 2 | Senior Full-Stack | Settings page: configure reminder timing, enable/disable per tenant |
| S3-5 | Email templates (French) | 3 | Senior Full-Stack | Responsive transactional email templates: reminder, late notice, renewal notice |

**Total: 18 SP**

---

### Sprint 4 — "Polish + Security + Performance" (Jun 26 - Jul 9, 2026)
**Theme:** Hardening; pre-launch to paid customers

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S4-1 | Rate limiting - tenant portal routes | 3 | Backend Engineer | /api/tenant/* rate limit; prevent brute force on magic link |
| S4-2 | Input validation hardening | 3 | Backend Engineer | Length limits, SQL injection audit, XSS audit (OWASP Top 10) |
| S4-3 | Error tracking - Sentry full wiring | 2 | DevOps | Ensure all server actions + API routes emit structured errors to Sentry |
| S4-4 | Core Web Vitals optimization | 5 | Senior Full-Stack | LCP < 2.5s, CLS < 0.1, INP < 200ms across marketing + app pages |
| S4-5 | Database query optimization | 3 | Backend Engineer | Add missing indexes; fix N+1 queries on dashboard, lease list, tenant list |
| S4-6 | Security: CORS, CSRF, XSS final audit | 3 | Backend Engineer | Verify all protections correctly configured; document in runbook |
| S4-7 | Staging environment mirror | 2 | DevOps | Verify staging = production config; test deploy pipeline |

**Total: 21 SP**

---

### Sprint 5 — "Multi-user + Portfolio + Scaling" (Jul 10-23, 2026)
**Theme:** Agency/portfolio ICP foundations; prepare for V2 Phase 2

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S5-1 | Multi-user / agency mode - data model | 5 | Backend Engineer | Organization.roles: owner/admin/member/viewer; team invites |
| S5-2 | Portfolio dashboard (F8) - backend | 5 | Backend Engineer | Aggregate across properties: NOI, occupancy rate, vacancy tracking |
| S5-3 | Portfolio dashboard (F8) - frontend | 5 | Senior Full-Stack | /dashboard/portfolio view; toggle between solo/portfolio |
| S5-4 | Document vault - file upload (F5) | 3 | Senior Full-Stack | S3 upload; document categorization; lease document auto-attach |
| S5-5 | API pagination - all list endpoints | 3 | Backend Engineer | Add cursor/offset pagination to /properties, /tenants, /leases, /transactions |

**Total: 21 SP**

---

### Sprint 6 — "V2 Phase 2 Launch" (Jul 24 - Aug 6, 2026)
**Theme:** Ship V2 Phase 2 features; drive activation metrics

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S6-1 | Charges reconciliation (F6) - backend | 5 | Backend Engineer | Provision vs real charges; regularization calculation |
| S6-2 | Charges reconciliation (F6) - frontend | 5 | Senior Full-Stack | /leases/[id]/charges page; regularization workflow |
| S6-3 | Owner statement PDF (F11) | 3 | Senior Full-Stack | Per-owner annual summary: revenue, expenses, net income |
| S6-4 | Multi-user UI (S5-1 continuation) | 5 | Senior Full-Stack | Team management page; permission indicator in nav; invite flow |
| S6-5 | Maintenance ticket enhancements | 3 | Senior Full-Stack | Photo uploads, status workflow, landlord<->tenant messaging |

**Total: 21 SP**

---

### Sprint 7 — "Q2 Retrospective + Q3 Planning" (Aug 7-20, 2026)
**Theme:** Measure, learn, plan

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S7-1 | Q2 KPI review | 2 | CTO | Review KR-E1 (velocity), KR-E3 (OpenAPI), KR-E6 (security), KR-E7 (burndown) |
| S7-2 | Q2 retrospective | 2 | CTO | What shipped? What blocked? What to change? |
| S7-3 | Sprint 6 leftover + bug fixes | 5 | All | Close any incomplete stories from S6 |
| S7-4 | Q3 roadmap draft | 3 | CTO + PM | Based on Q2 learnings + V2 Phase 3 (F13 AI, F17 Stripe tenant portal, F19 advanced reporting) |
| S7-5 | Technical debt triage | 5 | All | Address top 5 technical debt items identified in S4-S6 |
| S7-6 | Documentation update | 3 | All | README, API docs, runbooks - reflect Q2 shipped state |

**Total: 20 SP**

---

### Sprint 8 — "Buffer / Stretch Goals" (Aug 21 - Sep 3, 2026)
**Theme:** Catch-up or accelerate

| # | Task | SP | Owner | Description |
|---|------|----|-------|-------------|
| S8-1 | AI lease drafting assistant (F13) - POC | 8 | Backend Engineer | Draft lease terms based on property/tenant inputs; French legal fields |
| S8-2 | Stripe tenant payment portal (F17) - backend | 5 | Backend Engineer | GoCardless/Bridge integration; mandate management |
| S8-3 | Advanced reporting (F19) - custom date ranges | 5 | Senior Full-Stack | Per-tenant, per-property custom report builder |
| S8-4 | Q3 OKR planning | 2 | CTO | Set Q3 OKRs based on Q2 results |
| S8-5 | Buffer / stretch | 3 | All | Carryover from previous sprints; exploratory work |

**Total: 23 SP** — Aggressive; S8-1/S8-2 are stretch goals; buffer for carryover is critical

---

## 4. SPRINT CAPACITY SUMMARY

| Sprint | Theme | SP | Dates |
|--------|-------|----|-------|
| S0 | Foundation & Finishing V1 | 21 | May 1-14 |
| S1 | Inspection Reports + Accounting Export | 20 | May 15-28 |
| S2 | Tenant Portal | 16 | May 29 - Jun 11 |
| S3 | Lease Renewals + Reminders | 18 | Jun 12-25 |
| S4 | Polish + Security + Performance | 21 | Jun 26 - Jul 9 |
| S5 | Multi-user + Portfolio + Scaling | 21 | Jul 10-23 |
| S6 | V2 Phase 2 Launch | 21 | Jul 24 - Aug 6 |
| S7 | Q2 Retrospective + Q3 Planning | 20 | Aug 7-20 |
| S8 | Buffer / Stretch Goals | 23 | Aug 21 - Sep 3 |
| **Total** | | **181 SP** | |

**Average: ~22.6 SP/sprint** — Target is 25+; S0 and S4 have parallelizable work that should compress.

---

## 5. TEAM CAPACITY ASSUMPTION

| Role | Sprint commitment |
|------|-------------------|
| Senior Full-Stack Engineer | 15 SP/sprint (60% capacity - frontend-heavy) |
| Backend Engineer | 13 SP/sprint (60% capacity - API/infrastructure-heavy) |
| DevOps | 3 SP/sprint (infrastructure/security) |
| CTO (me) | 5 SP/sprint (coordination, reviews, special projects) |

**Total capacity: ~36 SP/sprint** — Comfortably above 25 SP target with buffer.

---

## 6. DEPENDENCIES & BLOCKERS

| Blocker | Impact | Mitigation |
|---------|--------|------------|
| PostHog not configured (S0-1) | Can't measure KR-P1/P3/P4 | DevOps configures in Sprint 0 week 1 |
| Stripe webhook test mode | F17 (tenant payments) | Skip F17 until Stripe GoCardless approved |
| SEO content not ready (blog/templates) | KR-S1/S4/S7 at risk | SEO Content Lead owns; tracked separately |
| French legal fields for inspection reports | F3 compliance risk | PM to provide legal requirements doc by May 1 |

---

## 7. OPEN QUESTIONS FOR CEO

1. **F13 (AI lease drafting) - priority?** POC in S8, or move to Q3 and prioritize F17 (Stripe tenant payments)?
2. **Multi-user/agency mode (S5-1) - Q2 or Q3?** F7 RICE is low (1.80) but unlocks Marc ICP. Confirm if this is a Q2 or Q3 priority.
3. **PostHog vs Plausible?** Q2 OKR references both. DevOps needs to pick ONE for activation funnel tracking.
4. **Q2 target: 5 paid customers (KR-B1).** Is there an active sales push? Engineering can ship features but conversion depends on sales/marketing.

---

*Document version: 1.0 - CTO - April 28, 2026*
*Status: DRAFT - pending CEO + PM alignment*
