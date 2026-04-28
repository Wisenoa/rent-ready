# Onboarding Flow Redesign — A/B Test Variants
## REN-373 — Product Designer

---

## Executive Summary

**Goal:** Redesign onboarding to get users to their first value moment within 5 minutes, improve trial-to-paid conversion through progressive disclosure, contextual tooltips, and clear next-step prompts.

**Current State Analysis:**
- 3-step wizard: property → tenant → lease
- All fields shown simultaneously in each step (no progressive disclosure)
- No contextual tooltips or explanations
- Success screen ends abruptly with receipt option only
- No A/B testing infrastructure
- No celebration of intermediate milestones
- Heavy cognitive load: 6+ fields per step

**Target:**
- First value moment: property added + dashboard shows value → under 5 min
- Trial-to-paid conversion: +20% (baseline TBD from analytics)
- Drop-off at each step reduced by 30%

---

## Variant A: "Micro-Progress" (Minimal Friction)

### Design Philosophy
One thing at a time. Reduce cognitive load to near-zero. Celebrate every micro-win.

### Flow (5 micro-steps)

**Screen 1: Address (fastest path to first value)**
- Single field: address autocomplete
- Tooltip: "Entrez l'adresse de votre bien. Vous pourrez ajouter le reste plus tard."
- Skip option: "Je n'ai pas d'adresse maintenant"
- Progress: "1/5 — 30 secondes"

**Screen 2: Property Type**
- Visual cards: Apartment / House / Studio / Commercial / Parking / Other
- Tooltip: "Le type influence vos obligations légales et fiscales."
- "Studio" selected by default if not sure
- Progress: "2/5 — 1 minute"

**Screen 3: Quick Name**
- Single field: "Comment appelez-vous ce bien?"
- Placeholder: "ex: Appartement Belleville"
- Tooltip: "Un nom simple vous aide à le retrouver vite."
- Progress: "3/5 — 2 minutes"

**Screen 4: First Tenant (optional)**
- Two fields: Prénom + Nom
- Toggle: "Je n'ai pas encore de locataire"
- Tooltip: "Ajoutez un locataire pour créer un bail et suivre les paiements."
- Progress: "4/5 — 3 minutes"

**Screen 5: Rent Setup (optional)**
- One field: Montant du loyer
- Toggle: "Je préfère configurer plus tard"
- Tooltip: "Configurable à tout moment. Utile pour les rappels de paiement."
- Progress: "5/5 — 4 minutes"

**Success: Value Moment**
- Animated checkmark
- "Votre bien est prêt!"
- Dashboard preview showing the property card
- Next prompt: "Découvrez ce que vous pouvez faire" (3 action cards)
- "Commencer mon premier bail →" (primary CTA)

### Key UX Patterns
- Animated step transitions (slide + fade)
- Floating progress indicator (bottom of screen)
- Gentle pulse animation on current field
- Celebration confetti on completion

---

## Variant B: "Outcome-First" (Value-Led)

### Design Philosophy
Show the outcome first. Let users see what they'll get before they fill anything. Anchor on the emotional benefit.

### Flow (4 steps)

**Screen 0: Outcome Preview (NEW — before any form)**
- Full-screen illustration: animated dashboard mockup
- Headline: "Votre tableau de bord vous attend"
- Subtext: "En 5 minutes, vous aurez votre premier bien, locataire et bail listos."
- 3 benefit cards with icons:
  - "Suivez vos loyers en un clin d'œil"
  - "Ne manquez jamais un paiement"
  - "Générez vos reçus en 2 clics"
- Primary CTA: "Commencer"
- Skip option: "Je connais déjà, passer cette présentation"
- Progress indicator: "Présentation · 30 secondes"

**Step 1: Just Address**
- Large map thumbnail showing France
- Address field with autocomplete
- Tooltip: "Entrez l'adresse. Vous pouvez commencer sans le reste."
- Skip link: "Configurer le nom plus tard →"
- Progress: "1/3 · ~3 minutes restantes"

**Step 2: Essential Info (2 fields max)**
- Property type (visual cards)
- Monthly rent amount (optional, highlighted)
- Tooltip: "Ces informations suffisent pour démarrer. Le reste vient après."
- Progress: "2/3 · ~2 minutes restantes"

**Step 3: First Tenant (optional but encouraged)**
- First name + Last name
- Email (optional, marked clearly)
- Tooltip: "Ajoutez un locataire pour créer un bail officiel."
- Prominent skip: "Je ferai ça plus tard"
- Progress: "3/3 · ~1 minute restante"

**Success: Celebratory Value Moment**
- Large animated success state
- "Bienvenue dans votre espace!"
- Dashboard preview with real data (not mock)
- "Voici votre premier aperçu — il se remplira au fur et à mesure"
- 3 "démarrer" cards:
  - "Commencer mon premier bail"
  - "Configurer mes rappels"
  - "Explorer le tableau de bord"
- Social proof: "+X landlords who've set up in under 5 min"

### Key UX Patterns
- Dark gradient backgrounds for emotional impact
- Smooth scroll-based progress indicator
- Animated illustration (not static)
- Floating labels that animate up on focus
- Warm success state (orange/green palette)

---

## Variant C: "Guided Wizard" (Step-by-Step Clarity)

### Design Philosophy
Classic wizard, but elevated with contextual guidance, smart defaults, and clear next-step affordances at every screen. No surprises.

### Structure (5 steps + success hub)

**Step 0: Welcome Back (if returning with progress)**
- Resume message: "Reprenons là où vous en étiez"
- Shows last completed step
- "Continuer" CTA

