# Calculator Pages — Content Briefs for SEO

> This document provides SEO-optimized content outlines for the calculator tool pages. These pages serve a critical SEO function: they answer high-intent "comment calculer X" queries and convert users into signups.

---

## Overview

Calculator pages target informational + transactional intent. Users search "how to calculate X", find our tool, use it, and convert to a free trial.

**Existing calculator pages:**
- `/app/(outils)/outils/calculateur-depot-garantie/` (TO DO — needs implementation)
- `/app/(outils)/outils/calculateur-irl-2026/` (TO DO — needs implementation)
- `/app/(outils)/outils/simulateur-loi-jeanbrun/` (existing but needs SEO enrichment)
- `/app/(marketing)/templates/calculateur-rendement-locatif/` (existing)

---

## 1. Calculateur de Dépôt de Garantie

**Page URL:** `/app/(outils)/outils/calculateur-depot-garantie/page.tsx`

**Status:** Needs implementation

**Meta Title:** Calculateur de Dépôt de Garantie — Estimation instantanée et gratuite

**Meta Description:** Calculez le montant légal du dépôt de garantie pour votre location. Applicable 2026. Location vide ou meublée. Gratuit, sans inscription.

**Target Keywords:** calculateur depot garantie, depot garantie location, calcul depot garantie, depot garantie meublé, depot garantie 2026, plafond depot garantie

**Primary Intent:** Informational + tool use

**Target User:** Landlord about to sign a lease, wants to know the legal deposit limit

---

### Content Sections

#### Section 1: Hero with Calculator
- **H1:** Calculateur de Dépôt de Garantie — Gratuit et Instantané
- **Subtitle:** Entrez le montant de votre loyer. Découvrez le plafond légal en 1 clic.
- **Calculator Form Fields:**
  1. "Type de location" (select: Location vide / Location meublée)
  2. "Montant du loyer mensuel (hors charges)" (number input, in €)
  3. "Type de bien" (select: Logement vide / Logement meublé — note: this may duplicate field 1)
- **Primary CTA:** "Calculer le dépôt de garantie"
- **Result display:** "Le plafond légal du dépôt de garantie est de : X €"

#### Section 2: Result Explanation
- **H2:** Comment interprétation votre résultat?
- **Content:** Explain the deposit limit rule:
  - Location vide: max 1 month rent (hors charges)
  - Location meublée: max 2 months rent (hors charges)
  - The deposit must be returned within 1 month (or 2 months if differences between entry and exit inventories)
  - Deductions can only be made for actual damage (not normal wear and tear)
- **Word count:** ~200 words

#### Section 3: Règles légales du dépôt de garantie
- **H2:** Dépôt de garantie : ce que dit la loi en 2026
- **Content:** Article 22 of loi 89-462 (6 July 1989). Key rules:
  - Cannot exceed 1 month rent (empty) or 2 months rent (furnished)
  - Must be returned within 2 months of inventory comparison
  - Deductions must be justified with invoices or estimates
  - Interest not required on the deposit (but must be returned promptly)
  - Cannot be used as last month's rent (unless agreed in writing)
  - Deposit cannot be increased upon renewal
- **Word count:** ~300 words

#### Section 4: Comment utiliser le dépôt de garantie?
- **H2:** Que faire en cas de dégradations à la sortie?
- **Content:** Step-by-step:
  1. Compare entry and exit inventories carefully
  2. Document any damage with photos
  3. Get repair quotes (invoices from professionals)
  4. Send formal letter to tenant with deduction list + invoices
  5. Return remaining deposit + any interest (if applicable)
  6. If dispute: small claims court (juridiction de proximité) — no lawyer needed
- **Word count:** ~250 words

#### Section 5: Calcul détaillé
- **H2:** Calcul détaillé de votre dépôt de garantie
- **Content:** Formula breakdown:
  - Formule (location vide) = Loyer Mensuel × 1
  - Formule (location meublée) = Loyer Mensuel × 2
  - Example calculation: Apt with €1,200/month rent (empty) → deposit = €1,200
  - Example calculation: Apt with €1,200/month rent (furnished) → deposit = €2,400
- **Word count:** ~150 words + worked examples

