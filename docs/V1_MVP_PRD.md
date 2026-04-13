# V1 MVP Product Requirements — Rent-Ready SaaS
## REN-78 | Owner: Product Manager | Status: COMPLETE

---

## 1. STRATEGIC CONTEXT

**Source:** REN-7 (Company Strategy — complete) recommends landlord-first as the fastest-to-market wedge.
**V1 Timebox:** 4–6 weeks | **Team:** 1–2 engineers

The V1 MVP exists to answer one question: *can we get a landlord to create their first lease and record their first payment in under 15 minutes?* Everything else is V2+.

---

## 2. MARKET WEDGE

**Segment:** Independent French landlords with 1–5 rental units
**Wedge:** Landlord-first, solo operator, SMB property managers V2

**Why landlord-first:**
- Smallest possible buyer: 1 person, 1–5 units, no procurement
- Highest pain: spreadsheets + email + paper receipts
- Fastest onboarding: add property → add tenant → sign lease → record rent
- Lowest compliance surface for V1 (no multi-tenant agency workflows)
- France-specific: strong demand for digital quittances and bail conforme

**Primary user persona:**
> "Sophie, 38, Paris. Owns a T2 she rents out. Manages everything in a folder of email threads and an Excel sheet. She spends 2h/month on admin. She wants peace of mind more than a feature-rich tool."

---

## 3. V1 FEATURE SET — 6 CORE FEATURES

### Feature 1: Property Management
**What:** Add, edit, archive rental properties. Each property has address, type, surface, rooms, description.

**User Story:**
> As a landlord, I want to add my rental property so that I have a single source of truth for all my real estate assets.

**Acceptance Criteria:**
- [ ] Can add a property with: name, type (APARTMENT/HOUSE/COMMERCIAL/OTHER), address (line1, city, postal code, country)
- [ ] Optional fields: surface (m²), rooms, description
- [ ] Can edit and archive (soft-delete) a property
- [ ] Property list view shows all active properties with address summary
- [ ] Archived properties hidden from default list but retain historical lease data
- [ ] Cannot delete a property that has an active lease (block with error)

**Complexity:** Low | **Retention impact:** Medium | **SEO hook:** Property management guide pages

---

### Feature 2: Tenant Management
**What:** Add and manage tenants linked to a property.

**User Story:**
> As a landlord, I want to record my tenant's contact details so that I can communicate with them and track their lease history.

**Acceptance Criteria:**
- [ ] Can add a tenant with: full name, email, phone, move-in date
- [ ] Tenant is linked to a specific property
- [ ] Can edit and archive a tenant
- [ ] Tenant profile shows: name, email, phone, linked property, active lease status
- [ ] Cannot archive a tenant with an active lease
- [ ] Tenant list filtered by property

**Complexity:** Low | **Retention impact:** Medium | **SEO hook:** Tenant management guide

---

### Feature 3: Lease Management
**What:** Create, view, and manage rental leases.

**User Story:**
> As a landlord, I want to create a lease for my tenant so that I have a legally-structured digital record of the rental agreement.

**Acceptance Criteria:**
- [ ] Lease creation form captures: property, tenant, start date, end date, monthly rent, charges, security deposit
- [ ] Lease status: DRAFT → ACTIVE → EXPIRED
- [ ] Auto-generate PDF quittance on lease creation (using existing /outils/recu-loyer logic)
- [ ] Download lease PDF from lease detail page
- [ ] Lease detail page shows: tenant, property, rent amount, deposit, start/end dates, payment history
- [ ] Lease renewal: can extend a lease with a new end date (creates renewal record, keeps history)
- [ ] Cannot create a lease for a property that already has an active lease for the same period

**Complexity:** Medium | **Retention impact:** HIGH | **SEO hook:** Bail de location template, bail vide, bail meublé, bail mobilité

---

### Feature 4: Rent Collection & Payment Tracking
**What:** Record monthly rent payments, mark as paid/unpaid, generate receipts.

**User Story:**
> As a landlord, I want to record each rent payment so that I have a complete, auditable payment history with receipts.

**Acceptance Criteria:**
- [ ] Monthly rent entries auto-generated from lease start date
- [ ] Can mark a rent entry as: PAID (with date paid) or UNPAID
- [ ] When marked PAID: auto-attach PDF quittance to tenant record
- [ ] Quittance downloadable from both rent entry and tenant profile
- [ ] Rent dashboard shows: property, tenant, monthly amount, last paid date, outstanding balance
- [ ] Unpaid rent entries highlighted in red on dashboard
- [ ] Can record partial payments (with notes field)
- [ ] Payment method field: BANK_TRANSFER / CASH / CHEQUE / OTHER

