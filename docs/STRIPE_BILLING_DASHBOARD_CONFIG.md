# Stripe Billing Dashboard Configuration — MRR / Churn Tracking

**Issue:** REN-566 | **Author:** CTO | **Date:** 2026-04-28
**Goal:** Configure Stripe dashboard to track MRR, trial-to-paid conversion, churn rate, LTV, and expansion revenue. Set up a CFO view shareable weekly.

---

## 1. Stripe Dashboard Native Metrics

Stripe Dashboard already provides most of the needed metrics. Configure the following sections:

### 1.1 MRR Tracking (Stripe Dashboard)

**Path:** Stripe Dashboard → **Revenue** → **Recurring revenue**

This shows:
- **MRR** (Monthly Recurring Revenue) — automatically calculated from active subscriptions
- **Active subscribers** count
- **Average revenue per user (ARPU)**

**Configuration:**
1. Go to Stripe Dashboard → **Settings** → **Business** → **Revenue definitions**
2. Confirm plan interval mapping: Monthly = monthly, Annual = 12-month commitment
3. Set **Proration policy** to "Never charge for unused time" for French legal compliance

**Note:** Stripe calculates MRR as: `SUM(plan_price × active_subscribers)`. Confirm EUR currency is set on all prices (already confirmed in `PLANS` config at `src/lib/stripe.ts`).

### 1.2 Subscription Status Breakdown

**Path:** Stripe Dashboard → **Customers** → filter by subscription status

Track these cohorts:
| Status | Stripe Status | Meaning |
|---|---|---|
| `TRIAL` | `trialing` | Free trial — 14 days |
| `ACTIVE` | `active` | Paying subscriber |
| `PAST_DUE` | `past_due` | Payment failed — at risk |
| `CANCELED` | `canceled` | Churned |
| `UNPAID` | `unpaid` | Invoice overdue |

### 1.3 Customer LTV

**Path:** Stripe Dashboard → **Revenue** → **Customer lifetime value**

This shows:
- Average LTV per customer
- LTV by plan (monthly vs annual)
- Retention curves

**LTV Formula (manual calculation if needed):**
```
LTV = ARPU × Average Customer Lifespan
Average Customer Lifespan = 1 / Monthly Churn Rate
```

---

## 2. CFO Dashboard Setup (Stripe)

### 2.1 Create a CFO-Ready Dashboard

1. Go to **Stripe Dashboard** → **Dashboards** → **New Dashboard**
2. Name it: **"RentReady CFO — Weekly Review"**
3. Add the following **metrics as tiles**:

#### Tile 1: MRR
- Metric: **Recurring revenue**
- Filter: `currency:eur`, `status:active`
- Display: Current value + MoM change

#### Tile 2: New MRR
- Metric: **Recurring revenue**
- Filter: `currency:eur`, `status:active`, `created:[this month]`
- Display: New bookings this month

#### Tile 3: Churned MRR
- Metric: **Recurring revenue**
- Filter: `currency:eur`, `status:canceled`, `canceled_at:[this month]`
- Display: MRR lost this month

#### Tile 4: Net New MRR
- Formula: `New MRR − Churned MRR`

#### Tile 5: Trial-to-Paid Conversion Rate
- Formula: `Active subscriptions with trial_origin / Total trials`
- Alternative: Track via Stripe `subscriptions` with `trial_end > now - 30d`
- **Target:** > 40% (per Q2 OKR KR-P2)

#### Tile 6: Churn Rate
- Formula: `Churned customers / Total customers at start of month`
- **Target:** < 3%/month

#### Tile 7: Customer LTV
- Metric: **Customer lifetime value** (Stripe natively computes this)

#### Tile 8: Expansion Revenue
- Metric: **Recurring revenue change** filtered by plan upgrade (no downgrade in v1)
- Track: Monthly → Annual upgrades

### 2.2 Share the Dashboard

1. **Stripe Dashboard** → **Dashboards** → select the CFO dashboard → **Share**
2. Add CEO email as **read-only viewer**
3. Set refresh: **Daily** (or real-time)
4. Alternatively: export as PDF and email via Resend every Monday

---

## 3. App-Level MRR / Churn Tracking (Implementation)

The Stripe Dashboard covers high-level metrics. For deeper tracking, the following app-level implementation is recommended:

### 3.1 Subscription Status Model

Current model already tracks `subscriptionStatus` on `User`. Confirm the enum covers all states:
```typescript
// Expected statuses in prisma/schema.prisma or lib/stripe.ts
type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'
```

