# REN-47 — Wireframes: Core User Flows
**Rental Property Management SaaS — Product Designer Deliverable**
Created: 2026-04-08

---

## Design System Foundations

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Primary | `#1E3A5F` | Navigation, primary actions, headers |
| Primary Light | `#2D5F8B` | Hover states, secondary emphasis |
| Accent | `#22C55E` | Success states, positive metrics, CTAs |
| Warning | `#F59E0B` | Overdue payments, attention items |
| Danger | `#EF4444` | Errors, urgent actions, delete |
| Surface | `#F8FAFC` | Page backgrounds |
| Card | `#FFFFFF` | Card backgrounds |
| Border | `#E2E8F0` | Dividers, input borders |
| Text Primary | `#0F172A` | Headings, important text |
| Text Secondary | `#64748B` | Supporting text, labels |
| Text Muted | `#94A3B8` | Placeholders, disabled |

### Typography Scale
| Token | Size | Usage |
|---|---|---|
| `text-xs` | 12px | Badges, caption text |
| `text-sm` | 14px | Secondary body, table cells |
| `text-base` | 16px | Primary body |
| `text-lg` | 18px | Subheadings |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Page section titles |
| `text-3xl` | 30px | Page titles |
| `text-4xl` | 36px | Hero headings |

### Spacing System
Base unit: 4px. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Border Radius
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-md` (6px)
- Badges: `rounded-full`

---

## 1. Onboarding Flow Wireframe

### Step 1 — Welcome / Get Started
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                              Already have account?  │
│                                      Sign in →              │
│                                                             │
│                                                             │
│                   Welcome to RentReady                      │
│                                                             │
│         Manage your rental properties with confidence.       │
│          Collect rent, track leases, stay compliant.         │
│                                                             │
│                                                             │
│                   [  Get Started Free  ]                   │
│                                                             │
│                   [  Book a Demo     ]                     │
│                                                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│   Trusted by 2,400+ landlords across France                 │
│  [★4.8 rating]  [No credit card]  [14-day free trial]       │
└─────────────────────────────────────────────────────────────┘

Mobile (375px):
┌─────────────────────┐
│ [Logo]              │
│                     │
│  Welcome to         │
│  RentReady          │
│                     │
│  Manage your rental │
│  properties with    │
│  confidence.        │
│                     │
│ [Get Started Free]  │
│                     │
│ [ Book a Demo   ]   │
│                     │
│  Trusted by 2,400+  │
│  landlords         │
└─────────────────────┘
```

### Step 2 — Account Creation
```
Desktop (1024px+):
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
│                                                              │
│  Create your account                                         │
│  Start your 14-day free trial — no credit card needed        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ First name          Last name                         │   │
│  │ [_______________]  [_______________]                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Email address                                        │   │
│  │ [______________________________]                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Password (min. 8 characters)                         │   │
│  │ [______________________________]                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  □ I agree to the Terms of Service and Privacy Policy       │
│                                                              │
│                   [  Create Account  ]                      │
│                                                              │
│  Already have an account? Sign in                            │
└─────────────────────────────────────────────────────────────┘
```

### Step 3 — Role Selection
```
Desktop:
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  How will you use RentReady?                                  │
│  Select the option that best describes you.                  │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │  [house icon]       │  │  [building icon]    │            │
│  │                     │  │                     │            │
│  │  Independent        │  │  Property Manager   │            │
│  │  Landlord           │  │  or Agency          │            │
│  │                     │  │                     │            │
│  │  I manage my own    │  │  I manage properties │            │
│  │  rental properties  │  │  for clients         │            │
│  └─────────────────────┘  └─────────────────────┘            │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │  [users icon]       │  │  [chart icon]       │            │
│  │                     │  │                     │            │
│  │  Real Estate        │  │  Accountant /        │            │
│  │  Investor           │  │  Assistant           │            │
│  │                     │  │                     │            │
│  │  Multiple units,    │  │  I help manage       │            │
│  │  focus on ROI      │  │  properties          │            │
│  └─────────────────────┘  └─────────────────────┘            │
│                                                               │
│                              [ Continue → ]                  │
└──────────────────────────────────────────────────────────────┘
```

