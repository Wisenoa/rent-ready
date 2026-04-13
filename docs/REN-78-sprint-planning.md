# V1 Sprint Planning — Feature Sequencing & Dependencies
**Author:** Product Manager | **Date:** 2026-04-13
**Related:** REN-78 (V1 MVP PRD), REN-46 (MVP Scope), REN-61, REN-56, REN-63

---

## Purpose

This document sequences the 6 V1 features (from REN-78) into an engineering-ready sprint plan. It defines:
- Sprint order and dependencies
- What can run in parallel vs. what must be sequential
- Blocker dependencies on existing work (REN-61, REN-56)
- Quick-win features that can ship first to show momentum

---

## Feature Dependency Graph

```
Sprint 0 (Foundation — 1-2 days)
├── Analytics instrumentation (fire events on server actions)
├── Dashboard data wiring (aggregate property/tenant/lease data)
└── Shared UI components (cards, badges, tables)

Sprint 1 (Core Loop — 3-4 days)
├── Feature 2: Lease Management (create + detail page)
│   └── Depends on: Properties list (REN-56 partial)
├── Feature 4: Rent Collection (transaction list + mark-paid)
│   └── Depends on: Tenant/lease data must exist
└── Feature 1: Property Management (list + detail)
    └── Already in progress (REN-56)

Sprint 2 (Data Layer — 2-3 days)
├── Feature 3: Tenant Management (list + detail)
│   └── Depends on: Sprint 1 lease creation
└── Feature 5: Dashboard (full wiring + action required)
    └── Depends on: All data layer (properties, tenants, leases, transactions)

Sprint 3 (Polish + Activation — 2-3 days)
├── Feature 6: Onboarding Wizard enhancement (connect to real DB)
└── Quittance PDF auto-attach (connect to billing flow)
```

---

## Sprint 0 — Foundation (1-2 days)

### Goal: Enable all other sprints by wiring data + instrumentation

### 0.1: Analytics Instrumentation
**Owner:** Engineering
**Files touched:** Server actions for properties, leases, tenants, transactions

Track these events (fire on server action success):
```
property.created → { propertyId, address }
tenant.created → { tenantId, name }
lease.created → { leaseId, propertyId, tenantId, rentAmount, daysFromSignup }
payment.marked_paid → { transactionId, amount, leaseId }
```

Use: lightweight DB table `analytics_events` (id, event_name, user_id, properties JSON, created_at) or PostHog if already configured.

**Why first:** Cannot measure V1 conversion metric (trial-to-first-lease rate) without event tracking.

---

### 0.2: Dashboard Data Wiring
**Owner:** Engineering
**Route:** `src/app/(dashboard)/dashboard/page.tsx`

Connect dashboard to real data:
- Properties: `db.property.count({ where: { userId } })`
- Tenants: `db.tenant.count({ where: { userId } })`
- Monthly rent: sum of `lease.rentAmount` for active leases
- Expected vs received: aggregate transactions for current month

**Quick win:** Dashboard shows data on day 1 of testing, even before full feature buildout.

---

## Sprint 1 — Core Loop (3-4 days)

### Goal: Landlord can create a lease and record a payment

### 1A: Lease Creation + Detail (REN-61 child)
**Owner:** Engineering (CTO)
**Routes:** `/leases/new` (wiring), `/leases/[id]` (detail page)
**Status:** Already in progress (REN-61 wired, REN-56 child)
**Gap:** Detail page `/leases/[id]` not built yet

**Acceptance Criteria (from REN-78):**
- Create lease form selects property, tenant, dates, rent → submit → server action creates lease + generates PDF
- Lease status: `draft` → `active` → `expired`/`terminated`
- Detail page shows: property ref, tenant ref, key dates, financial terms, payment history, PDF download
- 60-day renewal warning banner on detail page
- receiptUrl stored on lease record (from generated PDF)

**Engineering note:** Lease creation server action already exists (REN-61). Need: (1) lease detail page, (2) PDF auto-generate on create, (3) 60-day banner logic.

---

### 1B: Property List + Detail (REN-56)
**Owner:** Engineering (CTO)
**Routes:** `/properties` (list), `/properties/[id]` (detail)
**Status:** In progress

**Acceptance Criteria (from REN-78):**
- List: status badge (occupied/vacant), financial summary (rent - charges)
- List: days until lease expiry visible on each property card
- Detail: property info, current lease ref, tenant ref, financial summary
- Detail: maintenance tickets count (if built in Sprint 3)

---

### 1C: Rent Collection + Transaction List
**Owner:** Engineering
**Route:** `/billing`
**Status:** Page exists, needs wiring to real data + mark-paid flow

**Acceptance Criteria (from REN-78):**
- Transaction list: date, amount, type (rent/charges/deposit), status (paid/unpaid/partial), tenant ref
- "Mark as Paid" button on unpaid transactions → payment date input → confirm → triggers quittance PDF generation
- Quittance PDF auto-generated: landlord/tenant/property addresses, period, rent+charges, total, payment date, signature
- `receiptUrl` stored on Transaction record
- Unpaid transactions sorted by oldest first

**Engineering note:** Quittance PDF generation exists (REN-64). Need: wire to mark-paid flow, store receiptUrl on transaction.

---

## Sprint 2 — Data Layer (2-3 days)

### Goal: Landlord can manage all entities end-to-end

### 2A: Tenant Management (list + detail)
**Owner:** Engineering
**Routes:** `/tenants` (list), `/tenants/[id]` (detail — does not exist yet)
**Status:** List exists, detail page needs building

