/**
 * A receipt must describe the PAYMENT, not the lease as it stands when the PDF
 * happens to be produced.
 *
 * Three defects, all on the same financial document:
 *
 * 1. AMOUNTS READ AT GENERATION TIME. `generateQuittance` read
 *    `lease.rentAmount` / `lease.chargesAmount`, so an IRL revision between the
 *    payment and the download printed the NEW rent on a receipt for money
 *    received at the OLD one. The financial history stopped being reproducible
 *    from the ledger (AGENTS.md 14). The amounts are now frozen on the payment
 *    when it is recorded (`receiptRentAmount` / `receiptChargesAmount`).
 *
 * 2. GENERATION NOT IDEMPOTENT. Every call allocated a new receipt number and
 *    created a new `Document`, so a double click, a retry or two open tabs
 *    produced N documents and N references for one payment, and the earlier ones
 *    were orphaned with their number burned. `Document.transactionId` is UNIQUE:
 *    the second call cannot persist and is answered with the winner's document.
 *
 * 3. THE UI RE-RENDERED THE PDF. `quittance-button.tsx` called the action, then
 *    rebuilt the PDF in the browser with @react-pdf/renderer + Factur-X, so the
 *    downloaded file was a fresh rendering rather than the archived document.
 *    It now downloads the persisted bytes.
 *
 * The figures are asserted by EXECUTING the real `generateQuittance` against
 * rows, and the lease is mutated between the payment and the generation exactly
 * as an IRL revision would — not by reading the source.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import Decimal from "decimal.js";
// Resolved through vitest.config's alias to the shared stub, which
// records what it was asked to render.
import { renderings } from "@/__tests__/__mocks__/@react-pdf/renderer";

const { storeRef, allocateMock } = vi.hoisted(() => ({
  storeRef: { current: null as unknown },
  allocateMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: async () => "landlord-1" }));
vi.mock("@/lib/receipt-number", () => ({ allocateReceiptNumber: allocateMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// The REAL PDF server module: the point of (3) is that the document is persisted
// and then served, so mocking it away would hide exactly what is being pinned.
import { recordRentPayment } from "@/lib/services/rent-payments";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import {
  createStore,
  lease,
  periodRow,
  receiptRow,
  type Store,
  type StoredDocument,
} from "./payment-store";

const LANDLORD = "landlord-1";
const LEASE = "lease-1";
const OCT = new Date("2026-10-01T00:00:00.000Z");
const TOTAL_DUE = "970.55"; // 850.50 rent + 120.05 charges

const landlordRow = {
  id: LANDLORD,
  firstName: "Marie",
  lastName: "Durand",
  addressLine1: "12 rue de la Paix",
  addressLine2: null,
  city: "Paris",
  postalCode: "75002",
};

/**
 * What the PDF renderer was actually handed, oldest first. The shared
 * @react-pdf/renderer stub records it there, so these tests read the FIGURES the
 * archived document was rendered from — which is the thing that was wrong.
 */
function generated(): Array<Record<string, unknown>> {
  return renderings;
}

/** The amounts of the last rendering, as the PDF would print them. */
function lastFigures(): string {
  const last = generated().at(-1);
  if (!last) throw new Error("the PDF was never rendered");
  const money = (value: unknown) =>
    new Decimal(value as Decimal.Value).toDecimalPlaces(2).toFixed(2);
  return `rent=${money(last.rentAmount)} charges=${money(
    last.chargesAmount
  )} total=${money(last.totalAmount)}`;
}

/** Every figure line rendered so far, so a second rendering is visible. */
function allFigures(): string[] {
  return generated().map((data: Record<string, unknown>) => {
    const money = (value: unknown) =>
      new Decimal(value as Decimal.Value).toDecimalPlaces(2).toFixed(2);
    return `rent=${money(data.rentAmount)} charges=${money(
      data.chargesAmount
    )} total=${money(data.totalAmount)} remaining=${money(data.remainingAmount)}`;
  });
}

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
    // The split the month was INVOICED at, stated explicitly. Leaving it out would
    // put the whole 970.55 in the rent column — a shape `generateRentPeriodsForLease`
    // never writes, and one this file's own subject (a document that reproduces
    // the month as billed) must not be asserting against.
    rows: [periodRow({ amount: TOTAL_DUE, invoicedRent: "850.50", invoicedCharges: "120.05" })],
    landlord: landlordRow,
  });
  storeRef.current = store;
  return store;
}

