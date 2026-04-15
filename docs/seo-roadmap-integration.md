# SEO Roadmap & Content Calendar Integration
**Issue:** REN-167 | **Owner:** Product Manager | **Date:** 2026-04-15
**Status:** COMPLETE

---

## Purpose

This document unifies the SEO strategy with the V1/V2/V3 product roadmap. It answers:
- Which features must ship with V1 to maximize SEO traction
- How the content calendar maps to feature launches
- What KPIs track SEO + product health together
- Where competitor keyword gaps exist vs. our current roadmap
- What success metrics define SEO-driven feature success

**Primary audience:** CTO, SEO Content Lead, CEO
**Docs this integrates:** `seo-keyword-strategy.md`, `seo-content-roadmap.md`, `content-clusters.md`, `REN-46-mvp-scope.md`, `V1_MVP_PRD.md`, feature page copy in `/docs/copy/features/`

---

## 1. V1/V2/V3 Feature-to-SEO Mapping

### V1 Features (MVP — Live Now / In Progress)

| Feature | SEO-Critical? | SEO Contribution | Primary Keywords Targeted |
|---------|--------------|-------------------|--------------------------|
| Property Management | Low | Guide pages only | gestion locative, gérer biens location |
| Tenant Management | Low | Guide pages only | gestion locataire, suivi locataire |
| **Lease Management** | **YES — Critical** | Template landing pages + tools | modèle bail location, bail 2026, bail meublé, bail vide, bail mobilité |
| **Rent Collection & Receipts** | **YES — Critical** | Tool pages + calculator | quittance de loyer, modèle quittance loyer, reçu loyer |
| Dashboard & Navigation | No | App-only (noindex) | — |
| Onboarding Wizard | No | App-only (noindex) | — |

**V1 SEO Verdict:** Lease management + rent receipt tools are the two SEO-critical features. Every V1 launch must include at least one new tool/template page targeting a high-volume transactional keyword. The `/outils/` URL family is the SEO conversion engine.

---

### V2 Features (SEO Foundation — Next Quarter)

| Feature | SEO-Critical? | SEO Contribution | Primary Keywords Targeted |
|---------|--------------|-------------------|--------------------------|
| Maintenance & Incident Tracking | Medium | How-to guides + templates | demande de réparation, incident location, maintenance locative |
| Inspection Reports (État des lieux) | **YES** | Template + guide pages | état des lieux, modèle état des lieux, état des lieux sortie |
| Owner Portal (multi-property) | Low | ICP pages | logiciel gestion patrimoine, gestion locative agence |
| Accounting Exports | Medium | Guide pages | comptabilité locative, export comptable propriétaire |
| Document Vault | Low | Feature page | coffre-fort numérique bailleur |
| **Auto-reminders / Late Payment Letters** | **YES** | Tool + template pages | lettre relance loyer impayé, модель lettre relance |

**V2 SEO Priority:** The auto-reminder tool targets a long-tail transactional keyword with almost no competition ("lettre relance loyer impayé"). The état des lieux template targets a high-volume informational keyword (9,900/mo). Both should ship early in V2.

---

### V3 Features (Authority Building — 6–12 Months)

| Feature | SEO-Critical? | SEO Contribution | Primary Keywords Targeted |
|---------|--------------|-------------------|--------------------------|
| Rent Revision Calculator (IRL) | **YES** | Calculator tool page | calcul révision loyer IRL, indice référence loyer |
| Tenant Portal | Low | UX feature only | espace locataire en ligne |
| Rent Increase Notices | Medium | Template + guide | lettre augmentation loyer, révision loyer 2026 |
| Lease Renewal Workflows | Medium | Guide pages | renouvellement bail, tacite reconduction |
| Multi-currency / Multi-country | Low | Future scope | — |
| **Rent Profitability Dashboard** | **YES** | Tool + guide | calcul rendement locatif, rentabilité locative |
| Legal Compliance Checklist | **YES** | Tool + guide | checklist conformité bailleur, obligations légales |

---

## 2. Content Calendar Milestones by Feature Launch

### V1 Launch (NOW — Q2 2026)
**SEO Theme:** "Get Legally Compliant Fast"

**Content aligned with V1 features:**

| Content Asset | Target URL | Feature | Target KW | Type | Milestone |
|---------------|-----------|---------|-----------|------|-----------|
| Bail de location : guide complet 2026 | /blog/guide-bail-location | Lease Mgmt | bail location | Pillar article | V1 launch week 1 |
| Modèle bail location vide gratuit | /outils/modele-bail-location | Lease Mgmt | bail location vide | Template tool | V1 launch week 1 |
| Modèle quittance de loyer gratuit | /outils/modele-quittance-loyer | Rent Receipts | quittance loyer | Template tool | V1 launch week 1 |
| Bail meublé vs bail vide : lequel choisir | /blog/bail-meuble-vs-bail-vide | Lease Mgmt | bail meublé ou vide | Blog article | V1 launch week 2 |
| Glossaire gestion locative A-Z | /glossaire | All | glossaire gestion locative | Glossary | V1 launch week 1 |

