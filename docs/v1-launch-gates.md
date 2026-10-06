# V1 Launch Quality Gates

**Issue:** REN-637 | **Author:** CTO | **Date:** 2026-05-02
**Status:** ACTIVE | **Target:** V1 Public Launch

---

## PREAMBLE

These are the gates that must be green before RentReady can launch publicly. Each gate is marked with a status as of May 2, 2026. Gates marked **BLOCKER** must be resolved before launch. Gates marked **ACCEPTED RISK** may ship with a documented justification.

This document should be reviewed weekly during Sprint 0 and updated as gates clear.

---

## 1. FUNCTIONAL COMPLETENESS GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| F1 | All CRUD for properties, units, tenants, leases, payments, maintenance requests | **PARTIAL** — Property/Unit/Tenant/Lease/Payment CRUD done per sprint plan; maintenance module in progress | Senior Full-Stack | All 6 entity CRUDs return 200/201/204 in E2E tests; no manual QA required | No |
| F2 | Authentication: signup, login, password reset, session management | **PARTIAL** — Auth middleware in place (src/middleware.ts); specific routes not verified E2E | Backend Engineer | E2E test: signup → login → logout → password reset flow passes 3x | No |
| F3 | Tenant invite link + tenant portal access | **NOT DONE** — Magic link tenant auth exists (REN-41 done); full tenant portal not shipped | Senior Full-Stack | Landlord can send invite; tenant receives email; tenant can view lease + pay history | **BLOCKER** if tenant self-service is in scope for launch |
| F4 | Email notifications: overdue rent reminder minimum | **NOT DONE** — Email infrastructure exists (src/lib/emails/); no overdue reminder workflow | Backend Engineer | Stripe webhook triggers overdue email; sendgrid/log shows delivery | **BLOCKER** |
| F5 | Stripe billing: checkout, webhook, subscription status | **DONE** — Stripe config exists (src/lib/stripe.ts); MRR dashboard configured (REN-566) | Backend Engineer | E2E: free trial → paid plan → invoice generated; webhook fires and updates DB | No |
| F6 | CSV bulk import for properties | **NOT VERIFIED** — Not listed in sprint plan as done; not in Prisma schema | Backend Engineer | Admin can upload CSV → properties created in DB → confirmation shown | **BLOCKER** if bulk onboarding is required |

---

## 2. SECURITY GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| S1 | All API endpoints authenticated (no public data leakage) | **PARTIAL** — Auth middleware exists; not all routes verified to require auth | Backend Engineer | curl each /api/* route without token → 401; with token → 200/403 (not 500) | **BLOCKER** |
| S2 | Row-level security: tenant cannot see other tenants' data | **NOT VERIFIED** — V1 architecture doc flags this as a gap; multi-tenancy not enforced at DB level | Backend Engineer | Tenant A's token cannot access Tenant B's lease via API; tested in E2E | **BLOCKER** |
| S3 | Landlord cannot see other landlords' data | **NOT VERIFIED** | Backend Engineer | Same as S2 for landlord scope | **BLOCKER** |
| S4 | Input validation on all API endpoints | **PARTIAL** — zod/validation likely present on some routes; not comprehensive | Backend Engineer | Fuzzer or Postman with invalid input → 400 with validation message, not 500 | No |
| S5 | File upload: type checking, size limits, restricted to images/PDFs | **PARTIAL** — Backend audit REN-33 addressed path traversal; file type restrictions not verified | Backend Engineer | Upload .exe → rejected with 415; upload 50MB PDF → rejected with 413 | No |
| S6 | Stripe webhook signature verification | **DONE** — Stripe config reviewed; webhook idempotency fixed in REN-33 | Backend Engineer | Replay attack of old webhook → no duplicate charges/payments | No |
| S7 | Rate limiting on auth endpoints | **NOT VERIFIED** — Vercel rate limits may apply at edge; no custom rate limiter seen | Backend Engineer | 100 rapid /api/auth/login requests → last 90 return 429 | No |
| S8 | Session timeout and secure cookie settings | **PARTIAL** — middleware.ts reviewed; exact cookie settings not verified | Backend Engineer | DevTools: cookie has HttpOnly + Secure flags; session expires after 24h inactivity | No |

---

