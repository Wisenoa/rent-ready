# Technical SEO Architecture Blueprint — RentReady

> **Issue:** REN-152 (CTO) | **Author:** CTO Agent | **Date:** 2026-04-14
> **Project:** /home/ubuntu/rent-ready | **Status:** Final

---

## 1. Rendering Strategy

### Decision Framework

| Page Category | Rendering Mode | Rationale | Cache TTL |
|---|---|---|---|
| Homepage | ISR (1h) | High-traffic, changes weekly | 3600s |
| Feature pages | ISR (6h) | Rarely changes, SEO-stable | 21600s |
| Pricing page | ISR (3h) | Conversion-critical, seasonal updates | 10800s |
| Blog index + posts | ISR (1h) + SSG for posts | Fresh content important, stable after publish | 3600 / revalidate-on-publish |
| Template pages | SSG | Once published, immutable content | Immutable (set on build) |
| Calculator pages | SSR | Dynamic data (IRL, rent estimates) changes quarterly | No cache |
| City guide pages | ISR (24h) | Local data may update, but infrequent | 86400s |
| Glossary | SSG | Immutable once published | Immutable |
| Dashboard/app pages | SSR (no cache) | Private, user-specific, never indexable | No cache |

### Current Assessment
- ✅ Homepage already has `export const dynamic = "force-dynamic"` — correct for conversion-critical page
- ✅ Marketing layout has `export const dynamic = "force-dynamic"` — correct
- ⚠️ **Action required:** Template pages (`/templates/*`) and glossary should be marked `export const revalidate = false` or `generateStaticParams` for full SSG
- ⚠️ **Action required:** City guide pages (`/gestion-locative/[ville]`) need explicit `export const revalidate = 86400`

### Implementation Rules
- All marketing pages (`/app/(marketing)/*`) use **ISR** by default
- All app pages (`/app/(dashboard)/*`) are **SSR, no-index, no-cache**
- All template/calculator pages use **SSG or ISR** — never SSR with no cache
- On-demand revalidation via `/api/revalidate` webhook for content updates (blog, template edits)
- Stale-while-revalidate headers on CDN for graceful degradation

---

## 2. Core Web Vitals Targets

### Target Table by Page Type

| Page Type | LCP Target | CLS Target | INP Target | Notes |
|---|---|---|---|---|
| Homepage | < 1.8s | < 0.05 | < 150ms | Hero image must be optimized |
| Feature pages | < 2.0s | < 0.05 | < 150ms | Text-heavy, few images |
| Pricing page | < 1.5s | < 0.05 | < 150ms | Minimal, conversion-critical |
| Blog posts | < 2.5s | < 0.1 | < 200ms | Content-heavy |
| Template pages | < 2.0s | < 0.05 | < 200ms | Download CTAs must be fast |
| Calculator pages | < 2.5s | < 0.1 | < 200ms | Input interactions |
| City guide pages | < 2.5s | < 0.1 | < 200ms | Rich content |
| Landing pages | < 2.0s | < 0.05 | < 150ms | Varies by page |

### Optimization Checklist

**LCP:**
- Hero image: `priority` + `fetchpriority="high"` + WebP/AVIF format, size `< 150KB`
- Above-the-fold text: avoid render-blocking fonts (subset, `font-display: swap`)
- CSS: inline critical CSS, defer non-critical
- Static assets: aggressive cache headers (already configured: `max-age=31536000, immutable`)

**CLS:**
- All images: explicit `width` + `height` attributes
- No late-loading fonts causing layout shifts (preconnect, swap)
- No dynamic content injecting above fold
- Ads/embeds: reserved space

**INP:**
- Heavy components: lazy load with `dynamic()` and `ssr: false`
- Third-party scripts: defer or load after interaction
- Event handlers: debounce where needed

**Performance Budget per Page:**
- HTML: `< 100KB` (compressed)
- CSS (critical): `< 15KB` (compressed)
- JS (initial): `< 150KB` (compressed)
- Images: `< 200KB` per above-fold image
- Total page weight (no-cache): `< 1MB`

**Lighthouse CI:** Add to CI pipeline with score gates:
```
performance: 90+
accessibility: 95+
best-practices: 95+
seo: 100
```

---

## 3. Metadata System

### Metadata Template Per Page Type

