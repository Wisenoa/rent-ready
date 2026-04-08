# Onboarding Wizard — UX Design Spec

**Issue:** REN-63 — [P0] Complete onboarding wizard  
**Designer:** Product Designer Agent  
**Date:** 2026-04-08  
**Status:** Implementation-ready

---

## 1. Overview

The onboarding wizard is the first interaction a new landlord has with RentReady after signup. It must:

- Get the user to "first lease" in under 10 minutes
- Feel fast, encouraging, and premium
- Allow escape routes (skip, save for later) without losing momentum
- Instrument every drop-off point forFunnel optimization

---

## 2. User Flow

```
Landing on empty dashboard
        │
        ▼
[OnboardingTrigger] auto-shows wizard after 300ms
        │
        ▼
┌─────────────────────────────────────────┐
│  Step 1: PROPERTY QUICK-ADD            │
│  "Ajouter votre premier bien"           │
│  [Name] [Type] [Address] [Postal] [City] │
│  Surface / Rooms (optional)             │
│  [Skip — I'll do this later]            │  ← NEW: skip option
│  [Continuer →]                          │
└─────────────────────────────────────────┘
        │  propertyId saved in state
        ▼
┌─────────────────────────────────────────┐
│  Step 2: TENANT QUICK-ADD              │
│  "Ajouter votre premier locataire"      │
│  [FirstName] [LastName]                 │
│  [Email] [Phone]                        │
│  [Address] [Postal] [City]              │
│  [Skip — I don't have a tenant yet]    │  ← NEW: skip option
│  [← Retour] [Continuer →]              │
└─────────────────────────────────────────┘
        │  tenantId saved in state
        ▼
┌─────────────────────────────────────────┐
│  Step 3: LEASE CREATION                │
│  "Créer le premier bail"               │
│  [LeaseType] [Rent] [Charges]          │
│  [Deposit] [StartDate] [EndDate]       │
│  [PaymentDay] [PaymentMethod]          │
│  [← Retour] [Créer le bail →]          │
└─────────────────────────────────────────┘
        │  lease created
        ▼
┌─────────────────────────────────────────┐
│  Step 4: SUCCESS                       │
│  Confetti animation                     │
│  "Premier bail créé ! 🎉"              │
│  Next steps:                           │
│  - Generate first receipt               │
│  - Add another property                │
│  - Invite accountant                   │
│  [Accéder à mon tableau de bord →]    │
└─────────────────────────────────────────┘
```

---

## 3. Design Specifications

### 3.1 Layout

- **Container:** Dialog, `sm:max-w-lg`, full height on mobile (`max-h-[95vh]`)
- **Mobile:** Full-screen takeover on mobile (no dialog chrome)
- **Scroll:** Internal scroll within form content

### 3.2 Step Indicator

```
[●]──────[○]──────[○]     Step 1 of 3
  Ajouter un bien
```

- Horizontal stepper at top
- Active step: indigo fill, label visible
- Completed steps: emerald fill + checkmark
- Pending steps: muted gray
- Connector lines animate from gray → emerald as steps complete

### 3.3 Typography

| Element | Style |
|---|---|
| Step title | `text-lg font-semibold` + indigo icon |
| Step subtitle | `text-sm text-muted-foreground` |
| Field labels | `text-sm font-medium` |
| Field input | shadcn Input |
| Helper text | `text-xs text-muted-foreground` |
| Error message | `text-xs text-red-500` |
| CTA button | `w-full` primary button |
| Skip link | `text-sm text-muted-foreground underline` |

### 3.4 Color System (from design tokens)

- **Primary (CTA):** `oklch(0.488 0.217 264)` — deep indigo
- **Success:** `oklch(0.62 0.17 145)` — emerald green
- **Background:** `oklch(0.975 0.004 90)` — warm white
- **Card:** `oklch(0.99 0.003 90)` — near white
- **Text:** `oklch(0.18 0.01 260)` — near black
- **Muted:** `oklch(0.50 0.01 260)` — gray

### 3.5 Spacing

- Dialog padding: `p-6`
- Form field spacing: `space-y-4`
- Button gap: `gap-3`
- Step indicator gap: `gap-1` (connectors), `gap-4` (step circles)

---

## 4. Interaction Specifications

### 4.1 Progress Saving

- Wizard state (propertyId, tenantId, currentStep) saved to `localStorage` key `onboarding_wizard_state`
- On re-open: restore state and jump to correct step
- On complete: clear localStorage

### 4.2 Skip Options

**Step 1 (Property):** Show "skip" link. If skipped:
- Set `propertySkipped = true`
- Jump to Step 2 or Step 3 directly
- Show "You can add a property later from the Properties page" toast

**Step 2 (Tenant):** Show "skip" link. If skipped:
- Set `tenantSkipped = true`
- Jump to Step 3
- If Step 1 was also skipped → success immediately (no lease possible)
- Show "Add a tenant to create a lease" contextual message

### 4.3 Event Tracking (instrumentation)

