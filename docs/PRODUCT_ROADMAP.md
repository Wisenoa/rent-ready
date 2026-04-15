# Rent-Ready Product Roadmap & Backlog Prioritization
**Issue:** REN-20 | **Owner:** Product Manager | **Date:** 2026-04-15
**Status:** Active | **Horizon:** V1 (current) → V2 (Q3 2026) → V3 (Q1 2027)

---

## 1. PRODUCT VISION

**Mission:**
Rent-Ready is the simplest, most landlord-centric property management platform for French independent landlords — helping them manage leases, collect rent, and stay legally compliant without hiring an agency.

**Positioning:**
> The all-in-one rental management platform that turns spreadsheets and paper into a 5-minute daily workflow — built for French landlords who manage 1 to 20 properties.

**Value Proposition:**
- Time savings: reduce monthly admin from 2h+ to under 15 minutes
- Legal peace of mind: every document auto-conforms to French landlord law (Loi Alur, Loi ELAN)
- Revenue visibility: know instantly what is owed, what is paid, what is late
- SEO-native growth: free tools and content bring organic users who convert to paid subscribers

**Target ICPs (Ideal Customer Profiles):**
1. Sophie (Solo Landlord): owns 1–3 units in French cities, manages personally, no prior SaaS
2. Marc (Portfolio Landlord): owns 5–15 units, wants one dashboard, open to paying for convenience
3. Agence Madeleine (Small Agency): manages 20–50 properties for third-party owners, needs multi-user

---

## 2. FEATURE PRIORITIZATION MATRIX — MoSCoW (V1 / V2 / V3)

### MUST HAVE — V1 (Shipped or In Progress)

| Feature | Epic | SEO Hook | Effort | Retention |
|---|---|---|---|---|
| Property CRUD | Properties | gestion locative | Low | Medium |
| Tenant CRUD | Tenants | gestion locataires | Low | Medium |
| Lease creation (bail vide/meublé/mobilité) | Leases | modèle bail location | Medium | HIGH |
| Rent payment recording | Payments | suivi loyers | Medium | HIGH |
| Rent receipt PDF (quittance) | Receipts | quittance loyer gratuit | Medium | HIGH |
| Late payment reminder letter | Reminders | lettre relance loyer impayé | Low | High |
| Dashboard (owned properties overview) | Dashboard | — | Medium | HIGH |
| User authentication (email + magic link) | Auth | — | Medium | Required |
| Stripe billing + 14-day free trial | Billing | — | Medium | Revenue |
| Onboarding flow (add property → tenant → lease) | Onboarding | — | Medium | Critical |

### SHOULD HAVE — V2 (Q3 2026)

| Feature | Epic | SEO Hook | Effort | Business Case |
|---|---|---|---|---|
| Tenant portal (view rent history, download receipts) | Tenant UX | portail locataire | High | Retention + virality |
| Document vault (store lease, photos, correspondence) | Documents | gestion documents location | Medium | Retention |
| Inspection report (état des lieux) creation + PDF | Inspections | modèle état des lieux | High | SEO + legal compliance |
| Multi-property dashboard (portfolio view) | Dashboard V2 | — | Medium | Upsell to Marc ICP |
| Email notifications (rent due, late, lease expiry) | Notifications | — | Medium | Retention |
| Accounting export (CSV/PDF for tax season) | Accounting | comptabilité locative | Medium | SEO + seasonal intent |
| Lease renewal workflow | Leases V2 | renouvellement bail | Medium | Retention |
| Charges reconciliation (utilities, building fees) | Charges | régularisation charges | High | Legal compliance |
| Multi-user / team access (agence mode) | Multi-user | — | High | Agence ICP unlock |
| Maintenance ticket tracking | Maintenance | gestion travaux locatif | Medium | Stickiness |

### COULD HAVE — V3 (Q1 2027)

| Feature | Epic | SEO Hook | Effort | Strategic Value |
|---|---|---|---|---|
| Online rent payment (Stripe / GoCardless direct debit) | Payments V3 | paiement loyer en ligne | Very High | Revenue + NPS |
| e-Signature for leases | e-Signature | signature bail en ligne | High | Conversion + legal |
| Tenant screening + credit check integration | Screening | vérification locataire solvabilité | Very High | Premium tier |
| AI assistant (draft letters, answer legal questions) | AI | — | High | Differentiation |
| Rental profitability calculator (rendement net/brut) | Analytics | calculer rendement locatif | Medium | SEO + engagement |
| Owner reports (revenue summary per property) | Reporting | déclaration revenus fonciers | High | Tax season + upsell |
| Public rental listing integration (SeLoger, LeBonCoin) | Listings | — | Very High | Acquisition |
| Mobile app (React Native / PWA upgrade) | Mobile | — | High | Retention |
| Compliance alerts (index IRL, lease expiry, rent cap) | Compliance | encadrement loyers | Medium | Differentiation |
| Partner marketplace (notaires, assureurs, artisans) | Marketplace | — | Very High | Revenue diversification |

