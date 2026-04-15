# SEO UX Patterns — RentReady Design System

> This document is the deliverable for **REN-177**: *SEO: Design template pages and SEO-optimized UX patterns*.
> It defines the visual language, component architecture, and UX patterns for all programmatic SEO pages (templates, calculators, city guides).

---

## 1. Template Page Design System — `/templates/[slug]`

### 1.1 Page Structure (top → bottom)

```
┌─────────────────────────────────────────────┐
│  NAV — Logo | Nav links | CTA "Essai gratuit" │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  HERO                                         │
│  ├─ Breadcrumb  (Home > Category > Template) │
│  ├─ Badge       ("Gratuit" pill)              │
│  ├─ H1         (Template name)                │
│  ├─ Subtitle   (what it is + when to use)     │
│  └─ CTAs       (Primary: Télécharger PDF)    │
│                (Secondary: Générer en ligne) │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  DOCUMENT PREVIEW                            │
│  ├─ File icon + metadata (size, date, pages) │
│  └─ Checklist of sections included           │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  TRUST BADGES ROW                            │
│  "Conforme loi 89-462" | "Mis à jour 2026"   │
│  "X landlords utilisent ce modèle" | "4.9/5" │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  FEATURES GRID (3-col)                       │
│  Icon + Title + Description                   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  CLAUSES / CONTENT SECTIONS                  │
│  Required vs Optional toggles                │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  LEGAL COMPLIANCE BOX (blue tint)            │
│  Checklist of laws referenced               │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  HOW-TO STEPS (numbered)                     │
│  1-2-3-4-5-6 steps with icon per step        │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  COMPARISON TABLE (optional)                │
│  vs competitor type or bail type             │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  CTA BANNER (dark bg)                        │
│  Product value prop + trial CTA              │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  FAQ ACCORDION                               │
│  <details> elements, Schema FAQPage         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  RELATED RESOURCES                           │
│  Internal links: blog, glossary, templates   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  RELATED TEMPLATES GRID (4-col)             │
│  Card per related template                   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  BOTTOM NAV                                  │
│  ← Prev template | All templates | Next →   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  MARKETING FOOTER                            │
└─────────────────────────────────────────────┘
```

### 1.2 Visual Specs

| Token | Value |
|---|---|
| Background | `#f8f7f4` (warm off-white) |
| Card bg | `#ffffff` |
| Primary | `#2563eb` (blue-600) |
| Primary hover | `#1d4ed8` (blue-700) |
| Dark bg (CTA) | `#1c1917` (stone-900) |
| Text primary | `#1c1917` (stone-900) |
| Text secondary | `#57534e` (stone-600) |
| Border | `1px solid #e7e5e4` (stone-200) |
| Border radius (cards) | `12px` (rounded-xl) |
| Border radius (badges) | `9999px` (rounded-full) |
| Max content width | `1152px` (max-w-6xl) |
| Section spacing | `64px` top/bottom (py-16 / sm:py-24) |
| Hero spacing | `96px` top/bottom |

### 1.3 Template Card Design (for `/templates` index)

```
┌─────────────────────────┐
│ [Icon emoji 3xl]        │
│ Template Name           │
│ Short description       │
│ Tags: #bail #gratuit    │
│ [Télécharger →]         │
└─────────────────────────┘
```
- Grid: `auto-fill, minmax(260px, 1fr)` CSS grid
- Card: white bg, stone-200 border, hover shadow + scale(1.01)
- CTA button inside card: full-width, blue-600 bg

---

## 2. Calculator Page Design System — `/outils/[slug]`

### 2.1 Page Structure

```
┌─────────────────────────────────────────────┐
│  NAV                                         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  HERO                                        │
│  ├─ Breadcrumb                               │
│  ├─ Badge ("Outil gratuit — Données INSEE")  │
│  ├─ H1                                       │
│  └─ Subtitle + meta (date INSEE data)         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  CALCULATOR TOOL                              │
│  Interactive — input fields + Calculate btn  │
│  Live result display                         │
│  [Schema: HowTo + WebApplication]            │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  HOW-TO / EXPLANATION SECTION               │
│  Numbered steps + formula display           │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  DATA TABLE (historical values)              │
│  Striped rows, right-aligned numbers         │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  FAQ ACCORDION                               │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  CTA BANNER (gradient blue)                  │
└─────────────────────────────────────────────┘
└─────────────────────────────────────────────┘
```

### 2.2 Calculator Widget Visual Spec

- Container: white card, `rounded-2xl`, `border stone-200/60`, `shadow-sm`
- Input labels: `text-sm font-medium text-stone-700`
- Input fields: white bg, stone-200 border, focus ring blue-500
- Calculate button: full-width, blue-600, `text-sm font-semibold`
- Result box: stone-900 bg, white text, large bold number (e.g. `923,58 €`)
- Error state: red border + red helper text below field
- Historical table: alternating white/stone-50 rows, right-aligned numbers

