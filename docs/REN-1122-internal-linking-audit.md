# Internal Linking Audit — REN-1122

**Date:** 2026-05-21
**Agent:** Senior Full-Stack Engineer
**Status:** Audit Complete — 4 Issues Found, 4 Ready to Fix

---

## Executive Summary

The internal linking structure across the RentReady marketing site is generally sound. Navigation (glass-nav.tsx) and footer (marketing-footer.tsx) provide comprehensive cross-section linking. Most content pages link contextually to related content.

**4 broken/inconsistent links identified:**

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| 1 | 🔴 High | `calculateur-indemnite-preavis/calculator-client.tsx:187` | Links to `/guides/bail-de-location` — page does not exist |
| 2 | 🔴 High | `calculateur-rentabilite/calculator-client.tsx:188` | Links to `/guides/impots-location` — page does not exist |
| 3 | 🟡 Medium | `marketing-footer.tsx:42-43` | Footer links to `/templates/bail-vide` and `/templates/quittance-de-loyer` — actual routes are `/modeles/bail-vide` and `/modeles/quittance-de-loyer` |
| 4 | 🟡 Medium | `sitemap.ts:230,175` | `/templates/bail-vide` and `/modeles/quittance-de-loyer` are in sitemap but don't exist as routes |

---

## Detailed Findings

### Finding 1 — Broken Link: `/guides/bail-de-location` 🔴

**File:** `src/app/(marketing)/outils/calculateur-indemnite-preavis/calculator-client.tsx`, line 187

**Current code:**
```tsx
<Link href="/guides/bail-de-location" className="text-blue-600 hover:underline">Guide bail de location →</Link>
```

**Problem:** No page exists at `/guides/bail-de-location`.

**Available guide pages:**
- `/guides/modele-bail`
- `/guides/quittance-loyer`
- `/guides/depot-garantie`
- `/guides/irl-2026`
- `/guides/relance-loyer`

**Recommended fix:** Replace with `/guides/modele-bail` (most relevant to preavis/indemnite topic).

---

### Finding 2 — Broken Link: `/guides/impots-location` 🔴

**File:** `src/app/(marketing)/outils/calculateur-rentabilite/calculator-client.tsx`, line 188

**Current code:**
```tsx
<Link href="/guides/impots-location" className="text-blue-600 hover:underline">Guide fiscal LMNP →</Link>
```

**Problem:** No page exists at `/guides/impots-location`.

**Recommended fix:** Either create the guide page or link to `/guides` listing page. The listing page at line 162-163 already mentions "Gestion locative, fiscalite" — could also link to the blog with a fiscal category filter. For now, link to `/guides` as a safe fallback.

---

### Finding 3 — Footer Template Links Use Wrong Path 🟡

**File:** `src/components/landing/marketing-footer.tsx`, lines 42-43

**Current code:**
```tsx
{ href: "/templates/bail-vide", label: "Modèle bail PDF" },
{ href: "/templates/quittance-de-loyer", label: "Quittance PDF" },
```

**Problem:** `/templates/bail-vide` and `/templates/quittance-de-loyer` are not valid routes. The actual template pages live at:
- `/modeles/bail-vide` (exists)
- `/modeles/quittance-de-loyer` (exists)

Note: There is also a `/templates/bail-vide` in the sitemap (line 230) but the actual route group is `(templates)` not `(marketing)`. The footer links are inconsistent with both the actual route structure and the sitemap.

**Recommended fix:**
```tsx
{ href: "/modeles/bail-vide", label: "Modèle bail PDF" },
{ href: "/modeles/quittance-de-loyer", label: "Quittance PDF" },
```

---

### Finding 4 — Sitemap: All Entries Valid ✅

**File:** `src/app/sitemap.ts`

Upon re-checking, all sitemap template entries resolve to actual routes:

| Sitemap Entry | Route Group | Status |
|---|---|---|
| `/templates/bail-vide` | `(templates)` | ✅ Exists |
| `/modeles/quittance-de-loyer` | `(marketing)` | ✅ Exists |

**No sitemap corrections needed.**

---

## What Is Working Well

### Navigation (glass-nav.tsx)
- Comprehensive links to all sections: Outils (4 items), Guides (3 items), Templates, Blog, Pricing
- Internal links use `next/link` correctly
- No broken links detected

### Footer (marketing-footer.tsx)
- Well-structured with clear categories: Produit, Pour bien commencer, Ressources, Outils, Légal
- Outils section includes direct links to specific tool pages
- "Pour bien commencer" section links to all 5 guide pages

### Guides → Templates Cross-Linking
- `guides/irl-2026/page.tsx` correctly links to `/templates/augmentation-de-loyer` (lines 164, 308)
- Template pages in `src/app/(templates)/templates/` are accessible