**Complexity:** Medium | **Retention impact:** HIGH | **SEO hook:** Quittance de loyer, receipt templates

---

### Feature 5: Dashboard & Navigation
**What:** Central dashboard showing portfolio overview, upcoming payments, and alerts.

**User Story:**
> As a landlord, I want to see an overview of my rental portfolio so that I instantly know what needs attention.

**Acceptance Criteria:**
- [ ] Dashboard shows: total properties, total tenants, active leases, this month's expected rent, amount received, amount outstanding
- [ ] Upcoming section: next rent due dates, upcoming lease expirations (30-day warning)
- [ ] Unpaid rent alert banner at top if any unpaid entries exist
- [ ] Left sidebar navigation: Dashboard | Properties | Tenants | Leases | Payments | Settings
- [ ] Quick-add buttons: + Property, + Tenant, + Lease
- [ ] Empty state for new users: 3-step nudge → "Add your first property → Add a tenant → Create a lease"

**Complexity:** Low | **Retention impact:** Medium | **SEO hook:** None (app-only)

---

### Feature 6: Onboarding Wizard
**What:** Structured first-run flow to get landlords from signup to first lease quickly.

**User Story:**
> As a new landlord, I want a guided setup so that I can start managing my rental in under 10 minutes.

**Acceptance Criteria:**
- [ ] New users land on onboarding wizard (not empty dashboard)
- [ ] Step 1: Add first property (inline form, skip optional fields)
- [ ] Step 2: Add first tenant (linked to property from step 1)
- [ ] Step 3: Create first lease (pre-filled with property and tenant)
- [ ] Step 4: Success screen — "Your first lease is ready" + CTA to add first payment
- [ ] Progress indicator: Step 1 of 4
- [ ] Can skip onboarding and go directly to dashboard (bookmarkable)
- [ ] Each step instrumented: track drop-off at each step
- [ ] Onboarding completes in 3 pages max (property → tenant → lease)

**Complexity:** Medium | **Retention impact:** HIGH | **SEO hook:** None (activation metric)

---

## 4. V1 USER FLOW — CORE LOOP (Text Wireframe)

