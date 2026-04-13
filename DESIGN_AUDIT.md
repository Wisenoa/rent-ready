# Design Audit — RentReady

**Date:** 2026-04-13
**Auditor:** Product Designer Agent
**Scope:** Marketing pages + Dashboard pages + Landing components

---

## 1. Marketing Pages Audit

### 1.1 Homepage (`src/app/page.tsx`)

**Visual Hierarchy**
- Hero: Good hierarchy — eyebrow label, H1 with gradient, subheading, CTA, trust badges
- CTAs: Single primary CTA "Créer mon compte" — no secondary option for undecided visitors
- Phone mockup: Nice floating animation, shows a realistic success notification

**CTA Clarity**
- Primary CTA is clear. **Missing:** secondary CTA for demo request
- Trust line "Sans carte bancaire · Essai gratuit 14 jours" is excellent below the CTA

**Trust Signals**
- Trust badges (DSP2, Loi 1989, Factur-X) are present but placed far from the CTA — only visible if user reads the full hero copy
- No customer count, no "X landlords trust us" stat

**Social Proof Section Issues** (CRITICAL)
- `social-proof.tsx` shows **text labels only** — "Bridge", "Stripe", "INSEE", "Factur-X", "DSP2" — these are not logos, just styled text. This is a red flag: it looks like placeholder content
- Real testimonials exist in `testimonials-section.tsx` (good) but they're AFTER the pricing section — not visible on first scroll
- Trust badges in testimonials section use emoji flags (🇪🇺) which look unprofessional

**Mobile Layout**
- Hero text is responsive with `clamp()`. Phone mockup scales well.
- Section spacing is generous on mobile.

**Issues Found:**
1. Social proof logos look like fake placeholders
2. Trust badges too far from hero CTA
3. No visible testimonials above the fold
4. No stats/numbers (e.g., "500+ landlords", "10,000+ quittances")
5. No second CTA for demo-seekers

---

### 1.2 Pricing Page (`src/app/(marketing)/pricing/page.tsx`)

**Layout**
- Single card — clean and focused
- Annual plan shown with "2 mois offerts" badge
- Good FAQ section

**Issues:**
1. Annual/monthly toggle is missing — user must read to find the annual option
2. "2 mois offerts" badge is small and easy to miss above the price
3. No comparison table visual anchor (it exists but is below the fold)
4. No guarantee or "no credit card" reminder near the CTA
5. CTA is just a text link-style button — no visual prominence vs. homepage CTA

---

### 1.3 Features Page (`src/app/(marketing)/features/page.tsx`)

**Strengths**
- Good alternating layout (image left/right)
- Feature groups with icons and bullet points
- Quick-scan checklist above the fold
- Integration strip at the bottom

**Issues:**
1. **Placeholder visuals** — each feature group shows a large blurred icon in a gray gradient box. These are NOT product screenshots — visitors can't see the actual product. This is a major conversion issue.
2. "Historique поиска" (Russian text) in one feature detail — must be corrected to French
3. The "quick-scan" checklist section is good but could be more scannable with larger checkmark icons
4. No interactive demo element — everything is static text

---

### 1.4 Demo Page (`src/app/(marketing)/demo/page.tsx`)

**Strengths**
- Clear agenda items
- Good benefit bullets
- Form is in a card on the right

**Issues:**
1. No phone/contact alternative — form-only is high-friction for some users
2. No urgency/scarcity element (available slots)

---

### 1.5 Landing Components (`src/components/landing/`)

**Strengths**
- GlassNav: sticky with scroll-based background transition — excellent
- HeroSection: great gradient, animated phone mockup
- TestimonialsSection: beautiful card design with quote icon, stars, hover effect
- FinalCta: dramatic dark section, good contrast with white CTA
- PricingSection: hover float effect on the card

**Issues:**
1. **Text logo "RentReady"** — the nav uses a plain text "R" in a box. A proper SVG logo would look more professional
2. Testimonials use emoji trust badges (🇪🇺, 🔐, 📜) — should use SVG icons instead
3. SocialProof section has no visual distinction — it's just text labels
4. `motion-config.ts` — shared animation config is good, but some elements could animate more distinctly

---

## 2. Dashboard Pages Audit

### 2.1 Dashboard Home (`src/app/(dashboard)/dashboard/page.tsx`)

**Strengths**
- KPI cards with icons and descriptions
- Charts section (Revenue/Expense, NOI)
- Recent activity feed
- Quick actions panel

**Issues:**
1. **No loading skeletons** — page is fully server-rendered but shows nothing during data fetch
2. "Actions rapides" uses outline buttons with no primary action distinction
3. Empty state in recent activity is well-designed but appears without animation

