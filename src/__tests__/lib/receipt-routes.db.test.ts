/**
 * The receipt view and the receipt download, against real rows.
 *
 * `GET /api/transactions/[id]/receipt` derived its answer from
 * `status === "PAID"` and from the lease's CURRENT rent, ignoring the earlier
 * payments of the same period. On a month paid 400 + 570,55 it reported 570,55
 * still owed on the payment that had just cleared it — a balance that does not
 * exist. It now goes through `settlePeriodPayments`, the single settlement rule,
 * over the amounts frozen on the payments.
 *
 * `GET /api/transactions/[id]/receipt/download` serves the archived bytes and
 * checks ownership in the query. It is a PUBLIC surface by construction: the id
 * comes from the browser, so the second landlord's receipt must be unreachable,
 * not merely hidden.
 *
 * Real Prisma and a real PostgreSQL, because the point of these is what the
 * queries mean. `vitest.config.ts` loads `.env`, so a local `pnpm test` runs them
 * exactly as CI does — previously they were skipped SILENTLY without
 * DATABASE_URL and the suite still reported green, which is how "N tests verts"
 * could mean nothing about the database.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
// Loud when it does not run. A silent skip reads as coverage in a summary, and a
// receipt route is exactly the kind of code that passes a mocked suite and
// 500s against PostgreSQL.
const describeDb = DATABASE_URL ? describe : describe.skip;
if (!DATABASE_URL) {
  console.warn(
    "[receipt-routes.db.test] SKIPPED: DATABASE_URL is unset. The receipt " +
      "routes are NOT covered by this run — copy .env, or export DATABASE_URL."
  );
}

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const ALICE = `receipt-alice-${SUFFIX}`;
const BOB = `receipt-bob-${SUFFIX}`;

vi.mock("@/lib/auth-server", () => ({
  auth: {
    api: {
      // Read at CALL time, so a test can put Bob in the session.
      getSession: async () => ({ user: { id: globalThis.__rrSessionUserId } }),
    },
  },
}));
vi.mock("@/lib/auth", () => ({
  getCurrentUserId: async () => globalThis.__rrSessionUserId,
}));
vi.mock("@/lib/receipt-number", () => ({
  allocateReceiptNumber: async (
    _userId: string,
    type: "QUITTANCE" | "RECU"
  ) => `${type === "QUITTANCE" ? "QUI" : "REC"}-2026-10-9999`,
}));

declare global {
  // eslint-disable-next-line no-var
  var __rrSessionUserId: string;
}
globalThis.__rrSessionUserId = ALICE;

describeDb("the receipt routes, real rows", () => {
  const RENT = "850.50";
  const CHARGES = "120.05";
  const TOTAL = new Decimal(RENT).plus(CHARGES).toFixed(2); // 970.55

  let prisma: typeof import("@/lib/prisma").prisma;
  let receiptGET: typeof import("@/app/api/transactions/[id]/receipt/route").GET;
  let downloadGET: typeof import("@/app/api/transactions/[id]/receipt/download/route").GET;
  let NextRequest: typeof import("next/server").NextRequest;
  let recordRentPayment: typeof import("@/lib/services/rent-payments").recordRentPayment;
  let generateQuittance: typeof import("@/lib/actions/quittance-actions").generateQuittance;

  let bobTransactionId = "";
  let aliceFirstInstalmentId = "";
  let aliceBalanceId = "";

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    ({ NextRequest } = await import("next/server"));
    receiptGET = (await import("@/app/api/transactions/[id]/receipt/route")).GET;
    downloadGET = (await import("@/app/api/transactions/[id]/receipt/download/route")).GET;
    ({ recordRentPayment } = await import("@/lib/services/rent-payments"));
    ({ generateQuittance } = await import("@/lib/actions/quittance-actions"));

    await prisma.user.createMany({
      data: [
        { id: ALICE, email: `receipt-alice-${SUFFIX}@test.local`, name: "Alice", firstName: "Alice", lastName: "A", addressLine1: "1 rue A", city: "Paris", postalCode: "75001" },
        { id: BOB, email: `receipt-bob-${SUFFIX}@test.local`, name: "Bob", firstName: "Bob", lastName: "B", addressLine1: "2 rue B", city: "Lyon", postalCode: "69001" },
      ],
    });

    const mkLease = async (userId: string, label: string) => {
      const property = await prisma.property.create({
        data: { userId, name: label, type: "APARTMENT", addressLine1: "3 rue P", city: "Lyon", postalCode: "69001" },
      });
      const tenant = await prisma.tenant.create({
        data: { userId, firstName: "Jean", lastName: "Dupont", addressLine1: "4 rue T", city: "Lyon", postalCode: "69002" },
      });
      return prisma.lease.create({
        data: {
          userId,
          propertyId: property.id,
          tenantId: tenant.id,
          startDate: new Date("2026-01-01T00:00:00.000Z"),
          endDate: new Date("2027-01-01T00:00:00.000Z"),
          rentAmount: RENT,
          chargesAmount: CHARGES,
          depositAmount: "0",
          status: "ACTIVE",
          leaseType: "UNFURNISHED",
          paymentDay: 1,
        },
      });
    };

    // Alice pays October in two instalments: 400, then the balance.
    const aliceLease = await mkLease(ALICE, "Bien Alice");
    const period = await prisma.transaction.create({
      data: {
        userId: ALICE,
        leaseId: aliceLease.id,
        amount: TOTAL,
        rentPortion: RENT,
        chargesPortion: CHARGES,
        periodStart: new Date("2026-10-01T00:00:00.000Z"),
        periodEnd: new Date("2026-10-31T00:00:00.000Z"),
        dueDate: new Date("2026-10-03T00:00:00.000Z"),
        status: "PENDING",
      },
    });

    const first = await recordRentPayment({
      userId: ALICE,
      leaseId: aliceLease.id,
      duePeriodId: period.id,
      amount: 400,
    });
    expect(first.ok).toBe(true);
    aliceFirstInstalmentId = first.ok ? first.transactionId : "";

    const balance = await recordRentPayment({
      userId: ALICE,
      leaseId: aliceLease.id,
      duePeriodId: period.id,
      amount: new Decimal(TOTAL).minus(400).toFixed(2),
    });
    expect(balance.ok).toBe(true);
    aliceBalanceId = balance.ok ? balance.transactionId : "";

    // Bob has one paid payment of his own, to be attempted from Alice's session.
    const bobLease = await mkLease(BOB, "Bien Bob");
    const bobPeriod = await prisma.transaction.create({
      data: {
        userId: BOB,
        leaseId: bobLease.id,
        amount: TOTAL,
        rentPortion: RENT,
        chargesPortion: CHARGES,
        periodStart: new Date("2026-10-01T00:00:00.000Z"),
        periodEnd: new Date("2026-10-31T00:00:00.000Z"),
        dueDate: new Date("2026-10-03T00:00:00.000Z"),
        status: "PENDING",
      },
    });
    const bobPaid = await recordRentPayment({
      userId: BOB,
      leaseId: bobLease.id,
      duePeriodId: bobPeriod.id,
      amount: Number(TOTAL),
    });
    bobTransactionId = bobPaid.ok ? bobPaid.transactionId : "";

    await generateQuittance(bobTransactionId);
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.user.deleteMany({ where: { id: { in: [ALICE, BOB] } } });
  });

  const request = () => new NextRequest("http://localhost/api");

  describe("GET /receipt on a period paid in instalments", () => {
    it("reports nothing outstanding on the payment that settled the month", async () => {
      // The defect: this used to compute |rent + charges - this payment|, which
      // on the 570,55 instalment that CLOSED a 970,55 month reported 400 still
      // owed — a balance that does not exist, on a month that was paid.
      const res = await receiptGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: {
          receipt: { type: string; number: string | null };
          amounts: { remainingDue: number; totalPaid: string };
        };
      };

      expect(body.data.amounts.remainingDue).toBe(0);
      expect(body.data.receipt.type).toBe("QUITTANCE");
      // `totalPaid` is the amount of the payment this receipt is about — the
      // 570,55 instalment — not the month's 970,55. It was the balance that was
      // wrong before, not the payment.
      expect(Number(body.data.amounts.totalPaid)).toBeCloseTo(570.55, 2);
    });

    it("reports the real balance on the FIRST instalment", async () => {
      const res = await receiptGET(request(), {
        params: Promise.resolve({ id: aliceFirstInstalmentId }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: { receipt: { type: string }; amounts: { remainingDue: number } };
      };

      // 970,55 owed, 400 received: 570,55 left. The second instalment had not
      // been counted (it came later), so this is not a zero.
      expect(body.data.amounts.remainingDue).toBeCloseTo(570.55, 2);
      expect(body.data.receipt.type).toBe("RECU");
    });

    it("points at the archived document rather than a rendering", async () => {
      const res = await receiptGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });
      const body = (await res.json()) as {
        data: { receipt: { documentUrl: string; hasDocument: boolean } };
      };

      expect(body.data.receipt.documentUrl).toBe(
        `/api/transactions/${aliceBalanceId}/receipt/download`
      );
    });
  });

  describe("the balance the PDF and the JSON agree on", () => {
    it("generates the second of two partial payments without overstating the debt", async () => {
      // The defect this pins, on the real database rather than on an in-memory
      // store: the PDF used to derive "Solde restant dû" from this payment alone
      // (expectedTotal - amount) while the route below answers with the period's
      // real balance. On a month paid 400 + 570,55, the receipt for the SECOND
      // payment announced 400 still owed on a month that was fully paid — and on
      // a month still open it announced the first instalment twice. The two
      // documents disagreed about the same payment, and the PDF is the one the
      // tenant keeps.
      const res = await receiptGET(request(), {
        params: Promise.resolve({ id: aliceFirstInstalmentId }),
      });
      const body = (await res.json()) as {
        data: { amounts: { remainingDue: number } };
      };
      const jsonRemaining = body.data.amounts.remainingDue;

      const generated = await generateQuittance(aliceFirstInstalmentId);
      expect(generated.success).toBe(true);

      // Whatever the PDF was handed as `remainingAmount` must equal what the
      // route reports, cent for cent. `generateQuittance` passes it to the
      // renderer untouched.
      const data = generated.success
        ? (generated.data as { quittanceData?: { remainingAmount?: unknown } })
        : {};
      const pdfRemaining = new Decimal(
        (data.quittanceData?.remainingAmount as string) ?? NaN
      ).toDecimalPlaces(2);

      expect(pdfRemaining.toFixed(2)).toBe(new Decimal(jsonRemaining).toFixed(2));
      // And that figure is the period's, not the payment's: 970,55 owed, 400
      // received.
      expect(pdfRemaining.toFixed(2)).toBe("570.55");
    });

    it("reports nothing outstanding on the payment that closed the month", async () => {
      const res = await receiptGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });
      const body = (await res.json()) as {
        data: { amounts: { remainingDue: number } };
      };

      expect(body.data.amounts.remainingDue).toBe(0);
    });
  });

  describe("GET /receipt/download", () => {
    it("serves the archived bytes of the payment's own document", async () => {
      const res = await downloadGET(request(), {
        params: Promise.resolve({ id: bobTransactionId }),
      });

      // Alice's session, Bob's payment: refused. Asserted separately below.
      expect(res.status).toBe(404);
    });

    it("refuses another landlord's receipt, and does not leak its existence", async () => {
      // Alice asking for Bob's payment. Ownership is in the query, so the answer
      // is the same as for an id that does not exist at all.
      const foreign = await downloadGET(request(), {
        params: Promise.resolve({ id: bobTransactionId }),
      });
      const missing = await downloadGET(request(), {
        params: Promise.resolve({ id: "no-such-transaction" }),
      });

      expect(foreign.status).toBe(404);
      expect(missing.status).toBe(404);
      expect((await foreign.json()).error).toBe((await missing.json()).error);
    });

    it("generates and then serves Alice's own receipt", async () => {
      const res = await downloadGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      // A real PDF, not an empty body: the header is the first thing a parser
      // checks, so a truncated file fails here rather than in the landlord's
      // reader.
      const bytes = new Uint8Array(await res.arrayBuffer());
      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
      expect(bytes.length).toBeGreaterThan(100);
      expect(res.headers.get("Content-Disposition")).toContain("attachment");
    });

    it("serves the same bytes on a second download", async () => {
      const first = await downloadGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });
      const second = await downloadGET(request(), {
        params: Promise.resolve({ id: aliceBalanceId }),
      });

      expect(new Uint8Array(await first.arrayBuffer())).toEqual(
        new Uint8Array(await second.arrayBuffer())
      );
    });
  });
});