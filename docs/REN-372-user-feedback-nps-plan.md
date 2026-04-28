# User Feedback Synthesis & NPS Follow-Up Plan
**Issue:** REN-372  
**Owner:** Product Manager  
**Date:** 2026-04-23  
**Status:** Complete  

---

## 1. Executive Summary

This document establishes the feedback collection infrastructure for RentReady. Since the product is pre-launch or early-stage, there is no collected feedback data yet. This plan defines:

1. The feedback sources to tap and how to instrument them
2. A synthesis framework to identify friction points when data arrives
3. A structured NPS survey to deploy to active users
4. A prioritized list of UX/product improvements based on rental SaaS common friction points
5. An operational NPS follow-up process

---

## 2. Feedback Sources to Instrument

### 2.1 Active Feedback Channels

| Source | Instrument | Frequency | Owner |
|---|---|---|---|
| Demo request form | CRM fields: company size, use case, current tool, pain point open text | Every submission | PM |
| Free trial signups | Onboarding survey (3 questions, post-signup day 1) | Day 1 | PM |
| Trial users who don't convert | Exit survey (triggered on plan downgrade or inactivity day 7+) | On churn signal | PM |
| Active users | In-app feedback button (bottom-right, "Donner votre avis") | Always-on | PM |
| Support tickets | Zendesk/Intercom tag extraction + weekly synthesis | Weekly | PM |
| Feature request votes | Built-in feature request board (Canny or custom) | Always-on | PM |

### 2.2 Feedback Capture Fields

All feedback channels should capture:
- **User segment:** Landlord / Agency / Property Manager / Portfolio Manager
- **Company size:** 1 property / 2-10 / 11-50 / 50+
- **Current solution:** Spreadsheets / Pen and paper / Competitor SaaS / None
- **Primary use case:** Lease tracking / Rent collection / Tenant management / Full management
- **Pain point (open text):** What almost stopped them from signing up
- **Aha moment:** What convinced them to try
- **Blocker (open text):** Why they left or didn't convert

---

## 3. Feedback Synthesis Framework

### 3.1 Monthly Synthesis Process

Every month, the PM produces a **User Feedback Report** covering:

1. **Volume stats** — demo requests, trial starts, churns, support tickets
2. **Verbatim highlights** — top 10 most insightful quotes per channel
3. **Friction point ranking** — scored by frequency × severity × segment
4. **Segment analysis** — are friction points concentrated in one ICP?
5. **Trend vs. prior month** — what's getting better, what's getting worse
6. **Action register** — top 3 prioritized improvements for next sprint

### 3.2 Friction Point Scoring Matrix

| | Low Frequency | Medium Frequency | High Frequency |
|---|---|---|---|
| **Low Severity** | Ignore | Monitor | Quick win |
| **Medium Severity** | Backlog | Backlog | Sprint |
| **High Severity** | Sprint | Sprint | P0 |

Severity = does it block signup, block activation, or cause churn?

---

## 4. Top 3 Likely Friction Points (Rental SaaS Pattern Analysis)

Based on domain knowledge of rental property management SaaS and typical user journeys, the most probable friction points are:

### 4.1 Friction Point 1: Onboarding Complexity (P0)
**Description:** Users with 5+ properties feel the initial property setup is too slow. Import from spreadsheet is missing. Manually entering each property + tenant + lease takes 20+ minutes.

**Evidence pattern:** Common in PropTech Saas (iFunAny, Teem, LandlordVision reviews on G2)

**Impact:** Blocks activation → lowers trial-to-paid conversion

**Fix:**
- CSV bulk import for properties and tenants (P0)
- Pre-filled demo data on signup so users see a populated dashboard immediately
- Progress indicator during onboarding ("3/5 steps complete")

**Priority: P0 — Sprint 1**

### 4.2 Friction Point 2: Lease Document Management (P1)
**Description:** Users can't easily attach or generate lease documents. They expect to be able to upload their existing lease template and populate fields, or generate a standard French lease (bail type). They leave to use Word/PDF tools.

**Evidence pattern:** G2 reviews for property management tools consistently flag "document management" as a top 3 expectation

**Impact:** Core use case gap → users switch back to spreadsheet + external docs

**Fix:**
- Lease document upload with field extraction (AI-assisted) (P1)
- Pre-built French lease templates (bail type: vide, meublé, commercial) (P1)
- eSignature integration placeholder (P2)

**Priority: P1 — Sprint 2**

### 4.3 Friction Point 3: Late Payment / Reminder Workflow (P1)
**Description:** Users want automated reminder sequences for late rent. They expect: Day 1 reminder → Day 3 follow-up → Day 7 warning. They can't set this up or it's not visible in the dashboard.

**Evidence pattern:** Rent collection is the #1 pain point in multi-property landlord communities (forums, Facebook groups)

**Impact:** Forces manual follow-up → users feel the tool doesn't save time → churn

**Fix:**
- Payment status dashboard with overdue highlighting (P1)
- Automated reminder sequence configuration (P1)
- Unpaid rent letter template generator (P2)

**Priority: P1 — Sprint 2**

---

## 5. NPS Follow-Up Survey

### 5.1 Survey Design Principles

- Send to users with 3+ days of activity, once per 90 days
- 3 questions maximum (2 NPS + 1 open text)
- Incentivize with: "Complete the survey → get 1 month free trial extension"
- Deploy via email (primary) + in-app banner (secondary)
- Target NPS response rate: 15%+

### 5.2 Survey Questions

**Question 1 (NPS 0-10):**
```
Comment évalueriez-vous votre expérience avec RentReady jusqu'à présent ?
[0-10 scale]
Pas du tout probable                              Extrêmement probable
0  1  2  3  4  5  6  7  8  9  10
```

