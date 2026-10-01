/**
 * Summarise a lease's payment position.
 *
 * Answers the question a landlord opens this page to ask: how much has been
 * paid, how much is still owed, and how long has it been late?
 *
 * Kept in the domain layer (and unit tested) rather than inline in the page,
 * because getting it wrong is how arrears became invisible in the first place.
 */

import Decimal from "decimal.js";
import { displayStatus, daysLate } from "@/lib/domain/period-presentation";

export interface LeaseTransaction {
  amount: Decimal | number | string;
  paidAt?: Date | null;
  dueDate: Date;
}

export interface LeaseSummary {
  /** Money actually received across every settled period. */
  collected: Decimal;
  /** Unpaid amounts still owed, regardless of lateness. */
  outstanding: Decimal;
  /** The subset of `outstanding` already past its due date. */
  overdueAmount: Decimal;
  /** How many periods are unpaid and past due. */
  overdueCount: number;
  /** Oldest unpaid period's lateness in days, or 0 when nothing is late. */
  oldestOverdueDays: number;
}

export function summariseLease(
  transactions: LeaseTransaction[],
  now: Date = new Date()
): LeaseSummary {
  const zero = new Decimal(0);

  if (transactions.length === 0) {
    return {
      collected: zero,
      outstanding: zero,
      overdueAmount: zero,
      overdueCount: 0,
      oldestOverdueDays: 0,
    };
  }

  let collected = zero;
  let outstanding = zero;
  let overdueAmount = zero;
  let overdueCount = 0;
  let oldestOverdueDays = 0;

  for (const tx of transactions) {
    const amount = new Decimal(tx.amount);

    if (tx.paidAt) {
      // Settled: this row carries what was received for its period.
      collected = collected.plus(amount);
      continue;
    }

    // Unpaid: the row still holds what is owed.
    outstanding = outstanding.plus(amount);

    if (displayStatus({ amount, paidAt: null, dueDate: tx.dueDate }, now) === "OVERDUE") {
      overdueAmount = overdueAmount.plus(amount);
      overdueCount += 1;
      const late = daysLate(tx.dueDate, now);
      if (late > oldestOverdueDays) oldestOverdueDays = late;
    }
  }

  return {
    collected: collected.toDecimalPlaces(2),
    outstanding: outstanding.toDecimalPlaces(2),
    overdueAmount: overdueAmount.toDecimalPlaces(2),
    overdueCount,
    oldestOverdueDays,
  };
}