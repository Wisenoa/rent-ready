# V1 Activation KPIs — RentReady

**Author:** Product Manager  
**Date:** May 21, 2026  
**Issue:** REN-1124  
**Status:** Complete  
**Context:** Follows REN-1106 (onboarding funnel definition). Feeds upcoming OKR review.

---

## PURPOSE

This document defines the 5 core activation KPIs for RentReady V1. These metrics track how effectively new landlords move from signup to meaningful product usage. They are the leading indicators of trial-to-paid conversion and long-term retention.

Targets below are based on Q2 OKR plan baselines (pre-launch = 0). Actual targets should be calibrated once we have 30+ days of live data.

---

## KPI 1 — Time to First Property

**Question:** How quickly does a new user add their first property?

### Definition
Time between account creation and the moment the user has saved their first property in the system (POST /properties in the API, or first property card visible in the dashboard).

### Measurement
- Segment by: acquisition source (organic, paid, referral), device type, first login date
- Unit: hours (rounded to nearest hour)
- Capture: property creation timestamp minus account creation timestamp

### Baseline & Target
| Cohort | Baseline (est.) | Target |
|---|---|---|
| Organic signup | n/a | < 24h |
| Paid traffic signup | n/a | < 12h |
| Referral signup | n/a | < 8h |

### Why It Matters
Time-to-first-property is the strongest predictor of activation. Users who add a property within 24h are significantly more likely to reach paid conversion. If median > 48h, onboarding flow needs friction reduction.

### Drop-off Interventions
- If > 30% of users drop before adding a property: simplify the "add property" onboarding step to 3 fields maximum
- Consider a "quick add" mode with just: address, type, monthly rent

---

## KPI 2 — Time to First Tenant

**Question:** How quickly does a user invite their first tenant after adding a property?

### Definition
Time between first property creation and the moment the first tenant invite email is sent from the platform (POST /tenants/invite or equivalent action).

### Measurement
- Unit: hours from first property creation
- Segment by: property type, rental strategy (long-term vs seasonal)

### Baseline & Target
| Cohort | Target |
|---|---|
| Users with property | < 72h to first tenant invite |
| Users with 2+ properties | < 48h |

### Why It Matters
Tenant invitation is the step that proves the user intends to use the product for its core purpose (rental management), not just document storage. Delayed tenant invites correlate with low engagement and higher churn.

### Drop-off Interventions
- If > 40% of users with a property have not invited a tenant within 7 days: trigger "invite your tenant" email nudge with pre-filled email template
- Add a "Your tenant hasn't accepted yet" status badge in the dashboard to prompt follow-up

---

## KPI 3 — Trial-to-Paid Conversion Rate by Cohort

**Question:** What percentage of free trial users convert to paid within 30 days? Does it vary by cohort?

### Definition
Number of users who transition from free trial (subscriptionStatus = TRIAL) to paid (ACTIVE) within 30 days of account creation, divided by total trial users in that cohort.

### Measurement
- Cohort dimensions: acquisition source, country, property count at signup, first feature used, device type
- Formula: `conversion_rate = paid_within_30d / total_trial_signups`
- Capture at: day 7, day 14, day 21, day 30

### Baseline & Target
| Cohort | Baseline | Target |
|---|---|---|
| Overall (all cohorts) | Pre-launch | 15% by end Q2 |
| Organic traffic | n/a | 20% |
| Paid traffic | n/a | 10% (higher acquisition cost, lower conversion bar) |
| Referral | n/a | 25% |
| 2+ properties at signup | n/a | 25% |

### Why It Matters
Trial-to-paid conversion is the single most important V1 revenue metric. Tracking by cohort reveals where activation is failing and where to double investment. Organic cohorts typically convert better because intent is higher.

### Drop-off Interventions
- If conversion < 10% overall at day 14: add a "you're missing X feature" in-app nudge for users who have not triggered a key action
- If specific cohort converts < 5%: run a 5-user interview session to identify friction point

---

## KPI 4 — Churn Drivers by Feature Usage

**Question:** Which features are correlated with retention, and which are correlated with churn?

### Definition
Identify which product actions (or absence of them) predict churn within 60 days of signup.

**Churn definition:** User whose subscriptionStatus transitions to CANCELLED or EXPIRED, or who has not logged in for 30+ consecutive days.

### Measurement
Track these feature usage events and correlate with churn:

