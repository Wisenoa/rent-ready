# RentReady — Core User Flow Wireframes

**Issue:** REN-47 | **Role:** Product Designer | **Date:** 2026-04-08
**Status:** Complete
**Project:** RentReady (French Rental Property Management SaaS)
**Design Philosophy:** Mobile-first, conversion-focused, trust-building, legally reassuring

---

## DESIGN SYSTEM FOUNDATION

### Color Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep Slate Blue | `#1E3A5F` | Headers, CTAs, nav active |
| Primary Light | Soft Blue | `#3B6B9A` | Links, secondary buttons |
| Accent | Warm Amber | `#E8A838` | Highlights, badges, alerts |
| Success | Forest Green | `#2D7A4F` | Paid status, confirmations |
| Warning | Burnt Orange | `#D4601A` | Late payments, renewals due |
| Danger | Brick Red | `#C0392B` | Unpaid, errors, cancel |
| Background | Off-White | `#F8F7F4` | Page background |
| Surface | Pure White | `#FFFFFF` | Cards, modals |
| Border | Light Gray | `#E5E3DE` | Dividers, input borders |
| Text Primary | Charcoal | `#1A1A1A` | Headings, body |
| Text Secondary | Medium Gray | `#6B7280` | Labels, captions |
| Text Muted | Light Gray | `#9CA3AF` | Placeholders, hints |

### Typography Scale
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (Page Title) | Inter | 28px | 700 | 1.2 |
| H2 (Section) | Inter | 22px | 600 | 1.3 |
| H3 (Card Title) | Inter | 18px | 600 | 1.4 |
| Body | Inter | 16px | 400 | 1.5 |
| Body Small | Inter | 14px | 400 | 1.5 |
| Caption | Inter | 12px | 400 | 1.4 |
| Button | Inter | 16px | 600 | 1 |

