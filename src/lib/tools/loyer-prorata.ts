/**
 * Calculateur de loyer (au m² + encadrement des loyers) et calculateur de
 * prorata de loyer (entrée ou sortie en cours de mois).
 *
 * Références réglementaires :
 * - Prorata temporis : calcul en jours calendaires réels du mois (28, 29, 30 ou
 *   31 jours) ou selon la convention du trentième (30 jours). Les jours d'entrée
 *   et de remise des clés sont inclus.
 * - Décret n° 2002-120 du 30 janvier 2002 : un logement décent doit disposer
 *   d'au moins une pièce principale ayant une surface habitable ≥ 9 m² (ou un
 *   volume habitable ≥ 20 m³).
 * - Article 140 de la loi ELAN n° 2018-1021 du 23 novembre 2018 : dans les
 *   communes soumises à l'encadrement du niveau des loyers, le loyer hors
 *   charges de base ne peut excéder le loyer de référence majoré (+20 % du
 *   loyer de référence), hors complément de loyer justifié.
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";
import { daysInMonth, formatIsoDateFr, MOIS_FR } from "./quittance-document";

export type ConventionProrata = "jours-reels" | "trentieme";

export interface ProrataLoyerInput {
  loyerMensuelHc: Decimal;
  chargesMensuelles: Decimal;
  dateDebut: string; // YYYY-MM-DD
  dateFin: string; // YYYY-MM-DD
  convention: ConventionProrata;
}

export type ProrataLoyerError =
  | "zero-rent"
  | "invalid-dates"
  | "end-before-start"
  | "different-months";

export const PRORATA_LOYER_ERROR_MESSAGES: Record<ProrataLoyerError, string> = {
  "zero-rent": "Indiquez un loyer mensuel hors charges supérieur à 0 €.",
  "invalid-dates": "Saisissez une date de début et une date de fin valides.",
  "end-before-start": "La date de fin d'occupation doit être postérieure ou égale à la date de début.",
  "different-months":
    "Le prorata se calcule mois par mois : choisissez deux dates situées dans le même mois calendaire.",
};

export interface ProrataLoyerComputed {
  moisLabel: string;
  annee: number;
  dateDebutFr: string;
  dateFinFr: string;
  joursOccupes: number;
  joursDansMois: number;
  diviseur: number;
  convention: ConventionProrata;
  loyerMensuelHc: Decimal;
  chargesMensuelles: Decimal;
  totalMensuelCc: Decimal;
  loyerProrataHc: Decimal;
  chargesProrata: Decimal;
  totalProrataCc: Decimal;
  totalProrataCents: number;
  differenceMensuel: Decimal;
}

export type ProrataLoyerOutcome =
  | { ok: true; result: ProrataLoyerComputed }
  | { ok: false; error: ProrataLoyerError };

function parseYmd(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) return null;
  return { year, month, day };
}

export function computeProrataLoyer(input: ProrataLoyerInput): ProrataLoyerOutcome {
  if (input.loyerMensuelHc.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-rent" };
  }
  const start = parseYmd(input.dateDebut);
  const end = parseYmd(input.dateFin);
  if (!start || !end) {
    return { ok: false, error: "invalid-dates" };
  }
  if (start.year !== end.year || start.month !== end.month) {
    return { ok: false, error: "different-months" };
  }
  if (end.day < start.day) {
    return { ok: false, error: "end-before-start" };
  }

  const joursDansMois = daysInMonth(start.month, start.year);
  const joursOccupesCalendaire = end.day - start.day + 1;

  const diviseur = input.convention === "trentieme" ? 30 : joursDansMois;
  const joursOccupes =
    input.convention === "trentieme" && joursOccupesCalendaire === joursDansMois
      ? 30
      : input.convention === "trentieme"
        ? Math.min(30, joursOccupesCalendaire)
        : joursOccupesCalendaire;

  const loyerMensuelHc = toCents(input.loyerMensuelHc);
  const chargesMensuelles = toCents(input.chargesMensuelles);
  const totalMensuelCc = toCents(loyerMensuelHc.plus(chargesMensuelles));

  const ratio =
    joursOccupes === diviseur
      ? new Decimal(1)
      : new Decimal(joursOccupes).dividedBy(diviseur);

  const loyerProrataHc = toCents(loyerMensuelHc.times(ratio));
  const chargesProrata = toCents(chargesMensuelles.times(ratio));
  const totalProrataCc = toCents(loyerProrataHc.plus(chargesProrata));
  const differenceMensuel = toCents(totalMensuelCc.minus(totalProrataCc));

  return {
    ok: true,
    result: {
      moisLabel: `${MOIS_FR[start.month - 1]} ${start.year}`,
      annee: start.year,
      dateDebutFr: formatIsoDateFr(input.dateDebut),
      dateFinFr: formatIsoDateFr(input.dateFin),
      joursOccupes,
      joursDansMois,
      diviseur,
      convention: input.convention,
      loyerMensuelHc,
      chargesMensuelles,
      totalMensuelCc,
      loyerProrataHc,
      chargesProrata,
      totalProrataCc,
      totalProrataCents: centsOf(totalProrataCc),
      differenceMensuel,
    },
  };
}

export interface LoyerM2Input {
  surfaceHabitable: Decimal;
  prixM2Hc: Decimal;
  chargesMensuelles: Decimal;
  loyerReferenceM2?: Decimal | null;
}

export type LoyerM2Error = "zero-surface" | "zero-price-m2";

export const LOYER_M2_ERROR_MESSAGES: Record<LoyerM2Error, string> = {
  "zero-surface": "Indiquez une surface habitable supérieure à 0 m².",
  "zero-price-m2": "Indiquez un loyer hors charges au m² supérieur à 0 €.",
};

export interface LoyerM2Computed {
  surfaceHabitable: Decimal;
  alerteSurfaceDecence: boolean;
  prixM2Hc: Decimal;
  loyerMensuelHc: Decimal;
  chargesMensuelles: Decimal;
  loyerMensuelCc: Decimal;
  loyerMensuelHcCents: number;
  loyerAnnuelHc: Decimal;
  loyerAnnuelCc: Decimal;
  encadrement: {
    loyerReferenceM2: Decimal;
    loyerReferenceMajoreM2: Decimal;
    loyerReferenceMinoreM2: Decimal;
    plafondMensuelHc: Decimal;
    plancherMensuelHc: Decimal;
    depassementHc: Decimal;
    conformePlafond: boolean;
  } | null;
}

export type LoyerM2Outcome =
  | { ok: true; result: LoyerM2Computed }
  | { ok: false; error: LoyerM2Error };

export function computeLoyerM2(input: LoyerM2Input): LoyerM2Outcome {
  if (input.surfaceHabitable.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-surface" };
  }
  if (input.prixM2Hc.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-price-m2" };
  }

  const surfaceHabitable = input.surfaceHabitable.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const prixM2Hc = toCents(input.prixM2Hc);
  const chargesMensuelles = toCents(input.chargesMensuelles);

  const loyerMensuelHc = toCents(surfaceHabitable.times(prixM2Hc));
  const loyerMensuelCc = toCents(loyerMensuelHc.plus(chargesMensuelles));
  const loyerAnnuelHc = toCents(loyerMensuelHc.times(12));
  const loyerAnnuelCc = toCents(loyerMensuelCc.times(12));

  let encadrement: LoyerM2Computed["encadrement"] = null;
  if (input.loyerReferenceM2 && input.loyerReferenceM2.greaterThan(0)) {
    const refM2 = toCents(input.loyerReferenceM2);
    const majoreM2 = toCents(refM2.times(new Decimal("1.2")));
    const minoreM2 = toCents(refM2.times(new Decimal("0.7")));
    const plafondMensuelHc = toCents(surfaceHabitable.times(majoreM2));
    const plancherMensuelHc = toCents(surfaceHabitable.times(minoreM2));
    const depassementHc = loyerMensuelHc.greaterThan(plafondMensuelHc)
      ? toCents(loyerMensuelHc.minus(plafondMensuelHc))
      : new Decimal(0);

    encadrement = {
      loyerReferenceM2: refM2,
      loyerReferenceMajoreM2: majoreM2,
      loyerReferenceMinoreM2: minoreM2,
      plafondMensuelHc,
      plancherMensuelHc,
      depassementHc,
      conformePlafond: depassementHc.isZero(),
    };
  }

  return {
    ok: true,
    result: {
      surfaceHabitable,
      alerteSurfaceDecence: surfaceHabitable.lessThan(9),
      prixM2Hc,
      loyerMensuelHc,
      chargesMensuelles,
      loyerMensuelCc,
      loyerMensuelHcCents: centsOf(loyerMensuelHc),
      loyerAnnuelHc,
      loyerAnnuelCc,
      encadrement,
    },
  };
}
