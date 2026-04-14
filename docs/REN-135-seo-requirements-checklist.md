# SEO Requirements Checklist for Product Specs
**Issue:** REN-135 | **Author:** Product Manager | **Date:** 2026-04-13
**Status:** COMPLETE

---

## 1. SEO Requirements Checklist — Every Feature Spec Must Answer

Before any feature or page is built, the PM (Product Manager) must complete this checklist and attach it to the feature spec. Engineers implement; PM owns the SEO spec.

### Pre-Build SEO Requirements (must be answered before spec is final)

- [ ] **Target keyword** — Primary keyword this page/feature targets (exact match preferred, partial acceptable)
- [ ] **Search intent** — One of: Informational / Commercial / Transactional / Navigational
- [ ] **Page type** — One of: Product page / Feature page / Tool page / Template page / Blog article / Comparison page / City page / Glossary page / Landing page
- [ ] **Meta title template** — e.g., `"{Feature Name} — {Value Prop} | RentReady"` (max 60 chars)
- [ ] **Meta description** — Draft of 150-160 char description with primary keyword included
- [ ] **Unique URL structure** — e.g., `/outils/{feature-name}` or `/blog/{slug}` — must be defined before build
- [ ] **Canonical URL** — What is the canonical version of this URL (self-referencing unless paginated)
- [ ] **Indexability** — Should this page be indexed by Google? (Yes/No — and why if No, e.g., app pages, login, dashboard)
- [ ] **Schema markup** — Which Schema.org type applies? (Article, FAQPage, HowTo, WebApplication, Product, LocalBusiness, etc.)
- [ ] **Internal linking opportunities** — Which existing pages should link to this new page? (minimum 3 links from high-authority pages)
- [ ] **External linking** — Does this page need to link to authoritative external sources (e.g., government sites, INSEE for IRL data)?
- [ ] **Content length guidance** — Target word count: Informational (1200+ words), Commercial (800-1200 words), Transactional (400-800 words)
- [ ] **Heading structure (H1/H2)** — Draft H1 (contains keyword) and at least 3 H2s planned
- [ ] **People Also Ask / FAQ targets** — List 3-5 question queries this page should answer for featured snippet eligibility
- [ ] **Related long-tail keywords** — 5-10 related search terms to weave into the page naturally

### Post-Build SEO Checklist (before shipping)

