# SEO-Optimized Page Architecture — RentReady
## Product Designer Deliverable — REN-157

> Design the UX/UI layer that supports SEO success — every page must be both user-friendly AND search-engine friendly.

---

## 1. SEO Page Template System

### 1.1 Template Classification

The site has 6 distinct page typologies, each with specific SEO requirements:

| Page Type | Route Pattern | Target Intent | SEO Priority | Indexable |
|---|---|---|---|---|
| **Homepage** | `/` | Brand + conversion | P0 | Yes |
| **Feature Pages** | `/features`, `/gestion-locative`, `/quittances` | Commercial investigation | P1 | Yes |
| **Use-case Pages** | `/locations`, `/bail/[ville]` | Commercial investigation | P1 | Yes |
| **Pricing** | `/pricing` | Transactional/commercial | P1 | Yes |
| **Blog Articles** | `/blog/[slug]` | Informational | P1 | Yes |
| **Template Pages** | `/templates/[type]` | Informational + tool | P1 | Yes |
| **Tool/Calculator** | `/outils/[outil]` | Informational + tool | P2 | Yes |
| **Glossary** | `/glossaire-immobilier` | Informational | P2 | Yes |
| **Legal Pages** | `/cgu`, `/mentions-legales` | Trust/navigation | P3 | Partial |
| **Dashboard** | `/(dashboard)/*` | Logged-in users | — | No |

---

## 2. Homepage Template

**Route:** `/`

### SEO Structure
```
<div role="banner">  ← skip to content link
<header>            ← nav
<main id="main">
  <section aria-label="Hero">
    H1: "Gestion locative automatisée pour propriétaires bailleurs"
    Subhead: value prop
    2× CTA: "Essai gratuit" (primary) + "Voir la démo" (secondary)
  </section>
  <nav aria-label="Fil d'Ariane"> ← BreadcrumbList schema
  <section aria-label="Preuve sociale">
  <section aria-label="Fonctionnalités">
  <section aria-label="Comparaison">
  <section aria-label="Témoignages">
  <section aria-label="Tarifs">
  <section aria-label="FAQ">
  <section aria-label="CTA final">
</main>
<footer>           ← comprehensive internal links
```

### H1/H2/H3 Hierarchy
- H1: ONE per page, `<h1>Gestion locative automatisée pour propriétaires bailleurs</h1>`
- H2: Section headers (4–6 per page)
- H3: Subsection support within sections

### Breadcrumb Position
- Breadcrumbs appear AFTER the hero, BEFORE any main content
- Schema: `BreadcrumbList` in JSON-LD `<script type="application/ld+json">`
- Breadcrumb trail: `Accueil > [Section] > [Page]`

### CTA Placement
1. **Hero CTA** — primary conversion, high weight
2. **Sticky header CTA** — appears on scroll-down (smart sticky)
3. **Inline section CTAs** — after each feature cluster
4. **Exit-intent CTA** — on page leave (blog only)
5. **Bottom-of-page CTA** — always present before footer

### Trust Signals Position
- Immediately after hero: social proof bar (logos, ratings, stats)
- After features: testimonial cards
- Pricing section: compliance badges (CNIL, Factur-X, DSP2)
- Footer: legal mentions, security badges

---

## 3. Feature Page Template

**Routes:** `/features`, `/gestion-locative`, `/quittances`, `/locations`, `/entretien`

### Structure
```
<header>           ← GlassNav with sticky CTA
<main id="main">
  <nav aria-label="Fil d'Ariane"> ← BreadcrumbList
  <section class="hero-feature">
    H1: Feature name + benefit-led headline
    Subhead: How it solves the problem
    Primary CTA + secondary CTA
    Hero visual (screenshot/dashboard mockup)
  </section>
  <section class="how-it-works">
    H2: "Comment ça marche"
    3-step visual workflow (icon + step + description)
  </section>
  <section class="feature-benefits">
    H2: "Ce que vous gagnez"
    Bento grid or 3-column benefit cards
  </section>
  <section class="social-proof">
    H2: "Ils nous font confiance"
    2–3 testimonial cards with photo, name, role
  </section>
  <section class="faq">
    H2: "Questions fréquentes"
    Accordion component (collapsible)
  </section>
  <section class="bottom-cta">
    H2: "Essayez gratuitement"
    Trial CTA + feature summary
  </section>
</main>
<footer>
```

### H1/H2/H3 Structure
- H1: Feature name as benefit, e.g., `"Quittances de loyer automatiques et conformes"`
- H2: Section titles — "Comment ça marche", "Avantages", "Témoignages", "FAQ"
- H3: FAQ questions, step titles

