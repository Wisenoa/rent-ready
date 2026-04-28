# NPS Survey Setup — REN-564
**Issue:** REN-564 | **Owner:** Product Manager | **Date:** 2026-04-28
**Status:** Complete | **Context:** REN-372 defined the survey design; this doc implements the tooling and workflow

---

## 1. OVERVIEW

This document implements the NPS survey infrastructure:
1. **Survey form** — deployable Typeform/Tally embed
2. **30-day trigger automation** — when/how to send the survey
3. **NPS tracking dashboard** — weekly log + trend monitoring
4. **Response handling protocol** — who does what with each response
5. **Target:** NPS 40+ by end of Q2 (per Q2 OKR KR-P5)

**Constraint:** Survey deploys once users exist. Pre-launch, configure everything and test the trigger flow with a test user.

---

## 2. SURVEY FORM — TALLY EMBED

**Tool choice:** Tally (tally.so) — simpler than Typeform, generous free tier, French-friendly UX.
**Alternative:** Typeform if Tally is unavailable.

### Survey ID: `RentReady NPS — 30-day follow-up`

**Questions (exactly as designed in REN-372):**

**Q1:** `Comment évalueriez-vous votre expérience avec RentReady jusqu'à présent ?`
- Type: Scale 0–10
- Labels: "Pas du tout probable" (left) / "Extrêmement probable" (right)
- Required: yes

**Q2 (conditional):**
- If score ≥ 9: `Qu'est-ce qui vous a le plus impressionné ?` (open text)
- If score 7–8: `Qu'est-ce qui vous empêche de donner un 9 ou 10 ?` (open text)
- If score ≤ 6: `Quel est le principal problème que vous avez rencontré ?` (open text)

**Q3 (always shown):**
`Si vous pouviez améliorer une seule chose, que changeriez-vous en priorité ?`
- Type: open text (short)

### Tally Embed Code (to add to app):

```html
<!-- RentReady NPS Survey Trigger — embed this in post-30-day email or in-app banner -->
<iframe 
  data-tally="https://tally.so/embed/w/xxxxxxxx?alignLeft=1&hideTitle=1&transparentBackground=1"
  loading="lazy" 
  width="100%" 
  height="500" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0"
  title="RentReady NPS Survey">
</iframe>
<script src="//platform.woopra.com/js/woopra-ide.js"></script>
```

**Note:** Replace `w/xxxxxxxx` with actual Tally form ID after form is created. DevOps/Frontend to implement once Tally account is set up.

### Tally Setup Steps (DevOps / PM with Tally access):

1. Create account at tally.so (use company email)
2. Create new form named "RentReady — NPS 30-day"
3. Add the 3 questions per spec above
4. Set up conditional logic for Q2 based on Q1 score
5. In form settings: disable "Show progress bar", enable "Collect email addresses" (optional — useful for follow-up)
6. Go to "Share" → "Embed" → copy the `<iframe>` src
7. Share the embed code with PM + Senior Full-Stack for integration
8. Set up Tally email notifications: alert PM email on each submission

---

## 3. TRIGGER AUTOMATION — 30-DAY SEND

**Trigger logic:** Send NPS survey exactly 30 days after a user creates their first lease (activation milestone, per KR-P3).

### Implementation: PostHog event-based trigger

**Step 1:** Ensure PostHog captures `first_lease_created` event:
```javascript
// In the lease creation flow (frontend):
posthog.capture('first_lease_created', {
  user_id: user.id,
  property_id: property.id,
  lease_id: lease.id,
  timestamp: new Date().toISOString()
})
```

**Step 2:** PostHog defines a cohort "NPS-eligible users":
- Filter: `first_lease_created` exists AND `days_since_signup >= 30`
- This cohort updates daily

**Step 3:** PostHog survey configuration:
- Survey type: intercept (in-app popup) or email
- Target cohort: "NPS-eligible users"
- Frequency: once per user per 90 days (PostHog survey settings: "Once per user")
- Survey show delay: 0 (show immediately when criteria met)
- Incentive configured: "Complétez l'enquête → prolongez votre essai gratuit d'1 mois"

**Step 4:** Fallback email trigger (if in-app not opened):
- If survey not completed 48h after triggering, send email via Brevo/Breach:
  - Subject: `Votre avis nous intéresse — enquête RentReady`
  - Body: short personalization + direct link to Tally form URL
  - From: hello@rentready.fr (or similar)

### Pre-launch Test Trigger:
- Create a test user manually in DB
- Trigger the survey immediately (dev: set first_lease_created to 31 days ago)
- Verify: email arrives, Tally form loads, submission is recorded

---

## 4. NPS TRACKING DASHBOARD

### Tool: Airtable (or Notion — use whichever is already set up per Q2 OKR Section 6)

**Base name:** `RentReady NPS Tracker`

#### Table 1: Weekly NPS Log

| Field | Type | Notes |
|-------|------|-------|
| Week | Date | Monday of the week |
| Respondents | Number | Total NPS responses that week |
| Promoters (9-10) | Number | Count |
| Passives (7-8) | Number | Count |
| Detractors (0-6) | Number | Count |
| NPS Score | Formula | `(Promoters - Detractors) / Respondents × 100` |
| Top Theme | Single select | Most common improvement theme this week |
| Detractor Follow-ups Done | Checkbox | PM completed detractor outreach |
| Notes | Long text | Any qualitative context |

#### Table 2: Individual Responses