| Event | Trigger | Metadata |
|---|---|---|
| `onboarding_started` | Wizard opens | — |
| `onboarding_step_1_completed` | Property form submitted | `propertyId`, `duration_seconds` |
| `onboarding_step_1_skipped` | Skip property | — |
| `onboarding_step_2_completed` | Tenant form submitted | `tenantId`, `duration_seconds` |
| `onboarding_step_2_skipped` | Skip tenant | — |
| `onboarding_step_3_completed` | Lease created | `propertyId`, `tenantId`, `rentAmount`, `duration_seconds` |
| `onboarding_completed` | Wizard finished | Full funnel metadata |
| `onboarding_abandoned` | Dialog closed mid-flow | `step`, `duration_seconds`, `formData` (partial) |

### 4.4 Time Estimates

Show in header for each step:
- Step 1: "~1 minute"
- Step 2: "~1 minute"
- Step 3: "~30 seconds"

### 4.5 Mobile Behavior

- On mobile (< sm): full-screen dialog
- Sticky header with step name and progress
- Form fields stack vertically
- CTA button sticks to bottom of viewport
- Back button always visible

### 4.6 Smart Defaults (French market)

| Field | Default | Rationale |
|---|---|---|
| `propertyType` | `APARTMENT` | Most common in France |
| `leaseType` | `UNFURNISHED` | 80% of rentals are vide |
| `paymentDay` | `1` | Standard French practice |
| `paymentMethod` | `TRANSFER` | Most common method |
| `startDate` | Today | Common for new leases |
| `endDate` | Today + 1 year | Standard 3-year lease |

---

## 5. Step-by-Step Content

### Step 1: Property

**Header:** "Ajouter votre premier bien"
**Subheader:** "Commencez par enregistrer votre bien — vous pouvez ajouter des détails plus tard."
**CTA:** "Continuer"
**Skip:** "Je n'ai pas de bien à ajouter maintenant"

Fields:
1. Nom du bien* (text, placeholder: "Appartement Belleville")
2. Type de bien* (select: Appartement, Maison, Studio, Local commercial, Parking, Autre)
3. Adresse* (text)
4. Code postal* (text, 5 digits)
5. Ville* (text)
6. Surface (m²) (number, optional)
7. Pièces (number, optional)

### Step 2: Tenant

**Header:** "Ajouter votre premier locataire"
**Subheader:** "Saisissez les infos de votre locataire. Vous pouvez compléter son dossier plus tard."
**CTA:** "Continuer"
**Skip:** "Pas de locataire pour le moment"

Fields:
1. Prénom* (text)
2. Nom* (text)
3. Email (email)
4. Téléphone (tel)
5. Adresse* (text)
6. Code postal* (text)
7. Ville* (text)

### Step 3: Lease

**Header:** "Créer le premier bail"
**Subheader:** "Liez votre bien et votre locataire. Le bail sera créé en statut actif."
**CTA:** "Créer le bail"
**Back:** "Retour"

Fields:
1. Type de bail* (select: Location vide, Location meublée)
2. Loyer (€)* (number)
3. Charges (€) (number)
4. Dépôt de garantie (€) (number, default = rent amount)
5. Date de début* (date)
6. Date de fin (date, default = start + 1 year)
7. Jour de paiement (number, 1-28)
8. Mode de paiement (select: Virement, Chèque, Prélèvement)

Monthly total preview shown when rent > 0.

### Step 4: Success

**Visual:** Large emerald checkmark, confetti animation
**Headline:** "Premier bail créé ! 🎉"
**Body:** "Votre premier bien est configuré. Vous pouvez maintenant suivre les paiements, générer des quittances et gérer vos locataires."
**CTA Primary:** "Accéder à mon tableau de bord"
**CTA Secondary:** "Générer ma première quittance"

---

## 6. Empty State (Dashboard without wizard)

When user has properties but no active leases:
- Show contextual empty state in "Baux" section
- CTA: "Créer mon premier bail"
- Does NOT trigger full wizard

When user has properties and active leases:
- No onboarding UI
- Dashboard shows full stats

---

## 7. Error Handling

| Scenario | Behavior |
|---|---|
| API error on property create | Toast error, form stays open, button re-enables |
| API error on tenant create | Toast error, form stays open, button re-enables |
| API error on lease create | Toast error, form stays open, button re-enables |
| Network failure | Toast "Connexion perdue, veuillez réessayer" |
| Session expired | Redirect to login |

---

## 8. Accessibility

- All form fields have associated `<Label>` elements
- Focus trapped within dialog while open
- `aria-live="polite"` on step transitions for screen readers
- Error messages linked via `aria-describedby`
- Skip links have `aria-label="Passer cette étape"`
- Step indicator has `role="progressbar"` with `aria-valuenow`

---

## 9. Funnel Drop-off Instrumentation

Each step logs to `/api/onboarding/track`:
```json
{
  "event": "onboarding_step_N_completed|skipped|abandoned",
  "metadata": {
    "step": 1,
    "duration_seconds": 45,
    "has_property": true,
    "has_tenant": false
  },
  "timestamp": "2026-04-08T..."
}
```

Dashboard shows funnel metrics accessible to product team.

---

## 10. Files to Update

| File | Change |
|---|---|
| `src/components/onboarding-wizard.tsx` | Add skip options, progress persistence, confetti, improved success state |
| `src/components/onboarding-trigger.tsx` | Add localStorage state restoration |
| `src/app/api/onboarding/track/route.ts` | Create tracking endpoint (if not exists) |
| `docs/ONBOARDING_UX.md` | This document |
