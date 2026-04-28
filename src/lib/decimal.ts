/**
 * Decimal conversion utilities for Prisma Decimal fields.
 *
 * Prisma 7 returns Decimal fields as Decimal objects (from decimal.js).
 * These must be explicitly converted to number for use with Math.round(),
 * JSON serialization, and arithmetic in non-Prisma contexts.
 *
 * Prisma Decimal objects support .toNumber(), .toFixed(), and valueOf() for arithmetic,
 * but we convert explicitly at API boundaries to ensure type safety.
 *
 * For database writes, use the Decimal constructor directly:
 *   new Decimal(stringValue) — from form input or API params
 *   new Decimal(numberValue) — from existing numeric values
 */

import Decimal from "decimal.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (Decimal.isDecimal(value)) return value.toNumber();
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  return 0;
}

/**
 * Format a Decimal or number as a euro currency string.
 */
export function formatEuros(
  value: number | Decimal | string | null | undefined
): string {
  const n = typeof value === "number" ? value : toNumber(value);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

/**
 * Round a number to 2 decimal places (standard for currency).
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Convert any numeric input (string, number, Decimal) to a Decimal instance.
 * Use when writing Decimal fields to the database via Prisma.
 */
export function toDecimal(value: string | number | Decimal): Decimal {
  if (Decimal.isDecimal(value)) return value;
  return new Decimal(value);
}