---

## 3. Content-to-Product Flywheel UX

### 3.1 "Lire aussi" / "Voir aussi" Link Patterns

Three visual tiers for internal links:

| Tier | Label | Style | Page Location |
|---|---|---|---|
| Primary | "Lire aussi" | Blue text + underline, no icon | After informational paragraphs |
| Secondary | "Voir aussi" | Blue text + arrow icon | End of content sections |
| Tertiary | "À voir aussi" | Card with emoji + title + desc | Bottom of page, grid layout |

**Implementation:**
```tsx
// Primary — inline contextual
<Link href="/blog/..." className="text-blue-600 hover:underline">
  Lire aussi : Guide de la gestion locative →
</Link>

// Secondary — end-of-section
<Link href="/outils/..." className="flex items-center gap-1.5 text-sm text-blue-600">
  <ArrowRight className="size-4" />
  Voir aussi : Simulateur IRL →
</Link>

// Tertiary — card grid at bottom
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {relatedLinks.map(link => (
    <Link href={link.href} className="flex items-center gap-3 rounded-xl border border-stone-200 p-4 hover:shadow-sm transition-shadow">
      <span className="text-2xl">{link.emoji}</span>
      <div>
        <p className="font-medium text-stone-900">{link.label}</p>
        <p className="text-xs text-stone-500">{link.desc}</p>
      </div>
    </Link>
  ))}
</div>
```

### 3.2 CTA Placement Rules

| Page Position | CTA Type | Style |
|---|---|---|
| Hero section (top) | Primary trial CTA | Blue-600 button, full-width on mobile |
| After tool use (calculators) | Post-action CTA | Inline, text link + arrow |
| Mid-article | Inline CTA | Non-intrusive text link or small banner |
| End of article | Final CTA section | Dark bg box, centered text + button |
| Sidebar (desktop) | Sticky CTA | Fixed position, appears after 300px scroll |

**Sticky header CTA (appears on scroll):**
```tsx
// In SmartHeaderCta component
// Hidden by default, visible after scroll
// Full-width on mobile, inline on desktop
// Blue-600 bg, white text, "Essai gratuit →"
```

### 3.3 Exit-Intent / Soft Capture

- Modal: small, centered, `max-w-sm`, not full-screen overlay
- Trigger: mouse leaving viewport (desktop only)
- Content: brief value prop + email input + CTA
- Do NOT show if user already signed up
- Close on click outside or X button

---

## 4. Internal Linking Visual Cues

### 4.1 Link Hierarchy Styling

```css
/* Primary nav links */
.nav-link {
  @apply text-stone-600 hover:text-blue-600 font-medium text-sm;
}

/* In-content contextual links (secondary) */
.content-link {
  @apply text-blue-600 hover:underline;
}

/* Related content card links (tertiary) */
.card-link {
  @apply text-blue-600 hover:underline text-sm;
}

/* Footer links */
.footer-link {
  @apply text-stone-400 hover:text-white transition-colors text-sm;
}
```

### 4.2 Breadcrumb Design

- Visual: `Home > Category > Subcategory > Page`
- Separator: `>` or `›` in stone-400
- Current page: stone-900, not a link
- Schema: `BreadcrumbList` JSON-LD injected per page
- Mobile: single-line, truncated middle items with `…`

```tsx
<nav aria-label="Breadcrumb" className="mb-4">
  <ol className="flex items-center gap-2 text-sm text-stone-500">
    <li><Link href="/" className="hover:text-blue-600">Accueil</Link></li>
    <li aria-hidden="true" className="text-stone-400">›</li>
    <li><Link href="/templates" className="hover:text-blue-600">Modèles</Link></li>
    <li aria-hidden="true" className="text-stone-400">›</li>
    <li className="text-stone-900 font-medium" aria-current="page">Bail vide</li>
  </ol>
</nav>
```

---

## 5. Page Type Templates

### 5.1 Blog Article Page (`/blog/[slug]`)

**Existing components used:**
- `ReadingProgress` — progress bar at top
- `TableOfContents` — sticky sidebar on desktop
- `AuthorBio` — author card with credentials
- `RelatedArticles` — bottom card grid

**Layout:**
```
Desktop (lg+):  [TOC sidebar | Article content | (empty)]
Tablet:         [Article content, full width]
Mobile:         [Article content, full width]
```

**Article typography:**
- Body: `text-base leading-relaxed text-stone-700`
- Max line length: `65-75ch` (use `max-w-prose`)
- H2: `text-2xl font-bold text-stone-900 mt-12 mb-4`
- H3: `text-lg font-semibold text-stone-800 mt-8 mb-3`
- Paragraph lead (first): `text-lg text-stone-600 mb-6`