### Step 4 — Property Setup (Add First Property)
```
Desktop:
┌──────────────────────────────────────────────────────────────┐
│  [← Back]                      Step 2 of 4: Add your property  │
│                                                               │
│  Let's start with your first property                        │
│  Add your rental property to begin tracking leases and       │
│  payments.                                                    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Property type                                            │ │
│  │ [Apartment / House / Room / Parking / Commercial    ▼]  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Address                                                   │ │
│  │ [__________________________]                            │ │
│  │ [__________________________]                            │ │
│  │ [City]              [Postal code]  [________________]   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Property name (optional)                                │ │
│  │ e.g., "3BR Paris 11th" or "Parking - Rue de Rivoli"   │ │
│  │ [_______________________________________________]      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Number of units                                          │ │
│  │ This property has: [1] unit(s)  ○ Single unit          │ │
│  │                                       ○ Multiple units  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                            [ Skip for now ]  [ Continue → ]  │
└──────────────────────────────────────────────────────────────┘

Mobile:
┌───────────────────────────────┐
│ [←]    Step 2 of 4           │
│                               │
│ Add your first property       │
│                               │
│ Property type                 │
│ [Apartment           ▼]      │
│                               │
│ Address                       │
│ [_____________________]       │
│ [_____________________]       │
│ [_______] [_________]         │
│                               │
│ Property name (optional)      │
│ [_____________________]       │
│                               │
│ Units: [1] [- ] [+ ]         │
│                               │
│ [Skip for now]                │
│ [Continue]                    │
└───────────────────────────────┘
```

### Step 5 — Dashboard Tour (First-Time View)
```
Desktop:
┌────────────────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │              Top Bar                          │
│  ┌─────────────┐  │  ┌──────────────────────────────────────────┐  │
│  │ [Logo]      │  │  │ 🔔  [Search properties, tenants...]  [JD] │  │
│  ├─────────────┤  │  └──────────────────────────────────────────┘  │
│  │ 🏠 Dashboard│  │                                              │
│  │ 📋 Properties│  │  Welcome, Jean! 👋                          │
│  │ 👥 Tenants │  │  Here's your property overview.              │
│  │ 📄 Leases  │  │                                              │
│  │ 💰 Payments│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 🔧 Maint.  │  │  │ 3        │ │ €4,850   │ │ 1        │      │
│  │ 📊 Reports │  │  │Properties│ │ Collected│ │ Overdue  │      │
│  ├─────────────┤  │  │          │ │ this mth │ │ payments │      │
│  │ ⚙️ Settings│  │  └──────────┘ └──────────┘ └──────────┘      │
│  └─────────────┘  │                                              │
│                   │  Your Properties              [Add Property →]│
│                   │  ┌─────────────────────────────────────────┐  │
│                   │  │ 🏠 12 Rue de la Paix, Paris 75001     │  │
│                   │  │    1 unit · €1,200/month · 1 tenant   │  │
│                   │  └─────────────────────────────────────────┘  │
│                   │  ┌─────────────────────────────────────────┐  │
│                   │  │ 🏠 5 Avenue Foch, Paris 75016           │  │
│                   │  │    2 units · €2,400/month · 2 tenants  │  │
│                   │  └─────────────────────────────────────────┘  │
│                   │                                              │
│                   │  Recent Activity              [View all →]    │
│                   │  • Rent received from Marie D. — €850       │
│                   │  • Lease signed by Pierre L. — 12 Rue de.. │
│                   │  • Maintenance requested at 5 Av. Foch        │
└────────────────────────────────────────────────────────────────────┘
```

### Onboarding Mobile Variant (Step 4 — Property Setup)
```
Mobile (375px):
┌────────────────────────────────┐
│ [←]  Step 2 of 4               │
│                                │
│ Add your first property        │
│                                │
│ ┌──────────────────────────┐  │
│ │ Type: [Apartment    ▼]   │  │
│ └──────────────────────────┘  │
│                                │
│ Address                        │
│ ┌──────────────────────────┐  │
│ │ [____________________]   │  │
│ │ [____________________]   │  │
│ │ [City]    [75001]        │  │
│ └──────────────────────────┘  │
│                                │
│ Units: [- 1 +]                 │
│                                │
│ ┌──────────────────────────┐  │
│ │ [Skip for now       ]    │  │
│ │ [Continue          ]     │  │
│ └──────────────────────────┘  │
└────────────────────────────────┘
```

---

## 2. Dashboard Layout Wireframe

