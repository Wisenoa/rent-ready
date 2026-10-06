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
  /** Date of publication in the Journal officiel (YYYY-MM-DD). */
  publicationDate: string;
}

/**
 * Known IRL values, transcribed from the official INSEE series
 * « Indice de référence des loyers (IRL) », idBank 001515333,
 * https://www.insee.fr/fr/statistiques/serie/001515333
 * (France métropolitaine, base 100 au 4e trimestre 1998).
 *
 * Transcribed 2026-10-04. The `publicationDate` is the date of publication in
 * the Journal officiel, which is what a landlord can cite.
 *
 * FIVE OF THESE VALUES WERE WRONG BEFORE 2026-10-04 and the tests did not catch
 * it: they asserted the shape of the array, never its values. Both 2026 quarters
 * were also missing, so `getLatestIrl()` — the value the revision cron and the
 * revision screen use — returned T4-2025 and could not apply the current index
 * at all. Any future edit must be checked against the INSEE series, and
 * `irl-calculator.test.ts` now pins these values by number.
 */
export const IRL_INDICES: IrlIndexEntry[] = [
  { quarter: "T1-2020", year: 2020, trimester: 1, value: 130.57, publicationDate: "2020-06-25" },
  { quarter: "T2-2020", year: 2020, trimester: 2, value: 130.57, publicationDate: "2020-10-16" },
  { quarter: "T3-2020", year: 2020, trimester: 3, value: 130.59, publicationDate: "2020-10-16" },
  { quarter: "T4-2020", year: 2020, trimester: 4, value: 130.52, publicationDate: "2021-01-17" },
  { quarter: "T1-2021", year: 2021, trimester: 1, value: 130.69, publicationDate: "2021-04-17" },
  { quarter: "T2-2021", year: 2021, trimester: 2, value: 131.12, publicationDate: "2021-07-16" },
  { quarter: "T3-2021", year: 2021, trimester: 3, value: 131.67, publicationDate: "2021-10-16" },
  { quarter: "T4-2021", year: 2021, trimester: 4, value: 132.62, publicationDate: "2022-01-15" },
  { quarter: "T1-2022", year: 2022, trimester: 1, value: 133.93, publicationDate: "2022-04-16" },
  { quarter: "T2-2022", year: 2022, trimester: 2, value: 135.84, publicationDate: "2022-07-16" },
  { quarter: "T3-2022", year: 2022, trimester: 3, value: 136.27, publicationDate: "2022-10-15" },
  { quarter: "T4-2022", year: 2022, trimester: 4, value: 137.26, publicationDate: "2023-01-31" },
  { quarter: "T1-2023", year: 2023, trimester: 1, value: 138.61, publicationDate: "2023-04-16" },
  { quarter: "T2-2023", year: 2023, trimester: 2, value: 140.59, publicationDate: "2023-07-16" },
  { quarter: "T3-2023", year: 2023, trimester: 3, value: 141.03, publicationDate: "2023-10-14" },
  { quarter: "T4-2023", year: 2023, trimester: 4, value: 142.06, publicationDate: "2024-01-18" },
  { quarter: "T1-2024", year: 2024, trimester: 1, value: 143.46, publicationDate: "2024-06-01" },
  { quarter: "T2-2024", year: 2024, trimester: 2, value: 145.17, publicationDate: "2024-07-18" },
  { quarter: "T3-2024", year: 2024, trimester: 3, value: 144.51, publicationDate: "2024-10-16" },
  { quarter: "T4-2024", year: 2024, trimester: 4, value: 144.64, publicationDate: "2025-01-16" },
  { quarter: "T1-2025", year: 2025, trimester: 1, value: 145.47, publicationDate: "2025-04-16" },
  { quarter: "T2-2025", year: 2025, trimester: 2, value: 146.68, publicationDate: "2025-07-13" },
  { quarter: "T3-2025", year: 2025, trimester: 3, value: 145.77, publicationDate: "2025-10-17" },
  { quarter: "T4-2025", year: 2025, trimester: 4, value: 145.78, publicationDate: "2026-01-16" },
  { quarter: "T1-2026", year: 2026, trimester: 1, value: 146.60, publicationDate: "2026-04-16" },
  { quarter: "T2-2026", year: 2026, trimester: 2, value: 148.37, publicationDate: "2026-07-12" },
];

/** Canonical URL a landlord can verify the index against. */
export const IRL_SOURCE_URL = "https://www.insee.fr/fr/statistiques/serie/001515333";

export interface RentRevisionInput {
  /**
   * Decimal is accepted because callers pass `lease.rentAmount` from Prisma
   * directly. The function body already normalises with `toDecimal`, so the type
   * was narrower than what the arithmetic actually supports — and the mismatch
   * was reported at every call site instead of here.
   */
  currentRent: Decimal | number | string;
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
 * Get the latest known IRL index.
 *
 * `getLatestIrl()` drives the revision cron and the revision screen, so a stale
 * table here means RentReady silently under-revises a real lease. It reads the
 * last array element, which is only the latest index if the table is sorted
 * ascending — `irl-calculator.test.ts` asserts that ordering and pins the
 * latest quarter, so a future edit that reorders or truncates the table fails
 * the suite instead of quietly mispricing rent.
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
