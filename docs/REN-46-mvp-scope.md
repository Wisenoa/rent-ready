# RentReady MVP Scope Document
**Issue:** REN-46 | **Role:** Product Manager | **Date:** 2026-04-07
**Status:** Draft for CTO/Engineering Review

---

## 1. EXECUTIVE SUMMARY

RentReady V1 MVP targets **independent French landlords** (1–10 units) who currently manage rentals via spreadsheets, email, and paper. The wedge is: **lease creation + rent collection tracking + receipt generation**.

V1 solves the 3 most painful, daily workflows: getting a proper lease signed, collecting rent on time, and generating legally compliant receipts. Everything else is V2+.

**Time to first value:** 15 minutes to first lease generated.
**Time to first signup → first receipt:** < 5 minutes (self-serve).

---

## 2. TOP 5 MVP FEATURES

### Feature 1: Lease Creation & Management (Module: Leases)
**Priority: MUST HAVE (MoSCoW: Must)**

**User Problem:** Landlords use outdated or generic lease templates, miss required clauses under the 6 July 1989 law, and have no central place to store executed leases.

**Business Impact:**
- SEO anchor: targets "modèle bail location", "bail de location 2026", "bail meublé vs vide"
- Trust: legally compliant templates increase conversion + retention
- Data moat: each lease = structured data for future features (renewals, reminders, charges)

**User Story:**
> As a landlord, I want to generate a law-compliant lease agreement in under 5 minutes, so I can onboard a tenant without needing a lawyer or using outdated templates.

**Acceptance Criteria:**
- [ ] Landlord selects: furnished/unfurnished, lease type, tenant info, property info
- [ ] Lease auto-populates all required clauses per law of 6 July 1989
- [ ] PDF output is legally sound and downloadable
- [ ] Lease is saved to the tenant's profile
- [ ] Lease can be renewed or terminated

**SEO Potential:** P0 — lease template pages are high-intent, high-volume commercial keywords

---

### Feature 2: Rent Payment Tracking & Late Payment Reminders (Module: Payments)
**Priority: MUST HAVE (MoSCoW: Must)**

**User Problem:** Landlords track rent in spreadsheets. They manually check if payments arrived and feel awkward sending awkward "did you pay?" follow-ups.

**Business Impact:**
- Retention driver: daily interaction point
- Unpaid rent follow-up = natural upsell to paid features
- Payment data feeds owner dashboard and accounting

**User Story:**
> As a landlord, I want to record each rent payment and automatically track what's owed, so I can see my rental income accurately without chasing tenants manually.

**Acceptance Criteria:**
- [ ] Record rent payment (amount, date, method: bank transfer / check / cash)
- [ ] Mark payment as "paid", "partial", "late", "unpaid"
- [ ] Late payment triggers a one-click reminder letter (pre-filled)
- [ ] Payment history visible per tenant and per property
- [ ] Dashboard shows this month's expected vs received rent

**SEO Potential:** P1 — "releve de loyer", "paiement loyer", "lettre relance loyer impaye"

---

### Feature 3: Rent Receipt Generation (Module: Receipts)
**Priority: MUST HAVE (MoSCoW: Must)**

**User Problem:** Tenants need receipts for tax deductions, housing assistance (APL), or landlord proof. Landlords either don't provide them or use hand-written formats that are rejected by CAF.

**Business Impact:**
- Tenant portal activation hook (V2)
- Receipts = proof of transaction = trust signal for both parties
- Auto-receipt on payment = delightful micro-interaction

**User Story:**
> As a landlord, I want to generate a PDF rent receipt instantly after recording a payment, so my tenant can claim APL and I stay in good standing with the law.

**Acceptance Criteria:**
- [ ] Receipt auto-generated on payment recording
- [ ] Receipt includes: landlord name, tenant name, property address, period, amount, method, date
- [ ] PDF is CAF-friendly format
- [ ] Landlord can re-generate receipts from payment history
- [ ] Tenant can access via link (V2 tenant portal, V1 email attachment)

