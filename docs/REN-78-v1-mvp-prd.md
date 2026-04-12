# V1 MVP Product Requirements — RentReady
**Issue:** REN-78 | **Author:** Product Manager | **Date:** 2026-04-12
**Status:** Ready for Engineering

---

## 1. STRATEGIC CONTEXT (from REN-7)

### Market Wedge Decision: LANDLORD-FIRST
**Why:** Fastest path to product-market fit. Independent landlords (1-5 properties) represent the largest underserved segment — they use spreadsheets/email or expensive agency management. They are reachable via SEO content (how-to queries, template pages) and have low switching cost. This wedge allows 1-2 engineers to build a complete core loop in 4-6 weeks.

**Target ICP:** French independent landlord, 25-55yo, owns 1-3 residential properties, manages manually or via Excel, stressed by admin paperwork, values time savings and legal reliability.

---

## 2. V1 CORE FEATURE SET (6 Features)

### Feature 1: Property Management
**What:** Add/edit/archive rental properties with address, type, characteristics, photos.
**User Story:** "As a landlord, I want to add my rental properties so I can see all my assets in one place."
**Why this matters:** Foundation of the product. No property = no lease = no tenant = no value.

| Acceptance Criteria | Description |
|---|---|
| AC1 | User can add a property with: address (autocomplete), type (apartment/house/studio), bedroom count, surface area (m²), monthly rent, charges |
| AC2 | Property list shows all properties with status badge (occupied/vacant) and quick financial summary |
| AC3 | User can click a property → property detail page with all linked leases, tenants, and financial summary |
| AC4 | Property detail page shows current lease end date and days until expiration |
| AC5 | Archive (soft-delete) a property — hidden from active list but preserved for history |

---

### Feature 2: Lease Management
**What:** Create, view, and manage lease agreements linked to a property and tenant.
**User Story:** "As a landlord, I want to create a lease document so I can formalize the rental relationship."
**Why this matters:** This is the #1 activation moment. A landlord who creates their first lease has converted from curious to active user. Lease creation must be fast (< 10 min) and feel legally authoritative.

| Acceptance Criteria | Description |
|---|---|
| AC1 | Create lease form selects: property (dropdown), tenant (dropdown or quick-create), start date, end date, monthly rent (base), charges (provision), deposit amount |
| AC2 | On submit: server action creates lease, generates PDF, stores `leaseDocumentUrl` on the lease record |
| AC3 | Lease detail page shows: property ref, tenant ref, key dates, financial terms, payment history, document download |
| AC4 | Lease status: `draft` → `active` → `expired` / `terminated` |
| AC5 | Lease detail page shows 60-day renewal warning banner if end date is within 60 days |
| AC6 | Download lease PDF button on detail page |

---

### Feature 3: Tenant Management
**What:** Add and manage tenant profiles linked to leases.
**User Story:** "As a landlord, I want to manage tenant information so I have a clear record of who's renting my properties."
**Why this matters:** Tenants are central to the lease relationship. Landlord needs name, contact, lease reference, and payment status at a glance.

| Acceptance Criteria | Description |
|---|---|
| AC1 | Create tenant: first name, last name, email, phone, move-in date |
| AC2 | Tenant list view with: name, property ref, lease status, last payment date |
| AC3 | Tenant detail page shows: personal info, current lease, payment history (all transactions), documents |
| AC4 | Quick-link from tenant detail to their active lease page |
| AC5 | Tenant can be marked inactive (after lease termination) — preserved in history |

---

### Feature 4: Rent Collection & Payment Tracking
**What:** Record rent payments, auto-generate receipts (quittances), track unpaid rent.
**User Story:** "As a landlord, I want to record payments so I have legal proof and financial clarity."
**Why this matters:** This is the daily workflow. Recording a payment and generating a quittance is the most repeatitive high-value action. Auto-reminders for late payment reduce landlord stress.

| Acceptance Criteria | Description |
|---|---|
| AC1 | Transaction list view shows all rent payments with: date, amount, type (rent/charges/deposit), status (paid/unpaid/partial), tenant ref |
| AC2 | "Mark as Paid" button on unpaid transactions → opens payment date input → confirms payment → triggers quittance PDF generation |
| AC3 | Quittance PDF auto-generated: landlord name/address, tenant name/address, property address, period, rent+charges, total, payment date, signature |
| AC4 | `receiptUrl` stored on Transaction record after generation |
| AC5 | Unpaid transactions show in dashboard "Action Required" section with days overdue badge |
| AC6 | Monthly rent due dates visible on dashboard calendar |