### Main Dashboard (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px fixed)  │  TOP BAR (full width)                             │
│                        │  ┌───────────────────────────────────────────────┐ │
│ [Logo]                 │  │🔔 │ 🔍 Search properties, tenants...   │ [JD]│ │
│ ─────────────────────  │  └──┴───────────────────────────────────────────┘ │
│ 🏠 Dashboard    [active]│                                                    │
│ 📋 Properties          │ PAGE TITLE + ACTIONS                              │
│ 👥 Tenants             │ ┌───────────────────────────────────────────────┐ │
│ 📄 Leases              │ │ Dashboard        [+ Add Property] [Filter ▼] │ │
│ 💰 Payments            │ └──┴───────────────────────────────────────────┘ │
│ 🔧 Maintenance         │                                                    │
│ 📊 Reports             │ KPI CARDS (4 columns on desktop, 2 on tablet)  │
│ 📁 Documents           │ ┌────────────┐┌────────────┐┌────────────┐┌────┐│
│ ⚙️ Settings            │ │  3         │ │  €4,850    │ │  98%       │ │ 1  ││
│                        │ │  Properties│ │  Collected │ │  Occupancy│ │ ▲  ││
│                        │ │  (up 1)    │ │  Apr 2026   │ │  Rate      │ │ ▲  ││
│ ─────────────────────  │ └────────────┘└────────────┘└────────────┘└────┘│
│ Owner: Jean Dupont     │                                                    │
│ [JD]  │  [⚙️]          │ MAIN CONTENT (2-column grid on desktop)            │
│                        │ ┌─────────────────────┐┌────────────────────────┐ │
│                        │ │ YOUR PROPERTIES     ││ PAYMENTS THIS MONTH   │ │
│                        │ │ [Add Property →]   ││                        │ │
│                        │ │ ┌─────────────────┐││ Received: €4,200      │ │
│                        │ │ │🏠 12 Rue de la  │││ [████████░░] 84%      │ │
│                        │ │ │   Paix, 75001   │││                        │ │
│                        │ │ │ 1 unit · €1,200 │││ Pending: €650         │ │
│                        │ │ │ ● 1 tenant      │││ [████░░░░░░] 16%     │ │
│                        │ │ └─────────────────┘││                        │ │
│                        │ │ ┌─────────────────┐││ Overdue: €0           │ │
│                        │ │ │🏠 5 Av. Foch,   │││ [✅ No overdue]       │ │
│                        │ │ │   75016         │││                        │ │
│                        │ │ │ 2 units · €2,400││└────────────────────────┘ │
│                        │ │ │ ● 2 tenants     ││                            │
│                        │ │ └─────────────────┘│┌────────────────────────┐ │
│                        │ │ [+ Add Property]   ││ UPCOMING LEASE ENDS   │ │
│                        │ └─────────────────────┘│                        │ │
│                        │                           │ • Lease #23 - 12 Rue │ │
│                        │                           │   de la Paix         │ │
│                        │                           │   Expires: Jun 30    │ │
│                        │                           │   [Renew →]          │ │
│                        │                           └────────────────────────┘ │
│                        │ ┌─────────────────────────────────────────────────┐ │
│                        │ │ RECENT ACTIVITY                               │ │
│                        │ │ • 💰 Rent received · Marie D. · €850 · 2h ago│ │
│                        │ │ • 📄 Lease signed · Pierre L. · 12 Rue... · 5h│ │
│                        │ │ • 🔧 Maintenance · 5 Av. Foch · Locker jam · │ │
│                        │ │   1d ago                                       │ │
│                        │ │ [View all activity →]                         │ │
│                        │ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Mobile Variant (375px)
```
┌────────────────────────────────────────┐
│ [☰]     RentReady      [🔔] [JD]       │
├────────────────────────────────────────┤
│ Good morning, Jean 👋                   │
│ Apr 8, 2026                            │
├────────────────────────────────────────┤
│ KPI ROW (horizontal scroll)           │
│ ┌───────┐┌───────┐┌───────┐┌───────┐ │
│ │  3    ││ €4,850││  98%  │ │  1    │ │
│ │Props. ││Collect││Occupy │ │ ▲     │ │
│ └───────┘└───────┘└───────┘└───────┘ │
├────────────────────────────────────────┤
│ YOUR PROPERTIES           [+ Add →]   │
│ ┌────────────────────────────────────┐ │
│ │🏠 12 Rue de la Paix, 75001        │ │
│ │   1 unit · €1,200 · 1 tenant      │ │
│ │   ● Rent paid for Apr             │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │🏠 5 Av. Foch, 75016               │ │
│ │   2 units · €2,400 · 2 tenants    │ │
│ │   ● 1 payment pending              │ │
│ └────────────────────────────────────┘ │
├────────────────────────────────────────┤
│ PAYMENTS                               │
│ Received: €4,200  [████████░░] 84%     │
│ Pending: €650     [████░░░░░░] 16%     │
│ Overdue: €0       [✅ No overdue]      │
├────────────────────────────────────────┤
│ BOTTOM NAV                             │
│ [🏠]  [📋]  [👥]  [💰]  [⚙️]           │
└────────────────────────────────────────┘
```

