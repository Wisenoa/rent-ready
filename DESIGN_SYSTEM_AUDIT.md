# Design System Audit — REN-551
**Date:** 2026-04-28
**Author:** Product Designer Agent
**Status:** In Progress

---

## 1. Component Inventory

### 1.1 UI Component Library (`src/components/ui/`)
| Component | File | Foundation | Slot Pattern | Focus States | Notes |
|-----------|------|-----------|-------------|--------------|-------|
| Button | button.tsx | @base-ui/react/button | ✅ data-slot="button" | ✅ ring/aria-invalid | CVA variants: default, outline, secondary, ghost, destructive, link |
| Input | input.tsx | @base-ui/react/input | ✅ data-slot="input" | ✅ ring | h-8, rounded-lg, border-input |
| Card | card.tsx | native div | ✅ data-slot="card" | ✅ ring | size prop (default/sm), has-img-first-child trick |
| Badge | badge.tsx | native span | ❌ | ❌ | Needs slot pattern + focus-visible |
| Label | label.tsx | native | ❌ | ❌ | Lightweight, no slot/focus |
| Avatar | avatar.tsx | native img | ❌ | ❌ | Needs slot pattern |
| Accordion | accordion.tsx | native | ✅ data-slot | ❌ | Uses Radix-like pattern |
| Dialog | dialog.tsx | @base-ui/react | ✅ | ✅ | Solid |
| DropdownMenu | dropdown-menu.tsx | @base-ui/react | ✅ | ✅ | Solid |
| Sheet | sheet.tsx | @base-ui/react | ✅ | ✅ | Side navigation |
| Select | select.tsx | @base-ui/react | ✅ | ✅ | Solid |
| Tabs | tabs.tsx | @base-ui/react | ✅ | ✅ | Solid |
| Tooltip | tooltip.tsx | @base-ui/react | ✅ | ✅ | Solid |
| Table | table.tsx | native | ❌ | ❌ | Simple, functional |
| Separator | separator.tsx | native | ❌ | ❌ | Simple |
| Skeleton | skeleton.tsx | native | ❌ | ❌ | Loading state |
| Popover | popover.tsx | @base-ui/react | ✅ | ✅ | Solid |
| Calendar | calendar.tsx | native + date-fns | ❌ | ❌ | Dashboard date picker |
| Textarea | textarea.tsx | native | ❌ | ❌ | Needs slot + focus states |
| Command | command.tsx | cmdk | ✅ | ✅ | Search/combobox |
| ScrollArea | scroll-area.tsx | native | ❌ | ❌ | Simple wrapper |
| Sonner | sonner.tsx | sonner | ❌ | ❌ | Toast notifications |

### 1.2 Landing Components (`src/components/landing/`)
| Component | SEO Role | Schema Ready | Mobile | Notes |
|-----------|----------|-------------|--------|-------|
| hero-section.tsx | H1 + intro | ❌ | ✅ | CTA buttons, no FAQ |
| pricing-section.tsx | Pricing table | ❌ FAQ | ✅ | Toggle for monthly/annual |
| social-proof.tsx | Stats + logos | ❌ | ✅ | Animated counters |
| testimonials-section.tsx | Social proof | ❌ | ✅ | 3-column grid |
| faq-section.tsx | FAQ | ✅ FAQPage | ✅ | Accordion pattern |
| glass-nav.tsx | Navigation | ❌ BreadcrumbList | ✅ | Sticky, transparent |
| marketing-footer.tsx | Footer sitemap | ❌ | ✅ | Multi-column |
| FeatureLandingPage.tsx | Feature pages | ❌ | ✅ | Reusable section blocks |
| bento-benefits.tsx | Benefits grid | ❌ | ✅ | 3-col icon grid |
| comparison-section.tsx | Competitive | ❌ | ✅ | Feature comparison table |
| demo-form.tsx | Lead capture | ❌ | ✅ | Email capture |
| animated-counter.tsx | Stats animation | ❌ | ✅ | IntersectionObserver |
| scroll-reveal.tsx | Animation | ❌ | ✅ | Framer Motion wrapper |
| motion-config.ts | Motion config | ❌ | ✅ | Animation presets |
| pricing-card.tsx | Pricing tier | ❌ | ✅ | Highlighted tier |
| pricing-toggle.tsx | Billing toggle | ❌ | ✅ | Monthly/annual switch |
| problem-section.tsx | Pain points | ❌ | ✅ | 3 problems |
| final-cta.tsx | CTA banner | ❌ | ✅ | Email capture |
| testimonial-strip.tsx | Trust signals | ❌ | ✅ | Logo strip |
| testimonial-card.tsx | Single testimonial | ❌ | ✅ | Avatar + quote |
| quittance-generator-form.tsx | Lead gen tool | ❌ HowTo | ✅ | Interactive |
| dynamic-wrappers/ | Dynamic sections | ❌ | ✅ | Lazy-loaded |

