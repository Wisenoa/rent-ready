# RentReady Design System & Brand Identity
### Version 1.0 — April 2026

---

## 1. Brand Personality

**Core adjectives:** Professional · Trustworthy · Modern · Calm · Authoritative

RentReady communicates stability and competence — the same reassurance a good banker or accountant provides. It is **modern but not trendy**: clean lines, precise typography, subtle depth. Never playful, never cold. Think Stripe meets a French notarial office — technically precise but approachable.

**Tone of voice:** Direct, calm, confident. No startup jargon. No exclamation marks in UI copy. Informative, never condescending. Data speaks clearly; AI assists silently.

**Visual metaphor:** "Quiet luxury real estate" — clean surfaces, purposeful depth, light and space. Like a well-organized property file, but digital and effortless.

---

## 2. Color System

### Core Palette

| Role | Name | Light Mode | Dark Mode | Usage |
|------|------|-----------|-----------|-------|
| **Primary** | Stripe Blue | `oklch(0.488 0.217 264)` | `oklch(0.60 0.20 264)` | CTAs, active states, primary actions |
| **Background** | Pepper White | `oklch(0.975 0.004 90)` | `oklch(0.14 0.015 260)` | Page background |
| **Foreground** | Charcoal Navy | `oklch(0.18 0.01 260)` | `oklch(0.93 0.005 90)` | Body text |
| **Card** | Warm White | `oklch(0.99 0.003 90)` | `oklch(0.19 0.015 260)` | Card surfaces |
| **Accent** | Teal Duck | `oklch(0.92 0.04 190)` | `oklch(0.30 0.05 190)` | Highlights, badges, secondary accents |
| **Success** | Forest Green | `oklch(0.62 0.17 145)` | same | Paid rent, positive metrics |
| **Warning** | Amber | `oklch(0.75 0.15 75)` | same | Late payments, pending actions |
| **Destructive** | Soft Red | `oklch(0.577 0.245 27.325)` | same | Errors, cancel actions |
| **Sidebar** | Deep Navy | `oklch(0.20 0.04 260)` | `oklch(0.14 0.015 260)` | Sidebar background |
| **Border** | Warm Grey | `oklch(0.90 0.008 85)` | `oklch(0.30 0.015 260)` | Dividers, card borders |

### Semantic Color Usage

```
Primary Actions → Primary blue (Stripe Blue)
Success / Paid  → Success green
Warnings / Late → Warning amber
Errors / Cancel → Destructive red
Active Sidebar  → Sidebar accent blue
Info / Neutral  → Muted foreground
```

### Chart Palette (teal-to-blue gradient)
```
Chart 1: oklch(0.488 0.217 264) — primary blue
Chart 2: oklch(0.60 0.12 190)  — teal
Chart 3: oklch(0.72 0.08 165)  — light blue
Chart 4: oklch(0.50 0.15 230)  — slate blue
Chart 5: oklch(0.40 0.10 280) — indigo
```

---

## 3. Typography

### Font Stack
- **Sans:** `var(--font-sans)` — Geist Sans (primary UI font)
- **Mono:** `var(--font-geist-mono)` — for numbers, codes, amounts
- **Heading:** `var(--font-heading)` — same as sans with heavier weight

### Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-4xl` | 3.75rem / 60px | 800 | Hero headlines |
| `text-3xl` | 2.25rem / 36px | 700 | Page titles |
| `text-2xl` | 1.75rem / 28px | 700 | Section headings |
| `text-xl` | 1.25rem / 20px | 600 | Card titles, subsection headings |
| `text-lg` | 1.125rem / 18px | 500 | Subheadings, prominent labels |
| `text-base` | 1rem / 16px | 400 | Body text |
| `text-sm` | 0.875rem / 14px | 400 | Secondary info, metadata |
| `text-xs` | 0.75rem / 12px | 400 | Badges, timestamps, captions |

### Number Formatting (Monospace)
All financial amounts use monospace font. Examples:
- Rent: `1 250,00 €` (European format with space thousand separator)
- Dates: `12 janv. 2026` (French locale)
- Percentages: `+3,2 %`
- Negative change: `-1,8 %` (in warning red)

---

## 4. Spacing System

