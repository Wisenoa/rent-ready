# Rent-Ready V2 Feature Roadmap — Post-MVP Launch
**Issue:** REN-299 | **Owner:** Product Manager | **Date:** 2026-04-20
**Status:** Active | **Horizon:** V2 (Q3–Q4 2026) | **Context:** SEO sprint done; V1 MVP complete

---

## 1. V2 STRATEGIC CONTEXT

V1 launched with the core loop: property → tenant → lease → payment → receipt. V2's mandate is to deepen the product moat, unlock the agency/portfolio ICP, and build the accounting/compliance layer that converts seasonal trial users into year-round subscribers.

**V2 Objectives (H2 2026):**
1. **Unlock agency ICP** — multi-user, portfolio view, owner reporting
2. **Deepen landlord stickiness** — tenant portal, document vault, inspection reports
3. **Tax-season conversion** — accounting export is the single biggest seasonal activation trigger
4. **AI differentiation seed** — AI lease drafting assistant as the first AI feature; tests product-market fit for AI before committing to full roadmap
5. **Compliance as a moat** — IRL tracking, lease expiry alerts, charges reconciliation

---

## 2. V2 FEATURE PRIORITY MATRIX

Priority scored using ICE: Impact × Confidence × Ease / Effort

### 2.1 MUST HAVE — V2 Core (Ship Q3 2026)

| # | Feature | ICE Score | SEO Hook | Effort | Rationale |
|---|---------|-----------|----------|--------|-----------|
| 1 | Accounting export (CSV + PDF) | 28 | comptabilité locative, déclaration revenus fonciers | Medium | Tax season is Q1; must ship before Oct 2026 |
| 2 | Tenant portal (view receipts, payment history) | 26 | portail locataire | High | Retention + virality; tenant sends landlord to sign up |
| 3 | Inspection reports (état des lieux entrée/sortie) PDF | 24 | modèle état des lieux, état des lieux sortie | High | Legal compliance; high SEO + conversion |
| 4 | Lease renewal workflow + auto-reminder | 22 | renouvellement bail | Medium | Retention; prevents lapse in coverage |
| 5 | Document vault (upload/store lease, diagnostics, IDs) | 21 | gestion documents location | Medium | Stickiness; key ask from power users |
| 6 | Charges reconciliation (utilities + building fees) | 20 | régularisation charges locatives | High | Legal obligation; differentiates from spreadsheets |

**Rationale for ordering:** Accounting export ships first because it is the most time-sensitive — landlords think about it in Q4. Tenant portal ships second because it drives organic growth (tenants recommend landlords). Inspection reports ship third because they are the highest SEO value page not yet built. Lease renewal ships fourth for retention. Document vault ships fifth for stickiness. Charges reconciliation ships last in Q3 because of its high effort.

---

### 2.2 SHOULD HAVE — V2 Expansion (Ship Q4 2026)

| # | Feature | ICE Score | SEO Hook | Effort | Rationale |
|---|---------|-----------|----------|--------|-----------|
| 7 | Multi-user / team access (agency mode) | 25 | gestion locative agence | High | Unlocks Agence ICP (Marc/Agence Madeleine); biggest MRR unlock |
| 8 | Portfolio dashboard (multi-property view + analytics) | 22 | tableau de bord gestion locative | Medium | Key ask from portfolio landlords (Marc ICP) |
| 9 | Email notifications (rent due, late, lease expiry) | 18 | — | Medium | Retention; reduces support burden |
| 10 | Maintenance ticket tracking (landlord + tenant) | 16 | gestion travaux locatif | Medium | Stickiness; natural complement to inspection reports |
| 11 | Owner statement PDF (per-owner revenue summary) | 15 | déclaration revenus fonciers | Medium | Key for agencies managing third-party properties |
| 12 | Rent revision workflow (IRL index auto-apply) | 14 | revision loyer IRL | Medium | Legal compliance; high value for landlords |

---

### 2.3 COULD HAVE — V2 Experiments (Ship if capacity allows)