### 1.3 Dashboard Components (`src/components/dashboard/`)
| Component | Purpose | Slot Pattern | Notes |
|-----------|---------|-------------|-------|
| charts.tsx | Dashboard analytics | ❌ | Recharts-based |
| kpi-card.tsx | Metric cards | ❌ | No data-slot pattern |

### 1.4 App Components
| Component | Location | Notes |
|-----------|---------|-------|
| onboarding-wizard-v2.tsx | src/components/ | Complex multi-step, needs refactor |
| dashboard-onboarding-wrapper.tsx | src/components/ | Thin wrapper |
| glass-nav.tsx | landing | Used in app too (mobile nav) |

---

## 2. Inconsistencies Found

### 2.1 Slot Pattern Gaps
- Badge, Label, Avatar, Textarea, Table, Separator, Skeleton, Calendar, ScrollArea, Sonner — no `data-slot` attribute
- Dashboard components (charts.tsx, kpi-card.tsx) — no slot patterns

### 2.2 Focus States Gaps
- Badge, Label, Avatar, Textarea, Table, Separator, Skeleton, Calendar, ScrollArea — no `focus-visible` ring states
- Compare to Button/Input which have: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`

### 2.3 Form Component Gaps
**Critical for conversion:** No `Form` component library. The register form uses raw `react-hook-form` with `zodResolver`. This creates inconsistencies across:
- `/register/register-form.tsx` — uses `errors.name`, `errors.email` directly
- Demo forms — similar pattern without standardization
- Onboarding forms — scattered validation

**Missing components:**
- `FormField` — wraps field + label + input + error
- `FormLabel` — styled label with required indicator
- `FormMessage` — inline error with icon
- `FormDescription` — helper text

### 2.4 Color Token Inconsistencies
The codebase uses mixed approaches:
- `ring-1 ring-foreground/10` (Card) — CSS variable approach
- `bg-primary text-primary-foreground` (Button) — design token approach
- `text-muted-foreground` (Card description) — semantic token
- Hardcoded colors like `text-indigo-900` (onboarding wizard) — utility class

### 2.5 Typography Inconsistencies
- Button uses `text-sm font-medium`
- Card Title uses `font-heading text-base leading-snug font-medium`
- Various heading levels use inconsistent sizing
- No shared `typography.tsx` component with heading scale

### 2.6 Spacing Inconsistencies
- Card padding: `px-4 py-4` (default), `px-3 py-3` (sm)
- Input padding: `px-2.5 py-1`
- Button padding: `px-2.5` (default)
- Dialog content: likely different again

### 2.7 Dashboard Design Debt
- charts.tsx uses Recharts directly — no wrapper component
- kpi-card.tsx is simple — no slot pattern, no focus states
- No shared dashboard layout system

---

## 3. Component Decision Tree

### 3.1 Buttons
```
Need a button?
  ├─ Primary action → <Button variant="default">
  ├─ Secondary action → <Button variant="secondary">
  ├─ Destructive action → <Button variant="destructive">
  ├─ Subtle/action that blends in → <Button variant="ghost">
  ├─ Outline/controlled action → <Button variant="outline">
  ├─ Text link → <Button variant="link">
  └─ Icon only → <Button size="icon"> or <Button size="icon-sm">
      (Never use icon-only without aria-label)
```

### 3.2 Form Inputs
```
Need user input?
  ├─ Single line text → <Input>
  ├─ Multi-line text → <Textarea>
  ├─ Dropdown → <Select>
  ├─ Date → <Calendar> or custom date picker
  └─ Full form with validation → Wrap with FormField
      (FormField handles label + input + error automatically)
```

### 3.3 Content Containers
```
Need to group content?
  ├─ Marketing card (image + content) → <Card size="default">
  ├─ Small card / list item → <Card size="sm">
  ├─ Dashboard stat → <KPICard>
  ├─ Dialog/modal → <Dialog> (see Dialog above)
  └─ Section with heading → Build with CardHeader pattern
```

### 3.4 Navigation
```
Need navigation?
  ├─ Top nav → <GlassNav> (marketing) or Sidebar (dashboard)
  ├─ Side nav (mobile) → <Sheet>
  ├─ Tabs → <Tabs>
  └─ Breadcrumbs → Currently none — needs component
```

### 3.5 Feedback
```
Need to show feedback?
  ├─ Success/info/error toast → <Sonner>
  ├─ Inline error → <FormMessage> (needs building)
  ├─ Tooltip → <Tooltip>
  └─ Loading skeleton → <Skeleton>