## 3. PERFORMANCE GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| P1 | Lighthouse performance score > 80 on marketing site | **NOT MEASURED** — Dev server can't be directly curled; no Lighthouse report seen | Senior Full-Stack | lighthouse https://rentready.fr --onlyCategories=performance → score ≥ 80 | No |
| P2 | Time to First Byte < 600ms on API endpoints | **NOT MEASURED** | Backend Engineer | curl -w "%{time_starttransfer}" /api/properties → < 600ms avg over 10 calls | No |
| P3 | No N+1 query problems in the 5 most common API calls | **NOT VERIFIED** — Prisma usually avoids N+1 with include(), but not audited | Backend Engineer | Prisma query logs show ≤ 1 query per endpoint for /properties, /tenants, /leases, /payments, /dashboard | No |
| P4 | Database indexes on all frequently queried fields | **NOT VERIFIED** — Prisma schema reviewed; indexes not explicitly defined in schema.prisma | Backend Engineer | EXPLAIN on top 5 queries shows sequential scan → index added | **BLOCKER** |
| P5 | Image optimization on all pages | **NOT VERIFIED** — next/image likely used; not confirmed on all pages | Senior Full-Stack | PageSpeed insights → no LCP image > 200KB uncompressed | No |

---

## 4. SEO GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| E1 | All pages have unique title tags and meta descriptions | **PARTIAL** — SEO infrastructure done (sitemap, robots, hreflang, schema); per-page uniqueness not audited | SEO Content Lead | Screaming Frog crawl → 0 pages with duplicate/missing title or description | No |
| E2 | sitemap.xml exists and is updated | **DONE** — Confirmed in codebase | SEO Content Lead | sitemap.xml returns 200 and lists all public pages | No |
| E3 | robots.txt allows crawling of marketing pages | **DONE** | SEO Content Lead | robots.txt present; /app/* blocked, /marketing/* allowed | No |
| E4 | All tool/template pages have FAQ schema markup | **PARTIAL** — Template pages have static FAQPage schema; tool pages need audit (6+ outils confirmed) | SEO Content Lead | Schema.org validator → all /outils/* and /templates/* pages return valid FAQPage | No |
| E5 | Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1 | **NOT MEASURED** on new infra | Senior Full-Stack | PageSpeed Insights → all 3 CWV metrics green on homepage + key landing pages | No |
| E6 | Marketing site and app separated (app behind auth) | **DONE** — (marketing) and (dashboard) route groups confirmed; auth middleware on /app/* | CTO | Unauthenticated GET /dashboard → redirect to login | No |

---

## 5. UX GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| U1 | Onboarding flow works end-to-end (signup → first property in dashboard) | **PARTIAL** — Onboarding wizard exists; PostHog not wired to measure completion | Senior Full-Stack | E2E: new user signup → add first property → property appears in dashboard; tested 3x | No |
| U2 | All empty states have helpful CTAs | **NOT VERIFIED** | Senior Full-Stack | Manual walkthrough: visit /properties, /tenants, /leases with empty DB → all show CTA, not blank page | No |
| U3 | All forms have validation with helpful error messages | **PARTIAL** — Zod validation likely present; not systematically tested | Senior Full-Stack | Submit empty form → inline error messages; submit invalid email → specific error | No |
| U4 | Mobile-responsive on all core pages | **PARTIAL** — Responsive design likely; not tested on real devices | Senior Full-Stack | Chrome DevTools mobile emulation → no broken layouts on /dashboard, /properties, /leases | No |
| U5 | Loading states on all async operations | **NOT VERIFIED** | Senior Full-Stack | Submit form → immediate loading indicator → result; no silent hangs | No |
| U6 | No console errors in browser | **NOT VERIFIED** | Senior Full-Stack | Playwright test: 0 console errors on /dashboard, /properties, /leases, /tenants | No |

---

## 6. DATA & OPERATIONAL GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| O1 | Database backups configured and tested | **NOT VERIFIED** — Neon PostgreSQL used; backup policy not confirmed in docs | DevOps | Restore test from latest backup → data matches; documented RTO < 4h | **BLOCKER** |
| O2 | Error monitoring (Sentry) active in production | **DONE** — CI/CD with Sentry alerting confirmed (sprint plan) | DevOps | Sentry receives test error from production → alert fires within 5 min | No |
| O3 | Analytics (PostHog) tracking all key events | **NOT DONE** — PostHog not wired; this blocks KR-P1/P2/P4 measurement (Sprint 0 S0-1) | Senior Full-Stack | PostHog dashboard shows events: property.created, tenant.created, lease.created, payment.marked_paid | **BLOCKER** |
| O4 | Stripe billing dashboard accessible and showing correct MRR | **DONE** — REN-566 completed | CTO | Stripe Dashboard → Revenue → Recurring Revenue shows MRR > €0 | No |
| O5 | Support channel accessible (email alias minimum) | **NOT VERIFIED** | CEO | Help page or footer has contact email; emails to alias reach support | No |
| O6 | Legal pages live: Privacy Policy, Terms of Service, GDPR compliance | **NOT VERIFIED** — /politique-cookies added (REN-292); full Privacy Policy and ToS not confirmed | CEO | /privacy and /terms return 200 with French legal text | **BLOCKER** |

---

## 7. CODE QUALITY GATES

| # | Gate | Status | Owner | What "Green" Looks Like | Blocker? |
|---|------|--------|-------|------------------------|----------|
| C1 | tsc --noEmit passes with 0 errors in CI | **PARTIAL** — node_modules type errors pre-exist; project code must be clean | All Engineers | CI pipeline: tsc --noEmit grep "^src/" → 0 errors | No |
| C2 | All new API routes have unit tests | **NOT VERIFIED** — Testing patterns exist; coverage not measured | Backend Engineer | jest --coverage on /api/routes → 80%+ coverage on all new routes | No |
| C3 | E2E tests pass for critical paths (signup, add property, add lease, record payment) | **PARTIAL** — E2E suite exists (WCAG 2.1 AA); specific flows not verified | Senior Full-Stack | Playwright: run E2E suite → 0 failures on critical paths | No |
| C4 | No TODO/FIXME in merged code without tracking issue | **ACCEPTED RISK** — Standard practice; not currently audited | CTO | grep -r "TODO\|FIXME" src/ → all items have associated issue | No |
| C5 | All secrets in env vars, none hardcoded | **DONE** — .env.local pattern confirmed; middleware and stripe configs use env vars | CTO | No secret strings (Stripe key, DB URL, API keys) appear in grep of src/ with exceptions for .env.local | No |

---

## GATE SUMMARY

### Blockers (Must Fix Before Launch)
| Gate | Issue | Owner |
|------|-------|-------|
| O3: PostHog analytics wired | Sprint 0 S0-1 | Senior Full-Stack |
| O6: Privacy Policy + Terms of Service live | Not yet tracked | CEO |
| O1: Database backups configured | Not yet tracked | DevOps |
| S1: All API endpoints authenticated | Not yet tracked | Backend Engineer |
| S2: Row-level tenant isolation | Not yet tracked | Backend Engineer |
| S3: Row-level landlord isolation | Not yet tracked | Backend Engineer |
| P4: Database indexes on frequently queried fields | Not yet tracked | Backend Engineer |
| F4: Overdue rent email notification | Not yet tracked | Backend Engineer |

### Accepted Risks (Ship with Justification)
| Gate | Risk | Justification |
|------|------|--------------|
| C4: TODO/FIXME not audited | Technical debt | Standard practice; tracked separately in REN-545 |
| F3: Tenant portal not fully shipped | Scope creep | Tenant portal is V2; launch with landlord-only flow |
| F6: CSV bulk import not built | MVP scope | Manual property entry is acceptable for early adopters |

### Not Yet Measured (Do Before Launch)
| Gate | Owner |
|------|-------|
| P1: Lighthouse score > 80 | Senior Full-Stack |
| P2: TTFB < 600ms | Backend Engineer |
| P3: No N+1 queries | Backend Engineer |
| E5: Core Web Vitals | Senior Full-Stack |
| U2: Empty states | Senior Full-Stack |
| U3: Form validation | Senior Full-Stack |
| U4: Mobile responsive | Senior Full-Stack |
| U5: Loading states | Senior Full-Stack |
| U6: No console errors | Senior Full-Stack |
| C2: Unit test coverage | Backend Engineer |
| C3: E2E critical paths | Senior Full-Stack |

---

*Document version: 1.0 — CTO — May 2, 2026*
*Next review: Monday May 5, 2026 (end of Sprint 0 week 1)*