| # | Feature | ICE Score | SEO Hook | Effort | Rationale |
|---|---------|-----------|----------|--------|-----------|
| 13 | AI lease drafting assistant | 20 | assistant bail location | High | AI differentiation; validate demand before full investment |
| 14 | Multi-language support (EN/ES) | 10 | — | Very High | Only after FR product-market fit confirmed |
| 15 | API for third-party integrations | 12 | — | High | Depends on external partner interest |
| 16 | Maintenance marketplace | 8 | — | Very High | Speculative; defer unless partner pipeline emerges |

---

## 3. V2 EPICS AND USER STORIES

### Epic V2-1: Accounting & Tax Export

**Goal:** Landlord exports rental income data for their tax declaration in < 5 minutes.

**User Story:**
> As a landlord, I want to export my annual rental income as a CSV and PDF, so I can file my taxes (déclaration 2042 / 2072) without re-entering data from my bank statements.

**Acceptance Criteria:**
- [ ] Annual summary per property: total rent received, charges, net income
- [ ] Export format: CSV (France Taxes compatible) + PDF summary
- [ ] Filter by date range (calendar year or custom)
- [ ] Includes: tenant name, property address, lease dates, amounts
- [ ] Charges breakdown: provision vs real (for regularisation)
- [ ] Landlord can download from dashboard in < 3 clicks

**SEO Target Pages:**
- `/guides/declaration-revenus-fonciers` (informational — drives awareness)
- `/templates/releve-loyer-annuel` (tool — drives conversion)

---

### Epic V2-2: Tenant Portal

**Goal:** Tenant self-service for payment history and receipts, creating a viral loop where tenants invite landlords to the platform.

**User Story:**
> As a tenant, I want to view my payment history and download any rent receipt, so I can prove my income for APL, a loan application, or my taxes — without asking my landlord.

**Acceptance Criteria:**
- [ ] Tenant receives magic link email when lease is created
- [ ] Portal: view lease details, payment history, upcoming payments
- [ ] Download individual quittances as PDF
- [ ] Download annual rent summary (for tax)
- [ ] Submit maintenance request (links to landlord dashboard)
- [ ] Landlord controls what tenant can see (toggle per item)

**SEO Target Pages:**
- `/guides/portail-locataire` (informational)
- `/outils/generateur-attestation-loyer` (tool — new)

**Viral Loop:** Tenant → "Get your receipts at rentready.fr" → Landlord sees platform → Converts to paid.

---

### Epic V2-3: Inspection Reports (État des Lieux)

**Goal:** Create legally compliant check-in/check-out inspection reports with photo evidence, PDF export.

**User Story:**
> As a landlord, I want to create a digital état des lieux with photos and signatures, so I can document the property condition legally and avoid deposit disputes at move-out.

**Acceptance Criteria:**
- [ ] Create report: property + lease + date + type (entrée/sortie)
- [ ] Room-by-room checklist: walls, floor, windows, fixtures, appliances
- [ ] Photo upload per item (max 3 per room)
- [ ] Condition rating per item: good / acceptable / degraded
- [ ] Tenant + landlord signature (digital or download-and-sign)
- [ ] PDF export matches état des lieux legal requirements
- [ ] Compare entry vs exit report at move-out to calculate deposit deductions

**SEO Target Pages:**
- `/outils/modele-etat-des-lieux` (tool — P0 keyword)
- `/guides/etat-des-lieux-sortie-modele` (informational — P1 keyword)
- `/guides/etat-des-lieux-entree-checklist` (informational)

**Legal Compliance Note:** French law (Loi Alur) requires a detailed état des lieux; a compliant digital version is a genuine moat vs spreadsheets.

---

### Epic V2-4: Multi-User / Agency Mode

**Goal:** Enable agencies and portfolio landlords to collaborate with team members and manage multiple properties under different owners.

**User Story:**
> As an agency property manager, I want to invite team members with different access levels, so we can collectively manage 20–100 properties without stepping on each other's work.

**Acceptance Criteria:**
- [ ] Invite by email; assign role: Admin / Manager / Read-only
- [ ] Roles: Admin can do everything; Manager can edit properties/tenants/leases; Read-only can view
- [ ] Activity log: who did what and when
- [ ] Portfolio dashboard: all properties across all owners
- [ ] Filter by owner, status, payment state
- [ ] Bulk actions: send rent reminders for all properties, export all data
- [ ] Owner portal: owner sees only their properties + aggregated statements

