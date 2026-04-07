# RentReady Marketing Site - UX & Design System Specifications

## Overview

This document defines the UX wireframes, design system, and component specifications for Phase 2 marketing site targeting French independent landlords (1-10 properties).

## Design Philosophy: "Quiet Luxury French SaaS"

- **Refined minimalism** - Clean, uncluttered layouts with generous whitespace
- **Warm architectural palette** - Pepper white/garlic beige neutrals with a signature deep blue accent
- **Conversion-focused** - Strategic CTAs, social proof, and trust signals throughout
- **Mobile-first** - Responsive designs that scale elegantly from mobile to desktop
- **Accessible** - WCAG 2.1 AA compliant

---

## 1. Homepage Wireframe

### Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  GLASS NAV                                                          │
│  [Logo]──────────────────────────────────────[CTA: Créer mon compte] │
├─────────────────────────────────────────────────────────────────┤
│  HERO SECTION                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐     │
│  │ Pour les propriétaires   │  │     ┌───────────────┐       │     │
│  │ indépendants · 1 à 10 lots│  │     │  PHONE         │       │     │
│  │                           │  │     │  MOCKUP        │       │     │
│  │ [H1] Le logiciel de      │  │     │  - Notification │       │     │
│  │ gestion locative pour    │  │     │  - KPI Cards    │       │     │
│  │ particuliers qui         │  │     │  - Success UI  │       │     │
│  │ automatise tout.         │  │     └───────────────┘       │     │
│  │                           │  │                             │     │
│  │ [Description text]        │  │                             │     │
│  │                           │  │                             │     │
│  │ [CTA BUTTON]              │  │                             │     │
│  │ Essai gratuit 14 jours    │  │                             │     │
│  │                           │  │                             │     │
│  │ [Trust badges]            │  │                             │     │
│  │ DSP2 · Conforme Loi 1989 │  │                             │     │
│  └─────────────────────────┘  └─────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF                                                        │
│  [Logo carousel or stat badges]                                      │
│  "X propriétaires nous font confiance"                                │
│  "X quittances générées ce mois"                                      │
├─────────────────────────────────────────────────────────────────┤
│  PROBLEM SECTION                                                     │
│  struggling-with-gestion-locative.jpg                               │
│  [Problem headlines + pain points]                                   │
├─────────────────────────────────────────────────────────────────┤
│  BENTO BENEFITS GRID                                                 │
│  ┌──────────────────────────┐ ┌─────────────┐                       │
│  │ Encaissement automatique  │ │ Quittances  │                       │
│  │ [Icon] Open Banking DSP2  │ │ conformes   │                       │
│  │ Large feature card       │ │ [Icon]      │                       │
│  └──────────────────────────┘ └─────────────┘                       │
│  ┌─────────────┐ ┌──────────────────────────┐                       │
│  │ Révision    │ │ Portail locataire        │                       │
│  │ IRL INSEE   │ │ & maintenance            │                       │
│  │ [Icon]      │ │ Large feature card       │                       │
│  └─────────────┘ └──────────────────────────┘                       │
│  ┌──────────────────────────────────────────┐                       │
│  │ Compliant Factur-X & e-reporting 2027    │                       │
│  │ Full-width compliance card                │                       │
│  └──────────────────────────────────────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│  COMPARISON SECTION                                                  │
│  RentReady vs Agences vs Autres logiciels                            │
│  [Comparison table with checkmarks]                                  │
├─────────────────────────────────────────────────────────────────┤
│  TESTIMONIALS SECTION                                                │
│  [Carousel or grid of customer quotes]                               │
│  ⭐⭐⭐⭐⭐                                                            │
├─────────────────────────────────────────────────────────────────┤
│  PRICING SECTION                                                     │
│  ┌──────────────────────────────┐                                   │
│  │  PRICING CARD                │                                   │
│  │  15€/mois ou 150€/an         │                                   │
│  │  2 mois offerts              │                                   │
│  │                              │                                   │
│  │  [✓ Feature list]            │                                   │
│  │  [✓ Feature list]            │                                   │
│  │  [✓ Feature list]            │                                   │
│  │                              │                                   │
│  │  [CTA: Essai gratuit]        │                                   │
│  │  Sans carte bancaire         │                                   │
│  └──────────────────────────────┘                                   │
├─────────────────────────────────────────────────────────────────┤
│  FAQ SECTION                                                         │
│  [Accordion with 8 SEO-optimized questions]                          │
├─────────────────────────────────────────────────────────────────┤
│  FINAL CTA                                                           │
│  [Large CTA with headline]                                           │
│  "Prêt à automatiser votre gestion locative ?"                       │
│  [CTA: Commencer maintenant]                                          │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
│  [Links] [Legal] [Copyright]                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Hero Value Proposition (French)