**Inline CTA (non-intrusive):**
```tsx
// Inserted between content paragraphs, 2-3x per article
<div className="my-8 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
  <p className="text-sm text-blue-800 mb-2">
    <strong>💡 Vous utilisez ce modèle ?</strong> Automatisez la gestion de vos baux
    avec RentReady — essai gratuit 14 jours.
  </p>
  <Link href="/register" className="text-sm text-blue-600 hover:underline">
    Commencer gratuitement →
  </Link>
</div>
```

### 5.2 Glossary Term Page (`/glossaire-immobilier/[slug]`)

**Layout:**
```
┌────────────────────────────────────────────┐
│ Breadcrumb + H1 (term name)                 │
│ Short definition box (highlighted)          │
│ Full explanation sections                   │
│ Related terms grid                         │
│ Inline CTA to product (non-intrusive)       │
│ Previous / Next term navigation             │
└────────────────────────────────────────────┘
```

**Visual spec:**
- Term name: `text-3xl font-bold text-stone-900`
- Short def: `rounded-xl border border-blue-100 bg-blue-50 p-6`
- Full text: same typography as blog article
- Related terms: `grid grid-cols-2 gap-4` card grid

### 5.3 Comparison Page (`/comparaison-[product]`)

**Layout:**
```
┌────────────────────────────────────────────┐
│ Hero: H1 + Subtitle + CTA                   │
│ Product comparison table (sticky header)    │
│ Feature breakdown grid                      │
│ Pricing cards (if applicable)               │
│ Trust signals section                       │
│ Final CTA                                   │
└────────────────────────────────────────────┘
```

**Comparison table spec:**
- Sticky header row with product names + logos
- Features as rows, checkmarks (✓) / dashes (—) for values
- Highlight column for RentReady with blue-50 tint
- Mobile: horizontal scroll with sticky first column

### 5.4 Feature Landing Page (per feature)

**Layout:**
```
┌────────────────────────────────────────────┐
│ Hero: Benefit-led H1 + Subhead + CTA + img  │
│ "Comment ça marche" — 3-step visual          │
│ Feature grid with icon+title+description    │
│ Social proof: testimonial cards             │
│ FAQ accordion                               │
│ Bottom CTA banner (dark)                    │
└────────────────────────────────────────────┘
```

**Hero visual:**
- Two-column on desktop (text left, product screenshot right)
- Screenshot: `rounded-2xl shadow-xl border border-stone-200`
- Badge above H1: feature category

---

## 6. Trust Signals Design System

### 6.1 Component: TrustBadge

```tsx
// Usage: <TrustBadge icon={<Shield />} label="Conforme loi 89-462" />
<div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
  {icon}
  {label}
</div>
```

### 6.2 Trust Signals Tiers

**Tier 1 — Page-level (hero area):**
- Stats bar: `12 400+ bailleurs utilisent ce modèle`
- Rating: `★ 4.9/5 basé sur 847 avis`
- Badges: "Conforme loi 89-462", "Mis à jour 2026"
- Expert-reviewed badge

**Tier 2 — Section-level:**
- Legal compliance box (blue-50 bg)
- Usage stats on document preview section
- Author/expert attribution on content pages

**Tier 3 — Inline:**
- Checkmark icons in feature lists
- "✓ Mention IRL intégrée" in calculator tool
- Source citation at bottom of data tables

### 6.3 Social Proof Block

```tsx
<div className="flex flex-wrap justify-center gap-6">
  <div className="flex items-center gap-2 text-sm">
    <Users className="size-5 text-blue-600" />
    <span className="font-medium text-stone-700">12 400+</span>
    <span className="text-stone-500">bailleurs utilisent ce modèle</span>
  </div>
  <div className="flex items-center gap-2 text-sm">
    <Star className="size-5 text-amber-500" />
    <span className="font-medium text-stone-700">4.9/5</span>
    <span className="text-stone-500">basé sur 847 avis</span>
  </div>
</div>
```

---

## 7. FAQ Accordion Design

### 7.1 Component Spec

```tsx
<details className="group rounded-xl border border-stone-200 bg-white">
  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-stone-900 list-none">
    {question}
    <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
      ▼
    </span>
  </summary>
  <div className="border-t border-stone-100 px-6 pb-4 text-sm leading-relaxed text-stone-600">
    {answer}
  </div>
</details>
```

### 7.2 Schema Integration

Each FAQ section generates `FAQPage` JSON-LD:
```tsx
{
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}
```

---

## 8. Mobile-First Responsive Spec

### 8.1 Breakpoints

| Name | Min-width | Usage |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

