# Rent-Ready — Database Schema Design

**Issue:** REN-49
**Author:** CTO
**Date:** 2026-04-07
**Status:** Final

---

## 1. Executive Summary

The existing Prisma schema covers ~85% of the required data model. This document: (a) validates the existing design, (b) identifies missing models, (c) proposes complete entity-relationship diagram, (d) defines index strategy, and (e) outlines the migration approach.

**Net new models to add:**
- `Organization` — multi-tenant workspace support
- `Unit` — multi-unit building hierarchy
- `Guarantor` — French rental guarantee
- `Reminder` — deadline and notification system
- `Notification` — user-facing notifications
- `AuditLog` — compliance-grade audit trail

---

## 2. Existing Schema Validation

The current schema (490 lines) is well-designed. Key strengths:

- French market fields (IRL revision, `chargesAmount`, deposit, lease types) ✅
- Open banking prep (`BankConnection`, `BankWebhookEvent`) ✅
- Stripe idempotency (`StripeWebhookEvent`) ✅
- Tenant magic link auth (`TenantAccessToken`) ✅
- AI document extraction pipeline (`Document` + `extractedData`) ✅
- Maintenance ticket workflow ✅
- Expense tracking with categories ✅

**Issues identified:**
1. No `Organization` model — all access is userId-based (no team/multi-user)
2. No `Unit` model — multi-unit buildings can't be represented hierarchically
3. No `Guarantor` — critical for French rentals
4. No `Reminder` system — lease renewals, rent deadlines unmanaged
5. `Float` used for money fields — precision risk
6. `Transaction.receiptNumber` is nullable but should be required for paid receipts

---

## 3. Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ORGANIZATION (NEW)                                                            │
│ ──────────────────────────────────────────────────────────────────────────── │
│ id, name, slug, plan, subscriptionStatus, stripeOrgId, createdAt            │
│                                                                            │
│ 1:N ──► OrganizationMember: userId, role, joinedAt                          │
│ 1:N ──► Property (via userId in MVP; orgId in v2+)                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────────┐
│      USER        │       │   ORGANIZATION       │
│ ─────────────── │       │ ────────────────────  │
│ id               │──┐    │ id                   │
│ email            │  │    │ name                 │
│ emailVerified    │  │    │ slug                 │
│ name             │  │    │ stripeOrgId          │
│ firstName        │  │    │ plan                 │
│ lastName         │  │    │ subscriptionStatus   │
│ phone            │  └───►│ createdAt, updatedAt │
│ addressLine1     │       └──────────────────────┘
│ city             │                  │
│ postalCode       │                  │ 1:N (future)
│ country          │                  ▼
│ stripeCustomerId │         ┌──────────────────────┐
│ stripeSubscriptionId       │ ORGANIZATION_MEMBER │
│ subscriptionStatus│         │ ───────────────────  │
│ trialEndsAt      │         │ id                  │
│ createdAt        │         │ organizationId      │
│ updatedAt        │         │ userId              │
└──────────────────┘         │ role: OWNER|ADMIN| │
        │                    │       MEMBER|VIEWER │
        │                    │ joinedAt            │
        │                    └──────────────────────┘
        │ 1:N
        │ (Properties owned by user)
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                         PROPERTY                                 │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, name, type, addressLine1, city, postalCode, country   │
│ surface, rooms, description, cadastralRef, taxRef                │
│ createdAt, updatedAt                                             │
│                                                                   │
│ 1:N ──► UNIT (NEW — for multi-unit/immeuble)                    │
│ 1:N ──► LEASE                                                   │
│ 1:N ──► MAINTENANCE_TICKET                                      │
│ 1:N ──► EXPENSE                                                 │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 1:N (if multi-unit building)
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                           UNIT (NEW)                             │
│ ────────────────────────────────────────────────────────────────  │
│ id, propertyId (parent building), name, floor, unitNumber       │
│ surface, rooms, type (APARTMENT|ROOM|STUDIO|PARKING|COMMERCIAL)│
│ status: VACANT|RENTED|DRAFT, createdAt, updatedAt               │
│                                                                   │
│ 1:N ──► LEASE (active lease for this unit)                      │
│ 1:N ──► MAINTENANCE_TICKET                                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          TENANT                                   │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId (owner), firstName, lastName, email, phone            │
│ addressLine1, city, postalCode, country, dateOfBirth             │
│ placeOfBirth, emergencyName, emergencyPhone                      │
│ createdAt, updatedAt                                             │
│                                                                   │
│ 1:N ──► LEASE                                                   │
│ 1:N ──► TENANT_ACCESS_TOKEN (magic link)                         │
│ 1:N ──► MAINTENANCE_TICKET                                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      GUARANTOR (NEW)                             │
│ ────────────────────────────────────────────────────────────────  │
│ id, leaseId                                                      │
│ type: PERSON|COMPANY                                             │
│ firstName, lastName (person) OR companyName, siren (company)      │
│ email, phone, addressLine1, city, postalCode, country           │
│ financialDocuments: Json (URLs to uploaded docs)                │
│ status: PENDING|APPROVED|REJECTED                                │
│ createdAt, updatedAt                                             │
└──────────────────────────────────────────────────────────────────┘
          │
          │ 1:1
          ▼