---

## 3. Property List Screen

### Desktop View
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Sidebar │ TOP BAR                                                         │
│         │ ┌─────────────────────────────────────────────────────────────┐ │
│         │ │🔔 │ 🔍 Search properties... │ [Filter ▼] [+ Add Property] │ │
│         │ └──┴───────────────────────────────────────────────────────────┘ │
│         │                                                                   │
│         │ PROPERTIES                               Sort by: [Name ▼]      │
│         │ ┌─────────────────────────────────────────────────────────────┐ │
│         │ │ ☑ │ Property         │ Units │ Monthly     │ Tenants │ ●  │ │
│         │ ├───┼───────────────────┼───────┼─────────────┼─────────┼────┤ │
│         │ │ ☐ │ 🏠 12 Rue de la   │   1   │ €1,200      │  1/1   │ ✓  │ │
│         │ │   │   Paix, 75001     │       │             │         │    │ │
│         │ ├───┼───────────────────┼───────┼─────────────┼─────────┼────┤ │
│         │ │ ☐ │ 🏠 5 Av. Foch,   │   2   │ €2,400      │  2/2   │ ✓  │ │
│         │ │   │   75016          │       │             │         │    │ │
│         │ ├───┼───────────────────┼───────┼─────────────┼─────────┼────┤ │
│         │ │ ☐ │ 🏠 8 Blvd St-    │   3   │ €3,600      │  2/3   │ ⚠  │ │
│         │ │   │   Germain, 75006  │       │             │         │    │ │
│         │ ├───┼───────────────────┼───────┼─────────────┼─────────┼────┤ │
│         │ │ ☐ │ 🏠 Parking Rivoli │   1   │ €150        │  1/1   │ ✓  │ │
│         │ └───┴───────────────────┴───────┴─────────────┴─────────┴────┘ │
│         │                                                                   │
│         │ Showing 4 properties · 7 units total                              │
│         │ ☑ Select all · [Export CSV] · [Print]                             │
└───────────────────────────────────────────────────────────────────────────┘

Status indicators: ● ✓ = All occupied/good, ⚠ = Vacancy or overdue
```

### Mobile View (Property List)
```
┌────────────────────────────────────────┐
│ [☰]  Properties (4)    [+ Add]  [≡]   │
├────────────────────────────────────────┤
│ [🔍 Search properties...]              │
├────────────────────────────────────────┤
│ 🏠 12 Rue de la Paix, 75001            │
│    1 unit · €1,200/mo · 1 tenant      │
│    [✓ Fully occupied]                  │
│    [→]                                 │
├────────────────────────────────────────┤
│ 🏠 5 Av. Foch, 75016                   │
│    2 units · €2,400/mo · 2 tenants    │
│    [✓ Fully occupied]                  │
│    [→]                                 │
├────────────────────────────────────────┤
│ ⚠️ 8 Blvd St-Germain, 75006            │
│    3 units · €3,600/mo · 2/3 tenants │
│    [1 vacancy]                         │
│    [→]                                 │
├────────────────────────────────────────┤
│ 🏠 Parking Rivoli, 75001              │
│    1 unit · €150/mo · 1 tenant        │
│    [✓]                                 │
│    [→]                                 │
├────────────────────────────────────────┤
│ BOTTOM NAV                             │
│ [🏠]  [📋]  [👥]  [💰]  [⚙️]           │
└────────────────────────────────────────┘
```

### Property Detail Screen
```
Desktop:
┌──────────────────────────────────────────────────────────────────────────┐
│ Sidebar │ TOP BAR                                                        │
│         │ ┌────────────────────────────────────────────────────────────┐│
│         │ │🔔 │ 🔍 Search...        │ [Edit Property] [Actions ▼] [← Back]││
│         │ └──┴──────────────────────────────────────────────────────────┘│
│         │                                                                    │
│         │ 12 Rue de la Paix, 75001 Paris                                   │
│         │ Apartment · 1 unit                                               │
│         │ ─────────────────────────────────────────────────────────────   │
│         │ [📋 Units] [👥 Tenants] [📄 Leases] [💰 Payments] [📁 Files]    │
│         │     (active tab)                                                  │
│         │                                                                    │
│         │ ┌────────────────────────────────────────────────────────────┐  │
│         │ │ UNIT #1                                        [Edit] [⋮] │  │
│         │ │                                                                    │  │
│         │ │ Status: ● Occupied                                           │  │
│         │ │ Tenant: Marie Dupont                                          │  │
│         │ │ Lease: #LE-2024-001 · €850/month · Ends Jun 30, 2026         │  │
│         │ │ Rent: ✅ Paid Apr 8                                           │  │
│         │ │                                                            │  │
│         │ │ Monthly rent: €850                                           │  │
│         │ │ Charges (provision): €50                                     │  │
│         │ │ Total: €900/month                                            │  │
│         │ │                                                            │  │
│         │ │ [View Lease] [Send Receipt] [Record Payment] [Request Maint]│  │
│         │ └────────────────────────────────────────────────────────────┘  │
│         │                                                                    │
│         │ [+ Add Unit]                                                     │
└──────────────────────────────────────────────────────────────────────────┘

