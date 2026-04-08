# RentFlow — Core User Flows Wireframes

**Project:** Rental Property Management SaaS
**Designer:** Product Designer Agent
**Date:** April 2026
**Version:** 1.0
**Status:** Ready for Engineering Review

---

## Design System Foundation

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#6366f1` | CTAs, active nav, primary actions |
| Primary Light | `#e0e7ff` | Selected states, chips |
| Success | `#10b981` | Paid status, completion states |
| Warning | `#f59e0b` | Pending, overdue |
| Danger | `#ef4444` | Errors, destructive actions |
| Surface | `#ffffff` | Cards, dialogs |
| Background | `#f8fafc` | Page background |
| Border | `#e2e8f0` | Card borders, dividers |
| Text Primary | `#1e293b` | Headings, body text |
| Text Muted | `#64748b` | Descriptions, labels |
| Sidebar BG | `#1e1b4b` | Navigation sidebar (indigo-950) |

### Typography Scale
| Role | Size | Weight | Font |
|------|------|--------|------|
| H1 (Page Title) | 24px | 600 | Inter/System |
| H2 (Section) | 18px | 600 | Inter/System |
| Body | 14px | 400 | Inter/System |
| Small/Label | 12px | 500 | Inter/System |
| Micro | 11px | 500 | Inter/System |

### Spacing System
- Base unit: 4px
- Card padding: 16px
- Section gap: 32px
- Element gap: 12px

---

## 1. Onboarding Flow

**Goal:** Signup → First Lease in under 10 minutes
**Trigger:** Auto-launches when user has 0 properties
**Flow:** Step 1 → Step 2 → Step 3 → Success

### 1.1 Step 1 — Add Property (Mobile 390px)

```
┌─────────────────────────────────────┐
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ● ─────── ○ ─────── ○          │ │  ← Step indicator
│ │ BIEN     LOCAT.   BAIL         │ │
│ │ ~1 min   ~1 min   ~30 sec      │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🏠  Ajouter votre           │    │
│  │     premier bien             │    │
│  │                             │    │
│  │ Commencez par enregistrer    │    │
│  │ votre bien locatif...        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Nom du bien *                │    │
│  │ [Appartement Belleville    ] │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Type de bien *    [Appart ▾]│    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Adresse *                   │    │
│  │ [12 rue de la République ] │    │
│  └─────────────────────────────┘    │
│  ┌──────────┐  ┌──────────────┐    │
│  │Code postal│  │ Ville        │    │
│  │[75010  ] │  │[Paris     ] │    │
│  └──────────┘  └──────────────┘    │
│  ┌──────────┐  ┌──────────────┐    │
│  │Surface m²│  │ Pièces       │    │
│  │[65     ] │  │[3         ] │    │
│  └──────────┘  └──────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Continuer            →     │    │  ← Indigo CTA
│  └─────────────────────────────┘    │
│                                     │
│  Je n'ai pas de bien à ajouter...   │  ← Skip (muted, underline)
│                                     │
│  95% des bailleurs terminent < 5min │
└─────────────────────────────────────┘
```

**Key specs:**
- Step indicator: 3 circles connected by lines, filled=completed, ring=active, dim=future
- Time estimate badge at bottom
- Skip link: centered, muted, underline
- Form: 2-column grid for postal/city and surface/rooms
- CTA: full-width, indigo bg, white text, arrow icon

**Events:**
- `onboarding_step_1_completed` on submit
- `onboarding_step_1_skipped` on skip

---