┌──────────────────────────────────────────────────────────────────┐
│                          LEASE                                   │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, propertyId, tenantId                                 │
│ rentAmount💰, chargesAmount💰, depositAmount💰                    │
│ startDate, endDate                                               │
│ irlReferenceValue, irlReferenceQuarter, revisionDate            │
│ paymentDay, paymentMethod, leaseType, status                    │
│ documentUrl, createdAt, updatedAt                                │
│                                                                   │
│ 1:1 ──► GUARANTOR                                               │
│ 1:N ──► TRANSACTION                                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       TRANSACTION                                │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, leaseId                                              │
│ amount💰, rentPortion💰, chargesPortion💰                        │
│ periodStart, periodEnd, dueDate, paidAt                          │
│ paymentMethod, status, isFullPayment                            │
│ receiptType, receiptUrl, receiptNumber (required when paid)      │
│ bankTransactionId, bankMatchedAt, bankRawData                    │
│ notes, createdAt, updatedAt                                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         DOCUMENT                                 │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, type, fileName, fileUrl, mimeType, fileSize         │
│ extractedData, extractionStatus, extractionError                 │
│ createdAt, updatedAt                                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     MAINTENANCE_TICKET                           │
│ ────────────────────────────────────────────────────────────────  │
│ id, tenantId, propertyId                                         │
│ title, description, status, priority, resolvedAt                  │
│ createdAt, updatedAt                                             │
│                                                                   │
│ 1:N ──► MAINTENANCE_ATTACHMENT                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        EXPENSE                                   │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, propertyId, vendorName, description                  │
│ amount💰, category, date, invoiceUrl, aiExtracted                 │
│ createdAt, updatedAt                                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       BANK_CONNECTION                            │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, provider, providerUserId, providerItemId             │
│ bankName, status, lastSyncAt, consentExpiresAt                   │
│ accessToken, refreshToken                                         │
│ createdAt, updatedAt                                             │
│                                                                   │
│ 1:N ──► BANK_WEBHOOK_EVENT                                       │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       REMINDER (NEW)                             │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, leaseId?, propertyId?, tenantId?                     │
│ type: RENT_DUE|LEASE_RENEWAL|DEPOSIT_RETURN|                    │
│        TAX_DEADLINE|CONDO_FEE|CUSTOM                            │
│ title, description, dueDate, completedAt, snoozedUntil           │
│ isRecurring, recurringInterval (days), nextDueDate               │
│ priority, status: PENDING|COMPLETED|SNOOZED|CANCELLED           │
│ createdAt, updatedAt                                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      NOTIFICATION (NEW)                          │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId, tenantId?                                            │
│ type: RENT_REMINDER|PAYMENT_CONFIRMED|MAINTENANCE_UPDATE|        │
│        LEASE_EXPIRING|DOCUMENT_READY|MESSAGE                     │
│ title, body, data: Json (metadata), readAt, read               │
│ createdAt                                                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       AUDIT_LOG (NEW)                            │
│ ────────────────────────────────────────────────────────────────  │
│ id, userId                                                       │
│ entityType, entityId                                             │
│ action: CREATE|UPDATE|DELETE                                     │
│ changes: Json { field, old, new }[]                             │
│ ipAddress, userAgent                                            │
│ createdAt                                                        │
│                                                                   │
│ @@index([entityType, entityId])                                  │
│ @@index([userId, createdAt])                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. New Models — Detailed Design

