/**
 * Euro amounts typed into the public tools: parsing and French formatting.
 *
 * A landlord types "1 250,50", "1250.5", "800 €" or "1.250,50". The value is
 * parsed into a Decimal without ever going through a JavaScript float, so what
 * the calculation receives is exactly what was typed. Display goes through
 * `Intl.NumberFormat("fr-FR")` from a value already rounded to the cent.
 */
import Decimal from "decimal.js";

export type AmountError = "empty" | "invalid" | "negative" | "too-precise" | "too-large";

export type AmountParse = { ok: true; value: Decimal } | { ok: false; error: AmountError };

export const AMOUNT_ERROR_MESSAGES: Record<AmountError, string> = {
  empty: "Indiquez un montant.",
  invalid: "Saisissez un montant en euros, par exemple 850 ou 850,50.",
  negative: "Le montant ne peut pas être négatif.",
  "too-precise": "Indiquez au plus deux chiffres après la virgule.",
  "too-large": "Ce montant dépasse ce que l'outil accepte.",
};

// Regular, no-break and narrow no-break spaces: what a French keyboard, a copy
// from a PDF or `Intl.NumberFormat("fr-FR")` itself put between thousands.
const SPACES = /[\s  ]/g;

export function parseAmount(input: string, max: Decimal.Value = 10_000_000): AmountParse {
  let text = input.replace(SPACES, "").replace(/€$/, "").replace(/^€/, "");
  if (text === "") return { ok: false, error: "empty" };
  if (text.startsWith("-") || text.startsWith("−")) return { ok: false, error: "negative" };
  if (text.startsWith("+")) text = text.slice(1);

  // "1.250,50": dots are thousands separators when a comma marks the decimals.
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(text)) text = text.replace(/\./g, "");
  text = text.replace(",", ".");

  if (!/^\d+(\.\d+)?$/.test(text) && !/^\.\d+$/.test(text)) return { ok: false, error: "invalid" };
  const decimals = text.split(".")[1] ?? "";
  if (decimals.length > 2) return { ok: false, error: "too-precise" };

  const value = new Decimal(text);
  if (value.greaterThan(max)) return { ok: false, error: "too-large" };
  return { ok: true, value };
}

/** Round half away from zero to the cent: 0,005 € → 0,01 €. */
export function toCents(value: Decimal): Decimal {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

const EUROS = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** "1 250,50 €". The value is rounded to the cent first, then shown. */
export function formatEuros(value: Decimal): string {
  return EUROS.format(Number(toCents(value).toFixed(2)));
}

/** "+9,22 €", "−3,10 €", "0,00 €". Uses the real minus sign. */
export function formatSignedEuros(value: Decimal): string {
  const rounded = toCents(value);
  if (rounded.isZero()) return formatEuros(rounded.abs());
  return `${rounded.isNegative() ? "−" : "+"}${formatEuros(rounded.abs())}`;
}

/** "+1,15 %", "−0,42 %", "0,00 %". `percent` is already in percent (1.15 = 1,15 %). */
export function formatSignedPercent(percent: Decimal, digits = 2): string {
  const rounded = percent.toDecimalPlaces(digits, Decimal.ROUND_HALF_UP);
  const text = rounded.abs().toFixed(digits).replace(".", ",");
  if (rounded.isZero()) return `${text} %`;
  return `${rounded.isNegative() ? "−" : "+"}${text} %`;
}

/** An IRL value as INSEE prints it: "148,37". */
export function formatIndex(value: number): string {
  return new Decimal(value).toFixed(2).replace(".", ",");
}

/** Cents as an integer, for counters that animate between two amounts. */
export function centsOf(value: Decimal): number {
  return toCents(value).times(100).toNumber();
}