**SEO Potential:** P0 — "quittance de loyer gratuit PDF", "generateur quittance loyer" are high-volume transactional terms

---

### Feature 4: Property & Tenant Directory (Module: Properties + Tenants)
**Priority: MUST HAVE (MoSCoW: Must)**

**User Problem:** Landlords have tenant info scattered across email threads, notebooks, and PDFs. They can't quickly answer: "Who lives in Apt 3B? When does their lease expire?"

**Business Impact:**
- Single source of truth for all tenant data
- Lease renewal automation depends on this
- Owner dashboard feeds from this data

**User Story:**
> As a landlord, I want a centralized list of my properties and tenants, so I can quickly find any rental detail without digging through old emails.

**Acceptance Criteria:**
- [ ] Add/edit/archive properties (address, type, units, size m², rent amount)
- [ ] Add/edit/archive tenants linked to a property
- [ ] Tenant profile shows: contact info, lease dates, payment history, documents
- [ ] Property profile shows: current tenant, lease status, rent amount, next renewal date
- [ ] Search across all properties and tenants

**SEO Potential:** P2 — informational articles can link from property management content

---

### Feature 5: Owner Dashboard & Rental Profitability Overview (Module: Dashboard)
**Priority: SHOULD HAVE (MoSCoW: Should)**

**User Problem:** Landlords don't have a clear picture of: total rental income this month, occupancy rate, which properties have upcoming lease renewals, and YTD profitability.

**Business Impact:**
- Primary activation metric: landlord sees their numbers in < 3 clicks
- Churn preventer: when owners see value, they stay
- Upsell engine: vacancy data triggers property listing feature

**User Story:**
> As a landlord, I want to see all my rental properties in one dashboard with income, occupancy, and upcoming deadlines, so I can manage my portfolio like a professional.

**Acceptance Criteria:**
- [ ] Summary cards: total units, occupied, vacant, monthly income, YTD income
- [ ] Per-property breakdown: tenant name, lease end date, monthly rent, status
- [ ] Upcoming deadlines widget: lease expirations within 60 days, unpaid rent
- [ ] Quick actions: add payment, generate receipt, send reminder

**SEO Potential:** P2 — "tableau de bord gestion locative", "suivi location excel" (position against spreadsheets)

---

## 3. MoSCoW PRIORITIZATION ACROSS ALL FEATURES

### Must Have (V1)
1. **Lease Creation & Management** — the primary entry point; no SaaS without this
2. **Rent Payment Tracking** — daily workflow, retention driver
3. **Rent Receipt Generation** — tenant value, SEO value, legal trust
4. **Property & Tenant Directory** — data foundation
5. **Owner Dashboard** — activation and retention

### Should Have (V2)
6. Maintenance requests and ticketing
7. Lease renewal workflow with reminder
8. Unpaid rent formal letter generation
9. Security deposit tracking
10. Basic accounting export (CSV)

### Could Have (V2–V3)
11. Tenant portal (view lease, pay, request maintenance)
12. Document vault (scan/store leases, IDs, energy certificates)
13. Automated rent increase calculation (IRL index)
14. Owner financial reporting
15. Integration with French government administrative procedures

### Won't Have (V3+)
16. Full accounting/ERP module
17. Marketplace of service providers
18. Multi-language support (English V1 is scope cut)
19. API integrations with bank feeds (Credit Agricole, BNP, etc.)
20. AI lease drafting assistant

---

## 4. USER JOURNEYS

### Journey 1: First Signup → First Lease (Primary Activation Path)
```
Landing page → Free trial signup
→ Onboarding wizard (add first property)
→ Add first tenant
→ Generate lease PDF
→ Download and sign
→ Upload signed lease
→ Record first rent payment
→ Auto-receipt generated
→ Dashboard shows first property active
```
**Drop-off risks:** too many fields in onboarding → reduce to minimum viable: property address + rent amount

### Journey 2: Monthly Rent Collection Loop
```
1st of month → Dashboard shows expected rent
→ Landlords checks payment status
→ If unpaid → one-click reminder letter
→ Tenant pays via bank transfer
→ Landlord records payment
→ Receipt auto-sent
→ Dashboard updates to "paid"
```