Mobile (Property Detail):
┌──────────────────────────────────────┐
│ [←] 12 Rue de la Paix                │
├──────────────────────────────────────┤
│ Apt · 1 unit · Paris 75001          │
│ [Edit]              [Actions ▼]       │
├──────────────────────────────────────┤
│ [📋 Units] [👥 Tenants] [📄 Leases]   │
│ [💰 Payments] [📁 Files]            │
├──────────────────────────────────────┤
│ UNIT #1                               │
│ ● Occupied                            │
│                                       │
│ Tenant: Marie Dupont                   │
│ Lease: #LE-2024-001                   │
│ Rent: €850/mo · Ends Jun 30, 2026    │
│ Status: ✅ Paid (Apr 8)                │
│                                       │
│ [View Lease] [Send Receipt]           │
│ [Record Payment] [Request Maint.]     │
└──────────────────────────────────────┘
```

---

## 4. Tenant Detail Screen

### Desktop View
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Sidebar │                                                                    │
│         │  TOP BAR                                                          │
│         │  ┌──────────────────────────────────────────────────────────────┐ │
│         │  │🔔 │ 🔍 Search...         │ [Edit Tenant] [Actions ▼] [← Back]│ │
│         │  └──┴────────────────────────────────────────────────────────────┘ │
│         │                                                                      │
│         │  Tenant Profile                                                          │
│         │  ┌─────────────────────────────┬──────────────────────────────────┐ │
│         │  │ [Avatar — Initials or img] │  Marie Dupont                    │ │
│         │  │                             │  Tenant since Jan 2024           │ │
│         │  │  ● Active                   │  📧 marie.dupont@email.fr        │ │
│         │  │                             │  📱 +33 6 12 34 56 78            │ │
│         │  │                             │  ID verified ✅                 │ │
│         │  └─────────────────────────────┴──────────────────────────────────┘ │
│         │                                                                      │
│         │  ┌───────────────────────────────────────────────────────────────┐     │
│         │  │ CURRENT LEASE                                    [View →] │     │
│         │  │ #LE-2024-001 · Apt 12 Rue de la Paix                     │     │
│         │  │ €850/month · Charges €50 · Total €900                     │     │
│         │  │ Start: Jan 1, 2024 · End: Jun 30, 2026                     │     │
│         │  │ Status: Active · 14 months remaining                       │     │
│         │  └───────────────────────────────────────────────────────────────┘     │
│         │                                                                      │
│         │  PAYMENT HISTORY                            [Record Payment]        │
│         │  ┌─────┬────────────┬────────────┬────────────┬─────────────────┐    │
│         │  │ Yr  │ Month      │ Amount     │ Status     │ Date            │    │
│         │  ├─────┼────────────┼────────────┼────────────┼─────────────────┤    │
│         │  │ 2026│ April      │ €900       │ ✅ Paid    │ Apr 8, 2026    │    │
│         │  │ 2026│ March      │ €900       │ ✅ Paid    │ Mar 5, 2026    │    │
│         │  │ 2026│ February   │ €900       │ ✅ Paid    │ Feb 3, 2026    │    │
│         │  │ 2026│ January    │ €900       │ ✅ Paid    │ Jan 4, 2026    │    │
│         │  └─────┴────────────┴────────────┴────────────┴─────────────────┘    │
│         │  [Show all 26 payments →]                                           │
│         │                                                                      │
│         │  DOCUMENTS                                                          │
│         │  📄 Lease contract (signed) · Jan 1, 2024                           │
│         │  📄 ID Card · Marie Dupont · Uploaded Jan 1, 2024                    │
│         │  📄 Quittance #001 · Apr 2026 · €900 · [Download]                   │
│         │  [+ Upload document]                                                │
│         │                                                                      │
│         │  NOTES & MESSAGES                                                   │
│         │  ┌──────────────────────────────────────────────────────────────┐   │
│         │  │ [Add a note about this tenant...]                          │   │
│         │  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Mobile Variant (Tenant Detail)
```
┌──────────────────────────────────────────────┐
│ [←]  Tenant Detail              [Edit] [⋮] │
├──────────────────────────────────────────────┤
│  [Avatar]                                   │
│  Marie Dupont                               │
│  ● Active · Tenant since Jan 2024          │
│  📧 marie.dupont@email.fr                   │
│  📱 +33 6 12 34 56 78                      │
│  ✅ ID verified                             │
├──────────────────────────────────────────────┤
│ CURRENT LEASE                    [View →]  │
│ #LE-2024-001 · 12 Rue de la Paix           │
│ €850/mo + €50 charges = €900               │
│ Jan 1, 2024 → Jun 30, 2026                 │
│ 14 months remaining                         │
├──────────────────────────────────────────────┤
│ PAYMENT HISTORY                  [+ Record] │
│ ┌──────────────────────────────────────────┐ │
│ │ Apr 2026  €900  ✅ Paid    Apr 8         │ │
│ │ Mar 2026  €900  ✅ Paid    Mar 5         │ │
│ │ Feb 2026  €900  ✅ Paid    Feb 3         │ │
│ └──────────────────────────────────────────┘ │
│ [Show all 26 →]                            │
├──────────────────────────────────────────────┤
│ DOCUMENTS                                   │
│ 📄 Lease · Jan 1, 2024                     │
│ 📄 ID Card · Uploaded Jan 1, 2024           │
│ 📄 Quittance Apr 2026 · [Download]         │
├──────────────────────────────────────────────┤
│ [Message Tenant]  [Send Reminder]  [Archive]│
└──────────────────────────────────────────────┘
```

---

## 5. Lease Editor Screen

### Desktop — Create New Lease
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Sidebar │ TOP BAR                                                                      │
│         │ ┌───────────────────────────────────────────────────────────────────┐  │
│         │ │🔔 │ 🔍 Search...                      │ [Save Draft] [Cancel]    │  │
│         │ └──┴───────────────────────────────────────────────────────────────────┘  │
│         │                                                                              │
│         │ New Lease — 12 Rue de la Paix, Unit #1                      [Progress: 3/5]│
│         │ ────────────────────────────────────────────────────────────────────────   │
│         │                                                                              │
│         │  [① Tenant] [② Property] [③ Rent] [④ Dates] [⑤ Review]                     │
│         │      ●         ○          ○        ○        ○                               │
│         │                                                                              │
│         │ ┌─────────────────────────────────────────────────────────────────────┐    │
│         │ │ STEP 1: SELECT OR CREATE TENANT                                      │    │
│         │ │                                                                         │    │
│         │ │ Existing tenant:                                                      │    │
│         │ │ [Search tenant...                          ▼] [Select]               │    │
│         │ │                                                                         │    │
│         │ │  — or —                                                               │    │
│         │ │                                                                         │    │
│         │ │ Create new tenant:                                                    │    │
│         │ │ Full name:  [_________________________________]                      │    │
│         │ │ Email:      [_________________________________]                      │    │
│         │ │ Phone:      [_________________________________]                      │    │
│         │ │ Date of birth: [__/__/____]  Nationality: [__________]               │    │
│         │ │                                                                         │    │
│         │ └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                              │
│         │  ┌─────────────────────────────────────────────────────────────────────┐    │
│         │  │ STEP 3: RENT DETAILS                                                 │    │
│         │  │                                                                       │    │
│         │  │ Monthly rent (excluding charges): [____€____]                       │    │
│         │  │ Charges (provision / charges locatives):   [____€____]              │    │
│         │  │ Total monthly payment: €900                                            │    │
│         │  │                                                                       │    │
│         │  │ Payment due day: [5th of month              ▼]                     │    │
│         │  │ Security deposit: [____€____] (max 1 month rent in France)         │    │
│         │  │ Payment method: [Bank transfer ▼]                                   │    │
│         │  │                                                                       │    │
│         │  │ ☑ Generate monthly rent receipts automatically                       │    │
│         │  │ ☑ Send payment reminders 3 days before due date                      │    │
│         │  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                              │
│         │                                      [← Back]  [Save Draft]  [Next →]      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile — Lease Editor
```
Mobile (375px):
┌────────────────────────────────────────────┐
│ [←]  New Lease                  [Save]   │
├────────────────────────────────────────────┤
│ Step 1 of 5: Tenant                        │
│ ─────────────────────────────────────────  │
│ ○ Tenant  ○ Property  ○ Rent  ○ Dates     │
│ ●                                  ○ Review│
├────────────────────────────────────────────┤
│ SELECT OR CREATE TENANT                    │
│                                            │
│ Existing tenant:                           │
│ [Search or select...            ▼]          │
│                                            │
│ — or —                                     │
│                                            │
│ New tenant:                                │
│ Full name:                                 │
│ [_________________________________]        │
│                                            │
│ Email:                                     │
│ [_________________________________]        │
│                                            │
│ Phone:                                     │
│ [_________________________________]        │
│                                            │
│ Date of birth:                             │
│ [__/__/____]  Nationality:                 │
│ [________________________]                 │
│                                            │
│ ─────────────────────────────────────────  │
│                                            │
│ [Save Draft]                               │
│ [Next: Property →]                         │
└────────────────────────────────────────────┘
```

---

## 6. Payment Tracker Screen

### Desktop View
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sidebar │ TOP BAR                                                              │
│         │ ┌────────────────────────────────────────────────────────────────┐ │
│         │ │🔔 │ 🔍 Search payments... │ [Filter ▼] [+ Record Payment]      │ │
│         │ └──┴────────────────────────────────────────────────────────────────┘ │
│         │                                                                      │
│         │ PAYMENTS — April 2026                        [← Mar 2026] Apr 2026 [May 2026 →]│
│         │                                                                      │
│         │ SUMMARY                              Total collected: €4,850/€5,500 │
│         │ ┌───────────────────────────────────────────────────────────────┐  │
│         │ │ Received: €4,200  [████████████████████░░░░░░░░░░░] 84%      │  │
│         │ │ Pending:   €650   [█████░░░░░░░░░░░░░░░░░░░░░░░░░] 12%      │  │
│         │ │ Overdue:   €0     [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%      │  │
│         │ └───────────────────────────────────────────────────────────────┘  │
│         │                                                                      │
│         │ PAYMENT LIST — April 2026                            [Export CSV] │
│         │ [All ▼] [Status ▼] [Property ▼]                    Sort: [Date ▼] │
│         │ ┌────────────────────────────────────────────────────────────────┐│
│         │ │ ☐ │ Tenant        │ Property       │ Amount │ Due    │ Status  ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Marie Dupont  │ 12 Rue de la   │ €900   │ Apr 5  │ ✅ Paid ││
│         │ │   │               │ Paix, #1       │        │        │ Apr 8  ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Pierre Leroy │ 5 Av. Foch, #1 │ €1,000 │ Apr 5  │ ✅ Paid ││
│         │ │   │               │                │        │        │ Apr 3  ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Sophie Martin │ 5 Av. Foch, #2 │ €1,000 │ Apr 5  │ ✅ Paid ││
│         │ │   │               │                │        │        │ Apr 4  ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Jacques Renard│ 8 Blvd St-     │ €1,000 │ Apr 5  │ ⚠ Late ││
│         │ │   │               │ Germain, #2    │        │        │ Apr 7  ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Emma Bernard  │ 8 Blvd St-     │ €1,000 │ Apr 5  │ ⏳ Pending││
│         │ │   │               │ Germain, #3    │        │        │         ││
│         │ ├───┼───────────────┼────────────────┼────────┼────────┼─────────┤│
│         │ │ ☐ │ Luc Petit     │ Parking Rivoli│ €150   │ Apr 5  │ ✅ Paid ││
│         │ │   │               │                │        │        │ Apr 2  ││
│         │ └───┴───────────────┴────────────────┴────────┴────────┴─────────┘│
│         │ Showing 6 of 7 payments · Total: €5,050                          │
│         │ ☐ Select all · [Send reminder to selected] · [Mark as paid]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Payment Detail Modal (click on a payment row)
```
┌──────────────────────────────────────────────────────────────┐
│  PAYMENT DETAIL                                         [X] │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  Tenant:     Marie Dupont                                     │
│  Property:   12 Rue de la Paix, Unit #1                      │
│  Lease:      #LE-2024-001                                     │
│                                                               │
│  Period:     April 2026                                        │
│  Due date:   April 5, 2026                                     │
│  Received:   April 8, 2026 (3 days late)                      │
│                                                               │
│  Rent:       €850.00                                           │
│  Charges:    €50.00                                            │
│  ─────────────────                                              │
│  Total:      €900.00                                           │
│                                                               │
│  Status:     ✅ Paid                                           │
│  Method:     Bank transfer (FR76 1234...)                     │
│  Receipt:    #Q-2026-004 · Generated automatically            │
│              [Download Receipt] [Send receipt by email]       │
│                                                               │
│  Notes:                                                          │
│  [No notes________________________________]                  │
│                                                               │
│                                                    [Close]    │
└──────────────────────────────────────────────────────────────┘
```

### Mobile — Payment Tracker
```
Mobile (375px):
┌──────────────────────────────────────────┐
│ [☰]  Payments — Apr 2026     [Record]   │
├──────────────────────────────────────────┤
│ SUMMARY                                  │
│ ┌──────────────────────────────────────┐ │
│ │ Received: €4,200   ████████████░░ 84% │ │
│ │ Pending:   €650    ██░░░░░░░░░░░░░ 12% │ │
│ │ Overdue:   €0      ░░░░░░░░░░░░░░░  0% │ │
│ │ Total: €5,500      collected: €4,850  │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ [← Apr 2026 →]                           │
├──────────────────────────────────────────┤
│ ✅ Marie Dupont · 12 Rue de la Paix #1  │
│    Apr 5 · €900 · Paid Apr 8            │
│    [Receipt ↓]                          │
├──────────────────────────────────────────┤
│ ✅ Pierre Leroy · 5 Av. Foch #1          │
│    Apr 5 · €1,000 · Paid Apr 3          │
│    [Receipt ↓]                          │
├──────────────────────────────────────────┤
│ ⚠️ Jacques Renard · 8 Blvd St-G #2     │
│    Apr 5 · €1,000 · 3 days late         │
│    [Send Reminder]                      │
├──────────────────────────────────────────┤
│ ⏳ Emma Bernard · 8 Blvd St-G #3         │
│    Apr 5 · €1,000 · Pending              │
│    [Mark as Paid]                       │
├──────────────────────────────────────────┤
│ BOTTOM NAV                               │
│ [🏠]  [📋]  [👥]  [💰]  [⚙️]             │
└──────────────────────────────────────────┘
```

---

## Component Specifications

### Cards
```
DESKTOP CARD (default):
- Padding: 24px
- Border-radius: 12px (rounded-xl)
- Background: white
- Border: 1px solid #E2E8F0
- Box-shadow: 0 1px 3px rgba(0,0,0,0.05)
- Hover: shadow-md, border-primary-light transition 150ms

