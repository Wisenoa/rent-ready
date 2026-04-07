# Content Strategy — Meta Templates, Header Structure, Internal Linking & Calendar

> This document provides the master content strategy including: (A) meta title/description templates for all page types, (B) header structure guidelines, (C) internal linking strategy documentation, and (D) 6-month content calendar. This is the master SEO playbook for the content team.

---

## A. Meta Title & Description Templates

### Global Rules
- **Title max:** 60 characters
- **Description max:** 155 characters
- **Title format:** `[Primary keyword] — [Benefit or differentiation] | RentReady`
- **Description format:** `[What the page is] + [key differentiator] + [action/trust signal]`
- Always include primary keyword in title and description
- Use `| RentReady` separator consistently
- Use em dash `—` (not hyphen `-`) in titles

---

### Page-Type Templates

#### Homepage
```
Title:       Gestion locative automatisée | RentReady
Description: Quittances conformes, détection des virements, révision IRL automatique. Le pilote des propriétaires bailleurs. Essai gratuit 14 jours.
```

#### Feature Pages (`/quittances`, `/bail`, `/locations`, `/maintenance`)
```
Title:       [Feature Name] — [Key Benefit] | RentReady
             Example: Quittances de loyer — Génération automatique et conforme | RentReady
Description: [What it does in one sentence]. [Key differentiator]. [Trust/CTA signal].
             Example: Générez des quittances de loyer PDF conformes à la loi en 1 clic. Détection automatique des paiements. Portail locataire inclus. Essai gratuit.
```

#### Pricing Page
```
Title:       Tarifs RentReady — [price]/mois, essai gratuit | RentReady
Description: [Key features]. [Price]. [Free trial hook]. Sans engagement.
```

#### Demo Page
```
Title:       Réserver une démo — Découvrez RentReady | RentReady
Description: Découvrez toutes les fonctionnalités en 15 minutes avec notre équipe. Gratuit, sans engagement. Réservez votre créneau.
```

#### Blog Index
```
Title:       Blog Gestion Locative — Conseils pour Propriétaires | RentReady
Description: Guides, conseils et actualités pour propriétaires bailleurs: gestion locative, quittances, révision IRL, fiscalité. Publication hebdomadaire.
```

#### Blog Article
```
Title:       [Article Title] — Blog RentReady
Description: [Article excerpt, max 155 chars — query answer + value proposition]
```

#### Outil/Tool Page
```
Title:       [Tool Name] — Outil gratuit [RentReady]
Description: [What it does]. [Why it's free]. [Key constraint].
             Example: Calculez le montant légal du dépôt de garantie. Gratuit, sans inscription. Simulateur basé sur la loi de 1989.
```

#### Glossary Index
```
Title:       Glossaire Immobilier — Définitions Location et Investissement | RentReady
Description: Plus de 100 définitions pour propriétaires bailleurs. IRL, DPE, dépôt de garantie... Trouvez le terme que vous cherchez.
```

#### Glossary Term (individual page)
```
Title:       [Term] — Définition Glossaire Immobilier | RentReady
Description: [Plain-language definition, 140-155 chars].
```

#### Legal Pages (`/cgu`, `/mentions-legales`, `/politique-confidentialite`)
```
Title:       [Page Name] — RentReady
Description: [Brief description of document purpose and company legal info].
```

#### City Page
```
Title:       Gestion locative à [City] — Logiciel pour propriétaires | RentReady
Description: Logiciel de gestion locative à [City]. Quittances, suivi loyers, conformité 2026. Essai gratuit.
```

---

## B. Header Structure Guidelines

### Principles
1. **One H1 per page** — The page title, identical to or a close variant of the meta title
2. **H2 sections** — Major content sections, descriptive and keyword-inclusive where natural
3. **H3 subsections** — Only when needed within an H2 section (max 2 levels deep)
4. **No skip levels** — Never go from H1 directly to H3

### Header Patterns by Page Type

#### Feature Page Headers
```
H1: [Feature Name] — [Key Benefit]
H2: Comment ça marche? (How it works)
H2: [Feature 1]
H3: [Sub-feature]
H2: [Feature 2]
H2: Ce que dit la loi (Legal compliance)
H2: Questions fréquentes (FAQ)
H2: Essayez [Feature] gratuitement → (CTA)
```

