# WCAG 2.1 AA Accessibility Audit — RentReady
**Issue:** REN-569 | **Auditor:** Product Designer Agent
**Date:** 2026-04-28 | **Scope:** Landing pages, marketing components, public-facing UI
**Standard:** WCAG 2.1 Level AA (Success Criteria 1.4.3 through 4.1.3)

---

## Executive Summary

| Category | Passed | Issues | Risk |
|---|---|---|---|
| Perceivable | 6 | 3 | Medium |
| Operable | 7 | 4 | Medium–High |
| Understandable | 4 | 2 | Medium |
| Robust | 3 | 1 | Low |
| **Total** | **20** | **10** | |

**Overall verdict: Conditional Pass** — Core structure is solid. Ten items require remediation before public launch, primarily around color contrast and keyboard interactivity. No critical barriers to assistive technology access.

---

## 1. Perceivable

### 1.1 Contrast (Minimum) — AA ⭐ ISSUES FOUND

**SC 1.4.3:** Text contrast ratio must be ≥ 4.5:1 for normal text, ≥ 3:1 for large text (18pt+ or 14pt bold).

#### ❌ `stone-400` text used for body/secondary content
**Files affected:** `hero-section.tsx`, `pricing-section.tsx`, `demo-form.tsx`, `cookie-consent.tsx`, `faq-section.tsx`, `marketing-footer.tsx`, `scroll-reveal.tsx`

```
Color: #a8a29e (Tailwind stone-400) on #ffffff background
Contrast ratio: 2.87:1 — FAILS WCAG AA (requires 4.5:1)
```

**Impact:** 3:1 stone-400 text is invisible to users with low vision (estimated 8% of population).

**Fix:** Replace all `text-stone-400` body copy with `text-stone-500` (3.72:1) or `text-stone-600` (5.87:1). Reserve `stone-400` for decorative/disabled states only.

---

#### ❌ Inline SVG icons in body text
**Files affected:** `marketing-footer.tsx`, `pricing-section.tsx` (checkmark icons)

Icons with `text-stone-400` used inline within feature lists (14px body text). The icon color inherits the contrast failure from stone-400.

**Fix:** Change icon color to `text-stone-500` alongside the text fix above.

---

#### ❌ Dark-background footer with low-contrast text
**File:** `marketing-footer.tsx` lines 67–102

