import Decimal from "decimal.js";

/**
 * Format a monetary amount for display.
 *
 * Accepts `Decimal` as well as `number` so callers stop writing
 * `Number(tx.amount)` on a Prisma Decimal. That conversion is safe for a single
 * value but loses the 2-decimal guarantee once values are summed, and it invites
 * arithmetic on money. Decimal is reduced once, here, at the boundary.
 */
export function formatCurrency(
  amount: Decimal | number | string | null | undefined
): string {
  const value =
    amount instanceof Decimal
      ? amount.toDecimalPlaces(2).toNumber()
      : new Decimal(amount ?? 0).toDecimalPlaces(2).toNumber();

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}