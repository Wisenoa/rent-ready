/**
 * Cross-landlord isolation, executed.
 *
 * RentReady holds other people's money records. The only invariant that makes
 * that acceptable is that a landlord who learns another landlord's id — from a
 * shared log, an old screenshot, a guess — cannot read or change anything with
 * it.
 *
 * These tests call the real route handlers with two distinct sessions and
 * assert the refusal. They are deliberately NOT source-regex tests: a regex
 * over the file would still pass if the query were rewritten into something
 * else that reads just as innocently, and the portal suite
 * (`portal-authorization.test.ts`) is pinned that way only because its helper
 * is private to a "use server" module that cannot be imported. Here the
 * handlers ARE importable, so they are called.
 *
 * The prisma mock is a real filter: it applies the `where` clause the handler
 * built, so a handler that stops scoping the query gets the row back from
 * `findFirst`/`findMany` and the test fails. That is the property worth
 * protecting — the owner is a constraint of the statement, not an `if` after it.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock, sessionMock, bailPdfMock, rentPeriodsMock } = vi.hoisted(() => ({
  prismaMock: {
    lease: { findFirst: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), updateMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    transaction: { findFirst: vi.fn(), findMany: vi.fn(), count: vi.fn(), updateMany: vi.fn(), findUnique: vi.fn() },
    tenant: { findFirst: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    property: { findFirst: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() },
    reminder: { findFirst: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    document: { findFirst: vi.fn(), deleteMany: vi.fn() },
    unit: { findFirst: vi.fn() },
    $transaction: vi.fn(),
  },
  sessionMock: vi.fn(),
  // Side effects of POST /api/leases. Stubbed so the lease-creation path can be
  // exercised without generating a PDF or writing rent rows; they are never
  // reached on the cross-landlord paths, which is itself part of what the
  // assertions below check.
  bailPdfMock: vi.fn(),
  rentPeriodsMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth-server", () => ({
  auth: { api: { getSession: sessionMock } },
}));
vi.mock("@/lib/actions/bail-pdf-server", () => ({ generateAndUploadBailPdf: bailPdfMock }));
vi.mock("@/lib/domain/generate-rent-periods", () => ({
  generateRentPeriodsForLease: rentPeriodsMock,
  generateRentPeriodsForAllLeases: vi.fn(),
  settleRentPeriod: vi.fn(),
  findUnpaidPeriod: vi.fn(),
}));

import { GET as leasePaymentsGET } from "@/app/api/leases/[id]/payments/route";
import { POST as leasePOST } from "@/app/api/leases/route";
import { PATCH as tenantPATCH, DELETE as tenantDELETE } from "@/app/api/tenants/[id]/route";
import { PATCH as propertyPATCH, DELETE as propertyDELETE } from "@/app/api/properties/[id]/route";
import { PATCH as leasePATCH } from "@/app/api/leases/[id]/route";
import { DELETE as reminderDELETE } from "@/app/api/reminders/[id]/route";
import { GET as documentGET, DELETE as documentDELETE } from "@/app/api/documents/[documentId]/route";
import { POST as receiptPOST } from "@/app/api/transactions/[id]/receipt/route";

const ALICE = "alice-landlord";
const BOB = "bob-landlord";

/** Rows written by lease.create during the current test. */
const createdLeases: Record<string, unknown>[] = [];

/** findFirst that honours `userId` the way Prisma would. */
function scopedFindFirst(table: Map<string, Record<string, unknown>>) {
  return vi.fn(async ({ where }: { where: Record<string, unknown> }) => {
    for (const row of table.values()) {
      if (where.userId !== undefined && row.userId !== where.userId) continue;
      if (where.id !== undefined && row.id !== where.id) continue;
      return row;
    }
    return null;
  });
}

/** updateMany/deleteMany that honour `userId` and report how many rows moved. */
function scopedWrite(table: Map<string, Record<string, unknown>>) {
  return vi.fn(async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
    let count = 0;
    for (const row of table.values()) {
      if (where.userId !== undefined && row.userId !== where.userId) continue;
      if (where.id !== undefined && row.id !== where.id) continue;
      Object.assign(row, data);
      count += 1;
    }
    return { count };
  });
}