| Feature | Usage Trigger | Churn Signal |
|---|---|---|
| First property added | `property.created` | No property after 7 days = high churn risk |
| First tenant invited | `tenant.invite_sent` | No tenant after 14 days = high churn risk |
| First lease created | `lease.created` | No lease after 21 days = high churn risk |
| Rent payment recorded | `payment.recorded` | No payment after 30 days = high churn risk |
| Dashboard visited | `dashboard.view` | < 2 dashboard visits in first week = high churn risk |
| Onboarding wizard completed | `onboarding.complete` | Wizard abandoned = high churn risk |

### Baseline & Target
| Metric | Target |
|---|---|
| Users who complete all 5 core activation events | 35%+ (from KR-P4 in Q2 OKR) |
| Users who complete 0–1 events and churn | < 20% |
| Churn rate among activated users (5+ events) | < 5%/month |
| Churn rate among non-activated users | > 30%/month |

### Why It Matters
Feature usage analysis reveals the "activation threshold" — the minimum set of actions that locks in a user. Any user who crosses this threshold is dramatically more likely to stay. This drives both onboarding design and churn prevention workflows.

### Drop-off Interventions
- Build automated "activation check" workflow: at day 7, if user has < 2 activation events, send re-engagement email
- Build "at-risk" flag: if a paid user stops using the dashboard for 14+ days, trigger CEO/PM alert

---

## KPI 5 — Onboarding Wizard Completion Rate

**Question:** What percentage of users complete the onboarding wizard, and where do they drop?

### Definition
Percentage of users who start the onboarding wizard (first screen = step 1) and reach the confirmation/completion screen (last step), divided by total users who start.

### Measurement
- Steps: track step-by-step drop-off using PostHog or custom events
- Key segments: by acquisition source, by property count selected, by whether user has prior property management experience

### Baseline & Target
| Metric | Target |
|---|---|
| Onboarding wizard completion rate | 60%+ (from KR-P2 in Q2 OKR) |
| Step 1 → Step 2 drop-off | < 15% |
| Step 2 → Step 3 drop-off | < 10% |
| Step 3 → Step 4 drop-off | < 10% |
| Step 4 → Complete drop-off | < 10% |

### Why It Matters
The onboarding wizard is the primary activation mechanism. If completion rate is below 60%, it means > 40% of new users never reach a useful product state. This is the single highest-leverage improvement in the funnel.

### Drop-off Interventions
- If Step 1 → Step 2 drop-off > 20%: property address field is too intimidating — split into 2 steps (city first, then full address)
- If Step 3 → 4 drop-off > 15%: tenant invite step is too complex — reduce to email + name only
- Track "time per step" — if any step takes > 2 minutes on average, simplify or add tooltips

---

## SUMMARY TABLE

| # | KPI | Question Answered | Target | Measurement Frequency |
|---|---|---|---|---|
| 1 | Time to First Property | How fast do users start? | < 24h (organic) | Daily |
| 2 | Time to First Tenant | Are users building real rental context? | < 72h after property | Daily |
| 3 | Trial-to-Paid Conversion Rate | Are we turning trials into paying customers? | 15% overall (30-day) | Weekly |
| 4 | Churn Drivers by Feature | Which features lock in users vs. which predict churn? | 35%+ complete 5 activation events | Weekly |
| 5 | Onboarding Wizard Completion | Is the activation flow working? | 60%+ completion | Weekly |

---

## REPORTING CADENCE

Each Monday, pull the following from PostHog / Stripe:

1. KPI 1 & 2: Medians and distributions (p50, p90) segmented by cohort
2. KPI 3: Day-7, Day-14, Day-21, Day-30 conversion rates by cohort
3. KPI 4: Churn rate vs. activation event count table
4. KPI 5: Completion rate + top drop-off step

Post to #product-metrics Slack channel or send via weekly KPI digest.

---

## IMPLEMENTATION CHECKLIST

- [ ] PostHog configured to track all 5 activation events (property created, tenant invited, lease created, payment recorded, onboarding complete)
- [ ] PostHog configured to track onboarding wizard step-by-step drop-off
- [ ] Stripe webhooks configured to update subscriptionStatus transitions in analytics
- [ ] Cohort dashboard built in PostHog (acquisition source + activation events)
- [ ] Churn alert workflow configured (day-7 and day-14 inactivity triggers)
- [ ] First baseline report run after 30 days of live data (target: June 20, 2026)

---

*Document: /home/ubuntu/rent-ready/docs/kpis.md — REN-1124*