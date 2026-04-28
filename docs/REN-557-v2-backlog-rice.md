# RentReady V2 Feature Backlog — RICE Prioritization
**Issue:** REN-557 | **Owner:** Product Manager | **Date:** 2026-04-28
**Status:** Complete | **Horizon:** V2 (Q3–Q4 2026) | **Context:** V1 MVP complete; Q2 OKRs established; user feedback infrastructure defined

---

## 1. V1 RETROSPECTIVE

### 1.1 What V1 Delivered

V1 shipped the core landlord loop:
- Property management (CRUD, archive)
- Tenant management (linked to properties)
- Lease management (create, renew, PDF generation)
- Rent collection & payment tracking (quittances)
- Owner dashboard (summary view)
- Basic SEO pages (templates, calculators, guides)

### 1.2 What V1 Did NOT Deliver (V2 Opportunities)

| Gap | Evidence | User Impact |
|-----|----------|-------------|
| No accounting / tax export | V1 PRD scope excluded | Cannot use for tax declaration — biggest churn driver |
| No tenant portal | V1 landlord-only | Tenants cannot self-serve; landlords do all admin |
| No inspection reports (état des lieux) | V1 PRD excluded | Legal compliance gap; high SEO value |
| No multi-user / agency mode | V1 solo-landlord only | Cannot serve agencies (Marc ICP) |
| No document vault | V1 PRD excluded | Users fall back to external storage |
| No maintenance tracking | V1 PRD excluded | Log repair requests via email/text |
| No lease renewal automation | Manual reminder only | Risk of lease lapse |
| No charges reconciliation | Flat rent only | Cannot handle provision vs real charges |
| No owner equity dashboard | Basic summary only | Portfolio landlords cannot see ROI per property |

### 1.3 V1 Assessment for RICE Inputs

| V1 Feature | Retention Hook | Activation Rate | Churn Risk |
|------------|---------------|-----------------|------------|
| Property management | Medium | High | Low — table stakes |
| Tenant management | Medium | High | Low |
| Lease management | **Very High** | High | Low — core lock-in |
| Rent collection + quittances | **Very High** | **Very High** | Low — legal proof |
| Owner dashboard | Low | Medium | Medium — not differentiated |

**Conclusion:** V1 creates strong initial value (quittances + lease tracking). Retention risk is in the "what comes next" — users who need accounting or scale will churn without V2 features.

---

## 2. V2 FEATURE CANDIDATES — BRAINSTORM

Based on: Q2 OKRs, REN-299 V2 roadmap, REN-372 friction point analysis, competitive analysis, SEO opportunity mapping.

### 20 Feature Candidates Identified:

| # | Feature | Category | Q2 OKR Link | SEO Hook |
|---|---------|----------|-------------|----------|
| F1 | Accounting CSV/PDF export | Accounting | KR-B3, KR-E2 | comptabilité locative, déclaration revenus fonciers |
| F2 | Tenant portal (self-service) | Engagement | KR-P1, KR-P3 | portail locataire |
| F3 | Inspection reports PDF (état des lieux) | Legal/Compliance | KR-E2 | modèle état des lieux |
| F4 | Lease renewal workflow + auto-reminder | Retention | KR-P3 | renouvellement bail |
| F5 | Document vault (upload/store) | Storage | KR-E2 | gestion documents location |
| F6 | Charges reconciliation (provision vs real) | Accounting | KR-B3 | régularisation charges |
| F7 | Multi-user / agency mode | ICP Expansion | KR-B1, KR-B2 | gestion locative agence |
| F8 | Portfolio dashboard (multi-property analytics) | Analytics | KR-P3 | tableau de bord gestion locative |
| F9 | Email/notification center | Retention | KR-P5 | — |
| F10 | Maintenance ticket tracking | Operations | KR-E2 | gestion travaux locatif |
| F11 | Owner statement PDF (per-owner) | Reporting | KR-B3 | déclaration revenus fonciers |
| F12 | Rent revision workflow (IRL auto-apply) | Compliance | KR-E2 | revision loyer IRL |
| F13 | AI lease drafting assistant | AI | KR-B1 | assistant bail location |
| F14 | Multi-language (EN) | Expansion | KR-B1 | — |
| F15 | Third-party API integrations | Integrations | KR-B1 | — |
| F16 | Maintenance marketplace | Marketplace | KR-B1 | — |
| F17 | Stripe tenant payment portal | Payments | KR-B3, KR-B1 | paiement loyer en ligne |
| F18 | Smart rent reminders (SMS + email) | Engagement | KR-P3 | relance loyer |
| F19 | Advanced reporting (custom date ranges, per-tenant) | Analytics | KR-B3 | reporting gestion locative |
| F20 | GRL (Garantie des Loyers Risques) integration | Insurance | KR-B1 | garantie loyer |