```typescript
// Standard marketing page metadata
{
  title: "[Page Title] — Logiciel gestion locative | RentReady",
  description: "[Unique 150-160 char description with primary keyword]",
  keywords: ["keyword1", "keyword2", "keyword3"],
  openGraph: {
    title: "[OG Title — max 60 chars]",
    description: "[OG Description — max 110 chars]",
    type: "website",
    url: "https://www.rentready.fr/[path]",
    siteName: "RentReady",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "[Alt]" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "[Twitter Title]",
    description: "[Twitter Description]",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr/[path]",
    languages: { "fr-FR": "https://www.rentready.fr/[path]" },
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
}
```

### Metadata Rules by Page Type

| Page Type | Title Pattern | Description Rule | canonical |
|---|---|---|---|
| Homepage | `Logiciel gestion locative 15€/mois | RentReady` | Generic + unique value prop | Self |
| Feature | `Fonctionnalités — [Feature Name] | RentReady` | Feature-specific + use case | Self |
| Pricing | `Tarifs — [Plan] | RentReady` | Price-specific + trust signals | Self |
| Blog | `[Article Title] | RentReady` | Article-specific + read more CTA | Self |
| Template | `[Template Name] — Modèle gratuit | RentReady` | Template-specific + download CTA | Self |
| Calculator | `[Calculator Name] — Simulateur gratuit | RentReady` | Calculator-specific + usage CTA | Self |
| City guide | `Gestion locative [City] — Guide 2026 | RentReady` | City-specific + local intent | Self |
| Glossary | `[Term] — Glossaire immobilier | RentReady` | Term definition first 160 chars | Self |
| Legal | Noindex | — | No canonical (or self) |

### Current Implementation Assessment
- ✅ Pricing page has full metadata + JSON-LD
- ✅ Features page has metadata
- ⚠️ **Action required:** Blog post pages need consistent metadata with `article:published_time`, `article:author`, `article:modified_time`
- ⚠️ **Action required:** Template pages need metadata with `product` or `article` structured data
- ⚠️ **Action required:** Calculator pages need `application/json` schema type `WebApplication`

### Dynamic Metadata Implementation
All dynamic routes must generate metadata from data:
```typescript
// app/(marketing)/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: `${post.title} | RentReady`,
    description: post.excerpt,
    openGraph: {
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [post.author],
      },
    },
  };
}
```

---

## 4. Canonical URL Strategy

### Rules

1. **Self-referencing canonical** on all indexable pages (already implemented in pricing)
2. **Default to page URL as canonical** — avoid pointing to summary/pillar pages
3. **Paginated pages:** canonical = page 1, all pages 2+ have `page=2` in URL
4. **Filtered views:** noindex on filtered combinations, canonical = unfiltered view
5. **Trailing slashes:** redirect all non-trailing to trailing (or vice versa — must be consistent)
6. **Case sensitivity:** normalize to lowercase

### Paginated Page Handling

```
/blog                    → canonical: /blog, robots: index, follow
/blog?page=2             → canonical: /blog, robots: noindex, follow (page 2+)
/blog/category=finance   → canonical: /blog?category=finance (no index on duplicate filter combos)
/blog?category=finance&sort=date → noindex (too many combo permutations)
```

### Implementation
```typescript
// sitemap.ts already uses BASE_URL consistently
// next.config.ts redirects: /home → / (already implemented)

export default function sitemap(): MetadataRoute.Sitemap {
  // All URLs must be absolute with https://www.rentready.fr
  // No relative URLs
  // No duplicate entries
}
```

### Current Issues
- ⚠️ **Action required:** Verify canonical headers on ISR pages — add to each page:
  ```typescript
  alternates: { canonical: `https://www.rentready.fr${pathname}` }
  ```
- ⚠️ **Action required:** Add trailing slash redirect rule in next.config.ts if not present

---

## 5. Sitemap Strategy

### Segment Architecture

| Sitemap | File | Contents | Update Frequency |
|---|---|---|---|
| Main | `sitemap.xml` | Links to all other sitemaps | Weekly |
| Marketing | `sitemap-marketing.xml` | Homepage, features, pricing, demo, legal | Weekly |
| Blog | `sitemap-blog.xml` | All blog posts | On publish |
| Templates | `sitemap-templates.xml` | All template pages | Monthly |
| Tools | `sitemap-tools.xml` | Calculators, tools | Monthly |
| City | `sitemap-city.xml` | City guide pages | Monthly |
| Glossary | `sitemap-glossary.xml` | Glossary terms | Quarterly |

### Sitemap Requirements

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.rentready.fr/sitemap-marketing.xml</loc>
    <lastmod>2026-04-14</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rentready.fr/sitemap-blog.xml</loc>
    <lastmod>2026-04-14</lastmod>
  </sitemap>
  <!-- etc -->
</sitemapindex>
```

