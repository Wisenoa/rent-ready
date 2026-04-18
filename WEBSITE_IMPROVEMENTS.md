# Website UX/UI Improvements — Design Audit 2026-04-18

> Status: Draft for Product Manager review. Prioritized by conversion impact.

---

## Summary

The site is well-structured with solid foundations. Most improvements below are **medium-effort, high-conversion-impact** tweaks — none require structural changes. The biggest wins are: (1) sticky CTA after scroll, (2) hero social proof reinforcement, (3) demo page trust signals, and (4) FAQ accordion open/close states.

---

## Priority 1 — Above-the-Fold Hero (Highest Conversion Impact)

### 1. Hero: Add live notification sound to phone mockup

**File:** `src/components/landing/hero-section.tsx`

**Current:** Phone mockup animates but shows a static notification "Loyer de 850 € reçu · Il y a 2 min".

**Problem:** The notification is always the same. It reads as staged/generic, which subtly undermines trust.

**Recommendation:** Cycle through 3 realistic notifications on a 6–8 second timer (different amounts, different tenants, different times ago). This creates the perception of an actively working system and demonstrates real-time detection.

```tsx
// Add state + useEffect cycling through notifications
const notifications = [
  { amount: "850 €", tenant: "M. Dupont", time: "il y a 2 min" },
  { amount: "720 €", tenant: "Mme Martin", time: "il y a 14 min" },
  { amount: "1 200 €", tenant: "SCI Dupont", time: "il y a 1h" },
];
```

### 2. Hero: Show logos of trusted press mentions from TrustLogos component

**File:** `src/components/landing/hero-section.tsx`

**Current:** Trust badges below CTA show security certifications but no social authority (press mentions).

**Problem:** `TrustLogos` has `mediaMentions` for Le Monde, Les Echos, Challenges but `showMedia` is never `true` on any page.

**Recommendation:** Add a "As seen in" strip to the hero area, below the trust badges:

```tsx
<p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
  Mentions presse
</p>
<div className="flex gap-6 mt-2">
  {["Le Monde", "Les Echos", "Challenges"].map((m) => (
    <span key={m} className="text-[14px] font-medium text-stone-400">{m}</span>
  ))}
</div>
```

### 3. Hero: Add a "How it works" micro-animation on scroll

**File:** `src/components/landing/hero-section.tsx`

**Current:** No indication of how the product works below the fold.

**Recommendation:** Add a single-line animated arrow + "Découvrez comment ça marche ↓" below the phone mockup or below the CTA block that smoothly scrolls to the ProblemSection. This reduces bounce by giving a clear next action.

---

## Priority 2 — Sticky Conversion (High Impact, Easy Win)

### 4. Sticky CTA after scroll

**File:** `src/components/landing/glass-nav.tsx`

**Current:** `GlassNav` has a static CTA button ("Commencer gratuitement") but no sticky banner appears after the user scrolls past the hero.

**Problem:** After scrolling past the hero, the only CTA is in the nav — which many users miss.

**Recommendation:** After 100vh of scroll, inject a slim sticky banner above the nav:

```tsx
// In GlassNav, add:
const [showBanner, setShowBanner] = useState(false);
useEffect(() => {
  const onScroll = () => setShowBanner(window.scrollY > window.innerHeight);
  // ...
}, []);

// Render conditionally:
{showBanner && (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-white text-center py-2 text-[13px] font-medium">
    Commencez gratuitement — sans carte bancaire{" "}
    <Link href="/register" className="underline">Créer un compte</Link>
  </div>
)}
```

---

## Priority 3 — Demo Page Trust Signals (Medium Impact)

### 5. Demo page: Add trust signals above the form

**File:** `src/app/(marketing)/demo/page.tsx`

**Current:** Demo page leads immediately with the form.

**Problem:** A cold visitor filling out a demo form is a high-commitment action — no trust signals near the form.

