# REN-630 — V1 Onboarding Flow Design Spec
**From signup to first property in under 5 minutes**

---

## 1. Overview

This document specifies the complete V1 onboarding experience for RentReady — the end-to-end flow from new user signup to having the first property and lease visible in the landlord dashboard.

**Design principles:**
- Mobile-first
- Maximum 5 wizard steps (drop-off increases exponentially beyond 5)
- Progress indicator always visible
- Skip option for optional steps (Step 3 — tenant)
- Helpful tooltip on first field focus ("Vous pourrez toujours modifier cela plus tard")
- Zero empty dashboard moments — dashboard only shown when at least one property exists

**Deliverables:**
1. Signup / Welcome Screen
2. 5-step Onboarding Wizard
3. Empty States for all 5 core sections
4. Dashboard design with first-property reveal

---

## 2. Design Tokens

### Colors (existing RentReady palette)
```
--indigo-50:  #eef2ff   (bg tint, illustrations)
--indigo-600: #4f46e5   (primary CTA)
--indigo-700: #4338ca   (primary CTA hover)
--amber-100:  #fef3c7   (accent badge bg)
--amber-600:  #d97706   (accent badge text)
--emerald-100:#d1fae5   (success bg)
--emerald-600:#059669   (success text)
--muted:      #f4f4f5   (muted backgrounds)
--foreground: #18181b   (primary text)
--muted-foreground: #71717a (secondary text)
```

### Typography
```
Font: Inter (via next/font)
Heading XL:  2rem / 700 (welcome screen headline)
Heading LG:   1.5rem / 600 (step titles)
Heading MD:   1.125rem / 600 (section headers)
Body:         0.875rem / 400 (form labels, descriptions)
Caption:      0.75rem / 400  (helper text, tooltips)
```

### Spacing
```
Section padding: 1.5rem (mobile) / 3rem (desktop)
Card padding:    1.25rem
Gap between fields: 1rem
Gap between field groups: 1.5rem
Wizard step indicator height: 4px
Wizard step circle: 2rem diameter
```

### Border Radius
```
Buttons:      rounded-lg (0.375rem)
Cards:        rounded-xl (0.75rem)
Inputs:       rounded-md (0.375rem)
Badges:       rounded-full
Illustrations: rounded-2xl (1rem)
```

---

## 3. Signup / Welcome Screen

**Route:** `/signup`

### Layout (Mobile-first)
```
┌─────────────────────────┐
│  [RentReady Logo]       │
│                         │
│  headline: "Gérez vos    │
│  biens sans stress"      │
│                         │
│  [3 benefit pills]      │
│  • Gestion centralisée  │
│  • Paiements pista       │
│  • Documents garantis    │
│                         │
│  ┌───────────────────┐   │
│  │ Email             │   │
│  └───────────────────┘   │
│  ┌───────────────────┐   │
│  │ Mot de passe      │   │
│  └───────────────────┘   │
│                         │
│  [ S'inscrire 免费 ]      │
│                         │
│  [ Se connecter ]        │
│                         │
│  En vous inscrivant,     │
│  vous acceptez les CGU   │
└─────────────────────────┘
```

### States

**Default:**
- Logo centered at top (48px height)
- Headline: "Gérez vos biens sans stress" (XL, centered)
- 3 benefit pills below headline, icon + short text, horizontal scroll on mobile
- Email input with placeholder "votre@email.fr"
- Password input with show/hide toggle
- Primary CTA "Commencer" full-width, indigo-600
- Divider "ou" with "Déjà un compte ? Se connecter" link
- Footnote: "En vous inscrivant, vous acceptez nos Conditions Générales"

**Loading:**
- CTA button shows spinner (Loader2) and text "Création du compte..."
- All inputs disabled

**Error (email already exists):**
- Red border on email input
- Error message below: "Cet email est déjà utilisé. Essayez de vous connecter."
- Password input cleared

**Error (invalid email):**
- Red border on email input on blur
- Error message: "Veuillez entrer une adresse email valide"

**Success:**
- Brief loading state (500ms)
- Redirect to `/onboarding` (NOT to dashboard)

---

## 4. Onboarding Wizard

**Route:** `/onboarding` (protected — redirects to `/login` if not authenticated)

