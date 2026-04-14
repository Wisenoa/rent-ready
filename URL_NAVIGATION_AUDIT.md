## SEO-Friendly URL Structure & Navigation Audit — REN-134

**Product Designer execution**

---

### 1. URL Structure Review ✅

**Finding: URL structure is excellent.**

| URL | Format | Assessment |
|---|---|---|
| `/` | Root | ✅ Clean |
| `/gestion-locative` | French keyword | ✅ Descriptive, no ID leakage |
| `/gestion-locative/[city]` | Programmatic SEO | ✅ Correct slug pattern |
| `/locations` | French keyword | ✅ Human-readable |
| `/bail` | French keyword | ✅ Concise, correct |
| `/quittances` | French keyword | ✅ |
| `/maintenance` | French keyword | ✅ |
| `/pricing` | English (industry standard) | ✅ Acceptable |
| `/features` | English | ✅ Standard SaaS convention |
| `/demo` | English | ✅ Standard |
| `/blog` | English | ✅ Standard |
| `/glossaire-immobilier` | French keyword | ✅ Excellent |
| `/mentions-legales` | French keyword | ✅ Legal standard |
| `/politique-confidentialite` | French keyword | ✅ |
| `/cgu` | French acronym | ✅ |
| `/templates/[type]` | Semantic folder | ✅ Clean |
| `/outils/[tool]` | Semantic folder | ✅ Clean |

**No issues found:**
- No auto-generated numeric IDs in URLs
- No deep nesting beyond 3 levels
- All URLs are descriptive and human-readable

**Minor note:** `/features` is English while all other marketing pages are in French. This is acceptable since "features" is a common SaaS convention and widely understood in France. However, for French-localized consistency, `/fonctionnalites` would be more on-brand.

---

### 2. Navigation & Link Equity Distribution ✅

**Header Nav (GlassNav):**
- Links to: `/gestion-locative`, `/locations`, `/bail`, `/quittances`, `/pricing`
- Missing from header: `/demo`, `/blog`, `/glossaire-immobilier`, `/templates`
- Demo is accessible via CTA buttons — acceptable UX but reduces SEO link equity

**Homepage Link Equity:**
- Homepage links to main 5 nav pages — good primary distribution
- Footer provides comprehensive secondary navigation (4 categories + social)
- `/templates` is in footer but not linked from homepage hero — key missed link equity opportunity for high-intent SEO pages

**Footer Assessment:**
- ✅ Comprehensive: Produit, Ressources, Outils, Légal
- ⚠️ `/blog` under "Ressources" but not in main nav — blog is a critical SEO hub needing more prominent internal linking
- ⚠️ `/glossaire-immobilier` in footer but not cross-linked from blog posts — internal linking between glossary and articles strengthens topical authority
- ⚠️ `/templates` receives no homepage hero link — templates are high-intent SEO pages that deserve more visibility

**Link Equity Distribution Score: 7/10** — Core structure is good; distribution to content/tool pages could be stronger from the homepage.

---

### 3. Breadcrumb Implementation ⚠️

**Breadcrumb Schema:** Found on legal pages only (`/mentions-legales`, `/politique-confidentialite`, `/cgu`) via inline JSON-LD.

**Breadcrumb Issues:**
1. **Marketing pages do NOT have breadcrumb schema** — only legal pages have it
2. **No visual breadcrumb navigation component** on any marketing page
3. Dashboard pages have no breadcrumbs at all
4. `organization-schema.tsx` has a reusable `BreadcrumbList` component that could be used everywhere but is only wired into legal pages

**Recommendation:**
- Add a reusable `BreadcrumbSchema` component across all marketing inner pages
- Add a visual `BreadcrumbNav` component for user navigation
- Dashboard pages should also have breadcrumb trails (Dashboard > Properties > [Name])

**Priority: Medium** — BreadcrumbList schema contributes to rich results and helps search engines understand site hierarchy.

---

### 4. Schema Markup Review ⚠️

