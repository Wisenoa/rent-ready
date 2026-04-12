# V1 Technical Architecture Blueprint — RentReady
**Issue:** REN-90 | **Author:** CTO | **Date:** 2026-04-12
**Status:** Approved — blocks all V1 engineering

---

## 1. Strategic Architecture Decisions

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  Next.js 15 App Router (React Server Components)                │
│  Tailwind CSS v4 + shadcn/ui + Radix                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────────┐
│                     EDGE / CDN (Vercel)                        │
│  • Static assets from edge                                      │
│  • Sentry tunnel (/api/sentry-error)                           │
│  • Rate limiting middleware                                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                  APPLICATION (Next.js Standalone)              │
│  Node.js 20 / Single Docker container / Vercel serverless       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Route Handler │  │ Server       │  │ Server Actions       │  │
│  │ /api/*       │  │ Components   │  │ /lib/actions/*.tsx   │  │
│  │ (REST API)   │  │ (RSC)        │  │ (Form mutations)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   LIBRARY LAYER                           │  │
│  │  auth-server.ts  │  prisma  │  quittance-generator.tsx   │  │
│  │  ai-sdk          │  stripe  │  bail-pdf-server.tsx       │  │
│  │  resend          │  redis   │  irl-calculator.ts        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────────┐
        ▼                 ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐
│  PostgreSQL   │  │    Redis      │  │   MinIO (S3)        │
│  (pgbouncer) │  │  Sessions     │  │   Documents/PDFs    │
│  Prisma ORM  │  │  Cache/Rate   │  │   receipts          │
└───────────────┘  └───────────────┘  └─────────────────────┘
```

### 1.2 Why This Stack

| Decision | Choice | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 App Router | RSC by default = minimal JS to client. SEO critical for French market. Built-in API routes eliminate separate backend. |
| **Database** | PostgreSQL 16 + Prisma 7 | ACID compliance for financial data. French market data residency. Prisma 7 typed queries eliminate raw SQL. |
| **Auth** | Better Auth 1.5.6 | Session-based (not JWT). Magic links for tenants. OAuth-ready. No third-party auth dependency. |
| **Document gen** | `@react-pdf/renderer` | Pure Node.js PDF generation. Factur-X French invoice standard support. No external service. |
| **Storage** | MinIO (dev) → S3 (prod) | S3-compatible. Quittances and PDFs stored as objects. Pre-signed URLs for secure tenant access. |
| **Email** | Resend | 99.1% deliverability. React email templates. Webhook for bounce tracking. |
| **Payments** | Stripe | subscriptions + webhook + Connect (future marketplace). French carte bancaire support. |
| **AI** | OpenAI via `@ai-sdk/openai` | Lease analysis, rent follow-up drafts, maintenance summarization. `ai` SDK for streaming. |
| **Hosting** | Vercel (frontend) + Docker (self-host option) | Zero-config CI/CD. Edge network for French users. Self-host option for enterprise/data sovereignty. |
| **Monitoring** | Sentry | APM + error tracking. Source maps auto-uploaded. 5% sampling in prod keeps costs low. |

---

## 2. Data Model (Complete Entity-Relationship)

### 2.1 Core Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER (Bailleur)                                 │
│ id, email, name, firstName, lastName, phone                                 │
│ addressLine1, city, postalCode, country (France)                            │
│ stripeCustomerId, stripeSubscriptionId, subscriptionStatus                  │
│ trialEndsAt, createdAt, updatedAt                                            │
│ ────────────────────────────────────────────────────────────                 │
│ RELATIONS: properties[], tenants[], leases[], transactions[]                 │
│             documents[], bankConnections[], expenses[]                       │
│             reminders[], notifications[], auditLogs[]                        │
└────────────────┬──────────────────┬────────────────────────────┬────────────┘
                 │ 1:N               │ 1:N                        │ 1:N
                 ▼                   ▼                            ▼
┌──────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│      PROPERTY        │  │       TENANT         │  │         LEASE           │
│ ────────────────────  │  │ ───────────────────  │  │ ──────────────────────  │
│ id, userId            │  │ id, userId           │  │ id, userId              │
│ name, type            │  │ firstName, lastName  │  │ propertyId, tenantId    │
│ addressLine1, city    │  │ email, phone         │  │ rentAmount, charges,    │
│ postalCode, country   │  │ addressLine1, city   │  │ depositAmount           │
│ surface, rooms        │  │ postalCode           │  │ startDate, endDate      │
│ description           │  │ dateOfBirth          │  │ paymentDay, leaseType   │
│ cadastralRef, taxRef  │  │ emergencyName/phone  │  │ status, documentUrl     │
│ createdAt, updatedAt  │  │ createdAt, updatedAt │  │ irlRefValue, irlQuarter │
│                      │  │                      │  │ revisionDate            │
│ ───────────────────────  │ ─────────────────────  │  │ createdAt, updatedAt    │
│ RELATIONS:            │  │ RELATIONS:           │  │ ──────────────────────  │
│ leases[],             │  │ leases[],            │  │ RELATIONS:             │
│ maintenanceTickets[], │  │ accessTokens[],      │  │ 1:1→guarantor          │
│ expenses[]            │  │ maintenanceTickets[] │  │ 1:N→transactions       │
│ units[]               │  │                      │  │ 1:N→reminders          │
└──────────────────────┘  └─────────────────────┘  └─────────────────────────┘
         │
         │ (for multi-unit buildings — future v2)
         ▼
┌──────────────────────┐
│         UNIT          │
│ ────────────────────  │
│ id, propertyId        │
│ name, floor           │
│ unitNumber            │
│ surface, rooms        │
│ type, status           │
│ createdAt, updatedAt  │
│ ──────────────────────  │
│ RELATIONS:             │
│ leases[] (optional FK) │
└──────────────────────┘

┌──────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│    TRANSACTION       │  │      GUARANTOR       │  │       DOCUMENT          │
│ ────────────────────  │  │ ───────────────────  │  │ ──────────────────────  │
│ id, userId, leaseId   │  │ id, leaseId (1:1)   │  │ id, userId             │
│ amount,              │  │ type: PERSON|COMPANY│  │ type, fileName         │
│ rentPortion,         │  │ firstName, lastName │  │ fileUrl, mimeType       │
│ chargesPortion,      │  │ companyName, siren  │  │ extractedData (JSON)   │
│ periodStart/End,     │  │ email, phone        │  │ extractionStatus       │
│ dueDate, paidAt,      │  │ address (full)      │  │ createdAt              │
│ paymentMethod,       │  │ status, documents[] │  │                        │
│ status,              │  │ createdAt           │  │                        │
│ receiptUrl,          │  │                     │  │                        │
│ receiptNumber         │  │                     │  │                        │
│ bankMatchedAt        │  │                     │  │                        │
│ createdAt            │  │                     │  │                        │
└──────────────────────┘  └─────────────────────┘  └─────────────────────────┘

┌──────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│  MAINTENANCE_TICKET  │  │      EXPENSE         │  │    BANK_CONNECTION      │
│ ────────────────────  │  │ ───────────────────  │  │ ──────────────────────  │
│ id, tenantId,         │  │ id, userId           │  │ id, userId              │
│ propertyId,           │  │ propertyId,          │  │ provider, providerId    │
│ title, description,   │  │ vendorName,         │  │ bankName, status        │
│ status, priority,    │  │ amount, category,    │  │ lastSyncAt              │
│ createdAt             │  │ date, invoiceUrl     │  │ accessToken (enc)       │
│                       │  │ createdAt            │  │ createdAt              │
└──────────────────────┘  └─────────────────────┘  └─────────────────────────┘

┌──────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│       REMINDER        │  │    NOTIFICATION     │  │        AUDIT_LOG        │
│ ────────────────────  │  │ ───────────────────  │  │ ──────────────────────  │
│ id, userId            │  │ id, userId           │  │ id, userId              │
│ leaseId?, propertyId? │  │ tenantId?           │  │ entityType, entityId    │
│ type, title,          │  │ type, title, body   │  │ action, changes (JSON) │
│ dueDate,              │  │ data (JSON)         │  │ ipAddress, userAgent   │
│ isRecurring,          │  │ read, readAt        │  │ createdAt              │
│ status, priority      │  │ createdAt           │  │                        │
└──────────────────────┘  └─────────────────────┘  └─────────────────────────┘

┌──────────────────────┐  ┌─────────────────────┐
│  BANK_WEBHOOK_EVENT  │  │  STRIPE_WEBHOOK_EVENT│
│ ────────────────────  │  │ ───────────────────  │
│ id, connectionId      │  │ id                   │
│ eventType            │  │ stripeEventId (uniq) │
│ payload (JSON)       │  │ eventType             │
│ processedAt          │  │ processedAt          │
│ createdAt            │  │ createdAt            │
└──────────────────────┘  └─────────────────────┘
```

### 2.2 Key Indexes (Performance-Critical)

```prisma
// All list queries MUST be indexed
Property:        @@index([userId])
Tenant:         @@index([userId])
Lease:          @@index([userId, status])
Lease:          @@index([propertyId])
Lease:          @@index([tenantId])
Transaction:    @@index([userId, status, dueDate])
Transaction:    @@index([leaseId])
Reminder:       @@index([userId, status, dueDate])
Notification:   @@index([userId, read, createdAt])
AuditLog:       @@index([entityType, entityId])
AuditLog:       @@index([userId, createdAt])
TenantAccessToken: @@index([token])
Session:        @@index([token])
```

### 2.3 Decimal Fields (Money Precision)

**All monetary fields use `Decimal(10,2)`** — no Float anywhere. JavaScript-side: use `decimal.js` for server-side arithmetic; use `toNumber()` for display only. Never do `amount + amount` with floats.

```prisma
// Lease
rentAmount      Decimal @db.Decimal(10,2)
chargesAmount   Decimal @db.Decimal(10,2)
depositAmount   Decimal @db.Decimal(10,2)

// Transaction
amount          Decimal @db.Decimal(10,2)
rentPortion     Decimal @db.Decimal(10,2)
chargesPortion  Decimal @db.Decimal(10,2)

// Expense
amount          Decimal @db.Decimal(10,2)
```

---

## 3. API Architecture

### 3.1 REST Endpoints (V1)

All routes live under `/src/app/api/`. Auth: `Better Auth` session via `auth.api.getSession()`.

```
BASE: /api

PROPERTIES
  GET    /properties          → list (paginated, userId scoped)
  POST   /properties          → create (Zod validated)
  GET    /properties/:id      → get single (with leases, units, counts)
  PATCH  /properties/:id      → update (Zod validated)
  DELETE /properties/:id      → archive (soft delete)

TENANTS
  GET    /tenants             → list (paginated)
  POST   /tenants             → create
  GET    /tenants/:id         → get single (with lease, transactions)
  PATCH  /tenants/:id         → update
  DELETE /tenants/:id         → archive

LEASES
  GET    /leases              → list (filter by status, propertyId, tenantId)
  POST   /leases              → create (triggers bail PDF generation)
  GET    /leases/:id          → get single (property, tenant, transactions, guarantor)
  PATCH  /leases/:id          → update (status changes, financial terms)
  POST   /leases/:id/revision → generate IRL revision letter PDF

TRANSACTIONS
  GET    /transactions        → list (filter by status, leaseId, date range)
  POST   /transactions        → create (link to lease)
  GET    /transactions/:id    → get single
  PATCH  /transactions/:id    → update (mark as paid → triggers quittance PDF)
  GET    /transactions/:id/receipt → download quittance PDF

MAINTENANCE
  GET    /maintenance         → list for landlord dashboard
  PATCH  /maintenance/:id     → update status (landlord)

TENANT PORTAL (magic link auth)
  GET    /portal/validate/:token → validate token, return tenant context
  GET    /portal/lease        → current lease details
  GET    /portal/quittances    → payment receipts
  POST   /portal/maintenance  → submit maintenance request
  POST   /portal/documents    → upload documents

WEBHOOKS
  POST   /webhooks/stripe     → Stripe subscription events
  POST   /webhooks/bank       → Bridge/Powens bank events

HEALTH
  GET    /health              → (no auth) — DB ping + app version
```

### 3.2 Response Format

```typescript
// Success
{ "data": T, "pagination": { page, limit, total, pages } }

// Error
{ "error": "Message string", "details": ZodError? }
```

All error messages in French. HTTP status codes: 200 (ok), 201 (created), 400 (bad input), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server error).

### 3.3 Pagination

```typescript
// All list endpoints
GET /api/resource?page=1&limit=50

Response: {
  data: Resource[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number  // Math.ceil(total / limit)
  }
}
```

### 3.4 Authentication & Authorization

**Session-based auth** (Better Auth):
- Landlord: email + password (credentials provider)
- Landlord: Google OAuth
- Tenant: magic link (`/portal/{token}` → validates `TenantAccessToken`)

**Authorization middleware** (applied to all `/api/*` routes):
```typescript
const session = await auth.api.getSession({ headers: request.headers });
if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

All queries scoped to `session.user.id`. No data leakage between users possible.

### 3.5 Role-Based Access

| Role | Scope |
|---|---|
| Landlord (User) | Own data: properties, tenants, leases, transactions |
| Tenant (via magic link) | Own lease, own quittances, own maintenance requests |
| Admin (future) | Organization-level access |

---

## 4. Security

### 4.1 Input Validation
- All API inputs validated with Zod schemas before DB operations
- File extensions sanitized — no `.exe`, `.sh`, `.bat`, `.cmd`
- Maximum string lengths enforced (DoS prevention)
- Email format validated, phone validated

### 4.2 SQL Injection Prevention
- Prisma ORM: parameterized queries throughout (no raw SQL)
- No string concatenation in Prisma `where` clauses

### 4.3 Rate Limiting
```typescript
// /api/portal/* routes: 10 req/min per token (brute force protection)
// /api/transactions POST: 30 req/min per user
// /api/webhooks/*: exempt (Stripe/Bridge signatures validate authenticity)
```

### 4.4 CORS
- Production: only `https://rent-ready.fr` and `https://www.rent-ready.fr`
- Dev: `localhost:3000`
- Tenant portal: specific subdomain pattern `tenant.rent-ready.fr`

### 4.5 Webhook Security
- Stripe: signature verification via `stripe.webhooks.constructEvent()`
- Bridge/Powens: webhook signature header validation before processing

### 4.6 File Upload Security
- Files stored in MinIO/S3 (not in DB or filesystem)
- Pre-signed URLs for tenant document access (time-limited)
- MIME type validation on upload
- Max file size: 10MB

---

## 5. File Storage Strategy

### 5.1 Storage Layout (MinIO/S3)

```
rent-ready-bucket/
├── landlords/{userId}/
│   ├── leases/{leaseId}/
│   │   └── bail-{leaseId}-{timestamp}.pdf
│   ├── quittances/{transactionId}/
│   │   └── quittance-{transactionId}-{timestamp}.pdf
│   ├── documents/{documentId}/
│   │   └── {filename}
│   └── avatars/{userId}.{ext}
└── tenants/{tenantId}/
    ├── documents/{documentId}/
    └── receipts/{transactionId}/
```

### 5.2 Document Lifecycle

| Document | TTL | Access |
|---|---|---|
| Bail PDF | Indefinite | Landlord only (pre-signed URL 15min) |
| Quittance PDF | Indefinite | Landlord + Tenant (pre-signed URL 15min) |
| Tenant ID docs | Lease duration + 1 year | Landlord only |
| Maintenance photos | 2 years | Landlord + Tenant |

---

## 6. Infrastructure

### 6.1 Environments

```
Development:    localhost:3000 (docker-compose full stack)
Staging:       staging.rent-ready.fr (Docker, mirrors prod config)
Production:    rent-ready.fr (Vercel + managed services)
```

### 6.2 Docker Stack

```yaml
# docker-compose.yml services
postgres:    PostgreSQL 16 + pgbouncer (connection pooling)
redis:       Redis 7 (sessions, cache, rate limit counters)
minio:       MinIO (S3-compatible object storage)
app:         Next.js standalone (port 3000)
```

### 6.3 CI/CD Pipeline (GitHub Actions)

```
On PR:  lint → typecheck → unit tests → build
On master: lint → typecheck → unit tests → build → push Docker image → deploy staging
On release tag: build prod Docker image → deploy production
```

### 6.4 Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...        # pgbouncer URL (5433)
BETTER_AUTH_SECRET=...              # 32+ char random string
NEXT_PUBLIC_APP_URL=https://...
NEXT_PUBLIC_APP_ENV=production

# Optional (for full feature activation)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
OPENAI_API_KEY=sk-...
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
SENTRY_AUTH_TOKEN=...

# Sentry (client-side, exposed)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/project
```

---

## 7. Key Dependencies (V1)

```json
{
  "dependencies": {
    "next": "15.5.9",
    "react": "^19.0.0",
    "typescript": "^5.0.0",

    "better-auth": "1.5.6",
    "@prisma/client": "^7.0.0",
    "prisma": "^7.0.0",

    "@react-pdf/renderer": "^4.0.0",
    "stripe": "^17.0.0",
    "@ai-sdk/openai": "^0.0.0",
    "ai": "^4.0.0",
    "resend": "^4.0.0",

    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "react-hook-form": "^7.54.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "lucide-react": "^0.460.0",
    "date-fns": "^4.1.0",
    "recharts": "^2.14.0",
    "framer-motion": "^11.11.0",
    "@sentry/nextjs": "^8.0.0",

    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",

    "decimal.js": "^10.4.3"
  }
}
```

### 7.1 Dev Dependencies

```json
{
  "devDependencies": {
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.0.0"
  }
}
```

---

## 8. API Design Conventions

### 8.1 Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { someSchema } from "@/lib/validations/some";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse pagination
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    // Query
    const [data, total] = await Promise.all([
      prisma.resource.findMany({ where: { userId: session.user.id }, skip, take: limit }),
      prisma.resource.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/resource error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
```

### 8.2 Server Action Pattern

```typescript
// src/lib/actions/some-action.tsx
"use server";

import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createResource(formData: SomeFormData) {
  const session = await auth.api.getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = someSchema.safeParse(formData);
  if (!parsed.success) throw new Error(parsed.error.message);

  const result = await prisma.resource.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/resource-list");
  return result;
}
```

### 8.3 Error Handling

```typescript
// All errors return French messages
{ error: "Bien introuvable" }           // 404
{ error: "Données invalides" }          // 400 with Zod details
{ error: "Non autorisé" }               // 401
{ error: "Erreur interne" }             // 500
```

---

## 9. Authentication Flow (Magic Link)

```
1. Landlord invites tenant → sends email with magic link
   Link: https://rent-ready.fr/portal/{TenantAccessToken.token}

2. Tenant clicks link → /app/portal/[token]/page.tsx validates token
   → GET /api/portal/validate/{token}

3. Token valid → session established (read-only, tenant-scoped)
   Token consumed (deleted or marked used)

4. Tenant can now: view lease, see quittances, submit maintenance

5. Token expires after 7 days or when used
```

---

## 10. Document Generation (Quittances)

```
1. Landlord marks transaction as PAID via MarkPaidButton
   → transaction-actions.ts: markTransactionPaid(txId, paymentDate)

2. After DB update, generateQuittance(txId) is called
   → calls quittance-pdf-server.ts renderQuittancePdf(tx)
   → uploads PDF to S3/MinIO
   → stores receiptUrl on Transaction

3. QuittanceButton on billing page
   → If receiptUrl exists: direct download
   → If not: generate on-demand (POST /api/transactions/:id/receipt)

4. PDF contains (Factur-X compliant):
   - Landlord name/address (User fields)
   - Tenant name/address (Tenant fields)
   - Property address
   - Period (periodStart → periodEnd)
   - Rent amount, charges, total
   - Payment date
   - Unique receipt number (format: RENT-YYYYMM-XXXX)
   - QR code linking to digital verification
```

---

## 11. AI Features Architecture

### 11.1 Feature Toggles

```typescript
// All AI features gated — not in MVP v1, activate in v2
const AI_FEATURES_ENABLED = process.env.NEXT_PUBLIC_AI_FEATURES_ENABLED === "true";
```

### 11.2 AI Pipelines

| Feature | Input | Output | Route |
|---|---|---|---|
| Lease analyzer | Lease + document URL | Key clauses, anomalies, risks | POST /api/ai/analyze-lease |
| Rent follow-up drafts | Tenant, overdue transactions | Email draft (French) | POST /api/ai/rent-followup |
| Maintenance summarization | Ticket description | Category, urgency, estimated cost | POST /api/ai/summarize-maintenance |
| Owner monthly summary | Property/portfolio ID, month | Revenue/expense breakdown, NOI | POST /api/ai/owner-summary |

---

## 12. Testing Strategy

### 12.1 Unit Tests (Vitest)

```typescript
// Test structure
src/__tests__/
├── lib/
│   ├── irl-calculator.test.ts      // IRL index calculations
│   ├── quittance-generator.test.ts // PDF data generation
│   └── validations.test.ts         // Zod schema edge cases
├── api/
│   └── [resource].test.ts         // API route handlers (mock DB)
```

### 12.2 Coverage Targets
- Validation schemas: 100% (Zod tests)
- IRL calculator: 100% (all trimester/year combos)
- API routes: key happy paths + error cases
- Quittance generator: data mapping correctness

---

## 13. Monitoring & Observability

### 13.1 Sentry Integration

```typescript
// Client (browser)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,        // 10% in prod
  replaysSessionSampleRate: 0.05,
});

// Server (API routes)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.05,       // 5% — API can be high volume
  maxBreadcrumbs: 50,
});
```

### 13.2 Health Endpoint

```typescript
// GET /api/health — no auth
{
  status: "ok",
  version: process.env.NEXT_PUBLIC_APP_VERSION,
  db: "connected" | "error",
  timestamp: new Date().toISOString()
}
```

### 13.3 Structured Logging

All API routes use `console.error` for unexpected errors. Production errors go to Sentry with full stack traces. No PII logged (emails, names excluded from error context).

---

## 14. Performance Budgets

| Metric | Target |
|---|---|
| LCP (Landing) | < 2.5s |
| LCP (Dashboard) | < 1.5s |
| CLS | < 0.1 |
| TTFB | < 200ms (edge) |
| API p95 response | < 300ms |
| DB query p95 | < 50ms |
| PDF generation | < 3s |

### 14.1 Optimizations

- RSC by default (zero client JS for read-heavy pages)
- Route handlers: pagination prevents unbounded queries
- Prisma `include` chaining kept minimal (N+1 avoided)
- Images: `next/image` with WebP + lazy loading
- Font: `next/font` with `display: swap`
- CSS: Tailwind v4 (no runtime CSS-in-JS)

---

## 15. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-06 | Next.js App Router over NestJS | Single codebase. SEO critical. Faster to ship. |
| 2026-04-06 | Better Auth over Clerk/Auth0 | Session-based (not JWT). Magic links for tenants. No per-seat cost. |
| 2026-04-06 | Prisma over raw SQL/Drizzle | Type-safe query builder. Migration tooling. Team familiarity. |
| 2026-04-06 | `@react-pdf/renderer` over external service | No per-document cost. French Factur-X compliant. Self-hosted. |
| 2026-04-07 | Decimal over Float for money | Precision. French accounting requirements. |
| 2026-04-12 | Sentry added | Error tracking critical for production. Source maps auto-upload. |
| 2026-04-12 | MinIO (dev) → S3 (prod) | S3-compatible. Easy migration. MinIO for local dev. |

---

## 16. Out of Scope for V1

- Multi-tenant organizations (Organization model exists but not wired)
- Unit model (schema ready, not activated in UI)
- Open Banking (Bridge/Powens integration — webhooks stubbed)
- Stripe Connect (marketplace)
- Mobile apps
- White-labeling
- AI features (hooks exist, feature flags added)

---

*Blueprint approved — all V1 engineering work should reference this document.*
*Next action: Backend Engineer picks up REN-83 using this as architecture guide.*