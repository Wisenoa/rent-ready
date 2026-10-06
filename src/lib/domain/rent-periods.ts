/**
 * Rent period generation — the missing heart of the golden path.
 *
 * RentReady knew what a lease cost but never said what was *owed*. Nothing
 * created the `PENDING` / `LATE` rows that the dashboard's arrears figures, the
 * relance email flow, and the AI follow-up drafter all read. Every one of those
 * features therefore always saw "nothing overdue".
 *
 * A rent period is the obligation to pay rent + charges for one month. Payments
 * are recorded separately, and a period's status is DERIVED from what has been
 * paid against it — it is never written as a mutable flag. That keeps the
 * impossible states ("paid" for a month that was never generated) unrepresentable.
 */

import Decimal from "decimal.js";
import type { Prisma } from "@prisma/client";

export type RentPeriodStatus = "UPCOMING" | "DUE" | "PARTIAL" | "PAID" | "OVERDUE";

export interface RentPeriodShape {
  /** First day of the rental month (UTC). */
  periodStart: Date;
  /** Last day of the rental month (UTC). */
  periodEnd: Date;
  /** Date rent falls due: `paymentDay` clamped to the length of the month. */
  dueDate: Date;
  /** Rent + charges expected for the period. */
  totalDue: Decimal;
  rentDue: Decimal;
  chargesDue: Decimal;
}

export interface PeriodSettlement {
  status: RentPeriodStatus;
  /** Amount still outstanding, never negative. */
  outstanding: Decimal;
  settled: Decimal;
}

/** Number of days in a UTC month (month is 1-based). */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Build the rent period covering `month` for a lease.
 *
 * `month` is 1-based and clamped to the lease term, so a lease starting on the
 * 15th still yields a period for that month (prorated or not is a business
 * decision; this function returns the full contractual amount and leaves
 * proration to the caller).
 */
export function buildRentPeriod(
  lease: {
    rentAmount: Prisma.Decimal | Decimal | number | string;
    chargesAmount: Prisma.Decimal | Decimal | number | string;
    startDate: Date;
    endDate?: Date | null;
    paymentDay: number;
  },
  year: number,
  month: number
): RentPeriodShape | null {
  const rent = new Decimal(lease.rentAmount ?? 0);
  const charges = new Decimal(lease.chargesAmount ?? 0);

  if (rent.isNegative() || charges.isNegative()) {
    throw new Error(
      `Lease amounts must be non-negative (rent=${rent}, charges=${charges})`
    );
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));

  // A lease starting mid-month still owes rent for that month, so compare
  // months rather than days. Comparing `start < lease.startDate` wrongly
  // dropped the partial month (a lease starting the 15th owes rent for the 15th
  // onwards, and the period is still the calendar month).
  if (isBeforeMonth(start, lease.startDate)) return null;
  if (lease.endDate && isBeforeMonth(lease.endDate, start)) return null;

  // `paymentDay` is 1-based and may exceed the month length (paymentDay 31 in
  // February), so clamp rather than rolling into the next month.
  const day = Math.min(Math.max(lease.paymentDay, 1), daysInMonth(year, month));
  const dueDate = new Date(Date.UTC(year, month - 1, day));

  return {
    periodStart: start,
    periodEnd: end,
    dueDate,
    rentDue: rent,
    chargesDue: charges,
    totalDue: rent.plus(charges),
  };
}

/** True when `a` falls in a calendar month strictly before `b`'s. */
function isBeforeMonth(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() < b.getUTCFullYear() ||
    (a.getUTCFullYear() === b.getUTCFullYear() &&
      a.getUTCMonth() < b.getUTCMonth())
  );
}

/**
 * Every rent period owed for a lease between two dates (inclusive of months).
 * Used to backfill a lease and to run the monthly generation job.
 */
export function enumerateRentPeriods(
  lease: {
    rentAmount: Prisma.Decimal | Decimal | number | string;
    chargesAmount: Prisma.Decimal | Decimal | number | string;
    startDate: Date;
    endDate?: Date | null;
    paymentDay: number;
  },
  from: Date,
  to: Date
): RentPeriodShape[] {
  const out: RentPeriodShape[] = [];
  let year = from.getUTCFullYear();
  let month = from.getUTCMonth() + 1;

  const lastYear = to.getUTCFullYear();
  const lastMonth = to.getUTCMonth() + 1;

  // Bound the loop: a lease cannot span more than 240 months.
  for (let guard = 0; guard < 240; guard++) {
    if (year > lastYear || (year === lastYear && month > lastMonth)) break;
    const period = buildRentPeriod(lease, year, month);
    if (period) out.push(period);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return out;
}

/**
 * Derive a period's settlement from the payments allocated to it.
 *
 * This is the single source of truth for "is this month paid?". Nothing writes a
 * status: PAID requires the full total, and OVERDUE is simply DUE past its date.
 */
export function settlePeriod(
  totalDue: Decimal,
  paid: Decimal,
  dueDate: Date,
  now: Date = new Date()
): PeriodSettlement {
  const paidCents = paid.toDecimalPlaces(2);

  if (paidCents.gte(totalDue)) {
    return { status: "PAID", outstanding: new Decimal(0), settled: totalDue };
  }

  const outstanding = totalDue.minus(paidCents).toDecimalPlaces(2);
  const overdue = now.getTime() > dueDate.getTime();

  if (paidCents.gt(0)) {
    // Partially paid: overdue only matters for the balance still outstanding.
    return {
      status: overdue ? "OVERDUE" : "PARTIAL",
      outstanding,
      settled: paidCents,
    };
  }

  return {
    status: overdue ? "OVERDUE" : "DUE",
    outstanding,
    settled: new Decimal(0),
  };
}