**Recommendation:** Between the page header and the form, add:
- **3 trust micro-points:** "2 400+ propriétaires · 14 jours gratuits · Annulation en 1 clic"
- **Security note:** Small lock icon + "Vos données sont sécurisées et ne seront jamais revendues."

### 6. Demo page: Add a "What to expect" section below form

**File:** `src/app/(marketing)/demo/page.tsx`

**Recommendation:** After the form submission (in the `DemoForm` component), or if `submitted` state, show a confirmation block with: "Confirmation envoyée ✓ · Notre équipe vous contacte sous 24h · Ajoutez un créneau à votre calendrier" with a CTA to add to Google Calendar / Outlook.

---

## Priority 4 — Pricing Page (Medium Impact)

### 7. Pricing: Add a "Most Popular" badge

**File:** `src/components/landing/pricing-section.tsx`

**Current:** No visual emphasis on the single plan.

**Recommendation:** Add a small ribbon or badge above the card:

```tsx
<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 text-white text-[11px] font-semibold px-3 py-1">
  Le plus complet
</div>
```

### 8. Pricing: Add a mini comparison table preview

**File:** `src/components/landing/pricing-section.tsx`

**Recommendation:** Add a tiny 2-column table (Agency ~7% vs RentReady 15€/mois) below the feature list, showing the concrete annual cost difference. This reinforces the value proposition visually.

### 9. Pricing: Add testimonials near the pricing card

**File:** `src/components/landing/pricing-section.tsx`

**Recommendation:** Add 2 short testimonial pull-quotes (name + 1 sentence) immediately below the pricing card, reinforcing social proof at the decision point. The existing `TestimonialsSection` exists on the homepage but is absent from pricing.

---

## Priority 5 — FAQ Section (Medium Impact)

### 10. FAQ: Show first item open by default on FAQPage

**File:** `src/components/landing/faq-section.tsx`

**Current:** All FAQ items are closed by default. Users may not engage with the accordion if they don't recognize a question.

**Recommendation:** Open the first FAQ item (the "Quel est le meilleur logiciel..." one) by default. This drives engagement and improves dwell time — a known SEO UX signal.

```tsx
// In FaqSection, set defaultValue on Accordion root:
<Accordion defaultValue={0}>
```

### 11. FAQ: Add a "Still have questions?" CTA below the accordion

**File:** `src/components/landing/faq-section.tsx`

**Recommendation:** After the accordion, add a small block:

> "Vous avez une question spécifique ? Notre équipe répond sous 24h."
> [Contacter le support] [Voir la démo]

---

## Priority 6 — Navigation & Footer (Low Effort, Good Impact)

### 12. Footer: Add a newsletter signup

**File:** `src/components/landing/marketing-footer.tsx`

**Recommendation:** Add a compact email capture field in the footer:

```tsx
<div className="mt-6">
  <p className="text-[13px] font-semibold text-stone-600 mb-2">Recevez nos actualités</p>
  <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
    <input type="email" placeholder="votre@email.fr" className="text-[13px] rounded-lg border border-stone-200 px-3 py-2 flex-1" />
    <button className="rounded-lg bg-stone-900 text-white text-[13px] px-3 py-2">OK</button>
  </form>
</div>
```

### 13. Footer: Add breadcrumb schema link trail to footer

**Problem:** Footer links are deep but not connected via BreadcrumbList schema for Google.

**Recommendation:** The footer already has great link structure. For the homepage, add a hidden `aria-label="Fil d'Ariane"` nav with Home > Footer section links to support BreadcrumbList schema. This helps Google understand site hierarchy.

### 14. Mobile nav: Improve menu contrast and close behavior

**File:** `src/components/landing/glass-nav.tsx` (mobile menu block)

**Recommendation:** The mobile menu overlay should:
- Close on outside click (backdrop click)
- Close on Escape key
- Trap focus inside open menu (accessibility)
- Have a visible close button (X) that is not just the hamburger toggle

### 15. Nav: Add breadcrumb to all marketing pages

**File:** All `src/app/(marketing)/*/page.tsx` files

**Problem:** Only the pricing page currently has breadcrumbs.

