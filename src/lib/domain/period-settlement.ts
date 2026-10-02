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
 *
 * RENT / CHARGES ATTRIBUTION
 *
 * Each payment is attributed against what the previous ones left, in payment
 * order, and a payment that clears the balance takes exactly the remainder. This
 * matters fiscally: a 970.55 month (850.50 rent + 120.05 charges) paid as
 * 400 + 570.55 must attribute 350.52 + 499.98 of rent and 49.48 + 70.57 of
 * charges, so the rows sum to the rent and charges actually owed. Attributing the
 * closing payment the FULL contractual rent instead double-counted the instalment
 * already recorded on its own row (~350 EUR of phantom rent on the 2577 report).
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
   * The payment being recorded, when deciding at write time. It must be the same
   * object as the one in `payments`; its own rent/charges share is returned.
   * Compared by identity, not by amount: two instalments of the same value are
   * two different payments. Omit it to describe the last payment of the period.
   */
  current?: PeriodPayment;
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

interface Allocation {
  rent: Decimal;
  charges: Decimal;
  /** What is left of each after this payment. */
  rentLeft: Decimal;
  chargesLeft: Decimal;
}

/**
 * Attribute one payment against the rent and charges still unattributed.
 *
 * The two portions always add back to the payment's own amount. A payment that
 * covers the whole remainder (the normal instalment that closes the month) takes
 * exactly what is left; a payment larger than the remainder — an overpayment —
 * is spread over it in the same proportion, so no cent of the money received is
 * attributed to nothing.
 */
function allocate(
  amount: Decimal,
  rentLeft: Decimal,
  chargesLeft: Decimal
): Allocation {
  const left = rentLeft.plus(chargesLeft);
  if (amount.lte(0) || left.lte(0)) {
    return {
      rent: new Decimal(0),
      charges: new Decimal(0),
      rentLeft,
      chargesLeft,
    };
  }
  if (amount.gte(left)) {
    const rent = rentLeft.times(amount).dividedBy(left).toDecimalPlaces(2);
    return {
      rent,
      charges: amount.minus(rent),
      rentLeft: new Decimal(0),
      chargesLeft: new Decimal(0),
    };
  }
  const rent = amount.times(rentLeft).dividedBy(left).toDecimalPlaces(2);
  const charges = amount.minus(rent);
  return {
    rent,
    charges,
    rentLeft: Decimal.max(rentLeft.minus(rent), new Decimal(0)),
    chargesLeft: Decimal.max(chargesLeft.minus(charges), new Decimal(0)),
  };
}

/** Oldest first; `createdAt` breaks a same-day tie between two instalments. */
function byPaymentOrder(a: PeriodPayment, b: PeriodPayment): number {
  const aPaid = a.paidAt ? a.paidAt.getTime() : Number.POSITIVE_INFINITY;
  const bPaid = b.paidAt ? b.paidAt.getTime() : Number.POSITIVE_INFINITY;
  if (aPaid !== bPaid) return aPaid - bPaid;
  return (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
}

/**
 * Decide a period's settlement. `payments` must be scoped to the period
 * (same lease, periodStart, periodEnd) by the caller.
 */
export function settlePeriodPayments(input: SettlementInput): Settlement {
  const rent = new Decimal(input.rentAmount);
  const charges = new Decimal(input.chargesAmount ?? 0);
  const totalDue = rent.plus(charges).toDecimalPlaces(2);

  const received = input.payments.filter((p) => p.paidAt !== null);
  const paid = received
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .toDecimalPlaces(2);

  const outstanding = Decimal.max(totalDue.minus(paid), new Decimal(0)).toDecimalPlaces(2);
  const settled = paid.gte(totalDue);

  // The payment being decided, identified by identity so an instalment is never
  // confused with an identical one recorded earlier. A `current` the caller did
  // not include in `payments` is appended: attributing it is the point.
  const ordered = [...received].sort(byPaymentOrder);
  const sequence: PeriodPayment[] = input.current
    ? [...ordered, ...(ordered.includes(input.current) ? [] : [input.current])].sort(
        byPaymentOrder
      )
    : ordered;
  const current = input.current ?? ordered[ordered.length - 1];

  let rentLeft = rent;
  let chargesLeft = charges;
  let rentPortion = new Decimal(0);
  let chargesPortion = new Decimal(0);

  for (const p of sequence) {
    const allocation = allocate(
      new Decimal(p.amount).toDecimalPlaces(2),
      rentLeft,
      chargesLeft
    );
    rentLeft = allocation.rentLeft;
    chargesLeft = allocation.chargesLeft;
    if (p === current) {
      rentPortion = allocation.rent;
      chargesPortion = allocation.charges;
    }
  }

  const currentAmount = current
    ? new Decimal(current.amount).toDecimalPlaces(2)
    : new Decimal(0);

  return {
    totalDue,
    paid,
    outstanding,
    settled,
    status: settled ? "PAID" : "PARTIAL",
    receiptType: settled ? "QUITTANCE" : "RECU",
    rentPortion,
    chargesPortion,
    isFullPayment: currentAmount.gte(totalDue),
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
