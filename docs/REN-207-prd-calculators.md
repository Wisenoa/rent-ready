# REN-207 PRD: Outils Calculator Pages
**Issue:** REN-207 | **Owner:** Product Manager | **Date:** 2026-04-15
**Status:** In Progress | **Priority:** Critical | **Engineering Owner:** TBD

---

## 1. OVERVIEW

The /outils section is a core SEO and conversion asset. These pages attract high-intent users searching for specific calculations (IRL, rent, charges, deposit), deliver immediate value through interactive tools, and convert them into free-trial signups. Each calculator is a standalone page with unique URL, FAQ schema, and CTA to the product.

**Why these pages win:**
- "Calculateur" is a high-volume keyword in French rental searches
- Google increasingly shows interactive calculators in rich results
- Users who calculate are actively planning a rental decision — highest purchase intent
- Each page becomes a permanent SEO asset generating organic traffic

---

## 2. P0 CALCULATORS

### 2.1 Calculateur IRL — `/outils/calculateur-irl`

**URL:** `/outils/calculateur-irl`
**Target keyword:** "calculateur IRL", "indice de référence des loyers 2026", "IRL calcul"
**Search intent:** Informational → Commercial

#### What IRL Is
The Indice de Référence des Loyers (IRL) is published quarterly by INSEE. Landlords use it to justify rent increases (majoration limited to the lesser of IRL + 10% or IRL + 0.20%). Tenants use it to verify increases are legal.

#### User Inputs
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Quarter of current lease | Select | Q1 2026 | INSEE publishes Q1-Q4 |
| Previous rent amount (€) | Number | — | Required, €0-99999 |
| New IRL quarter | Select | Q1 2026 | Usually current quarter |
| New IRL value | Number | Auto-fill latest | INSEE publishes ~100.XX |

> Note: INSEE IRL values must be kept current. A data table or API fetch from `https://www.insee.fr/` should update the IRL value automatically. Fallback: hardcoded table of recent IRL values by quarter.

#### Calculated Outputs
- **Maximum authorized rent increase** = Previous rent × (New IRL / Previous IRL), capped at +10%
- **Maximum new rent** = Previous rent + authorized increase
- **Display:** "With an IRL of [X.XX], your authorized maximum increase is [Y]% → new rent capped at €[Z]"

#### Page Content Structure
```
H1: "Calculateur d'IRL — Vérifiez Votre Augmentation de Loyer en 2026"
Subheadline: "Calculez l'augmentation maximale légalement autorisée en fonction de l'Indice de Référence des Loyers (IRL) officiel INSEE."

Calculator Widget (centered, prominent)
  └─ Inputs on left, results on right (desktop)
  └─ Stacked on mobile

Benefit Block 1: "Conformité Loi Alur" — reassure landlords this is legal
Benefit Block 2: "Mis à jour avec les derniers IRL INSEE"
Benefit Block 3: "Export PDF du résultat" (if we add this feature)

CTA: "Gérez vos loyers en toute conformité → Essai gratuit 14 jours"

FAQ (3 questions targeting PAA):
Q: "Quelle est la majoration maximale d'un loyer ?"
Q: "Comment calculer l'IRL d'une augmentation de loyer ?"
Q: "Quand peut-on augmenter le loyer d'un locataire ?"

Internal links: Bail type pages, Suivi Loyers feature page, Relances feature page

Social proof: "X landlords trust RentReady for compliant rent management" (placeholder)
```

#### SEO Fields
- **Meta title:** "Calculateur IRL 2026 — Augmentation de Loyer Légale | RentReady"
- **Meta description:** "Calculez gratuitement l'augmentation de loyer maximale autorisée selon l'IRL 2026. Outil conforme Loi Alur, mis à jour avec les derniers indices INSEE."
- **Schema:** FAQPage + HowTo + WebApplication

#### UX Notes
- IRL value auto-populated with latest known quarter
- Results update in real-time (no submit button needed)
- Show the formula visually: "Ancien loyer × (Nouvel IRL / Ancien IRL) = Nouveau loyer"
- If user input exceeds legal cap, show a warning: "Attention : cette augmentation dépasse le plafond légal de 10%"

---

### 2.2 Calculateur de Loyer — `/outils/calculateur-loyer`