**Found schema types:**
- `SoftwareApplication` — homepage JSON-LD ✅
- `Organization` — homepage JSON-LD ✅
- `BreadcrumbList` — legal pages only ⚠️
- `WebPage` metadata — via Next.js Metadata API ✅

**Schema Issues:**
1. **BreadcrumbList missing from all marketing inner pages** — should be on: `/features`, `/pricing`, `/locations`, `/bail`, `/quittances`, `/maintenance`, `/demo`, `/blog`, `/glossaire-immobilier`, `/templates`, `/outils/*`
2. **No `BlogPosting` schema on blog posts** — each `/blog/[slug]` needs author, datePublished, dateModified
3. **No `FAQPage` schema on pricing page** — FAQ section exists but no structured data
4. **No `HowTo` schema on tool pages** — `/outils/calculateur-irl-2026` and similar should consider `HowTo`
5. **Organization schema** is well-structured ✅

---

### 5. Click Depth Review ✅

**All critical pages reachable within 2 clicks from homepage:**

```
Homepage (0 clicks)
  ├── /gestion-locative (1 click) ✅
  ├── /features (1 click) ✅
  ├── /pricing (1 click) ✅
  ├── /demo (1 click) ✅
  ├── /locations (1 click) ✅
  ├── /bail (1 click) ✅
  ├── /quittances (1 click) ✅
  ├── /maintenance (1 click) ✅
  ├── /blog (1 click) ✅
  ├── /glossaire-immobilier (1 click) ✅
  ├── /templates (1 click) ✅
  ├── /outils/calculateur-irl-2026 (2 clicks) ✅
  └── /gestion-locative/paris (2 clicks) ✅
```

**No orphan pages found.** Sitemap is comprehensive — includes all static pages, blog posts, template pages, tool pages, and city pages.

---

### 6. Robots.txt

`app/robots.ts` not found in expected location. Next.js generates a default (allowing all crawlers). A custom `robots.ts` should be added to:
- Disallow: `/dashboard`, `/portal`, `/api`, `/login`, `/register`
- Allow: all public marketing pages

---

### 7. Canonical URLs ✅

All inspected pages have proper `alternates: { canonical }` in Next.js Metadata:
- Homepage: `canonical: "https://www.rentready.fr"` ✅
- Pricing: `canonical: "https://www.rentready.fr/pricing"` ✅
- Locations: `canonical: "https://www.rentready.fr/locations"` ✅
- Programmatic city pages: `canonical: "https://www.rentready.fr/gestion-locative/[slug]"` ✅

**No duplicate content issues expected.**

---

## Summary: Prioritized Action List

| Priority | Action | Impact |
|---|---|---|
| **High** | Add BreadcrumbList schema to all marketing inner pages (features, pricing, blog, tools) | Rich results + hierarchy clarity |
| **High** | Add visual breadcrumb navigation component to marketing pages | UX + SEO |
| **Medium** | Add BlogPosting schema to each `/blog/[slug]` page | Rich results for articles |
| **Medium** | Add FAQPage schema to pricing page | SERP rich results |
| **Medium** | Create `/robots.ts` to disallow app/login pages from indexing | Prevents crawler waste |
| **Low** | Rename `/features` to `/fonctionnalites` for French consistency | Brand coherence |
| **Low** | Add `/templates`, `/blog`, `/glossaire-immobilier` to homepage or main nav | SEO link equity |
| **Low** | Add `HowTo` schema to tool pages (`/outils/*`) | SERP rich results |

---

## Overall Scores

| Category | Score | Notes |
|---|---|---|
| URL Structure | 9/10 | Clean, descriptive, French. No changes needed. |
| Navigation & Link Equity | 7/10 | Solid core. Content/blog/tools need more homepage visibility. |
| Breadcrumbs | 4/10 | Schema exists but only on legal pages. Visual breadcrumbs missing. |
| Schema Markup | 6/10 | Good foundation. Missing BreadcrumbList on most pages. |
| Click Depth | 10/10 | All pages within 2-3 clicks. No orphan pages. |

---

*Audit completed by Product Designer agent — 2026-04-13*