### Breadcrumb
`Accueil > Fonctionnalités > [Feature Name]`

### Sidebar for Internal Links
- Feature pages do NOT have a sidebar (single-column layout, no sidebar)
- Instead, use a **Related Articles** section at the bottom
- Cross-link to 2–3 related template/tool pages

### CTA Placement
- Hero: primary "Essai gratuit 14j"
- After How-it-works: secondary "Commencer maintenant"
- Bottom: final CTA with feature recap

---

## 4. Pricing Page Template

**Route:** `/pricing`

### Structure
```
<header>
<nav aria-label="Fil d'Ariane"> ← BreadcrumbList
<section class="pricing-hero">
  H1: "Tarifs transparents, sans engagement"
  Subhead: pricing value prop
</section>
<section class="pricing-cards">
  H2: "Choisissez votre formule"
  [Free Trial card] [Pro card — highlighted] [Enterprise card]
  Each card: price, period, feature list, CTA
</section>
<section class="feature-comparison">
  H2: "Comparaison complète"
  Table: Feature × Pricing tier
</section>
<section class="pricing-faqs">
  H2: "Questions fréquentes sur les tarifs"
  Accordion FAQ
</section>
<section class="pricing-cta">
  H2: "Prêt à commencer ?"
  CTA: trial button
</section>
```

### H1/H2/H3
- H1: `"Tarifs — Logiciel gestion locative 15€/mois | RentReady"`
- H2: Section headers for each pricing element
- H3: Card titles, FAQ questions

### Breadcrumb
`Accueil > Tarifs`

### CTA Placement
- Each pricing card has its own CTA button
- Bottom section has final conversion CTA

---

## 5. Blog Article Template

**Routes:** `/blog/[slug]`

### Structure
```
<header> ← GlassNav
<main id="main">
  <nav aria-label="Fil d'Ariane"> ← BreadcrumbList
  <article>
    <header class="article-header">
      Category badge
      H1: Article title (target keyword in H1)
      Meta: author + date + read time
      Featured image
    </header>
    <div class="article-layout">
      <aside class="article-sidebar">
        Table of contents (sticky, generated from H2/H3)
        Share buttons
        Related articles (2–3 links)
      </aside>
      <div class="article-body">
        Reading progress indicator (top bar)
        Article content with:
          - H2/H3 structure (keyword-rich)
          - In-content CTAs (inline, contextual)
          - Internal links (styled as highlighted text links)
          - Image alt text (descriptive, keyword-friendly)
          - Quote/callout blocks
        Author bio card (at bottom)
      </div>
    </div>
    <footer class="article-footer">
      Related articles section (6 cards grid)
      CTA banner (inline, non-intrusive)
      Comments section (if applicable)
    </footer>
  </article>
</main>
<footer>
```

### H1/H2/H3
- H1: Exact article title (target keyword present)
- H2: Major sections
- H3: Subsections

### Reading Progress
- Thin progress bar at top of viewport (fixed position)
- Visual feedback on scroll depth
- Reduces bounce rate (SEO signal)

### Table of Contents Sidebar
- Sticky on desktop (position: sticky)
- Auto-generated from H2/H3 in article
- Hash-link anchors for each section
- Active section highlighting on scroll

### Internal Linking UX
- In-content links: styled with subtle underline + color
- Related Articles section at bottom: 3-column card grid
- CTAs: contextual inline CTAs within article body (non-modal, text-link style)

### Mobile SEO
- Single column layout (sidebar collapses to top-of-content ToC)
- Font size: 18px body, 1.7 line-height
- Max-width: 680px for reading column
- Touch targets: minimum 44×44px

---

## 6. Template Page Template

**Routes:** `/templates/[type]` (bail-vide, bail-meuble, bail-commercial, etc.)

### Structure
```
<header>
<nav aria-label="Fil d'Ariane"> ← BreadcrumbList
<main id="main">
  <section class="template-hero">
    H1: Template name + value proposition
    "Ce modèle est utilisé par X propriétaires"
    Preview thumbnail
  </section>
  <div class="template-layout">
    <div class="template-preview">
      Document preview component
      Live preview or PDF embed
    </div>
    <div class="template-sidebar">
      H2: "Caractéristiques du modèle"
      Feature checklist
      Trust badges: "Vérifié juridiquement", "Mis à jour mensuellement"
      Stats: "X téléchargements", "X propriétaires l'utilisent"
      Primary CTA: "Télécharger le modèle gratuit"
      Secondary CTA: "Créer un bail en ligne"
    </div>
  </div>
  <section class="template-guide">
    H2: "Guide d'utilisation"
    Step-by-step explanation (H3 per step)
    FAQ accordion
  </section>
  <section class="related-templates">
    H2: "Autres modèles utiles"
    3-column related template cards
  </section>
  <section class="template-cta">
    CTA: trial signup
  </section>
</main>
<footer>
```