**Launch sequence:** Feature pages → Template tools → Blog pillar → Glossary

---

### V2 Launch (Q2–Q3 2026)
**SEO Theme:** "Operational Excellence for Landlords"

| Content Asset | Target URL | Feature | Target KW | Type | Milestone |
|---------------|-----------|---------|-----------|------|-----------|
| модель état des lieux de sortie | /outils/etat-des-lieux-sortie | Inspections | état des lieux sortie | Template tool | V2 sprint 1 |
| Comment faire un état des lieux conforme | /blog/etat-des-lieux-guide | Inspections | état des lieux | Pillar article | V2 sprint 1 |
| модель lettre de relance pour loyer impayé | /outils/lettre-relance-loyer | Auto-reminders | lettre relance loyer impayé | Template tool | V2 sprint 2 |
| Gestion maintenance locative : le guide | /blog/gestion-maintenance-locative | Maintenance | maintenance locative | Blog article | V2 sprint 2 |
| модель demande de réparation locataire | /outils/demande-reparation | Maintenance | demande réparation location | Template tool | V2 sprint 3 |
| Bail mobilité : guide complet 2026 | /blog/bail-mobilite-guide | Lease Mgmt | bail mobilité | Blog article | V2 sprint 3 |

---

### V3 Launch (Q4 2026 – Q1 2027)
**SEO Theme:** "The Full-Stack Landlord Platform"

| Content Asset | Target URL | Feature | Target KW | Type | Milestone |
|---------------|-----------|---------|-----------|------|-----------|
| Calculateur révision loyer IRL 2026 | /outils/calculateur-irl | Rent Revision | calcul IRL 2026 | Calculator tool | V3 launch |
| Calculateur rentabilité locative | /outils/calculateur-rendement | Profitability | calcul rendement locatif | Calculator tool | V3 launch |
| Checklist obligations bailleur 2026 | /outils/checklist-conformite | Compliance | obligations bailleur | Checklist tool | V3 launch |
| Comment déclarer revenus fonciers | /blog/declarer-revenus-fonciers | Accounting | revenus fonciers | Blog pillar | V3 launch |
| модель lettre augmentation loyer | /outils/lettre-augmentation-loyer | Rent Revision | lettre augmentation loyer | Template tool | V3 launch |

---

## 3. SEO KPI Framework (Aligned with Product KPIs)

### Traffic & Visibility KPIs

| KPI | Target (6 mo) | Target (12 mo) | Measurement |
|-----|--------------|----------------|-------------|
| Organic sessions | +100% vs baseline | +300% vs baseline | Google Analytics |
| Non-brand organic clicks | 30% of total organic | 50% of total organic | GA4 |
| Pages indexed | 100+ pages | 300+ pages | GSC |
| Average position for head terms | Top 20 for "gestion locative" | Top 5 for "gestion locative" | GSC |
| Indexed programmatic pages | 50 | 200 | GSC |

### SEO-Critical Feature KPIs

| Feature | KPI | Target | Measurement |
|---------|-----|--------|-------------|
| Lease template tool | Template → signup conversion | 10% | Mixpanel/Amplitude |
| Rent receipt tool | Tool → signup conversion | 8% | Mixpanel |
| État des lieux tool | Tool → signup conversion | 8% | Mixpanel |
| IRL calculator | Tool → signup conversion | 12% | Mixpanel |
| Any template page | Pages per session | 2.5 pages/session | GA4 |
| Any tool page | Session duration | >3 min | GA4 |
| Blog pillar article | Newsletter signup rate | 3–5% | Email tool |
| ICP landing page | Trial signup rate | 5–10% | Mixpanel |

### Product + SEO Alignment KPIs

| KPI | Why It Matters | Target |
|-----|---------------|--------|
| SEO-assisted signups | Measures how many product signups came via organic | 40% of total signups |
| SEO-assisted activation | Signups from SEO who reach "first lease created" | 30% of SEO signups |
| Organic trial-to-paid | Conversion rate of SEO-sourced trials | >15% |
| Organic churn | Churn rate of SEO-sourced vs paid channel | SEO < paid churn |
| Blog-to-signup funnel | Blog article → CTA click → signup | >2% |
| Tool-to-signup funnel | Template/calculator → CTA → signup | >8% |

---

## 4. Competitor Keyword Gap Analysis