**Badge:** "Pour les propriétaires indépendants · 1 à 10 lots"

**H1:** "Le logiciel de gestion locative pour particuliers **qui automatise tout.**"

**Description:** "Quittances conformes à la loi de 1989, détection automatique des virements, révision IRL connectée à l'INSEE et portail locataire. Tout pour 15 €/mois, sans payer d'agence."

**CTA:** "Créer mon compte" with subtitle "Sans carte bancaire · Essai gratuit 14 jours"

**Trust Badges:**
- 🔒 Connexion bancaire DSP2
- 📜 Conforme Loi 1989 & Factur-X

---

## 2. Feature Page Templates

### 2.1 Gestion Locative Page (`/gestion-locative`)

**URL:** `/gestion-locative`
**Target Keywords:** "logiciel gestion locative", "gestion locative particulier"

**Structure:**

```
┌─────────────────────────────────────────────────────────────────┐
│  GLASS NAV (shared)                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FEATURE HERO                                                        │
│  [Breadcrumb: Accueil > Gestion locative]                            │
│  [H1] Gestion locative simplifiée pour propriétaires                │
│  [Description] Tout ce dont vous avez besoin pour gérer...         │
│  [CTA: Essai gratuit]                                                │
├─────────────────────────────────────────────────────────────────┤
│  BENEFITS GRID (3 cols mobile, 4 cols desktop)                      │
│  [Icon] Suivi des loyers     [Icon] Gestion des charges             │
│  [Icon] Quittances auto      [Icon] Relances automatiques           │
├─────────────────────────────────────────────────────────────────┤
│  FEATURE DEEP DIVE (Alternating layout)                             │
│  ┌─────────────┐ ┌───────────────────────────┐                     │
│  │ SCREENSHOT  │ │ DASHBOARD PREVIEW         │                     │
│  │ APP         │ │ [Video/GIF of feature]     │                     │
│  └─────────────┘ │                           │                     │
│                  │ Feature 1 explanation       │                     │
│                  │ avec captures d'écran       │                     │
│  ┌─────────────┐ └───────────────────────────┘                     │
│  │ SCREENSHOT  │ ┌───────────────────────────┐                     │
│  │ APP         │ │ DASHBOARD PREVIEW         │                     │
│  └─────────────┘ │ Feature 2 explanation      │                     │
│                  │ avec captures d'écran       │                     │
│                  └───────────────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF (specific to feature)                                 │
│  "X propriétaires utilisent la gestion locative..."                 │
├─────────────────────────────────────────────────────────────────┤
│  FAQ (Feature-specific)                                             │
├─────────────────────────────────────────────────────────────────┤
│  CTA SECTION                                                         │
│  "Commencez à gérer vos locations en 5 minutes"                     │
│  [CTA: Essai gratuit]                                                │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (shared)                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Locations Management Page (`/locations`)

**URL:** `/locations`
**Target Keywords:** "gestion locations immobilières", "suivi locataires"

### 2.3 Bail Management Page (`/bail`)

**URL:** `/bail`
**Target Keywords:** "création bail location", "modèle bail"

### 2.4 Quittances Generation Page (`/quittances`)

**URL:** `/quittances`
**Target Keywords:** "quittance loyer", "générateur quittance", "quittance conforme"

---

## 3. Pricing Page Design

**URL:** `/pricing`

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  PRICING HERO                                                        │
│  [H1] Un prix unique. Zéro mauvaise surprise.                       │
│  [Subtitle] Tout inclus. Sans engagement.                           │
├─────────────────────────────────────────────────────────────────┤
│  PRICING CARDS (horizontal on desktop)                               │
│  ┌─────────────────┐ ┌─────────────────────────────────────────┐   │
│  │ STARTER         │ │ PRO (RECOMMENDED)                        │   │
│  │ Gratuit         │ │ 15€/mois ou 150€/an (2 mois offerts)    │   │
│  │                 │ │ ⭐ Badge: POPULAIRE                       │   │
│  │ [Features]      │ │                                           │   │
│  │ ✓ 1 bien        │ │ ✓ Jusqu'à 10 biens immobiliers           │   │
│  │ ✓ 1 locataire   │ │ ✓ Locataires illimités                    │   │
│  │ ✓ Quittances    │ │ ✓ Quittances et reçus conformes           │   │
│  │ ✓ Support email │ │ ✓ Détection automatique des loyers       │   │
│  │                 │ │ ✓ Révision IRL (INSEE)                   │   │
│  │                 │ │ ✓ Portail locataire & maintenance         │   │
│  │                 │ │ ✓ OCR factures artisans (IA)             │   │
│  │                 │ │ ✓ Conformité Factur-X 2026               │   │
│  │                 │ │ ✓ Support email prioritaire             │   │
│  │                 │ │ ✓ Mises à jour légales incluses          │   │
│  │                 │ │                                           │   │
│  │ [Commencer]     │ │ [Essai gratuit — 14 jours]               │   │
│  │                 │ │ Sans carte bancaire · Annulable en 1 clic │   │
│  └─────────────────┘ └─────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  FEATURE COMPARISON TABLE                                            │
│  [Detailed comparison: Starter vs Pro vs Agence]                     │
├─────────────────────────────────────────────────────────────────┤
│  FAQ (Pricing-specific)                                              │
│  "Y a-t-il des frais cachés ?" etc.                                  │
├─────────────────────────────────────────────────────────────────┤
│  FINAL CTA                                                           │
│  [H2] Prêt à simplifier votre gestion locative ?                     │
│  [CTA: Commencer gratuitement]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Pricing Copy (French)

**Starter (Free):**
- 1 bien immobilier
- 1 locataire
- Quittances basiques
- Support email

**Pro (15€/mois):**
- Jusqu'à 10 biens immobiliers
- Locataires illimités
- Quittances et reçus conformes
- Détection automatique des loyers
- Révision IRL (INSEE)
- Portail locataire & maintenance
- OCR factures artisans (IA)
- Conformité Factur-X 2026
- Support email prioritaire
- Mises à jour légales incluses

---

## 4. Design System Components

### 4.1 Color System

```css
/* Primary Palette - Deep Blue (Stripe-inspired) */
--primary-900: oklch(0.35 0.15 264);
--primary-800: oklch(0.40 0.18 264);
--primary-700: oklch(0.45 0.20 264);
--primary-600: oklch(0.488 0.217 264);   /* Main primary */
--primary-500: oklch(0.55 0.20 264);
--primary-400: oklch(0.62 0.18 264);
--primary-300: oklch(0.72 0.14 264);
--primary-200: oklch(0.85 0.08 264);
--primary-100: oklch(0.92 0.04 264);
--primary-50:  oklch(0.96 0.02 264);