#### Section 6: FAQ
- **H2:** Questions fréquentes sur le dépôt de garantie
- **7 FAQs:**
  1. Le dépôt de garantie peut-il dépasser le plafond légal? (Non — it's illegal and the excess can be reclaimed by the tenant)
  2. Quand dois-je restituer le dépôt de garantie? (Within 1 month of the exit inventory, or 2 months if damage is found)
  3. Le dépôt de garantie doit-il générer des intérêts? (No legal requirement, but some landlords voluntarily pay interest)
  4. Puis-je utiliser le dépôt comme dernier mois de loyer? (Only with written tenant agreement at the start of the lease)
  5. Que faire si le locataire refuse de payer le dépôt? (You can refuse to hand over keys until deposit is paid, but this creates a legal dispute)
  6. Le dépôt de garantie est-il imposable? (Not directly — but it must be kept in a blocked account or returned)
  7. Comment prouver l'état des lieux d'entrée? (Photos + signed document — RentReady generates a compliant inventory with photos)

#### Section 7: Related Content
- **H2:** Ressources complémentaires
- **Links:**
  - Article: "Dépôt de garantie : les règles essentielles" → `/blog/depot-garantie-regles-essentielles`
  - Glossaire: Dépôt de garantie → `/glossaire-immobilier`
  - Outil: Calculateur IRL 2026 → `/outils/calculateur-irl-2026`
  - Outil: Modèle d'état des lieux → `/app/(marketing)/templates/etat-des-lieux/`
  - Page produit: Locations → `/locations`

#### Section 8: Conversion CTA
- **H2:** Gérez vos dépôts de garantie automatiquement avec RentReady
- **Content:** "RentReady calcule automatiquement le bon montant, génère les reçus, et vous rappelle quand effectuer la restitution."
- **CTA:** "Essayez gratuitement pendant 14 jours" → `/register`

---

### SEO Notes for Calculateur Depot Garantie
- **JSON-LD:** HowTo schema + FAQPage schema + WebApplication schema (free tool)
- **Tool Schema:** `HowTo` with steps matching the calculation process
- **Internal Links:** From `/locations`, `/blog/depot-garantie-regles-essentielles`, `/glossaire-immobilier`
- **External Links:** Reference service-public.fr page on deposits

---

## 2. Calculateur IRL (Indice de Référence des Loyers)

**Page URL:** `/app/(outils)/outils/calculateur-irl-2026/page.tsx`

**Status:** Needs implementation

**Meta Title:** Calculateur IRL 2026 — Calculez la Révision de Loyer Automatiquement

**Meta Description:** Calculez la nouvelle valeur de votre loyer après révision IRL 2026. Simulateur gratuit basé sur les indices INSEE officiels. Sans inscription.

**Target Keywords:** calculateur IRL, simulateur IRL, revision loyer IRL, indice reference loyers, calcul revision loyer, IRL 2026, revision loyer 2026, IRL INSEE

**Primary Intent:** Informational + tool use (landlord wants to calculate the new rent after annual IRL increase)

---

### Content Sections

#### Section 1: Hero with Calculator
- **H1:** Calculateur de Révision de Loyer IRL — Simulateur 2026
- **Subtitle:** Calculez le nouveau montant de votre loyer après révision annuelle IRL. Basé sur les indices INSEE officiels.
- **Calculator Form Fields:**
  1. "Loyer actuel (hors charges)" (number input, €)
  2. "Date de révision" (month/year — defaults to current anniversary)
  3. "Trimestre de référence de votre bail" (select: Q1 2024, Q2 2024, Q3 2024, Q4 2024, Q1 2025, Q2 2025, Q3 2025, Q4 2025, Q1 2026)
  4. "Indice IRL utilisé" (auto-filled based on selection, or manual entry)
- **Primary CTA:** "Calculer la révision"
- **Result display:**
  - "Nouveau loyer : X €/mois"
  - "Augmentation : Y € (Z%)"
  - "Période de référence : [Trim/Year]"

#### Section 2: Comment fonctionne la révision IRL?
- **H2:** Comment fonctionne la révision annuelle du loyer?
- **Content:** Legal basis (loi 89-462, art. 17-1). Formula:
  - New rent = Current rent × (New IRL / Old IRL)
  - The IRL is published quarterly by INSEE (Q4 2024 = 145.65, Q3 2025 = 146.38, Q4 2025 = 146.43 — verify current values)
  - The revision can only happen once per year, on the lease anniversary date
  - The clause must be in the lease to allow revision
  - The increase is capped to the IRL (no above-IRL increases allowed in non-tensed areas)
- **Word count:** ~300 words

#### Section 3: Tableau des indices IRL
- **H2:** Tableau des indices IRL depuis 2020
- **Content:** Table with IRL values by quarter:
  | Trimestre | IRL |
  |-----------|-----|
  | Q1 2020 | 130.57 |
  | Q2 2020 | 130.57 |
  | Q3 2020 | 130.57 |
  | Q4 2020 | 130.57 |
  | Q1 2021 | 130.57 |
  | Q2 2021 | 131.12 |
  | ... | ... |
  | Q4 2025 | 146.43 |
  | Q1 2026 | 146.47* |
  (* verify with INSEE)
- **Note:** "Source: INSEE. Vérifiez toujours les indices officiels sur insee.fr."
- **Word count:** ~100 words + table

#### Section 4: Exemple de calcul
- **H2:** Exemple concret de révision de loyer
- **Content:** Worked example:
  - Current rent: €800/month (set in September 2023, using Q2 2023 IRL: 138.42)
  - Anniversary date: September 2026
  - Q2 2026 IRL (assumed): 147.10
  - New rent = €800 × (147.10 / 138.42) = €849.98 → round to €850
  - Increase: €50/month (+6.25%)
- **Word count:** ~150 words + example

#### Section 5: Quand la révision n'est pas possible?
- **H2:** Quand la révision de loyer n'est pas applicable
- **Content:** Situations where rent revision is limited or prohibited:
  - Areas with rent control (encadrement des loyers): increase cannot exceed the IRL + 10% (for now)
  - If the lease anniversary is before the new IRL is published
  - If the lease doesn't contain a revision clause
  - If the tenant is in a subsidized housing situation with regulated rent
- **Word count:** ~200 words

#### Section 6: FAQ
- **H2:** Questions fréquentes sur la révision IRL
- **7 FAQs:**
  1. Quand l'IRL est-il publié? (Quarterly by INSEE, typically in mid-March (Q4 prev year), June (Q1), September (Q2), December (Q3))
  2. Quelle indice IRL utiliser? (The one corresponding to the most recent quarter before the lease anniversary date)
  3. Peut-on négocier le nouveau loyer? (Yes, but only with mutual agreement — the landlord cannot unilaterally impose a higher increase)
  4. L'augmentation IRL est-elle obligatoire? (No — the clause allows it, but both parties can agree to no increase or a lower increase)
  5. Que se passe-t-il si je oublie de réviser? (You can only claim the difference for the 12 months preceding the request — beyond that, the right is lost)
  6. La révision s'applique-t-elle aux charges? (No — only the rent (loyer principal) is revised, not the charges)
  7. Comment contester une révision abusive? (Mediation first, then tribunal de proximité)

#### Section 7: Related Content
- **H2:** Ressources complémentaires
- **Links:**
  - Article: "Révision de loyer IRL: guide complet 2026" → `/blog/revision-loyer-irl-guide-complet`
  - Glossaire: IRL → `/glossaire-immobilier`
  - Outil: Calculateur de dépôt de garantie → `/outils/calculateur-depot-garantie`
  - Page produit: Quittances → `/quittances`

#### Section 8: Conversion CTA
- **H2:** Automatisez vos révisions de loyer avec RentReady
- **Content:** "RentReady calcule automatiquement la révision IRL à chaque anniversaire de bail et génère une quittance avec le nouveau loyer."
- **CTA:** "Essayez gratuitement" → `/register`

---

### SEO Notes for Calculateur IRL
- **JSON-LD:** HowTo schema + FAQPage schema + WebApplication schema (free tool)
- **IRL Data:** The calculator must use real INSEE IRL data. Create a data file at `/src/data/irl-indices.ts` with all quarterly IRL values.
- **Source link:** Link to INSEE's official IRL page (https://www.insee.fr/fr/statistiques/4490530)
- **Internal Links:** From `/blog/revision-loyer-irl-guide-complet`, `/quittances`, `/bail`, `/glossaire-immobilier`

---

## 3. Simulateur Loi Jean-Marc-Brun (Encadrement des Loyers)

**Page URL:** `/app/(outils)/outils/simulateur-loi-jeanbrun/page.tsx`

**Status:** Existing but needs SEO enrichment

**Meta Title:** Simulateur Loi Jean-Marc-Brun — Vérifiez si votre loyer est encadré

**Meta Description:** La loi ALUR encadre les loyers dans les zones tendues. Vérifiez si votre commune est concernée et si votre loyer respecte les plafonds. Simulateur gratuit.

**Target Keywords:** simulateur loi jeANBRUN, encadrement loyer, zone tendue, plafond loyer, simulation loyer, loi ALUR loyer, controle loyer

**Sections to add:**
1. Hero with commune search
2. Legal framework explanation (loi ALUR + loi ELAN)
3. List of communes with encadrement
4. How the reference rent is calculated
5. FAQ (5 questions)

---

## 4. Additional Calculator Opportunities

### 4A. Calculateur de Rendement Locatif
**URL:** `/app/(marketing)/templates/calculateur-rendement-locatif/`
**Status:** Existing — needs more SEO content
**Target Keywords:** calculateur rendement locatif, rendement investissement immobilier, rentabilité location, calcul rendement location, ROI investissement locatif

### 4B. Calculateur de Charges Locatives
**URL:** (new) `/app/(outils)/outils/calculateur-charges/`
**Status:** To be created
**Target Keywords:** calculateur charges locatives, estimate charges, charges prévisionnelles, regularisation charges

---

## 5. SEO Patterns for All Calculator Pages

### Meta Title Pattern
- Format: `[Calculator Name] — [Key Benefit] | RentReady`
- Max: 60 characters
- Include primary keyword

### Content Structure
Every calculator page follows this structure:
1. **Hero:** H1 + calculator form (above the fold)
2. **Result + Explanation:** Show result, explain what it means
3. **How it Works / Legal Framework:** Background information
4. **Detailed Calculation:** Step-by-step formula with worked example
5. **Edge Cases / Limitations:** When the tool doesn't apply
6. **FAQ:** 5-7 common questions
7. **Related Content:** Internal links
8. **Product CTA:** Automation benefits at the bottom

### JSON-LD for Calculator Pages
```typescript
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Calculateur de dépôt de garantie",
  "description": "Calculez le montant légal du dépôt de garantie pour une location",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Sélectionnez le type de location",
      "text": "Choisissez entre location vide (max 1 mois de loyer) ou location meublée (max 2 mois de loyer)"
    },
    {
      "@type": "HowToStep",
      "name": "Entrez le montant du loyer",
      "text": "Saisissez le montant de votre loyer mensuel hors charges"
    },
    {
      "@type": "HowToStep",
      "name": "Obtenez le résultat",
      "text": "Le calculateur affiche le plafond légal du dépôt de garantie"
    }
  ],
  "supply": {
    "@type": "QuantitativePropertyDistribution",
    "description": "Montant du loyer mensuel"
  }
}
```

### Calculator-to-Conversion Pattern
The calculator output should include:
1. The calculated result
2. A brief explanation
3. A natural CTA to the product: "Pour automatiser [this calculation] every month, try RentReady →"

---

## 6. Implementation Checklist for Calculator Pages

- [ ] H1 matches page title
- [ ] Calculator form is functional and accessible (keyboard-navigable)
- [ ] Result updates instantly (or on button click) without page reload
- [ ] All legal explanations cite the correct law article
- [ ] IRL indices match INSEE official data (create a data file at `src/data/irl-indices.ts`)
- [ ] FAQ section has at least 5 questions with full answers
- [ ] HowTo JSON-LD schema is correctly implemented
- [ ] All internal links are working
- [ ] Product CTA at bottom of page
- [ ] Mobile-responsive (calculator form works on mobile)
- [ ] No console errors