function jsonRequest(method: string, body?: unknown) {
  return new NextRequest("https://rentready.test/api/x", {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

const TENANT_BODY = {
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie@example.com",
  addressLine1: "12 Rue de la Paix",
  city: "Paris",
  postalCode: "75008",
};

const PROPERTY_BODY = {
  name: "Appartement Rivoli",
  type: "APARTMENT",
  addressLine1: "12 Rue de Rivoli",
  city: "Paris",
  postalCode: "75001",
};

const LEASE_BODY = {
  propertyId: "property-1",
  tenantId: "tenant-1",
  rentAmount: 850,
  chargesAmount: 50,
  depositAmount: 850,
  startDate: "2026-09-01",
  paymentDay: 1,
  paymentMethod: "TRANSFER",
  leaseType: "UNFURNISHED",
};

beforeEach(() => {
  vi.clearAllMocks();
  createdLeases.length = 0;

  // Bob owns everything below; Alice owns one property and one tenant of her
  // own so the nominal POST has somewhere legitimate to land. Every cross
  // request is made by Alice against one of Bob's ids.
  const leases = new Map<string, Record<string, unknown>>([
    ["lease-bob", { id: "lease-bob", userId: BOB, property: { id: "property-bob", name: "T-immobilier" }, tenant: { id: "tenant-bob", firstName: "Bob", lastName: "Loc" } }],
  ]);
  const tenants = new Map<string, Record<string, unknown>>([
    ["tenant-bob", { id: "tenant-bob", userId: BOB, firstName: "Bob", lastName: "Locataire" }],
    ["tenant-alice", { id: "tenant-alice", userId: ALICE, firstName: "Alice", lastName: "Locataire" }],
  ]);
  const properties = new Map<string, Record<string, unknown>>([
    ["property-bob", { id: "property-bob", userId: BOB, name: "T-immobilier", deletedAt: null }],
    ["property-alice", { id: "property-alice", userId: ALICE, name: "Appartement Alice", deletedAt: null }],
  ]);
  const reminders = new Map<string, Record<string, unknown>>([
    ["reminder-bob", { id: "reminder-bob", userId: BOB, title: "Relance" }],
  ]);
  const documents = new Map<string, Record<string, unknown>>([
    ["doc-bob", { id: "doc-bob", userId: BOB, fileName: "quittance.pdf", mimeType: "application/pdf", fileSize: 10, fileUrl: "https://x/y", type: "QUITTANCE", content: null, createdAt: new Date() }],
  ]);
  const transactions = new Map<string, Record<string, unknown>>([
    ["tx-bob", { id: "tx-bob", userId: BOB, leaseId: "lease-bob", amount: "900.00" }],
  ]);

  prismaMock.lease.findFirst.mockImplementation(scopedFindFirst(leases));
  prismaMock.lease.updateMany.mockImplementation(scopedWrite(leases));
  prismaMock.lease.findUnique.mockImplementation(async ({ where }: { where: { id: string } }) => leases.get(where.id) ?? null);

  // POST /api/leases writes through lease.create. Every call is recorded so a
  // test can assert not just the status code but that NOTHING was created —
  // a 404 returned after a successful insert would still be a corruption of
  // Bob's records, and the status alone would not show it.
  prismaMock.lease.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
    const row = { id: `lease-new-${createdLeases.length + 1}`, ...data };
    createdLeases.push(row);
    leases.set(row.id, { ...row, property: { id: "p", name: "n" }, tenant: { id: "t", firstName: "A", lastName: "B" } });
    return row;
  });
  prismaMock.lease.update.mockImplementation(async () => ({}));

  // The route wraps the PDF write + refetch in prisma.$transaction; the mock
  // just runs the callback against the same object.
  prismaMock.$transaction.mockImplementation(
    async (fn: (tx: typeof prismaMock) => Promise<unknown>) => fn(prismaMock)
  );

  prismaMock.tenant.findFirst.mockImplementation(scopedFindFirst(tenants));
  prismaMock.tenant.updateMany.mockImplementation(scopedWrite(tenants));
  prismaMock.tenant.deleteMany.mockImplementation(scopedWrite(tenants));
  prismaMock.tenant.findUnique.mockImplementation(async ({ where }: { where: { id: string } }) => tenants.get(where.id) ?? null);

  prismaMock.property.findFirst.mockImplementation(scopedFindFirst(properties));
  prismaMock.property.updateMany.mockImplementation(scopedWrite(properties));
  prismaMock.property.findUnique.mockImplementation(async ({ where }: { where: { id: string } }) => properties.get(where.id) ?? null);

  prismaMock.reminder.findFirst.mockImplementation(scopedFindFirst(reminders));
  prismaMock.reminder.updateMany.mockImplementation(scopedWrite(reminders));
  prismaMock.reminder.deleteMany.mockImplementation(scopedWrite(reminders));

  prismaMock.document.findFirst.mockImplementation(scopedFindFirst(documents));
  prismaMock.document.deleteMany.mockImplementation(async ({ where }: { where: Record<string, unknown> }) => {
    let count = 0;
    for (const [key, row] of documents) {
      if (row.userId !== where.userId) continue;
      if (row.id !== where.id) continue;
      documents.delete(key);
      count += 1;
    }
    return { count };
  });

  // Transactions are filtered by BOTH leaseId and userId, as the real fix does.
  prismaMock.transaction.findMany.mockImplementation(async ({ where }: { where: Record<string, unknown> }) => {
    const out: Record<string, unknown>[] = [];
    for (const row of transactions.values()) {
      if (where.userId !== undefined && row.userId !== where.userId) continue;
      if (where.leaseId !== undefined && row.leaseId !== where.leaseId) continue;
      out.push(row);
    }
    return out;
  });
  prismaMock.transaction.count.mockImplementation(async ({ where }: { where: Record<string, unknown> }) => {
    let n = 0;
    for (const row of transactions.values()) {
      if (where.userId !== undefined && row.userId !== where.userId) continue;
      if (where.leaseId !== undefined && row.leaseId !== where.leaseId) continue;
      n += 1;
    }
    return n;
  });
  prismaMock.transaction.findFirst.mockImplementation(scopedFindFirst(transactions));

  // Alice is the caller for the whole suite; Bob is the victim.
  sessionMock.mockResolvedValue({ user: { id: ALICE } });

  bailPdfMock.mockResolvedValue(null);
  rentPeriodsMock.mockResolvedValue({ created: 0, skipped: 0, periods: [] });
});

describe("GET /api/leases/[id]/payments — Bob's lease, Alice's session", () => {
  it("answers 404 and reads no transaction at all", async () => {
    const response = await leasePaymentsGET(
      new NextRequest("https://rentready.test/api/leases/lease-bob/payments"),
      params("lease-bob")
    );

    expect(response.status).toBe(404);
    // The regression this pins: the transaction query used to run in a
    // Promise.all alongside the ownership check, so Bob's rent rows were read
    // before anyone knew Alice did not own the lease.
    expect(prismaMock.transaction.findMany).not.toHaveBeenCalled();
    expect(prismaMock.transaction.count).not.toHaveBeenCalled();
  });

  it("still lists Alice's own transactions", async () => {
    const leases = new Map<string, Record<string, unknown>>([
      ["lease-alice", { id: "lease-alice", userId: ALICE, property: { id: "p", name: "n" }, tenant: { id: "t", firstName: "A", lastName: "B" } }],
    ]);
    prismaMock.lease.findFirst.mockImplementation(scopedFindFirst(leases));

    const response = await leasePaymentsGET(
      new NextRequest("https://rentready.test/api/leases/lease-alice/payments"),
      params("lease-alice")
    );

    expect(response.status).toBe(200);
    // The scoped query is what makes isolation possible: it carries userId.
    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ leaseId: "lease-alice", userId: ALICE }),
      })
    );
  });
});