**Acceptance Criteria (from REN-78):**
- Tenant list: name, property ref, lease status, last payment date
- Tenant detail: personal info, current lease, full payment history
- Quick-link from tenant detail to their active lease page

**Engineering note:** `/tenants/[id]/page.tsx` is a new file — needs to be built.

---

### 2B: Full Dashboard Wiring
**Owner:** Engineering
**Route:** `/dashboard`

**Acceptance Criteria (from REN-78):**
- Financial summary: total properties, total tenants, monthly expected vs received
- Action Required: overdue payments (oldest first), leases expiring within 60 days
- Recent activity feed: last 5 transactions/leases/actions
- Quick-action buttons: Add Property, Add Tenant, Record Payment, New Lease
- Empty state for new users: onboarding CTA

---

## Sprint 3 — Polish + Activation (2-3 days)

### Goal: Onboarding completes the loop, quittance auto-attaches

### 3A: Onboarding Wizard (REN-63 enhancement)
**Owner:** Engineering
**Route:** `/onboarding`

**Acceptance Criteria (from REN-78):**
- Step 1: property count → Step 2: first property → Step 3: first tenant → Step 4: first lease → success screen
- Progress bar at top
- On completion: redirect to dashboard with populated data
- Track step completion in analytics (fire `onboarding.step_N_completed` events)

**Status:** REN-63 done, but needs connection to real DB (currently may be mock data).

---

### 3B: Quittance Auto-Attach
**Owner:** Engineering
**Trigger:** Transaction marked as paid

**Acceptance Criteria (from REN-78):**
- On mark-paid: PDF generated and `receiptUrl` stored on transaction
- Tenant record gets PDF attached to their payment history
- Download button appears on transaction row after generation

**Engineering note:** REN-64 implemented quittance generator. Need: auto-trigger on mark-paid, store URL, show download button.

---

## Dependency Matrix

| Feature | Must wait for | Can parallel with | Est. days |
|---|---|---|---|
| Analytics instrumentation | Nothing | Everything | 0.5 |
| Dashboard data wiring | Nothing | Everything | 1 |
| Lease detail page | Properties list | Tenant management | 1.5 |
| Rent collection | Lease creation | Property detail | 2 |
| Tenant detail page | Lease creation | Property detail | 1.5 |
| Full dashboard | All data layer | — | 1 |
| Onboarding enhancement | All entities exist | — | 1 |
| Quittance auto-attach | Billing page | — | 0.5 |

---

## Sequencing Recommendation

**Week 1 (Days 1-3): Sprint 0 + Sprint 1 parallel**
- Day 1: Analytics + dashboard wiring (foundation)
- Day 1-2: Lease detail page (in parallel with property detail)
- Day 2-3: Rent collection flow

**Week 1 (Days 4-5) + Week 2 (Days 1-2): Sprint 2**
- Tenant management
- Full dashboard wiring
- Connect onboarding to real DB

**Week 2 (Days 3-5): Sprint 3 + Buffer**
- Onboarding enhancement
- Quittance auto-attach
- Fix any remaining acceptance criteria gaps
- Testing + edge cases

**Total: ~10 working days for 1-2 engineers**

---

## Cross-Reference: REN-78 Acceptance Criteria vs. Existing Work

| AC from REN-78 | Route | Status | Notes |
|---|---|---|---|
| Property list with status badges | /properties | Exists | Needs AC check |
| Property detail (leases/tenants) | /properties/[id] | In progress (REN-56) | — |
| Lease create + PDF auto-gen | /leases/new | In progress (REN-61) | Wired but PDF not auto-triggered |
| Lease detail page | /leases/[id] | Not built | New file needed |
| 60-day renewal banner | /leases/[id] | Not built | Part of lease detail |
| Tenant list | /tenants | Exists | Needs AC check |
| Tenant detail page | /tenants/[id] | Not built | New file needed |
| Transaction list + mark-paid | /billing | Exists | Needs wiring |
| Quittance PDF generation | /billing | Exists (REN-64) | Needs auto-trigger |
| Dashboard financial summary | /dashboard | Partial | Needs full wiring |
| Action Required overdue list | /dashboard | Not built | New component |
| Onboarding wizard | /onboarding | Done (REN-63) | Needs DB connection |
| Analytics events | Server actions | Not built | Sprint 0 |

---

## Blocker Alerts

1. **Property detail page** (REN-56) must complete before **tenant detail page** can show lease refs — they're referenced, not independent.
2. **Lease creation** (REN-61) must be complete before **dashboard financial summary** can show accurate rent expected/received.
3. **Analytics instrumentation** (Sprint 0) must be in place before **Sprint 1 completes** — can't measure conversion without events.
4. **Onboarding enhancement** depends on all 3 data entities (property, tenant, lease) existing in DB — run last.

---

## Success Checkpoints

| Sprint | Checkpoint | How to verify |
|---|---|---|
| Sprint 0 | Dashboard shows real property/tenant counts | Login as test user, see counts not "0" |
| Sprint 1 | Lease created + PDF downloaded | Create test lease, download PDF |
| Sprint 1 | Payment marked paid + quittance generated | Mark test payment, verify PDF URL stored |
| Sprint 2 | Tenant detail shows lease + payment history | Navigate tenant detail, all data visible |
| Sprint 2 | Dashboard Action Required shows test overdue | Create unpaid transaction, appears in dashboard |
| Sprint 3 | Onboarding → populated dashboard | Run through wizard, land on dashboard with data |
| Sprint 3 | End-to-end: signup → first lease in < 15 min | Time it manually |