**Pricing Implication:** Agency plan (TBD) — minimum 3 seats; per-seat or flat fee. Engineering must gate this behind a plan upgrade.

**SEO Target Pages:**
- `/pour-les-agences` (already exists — may need refresh)
- `/guides/gestion-locative-agence` (new informational)

---

### Epic V2-5: Document Vault

**Goal:** Centralised, structured storage for all rental documents per property.

**User Story:**
> As a landlord, I want to upload and organize all my property documents (leases, diagnostics, insurance, IDs), so I can find any document in 10 seconds instead of searching email attachments.

**Acceptance Criteria:**
- [ ] Upload files per property or per lease (lease, IDs, diagnostics, insurance)
- [ ] Document categories: Lease, Identity, Diagnostics (DPE, gas, electricity), Insurance, Correspondence, Other
- [ ] File viewer for PDFs and images (no download required)
- [ ] Expiry tracking: DPE valid 10 years, gas certificate 7 years
- [ ] Alert at 30 days before expiry
- [ ] Search across all documents by property, tenant, or date

**Retention Driver:** Documents are sticky — once uploaded, landlords are unlikely to leave.

---

### Epic V2-6: Charges Reconciliation

**Goal:** Automate the annual charges (charges locatives) regularisation process.

**User Story:**
> As a landlord, I want to compare actual charges vs provisions paid, calculate the balance due, and generate the regularisation letter, so I comply with French law and avoid disputes with tenants.

**Acceptance Criteria:**
- [ ] Set provisions (monthly charge estimate) per lease
- [ ] Log actual charges: utilities, building fees, common services
- [ ] Annual regularisation calculation: who owes what
- [ ] Pre-filled régularisation letter (PDF + email to tenant)
- [ ] Accounting export reflects regularisation

**SEO Target Pages:**
- `/guides/regularisation-charges-locatives` (informational)
- `/outils/calculateur-regularisation-charges` (tool — new)

---

### Epic V2-7: AI Lease Drafting Assistant (Experiment)

**Goal:** Validate AI product-market fit before committing to a full AI roadmap.

**User Story:**
> As a landlord, I want the system to pre-fill a lease with AI-generated content based on my property details, so I spend less time on paperwork and avoid missing required clauses.

**Scope (V2 experiment — limited release):**
- [ ] On lease creation: AI pre-fills clause suggestions (e.g., "You may add a clause for...")
- [ ] AI flags missing required clauses per lease type (Loi Alur)
- [ ] AI suggests additional clauses (pets, parking, furnished specifics)
- [ ] Landlord reviews and approves each AI suggestion before it's added
- [ ] No AI-generated content is ever auto-applied without review

**Go/No-Go Criteria:**
- If < 20% of landlords use at least one AI suggestion → deprioritise AI in V3
- If > 40% use AI suggestions → invest in AI V3 features (letter drafting, tenant communication)

**Why first:** Low implementation risk vs full AI assistant; builds data on AI utility without over-investing.

---

## 4. V2 USER JOURNEY MAPS

### Journey V2-A: Portfolio Landlord (Marc) — Monthly Management

```
[Monthly: Email notification — "Rent due for June"]
    ↓
[Opens app → Portfolio Dashboard]
    → All 8 properties: status chips (paid / pending / late)
    ↓
[Property 3: Late payment — clicks "Send reminder"]
    → Pre-filled letter → sent via email
    ↓
[Downloads June owner statement PDF]
    → Sends to accountant
    ↓
[Annual: Accounting export → CSV for tax declaration]
```

### Journey V2-B: Agency Manager — Onboarding New Owner

```
[Agency: New owner signs mandate agreement outside platform]
    ↓
[Agency manager adds owner profile: name, properties, fee structure]
    ↓
[Uploads owner's existing leases and tenant documents to Document Vault]
    ↓
[Invites property manager (team member) with Manager role]
    ↓
[Property manager processes rent collection across 15 properties]
    ↓
[Owner logs in to Owner Portal: sees aggregated revenue, no individual data]
```

### Journey V2-C: Tenant — Move-In Self-Service