### Competitors Monitored
- **ImmoFacile** — strongest in lease templates + tool pages
- **SeLoger Gestion** — strong brand, weak SEO content
- **Flatlooker** — newer entrant, strong UX but thin content
- **Gestion Locative Simplifiée** — good blog, poor tool pages
- **Lokaviz** — institutional, not targeting indie landlords

### Gaps: Keywords Competitors Don't Cover Well

| Gap | Our Opportunity | Volume | Intent | Priority |
|-----|----------------|--------|--------|----------|
| "quittance de loyer pdf gratuit" | None of them offer a free PDF tool | 6,600/mo | Transactional | **P0** |
| "calculateur IRL 2026" | No up-to-date 2026 calculator exists | 4,400/mo | Tool | **P0** |
| "lettre relance loyer impayé gratuit" | Generic letter, no structured tool | 1,100/mo | Tool | **P1** |
| "modèle bail location saisonnière" | Niche but zero competition | 320/mo | Tool | **P1** |
| "bail mobilité pdf gratuit" | Virtually no French resource | 720/mo | Tool | **P1** |
| "checklist état des lieux" | No structured interactive checklist | 590/mo | Tool | **P2** |
| "calcul rentabilité locative net" | No good calculator in market | 1,900/mo | Tool | **P2** |
| "déclaration 2042 revenus fonciers" | Tax niche, very weak content | 2,900/mo | Guide | **P2** |
| "attestation hébergement modèle" | Simple but competitive | 880/mo | Tool | **P2** |
| "assurance loyer impayé prix" | Price comparison gap | 320/mo | Commercial | **P3** |

### Gaps: Content Types We Must Win

| Type | Why Missing | Our Advantage |
|------|-------------|---------------|
| Tool + template hybrid pages | Competitors treat tools and content separately | We integrate tools inside content |
| Updated annual content (IRL calculators, rent caps) | Most pages go stale after year 1 | Our dev team ships fresh data annually |
| Interactive checklists | No competitor offers interactive | V3 compliance checklist feature |
| City-specific rental guides | Only generic national content exists | Programmatic city pages V3 |
| Gestion locative guides by property type | No structured landlord-type content | ICP pages already in roadmap |

---

## 5. SEO-Critical Feature Shipment Checklist

For every V1/V2/V3 feature, the PM must confirm before engineering sign-off:

- [ ] Target keyword identified and approved by PM
- [ ] URL structure defined (`/outils/` for tools, `/blog/` for articles, `/guide/` for pillars)
- [ ] Meta title + meta description written
- [ ] H1 confirmed (keyword-led, benefit-oriented)
- [ ] Internal linking source pages identified (at least 2)
- [ ] Schema markup type selected (FAQPage, HowTo, SoftwareApplication, WebPage)
- [ ] Conversion CTA defined (signup / demo / newsletter)
- [ ] Google Analytics event tracking confirmed
- [ ] Page added to sitemap
- [ ] Lighthouse score target: 90+ (Performance), 100 (Accessibility)

---

## 6. Success Metrics for SEO-Driven Features

A feature page is considered SEO-successful when ALL of the following are true at 90 days post-launch:

| Metric | Threshold | Measurement |
|--------|-----------|-------------|
| Indexed in Google | Yes (confirmed in GSC) | GSC inspection |
| Average position | Top 50 for target keyword | GSC |
| Organic clicks | >100 clicks/month | GSC |
| CTR from SERP | >3% | GSC |
| Tool/s template download or use | >50 uses/month | App analytics |
| Signup conversion from page | >3% | Mixpanel |
| Bounce rate | <60% | GA4 |
| Pages per session from this page | >2.0 | GA4 |
| Internal links to this page | >3 from other pages | Screaming Frog |

If < 3 of these are met at 90 days: PM schedules a content refresh or SEO review within 30 days.

---

## 7. Rollup: Immediate Actions

| Priority | Action | Owner | Deadline |
|----------|--------|-------|----------|
| P0 | Launch lease template page `/outils/modele-bail-location` with H1, meta, CTA, schema | SEO Content Lead + Engineering | This week |
| P0 | Launch rent receipt tool `/outils/modele-quittance-loyer` | SEO Content Lead + Engineering | This week |
| P0 | Submit both pages to Google via GSC URL inspection | PM | This week |
| P1 | Write + publish `/blog/guide-bail-location` pillar article | SEO Content Lead | Week 2 |
| P1 | Confirm `/glossaire` page live with A-Z navigation | Engineering | Week 1 |
| P1 | Set up GA4 events for template tool → signup funnel | Engineering | Week 1 |
| P2 | Map all V2 features to SEO deliverables in sprint planning | PM | Next sprint |
| P2 | Set up GSC property and connect to GA4 | CTO | This week |
| P3 | Add SEO review gate to V2 PRD template | PM | Next sprint |

---

**Next review:** When V2 PRD is drafted. This document should be updated at each phase transition.
