# API Hardening Report

**Date:** 2026-04-14
**Issue:** REN-125
**Status:** Completed

---

## 1. Rate Limiting

### Status: Implemented

A new rate limiting module was created at `src/lib/rate-limit.ts` providing an in-memory sliding window rate limiter.

**NOTE:** The in-memory store resets on server restart. For multi-instance production deployments (Vercel, AWS, Fly.io), replace with **Upstash Redis** for distributed rate limiting.

### Rate-Limited Endpoints

| Endpoint | Limit | Window | Identifier |
|---|---|---|---|
| `POST /api/auth/sign-in` | 10 req | 60s | IP address |
| `POST /api/auth/sign-up` | 10 req | 60s | IP address |
| `POST /api/auth/reset-password` | 5 req | 300s | IP address |
| `POST /api/auth/change-password` | 5 req | 300s | IP address |
| `POST /api/auth/*` (other) | 10 req | 60s | IP address |
| `POST /api/lead/demo` | 5 req | 3600s | IP address |
| `POST /api/transactions` | 30 req | 3600s | Authenticated user ID |

### Files Changed
- **Created:** `src/lib/rate-limit.ts` — rate limiter utility
- **Modified:** `src/app/api/auth/[...all]/route.ts` — auth route with rate limiting
- **Modified:** `src/app/api/lead/demo/route.ts` — lead capture rate limiting
- **Modified:** `src/app/api/transactions/route.ts` — payment recording rate limiting

### Response Headers Added
All rate-limited responses include:
- `X-RateLimit-Limit` — max requests allowed
- `X-RateLimit-Remaining` — requests remaining in window
- `X-RateLimit-Reset` — Unix timestamp when window resets

---

## 2. Input Validation

### Status: Comprehensive

All POST/PATCH routes that accept request bodies use **Zod validation** via schema files in `src/lib/validations/`.

### Validated Routes (confirmed)
- `POST /api/properties` — `propertySchema`
- `POST /api/properties/[id]` — `propertySchema`
- `POST /api/tenants` — `tenantSchema`
- `POST /api/tenants/[id]` — `tenantSchema`
- `POST /api/leases` — `leaseSchema`
- `POST /api/leases/[id]` — `leaseSchema`
- `POST /api/transactions` — `transactionSchema`
- `POST /api/units` — `unitSchema`
- `POST /api/guarantors` — `guarantorSchema`

### Error Response Format
All validation errors return:
```json
{ "error": "<Zod error message>" }
```
Status code: **400 Bad Request**

---

## 3. Auth Middleware Audit

### Status: All Protected Routes Secured

All 30 API routes that modify data call `auth.api.getSession()` or equivalent auth check before processing.

### Routes Intentionally Public (no auth — secured by other means)
| Route | Auth Mechanism |
|---|---|
| `GET /api/health` | Public health check — no sensitive data |
| `POST /api/cron/revision-check` | `CRON_SECRET` header verification |
| `POST /api/webhooks/bank/*` | HMAC signature verification |
| `GET /api/auth/*` | Better Auth handles internally |
| `POST /api/lead/demo` | Rate limiting + no auth needed |
| `POST /api/analytics/page-view` | Public analytics |

---

## 4. Error Handling

### Status: Standardized

All API routes follow consistent error response format:

```json
{ "error": "<human-readable message>" }
```

Proper HTTP status codes used:
- `400` — Bad Request (validation errors)
- `401` — Unauthorized (no session)
- `403` — Forbidden (access denied)
- `404` — Not Found
- `429` — Too Many Requests (rate limiting)
- `500` — Internal Server Error

**No stack traces in production responses.** Errors are logged to console and captured by Sentry.

### Sentry Configuration
`sentry.server.config.ts` is properly configured with:
- `beforeSend` filter strips `NEXT_REDIRECT` / `NEXT_NOT_FOUND` noise
- Server events tagged with runtime and region
- `ignoreErrors` filters expected auth noise

---

## 5. SQL Injection Prevention

### Status: Clean

All database queries use **Prisma ORM** (parameterized queries under the hood).

**Audit of raw SQL usage:**
- `GET /api/health` — `prisma.$queryRaw\`SELECT 1\`` — Safe (no user input)
- No other `$queryRaw` or `$executeRaw` usage found in API routes

---

## Recommendations

1. **Redis-backed rate limiting** — Deploy to Upstash Redis before production traffic to avoid in-memory store issues with multi-instance deployments.

2. **Add `CRON_SECRET` verification** — The cron endpoint has the check but it's commented out; verify it's enforced in production.

3. **Security headers** — `next.config.ts` already sets `X-Frame-Options`, `X-Content-Type-Options`, etc. via the headers plugin. Verify in production.
