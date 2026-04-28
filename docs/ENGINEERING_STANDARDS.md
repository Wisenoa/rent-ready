# Q2 2026 Engineering Quality Standards — RentReady

**Issue:** REN-567 | **Author:** CTO | **Date:** 2026-04-28
**Status:** Active — mandatory compliance for all engineering work

---

## Purpose

This document establishes the engineering quality bar for Q2 2026. All engineers (full-time, contractors, agents) must adhere to these standards on every PR, API route, page, and feature shipped to staging or production.

---

## 1. Pull Request & Code Review Standards

### 1.1 PR Lifecycle

- **PR must have a description** using the template in `.github/pull_request_template.md`. Description must include: what changed, why, how to test, and linked issue (e.g., "Fixes REN-XXX").
- **PR size:** Target < 400 lines changed. Large PRs must be split or justified in the description.
- **Draft PRs** are allowed for work-in-progress feedback but must be marked "Ready for Review" before requesting review.
- **Self-merge prohibited** — every PR requires at least 1 approving review from another engineer.

### 1.2 Review Turnaround

| Role | SLA |
|---|---|
| First review response | **< 8 business hours** |
| Re-review after author addresses comments | **< 4 business hours** |
| Final approval / merge | **< 4 business hours** after last comment resolved |
| Hotfix / security PR (P0) | **< 1 hour** — tag all engineers in Slack |

If a PR has been waiting > 8 business hours without a review, the author should ping in `#engineering` and can escalate to the CTO.

### 1.3 Definition of Done (DoD)

A story is **done** only when ALL of the following are true:

1. **Code complete** — All acceptance criteria in the issue are implemented.
2. **Tests written** — Unit tests cover all new logic; integration tests cover all new API routes.
3. **Linting clean** — `npm run lint` passes with no errors.
4. **Type check passes** — `npx tsc --noEmit` exits with code 0.
5. **No console errors in browser** — Dev server logs are clean; no unhandled promise rejections.
6. **Feature tested manually** — Author verifies the feature works end-to-end on staging.
7. **Mobile responsive** — Feature works on 375px (iPhone SE) and 768px (iPad) viewport widths.
8. **Documentation updated** — README, API docs, or inline comments updated if behavior changed.
9. **No regression** — CI passes (`next build` completes, Playwright E2E tests pass).
10. **Schema migration included** (if applicable) — `prisma migrate dev` produces a valid migration; migration is included in the PR.

### 1.4 PR Review Checklist

Reviewers must verify:

- [ ] Logic is correct and handles edge cases (null, empty array, large inputs)
- [ ] No sensitive data logged or exposed in responses
- [ ] Database queries use Prisma (no raw SQL unless justified)
- [ ] Error handling is user-friendly (no raw error messages in API responses)
- [ ] Loading and error states handled in UI
- [ ] No commented-out code included
- [ ] No TODO/FIXME comments left unresolved
- [ ] New environment variables documented in `.env.example`

---

## 2. Performance Budget

### 2.1 Core Web Vitals Budget (Marketing Pages — public, indexable)

| Metric | Target | Critical Threshold |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.0s | < 2.5s |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 |
| **INP** (Interaction to Next Paint) | < 100ms | < 200ms |
| **FCP** (First Contentful Paint) | < 1.0s | < 1.8s |
| **TTFB** (Time to First Byte) | < 200ms | < 600ms |

### 2.2 Core Web Vitals Budget (App Pages — authenticated)

| Metric | Target | Critical Threshold |
|---|---|---|
| **LCP** | < 2.5s | < 4.0s |
| **CLS** | < 0.1 | < 0.2 |
| **INP** | < 200ms | < 500ms |

### 2.3 Page Size Budget

| Page Type | JS Budget (compressed) | Image Max |
|---|---|---|
| Homepage | 150 KB | Hero: WebP < 200 KB |
| Template/tool pages | 200 KB | Screenshots: WebP < 100 KB each |
| Blog article | 180 KB | Featured image: WebP < 150 KB |
| App dashboard | 250 KB | Charts: SVG or optimized canvas |

### 2.4 API Performance

- All API routes must respond in **< 500ms** (p95) under normal load.
- Database queries must use **selective fields** (`select: { id: true, name: true }`) — never `select: { * }` on large tables.
- All list endpoints must implement **pagination** (default 20, max 100).
- Heavy operations (PDF generation, AI calls) must be **async** via server actions or background jobs.

### 2.5 Monitoring

- Every marketing page must have a **SpeedCurve** or **WebPageTest** run in CI.
- Core Web Vitals are tracked in **Sentry** for app pages.
- Performance budget violations block deployment via a CI check in `.github/workflows/perf-budget.yml`.

---

## 3. Accessibility Standards (WCAG 2.1 AA)

### 3.1 Required Compliance

All pages (marketing and app) must meet **WCAG 2.1 Level AA** compliance.

