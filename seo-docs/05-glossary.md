# French Real Estate Glossary — Content Brief for SEO

> This document provides the glossary content specification. The Senior Frontend Engineer uses this to verify/improve the existing glossary page at `/app/(marketing)/glossaire-immobilier/page.tsx`.

---

## Overview

The glossary page (`/glossaire-immobilier`) serves multiple SEO functions:
1. Ranks for long-tail "définition [term]" searches
2. Builds topical authority in the French real estate rental niche
3. Internal linking hub — glossary terms link to articles, tools, and product pages
4. E-E-A-T signal — demonstrates expertise through comprehensive, accurate definitions

**Existing page:** Already built at `/app/(marketing)/glossaire-immobilier/page.tsx` with ~30 terms.

**Target:** 100+ terms organized by category.

---

## 1. Glossary Page Structure

### Page Header
- **H1:** Glossaire Immobilier — Définitions Location et Investissement
- **Subtitle:** [N] définitions pour propriétaires bailleurs, investisseurs et locataires. Trouvez le terme que vous cherchez.
- **Search bar:** Filter terms by keyword (client-side JavaScript)
- **Category tabs:** All | Location | Fiscalité | Juridique | Gestion | Investissement

### Organization
Terms grouped by category, alphabetically within each group.

**Categories:**
1. **Location** (Location & Bail) — ~30 terms
2. **Fiscalité** (Tax & Finance) — ~20 terms
3. **Juridique** (Legal & Contrats) — ~25 terms
4. **Gestion** (Property Management) — ~15 terms
5. **Investissement** (Investment) — ~10 terms

---

## 2. Term Structure (per entry)

Each glossary term should have:
- **Term name** (in French, bold)
- **Pronunciation** (optional, for complex terms)
- **Definition** (2-4 sentences, plain French — NOT legal jargon as primary source)
- **Related terms** (bulleted list of 2-4 linked terms)
- **Related articles** (optional — links to blog articles that use this term)
- **Emoji** (optional — for visual categorization: ⚖️ legal, 💰 finance, 🏠 property, 📋 documents)

---

## 3. Core Terms (100+) to Include

### Category: Location & Bail (~30 terms)

1. **Bail** — see existing
2. **Bailleur** — see existing
3. **Locataire** — see existing
4. **sous-locataire** — Tenant who sublets all or part of the property. Legal conditions apply. Subletting without permission = grounds for lease termination.
5. **Dépôt de garantie** — see existing
6. **Caution** — see existing (redirect to Dépôt de garantie)
7. **Charges locatives** — see existing
8. **Provision sur charges** — Monthly advance paid by tenant for shared costs. Reconciled annually with actual expenses.
9. **Garantie loyer impayé (GLI)** — Insurance product covering unpaid rent, damages, legal fees. Optional for regular landlords.
10. **Visale** — Government-backed security deposit scheme (VISALE = Visa pour le Logement). Free for tenants, protects landlords against unpaid rent. Administered by Action Logement.
11. **Fichier des impayés** — (Fichage) Recording a tenant for unpaid rent. Strict conditions apply. Anti-squatting law (DALO) protections for tenants.
12. **Encadrement des loyers** — Legal price controls in "tensed" housing markets (zones tendues). Limits how much landlords can charge. Active in Paris, Lille, Lyon, etc.
13. **Zone tendue** — Geographic area where housing demand significantly exceeds supply. Subject to rent control (encadrement). Determined by prefectural decree.
14. **Loyer de référence** — The maximum rent allowed in a given zone under encadrement rules. Calculated from median rents for similar properties.
15. **Surface habitable** — Usable floor area of a dwelling (excluding walls, partitions, openings > 0.5m², non-habitable spaces). Excludes: basement, attic, garage, terrace (unless enclosed). Used for rentability calculations.
16. **Surface Carrez** — Total floor area of private spaces > 1.80m ceiling height. Mandatory for all sales and most rentals. Includes all rooms, cupboards, hallways. Excludes: walls, partitions, openings, terraces.
17. **Clauses interdites** — Prohibited clauses in a lease (e.g., automatic rent increases above IRL, tenant obligation to renounce legal rights). Such clauses are null and void.
18. **Clause résolutoire** — Clause that automatically terminates the lease upon breach (e.g., non-payment of rent after 2 months). Must be proven in court — cannot be self-executing.
19. **Tacite reconduction** — Automatic renewal of the lease at the end of its term. For empty properties: 3-year automatic renewal. Must receive proper notice to avoid.
20. **Préavis** — Notice period required to terminate the lease. 3 months for empty property (locataire), 1 month for furnished (locataire). Owner must give 3-6 months notice depending on reason.
21. **Congé** — Formal notice to terminate the lease. Must be sent by recommandé avec accusé de réception or delivered in person with acknowledgment.
22. **Reprise** — Owner repossessing the property for personal use. Requires 6 months notice + genuine habitation need. Tenant has priority to contest.
23. **Vente du bien** — Selling a rented property. Existing tenants have right of first refusal (droit de préemption). Notice period of 6 months to the tenant.
24. **Meublé** — Furnished rental. 1-year minimum lease (1-year tacite reconduction). Can charge higher rent than empty property. Different regulations apply.
25. **Nu** — Empty/unfurnished rental. 3-year minimum lease (3-year tacite reconduction). Lower rent ceiling than furnished.
26. **Colocation** — Shared rental by multiple tenants (with or without joint lease). Each tenant signs individually or co-signs. Different rules for division of rent.
27. **Sous-location** — Subletting. Legal if permitted in the lease AND with owner's written consent. Tenant remains primary responsible.
28. **Droit d'entrée** — Entry fee paid by tenant in some arrangements (rare in regulated market). Mostly illegal in standard agreements.
29. **Solidarité** — Joint and several liability clause. All co-tenants responsible for full rent if one fails to pay. Typically applies in co-location.
30. **CLCV** — Confédération de la Consommation du Logement et du Cadre de Vie. Consumer association that can take legal action on behalf of tenants.