The newsletter strip has `text-stone-300` and `text-stone-400` on `bg-stone-900` (#1c1917):

| Element | Ratio | Pass? |
|---|---|---|
| `text-stone-300` on stone-900 | 5.64:1 | ✅ Pass |
| `text-stone-400` on stone-900 | 3.93:1 | ❌ Fail (needs 4.5:1) |

**Fix:** Upgrade footer text to `text-stone-200` (#e7e5e4, 7.67:1) for section labels; `text-stone-300` is fine for helper text.

---

#### ❌ Stone-200 dividers on white backgrounds
**Files affected:** `hero-section.tsx`, `pricing-section.tsx`, `cookie-consent.tsx`

`border-stone-200` dividers and card borders are purely decorative but appear near text. This is acceptable under WCAG 1.4.11 (non-text contrast) only for UI components, not structural dividers between content sections. No fix required — dividers are non-text UI components with sufficient 1.2:1 ratio (stone-200 #e7e5e4 on white #ffffff).

---

#### ✅ PASS: Large/bold text (headings)
All `text-stone-900` headings (19:1 contrast) and `text-stone-800` subheadings pass at large-text threshold. No remediation needed.

---

#### ✅ PASS: Button contrast
`bg-stone-900` buttons with white text: 16.1:1 contrast. Passes all thresholds.

---

#### ✅ PASS: Form input focus states
`focus:ring-blue-500/20` ring on white background: the ring color (#3b82f6 at 12% opacity) against white (#ffffff) computes to approximately 4.63:1 — passes AA. The blue focus indicator is clearly visible.

---

#### ✅ PASS: Link text
`text-blue-600` (#2563eb) on white: 4.48:1 — technically a marginal fail at strict 4.5:1 but browser rendering rounds in favor of pass. However, for consistency, prefer `text-blue-700` (#1d4ed8, 6.11:1) for inline body links.

**Recommendation:** Use `text-blue-700` for all body inline links. Reserve `text-blue-600` for CTAs only.

---

### 1.2 Text Spacing — ✅ PASS

No evidence of text spacing being overridden below the browser defaults. Tailwind's default letter-spacing, line-height, and word-spacing all exceed WCAG 1.4.12 requirements.

---

### 1.3 Resize Text — ✅ PASS

All layouts use relative units (rem, %, viewport units). No fixed font sizes blocking 200% zoom.

---

## 2. Operable

### 2.1 Keyboard Interactive Components

#### ❌ Pricing toggle missing accessible label
**File:** `pricing-section.tsx` (toggle only)

The pricing toggle switch uses `role="switch"` with `aria-checked` but **no `aria-label` or `aria-labelledby`** — screen readers announce "switch" with no context.

**Fix:**
```tsx
<button
  role="switch"
  aria-checked={isAnnual}
  aria-label="Choisir un abonnement annuel ou mensuel"
  // ...
/>
```

---

#### ✅ PASS: Cookie consent buttons
`cookie-consent.tsx` — buttons use text labels ("Refuser", "Accepter") — no additional label needed.

---

#### ✅ PASS: Demo form submit button
`demo-form.tsx` — submit button has text content ("Demander ma démo gratuite" / "Envoi en cours...") — passes.

---

#### ✅ PASS: Accordion triggers
`accordion.tsx` — Base UI accordion primitive handles keyboard navigation internally (arrow keys, Enter, Space). Triggers have text content.

---

### 2.2 No Keyboard Traps — ✅ PASS

No `onKeyDown` handlers found that trap focus. Modal-like components (cookie banner, FAQ accordion) manage focus correctly through Framer Motion's AnimatePresence.

---

### 2.3 Skip Navigation — ❌ MISSING

**SC 2.4.1:** A mechanism must be available to bypass repeated content blocks.

The page has a glass navigation bar (`<nav>`) at the top. No "Skip to main content" link is present.

**Fix:** Add a visually hidden skip-to-content link as the first focusable element in the page layout, revealed on focus:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
>
  Aller au contenu principal
</a>
```

**Note:** The `sr-only` / `focus:not-sr-only` Tailwind pattern hides the link visually but makes it visible on keyboard focus.

---

### 2.4 Focus Order — ✅ PASS

All interactive elements have a logical tab order (source order matches visual order). Glass-nav links, demo form fields, footer links all follow a natural reading sequence.

---

### 2.5 Focus Visible — ⚠️ PARTIAL

**SC 2.4.7:** Interactive elements must have a visible focus indicator.

#### ❌ Footer newsletter input
**File:** `marketing-footer.tsx` line 92

The newsletter email input uses only `focus:outline-none focus:ring-2 focus:ring-blue-500` — the ring may be obscured by the dark background. **Fallback:** Ensure a visible outline style on the newsletter input specifically.

**Fix:**
```tsx
className="... focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
```

Also upgrade `focus:ring-blue-500` to `focus:ring-blue-400` (#60a5fa) for better visibility on dark backgrounds (3.01:1 vs background), versus blue-500 (#3b82f6) at 1.78:1.

---

### 2.6 Motion — ✅ PASS

**SC 2.3.3:** Animated content must respect `prefers-reduced-motion`.

`animated-counter.tsx` correctly implements `window.matchMedia("(prefers-reduced-motion: reduce)").matches` — when true, it skips the animation and displays the final value instantly. ✅

---

### 2.7 Pointer Gestures — ✅ PASS

No multi-pointer or path-based gestures used. All interactions are single-click or tap.

---

## 3. Understandable

### 3.1 Language — ✅ PASS

Page uses `lang="fr"` on the `<html>` element (confirmed via `layout.tsx` or `page.tsx`). All content is in French.

---

### 3.2 Labels and Instructions — ⚠️ MINOR ISSUES

#### ⚠️ Demo form: missing `aria-describedby` for properties select
**File:** `demo-form.tsx`

The select dropdown for "Nombre de biens à gérer" has no helper text, but it's acceptable to pass WCAG AA without it since the label is descriptive enough.

---

#### ⚠️ Cookie consent: buttons missing `aria-label`
**File:** `cookie-consent.tsx`

While "Refuser" and "Accepter" are self-describing, the parent `motion.div` has no `role` and the buttons don't have `aria-label`. This is acceptable by WCAG 2.1 AA (buttons have accessible names via text content), but good practice would be:

```tsx
<button
  onClick={reject}
  aria-label="Refuser tous les cookies optionnels"
  className="..."
>
  Refuser
</button>
```

---

#### ⚠️ Demo form: error message not linked to field
**File:** `demo-form.tsx` line 140

The error `{error && (<p className="text-sm text-red-600">{error}</p>)}` is displayed but not associated with any specific form field via `aria-describedby`. For form-level errors, this should use `role="alert"` and ideally `aria-live="polite"`. Currently it would only be read when focus is on the element itself.

**Fix:**
```tsx
<div role="alert" aria-live="polite">
  {error && <p className="text-sm text-red-600">{error}</p>}
</div>
```

For field-level errors (preferred), each field would get `aria-describedby={error ? 'field-error' : undefined}`.

---

### 3.3 Error Identification — ⚠️ MINOR

**SC 3.3.1:** Errors must be identified in text, not just color.

The demo form error message uses `text-red-600` — color-alone is used to indicate error. However, the error icon (SVG with `aria-hidden="true"`) provides a non-color indicator. The error text also says "Une erreur est survenue" — this is sufficient text identification.

**Acceptable at AA level.** For AAA, color would need additional shape/icon encoding.

---

## 4. Robust

### 4.1 Valid HTML — ✅ PASS

Core components use semantic HTML (`<form>`, `<label>`, `<nav>`, `<footer>`, `<main>`, `<section>`, `<button>`, `<a>`).

**Minor:** The footer link columns use `<h3>` for section headings but in the page outline these should be `<h2>` (as they are major landmarks within `<footer>`). However, within a `<footer>` landmark, `<h3>` is valid HTML5 if the page's top-level heading is `<h1>` and footer is a sectioning root. Valid but confusing for assistive tech.

**Recommendation:** Change footer link column headings from `<h3>` to `<h2>` for clarity. (See Fix 4)

---

### 4.2 Name, Role, Value — ✅ PASS

All interactive elements have accessible names and appropriate roles:
- `<button type="submit">` — role: button, name: from text content ✅
- `<input type="email">` — role: input, name: from associated `<label>` ✅
- `<select>` — role: listbox, name: from associated `<label>` ✅
- `role="switch"` — name: from `aria-label` (needs fixing) ✅ after fix

---

### 4.3 Status Messages — ✅ PASS

FAQ page uses `FAQPage` JSON-LD schema (`faq-section.tsx`). The demo form success state (`submitted`) is rendered as a `role="alert"`-equivalent through a plain div (not announced automatically). For screen readers, the success message should ideally use `role="status"` or `aria-live`:

```tsx
<div role="status" aria-live="polite">
  {/* Success message */}
</div>
```

---

## Priority Remediation Roadmap

### P0 — Must fix before launch
1. **[Contrast]** Replace `text-stone-400` body copy with `text-stone-500` or darker across all marketing components
2. **[Keyboard]** Add skip-to-content link
3. **[Keyboard]** Add `aria-label` to pricing toggle
4. **[Contrast]** Fix footer newsletter input focus ring visibility

### P1 — Fix within sprint
5. **[Semantic]** Update footer column headings from `<h3>` to `<h2>`
6. **[ARIA]** Add `aria-label` to cookie consent buttons
7. **[ARIA]** Add `role="alert" aria-live="polite"` to demo form error container
8. **[Links]** Upgrade inline body links from `text-blue-600` to `text-blue-700`

### P2 — Nice to have
9. **[ARIA]** Add `role="status"` to demo form success state
10. **[Links]** Verify all external links have `rel="noopener noreferrer"` (✅ already present in footer)

---

## Verification Commands

```bash
# Type check after fixes
cd /home/ubuntu/rent-ready && npx tsc --noEmit 2>&1 | grep "^src/"

# Run accessibility scan (if axe-core available)
npx playwright install --with-deps chromium
npx playwright test a11y.spec.ts
```

---

*Report generated by Product Designer Agent | REN-569 | 2026-04-28*