---

## 3. RICE SCORING

### Methodology:

- **Reach:** Estimated users impacted per quarter (1–10 scale; 10 = hundreds/thousands)
- **Impact:** Business impact on conversion/retention/revenue (0.25/0.5/1/2/3)
- **Confidence:** How confident in the estimates (50%/80%/100%)
- **Effort:** Engineering weeks (1=1wk, 2=2wk, 3=3wk, 5=5wk, 8=8wk, 13=quarter+)

**RICE = (Reach × Impact × Confidence) / Effort**

### Full RICE Table:

| # | Feature | Reach | Impact | Confidence | Effort (wks) | RICE Score | Rank |
|---|---------|-------|--------|------------|-------------|------------|------|
| F1 | Accounting CSV/PDF export | 9 | 3 | 100% | 3 | **9.00** | 1 |
| F3 | Inspection reports PDF | 8 | 3 | 100% | 2 | **12.00** | 2 |
| F2 | Tenant portal | 9 | 2 | 100% | 2 | **9.00** | 3 |
| F4 | Lease renewal workflow | 7 | 2 | 100% | 2 | **7.00** | 4 |
| F7 | Multi-user / agency mode | 6 | 3 | 80% | 8 | **1.80** | 5 |
| F8 | Portfolio dashboard | 7 | 2 | 80% | 5 | **2.24** | 6 |
| F6 | Charges reconciliation | 6 | 2 | 80% | 5 | **1.92** | 7 |
| F10 | Maintenance ticket tracking | 6 | 2 | 80% | 5 | **1.92** | 8 |
| F18 | Smart rent reminders | 8 | 1 | 80% | 2 | **3.20** | 9 |
| F5 | Document vault | 5 | 2 | 80% | 3 | **2.67** | 10 |
| F11 | Owner statement PDF | 4 | 2 | 80% | 2 | **3.20** | 11 |
| F9 | Notification center | 6 | 1 | 80% | 3 | **1.60** | 12 |
| F12 | Rent revision (IRL) | 5 | 1.5 | 80% | 3 | **2.00** | 13 |
| F17 | Stripe tenant payment portal | 4 | 3 | 50% | 8 | **0.75** | 14 |
| F19 | Advanced reporting | 4 | 1.5 | 80% | 5 | **0.96** | 15 |
| F13 | AI lease drafting | 3 | 3 | 50% | 8 | **0.56** | 16 |
| F14 | Multi-language (EN) | 3 | 1 | 50% | 13 | **0.12** | 17 |
| F15 | Third-party API | 2 | 2 | 50% | 13 | **0.08** | 18 |
| F16 | Maintenance marketplace | 2 | 2 | 30% | 13 | **0.05** | 19 |
| F20 | GRL insurance integration | 1 | 2 | 30% | 13 | **0.02** | 20 |

**Note:** RICE is a starting framework, not the final word. Business urgency, dependencies, and SEO value are factored into the final phase assignments below.

---

## 4. 3-PHASE V2 ROADMAP

### Phase 1: V2 Core — "The Sticky Stack" (Q3 2026, Jul–Sep)
**Goal:** Deepen activation, retention, and tax-season conversion before Q4.

| Rank | Feature | RICE | Sprint | Why Now |
|------|---------|------|--------|--------|
| 1 | **F3: Inspection reports PDF** | 12.00 | Sprint A | Highest RICE; legal compliance; massive SEO; quick win |
| 2 | **F1: Accounting CSV/PDF export** | 9.00 | Sprint A-B | Tax season urgency (France: declaration Dec–Jan); highest activation trigger |
| 3 | **F2: Tenant portal** | 9.00 | Sprint B-C | Virality: tenant refers landlord; activation improvement; retention |
| 4 | **F4: Lease renewal workflow** | 7.00 | Sprint C | Prevents lease lapse; key retention risk |
| 5 | **F18: Smart rent reminders** | 3.20 | Sprint C | Quick win; reduces churn; improves activation |

**Milestone:** End of Phase 1: users can manage full lease lifecycle + tax export + tenant self-service.