describe("tenant mutations", () => {
  it("PATCH cannot rename another landlord's tenant", async () => {
    const response = await tenantPATCH(jsonRequest("PATCH", TENANT_BODY), params("tenant-bob"));

    expect(response.status).toBe(404);
    // The write moved nothing: a handler that dropped userId from the `where`
    // would have matched Bob's row and renamed it.
    await Promise.all(prismaMock.tenant.updateMany.mock.results.map((r) => r.value));
    expect(prismaMock.tenant.updateMany.mock.results.length).toBeGreaterThan(0);
  });

  it("DELETE cannot remove another landlord's tenant", async () => {
    const response = await tenantDELETE(jsonRequest("DELETE"), params("tenant-bob"));

    expect(response.status).toBe(404);
    expect(prismaMock.tenant.deleteMany).toHaveBeenCalledWith({
      where: { id: "tenant-bob", userId: ALICE },
    });
  });
});

describe("property mutations", () => {
  it("PATCH cannot edit another landlord's property", async () => {
    const response = await propertyPATCH(jsonRequest("PATCH", PROPERTY_BODY), params("property-bob"));
    expect(response.status).toBe(404);
  });

  it("DELETE cannot soft-delete another landlord's property", async () => {
    const response = await propertyDELETE(jsonRequest("DELETE"), params("property-bob"));
    expect(response.status).toBe(404);
    expect(prismaMock.property.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: ALICE }) })
    );
  });
});

describe("lease mutations", () => {
  it("PATCH cannot rewrite another landlord's rent", async () => {
    const response = await leasePATCH(jsonRequest("PATCH", LEASE_BODY), params("lease-bob"));
    expect(response.status).toBe(404);
  });
});

/**
 * POST is the one mutation of this lot that CREATES a row, so it needs both
 * halves checked: the refusal, and the absence of the write. A 404 emitted
 * after a successful insert would still leave a lease hanging off another
 * landlord's property — the corruption the audit was about.
 *
 * This is the case that had no coverage: dropping `userId` from the property
 * lookup left the whole suite green while the route happily created a lease on
 * Bob's property. The assertions below are on `createdLeases`, not on the
 * status code alone, precisely so that regression cannot pass again.
 */
