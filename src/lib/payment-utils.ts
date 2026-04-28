/**
 * Pure payment utility functions — no React/JSX dependencies.
 * Importable from both Node (tests) and Edge/server environments.
 *
 * All monetary arithmetic uses Decimal.js for precision.
 * Prisma Decimal fields are returned as Decimal objects — convert with
 * toNumber() before using JavaScript arithmetic, or use the Decimal
 * arithmetic methods directly.
 */

import Decimal from "decimal.js";

/**
 * Determine receipt type based on amount paid.
 *
 * Règle métier strict (loi du 6 juillet 1989, art. 21):
 * - Paiement >= loyer + charges → "Quittance de loyer"
 * - Paiement < loyer + charges → "Reçu de paiement partiel"
 */
export function determineReceiptType(
  amountPaid: number | Decimal,
  rentAmount: number | Decimal,
  chargesAmount: number | Decimal
): "QUITTANCE" | "RECU" {
  const totalDue = new Decimal(rentAmount).plus(chargesAmount);
  return new Decimal(amountPaid).gte(totalDue) ? "QUITTANCE" : "RECU";
}

/**
 * Generate a sequential receipt number.
 * Format: QUI-2026-03-0001 or REC-2026-03-0001
 */
export function generateReceiptNumber(
  type: "QUITTANCE" | "RECU",
  date: Date,
  sequence: number
): string {
  const prefix = type === "QUITTANCE" ? "QUI" : "REC";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seq = String(sequence).padStart(4, "0");
  return `${prefix}-${year}-${month}-${seq}`;
}

/**
 * Compute proportional rent / charges split for a partial payment.
 *
 * rentPortion    = amount × (rentAmount / totalDue)
 * chargesPortion = amount - rentPortion
 *
 * Returns rounded values (2 decimal places) as numbers.
 */
export function computePaymentSplit(
  amount: number | Decimal,
  rentAmount: number | Decimal,
  chargesAmount: number | Decimal
): {
  rentPortion: number;
  chargesPortion: number;
  isFullPayment: boolean;
} {
  const a = new Decimal(amount);
  const r = new Decimal(rentAmount);
  const c = new Decimal(chargesAmount);
  const totalDue = r.plus(c);
  const isFullPayment = a.gte(totalDue);

  if (isFullPayment) {
    return { rentPortion: r.toNumber(), chargesPortion: c.toNumber(), isFullPayment: true };
  }

  const rentPortion = a.times(r).dividedBy(totalDue).toDecimalPlaces(2).toNumber();
  const chargesPortion = a.minus(rentPortion).toDecimalPlaces(2).toNumber();
  return { rentPortion, chargesPortion, isFullPayment: false };
}

/**
 * Count how many consecutive months from (currentYear, currentMonth)
 * are missing a PAID transaction.
 */
export function countMonthsOutstanding(
  transactions: Array<{
    periodStart: Date;
    status: "PAID" | "PARTIAL" | "PENDING" | "LATE";
  }>,
  currentYear: number,
  currentMonth: number
): number {
  const paidTx = transactions
    .filter((tx) => tx.status === "PAID")
    .sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());

  let monthsOutstanding = 0;
  let checkYear = currentYear;
  let checkMonth = currentMonth - 1;

  if (checkMonth < 0) {
    checkMonth = 11;
    checkYear -= 1;
  }

  while (true) {
    const paidForPeriod = paidTx.find((tx) => {
      const txStart = tx.periodStart;
      return txStart.getFullYear() === checkYear && txStart.getMonth() === checkMonth;
    });

    if (!paidForPeriod) {
      monthsOutstanding++;
      checkMonth--;
      if (checkMonth < 0) {
        checkMonth = 11;
        checkYear--;
      }
      if (monthsOutstanding >= 24) break;
    } else {
      break;
    }
  }

  return monthsOutstanding;
}
