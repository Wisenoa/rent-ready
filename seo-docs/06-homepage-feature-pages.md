# Homepage & Feature Pages — SEO Content Specs

> This document provides SEO content guidance for the homepage and core feature pages. The Senior Frontend Engineer uses this to verify and optimize existing pages.

---

## 1. Homepage SEO Specifications

**File:** `/home/ubuntu/rent-ready/src/app/page.tsx`

**Status:** Already built. Below = content audit checklist and optimization notes.

### Metadata (Verify Current Implementation)

```typescript
export const metadata: Metadata = {
  title: "RentReady — Gestion locative automatisée pour propriétaires bailleurs",
  description: "Quittances conformes, détection des virements, révision IRL automatique. Le pilote automatique des propriétaires bailleurs. Essai gratuit 14 jours.",
  keywords: [
    "logiciel gestion locative",
    "gestion locative particulier",
    "quittance de loyer automatique",
    "indice de référence des loyers IRL",
    "révision loyer INSEE",
    "gestion locative en ligne",
    "logiciel propriétaire bailleur",
    "Factur-X gestion locative",
    "e-reporting B2C location",
    "LMNP gestion",
    "SCI gestion locative",
    "open banking DSP2 loyer",
  ],
  openGraph: {
    title: "RentReady — Gestion locative automatisée pour propriétaires bailleurs",
    description: "Quittances légales, détection des virements, révision IRL. Le pilote automatique des propriétaires bailleurs. 15 €/mois.",
    type: "website",
    locale: "fr_FR",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Logiciel de gestion locative automatisée",
      },
    ],
  },
  alternates: {
    canonical: "https://www.rentready.fr",
  },
};
```

**Verification checklist:**
- [ ] Title ≤ 60 characters ✓ (current: 72 — slightly long, consider trimming)
- [ ] Description ≤ 155 characters ✓ (current: 137)
- [ ] Primary keyword "gestion locative" in title ✓
- [ ] Secondary keywords present ✓
- [ ] OG image exists at `/public/og-image.png` ⚠️ (verify file exists)
- [ ] Canonical set to root domain ✓

### H1 Tag
Current: "La gestion locative... enfin simplifiée" (verify)
**Target H1:** "Gestion locative automatisée pour propriétaires bailleurs"
- Primary keyword phrase should appear in H1
- Keep under 70 characters

### Above-the-fold Content Priority
1. H1 with clear value proposition
2. Subheadline with key benefits (3 bullet points)
3. Primary CTA: "Essai gratuit 14 jours" → `/register`
4. Trust signal: "Sans carte bancaire" or "15 000+ propriétaires actifs"
5. Hero visual (software screenshot or illustration)

### Homepage Content Sections

| Section | Content | Priority |
|---------|---------|----------|
| Hero | H1 + subheadline + primary CTA | High |
| Social Proof | Testimonials, press logos, user count | High |
| Problem Section | Pain points landlords face (spreadsheets, manual work) | Medium |
| Bento Benefits | Key features grid (quittances, IRL, Open Banking, portal) | High |
| Comparison | vs. spreadsheet, vs. agency, vs. competitor | High |
| Testimonials | 3 landlord quotes with names/locations | Medium |
| Pricing Preview | Starting at 15€/mois, free trial CTA | Medium |
| FAQ | Common questions (marked up with FAQPage schema) | Medium |
| Final CTA | "Essayez gratuitement" → `/register` | High |

### JSON-LD for Homepage
Already implemented: `SoftwareApplication` + `Organization` + `Service` schema. ✅

### Conversion Elements on Homepage
- Primary CTA above the fold: "Essai gratuit" (no credit card)
- Secondary CTA: "Voir la démo" → `/demo`
- Sticky CTA on mobile (floating button)
- Pricing section with anchor link to `/pricing`
- FAQ section with Schema FAQPage markup

---

## 2. Feature Pages — SEO Audit Guide

Feature pages should follow this structure:

### 2.1 Page: `/quittances`
**File:** `src/app/(marketing)/quittances/page.tsx`