### Spacing System (8px base unit)
- `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px

### Border Radius
- Cards: 12px | Buttons: 8px | Inputs: 8px | Badges: 4px | Modals: 16px

### Shadows
- Card: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
- Modal: `0 20px 60px rgba(0,0,0,0.15)`
- Dropdown: `0 4px 12px rgba(0,0,0,0.10)`
- Button hover: `0 4px 12px rgba(30,58,95,0.25)`

---

## 1. ONBOARDING FLOW WIREFRAME

**Route:** `/onboarding` (4-step wizard)
**Goal:** Get landlord from signup to first lease in < 15 minutes
**Design:** One question per screen. Progress bar at top. Large touch targets. No distraction.

### Step 1: Welcome + Property Count
```
┌─────────────────────────────────────────────┐
│  [RentReady Logo]              Étape 1/4   │
│  ═══════════════░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│  Bienvenue ! Commençons par vos            │
│  biens immobiliers.                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Combien de propriétés louez-vous  │   │
│  │  actuellement ?                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  ○ 1    │ │  ○ 2-5  │ │  ○ 6+   │       │
│  │  seule  │ │  quelques │ │ plusieurs│     │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          Continuer →               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Passer →] Je n'ai pas de propriété      │
│              je veux juste un modèle       │
└─────────────────────────────────────────────┘
```

**Mobile (375px):** Full-width option cards, stacked vertically. Tap to select.

### Step 2: Add First Property
```
┌─────────────────────────────────────────────┐
│  [RentReady Logo]              Étape 2/4   │
│  ═══════════════════░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│  Ajoutons votre première propriété         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Adresse de la propriété           │   │
│  │  ─────────────────────────────────  │   │
│  │  12 rue des Lilas, 75011 Paris     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ Type          │  │ Loyer mensuel │       │
│  │ [Appartement▾]│  │ [___] €       │       │
│  └──────────────┘  └──────────────┘       │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ Surface       │  │ Nombre de    │       │
│  │ [___] m²     │  │ pièces [___] │       │
│  └──────────────┘  └──────────────┘       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │Type de bail: ○ Meublé  ○ Nu        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          Continuer →               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [← Retour]                                 │
└─────────────────────────────────────────────┘
```

**Mobile:** Single column form, 48px input heights, large radio buttons.

### Step 3: Add First Tenant (or skip)
```
┌─────────────────────────────────────────────┐
│  [RentReady Logo]              Étape 3/4   │
│  ═══════════════════════════░░░░░░░░░░░░░  │
│                                             │
│  Votre premier locataire                   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Nom complet                       │   │
│  │  ─────────────────────────────────  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Email                             │   │
│  │  ─────────────────────────────────  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Téléphone (optionnel)            │   │
│  │  ─────────────────────────────────  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Date d'entrée prévue              │   │
│  │  [__/__/____]                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │          Continuer →               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [← Retour]  [Passer cette étape →]         │
└─────────────────────────────────────────────┘
```

**Skip flow:** If landlord skips, they go straight to dashboard. A banner prompts "Add tenant" on property card.

### Step 4: Generate First Lease (or go to dashboard)
```
┌─────────────────────────────────────────────┐
│  [RentReady Logo]              Étape 4/4   │
│  ═══════════════════════════════░░░░░░░░░  │
│                                             │
│  Créez votre premier bail                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📄                                │   │
│  │                                     │   │
│  │  Bail TYPE — 12 rue des Lilas      │   │
│  │                                     │   │
│  │  Loyer: 850 € charges comprises    │   │
│  │  Tenant: Marie Dupont              │   │
│  │  Type: Meublé (3 ans)              │   │
│  │                                     │   │
│  │  ✓ Clauses required loi 1989       │   │
│  │  ✓ Certificat DPE inclus           │   │
│  │  ✓ Dépôt de garantie: 850 €       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📥 Télécharger le bail PDF        │   │
│  │  (Vous pourrez le modifier plus tard)│   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Accéder à mon tableau de bord →   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [← Retour]                                 │
└─────────────────────────────────────────────┘
```

**Mobile:** Stacked cards, PDF download button full-width, primary CTA dominant.

---

## 2. DASHBOARD LAYOUT WIREFRAME

**Route:** `/app/dashboard`
**Goal:** Landlord sees their entire rental picture in < 3 seconds
**Layout:** Left sidebar (desktop) / bottom tab bar (mobile)

### Desktop (1280px+)
```
┌──────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌───────────────────────────────────────────────┐  │
│ │          │ │ HEADER: "Bonjour, Thomas"    [🔔] [?] [⚙️] [👤] │  │
│ │ SIDEBAR  │ ├───────────────────────────────────────────────┤  │
│ │          │ │ SUMMARY CARDS (4 across)                       │  │
│ │ [Logo]   │ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │  │
│ │          │ │ │  3     │ │  2     │ │ 2 450€ │ │  1     │  │  │
│ │ 📊 Tableau│ │ │Bienses │ │Occupés │ │Loyer   │ │Loyers │  │  │
│ │ 📦 Biens │ │ │        │ │        │ │du mois │ │en retard│ │  │
│ │ 👤 Locat.│ │ └────────┘ └────────┘ └────────┘ └────────┘  │  │
│ │ 📄 Baux  │ ├───────────────────────────────────────────────┤  │
│ │ 💰 Loyer │ │ CONTENT AREA                                 │  │
│ │ 🧾 Reçus │ │ ┌─────────────────────────────────────────┐  │  │
│ │ ⚠️ Alertes│ │ │ PROPERTIES TABLE / GRID               │  │  │
│ │ 📈 Rapports│ │ │                                         │  │  │
│ │          │ │ │ [12 rue Lilas] [Lyon] [Dupont]  [💰850€]│  │  │
│ │ ───────  │ │ │ [8 av Fleurs]  [Paris][Martin] [💰1200€]│  │  │
│ │ [⚙️ Param]│ │ │ [3 rue Soleil]  [Lyon] [⚠️ En retard] │  │  │
│ │          │ │ └─────────────────────────────────────────┘  │  │
│ └──────────┘ └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌────────────────────────────────┐
│ ☰  RentReady    [🔔] [👤]    │  ← Top bar
├────────────────────────────────┤
│ ┌──────────────────────────┐  │
│ │ 👋 Bonjour, Thomas       │  │
│ │ Voici votre activité    │  │
│ └──────────────────────────┘  │
│                                │
│ ┌────────┐ ┌────────┐        │
│ │  3     │ │  2/3    │ ← Horiz scroll
│ │ Biens  │ │ Occupés │        │
│ └────────┘ └────────┘        │
│ ┌────────┐ ┌────────┐        │
│ │ 2 450€ │ │  1     │        │
│ │ Loyer  │ │ ⚠️ Retard│        │
│ └────────┘ └────────┘        │
│                                │
│ ┌──────────────────────────┐  │
│ │ 🔴 ALERTS               │  │
│ │ ⚠️ Bail expires 60j     │  │
│ │    8 av Fleurs → Martin│  │
│ │ 💰 Loyer en retard      │  │
│ │    3 rue Soleil → Ahmed │  │
│ └──────────────────────────┘  │
│                                │
│ ┌──────────────────────────┐  │
│ │ MA PROPRIÉTÉ             │  │
│ │ ┌──────────────────────┐ │  │
│ │ │ 12 rue des Lilas    │ │  │
│ │ │ Lyon · 850€/mois     │ │  │
│ │ │ Dupont · ⏰ bail 14j │ │  │
│ │ └──────────────────────┘ │  │
│ │ ┌──────────────────────┐ │  │
│ │ │ 8 avenue des Fleurs │ │  │
│ │ │ Paris · 1 200€/mois │ │  │
│ │ │ Martin · ⚠️ IMPayé  │ │  │
│ │ └──────────────────────┘ │  │
│ └──────────────────────────┘  │
│                                │
│ [+ Ajouter] ← FAB button     │
├────────────────────────────────┤
│ [📊][📦][👤][💰][⚙️]          │ ← Bottom tab bar
└────────────────────────────────┘
```

---

## 3. KEY SCREEN WIREFRAMES

### 3a. Property List Screen

**Route:** `/app/properties`
**Purpose:** Central directory of all properties

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: "Mes Biens Immobiliers"              [+ Ajouter bien]  │
│                                                         [🔍]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filtres: [Tous ▾] [Type ▾] [Statut ▾]  ← Desktop filter bar │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CARD VIEW / LIST VIEW toggle  [≡] [▤]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏠 12 rue des Lilas, Lyon 69001                       │   │
│  │ ──────────────────────────────────────────────────────  │   │
│  │ Type: Appartement · 65 m² · 3 pièces · Meublé        │   │
│  │ Loyer: 850 €/mois charges comprises                    │   │
│  │                                                        │   │
│  │ 👤 Marie Dupont                                         │   │
│  │    Bail: 1er jan 2026 → 31 déc 2028  [RENEWAL 60J]   │   │
│  │    Status: ✓ Payé ce mois                             │   │
│  │                                                        │   │
│  │ Actions: [Voir] [Modifier] [📄 Bail] [💰 Loyer]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏠 8 avenue des Fleurs, Paris 75011                   │   │
│  │ ──────────────────────────────────────────────────────  │   │
│  │ Type: Appartement · 85 m² · 4 pièces · Nu            │   │
│  │ Loyer: 1 200 €/mois + 150 € charges                  │   │
│  │                                                        │   │
│  │ 👤 Jean-Martin Leroy                                   │   │
│  │    Bail: 15 mars 2025 → 14 mars 2027  ⚠️ ALERTE     │   │
│  │    Status: ❌ Impayé depuis 5 jours                   │   │
│  │                                                        │   │
│  │ Actions: [Voir] [Modifier] [📄 Bail] [💰 Loyer]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏠 3 rue du Soleil (vacant)                           │   │
│  │ ──────────────────────────────────────────────────────  │   │
│  │ Type: Studio · 28 m² · 1 pièce · Meublé              │   │
│  │ Loyer: 520 €/mois charges comprises                    │   │
│  │                                                        │   │
│  │ 🔴 VACANT — sans locataire                             │   │
│  │    Disponible depuis: 1er mars 2026                   │   │
│  │                                                        │   │
│  │ Actions: [Trouver un locataire] [Modifier] [Supprimer] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile (375px) - List View:**
```
┌────────────────────────────────┐
│ "Mes biens"         [+][🔍]  │
├────────────────────────────────┤
│ ┌──────────────────────────┐  │
│ │ 12 rue des Lilas        │  │
│ │ Lyon · 850€/mois        │  │
│ │ Dupont · ✓ Payé         │  │
│ │ [Voir] [💰]             │  │
│ └──────────────────────────┘  │
│ ┌──────────────────────────┐  │
│ │ 8 av Fleurs       ⚠️     │  │
│ │ Paris · 1 200€/mois      │  │
│ │ Martin · ❌ Impayé 5j    │  │
│ │ [Voir] [💰] [📢 Relance] │  │
│ └──────────────────────────┘  │
│ ┌──────────────────────────┐  │
│ │ 3 rue du Soleil   🔴    │  │
│ │ Studio · VACANT          │  │
│ │ [Trouver locataire →]   │  │
│ └──────────────────────────┘  │
└────────────────────────────────┘
```

---

### 3b. Tenant Detail Screen

**Route:** `/app/tenants/[id]`

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Retour                    Locataire                  [Modifier]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 👤 MARIE DUPONT                                        │  │
│  │    📧 marie.dupont@email.com                            │  │
│  │    📱 06 12 34 56 78                                    │  │
│  │    📍 12 rue des Lilas, Lyon (adresse de location)      │  │
│  │                                                        │  │
│  │    [Envoyer un message]  [📄 Voir bail]  [Historique]   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── TABS: [Résumé] [Bail] [Paiements] [Documents] [Messages] ──│
│  │                                                                │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐    │
│  │  │ BAIL ACTIF             │  │ PAIEMENTS CE MOIS       │    │
│  │  │ ───────────────────────│  │ ───────────────────────│    │
│  │  │ Bail meublé            │  │ Avril 2026              │    │
│  │  │ 1er jan 2026 → 31 déc  │  │ ┌─────────────────────┐  │    │
│  │  │ 3 ans                   │  │ │ ✓ Payé le 3 avr    │  │    │
│  │  │ Loyer: 850 € cc        │  │ │ 850 €              │  │    │
│  │  │ Charges: comprises    │  │ │ Virement           │  │    │
│  │  │ Dépôt: 850 €           │  │ │ [🧾 Reçu PDF]     │  │    │
│  │  │                        │  │ └─────────────────────┘  │    │
│  │  │ ⚠️ Renouvellement dans │  │                         │    │
│  │  │    60 jours (30 sept) │  │ [Enregistrer paiement →]│    │
│  │  │                        │  └─────────────────────────┘    │
│  │  │ [📄 Voir bail complet] │                               │
│  │  │ [🔄 Générer renouvellement]│                           │
│  │  └─────────────────────────┘                                │
│  │                                                              │
│  │  ┌──────────────────────────────────────────────────────┐   │
│  │  │ HISTORIQUE DES LOYERS                                │   │
│  │  │ ┌────┬──────┬────────┬────────┬────────────────┐     │   │
│  │  │ │ Mois│ Loyer│ Charges│ Payé  │ Statut        │     │   │
│  │  │ ├────┼──────┼────────┼────────┼────────────────┤     │   │
│  │  │ │Mar  │ 850  │   0    │ 850   │ ✓ Payé        │     │   │
│  │  │ │Fév  │ 850  │   0    │ 850   │ ✓ Payé        │     │   │
│  │  │ │Jan  │ 850  │   0    │ 850   │ ✓ Payé        │     │   │
│  │  │ │Déc  │ 850  │   0    │ 850   │ ✓ Payé        │     │   │
│  │  │ │Nov  │ 850  │   0    │ ⚠️ Retard│ 3j           │     │   │
│  │  │ └────┴──────┴────────┴────────┴────────────────┘     │   │
│  │  └──────────────────────────────────────────────────────┘   │
│  │                                                              │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile:** Single column. Header card with tenant info. Tab bar. Scrollable content. Sticky "Actions" bar at bottom.

---

### 3c. Lease Editor Screen

**Route:** `/app/leases/[id]/edit` (or `/app/leases/new` for creation)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Retour         Édition du bail                  [Aperçu PDF]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 1: Informations générales                        │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  Type de bail:  ○ Meublé    ● Nu    ○ Parking         │   │
│  │                                                          │   │
│  │  Durée: ● 3 ans (par défaut)  ○ 6 ans  ○ 1 an          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 2: Propriété                                     │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  Propriété: [12 rue des Lilas, Lyon ▾]                  │   │
│  │             (auto-complete from property list)         │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐                      │   │
│  │  │ Surface (m²)│  │ Pièces       │                      │   │
│  │  │ [  65   ]   │  │ [   3    ]   │                      │   │
│  │  └─────────────┘  └─────────────┘                      │   │
│  │                                                          │   │
│  │  Étage: [___]  Ascenseur: [○ Oui  ● Non]                │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 3: Locataire                                     │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  Nom:    [Dupont________________]                       │   │
│  │  Prénom: [Marie________________]                       │   │
│  │  Email:  [marie.dupont@email.com___]                   │   │
│  │  Tél:    [06 12 34 56 78__________]                     │   │
│  │  Adresse:[_Même que propriété_▾________]                 │   │
│  │          [ou: _______________]                         │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 4: Conditions financières                        │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  Loyer mensuel (hors charges): [__850__] €              │   │
│  │  Charges (provisions):            [____0__] €  cc: ●    │   │
│  │  Loyer charges comprises:          850 € (calculé)      │   │
│  │                                                          │   │
│  │  Dépôt de garantie: [___850___] € (max 1 mois) ⚠️       │   │
│  │                                                          │   │
│  │  Indexation (IRL): ● Automatique  ○ Manuelle            │   │
│  │  Révision annuelle: ● Oui  ○ Non                        │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 5: Dates                                         │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  Date d'entrée:  [__01/01/2026__]                       │   │
│  │  Date de fin:    [__31/12/2028__] (auto-calculé)        │   │
│  │  Préavis propriétaire: [3 mois ▾]                      │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION 6: Clauses (auto-remplies selon loi 1989)        │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │                                                          │   │
│  │  ✓ Article 3 — Désignation des locaux                   │   │
│  │  ✓ Article 4 — Obligations du locataire                  │   │
│  │  ✓ Article 5 — Révision du loyer                        │   │
│  │  ✓ Article 7 — Dépôt de garantie                        │   │
│  │  ✓ Article 8 — Assurances                               │   │
│  │  ☐ Meublé: Inventaire annexé                           │   │
│  │                                                          │   │
│  │  [Toutes les clauses 1989 sont conformes ✓]            │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        [Générer le bail PDF →]          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile:** Accordion sections (tap to expand one at a time). Sticky bottom bar with "Générer PDF" CTA always visible. Form sections numbered with progress.

---

### 3d. Payment Tracker Screen

**Route:** `/app/payments`

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: "Suivi des paiements"              [+ Enregistrer paiemt]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Filtres: [Mois ▾ Avril 2026] [Propriété ▾ Tous] [Statut ▾]   │
│  Vue: [Par locataire] [Par propriété]                           │
│                                                                  │
│  ══════════════════════════════════════════════════════════════  │
│  SUMMARY BAR                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Prévu ce mois: 3 600 €    Reçu: 2 750 €    Restant: 850 € │  │
│  │ ████████████████████░░░░░░░░░░░░░░░░░  76%                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ══════════════════════════════════════════════════════════════  │
│  UNPAID ALERTS (always at top, red highlight)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ❌ IMPayé — Jean-Martin Leroy                               │  │
│  │    8 avenue des Fleurs · Avril 2026 · 1 200 €            │  │
│  │    En retard depuis 5 jours                               │  │
│  │                                                            │  │
│  │    [📢 Envoyer relance]  [✓ Marquer comme payé]          │  │
│  │    ┌─────────────────────────────────────────┐             │  │
│  │    │ 💬 "Bonjour Jean-Martin, je me permets │             │  │
│  │    │ de vous écrire au sujet du loyer de    │             │  │
│  │    │ 1 200 €impayé depuis le 5 avril..."    │             │  │
│  │    │                                        │             │  │
│  │    │ [Modifier]  [Envoyer par email →]      │             │  │
│  │    └─────────────────────────────────────────┘             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ══════════════════════════════════════════════════════════════  │
│  THIS MONTH — AVRIL 2026                                        │
│  ┌────────────────────────┬──────────┬──────────┬────────────┐ │
│  │ Locataire / Propriété │ Prévu    │ Payé     │ Statut     │ │
│  ├────────────────────────┼──────────┼──────────┼────────────┤ │
│  │ Marie Dupont          │   850 €  │   850 €  │ ✓ Payé    │ │
│  │ 12 rue des Lilas     │  3 avr   │  3 avr   │ ✅ Complet │ │
│  ├────────────────────────┼──────────┼──────────┼────────────┤ │
│  │ Ahmed Benali          │   520 €  │      —   │ ⚠️ En att │ │
│  │ 3 rue du Soleil      │  1er avr │          │ ☑️ Pending │ │
│  ├────────────────────────┼──────────┼──────────┼────────────┤ │
│  │ Jean-Martin Leroy    │ 1 200 €  │      —   │ ❌ Impayé  │ │
│  │ 8 av des Fleurs      │  5 avr   │          │ 🔴 5 jours │ │
│  └────────────────────────┴──────────┴──────────┴────────────┘ │
│                                                                  │
│  ══════════════════════════════════════════════════════════════  │
│  RECORD PAYMENT MODAL (triggered by [+])                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ✕                                                        │  │
│  │ ─────────────────────────────────────────────────────    │  │
│  │  Enregistrer un paiement                               │  │
│  │                                                             │  │
│  │  Locataire: [Marie Dupont — 12 rue Lilas ▾]              │  │
│  │  Mois:     [Avril 2026 ▾]                                │  │
│  │  Montant:  [___850___] €                                │  │
│  │  Date:     [__03/04/2026__]                             │  │
│  │  Méthode:  [Virement ▾]                                 │  │
│  │            ○ Virement  ○ Chèque  ○ Espèces              │  │
│  │                                                             │  │
│  │  [✓ Marquer comme payé]  [Générer quittance →]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile:** Summary card at top. Filter chips below. Aligned payment rows with swipe actions (swipe right = mark paid, swipe left = send reminder). FAB for new payment.

---

## 4. MOBILE-FIRST VARIANTS SUMMARY

### Navigation Pattern
- **Desktop:** Fixed left sidebar (240px) + top header bar
- **Tablet:** Collapsible sidebar → hamburger menu
- **Mobile:** No sidebar. Top bar (logo + actions). Bottom tab bar (5 items: Dashboard, Properties, Tenants, Payments, Settings). FAB for primary actions.

### Responsive Breakpoints
| Breakpoint | Width | Layout Adaptation |
|------------|-------|-------------------|
| Mobile | < 640px | Single column, bottom tabs, FAB |
| Tablet | 640–1024px | 2-column grids, collapsible sidebar |
| Desktop | 1024px+ | Full sidebar, multi-column layouts |

### Mobile-Specific Patterns
1. **Bottom Tab Bar:** 5 icons with labels. Active state: filled icon + primary color. Inactive: outlined + gray.
2. **FAB (Floating Action Button):** Bottom-right, primary color, "+" or context-relevant icon. Used for: add property, add payment, add tenant.
3. **Pull-to-refresh:** On all list screens
4. **Swipe Actions:** On payment rows and list items — swipe left for secondary actions, swipe right for primary action
5. **Slide-up Modals:** On mobile, modals slide up from bottom (not centered popups)
6. **Sticky Headers:** On scroll, column headers stick to top
7. **Touch Targets:** Minimum 44x44px for all interactive elements
8. **Safe Areas:** Respect notch and home indicator areas

---

## 5. COMPONENT LIBRARY

### Summary Card
- White surface, 12px radius, subtle shadow
- Large number (28px, bold), label below (14px, muted)
- Icon top-right, colored dot for status
- Hover: slight lift (translateY -2px, shadow increase)

### Property Card
- White card, left color border (green=occupied, red=vacant, orange=late)
- Property address bold, type/size in muted text
- Tenant name + status badge
- Quick actions: icon buttons (View, Pay, Document)
- Mobile: full-width, stacked layout

### Status Badge
- Paid: Green bg (#E8F5EE), green text (#2D7A4F), checkmark icon
- Late: Orange bg (#FFF3E0), orange text (#D4601A), clock icon
- Unpaid: Red bg (#FDECEA), red text (#C0392B), X icon
- Pending: Gray bg (#F3F4F6), gray text (#6B7280)

### Payment Row
- Landlord avatar/initials left
- Tenant name + property address
- Amount right-aligned, bold
- Status badge
- Date in muted text
- Hover: light gray background

### Form Inputs
- 48px height on mobile, 40px on desktop
- 8px border radius
- Light border (#E5E3DE), focus: primary blue border + subtle shadow
- Error: red border + error message below
- Labels above inputs (not placeholder-as-label)

### Primary Button
- Background: #1E3A5F (Deep Slate Blue)
- Text: white, 16px, 600 weight
- Height: 48px mobile, 40px desktop
- Radius: 8px
- Hover: shadow lift + slight darken
- Active: scale(0.98)
- Loading: spinner replaces text
- Disabled: opacity 50%

### Secondary Button
- Background: transparent
- Border: 1.5px solid #1E3A5F
- Text: #1E3A5F
- Hover: light blue bg tint (#F0F4F8)

### Empty States
- Centered illustration (simple line art, muted colors)
- Headline explaining the empty state
- Subtext with guidance
- Primary CTA button

### Onboarding Progress Bar
- Height: 4px
- Background: #E5E3DE
- Fill: #1E3A5F
- Animated transition between steps

---

## 6. ACCESSIBILITY (WCAG 2.1 AA)

- Color contrast ratio: minimum 4.5:1 for body text, 3:1 for large text
- All interactive elements have visible focus states (2px outline, primary color)
- Form fields have visible labels (not placeholder-only)
- Error messages are announced by screen readers
- Tab order follows visual order
- ARIA labels on icon-only buttons
- Modal traps focus
- Skip-to-content link on marketing pages
- All images have descriptive alt text
- Status changes announced via aria-live regions

---

## 7. IMPLEMENTATION NOTES FOR ENGINEERING

1. **Components to build first:** Button, Input, Select, Badge, Card, Modal, Table, Tab
2. **Layout primitives:** Container, Stack (H/V), Grid, Sidebar, BottomNav
3. **State patterns:** Use React Server Components for initial data, client state for interactions
4. **Form handling:** React Hook Form + Zod validation
5. **Data fetching:** Server Components with cached revalidation
6. **Mobile menu:** Slide-in from left (not full-screen overlay) for better UX
7. **PDF preview:** Use iframe or blob URL for in-browser preview before download
8. **Animations:** Framer Motion for page transitions, micro-interactions only. Respect `prefers-reduced-motion`.