### 8.2 Mobile Rules

- **Tap targets**: min `44×44px` for all clickable elements
- **Font sizes**: `text-base` (16px) minimum for body text
- **Spacing**: `px-4` mobile padding, `px-6 sm:px-8` tablet+
- **Grid**: single column on mobile, 2-col on tablet, 3-col on desktop
- **Navigation**: collapsible on mobile (hamburger menu)
- **Breadcrumbs**: single line, `…` truncation for middle items
- **CTAs**: full-width buttons on mobile
- **Comparison tables**: horizontal scroll with sticky first column
- **Content-to-product links**: same tier styling across all breakpoints

### 8.3 No Hidden Content Rule

All content that appears on desktop MUST appear on mobile:
- No collapsed accordions as the primary way to show content
- Progressive disclosure only for supplementary content (FAQ, extra details)
- Sidebar content moves below main content on mobile

---

## 9. Page Speed UX Guidelines (Design Constraints)

### 9.1 Image Guidelines

| Placement | Max Width | Max File Size | Format |
|---|---|---|---|
| OG Image | 1200×630 | 100KB | PNG/WebP |
| Product screenshots | 1200px wide | 200KB | WebP |
| Icons (in content) | 64×64 | 5KB | SVG |
| Trust badge icons | 20×20 | 2KB | SVG |

### 9.2 Font Constraints

- Max **2 web fonts** loaded per page
- Max **3 weights** per font
- Prefer `font-display: swap` for body fonts
- Variable fonts preferred over static

### 9.3 Animation Rules

- CSS `transform` and `opacity` only for animations (no layout triggers)
- Respect `prefers-reduced-motion`
- Max animation duration: `300ms`
- Loading skeletons: CSS-only, no JS animation libraries

### 9.4 Icon Strategy

- Use **Lucide React** (already in codebase) for all UI icons
- SVG sprites for marketing page decorative icons
- No individual SVG files for common icons
- Emoji for content decoration (template cards, feature icons): performant and expressive

---

## 10. Component Inventory Summary

| Component | File Location | Purpose |
|---|---|---|
| `TemplatePageHero` | (inline in page) | Hero + CTAs for template pages |
| `DocumentPreview` | (inline in page) | File preview with checklist |
| `TrustBadge` | (inline in page) | Trust signal pills |
| `FeaturesGrid` | (inline in page) | 3-col feature cards |
| `ClausesList` | (inline in page) | Required/optional clauses |
| `LegalComplianceBox` | (inline in page) | Blue-50 legal checklist |
| `StepsHowTo` | (inline in page) | Numbered step-by-step |
| `ComparisonTable` | (inline in page) | Side-by-side comparison |
| `FaqAccordion` | (inline in page) | FAQ with schema |
| `RelatedResources` | (inline in page) | Internal link cards |
| `RelatedTemplates` | (inline in page) | Template card grid |
| `BreadcrumbNav` | `components/seo/` | Breadcrumb with schema |
| `ReadingProgress` | `components/seo/blog/` | Blog article progress bar |
| `TableOfContents` | `components/seo/blog/` | Sticky sidebar TOC |
| `AuthorBio` | `components/seo/blog/` | Author credential card |
| `RelatedArticles` | `components/seo/blog/` | Blog related articles |
| `IrlCalculator` | (inline in outil page) | Interactive calculator tool |
| `SchemaMarkup` | `components/seo/schema-markup` | JSON-LD injection |

---

## 11. Implementation Status

| Pattern | Status | Notes |
|---|---|---|
| Template page hero | ✅ Done | See `bail-vide/page.tsx` |
| Document preview | ✅ Done | See `bail-vide/page.tsx` |
| Trust badges row | ✅ Done | See `bail-vide/page.tsx` |
| Features grid | ✅ Done | See `bail-vide/page.tsx` |
| FAQ accordion | ✅ Done | See `bail-vide/page.tsx` |
| Related templates | ✅ Done | See `bail-vide/page.tsx` |
| Calculator page | ✅ Done | See `calculateur-irl-2026/page.tsx` |
| Blog article layout | ✅ Done | See `blog/[slug]/page.tsx` |
| Breadcrumb component | ⬜ Todo | Needs shared component |
| Schema markup (HowTo) | ✅ Done | See `calculateur-irl-2026/page.tsx` |
| Content-to-product links | ✅ Done | Ad-hoc in existing pages |
| Sticky header CTA | ✅ Done | See `SmartHeaderCta` |
| Glossary page | ⬜ Todo | Single page exists, needs slug routing |
| Comparison page | ⬜ Todo | Needs implementation |
| Feature landing page | ⬜ Todo | Needs reusable section template |

---

*Document version 1.0 — REN-177 deliverable — Product Designer*