---

### Category: Fiscalité (~20 terms)

1. **Régime réel** — Tax regime where rental income is reduced by actual expenses (interest, repairs, taxes, insurance). Requires > €15,000 gross income or property management option. Preferred for high-expense landlords.
2. **Micro-foncier** — Simplified tax regime for rental income ≤ €15,000/year. 30% flat deduction (no expenses declared). Easier than régime réel but less advantageous if expenses are high.
3. **LMNP** — Loueur en Meublé Non Professionnel. Tax status for furnished rental where total furnished income < €23,000 AND < 50% of total income. Allows amortisation of property + expenses.
4. **LMP** — Loueur en Meublé Professionnel. Tax status for furnished rental where total furnished income ≥ €23,000 AND ≥ 50% of total income. Allows full business tax treatment.
5. **Amortissement LMNP** — Deduction of property value over time in the LMNP regime. New build: typically 25-30 years. Reduces taxable income significantly.
6. **Plus-value immobilière** — Capital gain on property sale. Taxed at 19% flat rate + social contributions (17.2%). Exemptions apply after 30 years (main residence) or 22 years (rental).
7. **IFI** — Impôt sur la Fortune Immobilière. Wealth tax on net real estate assets > €1.3M. Applies to worldwide property. Excludes: business premises, shares in SCI with > 50% real estate.
8. **Plus-value de relocation** — Increased value from renovation or subdivision. Tax treatment depends on ownership duration and use.
9. **Déduction intérêts d'emprunt** — Mortgage interest deduction (régime réel only). Interest on loans for property acquisition is deductible from rental income.
10. **Déficit foncier** — When rental expenses exceed income in régime réel. Can be carried forward for 10 years against future rental income.
11. **TVA location meublée** — VAT on furnished rental. Standard rate 20% applies if annual furnished income > €90,000. Some cases exempt.
12. **CFE** — Cotisation Foncière des Entreprises. Annual tax on business premises. Applies to furnished rentals (LMP) and some property professionals.
13. **Taxe foncière** — Annual property tax paid by owner. Based on rental value (valeur locative). Recoverable from tenant through charges.
14. **Taxe d'habitation** — Residence tax. Since 2023, mostly abolished for primary residence. Still applies to secondary residences and certain high-value properties.
15. **Micro Bic** — Simplified tax regime for furnished rentals (LMNP) with revenue < €77,700/year. 50% flat deduction, no expenses declared.
16. **Racheter ses trimestres** — Purchasing additional retirement quarters. Relevant for property investors with complex income situations.
17. **Sci à l'IS** — SCI taxed as a corporation (Impôt sur les Sociétés). Enables flat-rate corporate tax (15% up to €42,500 profit, then 25%). Useful for high-income property portfolios.
18. **Prélèvement à la source** — Withholding tax on rental income. Since 2019, income tax on rent is collected via monthly withholding from salary or separate payment.
19. **Anah** — Agence Nationale de l'Habitat. Government agency providing renovation grants for landlords who rent at regulated prices or for low-income tenants.
20. **Denormandie** — Tax incentive for buy-to-let renovation. Reduction of up to 21% of renovation costs. Applicable in certain qualifying areas (old buildings, renovation > €2,500/m²).

---

### Category: Juridique (~25 terms)

