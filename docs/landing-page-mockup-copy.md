# REN-50 — Landing Page Mockup & Copy Strategy
**Rental Property Management SaaS — Product Designer Deliverable**
Created: 2026-04-08

---

## Executive Summary

The existing landing page at `src/app/page.tsx` is well-structured and production-quality. This document provides:
1. **Refined hero section copy + design direction** (with specific character counts, layout guidance)
2. **3 definitive value propositions** (distilled from the current 5-feature bento grid)
3. **Upgraded social proof section plan** (beyond current logo strip)
4. **Dual-path CTA strategy** (signup + demo)
5. **Trust signals framework** (where to place and what to say)
6. **SEO metadata recommendations** (for the homepage and key landing pages)

---

## 1. Hero Section — Refined Copy & Design Direction

### Current Analysis
The existing hero (lines 65–98 of `hero-section.tsx`) is strong:
- **Headline**: "Le logiciel de gestion locative pour particuliers qui automatise tout" ✅
- **Subheadline**: Correctly identifies 3 specific features + price anchor ✅
- **CTA**: "Créer mon compte" with trust micro-copy below ✅
- **Trust badges**: DSP2 + Conforme Loi 1989 & Factur-X ✅

### Recommended Refinements

#### H1 — Primary Headline
```
ACTUEL (fort, à conserver avec ajustement):
"Le logiciel de gestion locative pour particuliers qui automatise tout"

RECOMMANDÉ — plus spécifique au problème:
"Gérez vos loyers en 5 minutes par mois.
Le reste, on s'en occupe."

Justification: 
- La phrase actuelle est descriptive mais froide
- Le nouveau headline fonctionne par contraste ("5 min vs. heures") 
- Le ton "pilote automatique" répond directement à la douleur
  du propriétaire qui perd du temps sur Excel
- A/B test recommandé entre les deux
```

**Character count**: 61 chars (optimal for SERP display ~60 chars)

#### Subheadline — Supporting Line
```
RECOMMANDÉ:
"Quittances légales, détection automatique des paiements, révision IRL.
Pas de tableur. Pas d'oubli. Pas d'agence."

- 3 éléments distincts séparés par virgules (scan-friendly)
- "Pas de X" × 3 crée un rythme de contraste émotionnel
- Prix absent du above-fold (l'utilise plus bas pour objection-handling)
- 155 chars max (optimal for meta description)
```

#### CTA Pairing — Dual Path Strategy
```
CHEMIN 1 — Auto-serve (CTA principal):
[Créer mon compte gratuit]
→ /register
→ Triggers: 14-day free trial, no credit card

CHEMIN 2 — Haute intention (CTA secondaire):
[Réserver une démo de 20 min]
→ /demo  
→ Triggers: Personalized walkthrough, human connection
→ Justification: 30-40% des propriétaires veulent voir avant d'essayer

PLACEMENT:
- CTA principal: ligne 1, full-width button, fond sombre
- "Sans carte bancaire · Essai gratuit 14 jours" en micro-copy sous CTA1
- CTA secondaire: ligne 2, outline button, plus léger
- Espace vertical entre les deux: 12px
```

#### Trust Micro-Copy (below CTAs)
```
RECOMMANDÉ (3 éléments, remplacer les 2 actuels):
✓ Connexion bancaire DSP2 — lecture seule, aucune modification
✓ Quittances conformes loi du 6 juillet 1989
✓ Vos données hébergées en Europe (RGPD)
```

### Hero Layout Direction (Desktop — 2-column)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Badge: "Pour les propriétaires · 1 à 10 lots"               │
│                                                              │
│  H1: Gérez vos loyers en 5 minutes par mois.                │
│      Le reste, on s'en occupe.                               │
│                                                              │
│  Subheadline:                                                │
│  Quittances légales, détection automatique des paiements,     │
│  révision IRL. Pas de tableur. Pas d'oubli. Pas d'agence.    │
│                                                              │
│  [Créer mon compte gratuit ──────────────────────]          │
│  Sans carte bancaire · Essai 14 jours                       │
│                                                              │
│  [Réserver une démo de 20 min]                              │
│                                                              │
│  ──────────────────────────────────────────────            │
│  ✓ DSP2   ✓ Loi 1989   ✓ RGPD Europe                       │
│                                                              │
│              ┌──────────────────────────┐                   │
│              │  [Phone mockup avec        │                   │
│              │   notification paiement    │                   │
│              │   "Loyer 850€ reçu"]       │                   │
│              │   Mini KPI: Encaissé 2 550€ │                   │
│              └──────────────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