### 4.1 Organization

**Why:** Current schema is single-user. Real landlords often have property managers, spouses, or assistants. An Organization model enables team access with role-based permissions.

```prisma
model Organization {
  id                 String    @id @default(cuid())
  name               String
  slug               String    @unique
  plan               Plan      @default(FREE)
  stripeOrgId        String?   @unique
  subscriptionStatus SubscriptionStatus @default(TRIAL)
  trialEndsAt        DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  members OrganizationMember[]
}

model OrganizationMember {
  id             String           @id @default(cuid())
  organizationId String
  userId         String
  role           OrgRole          @default(VIEWER)
  joinedAt       DateTime         @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@index([userId])
}

enum OrgRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum Plan {
  FREE
  STARTER
  PRO
  AGENCY
}
```

### 4.2 Unit

**Why:** French landlords often own buildings (`immeuble`) with multiple apartments (`lots`). A separate `Unit` model enables: tracking occupancy per unit, generating quittances per unit, and maintaining unit-specific maintenance history. The existing `Property` model becomes the "building" entity, and `Unit` becomes the rentable lot.

```prisma
model Unit {
  id          String    @id @default(cuid())
  propertyId  String    // parent building
  name        String    // "Appartement 3e étage gauche"
  floor       Int?
  unitNumber  String?   // "A", "3B", " RDC"
  surface     Float?    // m²
  rooms       Int?
  type        PropertyType @default(APARTMENT)
  status      UnitStatus @default(VACANT)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  property           Property            @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  leases             Lease[]
  maintenanceTickets MaintenanceTicket[]

  @@index([propertyId])
  @@index([status])
}

enum UnitStatus {
  VACANT
  RENTED
  DRAFT
}
```

**Migration strategy:** Existing `Property` records continue to work as-is (no `parentId`). New multi-unit properties can be created by adding a `Property` (the building) + multiple `Unit` records. All existing leases link directly to `Property` — we add an optional `unitId` to `Lease` for new multi-unit leases.

### 4.3 Guarantor

**Why:** French law (`Loi ALUR`) often requires guarantors for tenants without sufficient income. A Guarantor model supports both natural persons and legal entities (companies).

```prisma
model Guarantor {
  id              String         @id @default(cuid())
  leaseId         String         @unique
  type            GuarantorType
  // Person fields
  firstName       String?
  lastName        String?
  dateOfBirth     DateTime?
  placeOfBirth    String?
  // Company fields
  companyName     String?
  siren           String?
  // Common fields
  email           String
  phone           String?
  addressLine1    String
  addressLine2   String?
  city            String
  postalCode      String
  country         String         @default("France")
  // Financial documents (IDs of Document records)
  financialDocumentIds String[] // Document IDs
  status          GuarantorStatus @default(PENDING)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  lease           Lease          @relation(fields: [leaseId], references: [id], onDelete: Cascade)

  @@index([leaseId])
}

enum GuarantorType {
  PERSON
  COMPANY
}

enum GuarantorStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### 4.4 Reminder

**Why:** Landlords must track deadlines: rent due dates, lease renewal windows (3 months before expiry by law in France), deposit returns (within 2 months of handover), tax deadlines, etc.

```prisma
model Reminder {
  id               String         @id @default(cuid())
  userId           String
  // Optional entity links
  leaseId          String?
  propertyId       String?
  tenantId         String?
  // Content
  type             ReminderType
  title            String
  description      String?
  // Scheduling
  dueDate          DateTime
  completedAt      DateTime?
  snoozedUntil     DateTime?
  isRecurring      Boolean        @default(false)
  recurringInterval Int?          // days between occurrences
  nextDueDate      DateTime?      // computed next occurrence
  // Meta
  priority         ReminderPriority @default(MEDIUM)
  status           ReminderStatus @default(PENDING)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, status, dueDate])
  @@index([userId, type])
  @@index([leaseId])
  @@index([propertyId])
}

enum ReminderType {
  RENT_DUE
  LEASE_RENEWAL
  DEPOSIT_RETURN
  TAX_DEADLINE
  CONDO_FEE
  MAINTENANCE_DUE
  CUSTOM
}