### WON'T HAVE — V1/V2

- Complex multi-party escrow / Caisse des Dépôts integration
- Full accounting software replacement (we defer to Sage / Pennylane exports)
- Tenant FICO score calculation
- International markets (FR only through V3)

---

## 3. USER JOURNEY MAPS

### Journey 1: Landlord — First-Time Onboarding (Critical Path)

```
[Lands on Homepage / Feature Page]
    ↓
[CTA: "Essayer gratuitement 14 jours"]
    ↓
[Signup: email → magic link → confirm]
    ↓
[Onboarding Step 1: Add First Property]
    → Name, address, type, surface
    ↓
[Onboarding Step 2: Add First Tenant]
    → Name, email, phone, move-in date
    ↓
[Onboarding Step 3: Create First Lease]
    → Type (meublé/vide/mobilité), rent, charges, deposit, duration
    → Preview → Download PDF
    ↓
[Onboarding Step 4: Record First Payment]
    → Mark this month as paid
    → Auto-generate quittance PDF
    ↓
[Dashboard — First "Aha Moment"]
    → Property card shows: tenant name, rent amount, next due date, status
    ↓
[Retention Trigger: Email "Your first receipt is ready"]
    → 7-day re-engagement if no return
```

**Time-to-Value Target:** < 15 minutes to first receipt generated
**Activation Definition:** User creates 1 lease + records 1 payment

---

### Journey 2: Landlord — Monthly Rent Collection (Core Loop)

```
[Email: "Loyer de Mai 2026 — 3 jours avant échéance"]
    ↓
[Opens App → Dashboard]
    → Shows rent entries for current month (all properties)
    ↓
[Property A: Tenant paid → Click "Marquer comme payé"]
    → Enter date + amount + method
    → System auto-generates quittance
    → Email sent to tenant with PDF attached
    ↓
[Property B: Unpaid (5 days late)]
    → Banner: "Loyer en retard — envoyer une relance ?"
    → Click "Envoyer lettre de relance"
    → Pre-filled letter with tenant details + amount due
    → Send via email or download for post
    ↓
[End of Month Summary]
    → Revenue: 2/3 collected (1 outstanding)
    → Download monthly summary PDF
```

**Retention KPI:** Monthly active usage rate (target: 80% of paying users log in every month)

---

### Journey 3: Tenant — Receipt Self-Service (V2 Tenant Portal)

```
[Receives monthly email from landlord's Rent-Ready system]
    ↓
[Clicks: "Télécharger votre quittance de Mai 2026"]
    ↓
[Tenant Portal Login (no account needed — magic link)]
    ↓
[Sees: Payment history for their tenancy]
    → Download any quittance as PDF
    → View current lease terms
    ↓
[Optional: Tenant requests repair / files a notice]
    → Sends message to landlord (logged in system)
```

---

### Journey 4: Property Manager (Agence) — Multi-Property Management (V2)

```
[Invite team member via email → Assign role: Admin / Read-only]
    ↓
[Portfolio Dashboard: All properties across all owners]
    → Filter by owner, status, payment state
    ↓
[Bulk actions: Send all rent reminders for June]
    ↓
[Owner Reporting: Generate PDF statement per owner]
    ↓
[Inspection Report: Create état des lieux on-site (mobile)]
    → Photos, condition ratings, comments
    → Both parties sign digitally (V3)
```

---

## 4. BACKLOG STRUCTURE — EPICS & USER STORIES

### Epic 1: Properties Module

**Goal:** Central registry of all rental assets

Stories (V1):
- US-101: Add property (name, address, type, surface, rooms)
- US-102: Edit and archive property
- US-103: Property list with status indicator
- US-104: Block deletion of property with active lease

Stories (V2):
- US-201: Attach documents to property (insurance, diagnostics, plans)
- US-202: Property profitability summary (rent collected / estimated yield)
- US-203: Compliance alert: DPE expiry, gas certificate, lead paint check

---

### Epic 2: Tenant Management

**Goal:** One tenant profile per tenancy with full history

