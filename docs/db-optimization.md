# Database Query Optimization — REN-1109

**Date:** 2026-05-21
**Auditor:** Backend Engineer
**Status:** Complete

---

## Scope

API endpoints audited:
- `GET /api/leases` — list leases with property/tenant/guarantor refs
- `GET /api/tenants` — list tenants with lease count and active lease
- `GET /api/transactions` — list transactions with lease+property+tenant refs
- `GET /api/properties` — list properties with lease/unit counts and active lease

---

## Findings

### ✅ Already Optimized

**1. Lease listing (`GET /api/leases`)**
- N+1 fix already applied: transactions are batch-fetched in a single query using `leaseId IN (...)`
- All FK indexes exist: `propertyId`, `tenantId`, `unitId` on Lease
- Composite `(userId, status)` used for dashboard/unpaid queries
- Pagination implemented (take/skip)
- `include` uses selective `select` (not whole records)

**2. Transaction indexes**
- Composite indexes exist for the key query patterns:
  - `(userId, status, paidAt)` — collection dashboard
  - `(userId, status, dueDate)` — overdue detection
  - `(userId, leaseId, dueDate)` — lease payment history
- All FKs indexed: `leaseId`, `userId`

### ⚠️ Issues Found & Fixed

**Issue 1 — Missing Tenant indexes for listing query**

Tenant listing query filters by `userId` and `archived`, but the schema only had:
```
@@index([userId])
@@index([archived])
```

Missing composite `(userId, archived)` for the exact filter pattern used in `GET /api/tenants`. Added.

**Issue 2 — Missing Property soft-delete composite index**

Property listing filters by `userId` AND `deletedAt`, but schema only had:
```
@@index([userId, deletedAt])   ← only covers (userId, deletedAt)
```

This composite already exists. No change needed.

**Issue 3 — Transaction listing: tenant join not indexed for covering**

`GET /api/transactions` joins through `lease.tenant` but tenantId is not indexed at the Transaction level. However, the join goes `transaction → lease → tenant` where Transaction has `@@index([leaseId])` which is sufficient for the nested include. No change needed.

**Issue 4 — Guarantor FK on Lease**

Guarantor is linked via `guarantorId` on Lease but there is no explicit `guarantorId` column/index. The `Guarantor` model links back to Lease via `leaseId`. Prisma follows the back-relation. No extra index needed.

### 📋 Indexes Added

```prisma
// Tenant model — composite (userId, archived) added
@@index([userId, archived])
```

---

## Performance Recommendations (No Code Change Required)

These are noted for future reference if performance issues emerge at scale:

### 1. Covering Index for Tenant Listing
If tenant listing is slow at high page numbers, a covering index would help:
```sql
CREATE INDEX tenant_user_covering ON "Tenant" (user_id, archived, created_at)
INCLUDE (id, "firstName", "lastName", email);
```

### 2. Transaction Date Range Queries
The composite `(userId, status, dueDate)` is good, but if date-range-only queries without status filtering become common:
```sql
CREATE INDEX transaction_due_covering ON "Transaction" (user_id, due_date)
INCLUDE (id, amount, status);
```

### 3. EXPLAIN ANALYZE Script
When staging/prod data is available, run:
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT ... FROM "Lease" WHERE "userId" = $1 AND status = 'ACTIVE';
```
Look for: Seq Scan (bad), Bitmap Index Scan (good), Bitmap Heap Scan (ok).

### 4. Connection Pool Monitoring
The app uses pgbouncer (`?pgbouncer=true`). Monitor:
- `SHOW POOLS` — active/idle/wait clients
- `pgbouncer.waiting` metric — indicates connection saturation

### 5. Query Comments for APM
Consider adding Prisma query comments for APM tracing:
```typescript
prisma.$queryRaw`/* lease listing for dashboard */ SELECT ...`
```

---

## Schema Changes Applied

**File:** `prisma/schema.prisma`

**Tenant model** — added composite index:
```prisma
@@index([userId, archived])
```

All other indexes verified as present and correct for the current query patterns.

---

## Verification

Run after applying migration:
```bash
cd /home/ubuntu/rent-ready
npx prisma migrate dev --name add_tenant_composite_index
npx prisma migrate deploy
```

Then verify indexes exist:
```sql
SELECT indexname FROM pg_indexes
WHERE tablename IN ('Lease', 'Tenant', 'Transaction', 'Property');
```

---

## Summary

| Endpoint | N+1 Risk | Index Coverage | Pagination | Status |
|---|---|---|---|---|
| GET /api/leases | ✅ Fixed | ✅ Full | ✅ | Good |
| GET /api/tenants | ✅ Single query | ⚠️ Missing composite | ✅ | Fixed |
| GET /api/transactions | ✅ Nested include | ✅ Full | ✅ | Good |
| GET /api/properties | ✅ Sub-query | ✅ Full | ✅ | Good |