enum ReminderStatus {
  PENDING
  COMPLETED
  SNOOZED
  CANCELLED
}

enum ReminderPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### 4.5 Notification

**Why:** In-app and email notifications for tenants and landlords. Separated from Reminder (which is system-scheduled) because Notification is user-facing event-driven.

```prisma
model Notification {
  id       String           @id @default(cuid())
  userId   String
  tenantId String?         // tenant who receives this (vs landlord)
  type     NotificationType
  title    String
  body     String
  data     Json?            // arbitrary metadata { leaseId, ticketId, etc. }
  read     Boolean          @default(false)
  readAt   DateTime?
  createdAt DateTime        @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, read, createdAt])
  @@index([tenantId])
}

enum NotificationType {
  RENT_REMINDER
  PAYMENT_CONFIRMED
  PAYMENT_LATE
  MAINTENANCE_UPDATE
  LEASE_EXPIRING
  DOCUMENT_READY
  MESSAGE
  SYSTEM
}
```

### 4.6 AuditLog

**Why:** French landlords handle sensitive financial data. An audit log provides compliance trail for: lease modifications, payment status changes, document access, user permission changes.

```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  entityType  String   // "Lease", "Transaction", "User", etc.
  entityId    String
  action      AuditAction
  changes     Json?    // [{field, oldValue, newValue}, ...]
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([entityType, entityId])
  @@index([userId, createdAt])
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
}
```

---

## 5. Index Strategy

### 5.1 Existing Indexes (verified ✅)
- `Session`: `[userId]`, `[token]`
- `Account`: `[userId]`
- `Property`: `[userId]`
- `Tenant`: `[userId]`
- `TenantAccessToken`: `[token]`, `[tenantId]`
- `Lease`: `[userId]`, `[propertyId]`, `[tenantId]`
- `Transaction`: `[userId]`, `[leaseId]`, `[status]`, `[dueDate]`, `[bankTransactionId]`
- `Document`: `[userId]`, `[type]`
- `BankConnection`: `[userId]`, `[provider, providerItemId]` (unique)
- `BankWebhookEvent`: `[connectionId]`, `[eventType]`, `[createdAt]`
- `StripeWebhookEvent`: `[eventType]`, `[processedAt]`
- `IrlIndex`: `[year, trimester]`
- `MaintenanceTicket`: `[tenantId]`, `[propertyId]`, `[status]`
- `MaintenanceAttachment`: `[ticketId]`
- `Expense`: `[userId]`, `[propertyId]`, `[category]`

### 5.2 New Indexes to Add

```prisma
// Organization
// (handled by @unique on slug)

// OrganizationMember
// @@unique([organizationId, userId]) — already in model
// @@index([userId]) — already in model

// Unit
@@index([propertyId])     // find all units in a building
@@index([status])         // find vacant/rented units quickly

// Guarantor
@@index([leaseId])        // find guarantor for a lease

// Reminder
@@index([userId, status, dueDate])  // dashboard reminders panel
@@index([userId, type])              // filter by type
@@index([leaseId])                   // reminders tied to a lease

// Notification
@@index([userId, read, createdAt])  // notification center
@@index([tenantId])                  // tenant notifications

// AuditLog
@@index([entityType, entityId])     // audit trail lookup
@@index([userId, createdAt])         // user activity log
```

---

## 6. Decimal Fields — Critical Fix

**Issue:** All money fields use `Float`. Floating-point arithmetic causes precision errors (e.g., `0.1 + 0.2 !== 0.3`).

**Fix:** Change all `Float` money fields to `Decimal` with Prisma-level precision, and handle conversion at the application boundary.

```prisma
// Before (risky)
rentAmount      Float
chargesAmount   Float
depositAmount   Float
amount          Float
rentPortion     Float
chargesPortion  Float

// After (safe)
rentAmount      Decimal @db.Decimal(10, 2)   // up to 10 digits, 2 after decimal
chargesAmount   Decimal @db.Decimal(10, 2)
depositAmount   Decimal @db.Decimal(10, 2)
amount          Decimal @db.Decimal(10, 2)
rentPortion     Decimal @db.Decimal(10, 2)
chargesPortion  Decimal @db.Decimal(10, 2)
```

Note: PostgreSQL `Decimal` is exact decimal arithmetic. In JS, use `number` for display (via `toNumber()`) and never do arithmetic on raw floats — always use a library like `decimal.js` for server-side calculations.