**URL:** `/outils/calculateur-loyer`
**Target keyword:** "calculateur loyer", "calculer loyer location", "estimation loyer gratuit"
**Search intent:** Informational/Commercial

#### User Inputs
| Field | Type | Notes |
|-------|------|-------|
| City / postal code | Text + autocomplete | Use French city database for suggestions |
| Property type | Select | Studio, T1, T2, T3, T4, T5+ |
| Surface (m²) | Number | m², range 9-500 |
| Number of rooms | Number | 1-10 |
| Floor | Select | Ground, 1-5, 5+, sans ascenseur, avec ascenseur |
| Furniture | Radio | Meublé / Vide |
| Year of construction | Select | <1946 / 1946-1970 / 1971-1990 / 1991-2005 / 2006-2020 / >2020 |

#### Calculated Outputs
- **Estimated market rent range** (min-max based on area)
- **Comparable rent reference** — "Based on [N] rentals in [City], 2025 data"
- **Comparison to legal caps** (if in a zone under encadrement des loyers)
- **Simulated yearly revenue** (rent × 12, without expenses)

#### Data Source
- Use open data from `data.gouv.fr` (Demandes de Valeurs Foncières) or similar
- Fallback: static lookup table by department
- For zones under strict rent control (Paris, Lille, etc.), show a second output: "Loyer de référence [City]: €X/m² — your estimate must be ≤ €Y/m²"

#### Page Content Structure
```
H1: "Calculateur de Loyer — Estimez le Prix Juste de Votre Location en 2026"
Subheadline: "Entrez les caractéristiques de votre bien et estimez un loyer de marché conforme à votre zone géographique."

Calculator Widget

CTA: "Optimisez la gestion de vos propriétés → Essai gratuit"

FAQ:
Q: "Comment estimer le loyer d'une location ?
Q: "Quel est le loyer maximum pour un logement meublé ?
Q: "Comment savoir si mon loyer est dans les clous de la loi ?

Internal links: Gestion Locative feature page, feature page for accounting exports
```

#### SEO Fields
- **Meta title:** "Calculateur de Loyer Gratuit 2026 — Estimez Votre Loyer de Marché | RentReady"
- **Meta description:** "Estimez gratuitement le loyer de votre bien immobilier. Entrez la ville, la surface et le type de bien — obtenez une fourchette de loyer conforme au marché."
- **Schema:** FAQPage + HowTo + WebApplication

---

### 2.3 Calculateur de Charges Locatives — `/outils/calculateur-charges`

**URL:** `/outils/calculateur-charges`
**Target keyword:** "calculateur charges locatives", "estimation charges locataire", "charges locatives moyenne"
**Search intent:** Informational

#### User Inputs
| Field | Type | Notes |
|-------|------|-------|
| Property type | Select | Immeuble ancien / Immeuble récent / Maison |
| Surface (m²) | Number | 10-500 |
| Heating type | Select | Collectif / Individuel gaz / Individuel électrique / Poêle / Aérothermie |
| Has elevator | Boolean | |
| Has common areas | Boolean | |
| Location | Select | Province / Agglomération parisienne |
| Year of construction | Select | ranges |

#### Calculated Outputs
- **Estimated annual charges** (total, per m², per month)
- **Typical charge categories** breakdown (chauffage, eau chaude, ordures ménagères, entretien, etc.)
- **Provisions mensuelles recommandées** (annual charges ÷ 12)
- **Régularisation annuelle estimée**

#### Page Content Structure
```
H1: "Calculateur de Charges Locatives — Estimez les Provisions Mensuelles"
Subheadline: "Estimez les charges locatives pour anticiper vos régularisations annuelles. Gratuit, sans inscription."

[Calculator]

Benefit: "Évitez les mauvaise surprises en fin d'année"

CTA: "Suivez les charges de vos properties automatically →"

FAQ:
Q: "Comment sont indexées les charges locatives ?"
Q: "Quelles charges sont récupérables sur le locataire ?"
Q: "Comment calculer les provisions pour charges ?"

Internal links: Comptabilité feature page, Charges reconciliation V2 feature
```