#### Blog Article Headers
```
H1: [Article Title]
H2: Introduction (optional — no keyword needed)
H2: [Section 1]
H2: [Section 2]
H2: [Section 3]
H2: Conclusion / Récapitulatif
H2: Questions fréquentes
  H3: [FAQ Question 1]
  H3: [FAQ Question 2]
H2: Articles connexes (Related — internal links)
```

#### Outil Page Headers
```
H1: [Tool Name] — Gratuit, [Key Constraint]
H2: [Calculator/Form Section] (the interactive element)
H2: Comment [action]? (How it works)
H2: [Calculated Result] : Explication (Result explanation)
H2: [Legal Framework / Règles]
H2: Questions fréquentes
H2: Ressources complémentaires (Related content)
H2: [Automatisez avec RentReady] → (CTA)
```

#### Glossary Index Headers
```
H1: Glossaire Immobilier — Définitions Location et Investissement
H2: [bar with search/filter]
H2: 📋 Location et Bail (category heading)
  [terms]
H2: 💰 Fiscalité
  [terms]
H2: ⚖️ Juridique
  [terms]
H2: 🏠 Gestion
  [terms]
H2: 📈 Investissement
  [terms]
H2: Questions fréquentes
H2: Envie d'en savoir plus? (CTA to blog, signup)
```

### Header Keyword Integration
- Primary keyword should appear in H1 AND at least one H2
- H2 headings should be descriptive action statements, not just labels
- Avoid generic H2s like "Fonctionnalités" or "Caractéristiques" — use specific benefit statements
- Good: "Générez des quittances en 1 clic"
- Bad: "Fonctionnalités"

---

## C. Internal Linking Strategy

### Authority Flow Architecture

```
                    HOMEPAGE (highest authority)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   /pricing          /blog            /glossaire-immobilier
   (commercial)     (content hub)     (reference hub)
        │                 │                 │
        ▼                 ▼                 ▼
   /quittances       /article-1        /term-[slug]
   /bail             /article-2        (individual term pages)
   /locations        /article-3
   /maintenance         │
   /gestion-locative    ▼
                      /article-N
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
       /outils/      /outils/      /outils/
    modele-bail   lettre-relance calculateur-depot
            │             │             │
            └─────────────┴─────────────┘
                          │
                          ▼
                    /register (conversion)
```

### Linking Rules by Source Page

| Source Page | Must Link To | Anchor Text Guidance |
|------------|-------------|---------------------|
| Homepage | /pricing, /quittances, /blog | Use feature names in CTAs |
| /pricing | /register, /demo | Price anchors ("15€/mois"), action anchors |
| /quittances | /register, /blog, /glossaire | Action: "générer des quittances" |
| /bail | /register, /blog, /glossaire | Topic anchors: "gestion des baux" |
| /locations | /register, /blog | "suivi des locations", "tableau de bord" |
| /maintenance | /register, /glossaire | "suivi maintenance" |
| /blog/[slug] | 2+ articles, 1 tool page, /quittances | Contextual in-body links |
| /glossaire | /blog, /quittances, /bail, /locations | Contextual term links |
| /outils/[tool] | /blog (related article), /glossaire (term) | "Calculez X" → tool link |

### Anchor Text Rules
- Never use: "cliquez ici", "en savoir plus", "ici", bare URLs
- Always use: descriptive phrase with keyword where natural
- Good: `<Link href="/quittances">générez des quittances PDF</Link>`
- Bad: `<Link href="/quittances">en savoir plus</Link>`
- Product CTAs can be: "Essayez gratuitement", "Commencez votre essai"

### Contextual In-Content Linking Pattern
In every blog article, include 3-5 contextual links:
1. In the intro: link to a relevant tool page
2. In a mid-section: link to a glossary term
3. In the FAQ: link to another article or tool
4. In the CTA section: link to the product signup page

### Footer Links
- All marketing pages must share the same footer structure
- Footer provides baseline internal linking equity for all pages
- Legal pages must appear in footer (E-E-A-T trust signal)

