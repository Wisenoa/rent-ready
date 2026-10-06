/**
 * Recording a payment must never destroy the rent obligation, and must never
 * corrupt it when two payments land on the same month at once.
 *
 * `settleRentPeriod` used to overwrite the period row's `amount` with the payment
 * and set `paidAt` unconditionally. That is only correct when the payment clears
 * the month. Replayed on a real database with a 850.50 + 120.05 lease, a 400 EUR
 * payment rewrote the 970.55 EUR period as 400 EUR and closed it: the obligation
 * existed in no row any more, `computeDuePeriods` (which reads unpaid rows)
 * stopped offering October, and the remaining 570.55 EUR was uncollectable — the
 * dialog is the only caller of `createTransaction`.
 *
 * A second defect survived that fix: the write was guarded by `paidAt: null`
 * alone, so two DIFFERENT payments on the SAME month each read 970.55 owed and
 * each wrote 670.55. The month then claimed to owe 970.55 while 600 EUR had been
 * received — 300 EUR of rent had vanished, in the opposite direction from the
 * first bug and just as false. The write is now a compare-and-set on the balance
 * that was read, and the whole read-derive-write is retried when it loses.
 *
 * These run against the in-memory store in `payment-store.ts`, which applies the
 * same `where` clauses Prisma would, because "the month's receipts now add up to
 * what was owed" is not expressible as a hand-written mock return value.
 *
 * The invariants pinned here:
 *   - the period row keeps the obligation, and `paidAt` is set only when the
 *     payment actually discharges the balance;
 *   - what is still owed plus what was received always equals the month's total;
 *   - the closing payment carries the REMAINDER of rent and charges, so the rows
 *     sum to the rent and charges owed rather than counting an instalment twice.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import Decimal from "decimal.js";

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: null as unknown } }));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));

import { settleRentPeriod } from "@/lib/domain/generate-rent-periods";
import { createStore, lease, periodRow, type Store } from "./payment-store";

/** A 970.55 EUR October: 850.50 rent + 120.05 charges. */
const RENT = "850.50";
const CHARGES = "120.05";
const TOTAL = "970.55";

function store(): Store {
  return storeRef.current as Store;
}

const OCT = {
  periodStart: new Date("2026-10-01T00:00:00.000Z"),
  periodEnd: new Date("2026-10-31T00:00:00.000Z"),
};

function pay(amount: string, day = 5) {
  return { amount, paidAt: new Date(`2026-10-${String(day).padStart(2, "0")}T09:00:00.000Z`) };
}

/** The open period row, whatever balance it currently carries. */
function period(): { amount: string; paidAt: Date | null } {
  const row = store().rows.find((r) => r.id === "period-1")!;
  return { amount: row.amount, paidAt: row.paidAt };
}

/** The month's receipts: the rows that actually hold money. */
function received(): Decimal {
  return store()
    .rows.filter(
      (r) =>
        r.leaseId === "lease-1" &&
        r.periodStart.getTime() === OCT.periodStart.getTime() &&
        r.paidAt !== null &&
        r.status !== "CANCELLED"
    )
    .reduce((sum, r) => sum.plus(new Decimal(r.amount)), new Decimal(0));
}

/** What the fiscal report sums: the rent and charges actually received. */
function portions(): { rent: Decimal; charges: Decimal } {
  const rows = store().rows.filter(
    (r) =>
      r.leaseId === "lease-1" &&
      r.periodStart.getTime() === OCT.periodStart.getTime() &&
      r.paidAt !== null &&
      r.status !== "CANCELLED"
  );
  return {
    rent: rows.reduce((s, r) => s.plus(new Decimal(r.rentPortion)), new Decimal(0)),
    charges: rows.reduce((s, r) => s.plus(new Decimal(r.chargesPortion)), new Decimal(0)),
  };
}

/** Record a payment against the period and, when it is short, its receipt row. */
async function record(payment: { amount: string; day?: number }) {
  const result = await settleRentPeriod("period-1", pay(payment.amount, payment.day ?? 5));
  if (!result.applied) return { ...result, receiptId: null };
  if (result.closed) return { ...result, receiptId: null };
  // The caller records the money as its own row, which is what
  // `recordRentPayment` and the bank webhook both do.
  const settlement = result.settlement;
  const receipt = store().prisma as unknown as {
    transaction: {
      create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
    };
  };
  const created = await receipt.transaction.create({
    data: {
      userId: "landlord-1",
      leaseId: "lease-1",
      amount: Number(payment.amount),
      rentPortion: settlement.rentPortion.toNumber(),
      chargesPortion: settlement.chargesPortion.toNumber(),
      periodStart: OCT.periodStart,
      periodEnd: OCT.periodEnd,
      dueDate: OCT.periodStart,
      paidAt: new Date(`2026-10-${String(payment.day ?? 5).padStart(2, "0")}T09:00:00.000Z`),
      status: settlement.status,
      isFullPayment: settlement.isFullPayment,
      receiptType: settlement.receiptType,
    },
  });
  return { ...result, receiptId: created.id };
}

beforeEach(() => {
  storeRef.current = createStore({
    leases: [lease("lease-1", "landlord-1", RENT, CHARGES)],
    rows: [periodRow({
      id: "period-1",
      amount: TOTAL,
      // What generation writes: the month's own rent/charges split, not the whole
      // obligation in the rent column.
      invoicedRent: RENT,
      invoicedCharges: CHARGES,
    })],
  });
});