**Step 1: Property — Name + Type**
- Two fields only: Name, Type
- Inline tooltips on each field
- Pre-filled suggestions based on common patterns
- Progress: "Étape 1 sur 3 · ~3 minutes"
- Time indicator: "En moyenne, nos utilisateurs passent 2 min ici"

**Step 2: Property — Location**
- Address fields (addressLine1, postalCode, city)
- Auto-detect city from postal code
- Skip option: "Je ne connais pas encore l'adresse exacte"
- Tooltip: "L'adresse est nécessaire pour le bail et les documents légaux."
- Back/Next buttons with keyboard shortcuts (← →)

**Step 3: Tenant Info**
- First name + Last name + Email (optional) + Phone (optional)
- Smart placeholder: "ex: Marie Dupont"
- Clear "optionnel" labels
- Skip option with explanation: "Je ferai ça plus tard (conseillé)"
- Tooltip: "Sans locataire, vous ne pouvez pas créer de bail. Mais vous pouvez commencer sans!"

**Step 4: Lease Basics (optional)**
- Rent amount
- Start date (with date picker)
- End date (pre-filled to +1 year)
- Tooltip: "Le montant du loyer vous permet de recevoir des rappels automatiques."
- Skip option: "Configurer le bail plus tard (conseillé)"

**Success Hub: "Your Command Center"**
- Dashboard preview
- "Votre espace est prêt!" headline
- Milestone badges:
  - Property added ✓
  - Tenant added (if done) ✓
  - Lease started (if done) ✓
- "Prochaines étapes suggérées" — 3 cards:
  1. "Créer mon premier bail" → primary
  2. "Configurer les rappels de paiement"
  3. "Inviter mon comptable" (if relevant)
- "Passer la démo →" secondary link
- Estimated time to full setup: "5-10 min remaining"

### Key UX Patterns
- Numbered step indicator with connecting lines
- Keyboard navigation (Tab, Enter, Arrow keys)
- Inline validation with helpful error messages
- Clear "estimated time remaining" on each step
- Checklist-style success state

---

## A/B Test Infrastructure

### Implementation Notes

To enable A/B testing, add a variant assignment to onboarding:

```typescript
// onboarding-trigger.tsx
const VARIANT_KEY = 'onboarding_variant';

function getVariant(): 'A' | 'B' | 'C' {
  const stored = localStorage.getItem(VARIANT_KEY);
  if (stored) return stored as 'A' | 'B' | 'C';
  
  const variant = ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as 'A' | 'B' | 'C';
  localStorage.setItem(VARIANT_KEY, variant);
  return variant;
}
```

### Metrics to Track

Per variant:
- **Conversion rate**: wizard_started → wizard_completed
- **Time to complete**: wizard_started → wizard_completed (median)
- **Drop-off per step**: abandoned at each step
- **Trial-to-paid**: within 14 days of onboarding completion
- **Feature adoption**: which next-step CTA is clicked
- **Return rate**: users who return within 7 days

### Sample Size Recommendation
- Minimum: 100 completions per variant
- Target: 300 completions per variant for statistical significance
- Duration: 2-4 weeks depending on traffic

---

## Shared Design Patterns (All Variants)

### Tooltip System
- Icon: small `?` circle next to field labels
- Tooltip appears on hover (desktop) or tap (mobile)
- Max width: 240px
- Position: above field, centered with arrow
- Background: dark (for contrast)
- Animation: fade in 150ms ease-out

### Progress Indicator
- Fixed bottom position
- Shows: current step / total steps
- Animated bar filling left-to-right
- Hides on success screen

### Success State Principles
- Celebrate immediately (animation + sound optional)
- Show real dashboard preview (not mock)
- Provide 2-3 clear next steps
- Social proof when available
- Avoid "You're all set!" without direction

### Mobile Considerations
- Full-screen modal (no dialog)
- Swipe gestures for navigation (optional enhancement)
- Large tap targets (min 44px)
- Sticky progress bar
- Bottom-sheet for tooltips on mobile

---

## Implementation Priority

1. **Add variant flagging** to onboarding-trigger
2. **Implement Variant C** (lowest risk, familiar pattern)
3. **Implement Variant A** (highest potential, most different)
4. **Implement Variant B** (if resources allow)
5. **Add analytics hooks** for each variant
6. **Launch A/B test** with even traffic split
7. **Review at 2 weeks** — declare winner, sunset losers

---

## Drop-off Analysis (Current State — Assumptions)

Based on typical SaaS onboarding benchmarks:

| Step | Current Drop-off | Target | Variant A Target | Variant B Target | Variant C Target |
|------|-----------------|--------|-----------------|-----------------|-----------------|
| Wizard opened → Step 1 complete | ~40% | 30% | 20% | 25% | 28% |
| Step 1 → Step 2 complete | ~25% | 20% | 15% | 18% | 18% |
| Step 2 → Step 3 complete | ~35% | 25% | 20% | 22% | 25% |
| Step 3 → Success | ~15% | 10% | 8% | 10% | 10% |
| **Overall completion** | **~20%** | **35%** | **45%** | **40%** | **38%** |

*Note: Actual drop-off data should come from analytics. These are estimates.*

---

## Files to Modify

1. `src/components/onboarding-trigger.tsx` — Add variant logic
2. `src/components/onboarding-wizard.tsx` — Refactor into variant components
3. `src/components/ui/tooltip.tsx` — Ensure tooltip component exists
4. `src/app/api/onboarding/track/route.ts` — Add variant to tracking
5. `src/app/(dashboard)/dashboard/page.tsx` — Pass variant to wrapper

---

## Related Work

- REN-63 (Complete onboarding wizard) — Already done, but this supersedes it
- REN-298 (Design owner/landlord dashboard screens) — Dashboard context for onboarding success