1. **Loi 89-462** — The primary law governing residential leases (6 July 1989). Defines tenant protections, rent rules, lease terms. Reference foundation for all rental law in France.
2. **Loi ALUR** — Accès au Logement et Urbanisme Rénové (2014). Added numerous tenant protections: minimum surfaces, expanded tenant criteria, better notice periods.
3. **Loi ELAN** — Évolution du Logement, de l'Aménagement et du Numérique (2018). Eased some landlord requirements (e.g., electronic notices), adjusted rent control areas.
4. **DPE** — see existing
5. **Diagnostic technique** — Set of mandatory technical reports that must be attached to a lease (DPE, Lead, Asbestos, Electricity, Gas, ERP). Must be provided before signing.
6. **ERP** — État des Risques et Pollutions. Mandatory disclosure of natural, mining, and environmental risks for all property sales and rentals.
7. **Constat de sortie** — Exit inventory comparison. Mandatory when tenant leaves. Must compare with entry inventory. Deductions from deposit require supporting invoices.
8. **Référé gracieux** — Urgent court procedure for disputes that don't require proof. Fast, judge rules without full trial. Used for contested eviction.
9. **Assignation** — Formal legal summons to appear before civil court. Used when a tenant refuses to leave or non-payment becomes a formal legal dispute.
10. **Huissier** — Judicial officer (sergeant) who serves legal notices and executes court decisions (evictions, seizure of assets). Required for formal mise en demeure.
11. **Mise en demeure** — Formal written demand requiring a party to fulfill an obligation (e.g., pay outstanding rent). Creates proof of notification. Step before legal proceedings.
12. **Trouble de voisinage** — Neighbor disturbance. Ground for lease termination if sufficiently serious (noise, harassment, hygiene). Requires documented evidence.
13. **Troubles de jouissance** — Defects affecting the tenant's use of the property (e.g., water outage, heating failure). Landlord's obligation to repair within reasonable time.
14. **Force majeure** — Unforeseeable, irresistible event (pandemic, natural disaster). Can excuse non-performance of contractual obligations. High bar to prove in French courts.
15. **Prescription** — Time limits for legal claims. Civil claims (e.g., unpaid rent) prescribe in 3 years. Landlord must act within this window.
16. **Clause pénale** — Penalty clause. Can be included in a lease but courts can reduce excessive penalties. Cannot be punitive beyond actual damage.
17. **Nullité du bail** — Nullity of a lease. Can occur for illegal clauses (clauses interdites) or lack of required formalities. Effect: lease continues but illegal clause is void.
18. **Résiliation du bail** — Termination of the lease. Can be mutual (convenanted departure) or unilateral (by tenant or landlord with proper notice and cause).
19. **Clause de révision** — Rent review clause (usually tied to IRL). Must be in the lease to allow annual rent increases. Without it, rent cannot be increased.
20. **Encadrement des loyers** — see "zone tendue" and category Location
21. **Recoursellandlord** — Legal actions available to a landlord: injonction de payer (payment order), référé (emergency relief), assignation (full trial).
22. **Saisine du tribunal** — Filing a legal action. For landlord-tenant disputes: Tribunal judiciaire (cases > €10,000) or Juridiction de proximité (≤ €10,000).
23. **Audience** — Court hearing. Tenants and landlords have the right to present their case. Most disputes resolve without reaching a full audience.
24. **Juge des référés** — Emergency judge who can issue quick rulings (ordonnances de référé). Appropriate for clear-cut cases (e.g., non-payment with proof).
25. **Fichage Bancaire** — Recording of unpaid debts (including unpaid rent judgments) in the FICP (Fichier national des incidents de remboursement). Mostly for tenants.

---

### Category: Gestion (~15 terms)

1. **Quittance de loyer** — see existing
2. **Compteur communicant** — Smart meter (Linky/Gazpar). Enables automatic reading of consumption. Useful for charge reconciliation in rental properties.
3. **Régularisation des charges** — Annual reconciliation of estimated vs. actual charges. Landlord must provide tenant with itemized statement within 6 months of year end.
4. **Appels de fonds** — Payment requests sent to tenants for charges, repairs, or other legitimate costs. Must be documented with invoices.
5. **Grand livre comptable** — Detailed accounting record of all income and expenses for a rental property. Required for régime réel tax declaration.
6. **Redevance** — Periodic payment for use of a property or service. Used in some contexts instead of "loyer" for certain types of arrangements.
7. **indexation** — Indexation of rent to a reference index (usually IRL). Automatically adjusts rent annually per the agreed formula.
8. **Reversement de charges** — Rebilling of actual charges from owner to tenant (e.g., after annual reconciliation). Part of charge management.
9. **Budget prévisionnel** — Estimated annual budget for a property. Used to set monthly charge provisions. Compared to actuals at year end.
10. **Travaux de maintenance** — Routine repairs and upkeep. Differ from "grosses réparations" (structural work), which are the owner's responsibility.
11. **Gros œuvre** — Structural work (foundations, load-bearing walls, roof). Owner's full financial responsibility. Distinguished from "menu œuvre" (maintenance).
12. **Menu œuvre** — Minor repair and maintenance work. Tenant responsibility per décret n° 87-713 (replacement of washers, fuses, window glass, etc.).
13. **Provision pour Gros travaux** — Reserve fund for future major repairs (e.g., roof, facade). Not mandatory but recommended for apartment buildings.
14. **Audit énergétique** — Mandatory energy audit for buildings with poor DPE ratings (E, F, G). Required before listing for sale or major renovation. Must be done by a certified auditor.
15. **Carnet d'entretien** — Maintenance log for the property. Mandatory for co-ownerships. Useful for landlords to track all maintenance activity and document decisions.