### Layout Structure
```
┌──────────────────────────────────────┐
│  RentReady logo  [étape 2/5] [Annuler]│
├──────────────────────────────────────┤
│  ████████░░░░░░░░░░░░░░░░░  [20%]   │
│                                      │
│  [Step illustration / icon]           │
│                                      │
│  [Step title]                        │
│  [Step subtitle]                     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Form fields                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Secondary action if skip avail.]   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [Retour]    [Continuer →]    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Progress Indicator
- 5 dots/segments at top
- Active step: indigo-600 filled
- Completed steps: indigo-600 with checkmark
- Future steps: gray-200
- Percentage shown below: "Étape 2 sur 5"
- Step label: "Ajoutez votre premier bien"

### Navigation
- "Retour" (secondary button, left): go to previous step
- "Continuer" (primary button, right): validate and go next
- "Annuler" (text link, top right): exit wizard, go to dashboard
- ESC key: same as Annuler
- Clicking completed step dot: navigate back to that step

### Keyboard Navigation
- Tab: move between fields
- Enter: submit current step (if valid)
- Arrow keys in progress bar: navigate between steps (completed ones only)

---

## Step 1: Add Your First Property

**Step label:** "Ajoutez votre premier bien"

### Fields
```
1. Adresse du bien
   - AddressAutocomplete input (with google places or similar)
   - Fallback: manual text input
   - Required

2. Type de bien
   - Select dropdown
   - Options: Appartement | Maison | Studio | Local commercial | Parking | Autre
   - Required, default: null

3. Nombre de lots/unités
   - Number input (min: 1, max: 999)
   - Default: 1
   - Required
   - Tooltip on first focus: "Un lot = un logement. Ex: un appartement = 1 lot. Un immeuble de 5 appartements = 5 lots."

4. Nom du bien (optionnel)
   - Text input
   - Placeholder: "Ex: Appartement Paris 11e"
   - Optional
```

### Illustration
- SVG of a building/house icon in indigo-50 circle

### Validation
- Address: required, min 5 chars
- Type: required selection
- Units: required, integer >= 1

### Error State
- Red border on invalid field
- Error message below field in red
- Focus stays on first invalid field

### Success Behavior
- On "Continuer": POST to `/api/properties`
- Loading state on button
- On success: store `propertyId` in wizard state, advance to Step 2

---

## Step 2: Add Your First Unit

**Step label:** "Configurez votre premier lot"

### Pre-filled Context
- Property name/address shown as read-only context banner above form:
  "Pour: [Property Name] — [Address]"

### Fields
```
1. Numéro / Label du lot
   - Text input
   - Placeholder: "Ex: Apt 1, RDC, Box A"
   - Required
   - Tooltip: "Identifiant unique pour retrouver ce lot facilement"

2. Surface (m²)
   - Number input (min: 1, max: 10000)
   - Unit suffix: "m²"
   - Optional

3. Nombre de pièces
   - Select: 1 | 2 | 3 | 4 | 5 | 6+
   - Optional

4. Loyer nu (charges comprises)
   - Currency input (€)
   - Placeholder: "0,00"
   - Required

5. Dont charges (par mois)
   - Currency input (€)
   - Placeholder: "0,00"
   - Default: 0
   - Optional, shown below main rent with indent
   - Tooltip: "Charges récupérables: charges de copropriété, eau, ordures..."

6. Dépôt de garantie
   - Currency input (€)
   - Default: 0
   - Tooltip: "Maximum 1 mois de loyer nu (loi Alur)"
```

### Illustration
- SVG of a door/key icon

### Validation
- Label: required, min 1 char
- Rent: required, > 0

### Success Behavior
- POST to `/api/units`
- Store `unitId` in wizard state
- Advance to Step 3

---

## Step 3: Add Your First Tenant (Optional)

**Step label:** "Ajoutez votre premier locataire"

### Skip
- Prominent "Pas prêt ? Sauter cette étape" link above the form
- Skip → advance to Step 4 directly

### Context Banner
- "Pour: [Unit Label] au [Property Name]"

### Fields
```
1. Prénom
   - Text input
   - Required (if not skipping)

2. Nom
   - Text input
   - Required (if not skipping)

3. Email
   - Email input
   - Optional (if not skipping)
   - Tooltip: "Pour envoyer des quittances automatiquement"

4. Téléphone
   - Tel input
   - Optional
   - Tooltip: "Pour les SMS de rappel de paiement"