```
[Receives email from landlord's Rent-Ready: "Your tenancy is set up"]
    ↓
[Clicks magic link → Tenant Portal]
    → Verifies lease details (dates, rent, deposit)
    ↓
[Move-in day: Landlord creates État des Lieux Entrée on tablet]
    → Tenant reviews and signs on same device
    ↓
[Both receive PDF copy]
    ↓
[Every month: Tenant checks portal → "Payment marked received"]
    → Downloads quittance for APL file
    ↓
[Move-out: Landlord creates État des Lieux Sortie]
    → System auto-compares entry vs exit condition
    → Deposit deduction calculation pre-filled
```

---

## 5. V2 SEO CONTENT STRATEGY

V2 features each map to a content cluster. New pages to build alongside V2 features:

| Feature | Landing Page | Blog / Guide | Tool Page |
|---------|-------------|--------------|-----------|
| Accounting Export | `/guides/declaration-revenus-fonciers` | `comment-declarer-loyers-2026` | `/templates/releve-loyer-annuel` |
| Tenant Portal | `/guides/portail-locataire-droit` | `locataire-peut-exiger-quittance` | `/outils/generateur-attestation-loyer` |
| Inspection Reports | `/guides/etat-des-lieux-entree-checklist` | `etat-des-lieux-sortie-depot-garantie` | `/outils/modele-etat-des-lieux` |
| Multi-User Agency | `/pour-les-agences` (refresh) | `logiciel-gestion-locative-agence` | — |
| Document Vault | `/guides/gestion-documents-location` | — | — |
| Charges Reconciliation | `/guides/regularisation-charges-locatives` | `charges-locatives-provisions-2026` | `/outils/calculateur-regularisation-charges` |
| AI Lease Assistant | `/guides/assistant-bail-ia` | `clause-bail-location-ia` | — |

---

## 6. V2 LAUNCH TIMELINE

```
Q3 2026 (Jul–Sep) — V2 CORE
  ├─ Month 1 (Jul): Accounting export (CSV + PDF) ← CRITICAL for tax season
  ├─ Month 2 (Aug): Tenant portal (beta) + Document vault
  └─ Month 3 (Sep): Inspection reports PDF + lease renewal workflow

Q4 2026 (Oct–Dec) — V2 EXPANSION
  ├─ Month 1 (Oct): Multi-user agency mode + portfolio dashboard
  ├─ Month 2 (Nov): Email notifications + maintenance tickets
  └─ Month 3 (Dec): Charges reconciliation + owner statements

AI Experiment: AI lease drafting assistant (soft launch Oct, evaluate Jan 2027)
```

---

## 7. V2 SUCCESS METRICS

| Metric | V2 Target | Measurement |
|--------|-----------|-------------|
| MRR | €10,000 | Stripe |
| Paying customers | 200+ | Stripe |
| Accounting export adoption | 40% of trial users at tax season | DB event |
| Tenant portal invitations sent | 500+ | DB event |
| Tenant portal activation | > 30% of invited tenants log in | PostHog |
| Inspection reports created | 200+ | DB event |
| Agency plan signups | 20+ | Stripe |
| NPS (V2 users at day 30) | > 55 | In-app survey |
| Feature adoption rate | > 50% of paying users use ≥ 3 V2 features | PostHog |
| AI lease assistant usage | < 20% = deprioritise AI; > 40% = invest | Feature flag analytics |

---

## 8. OPEN QUESTIONS FOR CTO REVIEW

1. **AI assistant build vs buy:** Is the in-house team building the AI lease drafting assistant, or using an external API (e.g., OpenAI / Anthropic)? Affects effort estimate significantly.
2. **Inspection report e-signature:** Does V2 include a free e-signature integration, or is the PDF-download-sign-scan flow acceptable for MVP?
3. **Maintenance marketplace:** Should we build the infrastructure only (tickets), or also the partner marketplace (which requires a business development pipeline)?
4. **API scope:** Which third-party integrations are highest priority — accountants (Pennylane, Sage), or property portals (SeLoger, LeBonCoin)?
5. **Agency pricing:** What is the price point for agency plan — per-seat or flat? Need to define before Month 1 of Q4.

---

*Document owner: Product Manager (REN-299)*
*Last updated: 2026-04-20*
*Next review: Q3 2026 sprint planning*