### 1.2 Step 2 — Add Tenant (Mobile)

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ ● ─────── ● ─────── ○          │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👤  Ajouter votre           │    │
│  │     premier locataire        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ Prénom *     │ │ Nom *         │  │
│  │ [Marie     ] │ │ [Dupont     ]│  │
│  └──────────────┘ └──────────────┘  │
│  ┌─────────────────────────────┐    │
│  │ Email                        │    │
│  │ [marie.dupont@email.fr    ] │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Téléphone                    │    │
│  │ [06 12 34 56 78           ] │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Adresse *                   │    │
│  │ [8 avenue des Champs      ] │    │
│  └─────────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐  │
│  │Code postal * │ │ Ville *       │  │
│  │[75008     ] │ │[Paris      ] │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  ← Retour    │ │ Continuer →  │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  Pas de locataire pour le moment    │
└─────────────────────────────────────┘
```

---

### 1.3 Step 3 — Create Lease (Mobile)

```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ ● ─────── ● ─────── ●          │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 📋  Créer le premier bail  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Type de bail    [Location ▾]│    │
│  └─────────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ Loyer (€) * │ │ Charges (€)  │  │
│  │ [1200      ]│ │ [100       ]│  │
│  └──────────────┘ └──────────────┘  │
│  ┌─────────────────────────────┐    │
│  │ Dépôt de garantie (€)       │    │
│  │ [1200                    ] │    │
│  └─────────────────────────────┘    │
│  ┌──────────────┐ ┌──────────────┐  │
│  │Date début * │ │ Date fin     │  │
│  │[01/05/2026] │ │[01/05/2027 ]│  │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌──────────────┐  │
│  │Jour paiement │ │Mode paiement │  │
│  │ [1        ] │ │[Virement ▾] │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Total mensuel:              │    │
│  │ €1,300.00 /mois (emerald)   │    │
│  │ Provision 100€ charges      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  ← Retour    │ │ Créer bail → │  │
│  └──────────────┘ └──────────────┘  │
└─────────────────────────────────────┘
```

**Live calculation:** As user types rent/charges, monthly total updates in real-time (emerald green highlight).

---

### 1.4 Success Screen (Mobile)

```
┌─────────────────────────────────────┐
│              ✓ 🎉                   │
│                                     │
│       Premier bail créé !           │
│                                     │
│   Votre premier bien est configuré. │
│   Vous pouvez maintenant suivre     │
│   les paiements, générer des        │
│   quittances et gérer vos          │
│   locataires depuis votre tableau   │
│   de bord.                         │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Prochaines étapes           │    │
│  │                             │    │
│  │ ✓ Premier bail créé         │    │
│  │                             │    │
│  │ → Générer ma première      │    │  ← Indigo text button
│  │    quittance de loyer       │    │
│  │                             │    │
│  │ ○ Ajouter un autre bien     │    │
│  │ ○ Inviter mon locataire     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Accéder à mon tableau →   │    │  ← Full CTA
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Analytics Events Tracked:**
| Event | Trigger |
|-------|---------|
| `onboarding_started` | Dialog opens |
| `onboarding_step_1_completed` | Property created |
| `onboarding_step_1_skipped` | Step 1 skipped |
| `onboarding_step_2_completed` | Tenant created |
| `onboarding_step_2_skipped` | Step 2 skipped |
| `onboarding_lease_completed` | Lease created |
| `onboarding_completed` | Success screen viewed |
| `onboarding_abandoned` | Dialog closed without completion |

---

## 2. Dashboard Layout (Desktop 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Sidebar 256px, indigo-950]                                                  │
│                                                                              │
│  [Logo]  RentFlow                                                           │
│  ─────────                                                                  │
│                                                                              │
│  ◉ Tableau de bord (active — white pill bg)                                │
│  🏠  Biens                                                                  │
│  👥  Locataires                                                              │
│  📋  Baux                                                                   │
│  💳  Facturation                                                             │
│  🔧  Maintenance                                                             │
│  ─────────                                                                  │
│  ⚙️  Paramètres                                                              │
│  ─────────                                                                  │
│  [Avatar]  Jean Dupont (bottom)                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ [Topbar 56px]  [☰] | [⌘K Search...              ]   [🔔] [Avatar ▾]       │
└─────────────────────────────────────────────────────────────────────────────┘

  Tableau de bord
  Vue d'ensemble de votre patrimoine locatif

  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │ Biens       │ │Locataires   │ │ Revenus     │ │ Taux occ.   │
  │ [2]         │ │ [1]         │ │ [€1,300]   │ │ [100%]      │
  │ 1 avec bail │ │ 1 bail act. │ │ Avril 2026  │ │ Aucune vac. │
  │ 🏠 icon     │ │ 👥 icon     │ │ 💶 icon     │ │ 📈 icon     │
  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

  ┌──────────────────────────────────────┐  ┌──────────────────────┐
  │ [Revenue/Expense Bar Chart]          │  │ NOI Summary           │ ← 2/3 + 1/3
  │                                      │  │                       │
  │ Revenus  ████████████               │  │ Revenus: €1,300      │
  │ Charges  ████                         │  │ Charges: €180        │
  │            J  F  M  A  M  J          │  │ ──────────────────    │
  │                                      │  │ NOI: €1,120          │
  │ [Revenus] [Charges] (legend)         │  │ [Details →]          │
  └──────────────────────────────────────┘  └──────────────────────┘

  ┌────────────────────────────────────────────────────────────────────────┐
  │ Activité récente                                    [Receipt icon]    │
  │ ✓ Marie Dupont — Appt Belleville     €1,300  [Payé]    8 avr. 2026  │
  │ ○ ─────────────────────────────────────────────────────────────────── │
  │ (empty: "Aucune transaction pour le moment")                          │
  └────────────────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────────────────┐
  │ Actions rapides                                                        │
  │ [+ Ajouter un bien]  [+ Ajouter un locataire]  [+ Enregistrer paiem.]│
  └────────────────────────────────────────────────────────────────────────┘