```

### Illustration
- SVG of a person icon

### Validation
- FirstName: required if not skipped, min 1 char
- LastName: required if not skipped, min 1 char
- Email: valid email format if provided

### Success Behavior
- POST to `/api/tenants`
- Store `tenantId` in wizard state
- Advance to Step 4

---

## Step 4: Add Your First Lease

**Step label:** "Créez votre premier bail"

### Context Banner
- "Pour: [Unit Label] — [Property Name]"

### Fields
```
1. Type de bail
   - Select: Location vide | Location meublée
   - Required

2. Date de début
   - Date picker
   - Default: today
   - Required

3. Date de fin
   - Date picker
   - Required, must be after start date
   - Tooltip: "La durée minimale est de 3 ans pour une location vide, 1 an pour meublé"

4. Dépôt de garantie
   - Pre-filled from Step 2 (editable)
   - Currency input
   - Required

5.Modalité de paiement
   - Select: Virement bancaire | Chèque | Prélèvement automatique
   - Required

6. Date d'échéance
   - Select: 1er du mois | 5 | 10 | 15 | 20 | 25
   - Default: 1
   - Required
```

### Illustration
- SVG of a document/contract icon

### Validation
- LeaseType: required
- StartDate: required, not in past
- EndDate: required, after start date
- Deposit: required, >= 0
- PaymentMethod: required

### Success Behavior
- POST to `/api/leases`
- Advance to Step 5 (Dashboard Reveal)

---

## Step 5: Dashboard Reveal

**Step label:** "Félicitations, [FirstName] !"

### Layout
```
┌──────────────────────────────────────┐
│                                      │
│  🎉  [confetti SVG animation]        │
│                                      │
│  "Votre premier bien est en place !" │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [Property Card]               │  │
│  │  [Unit Card]                   │  │
│  │  [Lease badge: actif]         │  │
│  └────────────────────────────────┘  │
│                                      │
│  "Votre tableau de bord vous attend" │
│                                      │
│  [ Accéder à mon tableau de bord → ]│
│                                      │
│  [Découvrir les prochaines étapes]   │
└──────────────────────────────────────┘
```

### Dashboard Reveal Card Content
- Property name + address
- Unit label + surface + rent
- Lease status badge: "Bail actif" in emerald
- Tenant name if added

### Next Best Action Highlighted
- One highlighted card below the property card:
  "Prochaine étape recommandée: Configurez votre mode de paiement"
  [Configurer les paiements →]

### Animation
- Confetti animation on first load (CSS keyframes, 2s duration)
- Card slides in from bottom (translateY 20px → 0, 400ms ease-out)
- Sequential: property card → unit card → CTA (200ms delay each)

### "Découvrir les prochaines étapes" expands:
```
- "Inviter votre locataire au portail" [Inviter →]
- "Générer votre première quittance" [Générer →]
- "Configurer les rappels automatiques" [Configurer →]
```

---

## 5. Empty States Design

### Design Principles
- All empty states follow the same visual pattern for consistency
- Each has: illustration, headline, description, primary CTA, secondary action
- Illustration uses the project's indigo/amber color system
- Border: dashed, rounded-xl

---

### Properties Empty State

**Used in:** `/properties` when no properties exist

```
Layout:
┌────────────────────────────────────────────┐
│                                            │
│      [House SVG illustration, 64x64]       │
│           + small + badge overlay           │
│                                            │
│     "Aucun bien enregistré"                │
│                                            │
│  "Configurez votre premier bien en         │
│   moins de 5 minutes avec notre            │
│   guide pas à pas."                        │
│                                            │
│  [ Commencer la configuration ]  (indigo) │
│  [   Ajouter un bien manuellement ]  (out) │
│                                            │
│  "Vous pouvez importer vos biens           │
│   plus tard depuis n'importe quelle page." │
│                                            │
│  [ Insérer des données de démonstration ]  │
└────────────────────────────────────────────┘
```

**Components used:**
- PropertiesEmptyState (already exists at `/components/properties-empty-state.tsx`)
- PropertyForm dialog trigger
- SampleDataButton

**States:**
- Default: as above
- With wizard already open: "Continuer la configuration" button instead of "Commencer"
- After sample data: redirect to dashboard with toast "Données de démonstration chargées !"

---

### Tenants Empty State

**Used in:** `/tenants` when no tenants exist

```
Layout:
┌────────────────────────────────────────────┐
│                                            │
│      [Person SVG illustration, 64x64]      │
│           + small + badge overlay          │
│                                            │
│      "Aucun locataire"                     │
│                                            │
│  "Ajoutez votre premier locataire pour     │
│   suivre ses paiements et générer des      │
│   quittances."                             │
│                                            │
│  [  Configurer avec guide  ]        (indigo)│
│  [    Ajouter un locataire   ]      (out)  │
│                                            │
│  "Le guide vous aidera à configurer         │
│   bien + locataire + bail d'un seul coup." │
└────────────────────────────────────────────┘
```

**Components used:**
- TenantsEmptyState (already exists at `/components/tenants-empty-state.tsx`)
- TenantForm dialog
- SampleDataButton

---

### Leases Empty State

**Used in:** `/leases` when no leases exist

```
Layout:
┌────────────────────────────────────────────┐
│                                            │
│      [Document SVG illustration, 64x64]    │
│           + small + badge overlay          │
│                                            │
│       "Aucun bail créé"                    │
│                                            │
│  "Créez votre premier bail pour commencer  │
│   à suivre les paiements et générer des    │
│   quittances."                             │
│                                            │
│  [   Configurer avec guide   ]      (indigo)│
│  [     Créer un bail        ]       (out)  │
│                                            │
│  "Le guide création vous accompagne         │
│   étape par étape."                        │
└────────────────────────────────────────────┘
```

**Components used:**
- LeasesEmptyState (already exists at `/components/leases-empty-state.tsx`)
- LeaseForm dialog
- SampleDataButton

---

### Payments Empty State

**Used in:** `/payments` (or `/transactions`) when no transactions exist

**File to create:** `src/components/payments-empty-state.tsx`

```
Layout:
┌────────────────────────────────────────────┐
│                                            │
│      [Receipt SVG illustration, 64x64]     │
│           + small receipt icon overlay     │
│                                            │
│     "Aucune transaction enregistrée"       │
│                                            │
│  "Vos paiements apparaîtront ici une       │
│   fois votre premier bail mis en place."   │
│                                            │
│  [   Générer ma première quittance  ] (indigo)│
│                                            │
│  "Les quittances sont générées              │
│   automatiquement pour chaque paiement."   │
└────────────────────────────────────────────┘
```

**Design details:**
- Illustration: receipt/payment icon (indigo-50 bg, indigo-600 stroke)
- Overlay badge: small receipt icon in amber-100
- Primary CTA links to: `/leases` or opens lease creation dialog
- Secondary text explains automatic receipt generation

---

### Maintenance Empty State

**Used in:** `/maintenance` when no tickets exist

**Note:** This component already exists at `src/components/maintenance-empty-state.tsx` but needs enhancement.

```
Layout (ENHANCED — add payments-specific variant):
┌────────────────────────────────────────────┐
│                                            │
│      [Wrench SVG illustration, 64x64]      │
│           + check circle overlay (emerald)  │
│                                            │
│  "Aucune demande de maintenance"           │
│                                            │
│  "Vos locataires peuvent vous soumettre    │
│   des demandes de réparation ici.          │
│   Vous les suivez et gérez tout à un      │
│   endroit."                                │
│                                            │
│  [  Créer une demande test ]       (outline)│
│                                            │
│  3 info cards (existing pattern):          │
│  - "Comment ça marche"                     │
│  - "Type de demandes"                      │
│  - "Suivi en temps réel"                  │
└────────────────────────────────────────────┘
```

---

## 6. Dashboard Design (Post-Onboarding)

**Route:** `/dashboard`

### Layout
```
┌──────────────────────────────────────────────────────┐
│  Header: "Mon tableau de bord"  [user menu]         │
├────────────┬─────────────────────────────────────────┤
│            │  Welcome banner (first 7 days only):   │
│  Sidebar   │  "Bienvenue [FirstName] ! Vous avez    │
│  (nav)     │   configuré votre premier bien en Xmin"│
│            │  [Voir le guide de démarrage]           │
│            ├─────────────────────────────────────────┤
│            │  KPI Row (4 cards):                    │
│            │  [Biens] [Units] [Occupancy] [Revenue] │
│            │                                          │
│            ├─────────────────────────────────────────┤
│            │  Quick Actions Row:                     │
│            │  [+ Ajouter bien] [+ Ajouter locataire]│
│            │  [+ Enregistrer un paiement]            │
│            │                                          │
│            ├─────────────────────────────────────────┤
│            │  Recent Activity Feed:                  │
│            │  • Property "X" added - il y a 2h       │
│            │  • Unit "Apt 1" created - il y a 2h      │
│            │  • Lease started - il y a 1h             │
│            │                                          │
│            ├─────────────────────────────────────────┤
│            │  Upcoming Expirations (if leases exist) │
│            │  or Next Best Action card (if new)       │
└────────────┴─────────────────────────────────────────┘
```

### KPI Cards
```
1. Biens
   - Value: [count]
   - Subtext: "biens enregistrés"
   - Icon: Building2
   - Color: indigo