---

### Feature 5: Dashboard Overview
**What:** Landlord landing page after login showing financial health, urgent actions, and property summary.
**User Story:** "As a landlord, I want to see the health of my rental business in one view so I know what needs attention."
**Why this matters:** First impression after login. Must show value immediately (not an empty state) and surface urgent actions (overdue rent, expiring leases). Drives daily engagement.

| Acceptance Criteria | Description |
|---|---|
| AC1 | Dashboard shows: total properties, total tenants, monthly rent expected vs received, overdue payments count |
| AC2 | "Action Required" section: unpaid rent items (sorted by oldest first), leases expiring within 60 days |
| AC3 | Recent activity feed: last 5 transactions/leases/actions |
| AC4 | Quick-action buttons: "Add Property", "Add Tenant", "Record Payment", "New Lease" |
| AC5 | Empty state for new users: guided onboarding prompt with "Add your first property" CTA |
| AC6 | V1 metric widget: "This month" rent collected vs expected |

---

### Feature 6: Onboarding Wizard
**What:** 4-step guided setup for new landlords to add first property, first tenant, and first lease.
**User Story:** "As a new landlord, I want to be guided through setup so I can get started in under 10 minutes."
**Why this matters:** Reduces time-to-first-lease. New landlords who reach their first lease faster are dramatically more likely to become retained users. Must instrument drop-off at each step.

| Acceptance Criteria | Description |
|---|---|
| AC1 | Step 1: Welcome + property count selection (1 / 2-5 / 6+) |
| AC2 | Step 2: Add first property (address autocomplete, type, rent) |
| AC3 | Step 3: Add first tenant (name, email, phone) |
| AC4 | Step 4: Create first lease (property pre-selected, dates, rent) → success screen |
| AC5 | Progress bar at top of each step |
| AC6 | On completion: redirect to dashboard with the newly created lease visible |
| AC7 | Track step completion in analytics |

---

## 3. V1 USER FLOWS

### Core Activation Flow (Landlord Journey)
```
Signup → Dashboard (empty state) → Onboarding Wizard (Step 1)
  → Step 2: Add First Property
  → Step 3: Add First Tenant
  → Step 4: Create First Lease → PDF generated
  → Dashboard (populated) ← First value moment
  → Add next property when ready
```

### Daily Workflow
```
Dashboard → See "Action Required" (overdue rent)
  → Click transaction → Mark as Paid → Quittance auto-generated
  → Dashboard updates (action resolved)
  → Monthly: review new transactions, send reminders
```

---

## 4. V1 CORE USER FLOW WIREFRAME (ASCII)

### Dashboard (New User — Post-Onboarding)
```
┌─────────────────────────────────────────────────────────────┐
│  [RentReady Logo]              [Notif] [?] [Avatar]         │
│─────────────────────────────────────────────────────────────│
│                                                             │
│  Bienvenue ! Vous avez 2 biens, 3 locataires               │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐ │
│  │  💰 Ce mois    │ │  ⚠️ Actions      │ │  📅 Échéances │ │
│  │  2 450 € / 3 000€│ │  2 paiements    │ │  1 bail expire│ │
│  │  [▓▓▓▓▓▓░░] 81%  │ │  en retard      │ │  dans 45 jours│ │
│  └─────────────────┘ └─────────────────┘ └──────────────┘ │
│                                                             │
│  ── Actions requises ────────────────────────────────────── │
│  ⚠️ Jean Dupont — 12 rue des Lilas — 650€ en retard (15j) │
│     [Marquer payé] [Relancer] [Voir]                       │
│  ⚠️ Marie Martin — 8 av. Voltaire — 920€ en retard (3j)  │
│     [Marquer payé] [Relancer] [Voir]                       │
│                                                             │
│  ── Vos biens ─────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🏠 12 rue des Lilas, Paris 75011                     │  │
│  │     Appartement T3 · 75m² · Loué · Bail jusqu'au 30/06│  │
│  │     → Jean Dupont · 650€/mois + 80€ charges          │  │
│  │     [Voir le bien] [Voir le bail] [Nouveau paiement] │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🏠 8 av. Voltaire, Paris 75011                       │  │
│  │     Studio · 28m² · Loué · Bail jusqu'au 15/05       │  │
│  │     → Marie Martin · 920€/mois + 100€ charges         │  │
│  │     [Voir le bien] [Voir le bail] [Nouveau paiement] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [+ Ajouter un bien]  [+ Enregistrer un paiement]         │
└─────────────────────────────────────────────────────────────┘
```