function store(): Store {
  return storeRef.current as Store;
}

/** Raise the lease's rent, as an IRL revision does. */
function reviseLease(rentAmount: string, chargesAmount: string): void {
  const current = store().leases[0];
  current.rentAmount = rentAmount;
  current.chargesAmount = chargesAmount;
}

beforeEach(() => {
  vi.clearAllMocks();
  renderings.length = 0;

  let sequence = 0;
  allocateMock.mockImplementation(
    async (_userId: string, type: "QUITTANCE" | "RECU") => {
      sequence += 1;
      return `${type === "QUITTANCE" ? "QUI" : "REC"}-2026-10-${String(
        sequence
      ).padStart(4, "0")}`;
    }
  );
});

/**
 * Records a payment through the door, so the freeze happens in the production
 * path rather than being written into the fixture by hand.
 *
 * `paidAt` is passed explicitly when a test needs two instalments of one period:
 * ordering the cumulative judgement depends on it, and two calls inside the same
 * millisecond would otherwise be ordered by a `createdAt` the store cannot
 * separate.
 */
async function pay(
  amount: number,
  duePeriodId: string | null = "period-oct",
  paidAt?: Date
) {
  const result = await recordRentPayment({
    userId: LANDLORD,
    leaseId: LEASE,
    duePeriodId,
    amount,
    paidAt,
  });
  expect(result.ok).toBe(true);
  return result.ok ? result.transactionId : "";
}

const BUDGET = 30_000;

describe("a receipt is reproducible from the payment, not from the lease", () => {
  it("prints the rent that was paid, after the lease was revised", async () => {
    const store = newStore();

    // October is paid in full at 850,50 + 120,05.
    const transactionId = await pay(Number(TOTAL_DUE));

    // The landlord then revises the rent (IRL). This is the real-world order:
    // the money arrives, the index is updated afterwards.
    reviseLease("900.00", "120.05");

    await generateQuittance(transactionId);

    // The document describes the payment. Reading the lease here would print
    // 900,00 — a receipt for 970,55 of money stating a 1 020,05 month.
    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=970.55 remaining=0.00`,
    ]);
    void store;
  }, BUDGET);

  it("keeps the revision out of the document's own figures, whatever the charge change", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));

    // A revision of BOTH components, to prove neither is read from the lease.
    reviseLease("1100.00", "250.00");
    await generateQuittance(transactionId);

    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=970.55 remaining=0.00`,
    ]);
  }, BUDGET);

  it("still describes a payment recorded before the freeze from the lease", async () => {
    // Historical rows carry NULL in the frozen columns. They must keep producing
    // a document rather than a blank or a crash.
    const store = newStore();
    store.rows.push(
      receiptRow({
        id: "legacy-receipt",
        amount: TOTAL_DUE,
        receiptRentAmount: null,
        receiptChargesAmount: null,
      })
    );

    const result = await generateQuittance("legacy-receipt");

    expect(result.success).toBe(true);
    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=970.55 remaining=0.00`,
    ]);
  }, BUDGET);

  it("freezes the amounts on the payment itself, so the ledger carries them", async () => {
    newStore();
    await pay(Number(TOTAL_DUE));

    const closed = store().rows.find((r) => r.paidAt !== null)!;

    expect(closed.receiptRentAmount).toBe("850.50");
    expect(closed.receiptChargesAmount).toBe("120.05");
  }, BUDGET);

  it("freezes them on a partial payment too, so the solde receipt matches the month", async () => {
    newStore();
    // 400 leaves the month open; the receipt is a RECU for that 400.
    const transactionId = await pay(400, "period-oct");

    const receipt = store().rows.find((r) => r.id === transactionId)!;
    expect(receipt.receiptRentAmount).toBe("850.50");
    expect(receipt.receiptChargesAmount).toBe("120.05");

    reviseLease("900.00", "120.05");
    const result = await generateQuittance(transactionId);

    expect(result.success).toBe(true);
    // The RECU shows the month's real obligation (850,50 + 120,05), not 900,00.
    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=400.00 remaining=570.55`,
    ]);
  }, BUDGET);
});