### H1/H2/H3
- H1: `"Modèle de bail de location vide | Téléchargement gratuit"`
- H2: Sections
- H3: Subsections within guide

### Breadcrumb
`Accueil > Modèles > [Template Category] > [Template Name]`

### Internal Linking
- Sidebar links to related templates
- In-guide links to glossary terms
- Bottom section cross-links to 2–3 other templates

### Content-to-Product Flow
- Primary CTA: Download template (lead capture: email required)
- Secondary CTA: "Create lease online" → product signup
- Related templates drive internal linking and page depth

---

## 7. Tool/Calculator Page Template

**Routes:** `/outils/[outil]` (calculateur-irl-2026, calculateur-depot-garantie, etc.)

### Structure
```
<header>
<nav aria-label="Fil d'Ariane"> ← BreadcrumbList
<main id="main">
  <section class="tool-hero">
    H1: Tool name (keyword-rich)
    Tool description (what it solves)
    Trust signals: "X calculs ce mois"
  </section>
  <div class="tool-layout">
    <div class="tool-form">
      Calculator/form inputs
      Calculate button
      Results display
      Share/print results
    </div>
    <div class="tool-sidebar">
      H2: "À savoir"
      Contextual information
      Internal links to related resources
      Related tool: "Essayez aussi le calculateur XXX"
      CTA: trial signup
    </div>
  </div>
  <section class="tool-explanation">
    H2: "Comment utiliser ce calculateur"
    Step-by-step guide
    H3 for each step
  </section>
  <section class="tool-related">
    Related resources (articles, templates)
  </section>
</main>
<footer>
```

### H1/H2/H3
- H1: `"Calculateur IRL 2026 — Révision de loyer en ligne"`
- H2: Sections
- H3: Steps

### Breadcrumb
`Accueil > Outils > [Tool Name]`

### Content-to-Product Flow
- Tool is free to use (no signup required for basic)
- Results page includes a subtle CTA: "Gérez vos loyers automatiquement → Essai gratuit"
- Sidebar has persistent trial CTA

---

## 8. Glossary Page Template

**Route:** `/glossaire-immobilier`

### Structure
```
<header>
<nav aria-label="Fil d'Ariane"> ← BreadcrumbList
<main id="main">
  <section class="glossary-header">
    H1: "Glossaire de la gestion locative"
    Search bar (filters terms)
    Alphabetical index (A-Z)
  </section>
  <div class="glossary-layout">
    <div class="glossary-list">
      Term cards with:
        Term name (H2)
        Short definition (first sentence)
        "Lire la définition complète" link
        Related terms tags
    </div>
    <aside class="glossary-sidebar">
      Popular terms (top 5)
      Related articles
      Tool suggestion
      CTA: trial
    </aside>
  </div>
</main>
<footer>
```

### Individual Glossary Term View
- `/glossaire-immobilier/[terme]` — individual term page
- H1: Term name
- Full definition with:
  - Examples
  - Related terms (linked)
  - Legal context
  - Internal link to related tool/template

### Breadcrumb (Individual Term)
`Accueil > Glossaire > [Letter] > [Term]`

---

## 9. Comparison Page Template

**Route:** (future: `/comparaison/logiciels-gestion-locative`)

### Structure
```
<header>
<nav aria-label="Fil d'Ariane"> ← BreadcrumbList
<main id="main">
  <section class="comparison-hero">
    H1: "Comparatif des logiciels de gestion locative en 2026"
    Our pick recommendation card
  </section>
  <section class="comparison-table">
    H2: "Comparaison détaillée"
    Table: Feature | RentReady | Competitor A | Competitor B
    Checkmarks/X for each feature
  </section>
  <section class="comparison-criteria">
    H2: "Comment choisir"
    Criteria explanations
  </section>
  <section class="comparison-cta">
    "Essayez RentReady gratuitement"
  </section>
</main>
```

---

## 10. Breadcrumb Design System

### Visual Design
```
Home > Section > Page Name
 ^ link     ^ link     ^ current (aria-current="page", not a link)
```

- Separator: `>` or `/` (consistent across site)
- Font: small, muted color (text-secondary)
- Truncation: ellipsis if > 3 levels on mobile
- Schema: `BreadcrumbList` JSON-LD on every page