```

**Layout Specs:**
- Sidebar: 256px fixed, indigo-950 (#1e1b4b)
- Topbar: 56px, white bg, border-b
- Content: p-6 (24px), space-y-8 between sections
- KPI cards: grid (4col desktop / 2col tablet / 1col mobile)
- Charts: 2/3 + 1/3 grid split

---

## 3. Property List Screen

### 3.1 With Properties (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ Mes Biens                                    [+ Bail] [+ Bien] │
│ Gérez votre patrimoine immobilier                              │
│                                                                 │
│ [Filtre: Tous ▾]    [Rechercher...              🔍]           │
│                                                                 │
│ ┌──────────────────────┐  ┌──────────────────────┐             │
│ │ 🏠 Appartement       │  │ 🏠 Maison des Pins   │             │
│ │     Belleville       │  │                      │             │
│ │ 12 rue Rep., 75010   │  │ 5 rue des Pins...   │             │
│ │ [Appart] [65m²][3p] │  │ [Maison] [120m²][5p] │             │
│ │ ──────────────────── │  │ ──────────────────── │             │
│ │ Loyer: €1,300/mois   │  │ Loyer: €2,100/mois   │             │
│ │ Locataire:           │  │ Locataire:           │             │
│ │ Marie Dupont         │  │ — (Aucun bail act.) │             │
│ │              [⋯↕]   │  │              [⋯↕]   │             │
│ └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
│ ┌──────────────────────┐                                        │
│ │ 🏠 Parking Saint-L.  │                                        │
│ │ 4 rue Saint-Lazare   │                                        │
│ │ [Parking] [12m²]     │                                        │
│ │ €150/mois            │                                        │
│ │ — (Aucun bail act.)  │                                        │
│ └──────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Property Card:**
- White bg, border-border/50, rounded-xl, shadow-sm
- Hover: shadow-md, border-border
- Actions menu (⋯): Edit, View Lease, Archive

### 3.2 Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│ Mes Biens                                    [+ Ajouter un bien] │
│                                                                 │
│                                                                 │
│              ┌───────────────────────────────┐                  │
│              │                               │                  │
│              │        🏠 (64px, muted)      │                  │
│              │                               │                  │
│              │     Aucun bien               │                  │
│              │     text-lg font-medium       │                  │
│              │                               │                  │
│              │  Commencez par ajouter votre  │                  │
│              │  premier bien immobilier...    │                  │
│              │  text-sm muted               │                  │
│              │                               │                  │
│              │  [+ Ajouter un bien]          │                  │
│              │  ← Primary button             │                  │
│              └───────────────────────────────┘                  │
│                                                                 │
│                                                                 │
│  ← dashed border, rounded-xl, centered content                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Tenant Detail Screen

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour aux locataires                                          │
│                                                                 │
│  ┌─────────────┐                                                │
│  │  [Avatar]   │  Marie Dupont (H2)                            │
│  │    MD       │  marie.dupont@email.fr                        │
│  │             │  06 12 34 56 78                               │
│  └─────────────┘  [À jour] [Modifier] [Supprimer]              │
│                                                                 │
│  📍 8 avenue des Champs-Élysées, 75008 Paris                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┐  ┌────────────────────────────┐   │
│  │ 🔗  Bail actif           │  │ 💶  Loyer du mois          │   │
│  │                          │  │                            │   │
│  │ Appartement Belleville   │  │ [Invoice card]             │   │
│  │ Location vide           │  │ Avril 2026                 │   │
│  │ €1,200 + €100 charges  │  │ €1,300 — Payé ✓          │   │
│  │ Du 1/5/2026 au 1/5/2027 │  │                            │   │
│  │ Virement bancaire       │  │ [Voir détails]             │   │
│  │                          │  │                            │   │
│  └──────────────────────────┘  └────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Historique des paiements                                 │   │
│  │                                                          │   │
│  │ ✓ Avril 2026 — €1,300 — Payé           8 avr. 2026     │   │
│  │ ✓ Mars 2026  — €1,300 — Payé           5 mar. 2026      │   │
│  │ ✓ Fév. 2026  — €1,300 — Payé           3 fév. 2026     │   │
│  │ ✓ Jan. 2026  — €1,300 — Payé           2 jan. 2026     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [📥 Télécharger quittance]  [✉ Inviter au portail]         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Lease Editor Screen

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour aux baux                            [Sauvegarder]     │
│                                                                 │
│  Créer / Modifier un bail                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Bien *              [Appartement Belleville ▾]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Locataire *        [Marie Dupont ▾]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type de bail       [Location vide ▾]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Loyer HC (€)          │  │ Charges (€)            │        │
│  │ [1200               ] │  │ [100                ]  │        │
│  └────────────────────────┘  └────────────────────────┘        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Dépôt de garantie (€)                                    │   │
│  │ [1200                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Date de début *        │  │ Date de fin             │        │
│  │ [01/05/2026          ] │  │ [01/05/2027           ]│        │
│  └────────────────────────┘  └────────────────────────┘        │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Jour de paiement       │  │ Mode de paiement        │        │
│  │ [1                   ] │  │ [Virement ▾]           │        │
│  └────────────────────────┘  └────────────────────────┘        │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Clause révision        │  │ IRL Trimestre ref.      │        │
│  │ [Aucune ▾]             │  │ [T1 2026 ▾]            │        │
│  └────────────────────────┘  └────────────────────────┘        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Notes (optionnel)                                        │   │
│  │ [                                                    ]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Statut:  ○ Brouillon  ● Actif  ○ Résilié  ○ Expiré           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Validation:**
- Bien + Locataire + Loyer + Date début = required
- End date must be after start date
- Deposit ≤ 3x rent (French law)

---

## 6. Payment Tracker / Billing Screen

```
┌─────────────────────────────────────────────────────────────────┐
│ 💳 Facturation                                                    │
│ Gérez vos quittances et suivez les paiements                      │
│                                                                 │
│ [+ Paiement]  [Générer quittance]  [Tous ▾]                    │
│                                                                 │
│ Avril 2026                                                        │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ✓ Marie Dupont                                                │   │
│ │   Appartement Belleville                                     │   │
│ │   Loyer + charges: €1,300          [Payé ✓]                │   │
│ │   Payé le: 8 avril 2026                                       │   │
│ │   [Quittance] [Envoyer] [Modifier]                          │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ○ Thomas Bernard                                              │   │
│ │   Maison des Pins                                            │   │
│ │   Loyer + charges: €2,100         [En attente ⏳]          │   │
│ │   Échu le: 5 avril 2026                                       │   │
│ │   [Relance SMS]  [Marquer payé]                              │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Mars 2026                                                          │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ ✓ Marie Dupont — €1,300 — Payé               5 mar 2026   │   │
│ │ ✓ Thomas Bernard — €2,100 — Payé              3 mar 2026  │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │  ⚠️ Alertes (2)                                           │   │
│ │   Thomas Bernard — Loyer mars non payé (8 jours)          │   │
│ │   Jean-Luc Petit — Bail expirant dans 28 jours           │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Status Badges:**
- Paid: green bg, white text
- Pending: amber bg, dark text
- Late: red bg, white text