Uses a **4px base grid**. Common tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight internal padding |
| `space-2` | 8px | Compact element spacing |
| `space-3` | 12px | Icon-text gaps |
| `space-4` | 16px | Standard padding, card internal |
| `space-5` | 20px | Section padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Major section spacing |
| `space-12` | 48px | Page section dividers |
| `space-16` | 64px | Hero / marketing sections |

### Radius Scale
```
--radius-sm:   calc(var(--radius) * 0.6)   ≈ 4.5px
--radius-md:   calc(var(--radius) * 0.8)   ≈ 6px
--radius:      0.75rem                     ≈ 12px  (BASE)
--radius-lg:   calc(var(--radius) * 1.4)   ≈ 21px
--radius-xl:   calc(var(--radius) * 1.8)   ≈ 27px
--radius-2xl:  calc(var(--radius) * 2.6)   ≈ 39px
--radius-3xl:  calc(var(--radius) * 2.2)   ≈ 33px
--radius-4xl:  calc(var(--radius) * 2.6)   ≈ 39px
```

### Shadow System
```css
/* Surface depth levels */
shadow-sm:     0 1px 2px oklch(0 0 0 / 0.05)
shadow-md:     0 4px 6px oklch(0 0 0 / 0.07)
shadow-lg:     0 10px 15px oklch(0 0 0 / 0.10)
shadow-xl:     0 20px 25px oklch(0 0 0 / 0.12)
/* Glass surfaces use backdrop-blur + border + no shadow */
```

---

## 5. Layout Architecture

### App Shell
```
┌─────────────────────────────────────────────────┐
│  Smart Header (sticky)                          │
│  [Logo] [Search] [Notifications] [User Menu]   │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  Sidebar   │       Main Content Area           │
│  (240px)   │       (fluid, max-w-screen-xl)     │
│            │                                    │
│  [Nav]     │   ┌──────────────────────────┐    │
│            │   │  Page Header             │    │
│            │   │  [Title] [Actions]       │    │
│            │   ├──────────────────────────┤    │
│            │   │  Content Grid           │    │
│            │   │  [Cards / Tables / Forms]│   │
│            │   └──────────────────────────┘    │
└────────────┴────────────────────────────────────┘
```

### Sidebar Structure
- **Deep Navy background** (`--sidebar: oklch(0.20 0.04 260)`)
- Logo at top (32px height)
- Grouped navigation sections with subtle headers
- Active item: `--sidebar-accent: oklch(0.28 0.04 260)` background
- Collapsible on mobile → Sheet drawer

### Dashboard Layout (Key Screen)
```
┌──────────────────────────────────────────────────┐
│  Dashboard Header: "Bienvenue, Jean" + date     │
├──────────┬──────────┬──────────┬────────────────┤
│ Revenue  │ Properties│ Tenants  │ Paiements      │  ← 4 stat cards
│ €12 450  │ 3 active │ 5 active │ 2 en retard    │
├──────────┴──────────┴──────────┴────────────────┤
│                                                  │
│  [Revenue Chart — full width]                    │
│                                                  │
├─────────────────────┬──────────────────────────┤
│ Recent Payments     │ Paiements en retard       │
│ (last 5 rows)       │ (late payments list)       │
├─────────────────────┴──────────────────────────┤
│  Recent Properties          Recent Tenants       │
└─────────────────────────────────────────────────┘
```

### Responsive Breakpoints
```
sm:  640px   — Large phones
md:  768px   — Tablets
lg:  1024px  — Small laptops (sidebar visible)
xl:  1280px  — Standard desktop
2xl: 1536px  — Wide desktop
```

---

## 6. Core Component Library

### Buttons
**Variants:**
- `default` — Primary blue fill. Used for primary CTAs (submit, save, confirm)
- `outline` — Border only, transparent bg. Secondary actions
- `ghost` — No border, subtle hover. Low-emphasis actions (cancel, dismiss)
- `secondary` — Grey fill. Less prominent than default
- `destructive` — Soft red. Destructive actions (delete, cancel lease)
- `link` — Text only with underline. Inline secondary links

**Sizes:** `xs` `sm` `default` `lg` `icon` `icon-xs` `icon-sm` `icon-lg`

**Usage rules:**
- One primary button per screen section maximum
- Never stack two `default` buttons in a row
- Use `ghost` for in-table row actions (edit, view, delete icons)

### Cards
- `background: var(--card)` — warm white surface
- `border: 1px solid var(--border)` — subtle warm border
- `radius: var(--radius-lg)` — 21px radius
- `padding: var(--space-6)` — 24px internal padding
- `shadow: shadow-sm` — subtle lift