- [ ] Title tag matches spec template
- [ ] Meta description includes keyword and is 150-160 chars
- [ ] URL is correct and matches spec
- [ ] H1 contains target keyword
- [ ] At least 3 H2s present and follow keyword variation strategy
- [ ] Schema markup implemented and validated (use Google's Rich Results Test)
- [ ] Internal links from at least 3 other pages pointing here
- [ ] No duplicate content issues (copyscape or similar check for content pages)
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Mobile readability verified
- [ ] Image alt text filled in on all images
- [ ] XML sitemap updated (if indexable page)
- [ ] Canonical tag correct
- [ ] No noindex accidentally applied

---

## 2. Keyword-to-Feature Mapping (Top 20 Target Keywords)

Mapping the 20 highest-value keywords from the SEO strategy (seo-keyword-strategy.md) to specific pages/features in the product:

| # | Target Keyword | Est. Volume | Intent | Page Type | Feature/Page | URL |
|---|---|---|---|---|---|---|
| 1 | gestion locative | 18,000/mo | Informational | Pillar | Main marketing page | /gestion-locative |
| 2 | quittance de loyer | 14,800/mo | Transactional | Tool | Quittance generator | /outils/quittance-loyer-pdf |
| 3 | bail location | 12,100/mo | Commercial | Template | Lease templates hub | /outils/modele-bail-location |
| 4 | état des lieux | 9,900/mo | Informational | Template | État des lieux tool | /etat-des-lieux |
| 5 | logiciel gestion locative | 8,100/mo | Commercial | Product | Homepage / pricing | / |
| 6 | quittance de loyer gratuit | 6,600/mo | Transactional | Tool | Free quittance tool | /outils/quittance-loyer-pdf-gratuit |
| 7 | révision loyer IRL | 5,400/mo | Transactional | Calculator | IRL calculator | /outils/calculateur-irl-2026 |
| 8 | bail meublé | 2,900/mo | Informational | Template | Bail meublé template | /bail-meuble |
| 9 | gestion locative paris | 2,900/mo | Commercial | City | Paris city page | /gestion-locative/paris |
| 10 | lettre relance loyer | 1,100/mo | Transactional | Template | Relance letter tool | /outils/lettre-relance-loyer |
| 11 | dépôt de garantie | 1,300/mo | Informational | Calculator | Deposit calculator | /outils/calculateur-depot-garantie |
| 12 | préavis locataire | 2,200/mo | Informational | Template | Préavis template hub | /conge-locataire |
| 13 | modèle bail gratuit | 3,600/mo | Transactional | Template | Free bail template | /outils/modele-bail-gratuit |
| 14 | Différence bail meublé/vide | 1,900/mo | Informational | Blog | Comparison article | /blog/difference-bail-meuble-vide |
| 15 | loi alur propriétaire | 2,900/mo | Informational | Blog | Alur guide | /blog/loi-alur-guide-complet |
| 16 | déclaration revenus fonciers | 4,400/mo | Informational | Blog | Tax guide | /blog/revenus-fonciers-guide-2042 |
| 17 | simulateur rentabilité | 1,900/mo | Transactional | Calculator | ROI calculator | /outils/simulateur-rentabilite |
| 18 | glossaire gestion locative | — | Informational | Glossary | Glossary hub | /glossaire-immobilier |
| 19 | modèle quittance word | 880/mo | Transactional | Template | Word quittance | /outils/modele-quittance-word |
| 20 | assurance loyer impayé | 1,900/mo | Commercial | Blog | GLI guide | /blog/assurance-loyer-impaye |

**Note:** Keywords 1-5 are "pillar" pages — these must exist before cluster pages can link to them. Prioritize building these first.

---

## 3. SEO-Opportunity Features in the Backlog

Based on the product roadmap and SEO keyword analysis, the following planned features have the highest SEO potential:

### High SEO Potential (implement in V2+)

| Feature | SEO Rationale | Keyword Opportunity | Page Type |
|---|---|---|---|
| Rent revision calculator (IRL) | High commercial intent, recurring annual search spike | "révision loyer IRL 2026", "calcul augmentation loyer" | Calculator |
| Rent receipt generator (PDF, no signup) | Highest volume "quittance" keyword, zero-friction lead gen | "quittance de loyer gratuit", "modèle quittance PDF" | Tool/Generator |
| Lease template library | Multi-template family covers ~15 keyword clusters | "modèle bail location gratuit", "bail meublé modèle" | Template hub |
| État des lieux generator | Strong informational intent, seasonal (moving season) | "état des lieux sortie", "modèle état des lieux" | Template |
| Late payment letter templates | High transactional intent, legal-adjacent | "lettre relance loyer impayé", "modèle mise en demeure" | Template |
| Deposit return calculator | Common landlord question, clear tool value | "dépôt de garantie restitution délai", "calcul dépôt garantie" | Calculator |
| Tenant payoff letter | Low competition, specific legal query | "lettreSolde de tout compte locataire" | Template |
| Rent increase notice | IRL-linked, annual search event | "augmentation loyer IRL modèle", "lettre révision loyer" | Template |
| Rental profitability calculator | Investment-focused audience, high CPC potential | "simulateur rentabilité locative", "rendement investissement locatif" | Calculator |
| City-specific landing pages | Local SEO, lower competition | "gestion locative lyon", "gestion locative toulouse" | City page |

### Medium SEO Potential (V3+ or content layer)

| Feature | SEO Rationale | Notes |
|---|---|---|
| Maintenance request portal | Content hub opportunity | "demande d'intervention urgence", "faire constat dégât" |
| Lease renewal workflow | Keyword: "renouvellement bail" | Blog + template combo |
| Owner dashboard with analytics | "tableau de bord propriétaire" | High commercial intent |
| Multi-property portfolio view | "gestion patrimoine immobilier" | Links to financial tools |
| Rent insurance guide (GLI) | "assurance loyer impayé" | Comparison/educational content |

### Already Implemented (SEO-validated)

| Feature | SEO Status | Notes |
|---|---|---|
| Quittance PDF generation (REN-64) | Live — /quittance | Target: "quittance de loyer" primary keyword |
| Onboarding wizard (REN-63) | Live — /onboarding | Funnel page, noindex by default |
| Dashboard | Live — /dashboard | App page, noindex |

---

## 4. SEO Review Gate — Process for Adding SEO to Feature Specs

### When does the SEO review gate apply?

Every new feature, page, or significant content piece must pass through the SEO review gate before engineering is assigned.

### Gate Steps:

**Step 1 — PM completes SEO spec section (before spec review meeting)**
- Fill out all 15 items in Section 1 (Pre-Build SEO Requirements)
- Attach keyword mapping (which keyword this serves)
- Identify internal link sources (which pages will link to this new page)

**Step 2 — SEO review (PM + SEO lead or CTO)**
- Verify keyword choice is aligned with content strategy (avoid cannibalization)
- Validate URL structure with existing pages
- Check that no existing page already targets the same keyword
- Validate schema markup choice
- Flag any thin-content risk (pages with <300 words of original content are not acceptable)

**Step 3 — Engineering implements with SEO checklist**
- Engineer references SEO checklist as acceptance criteria
- PM's pre-build spec becomes part of the engineering ticket

**Step 4 — Pre-launch SEO sign-off (PM reviews before go-live)**
- PM verifies post-build checklist (Section 1, Part 2) is complete
- Screenshot evidence required for: title tag, meta description, H1, schema markup
- If post-build items fail, page does not ship

### SEO Review Gate Exemptions

- App/dashboard pages (non-indexable by design)
- Transactional flows (e.g., checkout, billing) — noindex by default
- Legal/privacy pages — noindex

---

## 5. SEO Requirements Template (to embed in every feature spec)

```markdown
## SEO Specification

### Target Keyword
[Primary keyword]

### Search Intent
[Informational / Commercial / Transactional / Navigational]

### Page Type
[Product / Feature / Tool / Template / Blog / Comparison / City / Glossary / Landing]

### URL
[Unique URL — must be defined before build]

### Title Tag Template
`[Title] | RentReady` (max 60 chars)

### Meta Description
[Draft 150-160 char description with keyword]

### Schema.org Type
[Article / FAQPage / HowTo / WebApplication / Product / etc.]

### Internal Link Sources (min 3)
1. [Page name] — [URL] — anchor text: "[anchor]"
2. ...
3. ...

### Heading Structure
- H1: [must contain keyword]
- H2: [section 1], [section 2], [section 3]

### People Also Ask Targets (3-5)
1. [Question 1]
2. [Question 2]
3. [Question 3]

### Long-tail Keywords (5-10)
1. [keyword 1]
2. [keyword 2]
...
```

---

## 6. Gap Analysis — Keywords with No Current Page Targeting

Based on the 500+ keyword universe in seo-keyword-strategy.md, these high-opportunity keywords currently have **no page targeting them** in the product:

| Keyword | Volume | Priority | Recommended Action |
|---|---|---|---|
| quittance de loyer gratuit sans inscription | 880/mo | HIGH | Build free tool page at /outils/quittance-gratuite |
| calculateur depot de garantie 2026 | 1,300/mo | HIGH | Build calculator at /outils/calculateur-depot |
| lettre relance loyer 3eme exemple | 320/mo | MEDIUM | Expand /outils/lettre-relance-loyer with 3 templates |
| bail mobilite modele gratuit | 720/mo | HIGH | Build /bail-mobilite template page |
| glossaire bail location | — | MEDIUM | Expand /glossaire-immobilier with 20+ more terms |
| simulateur rentabilite locative | 1,900/mo | HIGH | Build calculator at /outils/simulateur-rentabilite |
| zone tendue liste villes | 1,600/mo | MEDIUM | Add to /blog/encadrement-loyers page |
| modele etat des lieux vierge | 2,200/mo | HIGH | Build /etat-des-lieux template page |
| declaration revenus fonciers 2044 | 4,400/mo | HIGH | Build /blog/revenus-fonciers guide |
| lmnp amortissement expliqu | 1,900/mo | MEDIUM | Build /blog/lmnp-amortissement guide |

---

## 7. Keyword Cannibalization Risks

The following keyword clusters are at risk of cannibalization — multiple pages targeting the same keyword:

| Keyword | Conflicting Pages | Resolution |
|---|---|---|
| "quittance de loyer" | /quittance (app) vs /outils/quittance-loyer-pdf (marketing) | App page must be noindex; only marketing tool page targets keyword |
| "gestion locative" | /homepage vs /gestion-locative pillar page | Homepage title/meta should NOT target "gestion locative" — defer to pillar |
| "bail location" | Multiple template pages possible | One hub page (/bail-location) that links to all bail variants |
| "modle quittance" | /recu-loyer vs /quittance | Consolidate to one page targeting the primary keyword |

---

## 8. Report Summary

- **SEO requirements checklist:** 15-item Pre-Build + 15-item Post-Build checklist (Section 1) — ready to attach to all future feature specs
- **Keyword mapping:** Top 20 keywords mapped to specific pages/features (Section 2)
- **SEO-opportunity backlog:** 10 high-potential features identified for V2+ with rationale (Section 3)
- **SEO review gate:** 4-step process with PM ownership — no feature ships without SEO sign-off (Section 4)
- **SEO spec template:** Copy-paste section for every feature spec (Section 5)
- **Keyword gaps:** 10 high-volume keywords with no current page — recommend for content roadmap (Section 6)
- **Cannibalization risks:** 4 clusters flagged — requires cleanup as pages are built (Section 7)

**Owner:** Product Manager
**Next step:** PM shares this document with CTO/engineering. Every new feature spec after today includes Section 5 (SEO spec template) as mandatory component.