### Priority and ChangeFrequency Guidelines

| Page Type | Priority | ChangeFrequency |
|---|---|---|
| Homepage | 1.0 | weekly |
| Feature pages | 0.9 | weekly |
| Pricing | 0.9 | weekly |
| Core marketing (bail, quittances, etc.) | 0.8 | monthly |
| Blog posts | 0.6-0.8 | monthly (depends on freshness) |
| Template pages | 0.7 | monthly |
| City guides | 0.8 | monthly |
| Calculators | 0.7 | monthly |
| Glossary | 0.5 | quarterly |

### Current Implementation Assessment
- ✅ `sitemap.ts` exists with static + blog + city entries
- ⚠️ **Action required:** Split into sitemap index + segmented sitemaps for scale
- ⚠️ **Action required:** Template pages should be in their own sitemap
- ⚠️ **Action required:** Add `lastmod` from actual content dates (not `new Date()`)
- ⚠️ **Action required:** Add `<xhtml:link rel="canonical">` inside each URL entry for cross-referencing

### Dynamic Sitemap Route
```typescript
// app/sitemap.xml/route.ts — serve actual sitemap
// app/sitemap-marketing.xml/route.ts — marketing sitemap
// etc.
```

---

## 6. Robots.txt Configuration

### Current robots.ts Assessment

**Current rules (from robots.ts):**
```
Allow: /, /gestion-locative, /locations, /bail, /quittances, /maintenance, /pricing, /features, /demo, /blog, /glossaire-immobilier, /outils, /mentions-legales, /politique-confidentialite, /cgu
Disallow: /dashboard, /properties, /tenants, /billing, /expenses, /fiscal, /portal, /api, /login, /register
```

### Recommended Changes

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",           // Homepage
          "/pricing",
          "/demo",
          "/features",
          "/gestion-locative",
          "/bail",
          "/quittances",
          "/maintenance",
          "/locations",
          "/blog",
          "/glossaire-immobilier",
          "/templates",
          "/outils",
          // Legal
          "/mentions-legales",
          "/politique-confidentialite",
          "/cgu",
          "/politique-cookies",
        ],
        disallow: [
          // App (authenticated)
          "/dashboard",
          "/properties",
          "/tenants",
          "/billing",
          "/expenses",
          "/fiscal",
          "/portal",
          "/account",
          // Auth
          "/login",
          "/register",
          "/auth",
          // API
          "/api",
          // Internals
          "/_next",
          "/favicon.ico",
          "/public",
          // Admin
          "/admin",
          // Sandbox
          "/outils/offline",
        ],
      },
      {
        // Specific rules for research crawlers
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: "https://www.rentready.fr/sitemap-index.xml",
    host: "https://www.rentready.fr",
  };
}
```

### Key Changes from Current
1. **Add `/templates`** to allowed list
2. **Add `/account`** to disallowed list
3. **Add `/admin`** to disallowed list
4. **Add `/politique-cookies`** to allowed list
5. **Add sitemap index** instead of just `sitemap.xml`
6. **Add GPTBot restriction** (prevent AI training crawlers from consuming content without benefit)

---

## 7. Structured Data Strategy

### Schema Types by Page Template

| Page Type | Schema.org Type | Notes |
|---|---|---|
| Homepage | `WebSite` + `SoftwareApplication` | Sitewide search box schema |
| Feature pages | `WebPage` + `SoftwareApplication` | Feature list as `itemOffered` |
| Pricing page | `WebPage` + `FAQPage` + `Offer` | Multiple schemas in one page |
| Blog post | `Article` + `BreadcrumbList` | `Article.providers`, `datePublished`, `dateModified` |
| Template page | `WebPage` + `DigitalDocument` | Template-specific properties |
| Calculator page | `WebApplication` + `HowTo` | `OperatingSystem: Web` |
| City guide | `WebPage` + `Article` + `BreadcrumbList` | LocalBusiness hints for geo |
| Glossary term | `WebPage` + `DefinedTerm` | Term definition schema |
| FAQ page | `FAQPage` | Direct FAQPage mapping |
| Legal pages | None (noindex) | — |

### Implementation Pattern

```typescript
// components/seo/structured-data.tsx
import { SchemaMarkup } from "./schema-markup";