### CSS Pattern
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}
.breadcrumb-separator {
  color: var(--text-muted);
}
.breadcrumb-link {
  color: var(--text-muted);
  text-decoration: none;
}
.breadcrumb-link:hover {
  text-decoration: underline;
}
.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}
```

### Schema Markup (JSON-LD)
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.rentready.fr" },
    { "@type": "ListItem", "position": 2, "name": "[Section]", "item": "https://www.rentready.fr/[section]" },
    { "@type": "ListItem", "position": 3, "name": "[Page]", "item": "https://www.rentready.fr/[full-path]" }
  ]
}
```

---

## 11. Internal Linking UX

### In-Content Link Styling
- Links within content: underlined, brand blue color
- External links: open in new tab, subtle external icon
- Internal links in blog: highlighted with left-border accent

### Related Articles/Resources Section
- Displayed at bottom of every content page
- 3-card grid (desktop), single column (mobile)
- Card: thumbnail + title + category + read-time
- Links back to related content cluster

### Cross-Link Patterns
- Glossary terms → glossary page
- Feature mentions → feature page
- Template mentions → template page
- Tool mentions → tool page
- All CTAs → signup/register

### Link Equity Distribution
- Homepage links to: Features, Pricing, Templates (high-priority conversion pages)
- Blog articles link to: related articles, templates, tools
- Templates link to: related templates, glossary, tools
- Glossary links to: articles, tools

---

## 12. Navigation Architecture

### Global Navigation
```
[Logo] [Fonctionnalités ▾] [Tarifs] [Modèles] [Outils] [Blog] [|] [Connexion] [Essai gratuit]
```

- Mega-menu for "Fonctionnalités" with sub-categories
- Sticky on scroll
- Mobile: hamburger with slide-out drawer

### Mega-Menu Structure (Feature Dropdown)
```
Fonctionnalités
├── Gestion locative
├── Bail & contrats
├── Quittances
├── Encaissement
├── Révision de loyer
├── Portail locataire
└── see all →
```

### Footer Architecture (Link Equity Hub)
```
COL1: Produit
  ├── Fonctionnalités
  ├── Tarifs
  ├── Démo
  ├── Intégrations
  
COL2: Ressources
  ├── Blog
  ├── Modèles (bail, reçus)
  ├── Outils (calculateurs)
  ├── Glossaire
  
COL3: Entreprise
  ├── À propos
  ├── Contact
  ├── Mentions légales
  ├── Politique de confidentialité
  
COL4: Réseaux
  └── Social links
```

### Sidebar Strategy
- Blog: sticky ToC + related articles (no traditional sidebar)
- Templates: contextual guide sidebar + CTA
- Tools: form + contextual info sidebar

---

## 13. Mobile SEO

### Touch Targets
- All interactive elements: minimum 44×44px
- Buttons: full-width on mobile, 48px height minimum
- Nav items: 44px tap targets

### Font Sizes
- Body text: 16px minimum (18px on blog articles)
- H1: 32px mobile / 48px desktop
- H2: 24px mobile / 36px desktop
- Line height: 1.6 minimum

### No Intrusive Interstitials
- No full-screen popups on mobile
- Banner cookies: dismiss button clearly visible
- Exit-intent: not used on mobile

### Responsive Images
- srcset for all images
- WebP format with fallbacks
- Lazy loading (loading="lazy")
- Explicit width/height to prevent CLS

### Viewport
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- No fixed-width layouts

---

## 14. Page Speed UX

### Skeleton Loading States
- Page-level: full-page skeleton on initial load
- Component-level: card skeletons, table row skeletons
- CSS skeleton animations (pulse effect)

### Lazy Image Placeholders
- Blur-up technique (tiny base64 placeholder → full image)
- Aspect ratio preserved with placeholders to prevent CLS
- Intersection Observer for below-fold images

### CLS (Cumulative Layout Shift) Prevention
- Font-display: swap (no FOIT/FOUT causing layout shifts)
- Reserved space for ads (if any)
- Image explicit dimensions
- Skeleton placeholders during loading

### Performance UX Rules
- FCP < 1.8s
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 15. Content-to-Product Flow

### Blog-to-Signup Funnel
1. **Inline CTAs**: Contextual text links within articles (not banners)
   - e.g., "Découvrez comment créer un bail en 5 minutes →"
2. **Sticky header CTA**: Appears after scrolling past hero
3. **Bottom CTA banner**: After article content, before related articles
4. **Exit-intent**: Desktop only, subtle overlay

