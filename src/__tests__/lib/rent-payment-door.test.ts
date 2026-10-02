/**
 * The payment door, exercised against rows rather than against source text.
 *
 * Six code paths used to write into `Transaction`, each with its own version of
 * "is this period paid?". Two of them could write a status with no money behind
 * it. These tests pin the behaviours that were broken, on the real
 * implementation in `src/lib/services/rent-payments.ts`:
 *
 *   - a payment is capped at the balance the month can still absorb;
 *   - a full payment closes the period and leaves NO pending row behind, so the
 *     month is never counted twice (once owed, once received);
 *   - a partial payment leaves the obligation standing and collectable;
 *   - an amount from the browser cannot settle a month it does not cover;
 *   - cancelling a receipt makes the amount collectable again;
 *   - nothing is readable or writable across landlords.
 *
 * The store in `./payment-store` applies the same `where` clauses Prisma would,
 * so "the month's receipts sum to what was owed" is an assertion about rows, not
 * about a call's arguments.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import Decimal from "decimal.js";

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: null as unknown } }));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));

import {
  recordRentPayment,
  cancelRentPayment,
} from "@/lib/services/rent-payments";
import {
  createStore,
  monthReceipts,
  openPeriods,
  periodRow,
  lease,
  type Store,
} from "./payment-store";

const LANDLORD = "landlord-1";
const OTHER = "landlord-2";
const LEASE = "lease-1";
const OCT = new Date("2026-10-01T00:00:00.000Z");

function newStore(options: Parameters<typeof createStore>[0]): Store {
  const store = createStore(options);
  storeRef.current = store;
  return store;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recordRentPayment — a full payment closes the month exactly once", () => {
  it("leaves no pending period behind, so the month is not owed and received", async () => {
    // The defect this pins: POST /api/transactions used to insert a receipt
    // WITHOUT closing the existing PENDING period, so the dashboard showed
    // « 970,55 EUR de reste du » on a month that had just been paid.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      periodStart: OCT,
      periodEnd: new Date("2026-10-31T00:00:00.000Z"),
      dueDate: new Date("2026-10-03T00:00:00.000Z"),
      amount: "970.55",
    });

    expect(result.ok).toBe(true);
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(0);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
  });

  it("books the month's receipts to exactly what was owed", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      periodStart: OCT,
      periodEnd: new Date("2026-10-31T00:00:00.000Z"),
      dueDate: new Date("2026-10-03T00:00:00.000Z"),
      amount: "970.55",
    });

    // What the landlord is owed (rent + charges) and what arrived must agree.
    const totalDue = new Decimal("850.50").plus("120.05");
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe(totalDue.toFixed(2));
  });
});

describe("recordRentPayment — the production instalment scenario", () => {
  it("970.55 -> 400 -> 570.55 collectable -> balance -> the month sums to 970.55", async () => {
    // The exact figures of settle-rent-period.test.ts, replayed through the door
    // the production routes call, rather than on an invented fixture shape.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const first = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 400,
    });

    // 400 of 970.55: the month is NOT closed and the balance is still owed.
    expect(first.ok).toBe(true);
    expect(first.ok && first.settled).toBe(false);
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
    expect(openPeriods(store, LEASE, OCT)[0].amount).toBe("570.55");
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("400.00");

    // The completing payment closes it.
    const second = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 570.55,
    });

    expect(second.ok && second.settled).toBe(true);
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(0);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
  });
});

describe("recordRentPayment — the browser is not the boundary", () => {
  it("refuses an amount above what the month can still absorb", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 1000,
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.error).toContain("dépasse le reste à payer");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("0.00");
  });

  it("does not let a one-cent payment settle a 970.55 month", async () => {
    // The « Marquer payé » defect: the browser's amount was written onto the row,
    // so 0.01 closed the month and the dashboard called it paid.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 0.01,
    });

    expect(result.ok && result.settled).toBe(false);
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
    expect(openPeriods(store, LEASE, OCT)[0].amount).toBe("970.54");
  });

  it("takes the period's own dates, not the ones posted beside its id", async () => {
    // A payload naming October's period with September's dates must book October.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      periodStart: new Date("2026-09-01T00:00:00.000Z"),
      periodEnd: new Date("2026-09-30T00:00:00.000Z"),
      dueDate: new Date("2026-09-01T00:00:00.000Z"),
      amount: "970.55",
    });

    const receipts = store.rows.filter((r) => r.paidAt !== null);
    expect(receipts).toHaveLength(1);
    expect(receipts[0].periodStart.getTime()).toBe(OCT.getTime());
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
  });
});

describe("recordRentPayment — two payments landing on the same month at once", () => {
  it("never collects more than the month is owed, and says so to the loser", async () => {
    // THE CAP WAS A TOCTOU. The ceiling was derived from a read taken BEFORE the
    // `prisma.$transaction`, so two requests for the same month both read
    // 970.55 owed, both passed the cap, and both wrote: 1200.00 EUR collected
    // against a 970.55 EUR debt, the month closed, and BOTH callers got
    // `ok: true` — « Paiement enregistré avec succès » twice.
    //
    // This is not the compare-and-set that `settleRentPeriod` already had: that
    // protects the period row's REDUCTION, and the second call simply re-read the
    // reduced row (370.55), computed remaining = -229.45 and closed it. The cap
    // had already been passed before either of them reached that point, so
    // nothing downstream could refuse it.
    //
    // The ceiling is now re-derived inside the transaction, and losing the
    // compare-and-set sends the caller back to re-read and re-decide instead of
    // booking.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const [a, b] = await Promise.all([
      recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 600 }),
      recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 600 }),
    ]);

    // What was owed is what was collected, counted once.
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("600.00");
    // And the month is still owed — the 370.55 that did not arrive.
    const open = openPeriods(store, LEASE, OCT);
    expect(open).toHaveLength(1);
    expect(open[0].amount).toBe("370.55");

    // Exactly one of the two was accepted; the other is told why, rather than
    // being answered « success » for money that was never owed.
    const accepted = [a, b].filter((r) => r.ok);
    const refused = [a, b].filter((r) => !r.ok);
    expect(accepted).toHaveLength(1);
    expect(refused).toHaveLength(1);
    expect(refused[0].ok === false && refused[0].code).toBe("AMOUNT_ABOVE_BALANCE");
  });

  it("books both when together they fit the month", async () => {
    // The retry loop must not turn a payment that FITS the current balance into
    // an error: 400 + 570.55 is the production instalment scenario, raced.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    const [a, b] = await Promise.all([
      recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 400 }),
      recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 570.55 }),
    ]);

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(0);
  });
});

describe("recordRentPayment — ownership", () => {
  it("refuses a lease belonging to another landlord", async () => {
    const store = newStore({
      leases: [lease(LEASE, OTHER, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55", userId: OTHER })],
    });

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: "970.55",
    });

    expect(result.ok).toBe(false);
    // Nothing was written: the other landlord's month is untouched.
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("0.00");
  });

  it("refuses a period id that is not this landlord's, even on their own lease", async () => {
    newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ id: "victim-period", amount: "970.55", userId: OTHER })],
    });

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "victim-period",
      amount: "970.55",
    });

    expect(result.ok).toBe(false);
  });
});

describe("recordRentPayment — a period row that still carries the whole month", () => {
  // Before `settleRentPeriod` started reducing the period row, a partial payment
  // left that row at its FULL amount next to a sibling receipt. Reading the row's
  // amount as the collectable balance then accepted 970.55 on top of 400 already
  // received: 1370.55 collected against a 970.55 debt.
  const legacyRows = () => [
    periodRow({ amount: "970.55" }),
    {
      ...periodRow({ id: "acompte-400", amount: "400.00" }),
      rentPortion: "350.52",
      chargesPortion: "49.48",
      paidAt: new Date("2026-10-05T00:00:00.000Z"),
      status: "PARTIAL",
      receiptType: "RECU",
      isFullPayment: false,
    },
  ];

  // A plain factory, not a hook: it swaps the mocked Prisma store for the
  // current test. Named `new…` so the react-hooks lint rule does not read it
  // as a hook and reject every caller.
  const newLegacyStore = () =>
    newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: legacyRows(),
    });

  it("refuses an amount the receipts have already covered", async () => {
    const store = newLegacyStore();

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 970.55,
    });

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.code).toBe("AMOUNT_ABOVE_BALANCE");
    // 400 was already received and the month's receipts must say so.
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("400.00");
  });

  it("collects only what the month still owes, and closes it", async () => {
    const store = newLegacyStore();

    const result = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 570.55,
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.settled).toBe(true);
    // 400 + 570.55 = the 970.55 owed, counted once.
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(0);
  });

  it("repairs the stale row on the way, so the next payment agrees", async () => {
    const store = newLegacyStore();

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 300,
    });

    // The row carries the balance, not the original month: 970.55 - 400 - 300.
    expect(openPeriods(store, LEASE, OCT)[0].amount).toBe("270.55");

    const second = await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 270.55,
    });

    expect(second.ok && second.settled).toBe(true);
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(0);
  });
});

describe("cancelRentPayment — the correction path", () => {
  it("makes a cancelled full payment collectable again", async () => {
    // A landlord who mistyped 97,00 instead of 970,00 has to be able to repair the
    // ledger; before this, the false amount was permanent.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({
      userId: LANDLORD,
      leaseId: LEASE,
      duePeriodId: "period-oct",
      amount: 97,
    });
    // The wrong receipt cleared the month; the money is then found to be wrong.
    const receipt = store.rows.find((r) => r.paidAt !== null)!;

    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: receipt.id,
    });

    expect(cancelled.ok && cancelled.collectable).toBe("970.55");
    // The month is owed again, and the false receipt is not money received.
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("0.00");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
    expect(openPeriods(store, LEASE, OCT)[0].amount).toBe("970.55");
  });

  it("returns the balance to the period row when a receipt was a sibling", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 400 });
    const receipt = store.rows.find((r) => r.paidAt !== null)!;

    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: receipt.id,
    });

    // 400 back on a month that had 570.55 left.
    expect(cancelled.ok && cancelled.collectable).toBe("970.55");
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("0.00");
    expect(openPeriods(store, LEASE, OCT)).toHaveLength(1);
  });

  it("keeps only the instalments that really arrived", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 400 });
    const firstReceipt = store.rows.find((r) => r.paidAt !== null)!;
    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 570.55 });

    // Cancel only the first instalment. The second one DID arrive: the month went
    // from 970.55 owed to 570.55 owed, and only the 400 that went back is
    // collectable again. Reopening the month for the full 970.55 would offer the
    // landlord money he already has.
    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: firstReceipt.id,
    });

    expect(cancelled.ok && cancelled.collectable).toBe("400.00");
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("570.55");
    // The month is owed again, for exactly what did not arrive.
    const open = openPeriods(store, LEASE, OCT);
    expect(open).toHaveLength(1);
    expect(open[0].amount).toBe("400.00");
  });

  it("excludes the cancelled row itself from the instalments it keeps", async () => {
    // The regression guard on the sibling sum above: it is derived from a
    // `findMany` filtered with `id: { not: <cancelled> }`, which Prisma applies
    // but a naive store does not. If that filter silently matched nothing, the
    // month would be re-opened for 970.55 instead of 400 — and this is the only
    // assertion that notices.
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 400 });
    const firstReceipt = store.rows.find((r) => r.paidAt !== null)!;
    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: 570.55 });

    const findMany = (
      store.prisma as { transaction: { findMany: { mock: { calls: unknown[][] } } } }
    ).transaction.findMany.mock;
    const cancelled = await cancelRentPayment({
      userId: LANDLORD,
      transactionId: firstReceipt.id,
    });

    // The sibling query must EXCLUDE the cancelled row rather than include it.
    const siblingCall = findMany.calls
      .map((call) => (call[0] as { where?: { id?: unknown } }).where)
      .find((where) => where?.id !== undefined);
    expect(siblingCall?.id).toEqual({ not: firstReceipt.id });
    expect(cancelled.ok && cancelled.collectable).toBe("400.00");
  });

  it("refuses to cancel another landlord's payment", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: "970.55" });
    const receipt = store.rows.find((r) => r.paidAt !== null)!;

    const result = await cancelRentPayment({ userId: OTHER, transactionId: receipt.id });

    expect(result.ok).toBe(false);
    // Still a receipt for its real owner.
    expect(monthReceipts(store, LEASE, OCT).toFixed(2)).toBe("970.55");
  });

  it("keeps the cancelled row in the register rather than deleting it", async () => {
    const store = newStore({
      leases: [lease(LEASE, LANDLORD, "850.50", "120.05")],
      rows: [periodRow({ amount: "970.55" })],
    });

    await recordRentPayment({ userId: LANDLORD, leaseId: LEASE, duePeriodId: "period-oct", amount: "970.55" });
    const receipt = store.rows.find((r) => r.paidAt !== null)!;
    await cancelRentPayment({ userId: LANDLORD, transactionId: receipt.id });

    const after = store.rows.find((r) => r.id === receipt.id)!;
    expect(after).toBeDefined();
    expect(after.status).toBe("CANCELLED");
    // The amount and its date are the audit trail.
    expect(after.amount).toBe("970.55");
    expect(after.paidAt).not.toBeNull();
  });
});