**Card Header pattern:**
```
[Card Title]           [Action Button]  ← header with title left, actions right
─────────────────────────────────────
[Card Content / Table / Chart]
```

### Tables
- Header row: `bg-muted` (garlic beige), `font-semibold text-muted-foreground`
- Data rows: `border-b border-border`, hover `bg-muted/50`
- Row actions: appear on hover (ghost icon buttons)
- Empty state: centered illustration + message + CTA

### Forms / Inputs
- `height: h-8` (32px), `radius: var(--radius-md)` (6px)
- Border: `var(--border)`, focus: `var(--ring)` (primary blue ring)
- Label: above input, `text-sm font-medium`
- Error state: destructive border + error message below
- Helper text: below input in `text-xs text-muted-foreground`

### Badges
- `success` — green fill, paid / active states
- `warning` — amber fill, pending / late states
- `secondary` — grey fill, draft / inactive states
- `outline` variant for neutral info badges
- Pill shape (`rounded-full`)

### Dialogs / Sheets
- Overlay: `bg-black/40 backdrop-blur-sm`
- Surface: card white, `radius-2xl`
- Sheet slides in from right (mobile-first patterns)
- Dialog centered with max-width `400px` for forms

### Toast / Notifications
- `Sonner` integration (already in codebase)
- Position: bottom-right
- Auto-dismiss: 4s for success, manual for errors

---

## 7. Key Screen Designs

### 7a. Dashboard (Propriétaire)
See Layout Architecture section above.

**Stat Cards:**
- Revenue du mois: total rent received + % vs last month (monospace numbers)
- Properties: count + active vs total
- Tenants: count + active
- Paiements en retard: count + total amount (warning amber if > 0)

**Revenue Chart:** Line chart (teal gradient fill), 12-month view, hover tooltip
**Recent Payments:** Table — tenant name, amount, date, status badge
**Late Payments:** Table with warning styling + "Envoyer relance" button inline

### 7b. Property List
```
┌─────────────────────────────────────────────────────────────┐
│ Biens immobiliers                    [+ Ajouter un bien]   │
├─────────────────────────────────────────────────────────────┤
│ [Search]  [Filter: Statut ▾] [Filter: Type ▾]             │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 🏠 12 Rue de la Paix, Paris 75001                    │    │
│ │ 3 unités · 2 occupants · 4 500 €/mois              │    │
│ │ [Occupied badge] [Details] [Edit]                   │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 🏠 45 Av. Foch, Lyon 69006                          │    │
│ │ 1 unité · 0 occupants · 1 200 €/mois               │    │
│ │ [Vacant badge] [Details] [Edit]                    │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 7c. Lease Detail (Detail du bail)
```
┌─────────────────────────────────────────────────────────────┐
│ ← Retour    Bail — 12 Rue de la Paix, Apt 3B              │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────────────────┐       │
│ │ Locataire        │  │ Informations du bail       │       │
│ │ Marie Dupont     │  │ Loyer: 1 250,00 €/mois     │       │
│ │ 3 enfants       │  │ Charges: 150,00 €          │       │
│ │ [Voir profil]    │  │ Dépôt: 2 500,00 €          │       │
│ └──────────────────┘  │ Début: 1er jan. 2025       │       │
│                       │ Fin: 31 déc. 2025           │       │
│                       │ [Renouveler] [Modifier]     │       │
│                       └──────────────────────────────┘       │
├─────────────────────────────────────────────────────────────┤
│ Historique des paiements                                   │
│ [Mois] [Date] [Montant] [Statut] [Quittance] [Relance]    │
│ jan.   01/01  1 250€  [Payée ✓]   [PDF]    —            │
│ déc.   01/12  1 250€  [En retard]  [PDF]   [Relance]     │
└─────────────────────────────────────────────────────────────┘
```

### 7d. Tenant Card (Fiche locataire)
```
┌─────────────────────────────────────────────────────────────┐
│ ← Retour    Marie Dupont                                   │
├───────────────┬─────────────────────────────────────────────┤
│ [Avatar]     │ Locataire depuis: jan. 2023                  │
│ Marie Dupont  │ Biens: 12 Rue de la Paix Apt 3B             │
│ marie@email  │ Loyer: 1 250,00 €/mois                      │
│ 06 12 34 56  │ Statut: À jour                              │
│               │ [Envoyer message] [Modifier]                │
├───────────────┴─────────────────────────────────────────────┤
│ Documents          │ Historique                               │
│ - CNI ✓           │ - Paiements: 24/24 ✓                   │
│ - Bail ✓          │ - Relances: 1 (déc.)                    │
│ - Attestation ✓   │ - Réparations: 2                        │
│ [+ Ajouter]       │                                          │
└─────────────────────────────────────────────────────────────┘
```

### 7e. Payment / Rent Collection View
```
┌─────────────────────────────────────────────────────────────┐
│ Recouvrements — Janvier 2026                               │
├─────────────────────────────────────────────────────────────┤
│ Total attendu: 12 450,00 €  |  Reçu: 10 200,00 €          │
│ ████████████░░░░░░░░  82%                                  │
├─────────────────────────────────────────────────────────────┤
│ [Locataire]       [Loyer]  [Date]   [Statut]   [Actions]  │
│ Marie Dupont       1 250€   01/01   [Payée ✓]  [PDF]      │
│ Pierre Martin      1 000€   01/01   [En ret.] [Relance]   │
│ Sophie Bernard     1 400€   01/01   [Payée ✓]  [PDF]      │
│ Jean Leroy        1 250€   01/01   [Payée ✓]  [PDF]      │
└─────────────────────────────────────────────────────────────┘
```

### 7f. Onboarding Wizard (3 Steps)
```
Step 1 — Bienvenue
  "Quel est votre nom ?" [input]
  "Êtes-vous déjà propriétaire ?" [Oui / Non]