2. Lots
   - Value: [count]
   - Subtext: "lots au total"
   - Icon: Home
   - Color: blue

3. Taux d'occupation
   - Value: [percentage]%
   - Subtext: "[occupied]/[total] occupés"
   - Icon: TrendingUp
   - Color: emerald (good) or amber (needs attention)

4. Revenus du mois
   - Value: [amount] €
   - Subtext: "ce mois"
   - Icon: CreditCard
   - Color: emerald
```

### Quick Actions (3 buttons, horizontal row)
- `+ Ajouter un bien` → opens PropertyForm
- `+ Ajouter un locataire` → opens TenantForm
- `+ Enregistrer un paiement` → opens payment/transaction form

### Welcome Banner (first 7 days only)
```
┌─────────────────────────────────────────────────────┐
│  🎉Bienvenue ! Votre premier bien est configuré.  │
│                                                     │
│  Prochaine étape: [dynamic next best action]        │
│  [ Aller à [section] → ]                           │
│                                                     │
│  [ Not now ]                                        │
└─────────────────────────────────────────────────────┘
```
- Dismissible (stores dismissed state in localStorage)
- Shows for 7 days after first property creation
- Next best action logic:
  - No tenant yet → "Inviter votre locataire"
  - No lease yet → "Créer un bail"
  - Lease exists, no payments → "Enregistrer le premier paiement"
  - Everything set → hidden

### Recent Activity Feed
- Shows last 5 events
- Each item: icon + description + relative timestamp
- Icons per event type: Building2 (property), Home (unit), FileText (lease), User (tenant), CreditCard (payment)

### Upcoming Expirations Section (shown when leases exist)
```
┌─────────────────────────────────────────────────────┐
│  Baux arrivant à échéance                    [Voir]│
├─────────────────────────────────────────────────────┤
│  "Appartement Paris 11e" — expire le 15/06/2026    │
│  [Renouveler] [Relancer]                           │
└─────────────────────────────────────────────────────┘
```

---

## 7. Implementation Notes

### Routes
- `/signup` — welcome + signup form (exists or needs update)
- `/onboarding` — wizard flow (new or update existing)
- `/dashboard` — main dashboard (exists, needs first-property banner)
- `/properties`, `/tenants`, `/leases`, `/payments`, `/maintenance` — empty states (some exist, payments needs new)

### Component Changes
1. **Create** `src/components/payments-empty-state.tsx` (new)
2. **Update** `src/components/maintenance-empty-state.tsx` (enhance info cards)
3. **Update** `src/components/onboarding-wizard-v2.tsx` (ensure it covers all 5 steps per spec)
4. **Update** `src/app/(dashboard)/dashboard/page.tsx` (add welcome banner, quick actions prominence)

### Redirect Logic After Signup
```
/signup → on success → /onboarding (NOT /dashboard)
/onboarding → on complete → /dashboard
/onboarding → on cancel → /dashboard
```

### Sample Data
- `SampleDataButton` already exists and inserts demo data
- After sample data insertion, redirect to `/dashboard` with toast

### Progress Persistence
- Wizard state stored in React state (in-memory during session)
- Each step POSTs to API independently
- If user navigates away and returns, they resume from last completed step
- Track: propertyId, unitId, tenantId, leaseId across steps

---

## 8. File Checklist

| File | Action | Status |
|------|--------|--------|
| `src/app/signup/page.tsx` | Review/update for UX spec | Existing |
| `src/app/onboarding/page.tsx` | Update/verify 5-step wizard | Existing (v2) |
| `src/components/onboarding-wizard-v2.tsx` | Align with spec | Needs review |
| `src/components/properties-empty-state.tsx` | Already matches spec | ✅ |
| `src/components/tenants-empty-state.tsx` | Already matches spec | ✅ |
| `src/components/leases-empty-state.tsx` | Already matches spec | ✅ |
| `src/components/payments-empty-state.tsx` | Create new | TODO |
| `src/components/maintenance-empty-state.tsx` | Enhance info cards | TODO |
| `src/app/(dashboard)/dashboard/page.tsx` | Add welcome banner | TODO |
| `docs/ONBOARDING_DESIGN_SPEC.md` | This document | DONE |