MOBILE CARD (full-width):
- Padding: 16px
- Border-radius: 8px
- No border, subtle shadow
- Stacked vertically
```

### Status Badges
```
✅ Paid / Occupied: bg-green-50 text-green-700 border-green-200
⏳ Pending: bg-amber-50 text-amber-700 border-amber-200
⚠️ Late / Overdue: bg-red-50 text-red-700 border-red-200
🔵 In progress: bg-blue-50 text-blue-700 border-blue-200
⚫ Inactive: bg-slate-100 text-slate-500 border-slate-200
```

### Navigation
```
DESKTOP SIDEBAR (240px):
- Fixed left, full height
- Logo at top (32px)
- Nav items: 44px touch targets, 14px text
- Active item: bg-primary/10 text-primary font-semibold
- Hover: bg-slate-50

MOBILE BOTTOM NAV:
- Fixed bottom, 56px height
- 5 items max, equal width
- Active: text-primary font-semibold, subtle top border
- Inactive: text-slate-400
- Safe area padding for notched phones
```

### Tables (Desktop)
```
- Header: bg-slate-50, text-xs, uppercase, tracking-wide, text-slate-500
- Rows: 56px min-height, border-b 1px #F1F5F9
- Hover row: bg-slate-50/50
- Cell padding: 12px 16px
- Checkboxes: 20px, rounded
```

### Forms
```
INPUT FIELDS:
- Height: 44px
- Border: 1px solid #E2E8F0
- Border-radius: 6px
- Focus: border-primary ring-2 ring-primary/20
- Error: border-red-500 ring-2 ring-red-500/20
- Label: 14px font-medium text-slate-700, mb-6px

BUTTONS:
Primary: bg-primary text-white hover:bg-primary-light h-44px px-20px rounded-lg
Secondary: bg-white text-primary border border-primary hover:bg-primary/5 h-44px
Danger: bg-red-600 text-white hover:bg-red-700 h-44px px-20px rounded-lg
Ghost: transparent text-slate-600 hover:bg-slate-100 h-36px px-12px
```

---

## File Deliverable

These wireframes are also available as an interactive Figma file at:
**[Figma Wireframe Link — REN-47 Core User Flows]**  
*(Figma file to be created and linked here once file is ready)*

For implementation, share this document with the Senior Full-Stack Engineer and Frontend Developer for phase-by-phase buildout.

---

*Wireframes by Product Designer · REN-47 · 2026-04-08*
