# RentReady — SEO Design System
**Version:** 1.0 | **Last Updated:** 2026-04-16 | **Owner:** Product Designer

> This document is the authoritative reference for all SEO-optimized design patterns at RentReady. It complements `SEO_PAGE_DESIGN_SPEC.md` (page templates) with component-level specifications.

---

## Table of Contents

1. [Trust Signal Components](#1-trust-signal-components)
2. [Content Layout Components](#2-content-layout-components)
3. [CTA Components](#3-cta-components)
4. [Navigation & Internal Linking](#4-navigation--internal-linking)
5. [Mobile-First Specifications](#5-mobile-first-specifications)
6. [Page Speed Design Guidelines](#6-page-speed-design-guidelines)
7. [Schema Markup Reference](#7-schema-markup-reference)
8. [Performance Impact Notes](#8-performance-impact-notes)

---

## 1. Trust Signal Components

All trust signal components follow E-E-A-T principles. They are designed to be **non-intrusive**, **credible**, and **accessible**.

### 1.1 `TrustLogos` — Certification & Partnership Strip
**File:** `src/components/seo/TrustLogos.tsx`

```
Variants:
  • "full"        — certifications + media mentions strip
  • "compact"      — certifications only
  • "certifications-only" — shield badges only
  • showMedia      — adds "As seen in" Le Monde / Les Echos / Challenges
```

**Visual:** Horizontal strip of shield-check icon + label for each certification.

**E-E-A-T signal:** RGPD, Hébergement UE, DSP2, CNIL badges convey **trustworthiness** and **legal compliance** — critical for French rental market.

**Accessibility:** Wrapped in `<ul aria-label="Certifications et conformités">`. Each item has `aria-label` with the full description.

**Performance impact:** ✅ SVG-based, zero external requests, < 2KB.

---

### 1.2 `CertificationBadge` — Inline Single Badge
**File:** `src/components/seo/TrustLogos.tsx`

Compact inline badge for embedding in testimonial cards, feature callouts, or trust sections.

```
Variants:
  • "default"  — rounded pill with icon + label + optional description
  • "compact"  — icon + label only, inline text style
```

---

### 1.3 `SocialProof` / `StatsBar` — Metrics Trust Bar
**File:** `src/components/landing/social-proof.tsx`, `src/components/landing/animated-counter.tsx`

**Visual:** 4-column grid of animated counters (2400+, 98%, 15 min, 0).

**Usage:** Below hero section on Homepage, Pricing, and key landing pages.

**AnimatedCounter props:**
```
  value      — target number (animates from 0)
  suffix     — "+", "%", "min", etc.
  prefix     — e.g. "0"
  duration   — animation length in ms (default: 1400)
  localeFR   — format numbers with French locale (spaces)
  label      — descriptor below the number
```

**Accessibility:** `role="group" aria-label="Statistiques RentReady"` on the container. Each counter is in a `<div>` with its own label. Respects `prefers-reduced-motion` — falls back to instant display.

**Performance impact:** Uses `requestAnimationFrame` + `IntersectionObserver`. Animation only starts when scrolled into view. Zero layout shift (fixed height container).

---

### 1.4 `TestimonialsSection` / `TestimonialCard` — Social Proof
**Files:**
- `src/components/landing/testimonials-section.tsx` (page-level section)
- `src/components/landing/testimonial-card.tsx` (reusable component)

**Visual:** 3-column grid of cards with quote icon, star rating, review text, and reviewer attribution.

**Props (TestimonialCard):**
```
  name            — reviewer full name
  role            — reviewer context (e.g. "3 appartements LMNP à Lyon")
  stars           — rating 1-5 (default: 5)
  text            — review text
  avatarInitials  — fallback initials if no photo (derived from name if omitted)
  avatarSrc       — optional photo URL
  source          — "google" | "trustpilot" | "capterra" | "direct"
  enableHover     — lift animation on hover (default: true)
```

**Accessibility:** Uses `<blockquote>` semantics. Stars have `aria-label="X étoiles sur 5"`. Verified source badges use `<svg>` checkmark icon.

**Performance impact:** ✅ CSS-only hover effect (no JS). `whileInView` animation is framer-motion with `once: true` — no re-animation.

---

### 1.5 `StarRatingDisplay` — Aggregate Rating Display
**File:** `src/components/landing/testimonial-card.tsx`

For showing aggregate ratings near CTAs or section headers.
```
Example: ★★★★½ 4.8/5 sur Google (127 avis)
```

**Props:**
```
  rating       — e.g. 4.8
  reviewCount  — e.g. 127
  source       — "google" | "trustpilot" | "capterra"
  size         — "sm" | "md" | "lg"
```

---

### 1.6 `ContentReviewBadge` — Content Freshness Signal
**File:** `src/components/seo/ContentReviewBadge.tsx`

**Visual:** Pill badge with shield/refresh icon + "Mis à jour le [date]" text.

**E-E-A-T signal:** Signals to Google that content is actively maintained (reduces stale content penalty).

```
Categories: "article" | "template" | "tool" | "glossary" | "legal"
  → each maps to a specific label ("Article expert-vérifié", etc.)

Freshness thresholds:
  < 90 days  → ShieldCheck icon (green, "recent")
  ≥ 90 days  → RefreshCw icon (grey, "needs update")
```

**Usage:** Placed immediately below the page H1 and intro text on all content pages.

---

## 2. Content Layout Components

### 2.1 `SeoTemplatePage` — Template/Tool Page Layout
**File:** `src/components/seo/SeoTemplatePage.tsx`

Reusable page shell for all template and tool pages. Includes: breadcrumb, hero header, trust signals row, document preview slot, trust strip, ContentReviewBadge, FAQ accordion, related templates grid, final CTA banner.

**Key props:**
```
  title           — H1 text
  description     — subheading
  updatedAt       — ISO date string (drives ContentReviewBadge)
  badgeCategory   — drives ContentReviewBadge label variant
  slug            — for trust signals and download count
  downloadCount   — shown as "Téléchargé X fois"
  legalReference  — shown as compliance badge ("Conforme Article 21...")
  relatedTemplates— cards linking to related templates
  faqs            — FAQ items with FAQPage schema
  jsonLd          — custom schema (falls back to Article schema)
```

**Performance impact:** Static shell with dynamic children slot. All trust components are tree-shakeable.

---

### 2.2 `ReadingProgress` — Blog Reading Progress Bar
**File:** `src/components/seo/blog/ReadingProgress.tsx`

Fixed top bar showing scroll progress through an article.

**Design:** 1px tall bar, blue-600 fill, `position: fixed; top: 0`.

**Accessibility:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label="Progression de lecture"`.

**Performance impact:** Passive scroll listener, CSS `width` transition only (no layout recalculation).

---

### 2.3 `TableOfContents` — Sticky Sidebar TOC
**File:** `src/components/seo/blog/TableOfContents.tsx`

Desktop-only sticky sidebar that extracts H2/H3 headings from the article and tracks active section via IntersectionObserver.

**Design:** Shows only when article has 3+ headings. Active heading highlighted with blue dot + blue text.

**Accessibility:** `<nav aria-label="Table des matières">`. Active link has `aria-current="true"`.

**Performance impact:** Requires client-side JS to extract headings. Hidden on mobile (`hidden xl:block`). IntersectionObserver is passive.

---

### 2.4 `AuthorBio` — Author Attribution
**File:** `src/components/seo/blog/AuthorBio.tsx`

Displayed at the bottom of blog articles.

**E-E-A-T signal:** Establishes **expertise** and **authoritativeness** through named author with credentials.

**Design:** Avatar (initials-based), name, role, bio paragraph, "Contenu vérifié" + "Mis à jour 2026" badges.

---

### 2.5 `RelatedArticles` / `RelatedContent` — Internal Linking
**File:** `src/components/seo/blog/RelatedArticles.tsx`, `src/components/seo/related-links.tsx`

Cross-links related pages using keyword overlap + category matching.

**Usage:** Bottom of every blog article, template page, glossary term.

**Algorithm:**
1. Keyword overlap scoring between current page and content registry
2. Category match bonus (+3)
3. Deduplication of current page
4. Return top 3 by score

---

### 2.6 `FaqSection` + `FaqJsonLd` — FAQ Pattern
**File:** `src/components/landing/faq-section.tsx`

Accordion FAQ with collapsible sections. Ships with 8 pre-written rental-domain FAQs.

**Accessibility:** Uses `shadcn/ui` Accordion with proper ARIA attributes. `<details>/<summary>` pattern in SeoTemplatePage.

**E-E-A-T signal:** FAQPage schema + rich answers = eligibility for People Also Ask and Featured Snippets.

---

### 2.7 Feature Grid & Comparison Table
**Files:**
- `src/components/landing/bento-benefits.tsx`
- `src/components/landing/comparison-section.tsx`

Feature grids use icon + title + description pattern (high SEO value for keyword targeting). Comparison tables render as semantic `<table>` with RentReady vs competitors.

---

## 3. CTA Components

### 3.1 `InlineCTA` — Contextual Inline CTA
**File:** `src/components/seo/InlineCTA.tsx`

Non-intrusive CTA for use within article/template/tool content.

```
Variants:
  • "link"   — text link with arrow (least intrusive)
  • "button" — rounded blue button
  • "banner" — full-width banner with text + button (most prominent)
```

**Props:**
```
  text              — CTA label
  href              — destination URL
  variant           — "link" | "button" | "banner"
  conversionContext — "blog" | "template" | "tool" | "glossary"
                       (for analytics tracking)
  showArrow         — show right arrow icon (default: true)
  ariaLabel         — accessibility override
```

**Pre-configured variants:**
- `BlogInlineCTA` — "Essayez RentReady gratuitement"
- `TemplateDownloadCTA` — "Créer ce bail en ligne — essai gratuit"
- `ToolResultCTA` — "Gérez vos loyers automatiquement →"
- `StickyBottomCTA` — fixed bottom bar on mobile

---

### 3.2 `SmartHeaderCta` — Session-Aware Header CTA
**File:** `src/components/smart-header-cta.tsx`

Shows appropriate CTA based on auth state without causing hydration mismatch:
- Not authenticated: "Connexion" + "Essai gratuit"
- Authenticated: "Accéder au Dashboard"

**Design:** SSR-safe — renders static CTA during SSR, then hydrates client-side.

---

## 4. Navigation & Internal Linking

### 4.1 `Breadcrumb` — Breadcrumb Navigation
**File:** `src/components/seo/Breadcrumb.tsx`

**Visual:** Home icon → Chevron separators → current page label.

**Schema:** Automatically generates `BreadcrumbList` JSON-LD schema.

**LABEL_MAP:** Comprehensive mapping of URL slugs → French labels for 40+ page types.

**Auto-breadcrumbs:** `autoBreadcrumbs(pathname)` parses the URL path and generates crumbs automatically. Custom items can be passed via `items` prop.

**Accessibility:** `<nav aria-label="Fil d'Ariane">`. Current page has `aria-current="page"`.

---

### 4.2 Footer Navigation
**File:** `src/components/landing/marketing-footer.tsx`

Multi-column footer with sitemap links. Critical for link equity distribution.

---

## 5. Mobile-First Specifications

### 5.1 Breakpoints
```
sm   — 640px   (large phones)
md   — 768px   (tablets)
lg   — 1024px  (small laptops)
xl   — 1280px  (desktops)
```

### 5.2 Tap Targets
**Minimum: 44×44px** (Apple HIG / WCAG 2.5.5)

All interactive elements (buttons, links, accordion triggers) must be at least 44×44px.

**Applied in:**
- Header nav links: `h-11` (44px height)
- Mobile CTA button: `py-3` at minimum
- Accordion triggers: full-width tappable row
- Footer links: `py-2` minimum

### 5.3 Typography Minimums
```
Body text: 16px (prevents iOS auto-zoom on focus)
Line height: 1.6–1.8 for body, 1.2–1.3 for headings
Line length: 65–75 characters (optimal reading, ~65ch max-width)
```

### 5.4 Content Hierarchy on Mobile
- H1: 32–36px font-size
- H2: 24–28px
- H3: 18–20px
- No horizontal scroll at 375px viewport width

### 5.5 Mobile-Specific Rules
- Breadcrumbs: always visible above H1 on mobile
- TableOfContents: hidden on mobile (replaced by in-page anchor links)
- Sticky elements: none that block content or harm CLS
- Bottom CTA: `StickyBottomCTA` component for mobile-only sticky conversion bar
- Images: always `loading="lazy"` + explicit `width`/`height` on mobile

### 5.6 Responsive Patterns
```
Hero section:        stack on mobile, side-by-side on lg+
Feature grid:        1-col mobile → 2-col md → 3-col lg
Testimonials:        1-col mobile → 3-col lg
Trust logos:          2-col mobile → auto-fill on sm
Comparison table:    horizontal scroll with sticky first column
FAQ accordion:        full-width on all breakpoints
Related content:      1-col mobile → 2-col sm
```

---

## 6. Page Speed Design Guidelines

### 6.1 Image Strategy
```
Hero images:    WebP, max 100KB, 1200×630px
Blog thumbnails: WebP, max 30KB, 400×225px
Template previews: WebP, max 80KB, 800×1100px
Icons/avatars:  inline SVG or WebP, max 5KB each
```

**Rules:**
- Always `loading="lazy"` except above-the-fold hero
- Always explicit `width` + `height` to prevent CLS
- Use `next/image` component for automatic WebP + srcset
- Never use `jpg` for UI elements (use WebP/SVG instead)

### 6.2 Font Loading
```
Max 2 web font families
Max 3 weights per family (e.g. 400, 500, 700)
Preconnect to font provider: <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
Font-display: swap for body text
```

Current fonts (verify in globals.css):
- Primary: Inter (Google Fonts) — 400, 500, 700 weights
- Display: system-ui fallback for headings

### 6.3 Icon Strategy
**Prefer in order:**
1. **Inline SVG** (best performance, tree-shakeable)
2. **SVG sprite** (multiple icons, single request)
3. **Lucide React** (bundled icons, used throughout)
4. ❌ Icon fonts (cause CLS, accessibility issues)

### 6.4 Animation Guidelines
**Prefer:**
- CSS `transform` and `opacity` (compositor-only, no layout)
- `will-change: transform` on animated elements
- `prefers-reduced-motion` media query respected by AnimatedCounter

**Avoid:**
- `width`/`height` animations (triggers layout)
- JavaScript-driven animations for layout changes
- Animations above the fold that delay LCP

### 6.5 Third-Party Scripts
- Analytics: load after `DOMContentLoaded`
- Chat widgets: load on user interaction or after 3s idle
- Social share buttons: lazy-load on interaction only

### 6.6 Core Web Vitals Targets
```
LCP (Largest Contentful Paint):  < 2.5s
FID / INP (Interaction):         < 100ms
CLS (Cumulative Layout Shift):   < 0.1
```

---

## 7. Schema Markup Reference

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | Organization, WebSite, BreadcrumbList |
| Blog article | Article, BreadcrumbList, Author, Organization |
| Template page | Article, FAQPage, BreadcrumbList |
| Calculator | WebApplication, HowTo, BreadcrumbList |
| Glossary | Article, BreadcrumbList |
| Pricing | BreadcrumbList, SoftwareApplication |
| Comparison | FAQPage, BreadcrumbList |

**Implementation files:**
- `src/components/seo/schema-markup.tsx` — generic SchemaMarkup component
- `src/components/seo/organization-schema.tsx` — Organization + WebSite schema
- `src/components/seo/blog/blog-schema.tsx` — Article schema
- `src/components/seo/JsonLd.tsx` — raw JSON-LD injection

---

## 8. Performance Impact Notes

| Component | JS Bundle Impact | CSS Impact | CLS Risk |
|-----------|-----------------|------------|----------|
| TrustLogos | None (pure SVG) | Minimal | None |
| SocialProof | Minimal (CSS-only) | Minimal | None |
| AnimatedCounter | ~0.5KB (rAF + IO) | Minimal | None (fixed height) |
| TestimonialCard | Framer Motion (~15KB) | Minimal | None |
| ReadingProgress | ~0.3KB | 1 CSS rule | None (fixed) |
| TableOfContents | ~1KB (IO-based) | Minimal | None |
| InlineCTA | None | Minimal | None |
| SmartHeaderCta | ~0.5KB | None | None |
| Breadcrumb | None | Minimal | None |
| ContentReviewBadge | None (pure CSS) | Minimal | None |

**Optimization notes:**
- All components use `use client` only where necessary (interactive components)
- Static display components are server-components by default
- Framer Motion is only imported in components that use `whileInView` animations
- No component loads Google Fonts directly (loaded via `next/font` in layout)

---

## Component Inventory Summary

| Component | File | Status |
|-----------|------|--------|
| TrustLogos | `seo/TrustLogos.tsx` | ✅ Implemented |
| CertificationBadge | `seo/TrustLogos.tsx` | ✅ Implemented |
| SocialProof | `landing/social-proof.tsx` | ✅ Implemented |
| AnimatedCounter | `landing/animated-counter.tsx` | ✅ Implemented |
| StatsBar | `landing/animated-counter.tsx` | ✅ Implemented |
| TestimonialCard | `landing/testimonial-card.tsx` | ✅ Implemented |
| StarRatingDisplay | `landing/testimonial-card.tsx` | ✅ Implemented |
| ContentReviewBadge | `seo/ContentReviewBadge.tsx` | ✅ Implemented |
| SeoTemplatePage | `seo/SeoTemplatePage.tsx` | ✅ Implemented |
| ReadingProgress | `seo/blog/ReadingProgress.tsx` | ✅ Implemented |
| TableOfContents | `seo/blog/TableOfContents.tsx` | ✅ Implemented |
| AuthorBio | `seo/blog/AuthorBio.tsx` | ✅ Implemented |
| RelatedArticles | `seo/blog/RelatedArticles.tsx` | ✅ Implemented |
| RelatedContent | `seo/related-links.tsx` | ✅ Implemented |
| FaqSection | `landing/faq-section.tsx` | ✅ Implemented |
| FaqJsonLd | `landing/faq-section.tsx` | ✅ Implemented |
| InlineCTA | `seo/InlineCTA.tsx` | ✅ Implemented |
| StickyBottomCTA | `seo/InlineCTA.tsx` | ✅ Implemented |
| SmartHeaderCta | `smart-header-cta.tsx` | ✅ Implemented |
| Breadcrumb | `seo/Breadcrumb.tsx` | ✅ Implemented |
| ComparisonSection | `landing/comparison-section.tsx` | ✅ Implemented |
| FeatureLandingPage | `landing/FeatureLandingPage.tsx` | ✅ Implemented |
| OpenGraph | `app/opengraph-image.tsx` | ✅ Implemented |
| SchemaMarkup | `seo/schema-markup.tsx` | ✅ Implemented |
| OrganizationSchema | `seo/organization-schema.tsx` | ✅ Implemented |
| JsonLd | `seo/JsonLd.tsx` | ✅ Implemented |
