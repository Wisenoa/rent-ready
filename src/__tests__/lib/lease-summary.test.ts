import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { summariseLease } from "@/lib/domain/lease-summary";

const NOW = new Date("2026-10-20T00:00:00Z");
const sep = (d: string) => new Date(`${d}T00:00:00Z`);

const unpaid = (due: string, amount: number | string) => ({
  amount,
  paidAt: null,
  dueDate: sep(due),
});
const paid = (due: string, amount: number | string, when = "2026-09-05") => ({
  amount,
  paidAt: sep(when),
  dueDate: sep(due),
});

describe("summariseLease", () => {
  it("returns zeroes for a lease with no transactions", () => {
    const s = summariseLease([], NOW);
    expect(s.collected.toString()).toBe("0");
    expect(s.outstanding.toString()).toBe("0");
    expect(s.overdueAmount.toString()).toBe("0");
    expect(s.overdueCount).toBe(0);
    expect(s.oldestOverdueDays).toBe(0);
  });

  it("counts unpaid periods as outstanding", () => {
    const s = summariseLease(
      [paid("2026-09-01", 900), unpaid("2026-10-01", 900)],
      NOW
    );
    expect(s.collected.toString()).toBe("900");
    expect(s.outstanding.toString()).toBe("900");
  });

  it("treats an unpaid period past its due date as overdue", () => {
    const s = summariseLease(
      [paid("2026-09-01", 900), unpaid("2026-10-01", 900)],
      NOW
    );
    expect(s.overdueCount).toBe(1);
    expect(s.overdueAmount.toString()).toBe("900");
    expect(s.oldestOverdueDays).toBe(19);
  });

  it("does not count an unpaid period that is not yet due as overdue", () => {
    // Due on the 25th, today is the 20th.
    const s = summariseLease([unpaid("2026-10-25", 900)], NOW);
    expect(s.outstanding.toString()).toBe("900");
    expect(s.overdueCount).toBe(0);
    expect(s.oldestOverdueDays).toBe(0);
  });

  it("reports the oldest unpaid period's lateness", () => {
    const s = summariseLease(
      [unpaid("2026-07-01", 900), unpaid("2026-08-01", 900), unpaid("2026-10-01", 900)],
      NOW
    );
    expect(s.overdueCount).toBe(3);
    expect(s.oldestOverdueDays).toBe(111); // 2026-07-01 -> 2026-10-20
  });

  it("never counts a settled period as overdue", () => {
    const s = summariseLease([paid("2026-07-01", 900)], NOW);
    expect(s.overdueCount).toBe(0);
    expect(s.overdueAmount.toString()).toBe("0");
    expect(s.collected.toString()).toBe("900");
  });

  it("keeps outstanding as a subset of everything unpaid", () => {
    const s = summariseLease(
      [
        paid("2026-08-01", 900),
        unpaid("2026-07-01", 900), // overdue
        unpaid("2026-10-25", 900), // not yet due
      ],
      NOW
    );
    expect(s.collected.toString()).toBe("900");
    expect(s.outstanding.toString()).toBe("1800");
    expect(s.overdueAmount.toString()).toBe("900");
    // The overdue portion can never exceed the outstanding total.
    expect(s.overdueAmount.lte(s.outstanding)).toBe(true);
  });

  it("sums without floating-point drift", () => {
    const rows = Array.from({ length: 300 }, () => unpaid("2026-10-01", "0.10"));
    const s = summariseLease(rows, NOW);
    expect(s.outstanding.toString()).toBe("30");
  });

  it("accepts Decimal amounts", () => {
    const s = summariseLease(
      [{ amount: new Decimal("900.55"), paidAt: null, dueDate: sep("2026-10-01") }],
      NOW
    );
    expect(s.outstanding.toString()).toBe("900.55");
    expect(s.overdueAmount.toString()).toBe("900.55");
  });

  it("returns exact 2dp money", () => {
    const s = summariseLease([unpaid("2026-10-01", "640.005")], NOW);
    expect(s.outstanding.toDecimalPlaces(2).toString()).toBe("640.01");
  });

  it("counts a cancelled receipt as neither collected nor owed", () => {
    // A cancelled row keeps its amount AND its paidAt for the audit trail, so
    // `paidAt` alone reported 900 EUR encaissés on a lease page when the money
    // had gone back. The door reopens the month with its own balance row, which
    // is what carries the debt.
    const s = summariseLease(
      [
        { ...paid("2026-09-01", "900"), status: "CANCELLED" },
        unpaid("2026-09-01", "900"),
        paid("2026-10-01", "300"),
      ],
      NOW
    );
    expect(s.collected.toString()).toBe("300");
    expect(s.outstanding.toString()).toBe("900");
  });
});