---

### Phase 2: V2 Expansion — "The Agency Wedge" (Q4 2026, Oct–Dec)
**Goal:** Unlock agency/portfolio ICP and build reporting moat before year-end.

| Rank | Feature | RICE | Sprint | Why Now |
|------|---------|------|--------|--------|
| 6 | **F8: Portfolio dashboard** | 2.24 | Sprint D | Marc ICP (portfolio landlord) priority; differentiation from legacy tools |
| 7 | **F7: Multi-user / agency mode** | 1.80 | Sprint D-E | Unlock agency ICP (Marc/Agence Madeleine); biggest MRR unlock |
| 8 | **F6: Charges reconciliation** | 1.92 | Sprint E | Legal obligation (Loi ALUR); differentiates from spreadsheets |
| 9 | **F11: Owner statement PDF** | 3.20 | Sprint E | Key for agencies managing third-party properties; billing justification |
| 10 | **F5: Document vault** | 2.67 | Sprint F | Stickiness; power-user retention; reduces churn |

**Milestone:** End of Phase 2: RentReady is no longer a solo-landlord tool — agencies and portfolio landlords can use it operationally.

---

### Phase 3: V2 Advanced — "The Moat" (Q1 2027, Jan–Mar)
**Goal:** Build AI differentiation, integrations, and long-term platform lock-in.

| Rank | Feature | RICE | Sprint | Why Now |
|------|---------|------|--------|--------|
| 12 | **F12: Rent revision (IRL auto-apply)** | 2.00 | Sprint G | Legal compliance; Q1 IRL review season |
| 10 | **F10: Maintenance ticket tracking** | 1.92 | Sprint G | Completes the operations stack; natural follow-on to inspection reports |
| 15 | **F19: Advanced reporting** | 0.96 | Sprint H | End-of-year financial review use case; upsell to premium tier |
| 13 | **F17: Stripe tenant payment portal** | 0.75 | Sprint H | High complexity; validate demand via Phase 1-2 user signals first |
| 16 | **F13: AI lease drafting** | 0.56 | Sprint I | AI differentiation; validate with small test before committing full eng |

**Low Priority / Deprioritize until 2027+:**
- F14 Multi-language (EN): Only after FR PMF confirmed
- F15 Third-party API: Depends on external partner interest
- F16 Maintenance marketplace: Speculative; no validated demand
- F20 GRL integration: Regulatory; low reach; do when/if regulatory landscape clarifies

---

## 5. FEATURE DETAIL — TOP 5 (Phase 1)

### F3: Inspection Reports PDF (état des lieux)

**User Story:**
> As a landlord, I want to generate a legally-structured état des lieux (entry/exit inspection report) as a PDF, so that I have legal proof of the property condition and can justify deposit deductions if needed.