| Element | Current Status | Action |
|---------|-------------|--------|
| Meta title | "Quittances de loyer — Génération automatique et conforme \| RentReady" | ✅ Good |
| Meta description | "Générez des quittances de loyer conformes en 1 clic..." | ✅ Good |
| Target keyword | quittance loyer | ✅ In title |
| H1 | "Quittances de loyer" | Consider: "Quittances de Loyer — Génération Automatique et Conforme" |
| Features list | 4-5 feature bullets with icons | ✅ |
| CTA | Primary CTA to /register | ✅ |
| Schema | Not confirmed | Add FAQPage schema |
| Internal links | Links to /blog/articles, /glossaire | Verify |

**Content to verify/improve:**
- H2 sections covering: How it works, Compliance (loi 89-462), PDF format, Portal locataire
- FAQ section with 5+ questions (add FAQPage JSON-LD)
- Internal links to: `/blog/modele-quittance-loyer-pdf-gratuit` (when published) and `/glossaire-immobilier` (quittance term)

### 2.2 Page: `/bail`
**File:** `src/app/(marketing)/bail/page.tsx`

| Element | Current Status | Action |
|---------|-------------|--------|
| Meta title | "Gestion des baux — Créer, suivre et renouveler vos contrats \| RentReady" | ✅ |
| Target keyword | gestion baux, bail location | ✅ |
| H1 | "Gestion des baux" | ✅ |
| Schema | Not confirmed | Add FAQPage schema |
| Internal links | Links to tool pages | Verify |

**Content to verify:**
- Sections: Create contracts, Renewal tracking, Legal compliance, Templates
- FAQ: 5+ questions about bail rules
- Internal link to `/blog/comment-gerer-loyers-impayes`
- Internal link to `/glossaire-immobilier` (bail term)

### 2.3 Page: `/locations`
**File:** `src/app/(marketing)/locations/page.tsx`

| Element | Current Status | Action |
|---------|-------------|--------|
| Meta title | "Gestion des locations — Suivi de vos biens locatifs \| RentReady" | ✅ |
| Target keyword | gestion locations, suivi biens locatifs | ✅ |
| Schema | Not confirmed | Add FAQPage schema |

**Content to verify:**
- Sections: Dashboard, Rent tracking, Documents, Contracts
- FAQ: 5+ questions
- Internal links to `/blog/articles`

### 2.4 Page: `/gestion-locative`
**File:** `src/app/(marketing)/gestion-locative/page.tsx` (index) + `src/app/(marketing)/gestion-locative/[ville]/page.tsx` (city)

**Index page:**
- Lists all cities with population data
- Organized by region
- Links to individual city pages
- Target keyword: "gestion locative [city]"

**City pages (dynamic):**
- Content: City-specific intro + feature overview + CTA
- Each city page targets: "gestion locative à [city]"
- Schema: LocalBusiness or Service schema with city name

### 2.5 Page: `/maintenance`
**File:** `src/app/(marketing)/maintenance/page.tsx`

| Element | Current Status | Action |
|---------|-------------|--------|
| Target keyword | maintenance location, gestion incidents | ✅ |
| Schema | Not confirmed | Add FAQPage schema |

---

## 3. Pricing Page SEO

**File:** `src/app/(marketing)/pricing/page.tsx`

| Element | Requirement |
|---------|------------|
| Title | "Tarifs — Logiciel gestion locative 15€/mois \| RentReady" |
| Description | "15€/mois pour gérer jusqu'à 10 biens. Quittances conformes, détection des loyers, révision IRL, portail locataire. Essai gratuit 14 jours, sans engagement." |
| Target keywords | tarif gestion locative, prix logiciel locatif, abonnement gestion locative |
| Primary CTA | "Essai gratuit 14 jours" → `/register` |
| Secondary CTA | "Réserver une démo" → `/demo` |
| Price anchoring | Show annual discount clearly (15€/mois or 150€/an = 2 mois gratuits) |
| Trust signals | "Sans carte bancaire", "Annulation en 1 clic" |
| FAQ | 5+ pricing questions (marked up with FAQPage) |
| Schema | SoftwareApplication or Offer schema with price |

**Pricing page should include:**
- Monthly/annual toggle
- Feature comparison table
- "Free trial" prominently displayed
- "No credit card required" trust signal
- FAQ section with common pricing objections
- Social proof (number of users or testimonials)