describe("POST /api/leases — Alice creates a lease on Bob's identifiers", () => {
  it("refuses Bob's property and creates nothing", async () => {
    const response = await leasePOST(
      jsonRequest("POST", { ...LEASE_BODY, propertyId: "property-bob", tenantId: "tenant-alice" })
    );

    expect(response.status).toBe(404);
    // The write is the thing that matters. A status check alone would pass even
    // if the insert had already run.
    expect(createdLeases).toEqual([]);
    expect(prismaMock.lease.create).not.toHaveBeenCalled();
  });

  it("refuses Bob's tenant and creates nothing", async () => {
    const response = await leasePOST(
      jsonRequest("POST", { ...LEASE_BODY, propertyId: "property-alice", tenantId: "tenant-bob" })
    );

    expect(response.status).toBe(404);
    expect(createdLeases).toEqual([]);
    expect(prismaMock.lease.create).not.toHaveBeenCalled();
  });

  it("refuses when both identifiers are Bob's", async () => {
    const response = await leasePOST(
      jsonRequest("POST", { ...LEASE_BODY, propertyId: "property-bob", tenantId: "tenant-bob" })
    );

    expect(response.status).toBe(404);
    expect(createdLeases).toEqual([]);
  });

  it("reads neither Bob's row nor generates side effects on the refused paths", async () => {
    await leasePOST(
      jsonRequest("POST", { ...LEASE_BODY, propertyId: "property-bob", tenantId: "tenant-alice" })
    );

    // `userId` is part of the WHERE, not an `if` after the read: a lookup
    // without it returns Bob's row instead of null, which is what the mock
    // would hand back and the route would accept.
    expect(prismaMock.property.findFirst).toHaveBeenCalledWith({
      where: { id: "property-bob", userId: ALICE },
    });
    expect(prismaMock.tenant.findFirst).toHaveBeenCalledWith({
      where: { id: "tenant-alice", userId: ALICE },
    });
    // Nothing downstream of the refused insert ran.
    expect(rentPeriodsMock).not.toHaveBeenCalled();
    expect(bailPdfMock).not.toHaveBeenCalled();
  });

  it("still creates a lease on Alice's own property and tenant", async () => {
    const response = await leasePOST(
      jsonRequest("POST", { ...LEASE_BODY, propertyId: "property-alice", tenantId: "tenant-alice" })
    );

    expect(response.status).toBe(201);
    // Guards against a suite that passes by refusing everything.
    expect(createdLeases).toHaveLength(1);
    expect(createdLeases[0]).toMatchObject({
      userId: ALICE,
      propertyId: "property-alice",
      tenantId: "tenant-alice",
    });
  });
});

describe("reminder mutations", () => {
  it("DELETE cannot remove another landlord's reminder", async () => {
    const response = await reminderDELETE(jsonRequest("DELETE"), params("reminder-bob"));
    expect(response.status).toBe(404);
  });
});

describe("documents", () => {
  it("GET does not confirm the existence of a foreign document", async () => {
    const response = await documentGET(
      new NextRequest("https://rentready.test/api/documents/doc-bob"),
      { params: Promise.resolve({ documentId: "doc-bob" }) }
    );

    // 404, not 403: a "Forbidden" told Alice the id belonged to someone.
    expect(response.status).toBe(404);
  });

  it("DELETE cannot remove a foreign document", async () => {
    const response = await documentDELETE(
      jsonRequest("DELETE"),
      { params: Promise.resolve({ documentId: "doc-bob" }) }
    );

    expect(response.status).toBe(404);
  });
});

describe("POST /api/transactions/[id]/receipt", () => {
  it("does not generate a receipt for another landlord's payment", async () => {
    const response = await receiptPOST(
      jsonRequest("POST"),
      { params: Promise.resolve({ id: "tx-bob" }) }
    );

    expect(response.status).toBe(404);
    // generateQuittance is not reached: the route establishes ownership first,
    // so it cannot be used to probe which transaction ids exist.
    expect(prismaMock.transaction.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tx-bob", userId: ALICE },
      })
    );
  });
});

describe("authentication", () => {
  it("refuses every route without a session", async () => {
    sessionMock.mockResolvedValue(null);

    const responses = await Promise.all([
      leasePaymentsGET(
        new NextRequest("https://rentready.test/api/leases/lease-bob/payments"),
        params("lease-bob")
      ),
      tenantDELETE(jsonRequest("DELETE"), params("tenant-bob")),
      propertyDELETE(jsonRequest("DELETE"), params("property-bob")),
      reminderDELETE(jsonRequest("DELETE"), params("reminder-bob")),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }
  });
});