export function HomepageSchemas() {
  return (
    <>
      <SchemaMarkup data={websiteSchema()} />
      <SchemaMarkup data={softwareAppSchema()} />
      <SchemaMarkup data={searchActionSchema()} />
    </>
  );
}
```

### FAQPage Schema (Pricing Page)

```typescript
function pricingFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
```

### Article Schema (Blog)

```typescript
function blogPostSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
      url: "https://www.rentready.fr/about",
    },
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rentready.fr/logo.png",
      },
    },
    image: post.coverImage ? `https://www.rentready.fr${post.coverImage}` : undefined,
    url: `https://www.rentready.fr/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rentready.fr/blog/${post.slug}`,
    },
  };
}
```

### BreadcrumbList Schema (All Inner Pages)

```typescript
function breadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### Current Implementation Assessment
- ✅ `schema-markup.tsx` and `organization-schema.tsx` exist
- ✅ Pricing page has `PricingJsonLd()` with FAQPage
- ⚠️ **Action required:** Add BreadcrumbList schema to all inner pages (template, calculator, city, glossary)
- ⚠️ **Action required:** Add Article schema to blog posts
- ⚠️ **Action required:** Add `SearchAction` schema to homepage for SGE visibility
- ⚠️ **Action required:** Add `WebApplication` schema to calculator pages

---

## 8. Pagination & Faceted Navigation Rules

### Pagination Rules

1. **Page 1:** `canonical: /[path]`, `index, follow`
2. **Page 2+:** `canonical: /[path]`, `noindex, follow` (prevent duplicate content)
3. **Prev/Next links:** use `rel="prev"` and `rel="next"` in `<head>` (Google still respects this signal)
4. **Total page count:** signal via `rel="prev"` pointing to first, `rel="next"` pointing to last

```typescript
// Example for blog pagination
export async function generateMetadata({ params }) {
  const page = params.page ? parseInt(params.page) : 1;
  return {
    alternates: { canonical: `https://www.rentready.fr/blog` },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}
```

### Faceted Navigation Rules

| Facet Type | Rule | Example |
|---|---|---|
| Category filter | `noindex, follow` | `/blog?category=finance` |
| Sort only | `noindex, follow` | `/blog?sort=date` |
| Search query | `noindex, follow` | `/blog?q=loyer` |
| Combined filters | `noindex, follow` | `/blog?category=finance&sort=date` |
| City filter | `index, follow` (unique value) | `/gestion-locative/paris` (has its own page) |
| All filters (too many combos) | `noindex` | Prevent URL pollution |

### URL Cleanup Rules

1. Remove empty query params (`?sort=` → remove)
2. Normalize order of params (alphabetical for consistency)
3. Limit total query string length (max 3 params)
4. Use path-based navigation over query params for primary categories

### Canonical + hreflang

```typescript
// For paginated blog
const blogPage = page === 1 
  ? "https://www.rentready.fr/blog"
  : `https://www.rentready.fr/blog?page=${page}`;

// hreflang
alternates: {
  canonical: blogPage,
  languages: { "fr-FR": blogPage },
}
```

---

## 9. International SEO (hreflang)

### Current State
French-only product — no hreflang needed currently. If English version is added in future:

```typescript
// next.config.ts rewrites or subdirectory
// /en/ for English pages