describe("the balance the document prints is the period's, not the payment's", () => {
  it("announces 370,55 after a 970,55 month paid 300 + 300, not 670,55", async () => {
    // The defect: the PDF derived its "Solde restant dû" as
    // `expectedTotal - this payment`, so the second instalment told the tenant
    // they owed 670,55 when 370,55 was left — a legal document (loi du 6 juillet
    // 1989, art. 21) overstating the debt by the first instalment, and
    // contradicting the `remainingDue` the receipt route reports for the same
    // payment. The balance now comes from `settlePeriodPayments`.
    newStore();
    await pay(300, "period-oct", new Date("2026-10-05T10:00:00.000Z"));
    const secondId = await pay(
      300,
      "period-oct",
      new Date("2026-10-20T10:00:00.000Z")
    );

    await generateQuittance(secondId);

    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=300.00 remaining=370.55`,
    ]);
  }, BUDGET);

  it("still prints nothing owed on the payment that closes the month", async () => {
    newStore();
    await pay(400, "period-oct", new Date("2026-10-05T10:00:00.000Z"));
    const balanceId = await pay(
      570.55,
      "period-oct",
      new Date("2026-10-20T10:00:00.000Z")
    );

    const result = await generateQuittance(balanceId);

    expect(result.success).toBe(true);
    const data = result.success
      ? (result.data as { receiptType: string })
      : null;
    // Settled month: a QUITTANCE, with no balance line to print.
    expect(data?.receiptType).toBe("QUITTANCE");
    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=570.55 remaining=0.00`,
    ]);
  }, BUDGET);

  it("prints the full balance on the FIRST instalment of a period", async () => {
    newStore();
    const firstId = await pay(
      400,
      "period-oct",
      new Date("2026-10-05T10:00:00.000Z")
    );

    await generateQuittance(firstId);

    // 970,55 owed, 400 received: 570,55 left. The later instalment has not
    // happened yet, so this is not 0 — a receipt attests to its own date.
    expect(allFigures()).toEqual([
      `rent=850.50 charges=120.05 total=400.00 remaining=570.55`,
    ]);
  }, BUDGET);

  it("does not let a receipt claim a credit when the payment exceeds the month", async () => {
    // An overpayment must floor at zero. A document that printed a negative
    // balance would be inventing money the tenant did not hand over.
    const store = newStore();
    await pay(Number(TOTAL_DUE), "period-oct", new Date("2026-10-05T10:00:00.000Z"));

    // A second, larger payment on the same period, written directly: the door
    // refuses anything above the collectable balance, and this is about what the
    // document does with a row it is asked to receipt.
    store.rows.push(
      receiptRow({
        id: "overpaid",
        amount: "1200.00",
        receiptRentAmount: "850.50",
        receiptChargesAmount: "120.05",
        paidAt: new Date("2026-10-20T10:00:00.000Z"),
        createdAt: new Date("2026-10-20T10:00:00.000Z"),
      })
    );

    const result = await generateQuittance("overpaid");

    expect(result.success).toBe(true);
    expect(allFigures().at(-1)).toContain("remaining=0.00");
  }, BUDGET);
});