---

## D. 6-Month Content Calendar (6-Month SEO Content Plan)

### Publishing Cadence
- **Blog articles:** 3 per week (Monday / Wednesday / Friday)
- **Tool pages:** 2-4 new tool pages per month
- **Glossary terms:** 20 new terms per month (build to 100+ by month 6)
- **City pages:** As many as warranted by cities.json data

---

### Month 1 (April 2026) — Foundation

**Goal:** Establish core informational content + launch initial template pages

**Week 1:**
- [EXISTING] 6 blog articles (already live)
- Publish Article 7: "Modèle de quittance de loyer PDF gratuit"
- Publish Article 8: "Lettre de relance pour loyer impayé"

**Week 2:**
- Publish Article 9: "Charges locatives : le guide complet du décompte annualisé"
- Publish Article 10: "Assurance loyer impayé (GLI) : protéger vos revenus"
- Create `/outils/modele-quittance-loyer-pdf` content (SEO brief complete)
- Create `/outils/lettre-relance-loyer` content (SEO brief complete)

**Week 3:**
- Publish Article 11: "État des lieux : comment éviter les litiges"
- Publish Article 12: "Diagnostic DPE : ce que les propriétaires doivent savoir"
- Create `/outils/calculateur-depot-garantie` content (SEO brief complete)
- Create `/outils/calculateur-irl-2026` content (SEO brief complete)
- Verify/update glossary page (target: 40+ terms from existing + new additions)

**Week 4:**
- Publish Article 13: "Révision de loyer IRL : le trimestriel à suivre"
- Publish Article 14: "Garantie Visale : l'alternative gratuite à la caution"
- Create first city page (Paris as priority — `/gestion-locative/paris`)
- Update existing legal pages with enhanced internal links

**Month 1 SEO Metrics Target:**
- Indexed pages: +20 net new
- Blog articles: 8 published (6 existing + 2 new)
- Tool pages: 2 new functional tool pages
- Glossary terms: 40+ terms

---

### Month 2 (May 2026) — Content Expansion

**Goal:** Build informational authority, add FAQ content

**Weeks 1-4 Articles:**
- Article 15: "Loi ALUR 2026 : ce qui a changé pour les propriétaires"
- Article 16: "Qu'est-ce que la SCI ? Avantages et inconvénients"
- Article 17: "LMNP vs LMP : quel statut choisir pour la location meublée ?"
- Article 18: "Comment déclarer ses revenus locatifs aux impôts"
- Article 19: "Réparation locative : qui paie quoi ? Menu vs gros œuvre"
- Article 20: "Comment trouver un bon locataire : le dossier de location parfait"
- Article 21: "Copropriété : charges de copropriété et récupérabilité"
- Article 22: "Investissement locatif : les 10 erreurs à éviter"
- Article 23: "Encadrement des loyers : dans quelles villes s'applique-t-il ?"
- Article 24: "Plus-value immobilière : calcul et exonérations"
- Article 25: "Bail de colocation : règles spécifiques et modèles"
- Article 26: "Rendement locatif : comment le calculer et l'optimiser"

**Month 2 Tool/Glossary:**
- Add 20 new glossary terms (fiscalité category focus)
- Create `/outils/calculateur-rendement-locatif` SEO content
- Launch city pages for top 10 French cities (Lyon, Marseille, Toulouse, Nice, Nantes, Strasbourg, Montpellier, Bordeaux, Rennes, Lille)
- Add FAQ sections to all existing tool pages with FAQPage JSON-LD

---

### Month 3 (June 2026) — Topical Authority

**Goal:** Build pillar pages and topic clusters

**Pillar Page 1:** "Guide Complet de la Gestion Locative pour Propriétaires"
- Publish at: `/blog/guide-gestion-locative-proprietaire`
- Links to all individual topic articles
- Target keyword: "guide gestion locative", "gestion locative particulier"

**Pillar Page 2:** "Loyers Impayés : La Procédure Complète"
- Publish at: `/blog/loyers-impayes-procedure-complete`
- Links to: Article 1, Article 8, Article 10
- Target keyword: "procédure loyer impayé", "recouvrement loyer"