describe("settleRentPeriod — the obligation survives", () => {
  it("keeps the month open when the payment is short", async () => {
    // 400 of 970.55 owed. The period must stay UNPAID — setting paidAt here is
    // exactly what made the 570.55 EUR balance vanish from the dialog.
    const result = await record({ amount: "400", day: 12 });

    expect(result.applied).toBe(true);
    expect(result.closed).toBe(false);
    expect(period().paidAt).toBeNull();
    // The balance drops to what is still owed, so the dialog offers 570.55 and
    // not the original 970.55.
    expect(period().amount).toBe("570.55");
    expect(result.remaining.toFixed(2)).toBe("570.55");
  });

  it("closes the month when the payment clears the balance exactly", async () => {
    const result = await record({ amount: TOTAL });

    expect(result.closed).toBe(true);
    expect(period().paidAt).not.toBeNull();
    // A closing payment stores what it settled, so the month's PAID rows sum to
    // the rent actually received.
    expect(period().amount).toBe(TOTAL);
    expect(received().toFixed(2)).toBe(TOTAL);
  });

  it("closes the month when the payment exceeds the balance", async () => {
    const result = await record({ amount: "1000" });

    expect(result.applied).toBe(true);
    expect(result.closed).toBe(true);
  });

  it("treats a one-cent shortfall as still owing", async () => {
    // 970.54 of 970.55: one cent left, so the month is not discharged.
    const result = await record({ amount: "970.54" });

    expect(result.closed).toBe(false);
    expect(period().paidAt).toBeNull();
    expect(period().amount).toBe("0.01");
  });

  it("refuses a period that is no longer collectable", async () => {
    const row = store().rows.find((r) => r.id === "period-1")!;
    row.paidAt = new Date("2026-10-05T00:00:00.000Z");

    // The caller must be able to refuse rather than book the month twice.
    expect((await record({ amount: TOTAL })).applied).toBe(false);
  });

  it("guards the write on the balance it read, not only on paidAt", async () => {
    // The compare-and-set itself. Without `amount` in the where, two transfers on
    // the same month each believe they are the first and one overwrites the other.
    const calls: unknown[] = [];
    const tx = (store().prisma as unknown as { transaction: { updateMany: unknown } }).transaction;
    const original = tx.updateMany as (args: unknown) => Promise<{ count: number }>;
    tx.updateMany = async function patched(args: unknown) {
      calls.push(args);
      return original.call(this, args);
    };

    await record({ amount: "400", day: 12 });

    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      where: { id: "period-1", paidAt: null, amount: "970.55" },
    });
  });
});

describe("settleRentPeriod — two payments on the same month", () => {
  it("does not lose rent when both read the same balance", async () => {
    // THE CONCURRENCY DEFECT. Both settleRentPeriod calls read 970.55 owed before
    // either writes, exactly as two webhook deliveries racing would. Before the
    // compare-and-set, each wrote 670.55 and the month ended up owing 970.55 with
    // 600 EUR received: 300 EUR of rent disappeared.
    const [first, second] = await Promise.all([
      record({ amount: "300", day: 12 }),
      record({ amount: "300", day: 13 }),
    ]);

    expect(first.applied).toBe(true);
    expect(second.applied).toBe(true);
    // Both transfers are booked...
    expect(received().toFixed(2)).toBe("600.00");
    // ...and the balance is reduced by BOTH of them, once each.
    expect(new Decimal(period().amount).plus(received()).toFixed(2)).toBe(TOTAL);
    expect(period().amount).toBe("370.55");
  });

  it("keeps the balance exact across three racing payments", async () => {
    await Promise.all([
      record({ amount: "200", day: 10 }),
      record({ amount: "300", day: 11 }),
      record({ amount: "100", day: 12 }),
    ]);

    expect(new Decimal(period().amount).plus(received()).toFixed(2)).toBe(TOTAL);
  });

  it("closes the month when the racing instalments cover it exactly", async () => {
    await Promise.all([
      record({ amount: "500", day: 10 }),
      record({ amount: "470.55", day: 11 }),
    ]);

    // Whichever instalment won the compare-and-set, the loser re-read the reduced
    // balance and closed the month: the closed period row now carries the payment
    // that settled it, so it is itself one of the month's receipts.
    expect(period().paidAt).not.toBeNull();
    expect(received().toFixed(2)).toBe(TOTAL);
    // Exactly one receipt per transfer, and nothing beyond what was owed.
    expect(store().rows.filter((r) => r.paidAt !== null)).toHaveLength(2);
  });
});

describe("settleRentPeriod — rent and charges are attributed once", () => {
  it("the closing instalment carries the REMAINDER, not the full obligation", async () => {
    // 970.55 paid as 400 + 570.55. The closed row used to keep the obligation's own
    // 850.50 / 120.05 while the 400 EUR receipt had already written its own share on
    // its own row, so /fiscal/prepare summed 1201.02 of rent for 850.50 owed.
    await record({ amount: "400", day: 12 });
    const second = await record({ amount: "570.55", day: 28 });

    expect(second.closed).toBe(true);
    const totals = portions();
    // What was owed is what was counted — no phantom rent, no missing charges.
    expect(totals.rent.toFixed(2)).toBe(RENT);
    expect(totals.charges.toFixed(2)).toBe(CHARGES);
    // And the amounts still add up to the obligation itself.
    expect(received().toFixed(2)).toBe(TOTAL);
  });

  it("attributes a single full payment the whole rent and charges", async () => {
    await record({ amount: TOTAL });

    const totals = portions();
    expect(totals.rent.toFixed(2)).toBe(RENT);
    expect(totals.charges.toFixed(2)).toBe(CHARGES);
  });

  it("attributes three instalments without double counting", async () => {
    await record({ amount: "200", day: 10 });
    await record({ amount: "300", day: 15 });
    await record({ amount: "470.55", day: 28 });

    const totals = portions();
    expect(totals.rent.toFixed(2)).toBe(RENT);
    expect(totals.charges.toFixed(2)).toBe(CHARGES);
    expect(received().toFixed(2)).toBe(TOTAL);
  });
});