export const alternates: Metadata["alternates"] = {
  canonical: `https://www.rentready.fr/${path}`,
  languages: {
    "fr-FR": `https://www.rentready.fr/${path}`,
    "en-US": `https://www.rentready.fr/en/${path}`,
  },
};
```

### If Subdomain Used Later
```
fr.rentready.fr → France (default)
en.rentready.fr → English market
```

No hreflang needed for same-language regional variants (fr-FR vs fr-BE are the same content with minor local differences — keep single fr-FR canonical).

---

## 10. Performance Budget

### Per-Page Size Limits

| Page Type | HTML | CSS | JS | Images | Total |
|---|---|---|---|---|---|
| Homepage | 80KB | 15KB | 120KB | 200KB | < 500KB |
| Feature page | 100KB | 20KB | 150KB | 200KB | < 600KB |
| Pricing | 60KB | 15KB | 100KB | 100KB | < 400KB |
| Blog post | 150KB | 20KB | 180KB | 300KB | < 800KB |
| Template page | 120KB | 15KB | 100KB | 50KB | < 400KB |
| Calculator | 100KB | 20KB | 200KB | 50KB | < 500KB |

### Image Pipeline Requirements

1. **Formats:** AVIF primary, WebP fallback, JPEG only for photos
2. **Sizing:** `srcset` with 640, 750, 828, 1080, 1200, 1920 breakpoints
3. **Lazy loading:** All below-fold images `loading="lazy"`
4. **Priority:** Hero/lcp images `fetchpriority="high"` + `loading="eager"`
5. **Compression:** Quality 80 for photos, 85 for UI graphics (via sharp/next/image)
6. **Favicon:** SVG favicon, < 5KB
7. **Next/Image:** Use `<Image>` for all images — automatic WebP/AVIF, size optimization

### Font Performance

```typescript
// In layout or font config
// Use next/font/google with display: swap
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Critical
  preload: true,
});

// Only preload critical fonts
// For French: latin-extended only when needed (é, è, ê, â, etc.)
```

### Critical Path
```
User requests page
  → HTML (streaming, first bytes < 50ms)
  → CSS (critical inline, non-critical async)
  → JS (defer, interaction-ready < 3s)
  → Images (lazy, WebP/AVIF)
  → Fonts (swap, no block)
```

### Third-Party Scripts
- Stripe.js: load only on `/register` and `/pricing`
- Analytics (if any): load after `window.load` or user interaction
- Chat widgets: load on interaction, never block FCP

---

## 11. Implementation Priority Order

| Priority | Action | Effort | SEO Impact |
|---|---|---|---|
| P0-Critical | Add BreadcrumbList schema to all pages | 1d | High |
| P0-Critical | Fix canonical headers on all pages | 0.5d | High |
| P0-Critical | Add SearchAction schema to homepage | 0.5d | Medium |
| P1-High | Split sitemap into segments | 1d | Medium |
| P1-High | Add FAQ schema to FAQ pages (if any) | 0.5d | Medium |
| P1-High | Add Article schema to blog posts | 0.5d | High |
| P1-High | Add `article:published_time` to blog metadata | 0.25d | Medium |
| P1-High | Add `WebApplication` schema to calculator pages | 0.5d | Medium |
| P2-Medium | ISR cache headers on template pages | 0.5d | Low |
| P2-Medium | Robots.txt update (add templates, GPTBot) | 0.25d | Low |
| P2-Medium | Lighthouse CI integration | 1d | High |
| P3-Low | Performance budget monitoring dashboard | 1d | Medium |
| P3-Low | hreflang preparation for future EN site | 0.5d | Low |

---

## 12. Monitoring & Maintenance

### CI Gate: Lighthouse
```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: https://www.rentready.fr/, https://www.rentready.fr/pricing, https://www.rentready.fr/blog
    budgetPath: ./lighthouserc.js
    uploadArtifacts: true
```

### lighthouserc.js Budget Configuration
```javascript
{
  "ci": {
    "collect": { "url": ["http://localhost:3000"] },
    "assert": {
      "performance": ["error", { "minScore": 0.9 }],
      "accessibility": ["error", { "minScore": 0.95 }],
      "seo": ["error", { "minScore": 1.0 }],
    },
  },
}
```

### Manual Checks (Monthly)
- [ ] Verify all sitemaps accessible: `https://www.rentready.fr/sitemap.xml`
- [ ] Check Google Search Console for coverage errors
- [ ] Verify no new noindex pages in sitemap
- [ ] Check schema validation in Rich Results Test
- [ ] Monitor Core Web Vitals in Search Console

### Tools for Validation
- Google Rich Results Test: `https://search.google.com/test/rich-results`
- Schema.org Validator: `https://validator.schema.org/`
- Screaming Frog: for bulk canonical + sitemap audit
- Lighthouse CI: for every PR

---

*Document produced by CTO agent. Next step: report completion to CEO.*