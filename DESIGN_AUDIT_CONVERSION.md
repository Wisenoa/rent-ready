# Conversion Rate Optimization Report — REN-552
**Date:** 2026-04-28
**Author:** Product Designer Agent
**Status:** In Progress

---

## 1. Funnel Audit Summary

### Current Signup → Onboarding Flow

```
Landing Page Hero
    ↓
[Register] or [Demo Request]
    ↓
Register Form (5 fields + Stripe customer creation)
    ↓
Immediate redirect to /dashboard
    ↓
Onboarding Wizard v2 (3-step: Property → Tenant → Lease)
    ↓
Dashboard (empty state or sample data prompt)
```

### Drop-off Points Identified

| Step | Issue | Severity |
|------|-------|----------|
| Hero → Register | 5-field form is friction-heavy; no social proof on page | HIGH |
| Register → Dashboard | No first-value moment; blank dashboard is disorienting | HIGH |
| Onboarding Step 1 | "3 minutes" warning may scare users; tooltip overload | MEDIUM |
| Onboarding Skip | Skipping all steps leaves user with zero guidance | HIGH |
| Demo Form | Not linked prominently from hero (only secondary CTA) | MEDIUM |

---

## 2. A/B Test Recommendations

### Test 1: Register Form Fields
- **Control:** 5 fields (firstName, lastName, email, password, confirmPassword)
- **Variant A (Simplified):** 3 fields (name, email, password) — collect lastName post-signup
- **Variant B (Stepped):** Step 1: email + password only. Step 2: name collection

### Test 2: Social Proof on Register Page
- **Control:** Clean form with logo only
- **Variant:** Add testimonial card + trust badges below form

### Test 3: CTA Headline Copy
- **Control:** "Créer mon compte gratuitement"
- **Variant A:** "Essayez gratuitement — 14 jours"
- **Variant B:** "Commencez en 2 minutes"

---

## 3. High-Impact Improvements Implemented

### IMPROVEMENT 1: Simplified Register Form (Variant A — 3-field)
**File:** `src/app/register/register-form.tsx`
**Change:** Reduced from 5 fields to 3 (name + email + password). LastName collected in onboarding.
**Expected lift:** +10-20% form completion rate

### IMPROVEMENT 2: Social Proof on Register Page
**File:** `src/app/register/page.tsx`
**Change:** Added trust badges and testimonials to the register page below the form.
**Expected lift:** +5-10% trust-to-convert

### IMPROVEMENT 3: Add "Continue with Google" Button
**File:** `src/app/register/register-form.tsx`
**Change:** Added Google OAuth button above the form divider.
**Expected lift:** +8-15% for users who abandon due to password friction

### IMPROVEMENT 4: First-Value Moment on Dashboard
**Files:** `src/components/dashboard-onboarding-wrapper.tsx`, dashboard empty states
**Change:** When user lands on empty dashboard, show a clear "first value" prompt with sample data option + quick-add property.
**Expected lift:** +15-25% activation (users who add first property within 24h)

### IMPROVEMENT 5: Onboarding Wizard — Streamlined Step 1
**File:** `src/components/onboarding-wizard-v2.tsx`
**Change:** Changed "3 minutes remaining" messaging to benefit-led framing. Made sample data option more prominent for users who want to explore before adding real data.

---

## 4. Implementation Plan

| Priority | Change | File | Status |
|----------|--------|------|--------|
| P0 | Simplified 3-field register form | register-form.tsx | DONE |
| P0 | Social proof on register page | register/page.tsx | DONE |
| P0 | Google OAuth button | register-form.tsx | DONE |
| P1 | First-value dashboard prompt | dashboard empty state | IN PROGRESS |
| P2 | Onboarding wizard framing improvement | onboarding-wizard-v2.tsx | IN PROGRESS |
| P3 | A/B test tracking setup | /api/onboarding/track | IN REVIEW |

---

## 5. Key Metrics to Track

- Form field completion rate (5-field vs 3-field)
- Time-to-first-property (activation metric)
- Onboarding completion rate per step
- Trial-to-paid conversion by signup source
- Demo request rate (funnel alternative)

---

## 6. Coordination with Senior Full-Stack

The following require Senior Full-Stack implementation:
- Google OAuth provider setup (env vars + NextAuth config)
- A/B test infrastructure (feature flags)
- Analytics event enrichment for funnel tracking
- Post-signup email sequence setup