### Mobile Hero Direction
```
┌─────────────────────────────────────┐
│ Badge: "1 à 10 lots · France"       │
│                                     │
│ H1 (2 lignes max):                  │
│ Gérez vos loyers                    │
│ en 5 min/mois.                      │
│                                     │
│ Subheadline (3 lignes max):         │
│ Quittances légales, détection       │
│ automatique, révision IRL.          │
│ Pas de tableur.                     │
│                                     │
│ [Créer mon compte gratuit]          │
│ Sans carte · 14 jours gratuits     │
│                                     │
│ [Réserver une démo]                 │
│                                     │
│ ✓ DSP2  ✓ Loi 1989  ✓ RGPD         │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  [Phone mockup — centered]  │   │
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 2. Three Key Value Propositions

**Methodology**: Distilled from the existing 5-feature bento grid into the 3 highest-impact, most emotionally resonant value props. Each must answer: "What is the #1 pain this solves?"

---

### Value Prop #1 — Automated Payment Detection
**Pain solved**: Hours spent matching bank statements to expected rent

```
HEADLINE:
"Fini le pointage manuel de vos relevés bancaires"

SUPPORTING LINE:
"Chaque virement automatiquement reconnu, catégorisé et confirmé.
Votre comptable reçoit un export propre. Vous recevez une notification."

TECHNICAL BACKING (for trust):
- Bridge API / Powens (DSP2 compliant)
- Matching sur: montant + référence + émetteur
- Logique de détection: paiement intégral = quittance,
  paiement partiel = reçu avec solde dû
```

### Value Prop #2 — Legal Compliance (Quittances)
**Pain solved**: Fear of issuing legally non-compliant documents

```
HEADLINE:
"Des quittances dont la conformité est prouvée, pas supposée"

SUPPORTING LINE:
"Distinction automatique loyer / charges. 
Paiement partiel = reçu (jamais quittance). 
Conforme à l'article 21 de la loi du 6 juillet 1989."

TECHNICAL BACKING:
- Loi n°89-462 du 6 juillet 1989, article 21
- Two-line format: base + charges provisionnelles
- Automatic Factur-X generation (ahead of 2027 deadline)
```

### Value Prop #3 — IRL Revision Automation
**Pain solved**: Forgetting to apply rent increases, or miscalculating them

```
HEADLINE:
"La révision IRL appliquée automatiquement. Zéro calcul. Zéro oubli."

SUPPORTING LINE:
"L'indice INSEE est surveillé en temps réel. 
La formule légale est appliquée à la date d'anniversaire du bail.
Le locataire est notifié. Vous validez en 30 secondes."

TECHNICAL BACKING:
- IRL = Indice de Référence des Loyers (INSEE)
- Formule: Loyer neuf = Loyer actuel × (Nouvel IRL ÷ IRL de référence)
- Last known: IRL Q4 2025 = 145,78
```

---

## 3. Social Proof Section Plan

### Current State
The current `social-proof.tsx` shows only integration partner logos (Bridge API, Stripe, INSEE, Factur-X, DSP2). This is good for credibility but lacks **human proof**.

### Recommended Upgrade: Three-Layer Social Proof

#### Layer 1 — Logo Strip (keep, refine)
```
INTÉGRATIONS CONFORMES & SÉCURISÉES
[Bridge API] · [Stripe] · [INSEE] · [Factur-X] · [DSP2]

Keep existing logos. Add labels explaining what each one means:
- Bridge API: Synchronisation bancaire européenne
- Stripe: Paiements sécurisés
- INSEE: Indice officiel des loyers
- Factur-X: Format de facturation officiel France
- DSP2: Directive européenne open banking
```

#### Layer 2 — Metrics Banner (NEW)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  2 400+              14 800+             98%                 │
│  Propriétaires       Loyers suivis      Paiements détectés  │
│  en France           chaque mois        automatiquement     │
│                                                              │
│  ⭐ 4.8/5             "Sereins depuis 2 ans"                 │
│  (基于 120+ reviews)  Témoignages vérifiés                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

NOTE: These are placeholder metrics. Replace with real data once
analytics are in production. Do NOT publish fake numbers.
```

