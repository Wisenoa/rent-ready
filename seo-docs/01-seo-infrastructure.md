# SEO Infrastructure Specification — RentReady

> This document provides the SEO infrastructure blueprint for the Senior Frontend Engineer to implement. All files are to be created in the `/home/ubuntu/rent-ready/` project directory.

---

## 1. sitemap.xml

**File:** `/home/ubuntu/rent-ready/public/sitemap.xml`

The sitemap should include all public marketing pages, blog posts, and tool pages. It should NOT include dashboard pages, API routes, or auth pages.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Marketing Pages -->
  <url>
    <loc>https://www.rentready.fr/</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/pricing</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/demo</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/gestion-locative</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/bail</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/quittances</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/locations</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/maintenance</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog -->
  <url>
    <loc>https://www.rentready.fr/blog</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/comment-gerer-loyers-impayes</loc>
    <lastmod>2026-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/revision-loyer-irl-guide-complet</loc>
    <lastmod>2026-01-10</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/depot-garantie-regles-essentielles</loc>
    <lastmod>2026-01-05</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/etat-des-lieux-entree-sortie</loc>
    <lastmod>2026-02-20</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/loi-alur-proprietaire-bailleur</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/blog/optimiser-fiscalite-loyers</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Tools / Outils -->
  <url>
    <loc>https://www.rentready.fr/outils/modele-bail-location</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/outils/modele-quittance-loyer-pdf</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/outils/lettre-relance-loyer</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/outils/calculateur-depot-garantie</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/outils/calculateur-irl-2026</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/outils/simulateur-loi-jeanbrun</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Glossary -->
  <url>
    <loc>https://www.rentready.fr/glossaire-immobilier</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Legal Pages -->
  <url>
    <loc>https://www.rentready.fr/cgu</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/mentions-legales</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.rentready.fr/politique-confidentialite</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- City Pages (Gestion locative par ville) -->
  <!-- Dynamic city pages should be added programmatically -->

</urlset>
```

**Dynamic sitemap note:** For the `/gestion-locative/[ville]` dynamic city pages, generate sitemap entries programmatically using the `cities.json` data. Each city page should be added with priority 0.7 and changefreq monthly.

---

## 2. robots.txt

**File:** `/home/ubuntu/rent-ready/public/robots.txt`

```txt
# RentReady robots.txt
# https://www.rentready.fr/robots.txt

