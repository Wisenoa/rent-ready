/**
 * Cross-landlord isolation against the REAL database.
 *
 * The mock suite (authorization-isolation.test.ts) proves the handlers build a
 * scoped query. This proves the query means what it says when Prisma — not a
 * stub — applies it: two real users, a real lease and a real rent row owned by
 * Bob, and Alice's session on top of them.
 *
 * Only the session is mocked. Prisma is real, so a handler that forgot to scope
 * a query would return Bob's actual row and this suite would fail.
 *
 * What this catches vs. the mock suite: this one asserts the OUTCOME (Alice
 * gets a refusal, and Bob's row is untouched by a delete attempt). Removing the
 * ownership check makes it fail. The mock suite asserts the SHAPE of the query,
 * and so also fails when `userId` is merely dropped from an already-gated read —
 * a change that is safe today but leaves the next reader no protection. Both
 * are wanted: the first catches real leaks, the second pins the mechanism.
 *
 * Skips (rather than fails) when DATABASE_URL is unset, so `pnpm test` stays
 * green on a machine without the database running.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const ALICE = `authz-alice-${SUFFIX}`;
const BOB = `authz-bob-${SUFFIX}`;
const SESSION_USER_ID = ALICE;

vi.mock("@/lib/auth-server", () => ({
  auth: { api: { getSession: async () => ({ user: { id: SESSION_USER_ID } }) } },
}));

describeDb("cross-landlord isolation, real rows", () => {
  const suffix = SUFFIX;
  const bobId = BOB;

  let prisma: typeof import("@/lib/prisma").prisma;
  let leasePaymentsGET: typeof import("@/app/api/leases/[id]/payments/route").GET;
  let leasePOST: typeof import("@/app/api/leases/route").POST;
  let tenantDELETE: typeof import("@/app/api/tenants/[id]/route").DELETE;
  let documentGET: typeof import("@/app/api/documents/[documentId]/route").GET;
  let NextRequest: typeof import("next/server").NextRequest;

  let leaseBobsId = "";
  let tenantBobsId = "";
  let documentBobsId = "";
  let propertyBobsId = "";
  let propertyAlicesId = "";
  let tenantAlicesId = "";

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    ({ NextRequest } = await import("next/server"));
    leasePaymentsGET = (await import("@/app/api/leases/[id]/payments/route")).GET;
    leasePOST = (await import("@/app/api/leases/route")).POST;
    tenantDELETE = (await import("@/app/api/tenants/[id]/route")).DELETE;
    documentGET = (await import("@/app/api/documents/[documentId]/route")).GET;

    await prisma.user.createMany({
      data: [
        { id: ALICE, email: `authz-alice-${suffix}@test.local`, name: "Alice", firstName: "Alice", lastName: "L", addressLine1: "1 rue A", city: "Paris", postalCode: "75001" },
        { id: BOB, email: `authz-bob-${suffix}@test.local`, name: "Bob", firstName: "Bob", lastName: "L", addressLine1: "2 rue B", city: "Lyon", postalCode: "69001" },
      ],
    });

    const property = await prisma.property.create({
      data: {
        userId: bobId,
        name: "Bien de Bob",
        type: "APARTMENT",
        addressLine1: "2 rue B",
        city: "Lyon",
        postalCode: "69001",
      },
    });
    propertyBobsId = property.id;

    const tenant = await prisma.tenant.create({
      data: {
        userId: bobId,
        firstName: "Locataire",
        lastName: "De Bob",
        email: `locataire-${suffix}@test.local`,
        addressLine1: "3 rue C",
        city: "Lyon",
        postalCode: "69001",
      },
    });
    tenantBobsId = tenant.id;

    // Alice needs her own property and tenant so the two refusals can be
    // tested one identifier at a time (Bob's property alone, Bob's tenant
    // alone) rather than only as an all-or-nothing pair.
    const aliceProperty = await prisma.property.create({
      data: {
        userId: SESSION_USER_ID,
        name: "Bien de Alice",
        type: "APARTMENT",
        addressLine1: "1 rue A",
        city: "Paris",
        postalCode: "75001",
      },
    });
    propertyAlicesId = aliceProperty.id;

    const aliceTenant = await prisma.tenant.create({
      data: {
        userId: SESSION_USER_ID,
        firstName: "Alice",
        lastName: "L",
        email: `alice-locataire-${suffix}@test.local`,
        addressLine1: "4 rue D",
        city: "Paris",
        postalCode: "75001",
      },
    });
    tenantAlicesId = aliceTenant.id;

    const lease = await prisma.lease.create({
      data: {
        userId: bobId,
        propertyId: property.id,
        tenantId: tenant.id,
        rentAmount: "850.00",
        chargesAmount: "50.00",
        depositAmount: "850.00",
        startDate: new Date("2026-01-01"),
        paymentDay: 1,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    leaseBobsId = lease.id;

    // The real rent row Alice must never see.
    await prisma.transaction.create({
      data: {
        userId: bobId,
        leaseId: lease.id,
        amount: "900.00",
        rentPortion: "850.00",
        chargesPortion: "50.00",
        periodStart: new Date("2026-01-01"),
        periodEnd: new Date("2026-01-31"),
        dueDate: new Date("2026-01-01"),
        status: "PENDING",
        paymentMethod: "TRANSFER",
      },
    });

    const doc = await prisma.document.create({
      data: {
        userId: bobId,
        type: "QUITTANCE_PDF",
        fileName: "quittance-bob.pdf",
        mimeType: "application/pdf",
        fileSize: 3,
        fileUrl: "https://example.invalid/x.pdf",
      },
    });
    documentBobsId = doc.id;
  });

  afterAll(async () => {
    if (!prisma) return;
    // Any lease that a failed isolation check let through would be cleaned up
    // here; if a leak happens these deletes are what remove the evidence, so
    // the assertions below run first.
    await prisma.transaction.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.document.deleteMany({ where: { id: documentBobsId } });
    await prisma.lease.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.tenant.deleteMany({ where: { id: { in: [tenantBobsId, tenantAlicesId] } } });
    await prisma.property.deleteMany({ where: { id: { in: [propertyBobsId, propertyAlicesId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [ALICE, BOB] } } });
    await prisma.$disconnect();
  });

  it("answers 404 for Bob's lease and returns none of his rent rows", async () => {
    const response = await leasePaymentsGET(
      new NextRequest(`https://rentready.test/api/leases/${leaseBobsId}/payments`),
      { params: Promise.resolve({ id: leaseBobsId }) }
    );

    expect(response.status).toBe(404);
    const body = (await response.json()) as { data?: unknown[] };
    expect(body.data ?? []).toEqual([]);
  });

  it("the row really exists — the 404 above is isolation, not a missing fixture", async () => {
    const rows = await prisma.transaction.findMany({ where: { leaseId: leaseBobsId } });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]?.userId).toBe(BOB);
  });

  it("cannot delete Bob's tenant", async () => {
    const response = await tenantDELETE(
      new NextRequest(`https://rentready.test/api/tenants/${tenantBobsId}`, { method: "DELETE" }),
      { params: Promise.resolve({ id: tenantBobsId }) }
    );

    expect(response.status).toBe(404);
    expect(await prisma.tenant.findUnique({ where: { id: tenantBobsId } })).not.toBeNull();
  });

  it("does not confirm a foreign document exists", async () => {
    const response = await documentGET(
      new NextRequest(`https://rentready.test/api/documents/${documentBobsId}`),
      { params: Promise.resolve({ documentId: documentBobsId }) }
    );

    expect(response.status).toBe(404);
  });

  /**
   * POST is the only handler here that CREATES a row, so a refusal is not
   * enough: the assertion that matters is that no lease ends up hanging off
   * Bob's property. Dropping `userId` from the property lookup turns this into
   * HTTP 201 with a real row written against another landlord's records —
   * executed against this database, not asserted from a mock.
   */
  const leasePayload = (propertyId: string, tenantId: string) => ({
    propertyId,
    tenantId,
    rentAmount: 850,
    chargesAmount: 50,
    depositAmount: 850,
    startDate: "2026-01-01",
    paymentDay: 1,
    paymentMethod: "TRANSFER",
    leaseType: "UNFURNISHED",
  });

  const postLease = (body: Record<string, unknown>) =>
    leasePOST(
      new NextRequest("https://rentready.test/api/leases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
    );

  it("cannot create a lease on Bob's property", async () => {
    const response = await postLease(leasePayload(propertyBobsId, tenantAlicesId));

    expect(response.status).toBe(404);
    // Not the status alone: count the rows actually attached to Bob's property.
    const leaked = await prisma.lease.findMany({ where: { propertyId: propertyBobsId } });
    expect(leaked.filter((l) => l.userId === SESSION_USER_ID)).toEqual([]);
  });

  it("cannot create a lease on Bob's tenant", async () => {
    const response = await postLease(leasePayload(propertyAlicesId, tenantBobsId));

    expect(response.status).toBe(404);
    const leaked = await prisma.lease.findMany({ where: { tenantId: tenantBobsId } });
    expect(leaked.filter((l) => l.userId === SESSION_USER_ID)).toEqual([]);
  });

  it("creates nothing at all on the refused paths", async () => {
    const before = await prisma.lease.count({ where: { userId: SESSION_USER_ID } });

    await postLease(leasePayload(propertyBobsId, tenantBobsId));

    const after = await prisma.lease.count({ where: { userId: SESSION_USER_ID } });
    expect(after).toBe(before);
  });
});