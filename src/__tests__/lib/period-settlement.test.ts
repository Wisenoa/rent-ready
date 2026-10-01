import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  settlePeriodPayments,
  paymentsBefore,
  type PeriodPayment,
} from "@/lib/domain/period-settlement";

const RENT = 700;
const CHARGES = 40;
const TOTAL = RENT + CHARGES; // 740

const day = (n: number) => new Date(`2026-10-${String(n).padStart(2, "0")}T10:00:00Z`);

const pay = (
  amount: number | string,
  paidDay: number,
  createdDay = paidDay
): PeriodPayment & { createdAt: Date } => ({
  amount,
  paidAt: day(paidDay),
  createdAt: day(createdDay),
});

describe("settlePeriodPayments", () => {
  it("treats a period with no payments as unpaid and outstanding in full", () => {
    const r = settlePeriodPayments({ rentAmount: RENT, chargesAmount: CHARGES, payments: [] });
    expect(r.totalDue.toString()).toBe("740");
    expect(r.paid.toString()).toBe("0");
    expect(r.outstanding.toString()).toBe("740");
    expect(r.settled).toBe(false);
    expect(r.status).toBe("PARTIAL");
    expect(r.receiptType).toBe("RECU");
  });

  it("settles a period paid in one payment", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES, payments: [pay(TOTAL, 3)],
    });
    expect(r.settled).toBe(true);
    expect(r.status).toBe("PAID");
    expect(r.receiptType).toBe("QUITTANCE");
    expect(r.outstanding.toString()).toBe("0");
  });

  it("does not settle a period one cent short", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES, payments: [pay(TOTAL - 0.01, 3)],
    });
    expect(r.settled).toBe(false);
    expect(r.outstanding.toString()).toBe("0.01");
    expect(r.receiptType).toBe("RECU");
  });

  // The defect this centralises: each payment used to be judged on its own
  // amount, so a period paid in instalments never reached PAID.
  it("settles a period paid in two instalments", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES,
      payments: [pay(400, 3), pay(340, 5)],
    });
    expect(r.paid.toString()).toBe("740");
    expect(r.settled).toBe(true);
    expect(r.status).toBe("PAID");
    expect(r.receiptType).toBe("QUITTANCE");
  });

  it("settles a period paid in three instalments", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES,
      payments: [pay(200, 2), pay(200, 4), pay(340, 6)],
    });
    expect(r.settled).toBe(true);
    expect(r.receiptType).toBe("QUITTANCE");
  });

  it("counts only payments that were actually received", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES,
      payments: [pay(TOTAL, 3), { amount: TOTAL, paidAt: null }],
    });
    expect(r.paid.toString()).toBe("740");
    expect(r.settled).toBe(true);
  });

  it("treats an overpayment as settled with no negative balance", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES, payments: [pay(TOTAL + 100, 3)],
    });
    expect(r.settled).toBe(true);
    expect(r.outstanding.toString()).toBe("0");
    expect(r.outstanding.isNegative()).toBe(false);
  });

  it("splits a partial payment proportionally, and the portions add back up", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES, payments: [pay(TOTAL / 2, 3)],
    });
    // Half of 740: rent 350, charges 20.
    expect(r.rentPortion.toString()).toBe("350");
    expect(r.chargesPortion.toString()).toBe("20");
    expect(r.rentPortion.plus(r.chargesPortion).toString()).toBe("370");
    expect(r.isFullPayment).toBe(false);
  });

  it("attributes a clearing payment to rent and charges in full", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES, payments: [pay(TOTAL, 3)],
    });
    expect(r.rentPortion.toString()).toBe("700");
    expect(r.chargesPortion.toString()).toBe("40");
    expect(r.isFullPayment).toBe(true);
  });

  it("never lets float drift accumulate", () => {
    const r = settlePeriodPayments({
      rentAmount: RENT, chargesAmount: CHARGES,
      payments: Array.from({ length: 30 }, () => pay("0.01", 3)),
    });
    expect(r.paid.toString()).toBe("0.3");
    expect(r.outstanding.toString()).toBe("739.7");
  });

  it("handles a period with no charges", () => {
    const r = settlePeriodPayments({ rentAmount: 700, chargesAmount: 0, payments: [pay(700, 3)] });
    expect(r.settled).toBe(true);
    expect(r.totalDue.toString()).toBe("700");
  });

  it("accepts Decimal amounts throughout", () => {
    const r = settlePeriodPayments({
      rentAmount: new Decimal("700"), chargesAmount: new Decimal("40"),
      payments: [{ amount: new Decimal("740"), paidAt: day(3) }],
    });
    expect(r.settled).toBe(true);
  });
});

describe("paymentsBefore", () => {
  it("excludes the payment being decided from its own total", () => {
    const a = pay(400, 3);
    const b = pay(340, 5);
    const prior = paymentsBefore([a, b], b);
    expect(prior).toEqual([a]);
    expect(prior.map((p) => p.amount)).toEqual([400]);
  });

  it("never counts a later payment", () => {
    const earlier = pay(510, 3);
    const later = pay(390, 5);
    // Deciding the earlier payment must not see the later one.
    const prior = paymentsBefore([earlier, later], earlier);
    expect(prior).toEqual([]);
  });

  it("breaks a same-day tie with createdAt", () => {
    // Two instalments recorded the same day share paidAt; without createdAt the
    // later one would leak into the earlier payment's receipt.
    const first = pay(400, 3, 3);
    const second = pay(340, 3, 4); // same paidAt day, later creation
    expect(paymentsBefore([first, second], second)).toEqual([first]);
    expect(paymentsBefore([first, second], first)).toEqual([]);
  });

  it("ignores payments with no paidAt", () => {
    const unpaid = { amount: 900, paidAt: null, createdAt: day(1) };
    const current = pay(900, 5);
    expect(paymentsBefore([unpaid, current], current)).toEqual([]);
  });
});