### Onboarding Step 2 — Add Property
```
┌─────────────────────────────────────────────────────────────┐
│  [RentReady Logo]              Étape 2/4                    │
│  ═══════════════════════════░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                             │
│  Ajoutons votre première propriété                         │
│                                                             │
│  Adresse *                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  12 rue des Lilas                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Type de bien *                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Appartement│ │ Maison  │ │ Studio   │ │ Autre        │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                                                             │
│  Surface (m²) *          Nombre de pièces *               │
│  ┌──────────────┐        ┌──────────────┐                 │
│  │  75          │        │  3           │                  │
│  └──────────────┘        └──────────────┘                 │
│                                                             │
│  Loyer mensuel (€) *     Charges mensuelles (€)           │
│  ┌──────────────┐        ┌──────────────┐                 │
│  │  650         │        │  80          │                  │
│  └──────────────┘        └──────────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Continuer →                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ← Retour                                            Passer │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. ROUTING & PAGE STRUCTURE (V1)

| Route | Purpose | Status |
|---|---|---|
| `/dashboard` | Main landlord view — action required, property list, financial summary | To build (exists as page.tsx, needs full data wiring) |
| `/properties` | Property list | Exists — needs AC fulfillment |
| `/properties/[id]` | Property detail with leases/tenants | In progress (REN-56) |
| `/leases/new` | Create lease wizard | In progress (REN-61 wired) |
| `/leases/[id]` | Lease detail with payment history | In progress (REN-56 child task) |
| `/tenants` | Tenant list | Exists — needs AC fulfillment |
| `/tenants/[id]` | Tenant detail with payments/documents | To build |
| `/billing` | Transaction list + mark-paid | Exists (REN-65 paywall issue) |
| `/onboarding` | 4-step wizard | To build (REN-63 done but may need enhancement) |

**Priority order for engineering:** Dashboard → Properties → Leases → Tenants → Billing → Onboarding enhancement

---

## 6. V1 CONVERSION METRIC

### Primary Metric: **Trial-to-First-Lease Rate**
**Definition:** % of users who create their first lease within 14 days of signup.
**Target:** ≥ 40% within 30 days (ambitious but achievable with good onboarding).
**Why this metric:** Creating a lease is the moment the product delivers tangible value. A landlord with a lease in the system has financial history, a tenant relationship, and quitting cost. This is the leading indicator of activation and retention.

**Secondary metrics:**
- Time from signup to first lease (target: < 15 min through onboarding)
- Dashboard return rate (target: ≥ 3 returns in first 7 days)
- Property addition rate (target: ≥ 1 property added within 48h of signup)

---

## 7. FREE/PAID BOUNDARY (from REN-65)

| Feature | FREE | STARTER (9€) | PRO (15€) |
|---|---|---|---|
| Properties | 1 | 3 | 10 |
| Tenants | 3 | Unlimited | Unlimited |
| Leases | 1 | Unlimited | Unlimited |
| Quittances | 3/month | Unlimited | Unlimited |
| Reminders | 10/month | Unlimited | Unlimited |
| Accounting export | — | — | ✓ |

**V1 scope focuses on FREE and STARTER features. PRO gate (accounting export) is in scope but lower priority for MVP.

---

## 8. OUT OF SCOPE FOR V1

- Open Banking / bank transaction auto-sync
- Owner portal (separate login for property owners)
- Tenant portal (public-facing)
- Maintenance ticket tracking
- Fiscal/e-reporting exports
- Multi-user organization workspaces
- AI lease extraction
- Mobile app

---

## 9. SUCCESS CRITERIA

For V1 to be considered complete:
1. ✅ Landlord can add a property, add a tenant, create a lease, and generate a quittance PDF in < 20 minutes total
2. ✅ Dashboard shows accurate financial summary (expected vs received rent) for all properties
3. ✅ "Action required" section correctly surfaces overdue payments and expiring leases (≤ 60 days)
4. ✅ Onboarding wizard completes with new user reaching dashboard (populated state) in < 10 minutes
5. ✅ V1 conversion metric: ≥ 40% trial-to-first-lease rate within 30 days (measured post-launch)
6. ✅ No hard errors on core flows (lease creation, payment recording, quittance generation)
7. ✅ Stripe integration complete (free trial 14 days → upgrade prompts functional)