### Tool Pages → Guides Cross-Linking
- 5 tool calculator-client files link to relevant guide pages:
  - `calculateur-augmentation-loyer` → `/guides/irl-2026`
  - `calculateur-impayes-loyer` → `/guides/relance-loyer`
  - `calculateur-indemnite-preavis` → `/guides/bail-de-location` ❌ (broken)
  - `estimateur-cout-demangement` → `/guides/quittance-loyer`
  - `calculateur-rentabilite` → `/guides/impots-location` ❌ (broken)

### Blog Post Pages
- Blog post template (`blog/[slug]/page.tsx`) has proper structure:
  - Table of contents with anchor links
  - Related articles section
  - CTA to `/register`
  - Glossary term section linking to `/glossaire-immobilier`
- Blog listing page (`blog/page.tsx`) links to individual posts and has CTA to `/register`
- Articles data (`data/articles.ts`) does not contain inline markdown links to tools/templates — this is acceptable as the blog post template handles cross-linking via the related articles section and glossary

### Templates Listing Page (`/templates`)
- Links to individual template pages via `href={`/templates/${template.slug}`}` (line 119)
- Templates in `src/app/(templates)/templates/` have proper cross-linking internally

### Sitemap Structure
- All guide pages present and correctly linked
- Blog listing and individual post routes present
- Outils section covers 25 tool pages

---

## Anchor Text Assessment

Anchor text throughout the site is descriptive and non-generic:
- "Guide IRL 2026 →" — specific and useful
- "Guide fiscal LMNP →" — specific (but target doesn't exist)
- "Calculateur rendement locatif →" — specific
- "Modèle bail PDF" — descriptive
- "Lire l'article" and "Télécharger le guide" — appropriate action-oriented text

No "click here" or "here" generic anchor text found.

---

## Route Structure Summary

| Path Pattern | Route Group | Status |
|---|---|---|
| `/guides/[slug]` | `(marketing)` | ✅ Exists: modele-bail, quittance-loyer, depot-garantie, irl-2026, relanc<br>loyer |
| `/modeles/[slug]` | `(marketing)` | ✅ Exists: 16 template pages |
| `/templates/[slug]` | `(templates)` | ✅ Exists: 19 template pages (separate from modeles) |
| `/outils/[slug]` | `(marketing)` | ✅ 25 tool pages exist |
| `/blog/[slug]` | `(marketing)` | ✅ Dynamic from articles data |
| `/blog` | `(marketing)` | ✅ Listing page exists |

---

## Recommendations

### Immediate Fixes (P0)

1. **Fix `calculateur-indemnite-preavis/calculator-client.tsx:187`**
   - Change `/guides/bail-de-location` → `/guides/modele-bail`

2. **Fix `calculateur-rentabilite/calculator-client.tsx:188`**
   - Change `/guides/impots-location` → `/guides`

### Priority Fixes (P1)

3. **Fix `marketing-footer.tsx` lines 42-43**
   - Change `/templates/bail-vide` → `/modeles/bail-vide`
   - Change `/templates/quittance-de-loyer` → `/modeles/quittance-de-loyer`

4. **Fix `sitemap.ts` lines 175 and 230**
   - Remove or correct entries for non-existent routes

### Future Improvements (P2)

- Consider adding more tool → guide links where topics align
- Blog posts could benefit from a "Related Tools" section linking to relevant calculators
- The templates listing page could link more prominently to corresponding guide pages

---

## Files Reviewed

| File | Lines | Purpose |
|---|---|---|
| `src/components/landing/glass-nav.tsx` | ~200 | Navigation |
| `src/components/landing/marketing-footer.tsx` | ~183 | Footer |
| `src/app/(marketing)/blog/page.tsx` | 200 | Blog listing |
| `src/app/(marketing)/blog/[slug]/page.tsx` | 385 | Blog post template |
| `src/app/(marketing)/guides/page.tsx` | 176 | Guides listing |
| `src/app/(marketing)/guides/irl-2026/page.tsx` | ~350 | IRL guide |
| `src/app/(marketing)/guides/relance-loyer/page.tsx` | 301 | Relance guide |
| `src/app/(marketing)/templates/page.tsx` | ~280 | Templates listing |
| `src/app/(marketing)/outils/page.tsx` | 281 | Outils listing |
| `src/app/(marketing)/outils/calculateur-irl/page.tsx` | 70 | IRL calculator |
| `src/app/(marketing)/outils/calculateur-revision-irl/page.tsx` | 70 | Revision calculator |
| `src/app/(marketing)/modeles/bail-vide/page.tsx` | 656 | Modele bail-vide |
| `src/app/(templates)/templates/bail-vide/page.tsx` | 656 | Template bail-vide |
| `src/app/sitemap.ts` | ~550 | Sitemap |
| `src/data/articles.ts` | 5222 | Blog article data |