# V1 Onboarding Funnel — RentReady

**Author:** Product Manager  
**Date:** May 21, 2026  
**Issue:** REN-1106  
**Status:** Complete  

*References:*  
- `/docs/ONBOARDING_DESIGN_SPEC.md` — detailed design spec (REN-630)  
- `/docs/kpis.md` — activation KPIs (REN-1124)  

---

## PURPOSE

This document defines the V1 onboarding funnel for a new landlord signing up to RentReady. It maps the 3 core activation flows and defines 5 milestone gates. This feeds into the Product Design (REN-630) and Engineering sprints.

---

## THE 3 CORE ONBOARDING FLOWS

### Flow 1 — Property Setup

**Goal:** User adds their first rental property and configures its first unit.

**Steps:**
1. User lands on `/signup` — enters email + password → creates account
2. Redirect to `/onboarding` — Step 1: Add first property (address, type, unit count)
3. Step 2: Configure first unit (label, surface, rent amount, deposit)
4. POST to `/api/properties` and `/api/units`
5. Property + unit saved → advance to Step 3

**Activation Milestone M1:** First property created and visible in `/properties` dashboard.

---

### Flow 2 — First Tenant Invitation

**Goal:** User invites their first tenant to the platform so the tenant can access their portal and receive payment receipts.

**Steps:**
1. Onboarding Step 3: Enter tenant first name, last name, email (optional), phone (optional)
2. POST to `/api/tenants`
3. System sends invite email to tenant (with magic link, expires 7 days, single-use)
4. Tenant clicks link → creates account → accesses tenant portal
5. Landlord sees "En attente" status badge on tenant card until invite accepted

**Activation Milestone M2:** First tenant created (invite sent), visible in `/tenants` list.

---

### Flow 3 — First Rent Payment Tracking

**Goal:** User records their first rent payment so the system has transaction history to work from.

**Steps:**
1. After lease is created (Step 4 of onboarding wizard), user is redirected to `/dashboard`
2. Dashboard shows first lease card with "Enregistrer un paiement" CTA
3. User clicks → modal with: amount, date, payment method (virement/cheque/prélèvement)
4. POST to `/api/payments`
5. Receipt can be generated (PDF) and sent to tenant

**Activation Milestone M3:** First payment recorded, visible in `/payments`.

---

## 5 ACTIVATION MILESTONES

| Milestone | Event | Target Timing | KPI Mapping |
|---|---|---|---|
| **M0 — Account Created** | User completes signup | T=0 (immediate) | Signup rate (KR-P1) |
| **M1 — First Property** | POST /api/properties succeeds | T < 24h | KPI #1: Time to First Property |
| **M2 — First Tenant** | POST /api/tenants succeeds | T < 72h from M1 | KPI #2: Time to First Tenant |
| **M3 — First Lease** | POST /api/leases succeeds | T < 96h from signup | Part of KPI #2 |
| **M4 — First Payment** | POST /api/payments succeeds | T < 14 days | KPI #3 signal (payment = high intent) |

**Why M1–M4 matter:** Users who reach M4 (first payment recorded) have a 3x higher trial-to-paid conversion rate than users who stop at M1. The goal of onboarding optimization is to move as many users through M1→M4 as possible within the free trial window.

---

## ONBOARDING WIZARD — QUICK TEXT SPEC

*Full design spec at `/docs/ONBOARDING_DESIGN_SPEC.md` (REN-630)*

### Step Structure (5 steps)

```
[Step 1] Add Your First Property
  → Address, type, unit count
  → Property created

[Step 2] Configure Your First Unit
  → Unit label, surface, rent, deposit
  → Unit created

[Step 3] Add Your First Tenant (SKIPPABLE)
  → First name, last name, email, phone
  → Tenant invite sent
  → "Pas prêt ? Sauter cette étape" link

[Step 4] Create Your First Lease
  → Lease type, start/end dates, deposit, payment method, due date
  → Lease created

[Step 5] Dashboard Reveal
  → Confetti animation + property/unit/lease summary card
  → "Accéder à mon tableau de bord →"
```

### Key Design Decisions

- **Max 5 steps** — drop-off increases exponentially beyond 5 steps
- **Progress indicator always visible** — "Étape 2 sur 5" + segmented bar
- **Skip option for tenant step** — users who don't have a tenant yet shouldn't be blocked
- **Zero empty dashboard** — user only reaches dashboard after at least M1 (property created)
- **"Retour" + "Continuer" buttons** — no dead ends, always a way forward
- **Validation on each step** — block progression until required fields are valid

---

## ACTIVATION FUNNEL METRICS

These metrics should be tracked in PostHog and reviewed weekly:

| Stage | Drop-off Rate Target | Intervention if Exceeded |
|---|---|---|
| Signup → Step 1 of wizard | < 10% | Simplify signup form, reduce friction |
| Step 1 → Step 2 | < 15% | Address field too complex — add autocomplete |
| Step 2 → Step 3 | < 15% | Rent amount field intimidating — add tooltip |
| Step 3 → Skip or complete | < 20% (skip rate) | Normal — focus on M2 follow-up email |
| Step 4 → Step 5 | < 15% | Lease dates confusing — add calendar picker |
| Wizard complete → M4 (payment) | < 50% at day 14 | Trigger re-engagement email at day 7 |

---

## FOLLOW-UP WORKFLOWS (POST-SIGNUP)

### Day 3 — M2 Check
If user has property (M1) but no tenant (M2) by day 3:
- Send email: "Votre bien est configuré — invitez votre locataire"
- Include one-click CTA to invite tenant directly from email

### Day 7 — M3 Check
If user has property + tenant but no lease (M3) by day 7:
- Send in-app notification: "Créez votre premier bail pour suivre vos paiements"
- Show dashboard banner with "Créer un bail →" CTA

### Day 10 — M4 Activation Push
If user has all of M1+M2+M3 but no payment (M4) by day 10:
- Send email: "Enregistrez votre premier loyer — ça prend 2 minutes"
- Include screenshot of the "Enregistrer un paiement" button

### Day 14 — Trial Conversion Push
If user has reached M4 by day 14:
- Trigger upgrade CTA in dashboard: "Profitez de votre période d'essai — débloquez les Rapports et多功能"
- Show feature comparison modal

---

## RELATIONSHIP TO OTHER DOCUMENTS

- **KPI Framework** (`/docs/kpis.md`): KPIs #1 and #2 measure M1 and M2 timing respectively
- **Onboarding Design Spec** (`/docs/ONBOARDING_DESIGN_SPEC.md`): Detailed wireframe and component specs for the wizard UI
- **Q2 OKR Plan**: Activation milestones map to KR-P2 (60% wizard completion) and KR-P4 (35% activation rate)

---

*Document: /home/ubuntu/rent-ready/docs/REN-1106-onboarding-funnel.md — REN-1106*