### 6.1 Record Payment Modal

```
┌─────────────────────────────────────┐
│  ✕                                  │
│  Enregistrer un paiement            │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Bail *        [Marie Dupont ▾]  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Période *     [Avril 2026 ▾]   ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Montant (€) *  [1300         ] ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Date paiement * [08/04/2026   ]││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Mode de paiement [Virement ▾] ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ □ Générer une quittance PDF   ││ ← Checkbox, default unchecked
│  └─────────────────────────────────┘│
│                                     │
│  [Annuler]         [Enregistrer]   │
└─────────────────────────────────────┘
```

---

## 7. Mobile Navigation Pattern

```
MOBILE HEADER:              MOBILE BOTTOM NAV:
┌────────────────────────┐  ┌──────────────────────────────────┐
│ ☰ RentFlow    [🔔][👤]│  │  [🏠]    [👥]    [📋]    [💳]  │
└────────────────────────┘  │ Tab.  Loc.   Baux  Fact.       │
                           └──────────────────────────────────┘
```

**Bottom nav:** 4 tabs, icon + label, active = indigo fill + label text
**Touch targets:** minimum 44x44px per tab

---

## 8. Component Inventory

### Card (Property/Tenant/Lease)
| State | Spec |
|-------|------|
| Default | white bg, border-border/50, rounded-xl, shadow-sm |
| Hover | shadow-md, border-border transition 150ms |
| Empty | dashed border, centered icon + text + CTA |