### 2.2 Properties Page (`src/app/(dashboard)/properties/page.tsx`)

**Strengths**
- Card grid layout — good density
- Shows active tenant, rent, badges for type/surface/rooms
- PropertyActions menu (three-dot)

**Issues:**
1. Empty state is well-designed but the "Ajouter un bien" button is only shown AFTER a user has zero properties — first-time users need a more proactive onboarding prompt
2. No filter/sort controls
3. "Créer un bail" button is the same visual weight as "Ajouter un bien"

### 2.3 Tenants Page (`src/app/(dashboard)/tenants/page.tsx`)

**Strengths**
- Avatar with initials
- Payment status badge
- Receipt download link
- Edit/Delete actions per row

**Issues:**
1. No search or filter controls (by property, by status)
2. Edit button is a tiny ghost icon — accessibility concern
3. "Créer un bail" and "Ajouter un locataire" buttons have equal weight

### 2.4 Leases Page (`src/app/(dashboard)/leases/page.tsx`)

**Strengths**
- Status badge (ACTIF = green, EXPIRED = amber)
- Last payment status shown
- Property + tenant in one card

**Issues:**
1. No search or filter
2. IRL badge shown even when not relevant
3. No visual timeline for lease term

---

## 3. Cross-Cutting Design Issues

### 3.1 Visual Inconsistency: Marketing vs. Dashboard

| Element | Marketing | Dashboard |
|---|---|---|
| Background | Warm `#f8f7f4` stone | Uses CSS vars (likely gray) |
| Cards | `rounded-[2rem]`, `bg-white/60`, `backdrop-blur` | Standard `Card` with `border-border/50` |
| Typography | `font-[family-name:var(--font-sans)]` | `font-sans` (Tailwind) |
| Buttons | Filled dark, hover scale | Outline gray, hover bg |
| Shadows | Large `shadow-2xl`, `shadow-stone-900/8` | `shadow-sm` |

**This is the most impactful consistency issue.** The marketing site feels premium/frothy; the dashboard feels generic/stripped-down.

### 3.2 Component Library Inconsistency

- Marketing uses custom components with frosted glass and framer-motion
- Dashboard uses `@/components/ui/card` — a different visual language

### 3.3 Missing Global Elements

- No loading skeletons on any dashboard page
- No toast notification system visible in the marketing pages
- No breadcrumbs on dashboard inner pages

---

## 4. Priority Matrix

| # | Issue | Severity | Impact | Page | Fix Complexity |
|---|---|---|---|---|---|
| 1 | Fake-looking social proof logos (text labels only) | Critical | Conversion | Homepage | Easy |
| 2 | Features page uses placeholder visuals, no real product screenshots | Critical | Conversion | Features | Medium |
| 3 | Dashboard uses generic/flat design vs. marketing premium feel | High | Retention, UX | Dashboard | Medium |
| 4 | No loading skeletons on dashboard pages | High | UX | Dashboard | Easy |
| 5 | Russian text "Historique поиска" in features page | High | Credibility | Features | Trivial |
| 6 | No secondary CTA on hero (demo option) | Medium | Conversion | Homepage | Easy |
| 7 | Trust badges placed far from hero CTA | Medium | Conversion | Homepage | Easy |
| 8 | Emoji trust badges (🇪🇺🔐📜) in testimonials | Low | Brand | Marketing | Easy |
| 9 | No annual/monthly pricing toggle | Medium | Conversion | Pricing | Easy |
| 10 | Edit buttons too small (accessibility) | Low | A11y | Tenants | Easy |

---

## 5. Top 5 Improvements Implemented

1. **[HOMEPAGE] Fix social proof section** — replace text-only labels with a proper logo strip + add a stats bar
2. **[HOMEPAGE] Add secondary hero CTA** — "Voir la démo" for undecided visitors
3. **[FEATURES] Fix Russian text** — replace "Historique поиска" with proper French copy
4. **[DASHBOARD] Add primary button style** — upgrade "Actions rapides" to use filled primary buttons
5. **[MARKETING] Replace emoji trust badges** — use SVG icons instead of 🇪🇺🔐📜 in testimonials

---

## 6. Recommendations for Next Iteration

1. **Add real product screenshots** to the features page — the placeholder icons are the biggest conversion killer
2. **Design a loading skeleton system** for the dashboard — use `@/components/ui/skeleton`
3. **Create a shared design token file** — unify marketing and dashboard CSS variables
4. **Add a stats bar** to the homepage (e.g., "X Properties Managed", "Y Quittances Generated")
5. **Design an annual/monthly pricing toggle** with clear savings display