User-agent: *
Allow: /
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /dashboard/*
Disallow: /app/*
Disallow: /portal/*
Disallow: /*.json$
Disallow: /*.tsx$

# Allow well-known files
Allow: /favicon.ico
Allow: /sitemap.xml
Allow: /robots.txt

# Sitemap location
Sitemap: https://www.rentready.fr/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 10
```

---

## 3. JSON-LD Structured Data Specifications

All JSON-LD should be implemented as React components in `/home/ubuntu/rent-ready/src/components/seo/` following the patterns already established in `organization-schema.tsx` and `schema-markup.tsx`.

### 3.1 Homepage
Already implemented in `src/app/page.tsx` — verified. Contains `SoftwareApplication`, `Organization`, and `Service` schemas.

### 3.2 Blog Article Pages
For `/app/(marketing)/blog/[slug]/page.tsx`, add:
```typescript
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article excerpt",
  "author": {
    "@type": "Organization",
    "name": "RentReady"
  },
  "publisher": {
    "@type": "Organization",
    "name": "RentReady",
    "url": "https://www.rentready.fr"
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-04-07",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.rentready.fr/blog/article-slug"
  }
}
```

### 3.3 FAQ Pages
For any page with FAQ content (e.g., pricing, outils pages), implement `FAQPage` schema using the `faqPageSchema()` factory already in `schema-markup.tsx`.

### 3.4 HowTo Pages
For calculator pages (`/outils/calculateur-*`), add `HowTo` schema:
```typescript
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Calculateur de dépôt de garantie",
  "description": "Calculez le dépôt de garantie légal pour votre location",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Entrez le montant du loyer",
      "text": "Saisissez le montant du loyer mensuel hors charges"
    },
    {
      "@type": "HowToStep",
      "name": "Sélectionnez le type de location",
      "text": "Choisissez entre location vide ou meublée"
    },
    {
      "@type": "HowToStep",
      "name": "Obtenez le résultat",
      "text": "Le calculateur affiche le plafond légal du dépôt de garantie"
    }
  ]
}
```

### 3.5 Breadcrumb Schema
All pages should include breadcrumb JSON-LD. Use the existing `BreadcrumbSchema()` component. The Home page does not need breadcrumbs. All other pages should include:
- Home > [Current Page]

---

## 4. Open Graph (OG) Tag Guidelines

Every marketing page MUST include these Open Graph meta tags in the Next.js `metadata` export:

```typescript
openGraph: {
  title: "Page Title — RentReady",          // ≤ 60 chars
  description: "Page description.",         // ≤ 155 chars
  url: "https://www.rentready.fr/page-slug",
  type: "website",
  siteName: "RentReady",
  locale: "fr_FR",
  images: [{
    url: "https://www.rentready.fr/og-image.png",
    width: 1200,
    height: 630,
    alt: "RentReady — Page description",
  }],
},
```

### OG Image Requirements
- Recommended size: 1200×630px
- Always use `/og-image.png` unless a page-specific OG image is created
- The generic OG image must be created at `/home/ubuntu/rent-ready/public/og-image.png`
- OG image design: Clean brand, RentReady logo, clear value proposition in French

### Twitter Card
```typescript
twitter: {
  card: "summary_large_image",
  title: "Page Title — RentReady",
  description: "Page description.",
  site: "@rentready_fr",
  creator: "@rentready_fr",
  images: ["https://www.rentready.fr/og-image.png"],
},
```

---

## 5. Core Web Vitals Optimization

### 5.1 Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay) / **INP**: < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB**: < 800ms

### 5.2 Implementation Checklist

**Images:**
- All images must use Next.js `<Image>` component with explicit `width` and `height`
- Use WebP/AVIF formats (already configured in next.config.ts)
- Implement `priority` prop on hero/above-the-fold images
- Add `loading="lazy"` on below-the-fold images
- Always include descriptive `alt` text

**Fonts:**
- Use `next/font` for Google Fonts (already optimized)
- Do not load fonts via `<link>` in `<head>` — use the CSS variable approach
- Subset fonts to Latin Extended characters (French accented characters: é, è, ê, à, â, ô, û, î, ï, ç)

**JavaScript:**
- Keep JS bundles small; use dynamic imports for below-the-fold components
- Defer non-critical scripts
- Avoid large third-party scripts on marketing pages

**CSS:**
- Use Tailwind CSS (already in use) — no external CSS frameworks
- Avoid unused CSS; keep stylesheets minimal

**Rendering:**
- Marketing pages use App Router with React Server Components by default
- Only add `"use client"` when interactivity is required
- Avoid client-side rendering for static content pages

**Third-party embeds:**
- YouTube/vimeo videos: use `lite-youtube-embed` or facade pattern
- Avoid blocking third-party scripts

**API Routes:**
- Keep API route handlers lean
- Use streaming for responses where appropriate

### 5.3 Monitoring
- Install `@next/third-parties` for Google analytics if needed
- Use Web Vitals API for real user monitoring
- Set up Lighthouse CI in the deployment pipeline

---

## 6. Meta Title & Description Templates

Use these templates consistently across all pages:

### Page-Type Templates

| Page Type | Meta Title Template | Meta Description Template |
|-----------|--------------------|--------------------|
| Homepage | RentReady — Gestion locative automatisée pour propriétaires | Quittances conformes, détection des virements, révision IRL automatique. Le pilote automatique des propriétaires bailleurs. Essai gratuit 14 jours. |
| Feature Page | [Feature] — Logiciel gestion locative | [2-3 sentence feature description]. Simplifiez votre gestion. Essai gratuit. |
| Pricing | Tarifs RentReady — [price]/mois, essai gratuit | [Key differentiators]. Sans engagement. |
| Blog Article | [Article Title] — Blog RentReady | [Article excerpt, max 155 chars] |
| Outil Page | [Tool Name] — Outil gratuit RentReady | [Tool purpose description]. Gratuit, sans inscription. |
| Glossary | Glossaire Immobilier — Définitions Location et Investissement | [Brief description]. [N] définitions pour propriétaires. |
| City Page | Gestion locative à [City] — Logiciel pour propriétaires | Logiciel de gestion locative à [City]. Quittances, suivi loyers, conformité. Essai gratuit. |
| Legal | [Page Name] — RentReady | [Brief description of the legal document]. |

### Character Limits
- Meta title: 50-60 characters
- Meta description: 140-155 characters
- H1: 60-70 characters
- H2: 50-60 characters
- SEO summary: 140-155 characters

---

## 7. URL Structure

| Page | URL | Canonical |
|------|-----|-----------|
| Homepage | `/` | `https://www.rentready.fr` |
| Pricing | `/pricing` | `https://www.rentready.fr/pricing` |
| Demo | `/demo` | `https://www.rentready.fr/demo` |
| Gestion locative | `/gestion-locative` | `https://www.rentready.fr/gestion-locative` |
| Gestion locative (city) | `/gestion-locative/[ville]` | Dynamic |
| Bail | `/bail` | `https://www.rentready.fr/bail` |
| Quittances | `/quittances` | `https://www.rentready.fr/quittances` |
| Locations | `/locations` | `https://www.rentready.fr/locations` |
| Maintenance | `/maintenance` | `https://www.rentready.fr/maintenance` |
| Blog index | `/blog` | `https://www.rentready.fr/blog` |
| Blog article | `/blog/[slug]` | Dynamic |
| Outil | `/outils/[slug]` | Dynamic |
| Glossary | `/glossaire-immobilier` | `https://www.rentready.fr/glossaire-immobilier` |
| CGU | `/cgu` | `https://www.rentready.fr/cgu` |
| Mentions légales | `/mentions-legales` | `https://www.rentready.fr/mentions-legales` |
| Politique confidentialité | `/politique-confidentialite` | `https://www.rentready.fr/politique-confidentialite` |

**Rules:**
- All lowercase, hyphen-separated
- No file extensions in URLs
- No trailing slashes
- Include `alternates: { canonical: "..." }` in every page's metadata export
- Use `hreflang="fr"` on all pages

---

## 8. Internal Linking Strategy

### Hub Pages (highest authority)
1. Homepage `/` — links to all feature pages
2. Blog `/blog` — links to articles and feature pages
3. Glossary `/glossaire-immobilier` — links to articles and tools
4. `/gestion-locative` — links to city pages and tools

### Internal Linking Rules
- Every blog article must link to at least 2 other articles or tool pages
- Every tool page must link to at least 1 relevant article
- Every feature page must link to pricing and demo
- Footer must include links to CGU, mentions légales, politique confidentialité
- Blog articles should include a CTA section at the bottom linking to relevant product features
- Glossary terms should internally link to related glossary terms and relevant articles

### Anchor Text Rules
- Use descriptive anchor text (not "click here" or "en savoir plus")
- Include target keywords where natural
- Example good anchor: `<Link href="/quittances">générer des quittances de loyer</Link>`

---

## 9. Image Alt Text Guidelines

Every image must have descriptive, keyword-appropriate alt text:

| Image Type | Alt Text Rule | Example |
|-----------|-------------|---------|
| Hero image | Describe the visual + include brand | "Interface RentReady : tableau de bord d'un propriétaire bailleur" |
| Feature icons | Describe the feature | "Icône de vérification automatique des loyers" |
| Blog thumbnails | Article title | "Guide complet gestion loyers impayés 2026" |
| Social proof logos | Company name + context | "Logo de MediaProperty, magazine de l'immobilier" |
| Tool screenshots | Action shown | "Capture d'écran du calculateur de dépôt de garantie" |
