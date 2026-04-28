/**
 * IRL Rent Revision Calculator
 *
 * Calculates the legal annual rent revision based on INSEE's
 * Indice de Référence des Loyers (IRL).
 *
 * Formula: New Rent = Current Rent × (New IRL / Reference IRL)
 *
 * Reference: Article 17-1 de la loi n°89-462 du 6 juillet 1989
 */

import Decimal from "decimal.js";
import { toDecimal } from "@/lib/decimal";

export interface IrlIndexEntry {
  quarter: string; // e.g. "T4-2025"
  year: number;
  trimester: number; // 1-4
  value: number;
}

// Known IRL values from INSEE (updated as published)
export const IRL_INDICES: IrlIndexEntry[] = [
  { quarter: "T1-2023", year: 2023, trimester: 1, value: 138.61 },
  { quarter: "T2-2023", year: 2023, trimester: 2, value: 140.59 },
  { quarter: "T3-2023", year: 2023, trimester: 3, value: 141.03 },
  { quarter: "T4-2023", year: 2023, trimester: 4, value: 142.06 },
  { quarter: "T1-2024", year: 2024, trimester: 1, value: 143.46 },
  { quarter: "T2-2024", year: 2024, trimester: 2, value: 144.21 },
  { quarter: "T3-2024", year: 2024, trimester: 3, value: 144.51 },
  { quarter: "T4-2024", year: 2024, trimester: 4, value: 144.89 },
  { quarter: "T1-2025", year: 2025, trimester: 1, value: 145.17 },
  { quarter: "T2-2025", year: 2025, trimester: 2, value: 145.34 },
  { quarter: "T3-2025", year: 2025, trimester: 3, value: 145.49 },
  { quarter: "T4-2025", year: 2025, trimester: 4, value: 145.78 },
];

export interface RentRevisionInput {
  currentRent: number;
  referenceIrlQuarter: string; // IRL at lease signature, e.g. "T4-2023"
  newIrlQuarter: string; // Current IRL quarter, e.g. "T4-2025"
}

export interface RentRevisionResult {
  currentRent: number;
  newRent: number;
  difference: number;
  percentageChange: number;
  referenceIrl: IrlIndexEntry;
  newIrl: IrlIndexEntry;
  formula: string;
}

/**
 * Find an IRL index entry by quarter string
 */
export function findIrlIndex(quarter: string): IrlIndexEntry | undefined {
  return IRL_INDICES.find((entry) => entry.quarter === quarter);
}

/**
 * Get the latest known IRL index
 */
export function getLatestIrl(): IrlIndexEntry {
  return IRL_INDICES[IRL_INDICES.length - 1];
}

/**
 * Calculate the revised rent based on IRL indices
 *
 * @throws Error if IRL indices are not found
 */
export function calculateRentRevision(
  input: RentRevisionInput
): RentRevisionResult {
  const referenceIrl = findIrlIndex(input.referenceIrlQuarter);
  if (!referenceIrl) {
    throw new Error(
      `IRL de référence introuvable pour le trimestre : ${input.referenceIrlQuarter}`
    );
  }

  const newIrl = findIrlIndex(input.newIrlQuarter);
  if (!newIrl) {
    throw new Error(
      `Nouvel IRL introuvable pour le trimestre : ${input.newIrlQuarter}`
    );
  }

  if (referenceIrl.value === 0) {
    throw new Error("La valeur de l'IRL de référence ne peut pas être zéro.");
  }

  // Use Decimal.js for precise monetary arithmetic
  const currentRent = toDecimal(input.currentRent);
  const newRentRaw = currentRent
    .times(newIrl.value)
    .dividedBy(referenceIrl.value);
  const newRent = newRentRaw.toDecimalPlaces(2).toNumber();

  const difference = newRentRaw.minus(currentRent).toDecimalPlaces(2).toNumber();
  const percentageChange = newRentRaw
    .minus(currentRent)
    .dividedBy(currentRent)
    .times(100)
    .toDecimalPlaces(2)
    .toNumber();

  return {
    currentRent: currentRent.toNumber(),
    newRent,
    difference,
    percentageChange,
    referenceIrl,
    newIrl,
    formula: `${currentRent.toNumber()} € × (${newIrl.value} / ${referenceIrl.value}) = ${newRent} €`,
  };
}

/**
 * Get available quarters for IRL selection
 */
export function getAvailableQuarters(): string[] {
  return IRL_INDICES.map((entry) => entry.quarter);
}

/**
 * Format a quarter for display in French
 */
export function formatQuarterLabel(quarter: string): string {
  const match = quarter.match(/^T(\d)-(\d{4})$/);
  if (!match) return quarter;
  const trimesterNames = [
    "1er trimestre",
    "2ème trimestre",
    "3ème trimestre",
    "4ème trimestre",
  ];
  return `${trimesterNames[parseInt(match[1]) - 1]} ${match[2]}`;
}