---

### Category: Investissement (~10 terms)

1. **Rendement brut** — Gross rental yield: (Annual rent ÷ Property price) × 100. Used for quick comparisons. Typical range: 3-8% in France.
2. **Rendement net** — Net rental yield: (Annual rent − Charges − Taxes) ÷ Property price. More accurate than gross. Typical range: 2-6% net.
3. **Cash-flow** — Net monthly cash flow from the property: (Monthly rent − all costs − mortgage payment). Can be positive or negative. Positive cash-flow means the property generates surplus monthly income.
4. **Racheter son crédit** — Refinancing. Replaces existing loan with a new one (better rate, different term). Can release equity for new investments.
5. **Effet de levier** — Leverage effect. Using borrowed money to increase potential return on equity. In France, mortgage leverage historically strong.
6. **SCPI** — Société Civile de Placement Immobilier. Mutual fund for real estate. Allows indirect property investment with smaller capital. Returns typically 4-6% with lower liquidity.
7. **OPCI** — Organisme de Placement Collectif Immobilier. Real estate fund similar to SCPI but with more flexibility and higher minimum investment.
8. **Démembrement** — Bare ownership + usufruct split. Often used for tax optimization: children receive bare ownership, parent retains usufruct (right to use/rent). At-usufruct ends, bare owner full ownership.
9. **Plus-value en nue-propriété** — Gain realized when selling bare ownership. Tax treatment differs from full property sale. Often results in no tax during the naked ownership period.
10. **Assurance PNO** — Propriétaire Non Occupant insurance. Mandatory for landlords in some co-ownerships. Covers civil liability for property damage or injury to third parties.

---

## 4. Glossary SEO Rules

### URL Structure
- Glossary index: `/glossaire-immobilier`
- Individual terms: `/glossaire-immobilier#terme=[slug]` (anchor links to section, not separate pages)
- OR individual pages: `/glossaire-immobilier/[slug]` (preferred for SEO — creates more indexable pages)

**Recommendation:** Individual term pages at `/glossaire-immobilier/[slug]` for top 50 terms, with anchor links for remaining terms on the index page.

### Internal Linking From Glossary
Every term entry should link to:
1. Related glossary terms (internal link)
2. At least 1 relevant blog article (internal link)
3. At least 1 relevant product/tool page (internal link)

**Examples:**
- "Dépôt de garantie" → links to `/blog/depot-garantie-regles-essentielles`, `/outils/calculateur-depot-garantie`
- "IRL" → links to `/blog/revision-loyer-irl-guide-complet`, `/outils/calculateur-irl-2026`
- "Quittance de loyer" → links to `/quittances`, `/blog/modele-quittance-loyer-pdf-gratuit`

### Glossary as Hub
The glossary page should be mentioned in the navigation footer alongside blog, tools, and product pages.

### E-E-A-T for Glossary
- Every term definition should be accurate and cite the relevant law/decree when applicable
- Definitions should be written in plain French, not legal jargon
- Legal definitions should include "Source: [law name]" in small text
- Avoid absolute legal advice — add "Consulter un professionnel du droit pour votre situation" where appropriate

---

## 5. Implementation Checklist for Glossary

- [ ] 100+ terms (current: ~30 — needs expansion)
- [ ] Terms organized by category with clear headings
- [ ] Each term has: definition (2-4 sentences), related terms, related links
- [ ] Search/filter functionality (client-side JavaScript)
- [ ] Category tabs for filtering
- [ ] Alphabetical organization within each category
- [ ] Internal links to blog articles and tool pages
- [ ] External links to official sources (service-public.fr,legifrance.gouv.fr, insee.fr) where relevant
- [ ] JSON-LD: FAQPage schema is NOT needed for glossary (not FAQ format)
- [ ] JSON-LD: Consider BreadcrumbList schema for the glossary index page
- [ ] Mobile-responsive (filter tabs work on mobile)
- [ ] Accessibility: proper heading hierarchy (H1 > H2 > H3 for categories > terms)
