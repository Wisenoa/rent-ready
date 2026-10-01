/**
 * Canonical settlement decision for a rental period.
 *
 * Four code paths used to decide "is this period paid?" independently:
 * POST /api/payments, POST /api/transactions, the transaction server actions, and
 * the quittance action. Each computed it from a single payment's amount, so a
 * tenant paying rent in instalments was recorded as PARTIAL forever and never
 * reached PAID — which also meant a quittance was never issued. Patching each
 * call site would leave the same rule in four places, so it lives here instead.
 *
 * The rule: a period is settled when the total received for it reaches rent plus
 * charges for that period. Only payments recorded at or before `asOf` count,
 * because a receipt attests to the state at its own date and cannot certify
 * money that had not yet arrived.
 */

import Decimal from "decimal.js";

export interface PeriodPayment {
  amount: Decimal | number | string;
  /** When the payment was received. */
  paidAt: Date | null;
  createdAt?: Date;
}

export interface SettlementInput {
  rentAmount: Decimal | number | string;
  chargesAmount?: Decimal | number | string | null;
  /** Every payment recorded against the period, in any order. */
  payments: PeriodPayment[];
  /**
   * The payment being recorded, when deciding at write time. Its amount is what
   * gets split into rent/charges; `payments` should include it.
   */
  currentAmount?: Decimal | number | string | null;
  /** The moment being judged; defaults to now. */
  asOf?: Date;
}

export interface Settlement {
  /** Rent plus charges for the period. */
  totalDue: Decimal;
  /** Everything received for the period among the `payments` supplied. */
  paid: Decimal;
  /** totalDue - paid, never negative. */
  outstanding: Decimal;
  /** True when the period is covered in full. */
  settled: boolean;
  /** The period's stored status: PAID, or PARTIAL while any payment is short. */
  status: "PAID" | "PARTIAL";
  /** QUITTANCE once settled (loi du 6 juillet 1989, art. 21), RECU before that. */
  receiptType: "QUITTANCE" | "RECU";
  /** The individual payment's own share of rent and charges. */
  rentPortion: Decimal;
  chargesPortion: Decimal;
  isFullPayment: boolean;
}

/**
 * Decide a period's settlement. `payments` must be scoped to the period
 * (same lease, periodStart, periodEnd) by the caller.
 */
export function settlePeriodPayments(input: SettlementInput): Settlement {
  const rent = new Decimal(input.rentAmount);
  const charges = new Decimal(input.chargesAmount ?? 0);
  const totalDue = rent.plus(charges).toDecimalPlaces(2);

  const paid = input.payments
    .filter((p) => p.paidAt !== null)
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .toDecimalPlaces(2);

  const outstanding = Decimal.max(totalDue.minus(paid), new Decimal(0)).toDecimalPlaces(2);
  const settled = paid.gte(totalDue);

  // Split the payment being recorded: a payment that clears the period is
  // attributed in full to rent and charges rather than proportionally, so the two
  // portions always add back to the amount actually received.
  const current = new Decimal(
    input.currentAmount ?? (input.payments.length === 1 ? input.payments[0].amount : 0)
  );

  let rentPortion: Decimal;
  let chargesPortion: Decimal;
  if (current.gte(totalDue) || totalDue.isZero()) {
    rentPortion = rent;
    chargesPortion = charges;
  } else {
    rentPortion = current.times(rent).dividedBy(totalDue).toDecimalPlaces(2);
    chargesPortion = current.minus(rentPortion).toDecimalPlaces(2);
  }

  return {
    totalDue,
    paid,
    outstanding,
    settled,
    status: settled ? "PAID" : "PARTIAL",
    receiptType: settled ? "QUITTANCE" : "RECU",
    rentPortion,
    chargesPortion,
    isFullPayment: current.gte(totalDue),
  };
}

/**
 * The payments that count towards a decision made for `current`: those received
 * before it, ordered by paidAt with createdAt as the tiebreak for same-day
 * instalments. `current` is excluded from its own cumulative total.
 */
export function paymentsBefore<T extends { paidAt: Date | null; createdAt?: Date }>(
  payments: T[],
  current: { paidAt: Date | null; createdAt: Date }
): T[] {
  return payments.filter((p) => {
    if (p.paidAt === null) return false;
    if (p === current) return false;
    const pPaid = p.paidAt.getTime();
    const cPaid = current.paidAt ? current.paidAt.getTime() : Number.POSITIVE_INFINITY;
    if (pPaid < cPaid) return true;
    if (pPaid > cPaid) return false;
    // Same paidAt: fall back to creation order, which the API sets and which is
    // monotonic per row. Two instalments recorded the same day share paidAt, so
    // without this a later payment would leak into an earlier receipt.
    const pCreated = p.createdAt?.getTime() ?? 0;
    return pCreated < current.createdAt.getTime();
  });
}