**Question 2 (Follow-up based on score):**

If score 9-10 (Promoter):
```
Qu'est-ce qui vous a le plus impressionné ? [open text]
```

If score 7-8 (Passive):
```
Qu'est-ce qui vous empêche de give a 9 or 10 ? [open text]
```

If score 0-6 (Detractor):
```
Quel est le principal problème que vous avez rencontré ? [open text]
```

**Question 3 (Always shown):**
```
Si vous pouviez améliorer une seule chose, que changeriez-vous en priorité ? [open text]
```

### 5.3 NPS Response Handling Protocol

| Segment | Response Timeline | Action |
|---|---|---|
| Promoter (9-10) | 48h after submission | Auto-send thank you + feature request forwarding |
| Passive (7-8) | 48h | Auto-send "we hear you" + share roadmap link |
| Detractor (0-6) | 24h | Alert PM + CS + schedule 15-min discovery call |
| Any score with churn signal | Immediate | Alert CS team for retention outreach |

### 5.4 NPS Target Benchmarks

| Metric | Month 1 Target | Month 3 Target | Month 6 Target |
|---|---|---|---|
| NPS Score | -10 (baseline) | 0 | +20 |
| Response Rate | 10% | 15% | 20% |
| Detractor resolution rate | — | 30% | 50% |

---

## 6. Prioritized UX/Product Improvements

Based on rental SaaS friction point analysis:

| Priority | Improvement | Segment Most Affected | Effort | Impact |
|---|---|---|---|---|
| P0 | Bulk property/tenant CSV import | Agencies, 5+ property landlords | High | Activation |
| P0 | Pre-populated demo data on signup | All | Medium | Activation |
| P0 | Dashboard payment status + overdue highlighting | All | Medium | Retention |
| P1 | Automated late rent reminder sequences | All | High | Retention |
| P1 | Lease document upload + field extraction | All | High | Activation |
| P1 | Pre-built French lease templates (bail) | Landlords, agencies | Medium | Activation |
| P2 | eSignature integration | Agencies | High | Activation |
| P2 | Tenant portal (self-service rent payment) | Tenants | High | Retention |
| P2 | Maintenance request tracking | All | Medium | Retention |
| P3 | AI lease drafting assistant | Agencies, property managers | High | Differentiation |
| P3 | Multi-language support | Multi-property, international | Medium | Expansion |

---

## 7. In-App Feedback Button Specification

### 7.1 Placement & Design
- Bottom-right corner, persistent across all app pages
- Icon: speech bubble with star ⭐
- Color: primary brand color
- Label on hover: "Donner votre avis" (CTA 24 chars max)

### 7.2 Click Flow
1. Modal opens (not a new page)
2. "Quel est votre feedback ?" (textarea, 500 char limit)
3. "De quoi s'agit-il ?" (dropdown: Bug / Amélioration / Question / Autre)
4. Submit button: "Envoyer"
5. Success state: "Merci ! Votre feedback nous aide à nous améliorer."
6. Optional: email field for follow-up ("Laisser votre email pour qu'on puisse vous recontacter" — checkbox)

### 7.3 Data Capture
Each submission includes:
- User ID (authenticated users)
- Current page URL
- Session duration so far
- Segment from user profile
- Timestamp

---

## 8. Support Ticket Synthesis Process

### 8.1 Weekly Tag Extraction

Every Monday, the PM reviews support tickets from the prior week and:

1. Extracts all unique tags/themes
2. Counts frequency per theme
3. Maps to product area (Onboarding / Dashboard / Lease / Payment / etc.)
4. Flags any new theme (not seen in prior 4 weeks)
5. Adds new themes to the friction point register

### 8.2 Support → Product Handoff

Support tickets that reveal a product gap → PM creates an internal issue within 24h. Tag in support system: `product-gap-[area]`.

Quarterly: PM and Support lead review top 10 product-gap tickets and prioritize into backlog.

---

## 9. Competitive Review Feedback Signals

Quarterly, analyze competitor G2/Capterra/Trustpilot reviews (Stessa, LandlordVision, Teem, Qonto, Hélios) for:
- Most praised features → competitive table stakes
- Most complained gaps → opportunity to differentiate
- Specific French market complaints → localize our positioning

---

## 10. Action Register

| # | Action | Owner | Deadline | Status |
|---|---|---|---|---|
| 1 | Instrument in-app feedback button | Engineering | Sprint current | Planned |
| 2 | Build exit survey for trial churn | Engineering + PM | Sprint current | Planned |
| 3 | Deploy NPS survey to active users | PM + Engineering | Next sprint | Planned |
| 4 | Set up monthly feedback synthesis ritual (last Friday of month) | PM | Immediately | Planned |
| 5 | Create support ticket tag framework with CS | PM + CS | Sprint current | Planned |
| 6 | Build bulk CSV import (P0) | Engineering | Sprint 1 | Planned |
| 7 | Dashboard payment status + overdue highlighting (P0) | Engineering | Sprint 1 | Planned |
| 8 | Automated reminder sequence (P1) | Engineering | Sprint 2 | Planned |

---

## 11. Definitions

- **NPS (Net Promoter Score):** % Promoters (9-10) minus % Detractors (0-6). Range: -100 to +100.
- **Promoter:** Score 9-10. Likely to recommend, low churn risk.
- **Passive:** Score 7-8. Satisfied but not enthusiastic, moderate churn risk.
- **Detractor:** Score 0-6. Unhappy, high churn risk, negative word-of-mouth.
- **Activation:** User completes at least 1 core workflow (e.g., adds a property, creates a lease, records a payment).
- **Trial-to-paid conversion:** User subscribes within 14 days of trial start.