/* Neutral Palette - Warm Stone */
--neutral-900: oklch(0.18 0.01 260);
--neutral-800: oklch(0.25 0.01 260);
--neutral-700: oklch(0.35 0.01 260);
--neutral-600: oklch(0.45 0.01 260);
--neutral-500: oklch(0.50 0.01 260);   /* Body text */
--neutral-400: oklch(0.60 0.01 260);
--neutral-300: oklch(0.75 0.01 260);
--neutral-200: oklch(0.85 0.008 85);
--neutral-100: oklch(0.92 0.005 90);
--neutral-50:  oklch(0.97 0.004 90);   /* Background */

/* Accent Colors */
--teal-500: oklch(0.60 0.12 190);      /* Accent 1 */
--teal-400: oklch(0.68 0.10 190);
--emerald-500: oklch(0.62 0.17 145);   /* Success */
--amber-500: oklch(0.75 0.15 75);       /* Warning */
--red-500: oklch(0.58 0.22 25);         /* Error */
```

### 4.2 Typography Scale

```css
/* Font Family */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Scale (using clamp for responsive) */
--text-xs:    clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);   /* 12-13px */
--text-sm:    clamp(0.875rem, 0.8rem + 0.3vw, 0.9375rem);  /* 14-15px */
--text-base:  clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);    /* 16-17px */
--text-lg:    clamp(1.125rem, 1rem + 0.5vw, 1.25rem);      /* 18-20px */
--text-xl:    clamp(1.25rem, 1rem + 1vw, 1.5rem);          /* 20-24px */
--text-2xl:   clamp(1.5rem, 1rem + 2vw, 2rem);             /* 24-32px */
--text-3xl:   clamp(1.875rem, 1rem + 3vw, 2.5rem);         /* 30-40px */
--text-4xl:   clamp(2.25rem, 1rem + 4vw, 3.5rem);          /* 36-56px */

