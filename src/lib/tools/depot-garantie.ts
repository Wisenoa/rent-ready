/**
 * Calculateur de dépôt de garantie : plafond légal à la signature du bail et
 * calcul de la restitution, de la retenue provisoire en copropriété (20 % max)
 * et de la pénalité légale de retard (10 % du loyer mensuel hors charges par
 * mois commencé).
 *
 * Références légales :
 * - Article 22 de la loi n° 89-462 du 6 juillet 1989 (location vide : 1 mois HC,
 *   délais de restitution de 1 ou 2 mois, retenue en copropriété de 20 %,
 *   pénalité de 10 % du loyer mensuel hors charges par période mensuelle
 *   commencée en retard).
 * - Article 25-6 de la loi n° 89-462 (location meublée : 2 mois de loyer HC,
 *   quelle que soit la commune, zone tendue ou non).
 * - Article 25-17 de la loi n° 89-462 (bail mobilité : dépôt de garantie
 *   interdit, plafond 0 €).
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export type TypeBailDepot = "vide" | "meublee" | "mobilite";
export type PeriodiciteLoyer = "mensuel" | "plus-de-deux-mois";
export type ConformiteEtatLieux = "conforme" | "differences";

export interface DepotGarantieInput {
  typeBail: TypeBailDepot;
  periodicite: PeriodiciteLoyer;
  loyerMensuelHc: Decimal;
  conformiteEdl: ConformiteEtatLieux;
  enCopropriete: boolean;
  retenuesJustifiees: Decimal;
  moisRetardRestitution: number; // 0..24 périodes mensuelles commencées en retard
}

export type DepotGarantieError = "zero-rent" | "invalid-delay";

export const DEPOT_GARANTIE_ERROR_MESSAGES: Record<DepotGarantieError, string> = {
  "zero-rent": "Indiquez un loyer mensuel hors charges supérieur à 0 €.",
  "invalid-delay": "Le nombre de mois de retard doit être compris entre 0 et 36.",
};

export interface DepotGarantieComputed {
  typeBail: TypeBailDepot;
  nbMoisPlafond: 0 | 1 | 2;
  motifInterdiction: string | null;
  loyerMensuelHc: Decimal;
  plafondLegal: Decimal;
  plafondLegalCents: number;
  delaiRestitutionMois: 1 | 2;
  provisionMaxCopropriete: Decimal;
  retenuesJustifiees: Decimal;
  soldeRestitueHorsPenalite: Decimal;
  complementDuParLocataire: Decimal;
  moisRetardRestitution: number;
  penaliteParMois: Decimal;
  penaliteTotaleRetard: Decimal;
  totalAPayerAuLocataire: Decimal;
  totalAPayerAuLocataireCents: number;
}

export type DepotGarantieOutcome =
  | { ok: true; result: DepotGarantieComputed }
  | { ok: false; error: DepotGarantieError };

export function computeDepotGarantie(input: DepotGarantieInput): DepotGarantieOutcome {
  if (input.loyerMensuelHc.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-rent" };
  }
  if (!Number.isInteger(input.moisRetardRestitution) || input.moisRetardRestitution < 0 || input.moisRetardRestitution > 36) {
    return { ok: false, error: "invalid-delay" };
  }

  const loyerHc = toCents(input.loyerMensuelHc);
  const retenues = toCents(input.retenuesJustifiees);

  let nbMoisPlafond: 0 | 1 | 2 = 1;
  let motifInterdiction: string | null = null;

  if (input.typeBail === "mobilite") {
    nbMoisPlafond = 0;
    motifInterdiction =
      "Aucun dépôt de garantie ne peut être exigé par le bailleur dans le cadre d'un bail mobilité (article 25-17 de la loi du 6 juillet 1989).";
  } else if (input.periodicite === "plus-de-deux-mois") {
    nbMoisPlafond = 0;
    motifInterdiction =
      "Aucun dépôt de garantie ne peut être exigé lorsque le loyer est payable d'avance pour une période supérieure à deux mois, par exemple par trimestre d'avance (article 22 alinéa 3 de la loi du 6 juillet 1989).";
  } else if (input.typeBail === "meublee") {
    nbMoisPlafond = 2;
  } else {
    nbMoisPlafond = 1;
  }

  const plafondLegal = toCents(loyerHc.times(nbMoisPlafond));
  const delaiRestitutionMois: 1 | 2 = input.conformiteEdl === "conforme" ? 1 : 2;
  const provisionMaxCopropriete = input.enCopropriete
    ? toCents(plafondLegal.times("0.20"))
    : new Decimal(0);

  const soldeRestitueHorsPenalite = Decimal.max(0, toCents(plafondLegal.minus(retenues)));
  const complementDuParLocataire = retenues.greaterThan(plafondLegal)
    ? toCents(retenues.minus(plafondLegal))
    : new Decimal(0);

  // Article 22 al. 7 : majoration de 10 % du loyer mensuel en principal (hors charges)
  // pour chaque période mensuelle commencée en retard, si un solde reste dû au locataire.
  const penaliteParMois = toCents(loyerHc.times("0.10"));
  const penaliteTotaleRetard =
    soldeRestitueHorsPenalite.greaterThan(0) && input.moisRetardRestitution > 0
      ? toCents(penaliteParMois.times(input.moisRetardRestitution))
      : new Decimal(0);

  const totalAPayerAuLocataire = toCents(soldeRestitueHorsPenalite.plus(penaliteTotaleRetard));

  return {
    ok: true,
    result: {
      typeBail: input.typeBail,
      nbMoisPlafond,
      motifInterdiction,
      loyerMensuelHc: loyerHc,
      plafondLegal,
      plafondLegalCents: centsOf(plafondLegal),
      delaiRestitutionMois,
      provisionMaxCopropriete,
      retenuesJustifiees: retenues,
      soldeRestitueHorsPenalite,
      complementDuParLocataire,
      moisRetardRestitution: input.moisRetardRestitution,
      penaliteParMois,
      penaliteTotaleRetard,
      totalAPayerAuLocataire,
      totalAPayerAuLocataireCents: centsOf(totalAPayerAuLocataire),
    },
  };
}
