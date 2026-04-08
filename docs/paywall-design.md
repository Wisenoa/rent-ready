# Paywall & Free Tier Design — RentReady SaaS
**Issue:** REN-65 | **Role:** Product Manager | **Date:** 2026-04-08

---

## 1. Free Tier — What to Give Away (Wedge: Trust & Activation)

**Rationale:** Free tier must be generous enough to build trust, demonstrate value, and surface the upgrade CTA organically. It should let users experience the core workflow end-to-end for 1 property.

### FREE Tier (No credit card, 14-day full trial → converts to FREE forever)

| Module | Free Limit | Gated Feature |
|---|---|---|
| **Properties** | 1 property | Add 2nd+ property |
| **Tenants** | 3 tenants | Add 4th+ tenant |
| **Leases** | 1 active lease | 2nd+ lease |
| **Rent receipts (Quittances)** | 3/month | Unlimited |
| **Bank detection (Open Banking)** | DISABLED | Enable |
| **IRL revision auto-calc** | ENABLED | — |
| **Maintenance tickets** | 5/month | Unlimited |
| **Document vault** | 5 documents | Unlimited |
| **Owner portal** | ENABLED | — |
| **Tenant portal** | ENABLED | — |
| **Export accountant** | DISABLED | Enable |
| **Reminder & auto-relance** | 10/month | Unlimited |
| **AI lease extraction** | DISABLED | Enable |
| **Multi-user / Organization** | DISABLED | Enable |

**Total free experience:** Landlord can manage 1 property, 3 tenants, 1 lease, with basic quittances and tenant portal. This covers ~40% of independent landlords' needs. The moment they add a 2nd property or want accounting exports, they upgrade.

---

## 2. Paid Tiers

### STARTER — 9€/mois
- Up to **3 properties**
- Unlimited tenants & leases
- Quittances illimitées
- Auto-relance & reminders illimités
- Maintenance tickets illimités
- Owner portal
- Tenant portal
- Bank detection (**1 connection**)
- AI lease extraction
- **No accounting export**

### PRO — 15€/mois *(current plan)*
- Up to **10 properties**
- Everything in STARTER
- Accounting export (PDF/CSV)
- Bank detection (**3 connections**)
- Priority support
- All future V1 features

### AGENCY — sur devis
- Unlimited properties
- Multi-user organization workspace
- API access
- Custom branding
- Dedicated support
- SLA

---

## 3. Upgrade CTA Triggers

### A. Hard Gating (Feature-level)
When user hits a FREE limit, block the action and show inline upgrade prompt:
- "Ajoutez votre 2eme bien" → upgrade card slides in
- "Export comptable" button → disabled with lock icon + "Disponible en PRO"

### B. Contextual CTAs (Dashboard)
After key actions, suggest upgrade organically:
- After creating 1st property + 1st tenant + 1st lease → toast: "Gererez tous vos biens des 15EUR/mois"
- After generating 3rd quittance → banner: "Quittances illimitees en PRO — 15EUR/mois"
- After 14-day trial expiry → full-screen upgrade wall on next login
- When bank transaction is detected but no connection configured → nudge card

### C. Upgrade Banner Component (to add to dashboard)
```
+---------------------------------------------------------+
| [icon] Vous gerez 1 bien — Premium vous permet           |
|        de gerer jusqu'a 10 biens pour 15EUR/mois.        |
|        [Essai gratuit 14j] [Voir les tarifs]             |
+---------------------------------------------------------+
```
Trigger: show when user has 1+ active lease AND is on FREE/trial plan AND has < 3 properties.

### D. Trial Expiration Flow
1. **7 days before:** Email reminder + dashboard banner (dismissible)
2. **1 day before:** Email + push notification
3. **At expiration:** Full-screen blocking overlay on next login
   - "Votre essai a expire — Choisissez un plan pour continuer"
   - Options: STARTER (9EUR) / PRO (15EUR) / Annuler (lose data after 30d)
4. **Post-expiry grace:** 7-day grace period (read-only) before soft-lock

---

## 4. Implementation Notes for Engineering

### Database changes
- Add `Plan` enum to User model OR rely on Organization.plan
- Currently: `User.subscriptionStatus` (TRIAL/ACTIVE/etc.) — already exists
- Currently: `Organization.plan` (FREE/STARTER/PRO/AGENCY) — already exists
- **Recommendation:** Use `User.subscriptionStatus` for billing state, add `User.plan` field mirroring Organization.plan for per-user override

### New component: `<UpgradeGate feature="banking" requiredPlan="STARTER" />`
- Wraps any gated feature
- Shows paywall card with plan comparison on hover/click
- Pass `requiredPlan: "STARTER" | "PRO"` prop

### New component: `<UsageMeter current={n} limit={limit} />`
- Shows progress bar: "2/3 biens utilises"
- At 80%+ usage, show subtle upgrade nudge

### New page: `/upgrade`
- Plan comparison page (upgrade from current plan)
- Pre-filled with user's current usage data
- Shows which features unlock on upgrade

### Stripe integration (already in place)
- `trial_period_days: 14` already set in `createCheckoutSession()`
- Add `metadata.trialPlan` to track which plan they trialled
- On trial ACTIVE transition: send welcome email + onboard user into PRO features

### Trial expiration handling
- Cron job or Stripe webhook handler for `customer.subscription.trial_will_end`
- On expiry webhook: set `User.subscriptionStatus = "EXPIRED"`
- Middleware checks: if EXPIRED and accessing paid feature → redirect to `/upgrade`

### Billing page updates
- Show current plan + trial expiry date prominently at top
- Add "Changer de plan" button linking to `/upgrade`
- Show usage meters (properties used / limit)
- Add "Annuler mon abonnement" link to Stripe portal

---

## 5. MoSCoW Prioritization

### MUST (P0 — ship with MVP paywall)
- Inline `<UpgradeGate />` component with lock icon + upgrade CTA
- Dashboard usage meter for properties (1/1 used → show upgrade banner)
- Trial expiration redirect middleware
- `/upgrade` page with STARTER/PRO comparison
- Billing page: show plan status + upgrade link

### SHOULD (P1 — ship within 1 sprint)
- Usage meters for all gated modules (tenants, leases, quittances)
- Upgrade banners triggered by action count thresholds
- Stripe webhook for `trial_will_end`
- Email notification on trial expiring (7 days, 1 day)

### COULD (P2 — later)
- Soft-lock (read-only) after grace period
- Feature tours / tooltips showing what's locked
- A/B test upgrade CTA copy and placement
- Annual plan discount display (2 mois offert = 150EUR/an)

### WON'T (at MVP)
- Freemium referral program
- Agency tier implementation
- Custom plan negotiation flow