**Articles:**
- Article 27: "Comment fonctionne le fichier des impayés ?"
- Article 28: "Résiliation de bail : модели et procédures"
- Article 29: "Travaux de rénovation : quelles aides pour les propriétaires ?"
- Article 30: "Fiscalité de la location meublée : le guide complet"
- Article 31: "Gerer la fin du bail : préavis, état des lieux, restitution"
- Article 32: "Location saisonnière vs location longue durée : сравнение"

---

### Month 4 (July 2026) — Programmatic SEO Preparation

**Goal:** Identify additional page families for programmatic SEO

**Focus Areas:**
- Identify 10+ city-specific landing pages
- Identify 10+ template type pages for programmatic creation
- Build out calculator coverage (add: calculateur-charges, simulateur-cashflow)
- Glossary expansion to 80+ terms

**Articles:**
- Article 33: "Comment organiser la gestion locative de plusieurs biens"
- Article 34: "Gestion locative en SCI : avantages et contraintes"
- Article 35: "Assurance propriétaire non occupant : guide complet"
- Article 36: "Maintenance locative : prévenir plutôt que guérir"
- Article 37: "Charges récupérables : la liste complète 2026"
- Article 38: "Règles de hausse de loyer : encadrement et sanctions"

---

### Month 5 (August 2026) — Conversion Optimization

**Goal:** Optimize conversion elements, add testimonials and case studies

**Content:**
- Case Study 1: "Comment M. Dupont a réduit son temps de gestion locative de 3h/semaine à 20 minutes" (fictional but realistic)
- Case Study 2: "Gestion locative d'un portefeuille de 5 biens avec RentReady"
- Testimonial 1: From a landlord using RentReady for 6 months+
- Testimonial 2: From a property manager (if applicable)

**Pages to Optimize:**
- Review and optimize all existing tool pages for conversions
- Add more CTAs to blog articles (inline, not just end-of-article)
- Optimize pricing page with better price anchoring
- Verify all tool pages have functioning calculators

---

### Month 6 (September 2026) — Authority & Links

**Goal:** Build external link acquisition strategy, E-E-A-T signals

**Content:**
- Publish Pillar Page 3: "Révision IRL : Tout Savoir sur l'Indice de Référence des Loyers"
  - Links to: Article 2, calculateur IRL tool, blog articles on rent review
  - Target keyword: "IRL indice référence loyers", "révision loyer INSEE"
- Publish Article 39: "Comment devenir un landlord moderne : outils et stratégies"
- Publish Article 40: "L'avenir de la gestion locative : tendances et innovations"

**Link Building Targets:**
- Submit sitemap to Google Search Console
- Register on Google Business Profile (if service-area business)
- Start directory submissions (legal directories, real estate portals)
- Identify 3-5 guest post opportunities on French real estate blogs

**Month 6 SEO Metrics Target:**
- Total indexed pages: 100+
- Blog articles: 40+
- Tool pages: 6+
- Glossary terms: 80+
- City pages: 15+

---

## E. Content Brief Template (For All Future Articles)

```
---
### Article [N]
**Slug:** [url-safe-slug]
**Title:** [SEO-optimized title]
**Meta Title:** [50-60 chars — Primary keyword + "— Blog RentReady"]
**Meta Description:** [140-155 chars]
**Target Keywords:** [5-8 keywords]
**Buyer Journey:** [TOFU / MOFU / BOFU]
**H1:** [Exact title or close variant]
**Target Intent:** [Informational / Commercial / Transactional]
**Content Outline:**
1. **Intro** (150 words): [Hook + problem + article promise]
2. **[Section 2]** ([N] words): [Topic coverage]
3. **[Section 3]** ([N] words): [Topic coverage]
4. **[Section 4]** ([N] words): [Topic coverage]
5. **[Section 5]** ([N] words): [Topic coverage]
6. **Conclusion** (100 words): [Recap + CTA]
7. **FAQ** (5 questions): [Common related questions]
8. **Internal Links**: [List specific URLs + anchor text]
9. **CTA**: [Product CTA tied to article topic]
**Schema:** [Article / FAQPage / HowTo — which applies]
**Priority:** [High / Medium / Low]
---
```