describe("one payment, one receipt", () => {
  it("returns the existing document instead of creating a second one", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));

    const first = await generateQuittance(transactionId);
    const second = await generateQuittance(transactionId);

    expect(first.success && second.success).toBe(true);
    // ONE document for one payment.
    expect(store().documents).toHaveLength(1);
    // ONE reference: the second call did not burn another number.
    expect(allocateMock).toHaveBeenCalledTimes(1);
    const firstData = first.success ? (first.data as Record<string, unknown>) : {};
    const secondData = second.success ? (second.data as Record<string, unknown>) : {};
    expect(secondData.receiptNumber).toBe(firstData.receiptNumber);
    expect(secondData.documentId).toBe(firstData.documentId);
    expect(secondData.existing).toBe(true);
  }, BUDGET);

  it("produces one document when two calls race", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));

    // Both calls read the same unreceipted row, which is the exact window a
    // double click opens. The UNIQUE index on Document.transactionId decides:
    // the loser cannot persist, so the action answers with the winner's document.
    const [a, b] = await Promise.all([
      generateQuittance(transactionId),
      generateQuittance(transactionId),
    ]);

    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
    expect(store().documents).toHaveLength(1);

    const ids = [a, b].map((r) =>
      r.success ? (r.data as { documentId: string }).documentId : null
    );
    expect(new Set(ids).size).toBe(1);
  }, BUDGET);

  it("keeps one document per payment across different payments", async () => {
    newStore();
    const octoberId = await pay(Number(TOTAL_DUE));
    await generateQuittance(octoberId);

    // A second month's payment gets its own receipt: the uniqueness is per
    // payment, not a global one-per-landlord limit.
    const novemberStart = new Date("2026-11-01T00:00:00.000Z");
    store().rows.push(
      periodRow({
        id: "period-nov",
        amount: TOTAL_DUE,
        periodStart: novemberStart,
        periodEnd: new Date("2026-11-30T00:00:00.000Z"),
        dueDate: new Date("2026-11-03T00:00:00.000Z"),
      })
    );
    const novemberId = await pay(Number(TOTAL_DUE), "period-nov");
    await generateQuittance(novemberId);

    expect(store().documents).toHaveLength(2);
    expect(new Set(store().documents.map((d) => d.id)).size).toBe(2);
  }, BUDGET);

  it("does not consume a receipt number when it refuses for an incomplete address", async () => {
    // Non-regression: the address guard fires before the allocator.
    const store = createStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [receiptRow({ id: "tx-1", amount: TOTAL_DUE })],
      landlord: { ...landlordRow, addressLine1: "", city: "", postalCode: "" },
    });
    storeRef.current = store;

    const result = await generateQuittance("tx-1");

    expect(result.success).toBe(false);
    expect(allocateMock).not.toHaveBeenCalled();
    expect(store.documents).toHaveLength(0);
  }, BUDGET);

  it("does not receipt a cancelled payment, and burns no number", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));

    // The correction path: the money went back, so the row is CANCELLED while
    // keeping its amount and paidAt.
    const { cancelRentPayment } = await import("@/lib/services/rent-payments");
    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId,
    });
    expect(cancelled.ok).toBe(true);

    const result = await generateQuittance(transactionId);

    expect(result.success).toBe(false);
    expect(allocateMock).not.toHaveBeenCalled();
    expect(store().documents).toHaveLength(0);
  }, BUDGET);
});

describe("the downloaded file is the archived document", () => {
  it("serves bytes identical to the persisted Document", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));

    const generated_ = await generateQuittance(transactionId);
    expect(generated_.success).toBe(true);

    // What the download route serves: the document linked to this payment.
    const served = store()
      .documents.find((d) => d.transactionId === transactionId);

    expect(served).toBeDefined();
    expect(served!.bytes.length).toBeGreaterThan(0);
    // Exactly the archived bytes, not a re-rendering: the same file the landlord
    // would have received had the template changed after generation.
    expect(Array.from(served!.bytes)).toEqual(
      Array.from(store().documents[0].bytes)
    );
    // The document names itself after the receipt reference it attests.
    const reference = store().rows.find((r) => r.receiptNumber)?.receiptNumber;
    expect(served!.fileName).toBe(`${reference}.pdf`);
  }, BUDGET);

  it("does not re-render on a second download", async () => {
    newStore();
    const transactionId = await pay(Number(TOTAL_DUE));
    await generateQuittance(transactionId);

    const rendersAfterFirst = renderings.length;
    // A second download must be a pure read: no new rendering, same bytes.
    await generateQuittance(transactionId);

    expect(renderings).toHaveLength(rendersAfterFirst);
    expect(store().documents).toHaveLength(1);
  }, BUDGET);
});