**Recommendation:** Add a shared `<MarketingBreadcrumb>` component to all marketing pages. Pattern:

```
Accueil > [Category] > [Page Title]
```

This is critical for SEO and UX — particularly on: `/features`, `/locations`, `/bail`, `/quittances`, `/blog/[slug]`, `/modeles/[slug]`.

---

## Priority 7 — Component Library & Design System

### 16. Standardize empty-state component

**Files:** `src/app/(dashboard)/*/page.tsx` (properties, tenants, leases)

**Problem:** Empty states exist (e.g. `PropertiesEmptyState`) but may not follow the new design language (glass morphism, rounded, backdrop-blur).

**Recommendation:** Audit all empty states against the marketing page design language — consistent: border radius (`rounded-3xl`), backdrop blur, icon treatment, CTA button style.

### 17. Add a reusable `<TrustScore>` component

**Problem:** Trust signals are scattered — some in `hero-section`, some in `testimonials-section`, some in `social-proof`.

**Recommendation:** Create a single `<TrustScore>` component that can be dropped onto any page with variant props:

```tsx
<TrustScore
  variant="compact" // | "full" | "minimal"
  stats={[{ value: "2 400+", label: "propriétaires actifs" }]}
  certifications={["RGPD", "DSP2", "CNIL"]}
  showMedia // only on homepage
/>
```

### 18. ContentReviewBadge: Add to all template and tool pages

**File:** Pages in `src/app/(marketing)/modeles/` and `src/app/(marketing)/outils/`

**Problem:** The `ContentReviewBadge` component exists but is not used on template/tool pages.

**Recommendation:** Add `<ContentReviewBadge updatedAt="2026-04-18" category="template" />` below the H1 on all template and tool pages. This is a direct E-E-A-T signal Google looks for.

---

## Quick Wins (Under 1 Hour Each)

| # | Improvement | File | Effort |
|---|-------------|------|--------|
| 1 | Cycle hero notifications | `hero-section.tsx` | 30 min |
| 10 | Open first FAQ by default | `faq-section.tsx` | 5 min |
| 7 | "Most Popular" badge | `pricing-section.tsx` | 10 min |
| 9 | Testimonials near pricing | `pricing-section.tsx` | 20 min |
| 12 | Newsletter in footer | `marketing-footer.tsx` | 20 min |
| 13 | Breadcrumb nav in footer | `marketing-footer.tsx` | 15 min |
| 14 | Mobile menu escape/outside click | `glass-nav.tsx` | 30 min |
| 18 | ContentReviewBadge on modeles/pages | `modeles/*/page.tsx` | 15 min |

---

## Medium Effort (1–3 Hours Each)

| # | Improvement | File | Effort |
|---|-------------|------|--------|
| 4 | Sticky CTA banner | `glass-nav.tsx` | 1–2h |
| 2 | Press mentions strip in hero | `hero-section.tsx` | 30 min |
| 5 | Trust signals above demo form | `demo/page.tsx` | 1h |
| 6 | "What to expect" after demo submit | `demo-form.tsx` | 1h |
| 8 | Cost comparison table on pricing | `pricing-section.tsx` | 1h |
| 11 | "Still have questions?" CTA | `faq-section.tsx` | 30 min |
| 15 | Breadcrumbs on all marketing pages | All marketing pages | 2–3h |
| 16 | Empty-state design audit | Dashboard pages | 2h |

---

## Longer Term (Structural)

| # | Improvement | Notes |
|---|-------------|-------|
| 3 | Hero scroll micro-animation | Requires scroll-linked animation design |
| 17 | Unified TrustScore component | Design system refactor |
| 9 | Pricing page testimonials | Needs copy writing |

---

## Coordination Notes

- Items marked **P1/P2** can be implemented directly without engineering review.
- Items 15 (breadcrumbs) require coordination with Senior Full-Stack for the shared component.
- Item 1 (hero notifications) should be validated with the Product Manager for notification copy.
- All changes should maintain the existing glass-morphism design language.
