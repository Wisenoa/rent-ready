/**
 * A cancelled receipt must not turn a partial payment into a balance quittance.
 *
 * `cancelRentPayment` marks a wrongly recorded receipt CANCELLED and keeps its
 * amount and its `paidAt` — a financial ledger does not delete what happened. The
 * only thing that says "this is not money received any more" is the status.
 *
 * The aggregate that decides QUITTANCE vs RECU
 * (`src/lib/actions/quittance-actions.tsx`) filtered on `paidAt` alone, so a
 * cancelled receipt was summed as an earlier receipt for the month. Land the
 * scenario a beta landlord actually reaches:
 *
 *   1. record 970,55 for October (850,50 + 120,05) — the month closes;
 *   2. the money goes back, so cancel it — the door reopens October at 970,55;
 *   3. the landlord takes the payment again in instalments and records 300;
 *   4. the receipt for those 300 was emitted as a QUITTANCE DE SOLDE: a `QUI-`
 *      number burned, `isFullPayment: true`, while 670,55 remained owed.
 *
 * That is a legal document attesting that a month is settled when it is not, so
 * it is pinned here by EXECUTING the real `generateQuittance` against rows, not
 * by asserting on a `where` clause.
 *
 * The converse is pinned too: a month that really is settled must not be
 * downgraded to a simple receipt because one instalment was cancelled and
 * re-recorded (AGENTS.md 14 — the receipt must follow the money).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { storeRef, allocateMock, pdfMock } = vi.hoisted(() => ({
  storeRef: { current: null as unknown },
  allocateMock: vi.fn(),
  pdfMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: async () => "landlord-1" }));
vi.mock("@/lib/receipt-number", () => ({ allocateReceiptNumber: allocateMock }));
vi.mock("@/lib/actions/quittance-pdf-server", () => ({
  generateAndUploadQuittancePdf: pdfMock,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { recordRentPayment, cancelRentPayment } from "@/lib/services/rent-payments";
import {
  createStore,
  lease,
  periodRow,
  type Store,
} from "./payment-store";

const LANDLORD = "landlord-1";
const LEASE = "lease-1";
const OCT = new Date("2026-10-01T00:00:00.000Z");

/** The figures the rest of the suite uses: 850,50 rent + 120,05 charges. */
const TOTAL_DUE = "970.55";

const landlordRow = {
  id: LANDLORD,
  firstName: "Marie",
  lastName: "Durand",
  addressLine1: "12 rue de la Paix",
  addressLine2: null,
  city: "Paris",
  postalCode: "75002",
};

function newStore(): Store {
  const store = createStore({
    leases: [
      {
        ...lease(LEASE, LANDLORD, "850.50", "120.05"),
        property: {
          addressLine1: "5 rue du-test",
          addressLine2: null,
          postalCode: "69001",
          city: "Lyon",
        },
        tenant: {
          firstName: "Jean",
          lastName: "Dupont",
          addressLine1: "3 rue du-locataire",
          addressLine2: null,
          city: "Lyon",
          postalCode: "69002",
        },
      },
    ],
    rows: [periodRow({ amount: TOTAL_DUE })],
    landlord: landlordRow,
  });
  storeRef.current = store;
  return store;
}

/**
 * Imported statically, not inside each test: pulling this module in drags the
 * Better Auth / Prisma module graph with it (~9 s on a loaded machine), and a
 * dynamic import charged that to every test's own timeout budget, so the three
 * assertions here could time out before they ran.
 */
import { generateQuittance } from "@/lib/actions/quittance-actions";

function generate(id: string) {
  return generateQuittance(id);
}

beforeEach(() => {
  vi.clearAllMocks();
  // A receipt number is what makes a receipt a legal reference, so the mock
  // mirrors the real prefix: a QUITTANCE burns QUI-, a partial RECU-.
  allocateMock.mockImplementation(async (_userId: string, type: "QUITTANCE" | "RECU") =>
    type === "QUITTANCE" ? "QUI-2026-10-0001" : "REC-2026-10-0001"
  );
  // The generator returns the archived document it persisted, so the caller can
  // serve those exact bytes instead of re-rendering the PDF in the browser. A
  // plain URL here would make the action treat the document as unpersisted and
  // report a failure for a receipt that had in fact been produced.
  pdfMock.mockImplementation(
    async (_transactionId: string, data: { receiptNumber: string }) => ({
      url: `https://example.test/${data.receiptNumber}.pdf`,
      documentId: `doc-${data.receiptNumber}`,
    })
  );
});

