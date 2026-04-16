# SEO Page Design System — RentReady

## Overview

This document defines the UX/UI design patterns for programmatic SEO pages at RentReady. All SEO-driven pages follow these patterns to maximize organic search performance, E-E-A-T signals, and conversion.

---

## Page Type Architecture

### 1. Template Page (`/modeles/[slug]`)

**Purpose**: Provide free downloadable documents (quittance, bail, état des lieux). High SEO value for transactional + informational intent.

**URL Pattern**: `/modeles/[template-slug]`
**Example**: `/modeles/quittance-de-loyer`

**Required Sections** (top to bottom):

```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Accueil > Modeles > [Name]     │
├─────────────────────────────────────────────┤
│  HERO                                       │
│  ├─ Badge: "Gratuit" / "Mis a jour [date]"  │
│  ├─ H1: [Template Name]                     │
│  ├─ Description: what + when to use it       │
│  ├─ Trust signals: Downloads count, reviewed  │
│  ├─ CTA: Generer maintenant → (primary)      │
│  └─ CTA: Guide associe (secondary)           │
├─────────────────────────────────────────────┤
│  DOCUMENT PREVIEW + CTA (2-col on desktop)  │
│  ├─ Left: Live document preview (iframe/PDF) │
│  └─ Right: CTA + email capture              │
├─────────────────────────────────────────────┤
│  TRUST STRIP (TrustLogos, certifications)    │
├─────────────────────────────────────────────┤
│  SEO CONTENT                                │
│  ├─ H2: Comment utiliser ce modele           │
│  ├─ Detailed instructions                   │
│  ├─ French law references (legal articles)  │
│  ├─ FAQ accordion (3-5 questions)           │
│  └─ Related templates (internal links)       │
├─────────────────────────────────────────────┤
│  CONTENT REVIEW BADGE (ContentReviewBadge)  │
├─────────────────────────────────────────────┤
│  FAQ SECTION (FAQPage schema)               │
├─────────────────────────────────────────────┤
│  FINAL CTA                                  │
└─────────────────────────────────────────────┘
```

**SEO Schema Types**: Article, FAQPage, BreadcrumbList

**Content Update Frequency**: Every 6 months (ContentReviewBadge)

---

### 2. Calculator/Tool Page (`/outils/[slug]`)

**Purpose**: Interactive tools (IRL calculator, rent increase calculator). Captures high-intent users with measurable SEO value.

**URL Pattern**: `/outils/[tool-slug]`
**Example**: `/outils/calculateurIRL`

**Required Sections**:

```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Accueil > Outils > [Name]     │
├─────────────────────────────────────────────┤
│  HERO                                       │
│  ├─ H1: [Tool Name]                        │
│  ├─ Description: what it calculates         │
│  ├─ Trust badge: "Conforme INSEE"          │
│  └─ Schema: WebApplication + HowTo          │
├─────────────────────────────────────────────┤
│  CALCULATOR WIDGET (interactive, centered) │
│  ├─ Input fields with labels                │
│  ├─ Calculate button                        │
│  ├─ Results display                         │
│  └─ Share/save result CTA                   │
├─────────────────────────────────────────────┤
│  RESULTS EXPLAINED                          │
│  ├─ What the result means                   │
│  ├─ How it was calculated (formula)          │
│  └─ Related: next steps                      │
├─────────────────────────────────────────────┤
│  CONTENT REVIEW BADGE                       │
├─────────────────────────────────────────────┤
│  RELATED CONTENT + TOOLS                    │
├─────────────────────────────────────────────┤
│  CTA: Try RentReady free →                  │
└─────────────────────────────────────────────┘
```

**SEO Schema Types**: WebApplication, HowTo, BreadcrumbList

---

### 3. Blog Article Page (`/blog/[slug]`)

**Purpose**: Informational content for topical authority and long-tail traffic.

**Required Sections**: (already fully implemented)

```
- Breadcrumb
- H1 + meta (date, read time, category, author)
- ContentReviewBadge (if updatedAt != date)
- Article body with H2/H3 hierarchy
- TableOfContents sidebar (sticky, desktop only)
- InlineCTA (non-intrusive, contextually placed)
- AuthorBio with credentials
- RelatedArticles section
- FAQ (if applicable)
```

**SEO Schema Types**: Article, BreadcrumbList, Author, Organization

---

### 4. Glossary Page (`/glossaire-immobilier`)

**Purpose**: Define real estate terms for topical authority and featured snippets.

**Required Sections**: (already fully implemented)

```
- Breadcrumb: Accueil > Glossaire
- H1: Glossaire Immobilier
- Intro text
- ContentReviewBadge
- Alphabetical filter nav
- Term grid: A | B | C... | All
  └─ Each term: name + short def + full article link
- SEO content per letter section
```

**SEO Schema Types**: BreadcrumbList, Article

---

### 5. Comparison Page (`/comparatif-[product]`)

**Purpose**: Compare RentReady vs competitors for commercial investigation keywords.

**URL Pattern**: `/comparatif-rentready-vs-[competitor]`

**Required Sections**:

```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Accueil > Comparatif            │
├─────────────────────────────────────────────┤
│  HERO                                       │
│  ├─ H1: RentReady vs [Competitor]           │
│  ├─ Subhead: honest comparison              │
│  └─ Schema: FAQPage with comparison Q&As    │
├─────────────────────────────────────────────┤
│  COMPARISON TABLE                           │
│  ├─ Feature | RentReady | [Competitor]     │
│  ├─ Mobile app | Yes | Yes                 │
│  ├─ Free tier | Yes | No                   │
│  └─ ... (10-15 key features)               │
├─────────────────────────────────────────────┤
│  VERDICT SECTION                            │
│  ├─ Winner by category                     │
│  └─ When to choose each                    │
├─────────────────────────────────────────────┤
│  CTA: Try RentReady free / Book demo       │
└─────────────────────────────────────────────┘
```

---

## Internal Linking Architecture

### Link Hierarchy Styling

All internal links follow visual hierarchy to guide PageRank flow:

**Primary links** (navigation):
- Color: `--link-primary: #2563eb`
- Weight: `font-medium`
- Used in: nav menus, footer links

**In-content contextual links**:
- Color: `--link-contextual: #1d4ed8`
- Style: underline dotted or inline highlight
- Used in: article body, within paragraphs
- Purpose: semantic context signals + PageRank flow

**Related content links** (tertiary):
- Style: card with border, subtle background
- Used in: "Lire aussi", "Outils similaires", "Related"
- Purpose: cross-link to related pages, higher click CTR

### "Lire aussi" / "Voir aussi" Pattern

Each content page must have a related links section:

```
## Lire aussi
├─ [Related Article 1] — short description
├─ [Related Article 2] — short description
└─ [Tool: Calculator Name] — what it does
```

Placement: Bottom of every blog article, glossary term, template page.
Implementation: `RelatedLinks` component (`src/components/seo/related-links.tsx`)

---

## Content-to-Product Flywheel UX

### Inline CTA Placement Rules

**Do** place CTAs after:
- Every H2 section in articles (if > 200 words between CTAs)
- End of every major content section
- After "how to" instructions
- Within glossary term definitions (contextual)

**Don't** place CTAs:
- Within the first 2 paragraphs (hurts dwell time)
- Within table of contents
- Within code blocks or legal references
- More than once per 300 words

### CTA Copy by Page Type

| Page Type | Primary CTA | Secondary CTA |
|-----------|-------------|---------------|
| Blog article | Essai gratuit 14j | Voir les modeles |
| Template page | Generer maintenant → | Lire le guide |
| Calculator | Calculer maintenant | Essai gratuit |
| Glossary term | Gerer mes locations | Calculer mon IRL |
| Comparison | Essai gratuit |Comparer aussi |

---

## Mobile-First SEO Requirements

- All tap targets: minimum 44x44px
- Font size body: minimum 16px (prevents iOS zoom)
- Line length: 65-75 characters (optimal reading)
- No horizontal scroll at 375px viewport
- Images: `loading="lazy"` + explicit width/height
- Breadcrumbs: always visible on mobile (above H1)
- Sticky elements: none that block content (hurts CLS)

---

## Page Speed Design Guidelines

- Images: WebP format, max 100KB hero, 30KB inline
- Fonts: max 2 web font families, 3 weights each
- Icons: SVG sprite or inline SVG (no icon fonts)
- Animations: CSS transforms only (no layout triggers)
- Third-party: defer non-critical (analytics, chat)

---

## Content Freshness Rules

All content pages display a `ContentReviewBadge`:
- Updated < 30 days: green shield, "Mis a jour recemment"
- Updated 30-90 days: blue shield, "Mis a jour le [date]"
- Updated 90-180 days: orange refresh icon, "Peut etre mis a jour"
- Updated > 180 days: red, needs review

Review dates stored as `updatedAt` in frontmatter/data.

---

## Schema Markup by Page Type

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | Organization, WebSite, BreadcrumbList |
| Blog article | Article, BreadcrumbList, Author, Organization |
| Blog listing | BreadcrumbList, Blog |
| Template page | Article, FAQPage, BreadcrumbList |
| Calculator | WebApplication, HowTo, BreadcrumbList |
| Glossary | Article, BreadcrumbList |
| Pricing | BreadcrumbList, SoftwareApplication |
| Comparison | FAQPage, BreadcrumbList |

---

## OpenGraph Image System

All pages generate OG images via `/api/og`:

| Type | Route | Title Format |
|------|-------|-------------|
| Article | `/api/og?title=X&type=article` | "[Title] | RentReady Blog" |
| Template | `/api/og?title=X&type=template` | "[Template] - Modele gratuit | RentReady" |
| Calculator | `/api/og?title=X&type=calculator` | "[Tool] - Outil gratuit | RentReady" |
| Feature | `/api/og?title=X&type=feature` | "[Feature] | RentReady" |

OG image specs: 1200x630px, branded template with title overlay.

---

## Next Pages to Build

Priority order based on SEO opportunity:

1. **Template pages**: 5 exist, expand to 20+ (highest SEO ROI)
2. **Calculator pages**: IRL calculator, rent increase calculator, charges estimator
3. **Comparison pages**: vs Landlord Studio, vs Gestimum, vs Buildium
4. **City guide pages**: `/guides/lyon-locataire`, `/guides/paris-bailleur`
5. **Use-case pages**: `/pour-proprietaires`, `/pour-sci`, `/pour-agences`