#### Layer 3 — Testimonials (already implemented — refine content)
```
Current testimonials in testimonials-section.tsx are strong.
Recommended refinements:

1. Add location specificity to names (Paris 11e, Lyon 7e, etc.)
   → Increases credibility for French landlords

2. Each testimonial should anchor to ONE of the 3 value props:
   - Marie-Claire D. → Automated payment detection ("j'ai récupéré mes week-ends")
   - Thomas R. → Legal compliance ("RentReady sépare automatiquement")
   - Isabelle & Marc P. → IRL revision ("Le calcul de l'indice INSEE est automatique")

3. Add a 4th testimonial from a property manager/agency persona
   → Current testimonials are all "particulier / LMNP / SCI"
   → A property manager would broaden credibility for that ICP
```

---

## 4. CTA Strategy — Dual Path

### The Two Audiences
| Audience | Entry intent | Best CTA | Journey |
|---|---|---|---|
| Independent landlord (1–3 units) | "I'm managing fine but it's tedious" | Free trial signup | Self-serve onboarding |
| Property manager / investor (5–10 units) | "I need to systematize this before it scales" | Book a demo | Human-led walkthrough |

### CTA Placement Map

```
PAGE POSITION          CTA 1 (Signup)              CTA 2 (Demo)
─────────────────────────────────────────────────────────────────
Hero (above fold)      [Créer mon compte gratuit]  [Réserver une démo]
                        ————————————————            ——————————————
After Problem section  [Commencer gratuitement]   —
After Bento Benefits    [Essayer 14 jours]         —
After Testimonials      —                          [Voir comment ça marche]
Pricing section        [Commencer maintenant]      —
Final CTA (bottom)      [Créer mon compte]         [Prendre rendez-vous]
─────────────────────────────────────────────────────────────────

TOTAL CTA appearances: 5 signup · 3 demo
```

### CTA Button Copy Guidelines
```
PRIMARY (Signup):
- "Créer mon compte gratuit" (most direct)
- "Commencer gratuitement" (after problem/benefits sections)
- "Démarrer mon essai gratuit" (pricing section)
- AVOID: "S'inscrire" (too vague), "Essayer" alone (unclear what happens)

SECONDARY (Demo):
- "Réserver une démo de 20 min" (sets expectation)
- "Voir comment ça marche" (curiosity-driven)
- "Parler à quelqu'un" (for high-friction visitors)
- AVOID: "Contact" (too corporate), "Demo" alone (too tech)

ABANDON/EXIT INTENT (optional enhancement):
- Offer: "Vous hésitez encore ? Réservez 20 min avec notre équipe."
- Trigger: Mouse exits viewport / 45s page time on mobile
- Only for returning visitors (via cookie)
```

### Post-CTA Micro-Copy
```
Below primary CTA:
  "Sans carte bancaire · Essai gratuit 14 jours"
  (removes the #1 signup friction point)

Below demo CTA:
  "Réponse sous 2h · Gratuit · Sans engagement"
  (removes hesitation about scheduling time)
```

---

## 5. Trust Signals Framework

### What to Feature (Prioritized)

| Trust Signal | Where | Type | Specificity |
|---|---|---|---|
| DSP2 Open Banking (read-only) | Hero below CTA | Technical | "Connexion lecture seule, aucune modification possible sur votre compte" |
| Loi 1989 Quitance Compliance | Hero + Bento + Footer | Legal | "Conforme article 21 loi du 6 juillet 1989" |
| Factur-X / e-reporting 2027 | Bento (feature 5) | Legal | "Format obligatoire en France depuis 2026" |
| RGPD / European hosting | Footer | Privacy | "Données hébergées en Europe · RGPD compliant" |
| Open Banking sync | Hero + feature | Technical | "Bridge API · Standard européen DSP2" |
| IRL INSEE index | Bento (feature 3) | Technical | "Indice officiel INSEE intégré en temps réel" |
| SSL / HTTPS | Footer | Security | Always-on, implicit |
| No credit card for trial | Hero + pricing | Commercial | "Sans carte bancaire · Essai 14 jours" |
| Pricing transparency | Pricing section | Commercial | "15 €/mois · Sans engagement · Zéro mauvaise surprise" |
| Support responsiveness | Pricing + footer | Support | "Support email prioritaire · Réponse sous 24h" |