/** Generous, because these drive the whole door and then the whole action. */
const BUDGET = 30_000;

describe("generateQuittance after a cancellation", () => {
  it("issues a partial RECU, not a balance quittance, for a month that is not settled", async () => {
    const store = newStore();

    // 1. The month is paid in full and closes.
    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: TOTAL_DUE,
    });
    const fullReceipt = store.rows.find((r) => r.paidAt !== null)!;
    expect(fullReceipt.status).toBe("PAID");

    // 2. The money went back: the receipt is cancelled and October is owed again.
    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: fullReceipt.id,
    });
    expect(cancelled.ok && cancelled.collectable).toBe(TOTAL_DUE);

    // 3. The landlord re-records it as an instalment.
    const partial = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: cancelled.ok ? cancelled.reopenedPeriodId : null,
      amount: 300,
    });
    expect(partial.ok).toBe(true);
    expect(partial.ok && partial.settled).toBe(false);
    expect(partial.ok && partial.receiptType).toBe("RECU");

    // 4. The receipt for those 300 EUR must say so.
    const result = await generate(partial.ok ? partial.transactionId : "");

    expect(result.success).toBe(true);
    const data = result.success ? (result.data as { receiptType: string; receiptNumber: string }) : null;
    expect(data?.receiptType).toBe("RECU");
    // No QUI- reference burned for a month with 670.55 still owed.
    expect(data?.receiptNumber).toBe("REC-2026-10-0001");
    expect(allocateMock).toHaveBeenCalledWith(LANDLORD, "RECU", expect.any(Date));
    // And the document itself agrees it is not a balance quittance.
    expect(pdfMock).toHaveBeenCalledTimes(1);
    const [, quittanceData] = pdfMock.mock.calls[0] as unknown as [
      string,
      { isFullPayment: boolean; totalAmount: { toString(): string } }
    ];
    expect(quittanceData.isFullPayment).toBe(false);
    expect(quittanceData.totalAmount.toString()).toBe("300.00");
  }, BUDGET);

  it("still issues a balance quittance once the month really is settled again", async () => {
    // The converse: excluding cancelled rows must not retroactively deny a
    // quittance to a month the landlord HAS settled (loi du 6 juillet 1989,
    // art. 21 — withholding it after the money arrived is a compliance failure).
    const store = newStore();

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 400,
    });
    const firstReceipt = store.rows.find((r) => r.paidAt !== null)!;

    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: firstReceipt.id,
    });
    expect(cancelled.ok).toBe(true);

    const balance = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: cancelled.ok ? cancelled.reopenedPeriodId : null,
      amount: TOTAL_DUE,
    });
    expect(balance.ok && balance.settled).toBe(true);
    expect(balance.ok && balance.receiptType).toBe("QUITTANCE");

    const result = await generate(balance.ok ? balance.transactionId : "");
    const data = result.success ? (result.data as { receiptType: string }) : null;
    expect(data?.receiptType).toBe("QUITTANCE");
    expect(allocateMock).toHaveBeenCalledWith(LANDLORD, "QUITTANCE", expect.any(Date));
  }, BUDGET);

  it("refuses to receipt a cancelled payment at all", async () => {
    // The cancelled row keeps `paidAt`, so a document could still be produced
    // for it. Money that went back gets no receipt, and no number is burned.
    const store = newStore();

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 400,
    });
    const receipt = store.rows.find((r) => r.paidAt !== null)!;
    await cancelRentPayment({ userId: LANDLORD, transactionId: receipt.id });

    const result = await generate(receipt.id);

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toMatch(/annulé/i);
    expect(allocateMock).not.toHaveBeenCalled();
    expect(pdfMock).not.toHaveBeenCalled();
  }, BUDGET);
});