Step 2 — Ajouter votre premier bien
  Address search with autocomplete
  Property type: Maison / Appartement / Studio / Commerce
  [Passer cette étape]

Step 3 — Inviter un locataire
  "Ajouter votre premier locataire maintenant ?"
  [Nom] [Email] [Téléphone]
  [Passer cette étape] [Terminer]
```

---

## 8. Design Principles

1. **One primary action per screen section.** Avoid decision fatigue.
2. **Financial data uses monospace.** All euro amounts render in Geist Mono.
3. **Status = color + icon.** Users understand at a glance: green=paid, amber=pending, red=late.
4. **Tables breathe.** Adequate row height (48px min), clear headers, hover states.
5. **Empty states guide action.** Never show a blank screen — show a helpful message + CTA.
6. **Consistent radius across components.** Uses the shared radius scale, not arbitrary values.
7. **Dark mode is first-class.** All colors have dark-mode equivalents in globals.css.
8. **Glass surfaces for overlays.** `backdrop-blur-xl` + subtle borders create depth without clutter.
9. **Accessibility baseline: WCAG 2.1 AA.** All interactive elements have focus states; contrast ratios pass.
10. **Motion is subtle.** `transition-all` at 150-200ms ease-out. No bounce animations.

---

## 9. Component Status Reference

| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Built | CVA-based, all variants done |
| Card | ✅ Built | Uses `card` CSS variables |
| Input | ✅ Built | Uses `--input` variable |
| Badge | ✅ Built | Success/warning/destructive variants |
| Table | ✅ Built | Shadcn table component |
| Dialog/Sheet | ✅ Built | Shadcn dialog + sheet |
| Select | ✅ Built | Shadcn select |
| Tabs | ✅ Built | Shadcn tabs |
| Toast (Sonner) | ✅ Built | Already integrated |
| Skeleton | ✅ Built | For loading states |
| Command Palette | ✅ Built | ⌘K global search |
| Charts | ✅ Built | Recharts-based dashboard charts |

---

## 10. Handoff Notes for Engineering

- The design system is **already partially implemented** in `globals.css` and the UI component library in `src/components/ui/`
- Key CSS custom properties are defined in `:root` and `.dark` in `globals.css`
- All components use `class-variance-authority` (CVA) for variant management
- Color values use `oklch` for perceptual uniformity — use these directly, do not convert to hex
- The `cn()` utility from `lib/utils.ts` handles dark mode class merging
- Monospace font for all financial data: `font-mono` class
- The glass-surface classes in `globals.css` provide the "liquid glass" aesthetic for overlays and cards
- AI suggestion styling (`.ai-suggestion`) applies a subtle muted pulse for ambient AI inputs
- For new components, follow the existing shadcn/ui pattern with CVA + `cn()`