---

## 7. Migration Approach

### Phase 1: Non-Breaking Additions (Zero Downtime)

**Migration 1:** Add new tables only — no column changes to existing tables.

```sql
-- Migration 1: Add Organization, OrganizationMember, Unit, Guarantor, Reminder, Notification, AuditLog
-- Run via: npx prisma migrate dev --name add_organization_unit_guarantor_reminder

-- Organization table
CREATE TABLE "Organization" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'FREE',
  "stripeOrgId" TEXT,
  "subscriptionStatus" TEXT NOT NULL DEFAULT 'TRIAL',
  "trialEndsAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Organization_slug_key" UNIQUE ("slug"),
  CONSTRAINT "Organization_stripeOrgId_key" UNIQUE ("stripeOrgId")
);

CREATE TABLE "OrganizationMember" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'VIEWER',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationMember_organizationId_userId_key" UNIQUE ("organizationId", "userId")
);

CREATE TABLE "Unit" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "propertyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "floor" INTEGER,
  "unitNumber" TEXT,
  "surface" DOUBLE PRECISION,
  "rooms" INTEGER,
  "type" TEXT NOT NULL DEFAULT 'APARTMENT',
  "status" TEXT NOT NULL DEFAULT 'VACANT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Guarantor" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "leaseId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "dateOfBirth" TIMESTAMP(3),
  "placeOfBirth" TEXT,
  "companyName" TEXT,
  "siren" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'France',
  "financialDocumentIds" TEXT[],
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Guarantor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Guarantor_leaseId_key" UNIQUE ("leaseId")
);

CREATE TABLE "Reminder" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "userId" TEXT NOT NULL,
  "leaseId" TEXT,
  "propertyId" TEXT,
  "tenantId" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "snoozedUntil" TIMESTAMP(3),
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  "recurringInterval" INTEGER,
  "nextDueDate" TIMESTAMP(3),
  "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "userId" TEXT NOT NULL,
  "tenantId" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "data" JSONB,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL DEFAULT cuid(),
  "userId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "changes" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- Add FK constraints
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");
CREATE INDEX "Unit_propertyId_idx" ON "Unit"("propertyId");
CREATE INDEX "Unit_status_idx" ON "Unit"("status");
CREATE INDEX "Guarantor_leaseId_idx" ON "Guarantor"("leaseId");
CREATE INDEX "Reminder_userId_status_dueDate_idx" ON "Reminder"("userId", "status", "dueDate");
CREATE INDEX "Reminder_userId_type_idx" ON "Reminder"("userId", "type");
CREATE INDEX "Reminder_leaseId_idx" ON "Reminder"("leaseId");
CREATE INDEX "Reminder_propertyId_idx" ON "Reminder"("propertyId");
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");
CREATE INDEX "Notification_tenantId_idx" ON "Notification"("tenantId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
```

### Phase 2: Float → Decimal Migration (requires care)

```sql
-- Migration 2: Convert money Float columns to Decimal
-- Run during low-traffic window, with app in read-only mode
-- This is safe because Decimal is backward-compatible with numeric input

ALTER TABLE "Lease" ALTER COLUMN "rentAmount" TYPE DECIMAL(10,2) USING "rentAmount"::DECIMAL(10,2);
ALTER TABLE "Lease" ALTER COLUMN "chargesAmount" TYPE DECIMAL(10,2) USING "chargesAmount"::DECIMAL(10,2);
ALTER TABLE "Lease" ALTER COLUMN "depositAmount" TYPE DECIMAL(10,2) USING "depositAmount"::DECIMAL(10,2);
ALTER TABLE "Transaction" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::DECIMAL(10,2);
ALTER TABLE "Transaction" ALTER COLUMN "rentPortion" TYPE DECIMAL(10,2) USING "rentPortion"::DECIMAL(10,2);
ALTER TABLE "Transaction" ALTER COLUMN "chargesPortion" TYPE DECIMAL(10,2) USING "chargesPortion"::DECIMAL(10,2);
ALTER TABLE "Expense" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::DECIMAL(10,2);
ALTER TABLE "Property" ALTER COLUMN "surface" TYPE DECIMAL(10,2) USING "surface"::DECIMAL(10,2);
```