```
[ LANDING / SIGNUP ]
       ↓
[ ONBOARDING WIZARD ]
  Step 1: Add Property
  ─────────────────────
  Property Name: [________]
  Type: ( ) Apartment  ( ) House  ( ) Other
  Address: [________________]
  City:   [________]  Postal: [_____]
  Surface (m²): [____]  Rooms: [__]
          [Continue →]
  Step 2: Add Tenant
  ─────────────────────
  Full Name: [________________]
  Email:     [________________]
  Phone:     [________________]
  Move-in Date: [__/__/____]
          [Continue →]
  Step 3: Create Lease
  ─────────────────────
  Property: "Appartement Rivoli" ✓
  Tenant: "Sophie Martin" ✓
  Start: [__/__/____]  End: [__/__/____]
  Monthly Rent (€): [_______]
  Charges (€): [_______]
  Deposit (€): [_______]
          [Create Lease →]
  Step 4: SUCCESS
  ─────────────────────
  ✓ Lease created for Sophie Martin
  ✓ PDF generated and saved
  [Record First Payment →]
  [Go to Dashboard →]

[ DASHBOARD ]
┌─────────────────────────────────────────────────────────┐
│ Rent-Ready                          [+ Property] [⚙]   │
├──────────┬──────────────────────────────────────────────┤
│ Dashboard│  PORTFOLIO OVERVIEW                          │
│──────────│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐   │
│ Properties│  │  1   │ │  1   │ │  1   │ │ 1 200 €  │   │
│ Tenants  │  │Props │ │Leases│ │Tenants│ │This month│   │
│ Leases   │  └──────┘ └──────┘ └──────┘ │received  │   │
│ Payments │                                 │  0 € outstanding │
│          │  ⚠ UNPAID RENT ALERT                         │
│ Settings │  Sophie Martin — Appartement Rivoli           │
│          │  April rent: 850 € due Apr 1 [Mark Paid →]  │
│          │                                                │
│          │  UPCOMING                                     │
│          │  Lease expires Jun 30, 2025 (Sophie Martin)   │
│          │                                                │
└──────────┴──────────────────────────────────────────────┘

[ LEASE DETAIL PAGE ]
┌─────────────────────────────────────────────────────────┐
│ ← Back to Leases                                        │
├─────────────────────────────────────────────────────────┤
│ LEASE: Appartement Rivoli — Sophie Martin               │
│ Status: ACTIVE  |  Jan 1, 2025 → Dec 31, 2025          │
├─────────────────────────────┬───────────────────────────┤
│ Monthly Rent: 850 €        │ Security Deposit: 1 700 € │
│ Charges incluses: 50 €     │ Next payment: Apr 1, 2025 │
├─────────────────────────────┴───────────────────────────┤
│ PAYMENT HISTORY                                         │
│ ┌────────────────┬────────┬────────┬─────────────────┐  │
│ │ Month          │ Amount │ Status │ Receipt         │  │
│ ├────────────────┼────────┼────────┼─────────────────┤  │
│ │ March 2025     │ 850 €  │ ✓ Paid │ [Download PDF] │  │
│ │ April 2025     │ 850 €  │ ⏳ Due │ —               │  │
│ └────────────────┴────────┴────────┴─────────────────┘  │
│ [Mark as Paid — April]                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 5. CONVERSION METRIC — V1

**Primary Conversion Metric: Time-to-First-Lease (TFL)**

> TFL = time in minutes from signup completion to lease marked as ACTIVE with PDF generated.

**Why this metric:**
- Captures the entire activation loop: signup → onboarding → property → tenant → lease → PDF
- Aligns with the core value hypothesis: landlords want a simpler way to manage leases and get receipts
- Isolateable: easy to instrument, no ambiguity about what counts
- Leading indicator of retention: if they create a lease, they're likely to use the product next month

**Target:**
- Median TFL ≤ 12 minutes for V1 launch cohort

**Secondary metrics to track:**
| Metric | Target |
|--------|--------|
| Signup → Onboarding start rate | ≥ 70% |
| Onboarding completion rate | ≥ 40% |
| Onboarding → First property | ≥ 60% |
| First property → First lease | ≥ 50% |
| Trial-to-paid conversion (TFL < 12min cohort) | ≥ 25% at 14 days |

---

## 6. V2 PREVIEW (NOT IN SCOPE)

The following are explicitly out of scope for V1:
- Maintenance tickets
- Owner portal (separate login for property owners if landlord is a manager)
- Tenant portal
- Multi-user / role-based access within an organization
- Accounting exports (CSV/PDF)
- Document vault (upload arbitrary files)
- Automated rent reminders (email/SMS)
- Lease renewal automated workflows
- Guarantor management
- Inspection reports
- Multiple properties view (portfolio analytics)
- Mobile app

---

## 7. SEO FLYWHEEL FOR V1 (Content Hook)

V1 features directly map to these content opportunities:
| Feature | SEO Page Template |
|---------|------------------|
| Property | /guides/gestion-locative/ajouter-un-bien |
| Tenant | /guides/gestion-locative/gerer-ses-locataires |
| Lease | /bail-appartement, /bail-vide, /bail-meuble, /bail-mobilite |
| Payment | /quittances, /recu-loyer |
| Dashboard | /guides/gestion-locative/tableau-de-bord |

These pages already exist (from REN-66 blog content). The V1 product loop is the *conversion path* from those content pages to a free account.

---

## 8. FREE TIER / PAYWALL BOUNDARY (from REN-65)

| Feature | Free (Forever) | Trial / Paid |
|---------|---------------|--------------|
| Properties | Up to 3 | Unlimited |
| Tenants | Up to 3 | Unlimited |
| Leases | Up to 2 | Unlimited |
| Payment tracking | 1 property only | Unlimited |
| PDF quittances | 3/month | Unlimited |
| Onboarding wizard | ✓ | ✓ |
| Dashboard | ✓ | ✓ |

- **Trial:** 14 days free, no credit card required
- **Upgrade CTA:** shown when free limits reached or on any paid-gated action
- **V1 scope:** implement free limits + trial flag, full paywall UI in V2

---

*Document version: 1.0 | Author: Product Manager | Based on: REN-7 strategy, REN-46 MVP scope, REN-65 paywall spec*
*Full PRD saved at: /home/ubuntu/rent-ready/docs/V1_MVP_PRD.md*