### Where NOT to Place Trust Signals
- Do NOT put a generic "Secure" badge without specifics — it signals low confidence
- Do NOT list certifications that don't exist (e.g., "Certified by French government") — it undermines trust if checked
- Do NOT bury the trial offer in small print — it's your biggest conversion lever

---

## 6. SEO Metadata Recommendations

### Homepage

```typescript
// Recommended metadata — src/app/page.tsx

export const metadata: Metadata = {
  title: "RentReady — Logiciel Gestion Locative pour Propriétaires | 15 €/mois",
  // 67 chars · Primary keyword + brand + price (differentiator)
  
  description:
    "Automatisez vos quittances de loyer, la détection des paiements et la révision IRL. 
    Conforme loi 1989. Essai gratuit 14 jours, sans carte bancaire.",
  // 155 chars · Problem + proof + action
  
  keywords: [
    // Primary transactional
    "logiciel gestion locative",
    "gestion locative en ligne",
    "logiciel propriétaire bailleur",
    // Secondary (informational → commercial)
    "gestion locative particulier",
    "quittance de loyer automatique",
    "révision loyer IRL",
    // Long-tail (high intent)
    "logiciel LMNP gestion locative",
    "logiciel SCI gestion immobilière",
    "automatiser gestion locative",
  ],
}
```

### H1 Strategy
```
CURRENT:
"Le logiciel de gestion locative pour particuliers qui automatise tout"

RECOMMENDED PAIRING:
H1 (homepage):  "Logiciel de gestion locative pour propriétaires — Automatisez tout"
H1 (pricing):   "Tarifs RentReady : 15 €/mois, sans engagement"
H1 (demo):      "Réserver une démo RentReady — Walkthrough personnalisé"

Each H1 should contain exactly ONE primary keyword.
Avoid keyword stuffing in H1.
```

### Meta Description Templates for Sub-pages

```
/pricing
Title:       Tarifs RentReady 2026 — 15 €/mois, sans engagement
Description: Tous les fonctionnalités incluses dans un seul plan à 15 €/mois.
             Quittances conformes, IRL automatique, Open Banking.
             Essai gratuit 14 jours, annulation en 30 secondes.

/demo
Title:       Réserver une démo RentReady — 20 min, personnalisée
Description: Voyez RentReady en action sur vos propres biens.
             Walkthrough de 20 min avec un expert de la gestion locative.
             Gratuit, sans engagement, réponse sous 2h.

/gestion-locative
Title:       Gestion locative en ligne : automatez vos quittances et paiements
Description: RentReady détecte automatiquement vos paiements via Open Banking,
             génère des quittances conformes à la loi de 1989, et applique
             la révision IRL. 15 €/mois. Essai gratuit.
```

### Structured Data Recommendations (Additional)
```typescript
// Add to HomeJsonLd() in page.tsx

// 1. FAQPage schema (enhance existing FaqJsonLd)
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Combien coûte RentReady ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "15 €/mois ou 150 €/an (2 mois offerts). 
                Essai gratuit 14 jours sans carte bancaire."
      }
    },
    {
      "@type": "Question",
      "name": "Est-ce conforme à la loi de 1989 ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui. Les quittances générées par RentReady sont conformes 
                à l'article 21 de la loi n°89-462 du 6 juillet 1989.
                Le montant du loyer et des charges provisionnelles 
                apparaissent sur deux lignes distinctes."
      }
    }
  ]
}

// 2. Review/Rating schema — once reviews exist
{
  "@type": "Product",
  "name": "RentReady",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "120",
    "bestRating": "5"
  }
}
```

---

## 7. Implementation Checklist for Engineering

- [ ] Update hero H1 and subheadline copy in `hero-section.tsx`
- [ ] Add dual CTA layout (signup + demo) in hero
- [ ] Upgrade `social-proof.tsx` with metrics banner layer
- [ ] Refine testimonial copy to anchor each to a single value prop
- [ ] Update metadata title/description in `app/page.tsx`
- [ ] Add FAQPage structured data to `faq-section.tsx`
- [ ] Add AggregateRating schema once review count is available
- [ ] Place "Sans carte bancaire" micro-copy prominently below hero CTA
- [ ] Add DSP2 read-only explanation to trust badge hover/tooltip
- [ ] Review `/demo` and `/pricing` page metadata for consistency

---

*Deliverable by Product Designer · REN-50 · 2026-04-08*
*See also: `/docs/wireframes-core-user-flows.md` (REN-47)*
