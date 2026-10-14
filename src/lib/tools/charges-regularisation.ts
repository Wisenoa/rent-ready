/**
 * Annual regularisation of rental charges paid by provisions.
 *
 * Rules (checked 14/10/2026):
 * - Loi n° 89-462, art. 23: charges paid by provisions are regularised at least
 *   once a year; the landlord sends the breakdown by kind of charge a month
 *   before, and keeps the receipts available for six months.
 * - Art. 25-10 (furnished), 8-1 (colocation), 25-18 (bail mobilité): a forfait
 *   paid with the rent "ne peut donner lieu à complément ou à régularisation
 *   ultérieure". Bail mobilité is always a forfait; an unfurnished lease outside
 *   colocation always uses provisions (service-public.gouv.fr F947).
 * - Décret n° 87-713 du 26 août 1987: the closed list of recoverable charges.
 *
 * Computation: the tenant owes the recoverable charges of the period, prorated
 * to the days they occupied the dwelling when that was only part of it (the
 * usual method; a lease or a copropriété statement may use another key). The
 * balance is that share minus the provisions actually paid. Amounts are
 * Decimal throughout; the prorated share is rounded once, half up, to the cent.
 */
import Decimal from "decimal.js";

import { toCents } from "./amount";

export type ChargesRegime = "provisions" | "forfait";

const DAY_MS = 86_400_000;

/** "2025-03-14" → UTC midnight, or null when it is not a real calendar date. */
export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

/** Days from `start` to `end`, both included. */
export function daysInclusive(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
}

export interface RegularisationInput {
  periodStart: Date;
  periodEnd: Date;
  /** Null when the tenant occupied the dwelling for the whole period. */
  occupancy: { start: Date; end: Date } | null;
  /** Recoverable charges of the dwelling for the whole period. */
  charges: Decimal[];
  monthlyProvision: Decimal;
  monthsPaid: number;
}

export type RegularisationError =
  | "period-order"
  | "period-too-long"
  | "occupancy-order"
  | "occupancy-outside-period"
  | "months-invalid";

export const REGULARISATION_ERROR_MESSAGES: Record<RegularisationError, string> = {
  "period-order": "La fin de la période doit suivre son début.",
  "period-too-long": "La régularisation est au moins annuelle : indiquez une période d'un an au plus.",
  "occupancy-order": "La date de départ doit suivre la date d'arrivée.",
  "occupancy-outside-period": "Les dates d'occupation doivent se trouver dans la période régularisée.",
  "months-invalid": "Entre 0 et 12 mois, sans décimale.",
};

export type Direction = "tenant-owes" | "landlord-owes" | "balanced";

export interface RegularisationResult {
  periodDays: number;
  occupiedDays: number;
  prorated: boolean;
  chargesTotal: Decimal;
  tenantShare: Decimal;
  provisionsTotal: Decimal;
  /** Positive: the tenant owes it. Negative: the landlord pays it back. */
  balance: Decimal;
  direction: Direction;
  /** Charges of the period spread over twelve months, when the period is a year. */
  monthlyEquivalent: Decimal | null;
}

export function validateRegularisation(input: RegularisationInput): RegularisationError[] {
  const errors: RegularisationError[] = [];
  if (input.periodEnd.getTime() < input.periodStart.getTime()) errors.push("period-order");
  else if (daysInclusive(input.periodStart, input.periodEnd) > 366) errors.push("period-too-long");
  if (input.occupancy) {
    const { start, end } = input.occupancy;
    if (end.getTime() < start.getTime()) errors.push("occupancy-order");
    else if (start.getTime() < input.periodStart.getTime() || end.getTime() > input.periodEnd.getTime()) {
      errors.push("occupancy-outside-period");
    }
  }
  if (!Number.isInteger(input.monthsPaid) || input.monthsPaid < 0 || input.monthsPaid > 12) errors.push("months-invalid");
  return errors;
}

/** Call only with an input that `validateRegularisation` accepts. */
export function computeRegularisation(input: RegularisationInput): RegularisationResult {
  const periodDays = daysInclusive(input.periodStart, input.periodEnd);
  const occupiedDays = input.occupancy ? daysInclusive(input.occupancy.start, input.occupancy.end) : periodDays;
  const prorated = occupiedDays < periodDays;

  const chargesTotal = input.charges.reduce((sum, amount) => sum.plus(amount), new Decimal(0));
  const tenantShare = prorated ? toCents(chargesTotal.times(occupiedDays).dividedBy(periodDays)) : chargesTotal;
  const provisionsTotal = input.monthlyProvision.times(input.monthsPaid);
  const balance = tenantShare.minus(provisionsTotal);

  return {
    periodDays,
    occupiedDays,
    prorated,
    chargesTotal,
    tenantShare,
    provisionsTotal,
    balance,
    direction: balance.isZero() ? "balanced" : balance.isPositive() ? "tenant-owes" : "landlord-owes",
    monthlyEquivalent: periodDays >= 365 ? toCents(chargesTotal.dividedBy(12)) : null,
  };
}

/**
 * The example the calculator shows before anything is typed, also previewed on
 * /outils: a year of charges against twelve provisions of 100 €.
 */
export const REGULARISATION_EXAMPLE = {
  monthlyProvision: "100.00",
  monthsPaid: 12,
  lines: [
    { label: "Eau froide", amount: "180.00" },
    { label: "Ordures ménagères (TEOM)", amount: "165.00" },
    { label: "Entretien des parties communes", amount: "420.00" },
    { label: "Chauffage collectif", amount: "655.00" },
  ],
} as const;
