/**
 * The public IRL calculator: which indices a revision compares, and the revised
 * rent. The arithmetic is `calculateRentRevision` — the function the lease
 * revision screen uses — so the free tool and the product cannot disagree.
 *
 * Rule (loi n° 89-462, art. 17-1 I; service-public.gouv.fr F13723): the rent
 * may rise by at most the year-on-year change of the IRL of the reference
 * quarter written in the lease (or, failing that, the last index published at
 * signature). So a revision always compares one quarter with the same quarter
 * a year earlier, and the tool only offers pairs where both were published.
 *
 * Rounding: indices are used as published (two decimals) and the ratio is never
 * rounded; the new rent is rounded once, half up, to the cent. The variation
 * is the change of the index, rounded half up to two decimals as INSEE prints it.
 */
import Decimal from "decimal.js";

import { IRL_INDICES, calculateRentRevision, findIrlIndex, type IrlIndexEntry } from "@/lib/irl-calculator";

export type Trimester = 1 | 2 | 3 | 4;
export const TRIMESTERS: readonly Trimester[] = [1, 2, 3, 4];

export interface IndexPair {
  /** Index of the reference quarter in the revision year. */
  current: IrlIndexEntry;
  /** Same quarter one year earlier. */
  previous: IrlIndexEntry;
}

/** Revision pairs available for a quarter, latest first. */
export function revisionPairs(trimester: Trimester): IndexPair[] {
  return IRL_INDICES.filter((entry) => entry.trimester === trimester)
    .map((current) => ({ current, previous: findIrlIndex(`T${trimester}-${current.year - 1}`) }))
    .filter((pair): pair is IndexPair => pair.previous !== undefined)
    .reverse();
}

export function findPair(trimester: Trimester, year: number): IndexPair | undefined {
  return revisionPairs(trimester).find((pair) => pair.current.year === year);
}

/** Year-on-year change of the index, in percent, rounded half up to two decimals. */
export function indexVariation(pair: IndexPair): Decimal {
  return new Decimal(pair.current.value)
    .dividedBy(pair.previous.value)
    .minus(1)
    .times(100)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export interface RevisionResult {
  currentRent: Decimal;
  newRent: Decimal;
  monthlyDifference: Decimal;
  /** Twelve months at the revised rent, against twelve at the current one. */
  annualDifference: Decimal;
  variation: Decimal;
  pair: IndexPair;
}

export function reviseRent(currentRent: Decimal, pair: IndexPair): RevisionResult {
  const revision = calculateRentRevision({
    currentRent: currentRent.toFixed(2),
    referenceIrlQuarter: pair.previous.quarter,
    newIrlQuarter: pair.current.quarter,
  });
  const newRent = new Decimal(revision.newRent.toFixed(2));
  const monthlyDifference = newRent.minus(currentRent);
  return {
    currentRent,
    newRent,
    monthlyDifference,
    annualDifference: monthlyDifference.times(12),
    variation: indexVariation(pair),
    pair,
  };
}

/** "T2 2026" */
export function quarterShortLabel(entry: IrlIndexEntry): string {
  return `T${entry.trimester} ${entry.year}`;
}

const MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });

/** Month of publication: "juillet 2026". */
export function publicationMonth(entry: IrlIndexEntry): string {
  return MONTH_YEAR.format(new Date(`${entry.publicationDate}T00:00:00Z`));
}

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Where and when an index was published, as a landlord can cite it:
 * "publié au Journal officiel en juillet 2026", or "publié par l'INSEE le
 * 15 octobre 2026" while the Journal officiel publication is pending.
 */
export function publicationLabel(entry: IrlIndexEntry): string {
  if (entry.publishedBy === "insee") {
    const date = new Date(`${entry.publicationDate}T00:00:00Z`);
    const day = LONG_DATE.format(date);
    return `publié par l'INSEE le ${date.getUTCDate() === 1 ? day.replace(/^1 /, "1er ") : day}`;
  }
  return `publié au Journal officiel en ${publicationMonth(entry)}`;
}