### Journey 3: Lease Renewal
```
60-day warning on dashboard
→ Landlord opens property/lease
→ Reviews lease terms
→ Generates renewal document
→ Sends to tenant (email/PDF)
→ Tenant signs (in-person or DocuSign integration V2)
→ New lease saved
→ Dashboard updates lease end date
```

---

## 5. DEFINITION OF DONE (for V1 Release)

For each MVP feature to be considered "done":

| Feature | Done Criteria |
|---------|--------------|
| Lease Creation | PDF generates correctly with all 6 July 1989 clauses; landlord can download; data persists |
| Rent Tracking | Payment recorded and reflected in dashboard within 24h of entry |
| Receipt Generation | Receipt PDF is CAF-compliant format; tenant address, period, amount, method all correct |
| Property/Tenant Directory | All CRUD operations work; data visible in < 2 clicks from dashboard |
| Owner Dashboard | Summary cards load in < 2s; data accurate within 5 minutes of entry |

**Technical Done Criteria:**
- [ ] All features accessible from `/app` (authenticated area)
- [ ] No console errors in production build
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Mobile responsive (375px+)
- [ ] All French language strings externalized (i18n-ready)
- [ ] Unit tests for payment calculation logic
- [ ] No PII logged or exposed

**Product Done Criteria:**
- [ ] SEO landing pages live for lease template + receipt generator
- [ ] Free trial signup flow functional
- [ ] Onboarding drop-off rate < 30% (measured post-launch)
- [ ] Activation metric defined and tracked: "first lease generated within 24h of signup"

---

## 6. MVP SCOPE DOCUMENT FOR CTO/ENGINEERING TEAM

### What's In Scope (V1)
- SaaS web app (Next.js 14 App Router)
- Marketing site (landing, features, pricing, blog)
- Auth (email/password)
- PostgreSQL database via Prisma
- Lease PDF generation (server-side)
- Receipt PDF generation (server-side)
- Reminder letter template (pre-filled text, no legal advice)
- SEO pages: lease template page, receipt template page

### What's Out of Scope (V1)
- Tenant portal
- Mobile native apps
- Bank feed integrations
- E-signature (DocuSign/Argent)
- AI features
- Multi-language (English)
- Advanced accounting
- Maintenance module
- API (external)

### Tech Stack Alignment
| Component | Decision | Rationale |
|-----------|----------|-----------|
| Frontend | Next.js 14 App Router | SSR for SEO + fast UX |
| Database | PostgreSQL + Prisma | Reliable relational; good Prisma DX |
| Auth | NextAuth.js | Fastest auth implementation |
| PDF Generation | @react-pdf/renderer | Pure JS, no server dependencies |
| Hosting | Vercel or Railway | Fast deploy, good French market latency |
| SEO | Next.js + static generation | Pages are template-based, good for SEO |

### SEO Pages for V1 Launch
1. `/outils/modele-bail-location` — lease template page (P0 keyword)
2. `/outils/modele-quittance-loyer-pdf` — receipt template page (P0 keyword)
3. `/outils/calculateur-irl-2026` — rent increase calculator (P1 keyword)

---

## 7. SUCCESS METRICS (V1)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Free trial signups (Month 1) | 200 | Analytics |
| First-lease-generated rate | > 50% of signups | App event |
| Time to first lease | < 10 minutes | Session replay |
| Monthly active landlords | 100 (Month 1) | Auth events |
| SEO organic sessions (Month 1) | 1,000 | Google Analytics |
| SEO organic sessions (Month 3) | 5,000 | Google Analytics |
| Receipt page CTR (SERP) | > 3% | GSC |
| Activation rate | > 40% | Funnel analysis |
| Trial-to-paid conversion (Month 3) | > 5% | Billing data |

---

*Document prepared by Product Manager agent (fc0d3cee-bb34-4ddd-84aa-bba2c8e73a9f).*
*Issue: REN-46 — Define MVP scope and core feature set*