---

## 4. Demo Page SEO

**File:** `src/app/(marketing)/demo/page.tsx`

| Element | Requirement |
|---------|------------|
| Title | "Demo — Découvrez RentReady en 15 minutes \| RentReady" |
| Description | "Réservez une démo personnalisée avec notre équipe. Découvrez toutes les fonctionnalités en conditions réelles. Gratuit, sans engagement." |
| Target keywords | demo gestion locative, démonstration logiciel, essairentree |
| CTA | Calendar booking widget (Calendly or native) |
| Schema | Event schema (Webinar or ProductService) |

**Demo page should include:**
- Clear value proposition ("Découvrez RentReady en conditions réelles")
- What will be shown (feature walkthrough, Q&A)
- Booking form (name, email, phone, preferred time)
- Alternative: "Ou commencez votre essai gratuit →" link

---

## 5. Internal Linking Map (Feature Pages → Content)

```
/ (homepage)
├── /quittances → /blog/modele-quittance-loyer-pdf-gratuit, /glossaire-immobilier (quittance)
├── /bail → /blog/comment-gerer-loyers-impayes, /blog/loi-alur-proprietaire-bailleur, /glossaire-immobilier (bail)
├── /locations → /blog/comment-gerer-loyers-impayes, /blog/depot-garantie-regles-essentielles
├── /gestion-locative → /blog/guide-gestion-locative-proprietaire, /glossaire-immobilier
├── /maintenance → /glossaire-immobilier (maintenance)
├── /pricing → /blog/optimiser-fiscalite-loyers
├── /demo → /register (fallback CTA)
└── /glossaire-immobilier → /blog (all articles), /quittances, /bail

/blog/[slug]
├── /quittances
├── /bail
├── /locations
├── /pricing
└── /glossaire-immobilier

/glossaire-immobilier
├── /blog (all relevant articles)
├── /quittances
├── /bail
├── /locations
└── /pricing

/outils/[tool]
├── /blog (relevant article)
├── /glossaire-immobilier (relevant terms)
└── /pricing
```

---

## 6. Footer SEO Links

The marketing footer (rendered on all pages) must include:

```
RentReady
├── Logiciel de gestion locative
│   ├── /gestion-locative
│   ├── /quittances
│   ├── /bail
│   ├── /locations
│   └── /maintenance
├── Outils gratuits
│   ├── /outils/modele-bail-location
│   ├── /outils/modele-quittance-loyer-pdf
│   ├── /outils/calculateur-irl-2026
│   ├── /outils/calculateur-depot-garantie
│   └── /glossaire-immobilier
├── Ressources
│   ├── /blog
│   └── /blog/guide-gestion-locative-proprietaire
├── Prix
│   └── /pricing
├── Informations légales
│   ├── /cgu
│   ├── /mentions-legales
│   └── /politique-confidentialite
└── réseaux sociaux (Twitter/LinkedIn links)
```

**Canonical footer links:**
- Every page should include a consistent footer
- Footer links contribute to internal linking equity distribution
- Legal pages should be in footer (trust/E-E-A-T)
- Blog and tools should be prominent in navigation

---

## 7. SEO Content Audit Checklist

Use this checklist when reviewing any marketing page:

- [ ] Title ≤ 60 characters, primary keyword first/early
- [ ] Description ≤ 155 characters, includes primary keyword once
- [ ] H1 = title without "| RentReady" suffix
- [ ] H2 headings are descriptive and keyword-inclusive (natural)
- [ ] Primary keyword appears in: title, description, H1, first paragraph, at least one H2
- [ ] Secondary keywords distributed naturally throughout content
- [ ] At least 2 internal links to other marketing pages or blog
- [ ] At least 1 link to glossary or tool page
- [ ] CTA present (product signup or demo)
- [ ] FAQ section with FAQPage JSON-LD schema (if page answers common questions)
- [ ] Open Graph tags: title, description, url, type, image
- [ ] Canonical URL set correctly
- [ ] No broken internal links
- [ ] All images have descriptive alt text
- [ ] Page loads < 3 seconds on 4G
- [ ] Mobile-responsive (test at 375px width)