**Acceptance Criteria:**
- [ ] Form captures: property, tenant, date, room-by-room condition (cuisine, salle de bain, chambres, salon, entrées, sanitaires)
- [ ] Condition rating per room: conforme / à rafraîchir / dégradé (with optional photo upload placeholder)
- [ ] Entry inspection (état des lieux d'entrée) linked to active lease
- [ ] Exit inspection (état des lieux de sortie) compared to entry; computes deposit deduction summary
- [ ] PDF output: formatted, landlord + tenant signature lines, dated, property address header
- [ ] Inspection history visible on lease detail page

**SEO Target Pages:**
- `/outils/etat-des-lieux-entree` (checklist + PDF generator)
- `/guides/etat-des-lieux` (guide with template)

**Success Metrics:**
- Inspections created per month (target: 50 in Q3)
- Time to complete inspection (target: <10 min)
- Exit-to-entry comparison completion rate

---

### F1: Accounting CSV/PDF Export

**User Story:**
> As a landlord, I want to export my annual rental income as a CSV and PDF, so that I can complete my déclaration 2042 / 2072 without re-entering data from bank statements.

**Acceptance Criteria:**
- [ ] Annual summary per property: total rent received, charges, net income
- [ ] Export format: CSV (France Taxes-compatible column layout) + PDF summary
- [ ] Filter by date range (calendar year Jan–Dec or custom)
- [ ] Includes: tenant name, property address, lease dates, amounts
- [ ] Charges breakdown: provision vs actual (regularization)
- [ ] Download from dashboard in ≤3 clicks
- [ ] Multi-property aggregation for portfolio landlords

**SEO Target Pages:**
- `/guides/compabilite-locative`
- `/outils/generateur-ecritures-comptables`

**Success Metrics:**
- Export downloads per month (target: 30+ in Q4)
- Tax season (Nov–Jan) downloads as % of active users

---

### F2: Tenant Portal

**User Story:**
> As a tenant, I want to view my payment history and download my receipts, so that I don't have to ask my landlord for documents every time I need proof of payment.

**Acceptance Criteria:**
- [ ] Tenant receives email invite to portal on lease activation
- [ ] Tenant can view: lease details, payment history, outstanding balance
- [ ] Tenant can download PDF quittances for any paid month
- [ ] Tenant receives automated email confirmation after each payment recorded
- [ ] Tenant can submit maintenance requests (links to F10 in Phase 3)
- [ ] Landlord controls tenant portal access (revoke anytime)
- [ ] No payment processing in Phase 2 (F17 future)

**SEO Target Pages:**
- `/guides/portail-locataire`
- `/fonctionnalites/portail-locataire`

**Success Metrics:**
- Tenant portal activation rate (tenant clicks invite link) — target: 60%+
- Monthly active tenants — target: 100+ by end of Q3
- Tenant-to-landlord referrals (tenant shares link with co-owner/spouse)

---

### F4: Lease Renewal Workflow

**User Story:**
> As a landlord, I want automated reminders 90/60/30 days before my lease expires, so that I never miss a lease renewal and don't lose a good tenant.

**Acceptance Criteria:**
- [ ] System flags leases expiring within 90 days
- [ ] Automated email reminders at 90d, 60d, 30d before expiry
- [ ] Landlord can initiate renewal from lease detail page with one click
- [ ] Renewal form: new end date, new rent amount (with IRL index suggestion), new conditions
- [ ] New lease PDF generated; old lease archived
- [ ] Optional: tenant can sign renewal digitally (e-signature integration — Phase 3)

**SEO Target Pages:**
- `/guides/renouvellement-bail`
- `/outils/modele-bail`

**Success Metrics:**
- Lease lapse rate (leases expiring without renewal) — target: <5%
- Renewal reminders opened — target: 70%+

---

### F18: Smart Rent Reminders

**User Story:**
> As a landlord, I want automated payment reminders sent to tenants before rent is due, so that I spend less time chasing payments and maintain better tenant relationships.

**Acceptance Criteria:**
- [ ] Landlord configures reminder schedule: 5 days before, due date, 3 days after (unpaid), 7 days after (overdue)
- [ ] Reminders sent via email (SMS optional upgrade — F17)
- [ ] Reminder email is editable by landlord
- [ ] Landlord can snooze or disable reminders per tenant
- [ ] Payment recorded by landlord marks reminder as fulfilled
- [ ] Overdue reminder includes escalation language (respectful but clear)

**SEO Target Pages:**
- `/guides/relance-loyer`
- `/outils/modele-relance`

**Success Metrics:**
- Unpaid rate at due date (target: <10% with reminders vs baseline)
- Time spent on rent collection per month (target: -50%)

---

## 6. DEPENDENCY MAP

```
F3 (Inspection Reports)
  └─> F10 (Maintenance Tracking) — links inspection findings to tickets

F2 (Tenant Portal)
  └─> F17 (Stripe Payment Portal) — portal extends to payments later

F7 (Multi-user Agency)
  └─> F8 (Portfolio Dashboard) — agencies need both
  └─> F11 (Owner Statement PDF) — agencies generate per-owner statements

F1 (Accounting Export)
  └─> F6 (Charges Reconciliation) — reconciled data in export

F4 (Lease Renewal)
  └─> F12 (Rent Revision IRL) — renewal should suggest new rent based on IRL
```

---

## 7. SUCCESS METRICS PER PHASE

### Phase 1 (Q3 2026) KPIs:

| Metric | Baseline (Q2 end) | Q3 Target | Owner |
|--------|-------------------|-----------|-------|
| Monthly active users (MAU) | ~10 (est.) | 40+ | PM |
| Rent reminder adoption | 0 | 60% of active leases | PM |
| Inspections created | 0 | 50+ | PM |
| Accounting exports | 0 | 20+ | PM |
| Tenant portal activations | 0 | 60% invite rate | PM |
| Lease lapse rate | N/A | <5% | PM |
| Trial-to-paid (Phase 1 features) | 15% | 20%+ | PM |

### Phase 2 (Q4 2026) KPIs:

| Metric | Baseline | Q4 Target | Owner |
|--------|----------|-----------|-------|
| Agency customers | 0 | 2+ | CEO |
| Portfolio landlord customers | 0 | 3+ | PM |
| Multi-property users (3+) | 0 | 10+ | PM |
| Charge reconciliation adoption | 0 | 50% of applicable leases | PM |
| Document vault upload rate | 0 | 2 docs/property avg | PM |

### Phase 3 (Q1 2027) KPIs:

| Metric | Baseline | Q1 Target | Owner |
|--------|----------|-----------|-------|
| NPS score | 40 (Q2 target) | 50+ | PM |
| MAU | 40 | 100+ | PM |
| MRR | €2,500 | €10,000+ | CEO |
| Maintenance tickets created | 0 | 30+ | PM |
| AI lease drafts created (test) | 0 | 20 (validation batch) | PM |

---

## 8. ALIGNMENT WITH Q2 OKRs

| Q2 OKR | V2 Backlog Linkage |
|---------|-------------------|
| KR-B1: 5 paid customers | F3, F1, F4 address activation; F7/F8 unlock agency ICP |
| KR-B3: 15%+ trial-to-paid | F1 (tax export) is the strongest seasonal conversion trigger; F2 (tenant portal) increases perceived value |
| KR-P3: 40%+ create first lease <48h | F4 (renewal reminders) keeps leases active; F18 reduces unpaid |
| KR-P5: NPS 40+ | F3 (inspection reports) addresses legal anxiety; F5 (vault) adds security |
| KR-S5: 15+ tool pages | F3, F1, F4, F18, F5 all generate tool pages with SEO value |
| KR-E2: 100% MVP features | V2 extends V1 MVP features to complete the stack |

---

## 9. PRESENTATION TO CTO + CEO — AGENDA

**Meeting:** V2 Backlog Alignment | **Date:** Week of May 4, 2026 | **Attendees:** CTO, CEO, PM

### Agenda (30 min):

1. **V1 Retrospective** (5 min) — What's shipped, what's working, what's at churn risk
2. **Top 5 V2 Priorities** (10 min) — Phase 1 deep dive: F3 (inspection), F1 (accounting), F2 (tenant portal), F4 (renewal), F18 (reminders)
3. **Agency Wedge** (5 min) — F7 + F8 unlock new ICP; this is the MRR expansion story
4. **Phase 3 Optionality** (5 min) — AI lease drafting; Stripe portal; what to validate before committing
5. **Engineering Capacity Ask** (3 min) — Q3: ~25 story points/sprint for V2 features (vs current MVP polish)
6. **Decisions Needed** (2 min) — Confirm Phase 1 sequencing; agree on inspection report scope

### 3 Decisions to Get:

1. **Approve Phase 1 scope** — inspection reports + accounting export + tenant portal + renewal workflow + smart reminders
2. **Confirm Q3 sprint capacity allocation** — What % of engineering goes to V2 vs SEO tools vs bug fixes?
3. **Validate agency ICP priority** — Should F7 (multi-user) start in Q3 or Q4? CEO/CTO alignment on Marc ICP.

---

## 10. FINAL RECOMMENDATIONS — TOP 10 STRATEGIC PRIORITIES

1. **Ship accounting export before Q4 tax season** — single highest conversion trigger; delays cost MRR
2. **Build inspection reports as the flagship SEO tool** — highest RICE + highest SEO value; sets topical authority
3. **Launch tenant portal to drive virality** — tenants bring landlords; organic growth lever
4. **Automate lease renewal reminders before summer** — peak lease expiry season; prevents churn
5. **Invest in agency mode in Q4** — MRR expansion; agencies = higher ACV than solo landlords
6. **Build portfolio dashboard for Q4** — differentiates from all legacy tools; closes portfolio ICP
7. **Add charges reconciliation in Q4** — legal obligation (Loi ALUR); perceived as "professional" tool
8. **Validate AI lease drafting with a test batch in Q1 2027** — don't commit full eng before validating demand
9. **Defer Stripe portal until 2027** — high complexity; requires trust built via Phase 1-2 first
10. **Establish NPS baseline now (REN-564)** — without measurement, V2 priorities are guesswork; course-correct early

---

*Document: REN-557-v2-backlog-rice.md — Product Manager — April 28, 2026*
*Status: Complete — Ready for CTO + CEO review*