### 3.2 Critical Rules

- [ ] All images have meaningful `alt` text (or `alt=""` for decorative images).
- [ ] All interactive elements (buttons, links, inputs) are keyboard-navigable via **Tab / Shift+Tab / Enter / Escape**.
- [ ] Color contrast ratio ≥ **4.5:1** for normal text, ≥ **3:1** for large text (18pt+ or 14pt bold).
- [ ] All form inputs have associated `<label>` elements.
- [ ] Error messages are announced by screen readers (use `aria-live="polite"`).
- [ ] Modals have `role="dialog"`, `aria-modal="true"`, and focus is trapped inside.
- [ ] Page has a single `<h1>` and heading hierarchy is logical (no skips: h1 → h3 with no h2).
- [ ] Skip-to-content link is present as the first focusable element on all pages.
- [ ] No content flashes more than 3 times per second.
- [ ] Touch targets are at least **44x44px** on mobile.

### 3.3 Testing

- Run `npx pa11y https://staging.rentready.fr` on all new marketing pages.
- Use **axe DevTools** browser extension for manual accessibility audit before shipping.
- Automated axe check runs in CI for app pages.
- Annual manual audit by an external accessibility consultant (scheduled Q3).

### 3.4 French Language Accessibility

- `lang="fr"` is set on the `<html>` element.
- French punctuation rules respected (no narrow no-break space issues).
- Date formats use French locale (DD/MM/YYYY).
- Currency formatted as French locale (1 234,56 €).

---

## 4. API Design Standards

### 4.1 REST Conventions

| Convention | Rule |
|---|---|
| **URL structure** | `/api/{resource}` plural nouns, kebab-case, no verbs |
| **HTTP methods** | `GET` (read), `POST` (create), `PATCH` (partial update), `DELETE` (remove) |
| **Status codes** | `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `422` Validation Error, `500` Server Error |
| **Error format** | `{ "error": { "code": "VALIDATION_ERROR", "message": "Human-readable message", "details": [...] } }` |
| **Pagination** | Cursor or offset pagination; response includes `data[]`, `total`, `page`, `perPage` |
| **Idempotency** | `POST` endpoints must be idempotent via `Idempotency-Key` header or business key dedup |

### 4.2 Request/Response Standards

- Request body: validate with **Zod** schema before any logic.
- Always return **structured JSON** — never plain text or HTML (except file downloads).
- Dates: ISO 8601 strings in UTC (`2026-04-28T00:00:00Z`).
- Money amounts: always in **cents (integer)** in API requests/responses; `Decimal` in DB.
- Partial PATCH updates: only include fields being updated.

### 4.3 OpenAPI Documentation

- All public API routes must have an **OpenAPI 3.1 annotation** using `@/lib/api-docs"` decorator pattern.
- Doc must include: summary, description, request schema, response schemas (200 + error cases), example request/response.
- OpenAPI spec is auto-generated and published to `/docs/api` on staging.

### 4.4 Authentication

- All `/api/*` routes (except `/api/auth/*` and `/api/health`) require a valid session cookie.
- Tenant portal routes (`/api/tenant/*`) use short-lived token auth (`/portal/{token}`).
- Rate limiting: 100 req/min per IP for public endpoints; 1000 req/min per user for authenticated endpoints.
- Never expose internal error details in production API responses.

### 4.5 Database

- Always use **Prisma** ORM — no raw SQL unless justified and documented.
- All mutations must be wrapped in a **transaction** when modifying multiple related tables.
- Migrations must be backward-compatible (no column removal without deprecation cycle).
- Index all foreign keys and frequently filtered fields.

---

## 5. Definition of Done for Each Story (Quick Reference)

Every shipped story must include ALL of:

```
✅ Acceptance criteria met (per issue description)
✅ Unit tests: > 80% coverage on new functions
✅ Integration tests: all new API routes covered
✅ Lint: npm run lint passes
✅ Type check: tsc --noEmit passes
✅ Manual test on staging: feature works end-to-end
✅ Mobile test: 375px + 768px viewport
✅ Accessibility: axe audit passes
✅ Performance: LCP < 2.5s (marketing), INP < 200ms
✅ No console errors in browser
✅ No regression in existing tests
✅ Docs updated (README, API docs, migration guide)
✅ PR reviewed and approved by ≥1 engineer
```

---

## 6. Enforcement

- **CI gates:** PRs cannot merge unless `lint`, `typecheck`, `test`, and `build` all pass.
- **Performance gates:** Core Web Vitals regressions > 10% on marketing pages block deployment.
- **Access review:** CTO reviews all PRs for security and architecture compliance.
- **Monthly audit:** Engineering metrics (PR cycle time, defect escape rate, deployment frequency) reviewed in monthly retrospective.

---

*Questions or proposed changes to these standards should be raised in `#engineering` and approved by the CTO.*
