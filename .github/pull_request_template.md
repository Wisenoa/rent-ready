## 🔍 SEO Checklist

> **All items must be checked before requesting review on PRs touching marketing pages.**
> Marketing pages live in `src/app/(marketing)/*`.

### Metadata
- [ ] New page exports a `metadata` object with `title` (< 60 chars) and `description` (120–160 chars)
- [ ] `openGraph` object is present with `og:title`, `og:description`, `og:image`
- [ ] `alternates.canonicals` is set
- [ ] `robots` is set to `{ index: true, follow: true }` (marketing pages)
- [ ] No duplicate `<title>` values across any marketing pages
- [ ] `metadata.description` length is between 120–160 characters

### Links & Images
- [ ] All `<img>` elements have a non-empty `alt` attribute
- [ ] No `<a href="javascript:void(0)">` or empty `href` attributes
- [ ] External links have `rel="noopener noreferrer"`
- [ ] No new broken internal links introduced
- [ ] No inline `style` attributes — use CSS classes (CLS safety)

### Structured Data
- [ ] JSON-LD schema is valid JSON (if added/modified)
- [ ] All required fields present per `@type`
- [ ] No `&lthead&gt;` or malformed JSON-LD blocks

### Content & Headings
- [ ] Page has exactly one `<h1>`
- [ ] No heading level skips (e.g., `<h1>` → `<h3>` without `<h2>`)
- [ ] No `console.log` / `console.debug` statements in production page code

### Sitemap
- [ ] New routes are added to `src/app/sitemap.ts`

### Performance (if changed)
- [ ] No images over 200KB added to marketing pages
- [ ] Images use `next/image` (not raw `<img>`)

---

### Files to check for regressions

| Page / Route | Check |
|---|---|
| `/` (homepage) | Metadata + schema + headings |
| `/pricing` | Metadata + schema + links |
| `/features` | Metadata + schema + images |
| `/demo` | Metadata + form labels |
| `/blog/*` | Metadata + OG tags |
| `/(marketing)/**` | All of the above |

---

> ⚠️ **CI blocks merging if metadata is missing or invalid.**
> Run `node seo-checks/meta-validator.js` locally before pushing.