### Badge/Status Pill
| Status | Class |
|--------|-------|
| Paid | `bg-emerald-100 text-emerald-700` |
| Pending | `bg-amber-100 text-amber-700` |
| Late | `bg-red-100 text-red-700` |
| Draft | `bg-gray-100 text-gray-700` |
| Active | `bg-emerald-100 text-emerald-700` |

### Button
| Variant | Class |
|---------|-------|
| Primary | `bg-indigo-600 text-white hover:bg-indigo-700` |
| Secondary | `border border-stone-200 bg-white hover:bg-stone-50` |
| Destructive | `bg-red-600 text-white` |
| Ghost | `hover:bg-stone-100` |

### Form Input
| State | Spec |
|-------|------|
| Default | `border border-border rounded-lg px-3 py-2` |
| Focus | `ring-2 ring-indigo-500 border-indigo-500` |
| Error | `border-red-500 ring-2 ring-red-200` |
| Disabled | `bg-muted opacity-50 cursor-not-allowed` |

### Empty State Container
- Dashed border, rounded-xl
- Centered: icon (48px muted) + title (H2) + description (body muted)
- CTA button below
- Max-width: 384px (max-w-sm)

### Dialog/Modal
| Element | Spec |
|---------|------|
| Backdrop | `bg-black/40 backdrop-blur-sm` |
| Panel | white bg, rounded-2xl, shadow-xl |
| Form wizard | `sm:max-w-lg max-h-[90vh] overflow-y-auto` |
| Simple modal | `sm:max-w-md` |

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | 1-col, bottom tab nav, hamburger sidebar |
| Tablet | 640–1024px | 2-col grids, sidebar collapses to icons |
| Desktop | > 1024px | Full sidebar (256px), 3-4 col grids |

---

## 10. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Form labels | `<Label htmlFor="...">` for every input |
| Error messages | `aria-describedby` linking field to error text |
| Dialog | `role="dialog"`, `aria-modal`, focus trap |
| Step indicator | `role="progressbar"`, `aria-valuenow`, `aria-valuemin/max` |
| Status badges | Semantic color + text (never color-only) |
| Touch targets | Minimum 44x44px on mobile |
| Color contrast | 4.5:1 text, 3:1 UI elements |
| Keyboard nav | All interactive elements reachable via Tab |

---

*End of Wireframe Document*
*Designer: Product Designer Agent | Date: April 2026*
*Handoff to: Senior Full-Stack Engineer for implementation review*