Stories (V1):
- US-111: Add tenant (name, email, phone, move-in date)
- US-112: Link tenant to property
- US-113: View tenant's lease + payment history
- US-114: Archive tenant (block if active lease)

Stories (V2):
- US-211: Tenant portal invitation
- US-212: Tenant identity document upload (pièce d'identité, RIB)
- US-213: Tenant creditworthiness flag (manual, V3 API)

---

### Epic 3: Lease Management

**Goal:** Legally compliant lease creation + lifecycle management

Stories (V1):
- US-121: Create lease (property, tenant, type, dates, rent, charges, deposit)
- US-122: Lease types: bail vide, bail meublé, bail mobilité, bail saisonnier
- US-123: Lease status machine: DRAFT → ACTIVE → EXPIRED / TERMINATED
- US-124: Download lease as PDF (prefilled from data)
- US-125: Lease renewal (extend end date, keep history)
- US-126: Lease termination (record date, reason, deposit return)

Stories (V2):
- US-221: Auto-populate required clauses per Loi Alur / ELAN
- US-222: Charges revision (annual regularization workflow)
- US-223: Index IRL auto-fill on lease creation

---

### Epic 4: Rent & Payments

**Goal:** Zero-friction rent recording with complete payment history

Stories (V1):
- US-131: Auto-generate monthly rent entries from lease start date
- US-132: Mark payment: PAID (with date) / PARTIAL / LATE / UNPAID
- US-133: Auto-attach quittance PDF on payment marked PAID
- US-134: Payment dashboard: expected vs collected, outstanding balance
- US-135: Late payment counter (days late + total arrears)

Stories (V2):
- US-231: Payment method tracking (virement, chèque, espèces)
- US-232: Partial payment recording with balance carry-forward
- US-233: Charges line items on payment entries
- US-234: Annual payment summary per property (CSV export)

Stories (V3):
- US-331: Stripe payment link: tenant pays online, auto-recorded
- US-332: GoCardless SEPA direct debit subscription
- US-333: Automatic reconciliation with bank statement import

---

### Epic 5: Documents & Receipts

**Goal:** Every document auto-generated, compliant, downloadable

Stories (V1):
- US-141: Quittance de loyer PDF auto-generated on payment
- US-142: Quittance: landlord name, tenant name, property, month, amount, date
- US-143: Batch download: all quittances for a year
- US-144: Late payment reminder letter (pre-filled, PDF + email)

Stories (V2):
- US-241: Inspection report (état des lieux entrée/sortie) creation + PDF
- US-242: Document vault: upload and organize any file per property/lease
- US-243: Lease termination letter template (lettre de congé)
- US-244: Arrears formal notice template (mise en demeure)

---

### Epic 6: Dashboard & Reporting

**Goal:** Instant visibility into portfolio health

Stories (V1):
- US-151: Global dashboard: all properties + rent status this month
- US-152: Property card: tenant, rent amount, last payment date, status chip
- US-153: Alerts: overdue payments, lease expiries in 60 days

Stories (V2):
- US-251: Portfolio summary: total monthly revenue, total collected, total outstanding
- US-252: Revenue trend chart (rolling 12 months)
- US-253: Exportable owner statement (PDF/CSV) for tax season

---

### Epic 7: Billing & Paywall

**Goal:** Sustainable revenue with frictionless trial-to-paid

Stories (V1):
- US-161: 14-day free trial on signup (no credit card)
- US-162: Trial progress indicator (X days remaining)
- US-163: Paywall gates: >3 properties or >5 leases → upgrade required
- US-164: Stripe checkout integration (monthly/annual plans)
- US-165: Subscription status on user profile
- US-166: Grace period: 7 days after trial expiry before hard lock

Stories (V2):
- US-261: In-app upgrade prompt at paywall moment (non-intrusive)
- US-262: Annual plan discount: 2 months free
- US-263: Invoice download from billing portal

---

### Epic 8: SEO & Marketing Pages

**Goal:** Organic acquisition via high-intent French landlord searches

Stories (V1 / Ongoing):
- US-171: /outils/modele-bail-location — free lease template tool
- US-172: /outils/quittance-loyer — free receipt generator
- US-173: /outils/calculateur-irl — IRL rent increase calculator
- US-174: /fonctionnalites/* — 6 feature landing pages
- US-175: /pour-les-proprietaires, /pour-les-agences, /pour-les-gestionnaires
- US-176: Blog infrastructure (MDX, sitemap, structured data)
- US-177: Glossaire (A-Z rental law terms, interlinked)

---

## 5. SUCCESS METRICS — KPIs BY PHASE

### V1 — Activation & Retention (Q2 2026)

| Metric | Target | Measurement |
|---|---|---|
| Time to first receipt | < 15 min | Onboarding funnel analytics |
| Activation rate (trial → 1 lease + 1 payment) | > 40% | PostHog funnel |
| Trial-to-paid conversion | > 20% | Stripe data |
| Monthly active users (MAU) | 80% of paying users | PostHog |
| Churn rate (monthly) | < 5% | Stripe MRR churn |
| NPS | > 50 | In-app survey at day 30 |
| Onboarding completion rate | > 70% | Funnel events |
| Support tickets per active user | < 0.2 / month | Intercom |

### V2 — Growth & Revenue (Q3–Q4 2026)

| Metric | Target | Measurement |
|---|---|---|
| MRR | €10,000 | Stripe |
| Paying customers | 200+ | Stripe |
| Avg properties per user | > 3 | DB query |
| Tenant portal adoption | 30% of landlords invite tenants | PostHog |
| Net Revenue Retention | > 105% | Stripe expansion revenue |
| Organic traffic | 50,000 sessions/month | GA4 |
| Organic signup conversion | > 2% of traffic | GA4 + PostHog |

### V3 — Market Leadership (Q1–Q2 2027)

| Metric | Target | Measurement |
|---|---|---|
| MRR | €50,000 | Stripe |
| Paying customers | 1,000+ | Stripe |
| Top 10 ranking for "logiciel gestion locative" | Position ≤ 10 | GSC |
| Top 3 ranking for "quittance loyer gratuit" | Position ≤ 3 | GSC |
| Average Revenue Per User (ARPU) | > €50/month | Stripe |
| Agencies on platform | 50+ | DB |
| Online payment GMV | €500K/month | Stripe |

---

## 6. DEFINITION OF DONE — STANDARDS

For every issue to be marked "done":

**Product:**
- [ ] Feature matches acceptance criteria in the linked spec
- [ ] Edge cases documented and handled
- [ ] No regression in existing core flows

**Engineering:**
- [ ] Code reviewed and merged to main
- [ ] Unit tests cover happy path + key error states
- [ ] No critical Lighthouse performance regression (LCP < 2.5s)

**SEO (for public-facing pages):**
- [ ] Meta title + description set
- [ ] Canonical URL defined
- [ ] Schema markup present where applicable
- [ ] Page indexed in sitemap
- [ ] Core Web Vitals pass (PageSpeed score ≥ 90)

**Content:**
- [ ] Copy reviewed by PM
- [ ] French legal terminology verified
- [ ] Internal links added (minimum 2 per new page)

---

## 7. ROADMAP TIMELINE

```
Q2 2026 (Apr–Jun) — V1 COMPLETION
  ├─ Week 1-2: Paywall + billing polish (REN-65)
  ├─ Week 3-4: Onboarding flow optimization
  ├─ Week 5-6: SEO tools live (/outils pages)
  └─ Week 7-8: V1 public launch + blog launch

Q3 2026 (Jul–Sep) — V2 CORE
  ├─ Month 1: Tenant portal (view receipts, download history)
  ├─ Month 2: Inspection reports (état des lieux PDF)
  └─ Month 3: Accounting export + owner statement

Q4 2026 (Oct–Dec) — V2 GROWTH
  ├─ Month 1: Multi-user / agency mode
  ├─ Month 2: Email notifications + automated reminders
  └─ Month 3: Charges reconciliation + lease renewal workflow

Q1 2027 (Jan–Mar) — V3 PREMIUM
  ├─ Month 1: Online rent collection (Stripe links)
  ├─ Month 2: e-Signature for leases
  └─ Month 3: AI assistant (legal letter drafting)
```

---

## 8. ALIGNMENT WITH SEO STRATEGY

This roadmap is designed to co-evolve with the SEO content strategy:

- Every tool page (/outils/*) is a V1 deliverable that drives organic signups
- Every feature landing page targets a head keyword cluster
- V2 features (état des lieux, charges, accounting) each unlock new content clusters
- V3 features (online payments, e-signature) enable high-commercial-intent content
- The blog content calendar (seo-content-roadmap.md) is the editorial layer on top of this roadmap

**Rule:** Every new feature added to the roadmap must include:
1. Target keyword(s) for associated landing page or blog content
2. SEO considerations section in the spec
3. Schema markup requirements

---

*Document owner: Product Manager (REN-20)*
*Last updated: 2026-04-15*
*Next review: Sprint planning — weekly*
