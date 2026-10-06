import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  buildRentPeriod,
  enumerateRentPeriods,
  settlePeriod,
} from "@/lib/domain/rent-periods";

const lease = {
  rentAmount: 850,
  chargesAmount: 50,
  startDate: new Date("2026-09-15T00:00:00Z"),
  endDate: null,
  paymentDay: 1,
};

describe("buildRentPeriod", () => {
  it("creates a monthly period with the contractual amount", () => {
    const p = buildRentPeriod(lease, 2026, 10);
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString().slice(0, 10)).toBe("2026-10-01");
    expect(p!.periodEnd.toISOString().slice(0, 10)).toBe("2026-10-31");
    expect(p!.dueDate.toISOString().slice(0, 10)).toBe("2026-10-01");
    expect(p!.totalDue.toString()).toBe("900");
    expect(p!.rentDue.toString()).toBe("850");
    expect(p!.chargesDue.toString()).toBe("50");
  });

  it("includes the month the lease starts in", () => {
    expect(buildRentPeriod(lease, 2026, 9)).not.toBeNull();
  });

  it("refuses a period before the lease starts", () => {
    expect(buildRentPeriod(lease, 2026, 8)).toBeNull();
    expect(buildRentPeriod(lease, 2025, 12)).toBeNull();
  });

  it("stops at the lease end date", () => {
    const fixed = { ...lease, endDate: new Date("2026-11-30T00:00:00Z") };
    expect(buildRentPeriod(fixed, 2026, 11)).not.toBeNull();
    expect(buildRentPeriod(fixed, 2026, 12)).toBeNull();
  });

  it("clamps a payment day that exceeds the month length", () => {
    // 31 February does not exist: clamp to the last day rather than roll over
    // into March, which would silently push the due date a month late.
    const coversFeb = { ...lease, startDate: new Date("2026-01-01T00:00:00Z") };
    const p = buildRentPeriod({ ...coversFeb, paymentDay: 31 }, 2026, 2);
    expect(p!.dueDate.toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(p!.periodStart.toISOString().slice(0, 10)).toBe("2026-02-01");
  });

  it("handles a leap year", () => {
    const coversFeb = { ...lease, startDate: new Date("2028-01-01T00:00:00Z") };
    const p = buildRentPeriod({ ...coversFeb, paymentDay: 31 }, 2028, 2);
    expect(p!.dueDate.toISOString().slice(0, 10)).toBe("2028-02-29");
    expect(p!.periodEnd.toISOString().slice(0, 10)).toBe("2028-02-29");
  });

  it("clamps an out-of-range payment day", () => {
    expect(buildRentPeriod({ ...lease, paymentDay: 0 }, 2026, 10)!.dueDate
      .toISOString().slice(0, 10)).toBe("2026-10-01");
    expect(buildRentPeriod({ ...lease, paymentDay: 45 }, 2026, 10)!.dueDate
      .toISOString().slice(0, 10)).toBe("2026-10-31");
  });

  it("crosses a year boundary", () => {
    const p = buildRentPeriod(lease, 2027, 1);
    expect(p!.periodStart.toISOString().slice(0, 10)).toBe("2027-01-01");
    expect(p!.periodEnd.toISOString().slice(0, 10)).toBe("2027-01-31");
  });

  it("rejects negative amounts rather than producing a negative rent", () => {
    expect(() =>
      buildRentPeriod({ ...lease, rentAmount: -1 }, 2026, 10)
    ).toThrow(/non-negative/);
  });

  it("accepts zero rent (e.g. a rent-free lease)", () => {
    const p = buildRentPeriod({ ...lease, rentAmount: 0, chargesAmount: 0 }, 2026, 10);
    expect(p!.totalDue.toString()).toBe("0");
  });
});

describe("enumerateRentPeriods", () => {
  it("lists every month owed across a year boundary", () => {
    const periods = enumerateRentPeriods(
      { ...lease, startDate: new Date("2026-11-01T00:00:00Z") },
      new Date("2026-11-01T00:00:00Z"),
      new Date("2027-02-28T00:00:00Z")
    );
    expect(periods.map((p) => p.periodStart.toISOString().slice(0, 7))).toEqual([
      "2026-11",
      "2026-12",
      "2027-01",
      "2027-02",
    ]);
  });

  it("excludes months before the lease starts", () => {
    const periods = enumerateRentPeriods(
      { ...lease, startDate: new Date("2026-09-15T00:00:00Z") },
      new Date("2026-07-01T00:00:00Z"),
      new Date("2026-10-31T00:00:00Z")
    );
    expect(periods).toHaveLength(2);
  });
});

describe("settlePeriod", () => {
  const total = new Decimal("900");
  const due = new Date("2026-10-01T00:00:00Z");
  /** On the due date itself: not late yet. */
  const onDue = new Date("2026-10-01T00:00:00Z");
  /** After the due date: rent is late. */
  const late = new Date("2026-10-20T00:00:00Z");

  it("is PAID only when the full total is settled", () => {
    expect(settlePeriod(total, new Decimal("900"), due, onDue).status).toBe("PAID");
    expect(settlePeriod(total, new Decimal("1000"), due, onDue).status).toBe("PAID");
  });

  it("is never PAID for a partial payment — no quittance may be issued", () => {
    // Evaluated ON the due date, before any lateness.
    expect(settlePeriod(total, new Decimal("899.99"), due, onDue).status).not.toBe("PAID");
    expect(settlePeriod(total, new Decimal("400"), due, onDue).status).toBe("PARTIAL");
  });

  it("reports the outstanding balance", () => {
    const s = settlePeriod(total, new Decimal("400"), due, onDue);
    expect(s.outstanding.toString()).toBe("500");
    expect(settlePeriod(total, new Decimal("900"), due, onDue).outstanding.toString()).toBe("0");
  });

  it("never reports a negative balance", () => {
    const s = settlePeriod(total, new Decimal("1000"), due, onDue);
    expect(s.outstanding.toString()).toBe("0");
    expect(s.outstanding.isNegative()).toBe(false);
  });

  it("becomes OVERDUE once the due date has passed", () => {
    // Rent unpaid after the due date is late (loi du 6 juillet 1989).
    expect(settlePeriod(total, new Decimal("0"), due, late).status).toBe("OVERDUE");
    expect(settlePeriod(total, new Decimal("0"), due, onDue).status).toBe("DUE");
  });

  it("keeps a partially-paid period overdue only for its balance", () => {
    expect(settlePeriod(total, new Decimal("400"), due, late).status).toBe("OVERDUE");
    expect(settlePeriod(total, new Decimal("400"), due, onDue).status).toBe("PARTIAL");
    expect(settlePeriod(total, new Decimal("400"), due, late).outstanding.toString()).toBe("500");
  });

  it("is DUE before the due date and not yet overdue on the due date itself", () => {
    const onDue = new Date("2026-10-01T00:00:00Z");
    expect(settlePeriod(total, new Decimal("0"), onDue, onDue).status).toBe("DUE");
    expect(
      settlePeriod(total, new Decimal("0"), onDue, new Date("2026-10-01T00:00:01Z")).status
    ).toBe("OVERDUE");
  });

  it("handles a zero-rent lease", () => {
    const s = settlePeriod(new Decimal(0), new Decimal(0), due, onDue);
    expect(s.status).toBe("PAID");
    expect(s.outstanding.toString()).toBe("0");
  });
});