```

---

## 4. Component Versioning Strategy

Current: implicit (no version numbers)

**Proposed:** Semantic versioning via file header comments

```typescript
/**
 * Button v1.2.0
 * 
 * Version history:
 * v1.2.0 (2026-04-28) — Added icon-xs and icon-sm sizes
 * v1.1.0 (2026-04-20) — Added destructive variant
 * v1.0.0 (2026-04-07) — Initial release
 */
```

**Deprecated lifecycle:**
1. Mark deprecated in JSDoc: `@deprecated use <NewComponent> instead`
2. Add `data-deprecated="reason"` attribute
3. Keep in codebase for 1 sprint before removal
4. Update migration guide

---

## 5. Gaps — Components Missing for Full Coverage

### P0 — Critical (affects conversion/auth)
- [ ] `FormField` — standardized form field wrapper with label + input + error
- [ ] `FormLabel` — styled label with required `*` indicator
- [ ] `FormMessage` — error message with AlertCircle icon
- [ ] `FormDescription` — helper text below input

### P1 — High (affects SEO/trust)
- [ ] `Breadcrumbs` — breadcrumb nav with BreadcrumbList schema support
- [ ] `SchemaMarkup` — reusable JSON-LD component
- [ ] `TrustBadge` — certification/compliance badge component
- [ ] `StatsBar` — animated counter strip (already exists as animated-counter.tsx, needs componentization)
- [ ] `TestimonialCard` — needs to be extracted from landing/testimonial-card.tsx

### P2 — Medium (UX polish)
- [ ] `EmptyState` — dashboard empty state with illustration + CTA
- [ ] `DataTable` — table wrapper with sorting/pagination patterns
- [ ] `PasswordInput` — input with show/hide toggle
- [ ] `SearchInput` — input with search icon + clear button
- [ ] `FileUpload` — drag-and-drop file zone
- [ ] `Badge` v2 — add slot pattern + focus states

### P3 — Nice to have
- [ ] `CommandPalette` — cmd+k search (uses cmdk already)
- [ ] `AnnouncementBanner` — top banner for promotions/notifications
- [ ] `OnboardingTour` — tooltip-based product tour
- [ ] `ProgressBar` — multi-step progress indicator

---

## 6. Priority Backlog — Design System v2

### Sprint 1 (this week)
1. Build `FormField` + `FormLabel` + `FormMessage` — standardize all auth/lead-gen forms
2. Add `Badge` slot pattern and focus states
3. Extract `TestimonialCard` to ui/ components

### Sprint 2
4. Build `Breadcrumbs` component with schema support
5. Build `EmptyState` component for dashboard modules
6. Add focus states to Textarea and Label

### Sprint 3
7. Build `PasswordInput` and `SearchInput`
8. Extract `StatsBar` / `AnimatedCounter` to reusable component
9. Add versioning headers to all ui/ components

### Sprint 4+
10. Build `FileUpload` component
11. Build `DataTable` with sorting patterns
12. Build `OnboardingTour` (uses existing tippy.js or similar)
13. Build `CommandPalette`

---

## 7. Component Quality Score

| Component Group | Slot Pattern | Focus States | TypeScript | Storybook/Doc | Score |
|----------------|-------------|-------------|-----------|--------------|-------|
| Button/Input | 10/10 | 10/10 | 10/10 | 0/10 | 7.5 |
| Card | 10/10 | 10/10 | 10/10 | 0/10 | 7.5 |
| Dialog/Sheet/Dropdown | 10/10 | 10/10 | 10/10 | 0/10 | 7.5 |
| Form primitives | 0/10 | 0/10 | 10/10 | 0/10 | 2.5 |
| Dashboard (charts/kpi) | 0/10 | 0/10 | 10/10 | 0/10 | 2.5 |
| Landing components | 0/10 | 0/10 | 10/10 | 0/10 | 2.5 |
| Feedback (Toast/Skeleton) | 0/10 | 0/10 | 10/10 | 0/10 | 2.5 |
| Badge/Label/Avatar | 0/10 | 0/10 | 10/10 | 0/10 | 2.5 |

**Overall: 4.4/10** — solid foundation with @base-ui, needs gap-filling

---

## 8. Recommendations Summary

1. **Adopt @base-ui/react consistently** — it's already the foundation for Button, Input, Dialog. Fill gaps (Badge, Accordion) from @base-ui before building custom.
2. **Build Form system immediately** — P0 for conversion. Wrap all auth forms in FormField.
3. **Add slot patterns to ALL components** — enables CSS targeting without class pollution.
4. **Add focus-visible to all interactive components** — accessibility requirement, currently inconsistently applied.
5. **Extract landing components to ui/ when reusable** — TestimonialCard, StatsBar, etc.
6. **Build Breadcrumbs + SchemaMarkup** — these are SEO-critical and currently missing entirely.
7. **Add component versioning** — simple JSDoc headers, track in this document.
8. **Dashboard components need the same treatment** — slot patterns, focus states, consistency with ui/ library.