#### SEO Fields
- **Meta title:** "Calculateur de Charges Locatives 2026 — Estimez vos Provisions | RentReady"
- **Meta description:** "Estimez les charges locatives récupérables et calculez la provision mensuelle recommandée. Anticipez la régularisation annuelle."
- **Schema:** FAQPage + HowTo + WebApplication

---

### 2.4 Calculateur de Dépôt de Garantie — `/outils/calculateur-depot-garantie`

**URL:** `/outils/calculateur-depot-garantie`
**Target keyword:** "calculateur dépôt de garantie", "dépôt de garantie location calcul", "plafond dépôt garantie"
**Search intent:** Informational

#### User Inputs
| Field | Type | Notes |
|-------|------|-------|
| Monthly rent (hors charges) | Number | €0-99999 |
| City | Text | To check if in zone tendue (additional rules apply) |
| Property type | Select | Meublé / Vide |
| Date of lease signing | Date picker | |

#### Calculated Outputs
- **Legal maximum deposit** = 1 month rent (vide/meublé, no charges) — but note: 2 months for furnished in some cases
- **Current law reference** — "Since [date], the deposit cannot exceed X months rent"
- **What the deposit can be used for** at end of lease (damages, unpaid rent)
- **Timeline for return** — "Must be returned within X days after handover"

> Note: In France, for empty (vide) unfurnished rentals, deposit = 1 month rent maximum (except SCI where 2 months is common). For furnished (meublé), up to 2 months is standard.

#### Page Content Structure
```
H1: "Calculateur de Dépôt de Garantie — Connaissez Vos Droits en 2026"
Subheadline: "Calculez le dépôt de garantie maximum légal et savez quand et comment il doit être restitué."

[Calculator]

Benefit: "Évitez les litiges en fin de location"

FAQ:
Q: "Le dépôt de garantie peut-il être utilisé pour payer le dernier mois de loyer ?"
Q: "Dans quel délai le dépôt de garantie doit-il être restitué ?"
Q: "Quelles retenues sont légales sur le dépôt de garantie ?"

Internal links: Bail feature page, État des lieux feature page
```

#### SEO Fields
- **Meta title:** "Calculateur de Dépôt de Garantie — Plafond Légal 2026 | RentReady"
- **Meta description:** "Calculez le dépôt de garantie maximum légal pour votre location. Connaissez vos droits et les délais de restitution obligatoires."
- **Schema:** FAQPage + HowTo + WebApplication

---

## 3. P1 TOOLS

### 3.5 Checklist État des Lieux — `/outils/checklist-etat-lieux`

**URL:** `/outils/checklist-etat-lieux`
**Target keyword:** "checklist état des lieux", "modèle état des lieux gratuit", "état des lieux entrada sortie"
**Search intent:** Informational/Transactional

This is a checklist tool, not a calculator. Users fill in a form and get a PDF-ready checklist.

#### Inputs
- Property type (studio/T1/etc.)
- Rooms list with condition sliders (Neuf / Bon état / À rafraîchir / Mauvais état)
- Presence of: furniture items, appliances, walls, floors, windows, doors
- Meter readings (eau, gaz, électricité) — optional fields

#### Outputs
- Printable/checkable PDF-ready checklist
- Key clauses to include in the état des lieux
- Internal links to related templates

#### SEO Fields
- **Meta title:** "Checklist État des Lieux Gratuite — Imprimez en 2 Clics | RentReady"
- **Meta description:** "Générez votre checklist d'état des lieux d'entrée et sortie. Téléchargez le PDF prêt à imprimer. Conforme à la loi Alur."
- **Schema:** FAQPage + HowTo

---

### 3.6 Calculateur de Preavis Locataire — `/outils/calculateur-preavis`

**URL:** `/outils/calculateur-preavis`
**Target keyword:** "calculateur préavis locataire", "délai préavis location", "préavis réduit relocation"
**Search intent:** Informational

#### User Inputs
| Field | Type | Notes |
|-------|------|-------|
| Reason for leaving | Select | Reasons qualifying for reduced notice: Mutation / Précarité (CDD) / Rupture conventionnelle / Reprise du bailleur / Expulsion / Premier emploi CDD / Perte emploi |
| Location type | Radio | Zone tendue / Zone non tendue |
| City | Text | For zone determination |
| Lease type | Radio | Meublé / Vide |

