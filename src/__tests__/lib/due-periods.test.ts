/**
 * What the payment dialog offers to collect.
 *
 * The regression this protects: a landlord paying October's rent on 5 November
 * had to type the period by hand and was pre-filled with the current month, so
 * the money landed on the wrong period and the quittance said the wrong thing.
 * The dialog now collects an obligation the ledger already holds.
 */

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  computeDuePeriods,
  formatPeriodLabel,
  toIsoDay,
  type DuePeriodRow,
} from "@/lib/domain/due-periods";

const NOW = new Date("2026-10-05T09:00:00.000Z");

function period(
  month: string,
  amount: number | string | Decimal,
  overrides: Partial<DuePeriodRow> = {}
): DuePeriodRow {
  const [year, m] = month.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return {
    id: `tx-${month}`,
    periodStart: new Date(Date.UTC(year, m - 1, 1)),
    periodEnd: new Date(Date.UTC(year, m - 1, lastDay)),
    dueDate: new Date(Date.UTC(year, m - 1, 3)),
    amount,
    paidAt: null,
    ...overrides,
  };
}

describe("computeDuePeriods", () => {
  it("returns nothing when the lease has no period at all", () => {
    expect(computeDuePeriods([], NOW)).toEqual([]);
  });

  it("returns nothing once every period is paid", () => {
    const rows = [
      period("2026-09", 740, { paidAt: new Date("2026-09-03T10:00:00.000Z") }),
      period("2026-10", 740, { paidAt: new Date("2026-10-03T10:00:00.000Z") }),
    ];
    expect(computeDuePeriods(rows, NOW)).toEqual([]);
  });

  it("offers only the unpaid period, oldest first", () => {
    const rows = [
      period("2026-10", "740"),
      period("2026-09", "740", { paidAt: new Date("2026-09-03T10:00:00.000Z") }),
      period("2026-08", "700"),
    ];

    const due = computeDuePeriods(rows, NOW);

    expect(due.map((p) => p.periodStart)).toEqual(["2026-08-01", "2026-10-01"]);
  });

  it("exposes the total owed as a decimal string, not a float", () => {
    const [p] = computeDuePeriods([period("2026-10", "850.5")], NOW);

    expect(p.totalDue).toBe("850.5");
    expect(p.remaining).toBe("850.5");
    expect(p.alreadyPaid).toBe("0");
  });

  it("rounds a repeating amount to cents instead of leaking float noise", () => {
    // 100 / 3 as a float is 33.333333333333336; Decimal keeps 33.33.
    const [p] = computeDuePeriods([period("2026-10", new Decimal(100).div(3))], NOW);
    expect(p.remaining).toBe("33.33");
  });

  it("prefills the remaining balance of a partially paid period", () => {
    // The shape settleRentPeriod actually produces for a partial payment: the
    // period row keeps the FULL obligation and stays unpaid, and the 400 EUR
    // arrives as its own sibling row. What the landlord is offered is the 300
    // still owed, not the 700 the month was originally worth.
    const rows = [
      period("2026-10", 700),
      {
        ...period("2026-10", 400),
        id: "tx-payment-1",
        paidAt: new Date("2026-10-03T10:00:00.000Z"),
      },
    ];

    const [p] = computeDuePeriods(rows, NOW);

    expect(p.totalDue).toBe("700");
    expect(p.alreadyPaid).toBe("400");
    expect(p.remaining).toBe("300");
    // Past its 3rd: the balance is late, which is what settlePeriod derives.
    expect(p.status).toBe("OVERDUE");
  });

  it("keeps offering the month after a partial payment that leaves the period unpaid", () => {
    // THE REGRESSION. settleRentPeriod used to overwrite the period's amount
    // (970.55 -> 400) and set paidAt, so the month vanished from the unpaid set
    // and the remaining 570.55 EUR could never be collected through any UI: the
    // dialog is the only entry point to createTransaction.
    const rows = [
      period("2026-10", "970.55"),
      {
        ...period("2026-10", 400),
        id: "tx-payment-1",
        paidAt: new Date("2026-10-03T10:00:00.000Z"),
      },
    ];

    const due = computeDuePeriods(rows, NOW);

    expect(due).toHaveLength(1);
    expect(due[0].remaining).toBe("570.55");
    expect(due[0].totalDue).toBe("970.55");
  });

  it("still offers the balance when two partial payments have landed", () => {
    const rows = [
      period("2026-10", "970.55"),
      { ...period("2026-10", 400), id: "tx-p1", paidAt: new Date("2026-10-03T10:00:00.000Z") },
      { ...period("2026-10", 100), id: "tx-p2", paidAt: new Date("2026-10-20T10:00:00.000Z") },
    ];

    const [p] = computeDuePeriods(rows, NOW);

    expect(p.alreadyPaid).toBe("500");
    expect(p.remaining).toBe("470.55");
  });

  it("drops a period whose balance is already covered by sibling rows", () => {
    const rows = [
      period("2026-10", 700),
      { ...period("2026-10", 700), id: "tx-payment-1", paidAt: new Date("2026-10-03T10:00:00.000Z") },
    ];
    expect(computeDuePeriods(rows, NOW)).toEqual([]);
  });

  it("never returns a negative remaining balance on overpayment", () => {
    const rows = [
      period("2026-10", 700),
      { ...period("2026-10", 900), id: "tx-payment-1", paidAt: new Date("2026-10-03T10:00:00.000Z") },
    ];
    // Overpaid: the period is settled, so there is nothing left to collect. The
    // balance sits on the payment row, not on an inviting negative amount.
    expect(computeDuePeriods(rows, NOW)).toEqual([]);
  });

  it("does not sum payments from a different month", () => {
    const rows = [
      period("2026-10", 700),
      {
        ...period("2026-09", 300),
        id: "tx-payment-sep",
        paidAt: new Date("2026-09-30T10:00:00.000Z"),
      },
    ];
    const [p] = computeDuePeriods(rows, NOW);
    expect(p.alreadyPaid).toBe("0");
    expect(p.remaining).toBe("700");
  });

  it("does not offer a period that has not started yet", () => {
    const rows = [period("2026-11", 740)];
    expect(computeDuePeriods(rows, NOW)).toEqual([]);
  });

  it("marks a period past its due date as overdue", () => {
    const [p] = computeDuePeriods([period("2026-09", 740)], NOW);
    expect(p.status).toBe("OVERDUE");
  });

  it("keeps a period on its first day", () => {
    const firstOfMonth = new Date("2026-10-01T00:00:00.000Z");
    expect(computeDuePeriods([period("2026-10", 740)], firstOfMonth)).toHaveLength(1);
  });
});

describe("toIsoDay", () => {
  it("drops the time part", () => {
    expect(toIsoDay(new Date("2026-10-31T23:59:59.999Z"))).toBe("2026-10-31");
  });
});

describe("formatPeriodLabel", () => {
  it("names the month in French", () => {
    expect(formatPeriodLabel("2026-10-01")).toBe("octobre 2026");
  });

  it("falls back to the raw value on an unparseable day", () => {
    expect(formatPeriodLabel("pas-une-date")).toBe("pas-une-date");
  });
});