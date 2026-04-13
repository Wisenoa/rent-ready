# V1 Conversion Metric Measurement Plan
**Issue:** Related to REN-78 | **Author:** Product Manager | **Date:** 2026-04-13
**Purpose:** Define how to measure, instrument, and track the V1 primary conversion metric

---

## Primary Metric: Trial-to-First-Lease Rate

**Definition:** % of users who create their first lease within 14 days of signup.
**Target:** ≥ 40% within 30 days of signup.

---

## Funnel Stages & Events

| Stage | Event Name | Trigger | Properties to capture |
|---|---|---|---|
| Signup completed | `user.signup_completed` | New user record created | `user_id`, `source`, `timestamp` |
| Onboarding Step 1 viewed | `onboarding.step1_viewed` | Landing on `/onboarding` | `user_id`, `step`, `timestamp` |
| Onboarding Step 1 completed | `onboarding.step1_completed` | Continue clicked on step 1 | `user_id`, `property_count_selected`, `timestamp` |
| First property created | `property.created` | Property saved | `user_id`, `property_id`, `address`, `timestamp` |
| First tenant created | `tenant.created` | Tenant saved | `user_id`, `tenant_id`, `timestamp` |
| First lease created | `lease.created` | Lease server action completes | `user_id`, `lease_id`, `property_id`, `tenant_id`, `rent_amount`, `timestamp` |
| First payment marked paid | `payment.marked_paid` | Transaction marked paid | `user_id`, `transaction_id`, `amount`, `timestamp` |
| First quittance downloaded | `quittance.downloaded` | PDF download clicked | `user_id`, `transaction_id`, `timestamp` |

---

## Funnel Drop-Off Points to Instrument

### Onboarding Drop-off (most critical)
- Step 1 → Step 2: expected drop if property count selected but user doesn't continue
- Step 2 → Step 3: property creation drop-off — where do people abandon?
- Step 3 → Step 4: tenant creation drop-off
- Step 4 → Dashboard: lease creation drop-off (most important — this is the "first lease" moment)

### Measurement approach:
Track `onboarding.step_completed` events with step number. Cohort by step to see where largest drop happens. Primary alert: if step 4 completion rate drops below 60%, onboarding flow needs urgent review.

---

## Dashboard Activation Tracking

| Metric | Definition | Target |
|---|---|---|
| Days to first property | Time from signup to first property.created event | < 2 days |
| Days to first lease | Time from signup to first lease.created event | < 7 days |
| Dashboard return rate | # of distinct days with dashboard hit in first 7 days | ≥ 3 days |
| Property completion rate | % of users who complete onboarding and reach dashboard | ≥ 50% |

---

## Recommended Analytics Setup

### Events to fire (server-side via server actions):
```
// On signup
analytics.identify(userId, { createdAt, source, initialPropertyCount })

// On lease creation
analytics.track('lease_created', {
  userId,
  leaseId,
  daysFromSignup,
  propertyId,
  tenantId,
  rentAmount
})
```

### Cohort definition:
- **V1 Launch Cohort:** All users who signed up after V1 feature flag is on
- **Control period:** Track week-over-week lease creation rate from day 0 to day 14
- **Alert threshold:** If week-over-week rate drops >10%, investigate (onboarding broken or traffic quality issue)

---

## Conversion Rate Calculation

```
Trial-to-First-Lease Rate = 
  COUNT(users with at least 1 lease.created event within 14 days of signup)
  ÷
  COUNT(total users who signed up in period)

Time window: 14 days post-signup
Reporting cadence: weekly
```

### SQL query pattern:
```sql
WITH signups AS (
  SELECT 
    user_id,
    created_at as signup_date
  FROM users
  WHERE created_at >= '2026-04-20' -- V1 launch date
),
leases AS (
  SELECT 
    user_id,
    MIN(created_at) as first_lease_date
  FROM leases
  GROUP BY user_id
)
SELECT
  COUNT(DISTINCT s.user_id) as total_signups,
  COUNT(DISTINCT l.user_id) as converted_to_lease,
  ROUND(COUNT(DISTINCT l.user_id)::NUMERIC / COUNT(DISTINCT s.user_id) * 100, 1) as conversion_rate
FROM signups s
LEFT JOIN leases l ON s.user_id = l.user_id 
  AND l.first_lease_date <= s.signup_date + INTERVAL '14 days'
```

---

## Secondary Metrics Dashboard

| Metric | Target | Alert |
|---|---|---|
| Onboarding step 4 completion rate | ≥ 60% | < 50% |
| Avg days signup → first lease | < 7 days | > 14 days |
| Dashboard 7-day return rate | ≥ 50% | < 30% |
| Quittance generated per lease | ≥ 80% of leases generate at least 1 quittance | < 60% |

---

## Baseline Assumptions (Pre-V1 Launch)

| Metric | Assumption | How to validate |
|---|---|---|
| Signup → onboarding start | 100% (onboarding is immediate after signup) | Check if `onboarding.step1_viewed` count = signup count |
| Onboarding completion (step 4) | 55% | Based on similar SaaS onboarding benchmarks |
| First lease within 14 days | 45% | Estimate based on "day 7 retention" typical for B2C/B2B SaaS |
| Week-over-week variance | ± 5% | Will need 4+ weeks of data to establish baseline |

Re-measure after 2 weeks of V1 traffic and adjust targets accordingly.

---

## A/B Testing Opportunities (Post-V1)

Once baseline is established:
1. **Onboarding flow** — test 4-step vs 3-step (merge steps 1+2 if property count = 1)
2. **Lease creation form** — test pre-filled defaults vs empty fields
3. **Dashboard CTAs** — test "New Lease" button placement (sidebar vs top banner)

---

## Dependencies

- Analytics SDK needs to be wired into server actions (currently no analytics library in use — suggest adding PostHog or simple event logger to DB)
- Events table in DB for `analytics_events` (or use existing audit log)
- Dashboard needs analytics widget with these metrics

---

## Owner & Timeline

- **PM owns:** metric definition, targets, funnel instrumentation spec
- **CTO/Engineering owns:** event firing in server actions, analytics dashboard, SQL queries
- **Measure starting:** V1 launch date (when all 6 features are shipped)