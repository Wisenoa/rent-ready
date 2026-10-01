/**
 * Presentation helpers for rent periods.
 *
 * A period's lateness is derived from its due date and whether it has been paid,
 * never read from a stored status. Nothing in the codebase writes `LATE`, so any
 * UI that switches on `status` showed every overdue month as merely "En attente" —
 * verified at runtime: 3,200 EUR overdue, zero "En retard" labels on /billing.
 *
 * This module is the single place that decides how a period is described.
 */

import { settlePeriod, type RentPeriodStatus } from "@/lib/domain/rent-periods";
import Decimal from "decimal.js";

export interface PeriodLike {
  amount: Decimal | number | string;
  paidAt?: Date | null;
  dueDate: Date;
}

/** The status a landlord should see for this period. */
export function displayStatus(period: PeriodLike, now: Date = new Date()): RentPeriodStatus {
  const totalDue = new Decimal(period.amount);
  const paid = period.paidAt ? totalDue : new Decimal(0);
  return settlePeriod(totalDue, paid, period.dueDate, now).status;
}

/** Days past the due date, or 0 when not yet late. */
export function daysLate(dueDate: Date, now: Date = new Date()): number {
  return Math.max(
    0,
    Math.floor((now.getTime() - dueDate.getTime()) / 86_400_000)
  );
}

export interface StatusPresentation {
  label: string;
  className: string;
}

/** French labels, matching the wording a landlord expects. */
export const STATUS_PRESENTATION: Record<RentPeriodStatus, StatusPresentation> = {
  PAID: { label: "Payé", className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  PARTIAL: { label: "Partiel", className: "text-orange-700 bg-orange-50 border-orange-200" },
  DUE: { label: "À venir", className: "text-slate-700 bg-slate-50 border-slate-200" },
  UPCOMING: { label: "À venir", className: "text-slate-700 bg-slate-50 border-slate-200" },
  OVERDUE: { label: "En retard", className: "text-red-700 bg-red-50 border-red-200" },
};

/**
 * Legacy stored statuses, kept so existing paid/partial/cancelled rows still
 * render sensibly.
 */
export const STORED_STATUS_PRESENTATION: Record<string, StatusPresentation> = {
  PAID: STATUS_PRESENTATION.PAID,
  PARTIAL: STATUS_PRESENTATION.PARTIAL,
  PENDING: { label: "En attente", className: "text-amber-700 bg-amber-50 border-amber-200" },
  LATE: STATUS_PRESENTATION.OVERDUE,
  CANCELLED: { label: "Annulé", className: "text-gray-700 bg-gray-50 border-gray-200" },
};

/**
 * Presentation for a transaction row: derive lateness from the dates, and fall
 * back to the stored status for states that are not date-derived.
 */
export function presentTransaction(
  tx: { status: string; amount: Decimal | number | string; paidAt?: Date | null; dueDate: Date },
  now: Date = new Date()
): StatusPresentation {
  if (tx.status === "CANCELLED") {
    return STORED_STATUS_PRESENTATION.CANCELLED;
  }
  if (tx.paidAt) {
    return tx.status === "PARTIAL"
      ? STATUS_PRESENTATION.PARTIAL
      : STATUS_PRESENTATION.PAID;
  }
  return displayStatus(tx, now) === "OVERDUE"
    ? STATUS_PRESENTATION.OVERDUE
    : STATUS_PRESENTATION.DUE;
}