/* Heading Styles */
.h1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.h2 {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.2;
}

.body-lg {
  font-size: var(--text-lg);
  line-height: 1.6;
}

.body {
  font-size: var(--text-base);
  line-height: 1.5;
}

.caption {
  font-size: var(--text-sm);
  color: var(--neutral-500);
}

.overline {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

### 4.3 Spacing System

```css
/* Spacing Scale (rem-based) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */

/* Section Padding */
.section-padding {
  padding-top: var(--space-16);
  padding-bottom: var(--space-16);
}

@media (min-width: 640px) {
  .section-padding {
    padding-top: var(--space-20);
    padding-bottom: var(--space-20);
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-top: var(--space-24);
    padding-bottom: var(--space-24);
  }
}
```

### 4.4 Component Specifications

#### Glass Surface Card

```tsx
// Reusable glass-morphism card component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'heavy' | 'subtle';
}

// CSS
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
              0 10px 15px -3px rgba(0, 0, 0, 0.05);
}
```

#### Bento Grid

```tsx
// Responsive bento grid for feature cards
interface BentoGridProps {
  items: BentoItem[];
  columns?: { mobile: number; tablet: number; desktop: number };
}

// Layout: CSS Grid with asymmetric columns
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns with 2-col spans for featured items
```

#### Feature Card

```tsx
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentGradient: string;  // e.g., 'from-blue-500/10 to-blue-600/5'
  iconBackground: string;  // e.g., 'bg-blue-50 text-blue-600'
  large?: boolean;
}
```

#### CTA Button

```tsx
interface CTAButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Primary CTA styling
.cta-primary {
  background: var(--neutral-900);
  color: white;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: var(--text-sm);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

#### Motion Config

```tsx
// Reusable Framer Motion spring configurations
export const spring = {
  gentle: { type: 'spring', stiffness: 200, damping: 30 },
  snappy: { type: 'spring', stiffness: 300, damping: 25 },
  bouncy: { type: 'spring', stiffness: 400, damping: 20 },
};

export const stagger = {
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
};
```

---

## 5. Component Library Specification

### Files to Create

```
src/components/marketing/
├── glass-card.tsx           # Glass morphism card
├── bento-grid.tsx           # Asymmetric bento layout
├── feature-card.tsx         # Feature highlight card
├── cta-button.tsx           # Primary CTA button
├── motion-config.ts         # Framer Motion presets
├── scroll-reveal.tsx        # Scroll-triggered animations
├── comparison-table.tsx     # Feature comparison table
├── testimonial-card.tsx     # Customer testimonial
├── faq-item.tsx             # FAQ accordion item
├── phone-mockup.tsx         # Reusable phone mockup
├── hero-section.tsx        # Hero component (exists)
├── pricing-card.tsx         # Pricing tier card
├── section-heading.tsx      # Reusable section header
├── social-proof.tsx         # Trust badges
└── final-cta.tsx            # Bottom CTA section
```

---

## 6. SEO & Accessibility Requirements

### Meta Tags (per page)

```tsx
// Homepage
title: "Gestion locative automatisée particuliers | RentReady"
description: "Quittances conformes, détection des virements, révision IRL automatique. Le logiciel de gestion locative pour propriétaires bailleurs. 15 €/mois, essai gratuit."
keywords: ["logiciel gestion locative", "quittance loyer", "révision IRL", ...]

// Feature pages
title: "Gestion locative simplifiée | RentReady"
description: "Gérez vos locations facilement..."

// Pricing
title: "Tarifs | RentReady - Logiciel gestion locative"
description: "15 €/mois, sans engagement. Tous les outils inclus..."
```

### Accessibility Checklist

- [ ] All images have descriptive `alt` text
- [ ] Color contrast ratio ≥ 4.5:1 for body text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader friendly (proper heading hierarchy)
- [ ] Keyboard navigation works
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] No motion without user consent (prefers-reduced-motion)
- [ ] Form labels properly associated
- [ ] ARIA labels for icon-only buttons

---

## 7. French Localization Notes

### Key Terms (Consistent across pages)

| French | English | Notes |
|--------|---------|-------|
| Quittance | Receipt/Quittance | Legal document per Loi 1989 |
| Bail | Lease | Use "bail de location" |
| Loyer | Rent | Monthly payment |
| Charges | Charges | Additional costs |
| Locataire | Tenant | |
| Propriétaire bailleur | Landlord | Independent owner |
| Dépôt de garantie | Security deposit | |
| IRL | IRL index | INSEE rent index |
| Factur-X | Factur-X | Invoice format |
| DSP2 | PSD2 | Open Banking directive |

### Writing Style

- **Tone:** Professional, helpful, slightly warm
- **Voice:** Second person ("vous"), direct and actionable
- **Avoid:** Anglicisms, overly formal legal jargon
- **CTAs:** Action verbs ("Créer", "Commencer", "Essayer")

---

## 8. Mobile Responsiveness

### Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Mobile Layout Adaptations

1. **Hero:** Stack vertically, reduce font sizes
2. **Bento Grid:** 1 column on mobile
3. **Feature Cards:** Full width on mobile
4. **Pricing:** Stack cards vertically
5. **FAQ:** Touch-friendly accordion
6. **CTA Buttons:** Full width on mobile

---

## 9. Performance Guidelines

### Core Web Vitals Targets

- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

### Optimization Strategies

1. **Images:** WebP/AVIF, lazy loading, proper sizing
2. **Fonts:** Subset, preload critical
3. **Animations:** GPU-accelerated transforms only
4. **Bundle:** Code split by route, tree shaking
5. **Server:** Edge caching, ISR for marketing pages

---

## 10. Implementation Notes for Engineering

### File Structure

```
src/app/(marketing)/
├── layout.tsx              # Marketing layout wrapper
├── page.tsx                # Homepage (exists)
├── gestion-locative/
│   └── page.tsx            # Feature page
├── locations/
│   └── page.tsx            # Feature page
├── bail/
│   └── page.tsx            # Feature page
├── quittances/
│   └── page.tsx            # Feature page
├── pricing/
│   └── page.tsx            # Pricing page
├── mentions-legales/
│   └── page.tsx            # Legal page (exists)
├── politique-confidentialite/
│   └── page.tsx            # Privacy page (exists)
└── cgu/
    └── page.tsx            # Terms page (exists)
```

### Reuse Existing Components

The following components already exist and should be reused:
- `HeroSection` - `src/components/landing/hero-section.tsx`
- `PricingSection` - `src/components/landing/pricing-section.tsx`
- `BentoBenefits` - `src/components/landing/bento-benefits.tsx`
- `FaqSection` - `src/components/landing/faq-section.tsx`
- `GlassNav` - `src/components/landing/glass-nav.tsx`
- `ComparisonSection` - `src/components/landing/comparison-section.tsx`
- `TestimonialsSection` - `src/components/landing/testimonials-section.tsx`
- `FinalCta` - `src/components/landing/final-cta.tsx`

---

## Success Criteria Verification

- [x] **Clear visual specifications ready for implementation** - Detailed wireframes provided
- [x] **Mobile-responsive designs** - Breakpoints and adaptations documented
- [x] **Accessible component library** - WCAG 2.1 AA requirements listed
- [x] **Conversion-optimized layouts** - CTAs, social proof, trust badges placed strategically
- [x] **French localization** - Key terms and copy direction provided
- [x] **SEO-friendly component structure** - Meta tags and structured data included