| Field | Type | Notes |
|-------|------|-------|
| Date | Date | Submission date |
| User segment | Single select | Landlord / Agency / Portfolio |
| NPS Score | Number | 0–10 |
| Response type | Single select | Promoter / Passive / Detractor |
| Open text Q2 | Long text | verbatim |
| Open text Q3 | Long text | verbatim |
| Follow-up status | Single select | Not needed / Email sent / Call scheduled / Resolved |
| Follow-up date | Date | When PM/CS followed up |
| Resolution notes | Long text | Outcome of follow-up |
| Created from | Single select | In-app / Email / Direct link |

### Dashboard Views:

**View 1: Weekly Trend**
- X-axis: Week
- Y-axis: NPS score (line)
- Shows: rolling 8-week trend

**View 2: Segment Breakdown**
- Group by User segment
- Show: avg NPS score + response count per segment

**View 3: Open Text Themes**
- Tag common themes from Q3 ("onboarding", "missing features", "UX complexity", "price")
- Count per theme per week

---

## 5. RESPONSE HANDLING PROTOCOL

As defined in REN-372 Section 5.3:

| Segment | Score | Timeline | Action | Owner |
|---------|-------|----------|--------|-------|
| Promoter | 9–10 | 48h after submission | Auto-send thank-you email + invite to give a testimonial | PM / Brevo |
| Passive | 7–8 | 48h | Auto-send "we hear you" + link to public roadmap | PM |
| Detractor | 0–6 | 24h | Alert PM via email + schedule 15-min discovery call | PM |
| Any + churn signal | any | Immediate | Alert CS/CEO for retention outreach | CEO |

**Churn signal:** If user submits NPS and has had 0 payments recorded in 30 days AND subscription is trial expiring within 7 days.

### Email Templates:

**Promoter (auto, via Brevo):**
```
Subject: Merci pour votre confiance, {{first_name}} !

Bonjour {{first_name}},

Merci d'avoir pris le temps de répondre à notre enquête. 
Un score de {{score}}/10 nous touche beaucoup.

Votre retour positif est la meilleur énergie pour toute l'équipe.
On continue à travailler pour vous faciliter la vie de propriétaire.

Si vous êtes satisfait, l'avis d'un pair nous aide énormément :
→ [ Laisser un avis sur G2 / Google ]

À très vite,
L'équipe RentReady
```

**Passive (auto, via Brevo):**
```
Subject: Merci pour votre retour, {{first_name}} — voici nos prochaines étapes

Bonjour {{first_name}},

Merci pour votre score de {{score}}/10. On prend chaque réponse au sérieux.

On travaille sur les points que vous avez évoqués :
→ [ lien vers roadmap public ]

Notre objectif : mériter un 9 ou 10. On ne lâche pas.

L'équipe RentReady
```

**Detractor (manual, PM):**
```
Subject: On a vu votre retour, {{first_name}} — peut-on vous appeler ?

Bonjour {{first_name}},

Merci pour votre honnêteté. Un score de {{score}}/10 nous dit que quelque chose 
ne va pas, et on veut comprendre.

Est-ce qu'on pourrait planifier 15 minutes cette semaine pour en parler ?
Ça nous aide à corriger rapidement.

[j'ai dispo cette semaine — proposer 2 créneaux]

L'équipe RentReady
```

---

## 6. INTEGRATION SUMMARY

| Component | Tool | Owner | Status |
|-----------|------|-------|--------|
| Survey form | Tally | PM (+ DevOps for embed) | Action needed |
| Survey embed in app | Next.js component | Senior Full-Stack | Blocked on Tally form ID |
| 30-day trigger logic | PostHog cohort + survey | PM + DevOps | Action needed |
| Fallback email trigger | Brevo/Breach | DevOps | Action needed |
| NPS Tracker base | Airtable | PM | Action needed |
| Weekly log process | Manual | PM | Ready to execute |
| Response handling emails | Brevo templates | PM | Ready to configure |
| Dashboard / trend view | Airtable | PM | Ready to build |

---

## 7. OPEN DEPENDENCIES (BLOCKERS)

1. **Tally account not created** — need access to company email to create tally.so account
2. **PostHog not fully configured** — need `first_lease_created` event instrumented in the app
3. **Brevo not connected** — need Brevo account + API key for transactional email
4. **Airtable base not created** — PM to set up once per-Q2 OKR tooling decision

---

## 8. WEEKLY NPS PROCESS (FOR PM)

Every Monday, PM executes:

1. **Check Airtable** — review previous week's responses
2. **Calculate NPS** — `Score = (Promoters - Detractors) / Respondents × 100`
3. **Flag detractors** — open follow-up emails within 24h
4. **Update NPS Log table** — record this week's numbers
5. **Post to Slack #product** (or weekly KPI digest):
```
NPS Update — [Week of DATE]
Score: [X] (+/- vs last week)
Responses: [N]
Promoters: [X] | Passives: [X] | Detractors: [X]
Top theme: [X]
Detractor outreach: [done/pending]
```
6. **Monthly synthesis** — first Monday of month: full VERBATIM report to CEO

---

## 9. SUCCESS METRICS

| Metric | Baseline | End Q2 Target | End Q3 Target |
|--------|----------|---------------|---------------|
| NPS Score | N/A (pre-launch) | 40+ | 50+ |
| Response rate | N/A | 15% | 20% |
| Detractor resolution rate | N/A | 30% | 50% |
| Weeks with NPS logged | 0 | 12 | 24 |
| Detractor follow-up completed | 0 | 100% | 100% |

---

*Document: REN-564-NPS-setup.md — Product Manager — April 28, 2026*
*Status: Complete — Configuration ready; execution blocked on tooling setup (Tally, PostHog, Brevo, Airtable)*