### Template-to-Signup Funnel
1. **Download requires email**: lead capture
2. **Post-download CTA**: "Gérez vos baux en ligne → Essai gratuit"
3. **Sidebar CTA**: Persistent throughout template page

### Tool-to-Signup Funnel
1. **Free tool use**: no signup for basic calculation
2. **Results page CTA**: "Save your calculations — free trial"
3. **Sidebar CTA**: persistent throughout

### Calculator-to-Signup Funnel
1. **Interactive calculator**: engage users
2. **Results sharing**: email/LinkedIn share (captures contacts)
3. **CTA after results**: "Full rent management → try free"

### Trust Building Before CTA
- Social proof stats visible near CTAs
- "No credit card required" near trial button
- Feature mini-list near CTA

---

## 16. Template Page Visual Designs (Top 5)

### 16.1 Bail de Location Vide (`/templates/bail-vide`)
- **Hero**: Document preview (left) + key specs (right)
- **Value props**: 3 bento cards (juridiquement vérifié, mis à jour IRL 2026, export PDF)
- **Trust badges**: "Approuvé par X propietarios", "Conforme loi 89"
- **CTA**: "Télécharger modèle gratuit" + "Créer bail en ligne →"

### 16.2 Reçu de Loyer (`/templates/recu-loyer`)
- **Hero**: Receipt visual preview
- **Spec cards**: Conforme Article 21, Export PDF, Multi-format
- **How-to**: 3 steps with icons
- **CTA**: Download + signup

### 16.3 Calculateur IRL 2026 (`/outils/calculateur-irl-2026`)
- **Hero**: Form + result preview
- **Tool layout**: inputs (left) + explanation (right)
- **Contextual info**: current IRL value, legal reference
- **CTA**: trial signup

### 16.4 État des Lieux (`/templates/etat-des-lieux`)
- **Hero**: Document preview with animated page flip
- **Features**: inventory checklist, PDF export, tenant signature
- **FAQ**: common questions about état des lieux
- **CTA**: Download + "Create online"

### 16.5 Congé Locataire (`/templates/conge-locataire`)
- **Hero**: Legal document + compliance badges
- **Legal context**: reference to Article 12 loi 89
- **Template types**: preprinted letters for different cases
- **CTA**: Download + "Gérez tout en ligne →"

---

## 17. Implementation Notes

### Components to Build/Update
1. **BreadcrumbComponent** — reusable across all pages, schema-ready
2. **TableOfContents** — sticky sidebar for blog articles
3. **RelatedArticles** — reusable card grid component
4. **ReadingProgressBar** — fixed top progress for articles
5. **InlineCTA** — contextual in-content CTA component
6. **TrustSignals** — badges component for social proof
7. **MegaMenu** — navigation dropdown for feature pages

### Key CSS Considerations
- Use CSS custom properties for consistent spacing scale
- Follow 8px grid system
- Implement `position: sticky` for sidebar/ToC elements
- Use `content-visibility: auto` for off-screen sections

### Next.js Implementation
- Metadata API for dynamic meta tags per page
- JSON-LD component injected per page template
- `generateMetadata` function for dynamic OG images
- `generateStaticParams` for template/tool pages (SSG)
- Image optimization via `next/image`

### Accessibility (WCAG 2.1 AA)
- Skip-to-content link at top of every page
- Semantic HTML throughout
- ARIA labels on icon-only buttons
- Focus management for modals/overlays
- Color contrast ratio ≥ 4.5:1 for body text
- Keyboard navigable throughout

---

## 18. Page Type Quick Reference

| Page Type | H1 Style | Breadcrumb Depth | Sidebar | Internal Links | CTA Count |
|---|---|---|---|---|---|
| Homepage | Brand + value prop | 1 level | None | Text links in sections | 3+ |
| Feature | Benefit-led | 2 levels | None (related articles at bottom) | Related articles | 2–3 |
| Pricing | Clear pricing offer | 1 level | None | Feature comparison links | 3+ |
| Blog Article | Keyword-rich title | 2 levels | Sticky ToC + related | In-content + related section | 2–3 |
| Template | Document name + "modèle" | 3 levels | Guide + CTA | Related templates | 2 |
| Tool/Calculator | Tool name + benefit | 2 levels | Explanation + CTA | Related tools | 2 |
| Glossary | "Glossaire de [topic]" | 1 level | Popular terms | Term cross-links | 1–2 |
| Comparison | Keyword-rich comparison query | 2 levels | Comparison criteria | To competitor pages | 2 |

---

*Document version: 1.0 | Created: 2026-04-15 | Author: Product Designer (REN-157)*