### 3.2 Stripe Webhook Events to Handle

The existing webhook route at `src/app/api/webhooks/stripe/route.ts` must handle these events for accurate MRR/churn tracking:

| Event | Purpose |
|---|---|
| `customer.subscription.created` | New subscription → increment MRR |
| `customer.subscription.updated` | Plan change → recalculate MRR |
| `customer.subscription.deleted` | Churn → decrement MRR, set CANCELED |
| `invoice.payment_succeeded` | Confirm payment received |
| `invoice.payment_failed` | Set PAST_DUE, trigger retry logic |
| `customer.trial_will_end` | Send reminder email at 3 days before trial end |
| `checkout.session.completed` | Track trial starts |

### 3.3 Churn Tracking Query (for internal reporting)

```sql
-- Monthly churn rate
SELECT
  DATE_TRUNC('month', canceled_at) as month,
  COUNT(*) as churned_customers,
  SUM(plan_amount) / 100.0 as churned_mrr_eur
FROM stripe_subscriptions
WHERE status = 'canceled'
  AND canceled_at >= NOW() - INTERVAL '6 months'
GROUP BY 1
ORDER BY 1 DESC;
```

### 3.4 Trial-to-Paid Funnel Query

```sql
-- Trial to paid conversion
SELECT
  DATE_TRUNC('month', created) as month,
  COUNT(*) FILTER (WHERE status = 'trialing') as trials_started,
  COUNT(*) FILTER (WHERE status = 'active' AND trial_end IS NOT NULL) as converted,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'active' AND trial_end IS NOT NULL)::numeric
    / NULLIF(COUNT(*) FILTER (WHERE status = 'trialing'), 0) * 100, 1
  ) as conversion_rate_pct
FROM stripe_subscriptions
WHERE created >= NOW() - INTERVAL '3 months'
GROUP BY 1
ORDER BY 1 DESC;
```

---

## 4. KPI Digest Cron (Recommended Enhancement)

Create a **weekly KPI digest email** to CEO using the existing cron infrastructure:

**Endpoint:** `POST /api/cron/kpi-digest`

Already exists at `src/app/api/cron/kpi-digest/route.ts`. Verify it outputs:
- MRR (current + MoM change)
- Trial-to-paid rate (last 7 days)
- Churned customers (last 7 days)
- New signups
- Expansion revenue (upgrades this week)

If not already sending to CEO email, update the cron to trigger via Resend email.

---

## 5. Setup Checklist

- [ ] **Stripe Dashboard → Revenue → Recurring Revenue** — confirm EUR MRR showing
- [ ] **Create CFO Dashboard** with 8 tiles above in Stripe Dashboard
- [ ] **Share CFO Dashboard** with CEO as read-only
- [ ] **Review webhook handler** at `src/app/api/webhooks/stripe/route.ts` — confirm all 7 events handled
- [ ] **Check `kpi-digest` cron** — confirm it emails CEO weekly with MRR, churn, conversion
- [ ] **Verify trial tracking** — 14-day trials already set in `createCheckoutSession` (trial_period_days: 14)
- [ ] **Confirm annual plan** correctly shows as 12-month commitment in Stripe Dashboard

---

## 6. ENV Variables Required

All already configured in `.env` (verify):
```
STRIPE_SECRET_KEY=sk_live_...       # or sk_test_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CFO_EMAIL=ceo@rentready.fr   # add if not present
```

---

## 7. Reference: Existing Billing Code

| File | Purpose |
|---|---|
| `src/lib/stripe.ts` | Stripe client, plan definitions, helper functions |
| `src/app/api/stripe/plans/route.ts` | Returns plan info (price, trial days) |
| `src/app/api/stripe/checkout/route.ts` | Creates checkout sessions |
| `src/app/api/stripe/portal/route.ts` | Customer portal session |
| `src/app/api/webhooks/stripe/route.ts` | Handles subscription lifecycle events |
| `src/app/(dashboard)/billing/page.tsx` | User-facing billing page |
| `src/app/(dashboard)/billing/subscription-banner.tsx` | Trial/paywall banner |
| `src/lib/actions/subscription-actions.ts` | Server actions for subscription management |
| `src/lib/rate-limit.ts` | Rate limiting for checkout |

---

*Next step: Review the webhook handler in detail and ensure all 7 subscription events above are correctly updating `subscriptionStatus` on the User model.*