#### Calculated Outputs
- **Required notice period** (1 month in zone tendue / 3 months otherwise for vide; 1 month for meublé)
- **Deadline date** (start date + notice period)
- **Legal reference** (Article 15, loi n° 89-462 du 6 juillet 1989)
- **Qualifies for reduced notice?** Yes/No with explanation

#### SEO Fields
- **Meta title:** "Calculateur de Préavis Locataire — Quel Délai de Préavis ? | RentReady"
- **Meta description:** "Calculez votre délai de préavis de départ. Vérifiez si vous pouvez bénéficier du préavis réduit d'un mois."
- **Schema:** FAQPage + HowTo + WebApplication

---

## 4. SEO REQUIREMENTS (ALL PAGES)

| Requirement | Standard |
|-------------|----------|
| Meta title | 50-60 chars, keyword-led, benefit-driven |
| Meta description | 150-160 chars, keyword-led, CTA |
| H1 | 1 per page, keyword + year, not generic |
| H2s | 3-5 per page, keyword variations |
| Internal links | Minimum 3 per page, contextual |
| Schema | FAQPage + HowTo + WebApplication (each page) |
| OG image | 1200×630, tool-specific illustration |
| Canonical | Self-referencing canonical |
| Sitemap | Include all /outils/* pages |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 |
| Mobile | Fully responsive |
| Indexable | Yes — these pages drive organic traffic |

---

## 5. CONVERSION REQUIREMENTS (ALL PAGES)

- **Primary CTA:** "Essai gratuit 14 jours — Sans carte bancaire" (above fold)
- **Secondary CTA:** Appears after first use of calculator — "Save your results → Create free account"
- **Exit-intent:** If user tries to leave after calculation, show soft CTA
- **No aggressive popups** — tool pages should feel generous, not salesy
- **Trust signals:** "X calculators used this month", "Conforme Loi Alur", partner logos

---

## 6. TECHNICAL NOTES FOR ENGINEERING

### Data Maintenance
- IRL values: Create a `/data/irl-values.json` file updated quarterly. PM will send reminder to update at each INSEE publication (January, April, July, October).
- City zones (encadrement): Maintain a list of zone tendue cities from government data.
- Charge averages: Use historical data tables — update annually.

### Calculator Component Spec
- Framework: React with TypeScript
- State: Local React state (no backend needed for calculations)
- Validation: Real-time, inline error messages
- Results: Displayed below inputs, auto-update on change
- PDF export: Optional stretch goal for checklist tool

### Routing
- Next.js App Router: `/app/outils/[slug]/page.tsx`
- Each calculator is a separate route
- Shared layout: `/app/outils/layout.tsx` with shared header/footer

---

## 7. DEFINITION OF DONE — ENGINEERING

- [ ] Page renders at correct URL with 200 status
- [ ] Meta title + description set per spec
- [ ] Calculator is fully interactive with no dead-end states
- [ ] All inputs have validation and sensible defaults
- [ ] Results are mathematically correct and display the formula
- [ ] FAQ section present with minimum 3 questions
- [ ] FAQPage schema validated via Google's Rich Results Test
- [ ] Internal links to minimum 3 related pages
- [ ] Primary CTA above the fold
- [ ] Mobile responsive (tested at 375px and 768px)
- [ ] Core Web Vitals: LCP < 2.5s, no layout shift on calculation
- [ ] No console errors
- [ ] PageSpeed score ≥ 90

---

## 8. PRIORITY ORDER FOR BUILD

| Priority | Page | Why |
|----------|------|-----|
| 1 | `/outils/calculateur-irl` | Highest SEO volume + legally valuable |
| 2 | `/outils/calculateur-loyer` | Broad search intent, high traffic potential |
| 3 | `/outils/calculateur-depot-garantie` | High-intent informational |
| 4 | `/outils/calculateur-charges` | Complements rent calculator |
| 5 | `/outils/checklist-etat-lieux` | PDF value-add, strong SEO potential |
| 6 | `/outils/calculateur-preavis` | Moderate volume, lower urgency |

---

*Document owner: Product Manager (REN-207)*
*Created: 2026-04-15*
*Pending: Engineering assignment*