### Phase 3: Lease — Add Optional unitId (non-breaking)

```sql
-- Migration 3: Add unitId to Lease for multi-unit support
ALTER TABLE "Lease" ADD COLUMN "unitId" TEXT;
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL;
CREATE INDEX "Lease_unitId_idx" ON "Lease"("unitId");
```

---

## 8. Prisma Schema Changes Summary

The complete updated schema is in `prisma/schema.prisma`. New additions:

```diff
+ model Organization { ... }
+ model OrganizationMember { ... }
+ model Unit { ... }
+ model Guarantor { ... }
+ model Reminder { ... }
+ model Notification { ... }
+ model AuditLog { ... }

+ enum OrgRole { OWNER ADMIN MEMBER VIEWER }
+ enum Plan { FREE STARTER PRO AGENCY }
+ enum UnitStatus { VACANT RENTED DRAFT }
+ enum GuarantorType { PERSON COMPANY }
+ enum GuarantorStatus { PENDING APPROVED REJECTED }
+ enum ReminderType { RENT_DUE LEASE_RENEWAL DEPOSIT_RETURN TAX_DEADLINE CONDO_FEE MAINTENANCE_DUE CUSTOM }
+ enum ReminderStatus { PENDING COMPLETED SNOOZED CANCELLED }
+ enum ReminderPriority { LOW MEDIUM HIGH URGENT }
+ enum NotificationType { RENT_REMINDER PAYMENT_CONFIRMED PAYMENT_LATE MAINTENANCE_UPDATE LEASE_EXPIRING DOCUMENT_READY MESSAGE SYSTEM }
+ enum AuditAction { CREATE UPDATE DELETE LOGIN LOGOUT }

# Float → Decimal (existing fields)
- rentAmount      Float   // Lease
- chargesAmount   Float   // Lease
- depositAmount   Float   // Lease
- amount          Float   // Transaction
- rentPortion     Float   // Transaction
- chargesPortion  Float   // Transaction
- amount          Float   // Expense
+ rentAmount      Decimal @db.Decimal(10,2)
+ chargesAmount   Decimal @db.Decimal(10,2)
+ depositAmount   Decimal @db.Decimal(10,2)
+ amount          Decimal @db.Decimal(10,2)
+ rentPortion     Decimal @db.Decimal(10,2)
+ chargesPortion  Decimal @db.Decimal(10,2)
+ amount          Decimal @db.Decimal(10,2)

# Lease — add optional unitId
+ unitId          String?  // FK → Unit
```

---

## 9. Data Model for AI Enrichment (Opportunity)

The `extractedData Json` field on `Document` enables an AI pipeline:

| Document Type | AI Extraction | Fields Extracted |
|---|---|---|
| `LEASE_SCAN` | Lease clauses, dates, rent, deposit | `Loyer`, `charges`, `dépôt`, `date d'entrée`, `clause de révision` |
| Receipt/Quittance | Payment details | `montant`, `période`, `locataire`, `propriétaire` |
| Invoice/Expense | Vendor, amount, category | `fournisseur`, `montant`, `catégorie`, `TVA` |
| ID Document | Tenant/Guarantor identity | `nom`, `adresse`, `date de naissance` |

**Reminder system AI hooks:**
- `remindRentDue()` → scheduled 3 days before payment day
- `suggestLeaseRenewal()` → triggered 3 months before lease end (French law requirement)
- `trackDepositReturn()` → deadline = handover date + 2 months

---

## 10. Summary of Changes

| # | Change | Type | Risk | Priority |
|---|---|---|---|---|
| 1 | Add Organization, OrganizationMember | New tables | Low | High |
| 2 | Add Unit model | New table | Low | High |
| 3 | Add Guarantor model | New table | Low | High |
| 4 | Add Reminder model | New table | Low | High |
| 5 | Add Notification model | New table | Low | Medium |
| 6 | Add AuditLog model | New table | Low | Medium |
| 7 | Float → Decimal for all money fields | Migration | Medium | High |
| 8 | Add unitId to Lease | Schema change | Low | Medium |

**Estimated migration time:** 30-45 minutes (non-breaking additions + single migration run)
**Downtime risk:** Phase 1 (new tables) — zero downtime. Phase 2 (Decimal) — minimal, can be done in low-traffic window.
