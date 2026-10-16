/**
 * Simulateur de prêt immobilier et tableau d'amortissement annuel en Decimal.
 *
 * Formule d'annuité constante à taux fixe mensuel r = Taux nominal annuel ÷ 12 :
 *   Mensualité hors assurance = Capital × r ÷ (1 − (1 + r)^(-n))
 * avec n = durée en années × 12.
 *
 * Assurance emprunteur calculée sur le capital initial emprunté :
 *   Mensualité assurance = Capital × Taux assurance annuel ÷ 12
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export interface PretImmobilierInput {
  montantProjet: Decimal;
  apportPersonnel: Decimal;
  dureeAnnees: number;
  tauxNominalAnnuel: Decimal; // en %, ex. 3.45
  tauxAssuranceAnnuel: Decimal; // en %, ex. 0.30
}

export type PretImmobilierError =
  | "zero-loan"
  | "invalid-duration"
  | "invalid-rate";

export const PRET_IMMOBILIER_ERROR_MESSAGES: Record<PretImmobilierError, string> = {
  "zero-loan": "Le capital emprunté (coût du projet moins apport) doit être supérieur à 0 €.",
  "invalid-duration": "Choisissez une durée de remboursement comprise entre 5 et 30 ans.",
  "invalid-rate": "Indiquez un taux nominal compris entre 0 % et 20 %.",
};

export interface LigneAmortissementAnnuel {
  annee: number;
  capitalRembourse: Decimal;
  interetsPayes: Decimal;
  assurancePayee: Decimal;
  capitalRestantDu: Decimal;
}

export interface PretImmobilierComputed {
  capitalEmprunte: Decimal;
  dureeAnnees: number;
  nombreMensualites: number;
  tauxNominalAnnuel: Decimal;
  tauxAssuranceAnnuel: Decimal;
  mensualiteHorsAssurance: Decimal;
  mensualiteAssurance: Decimal;
  mensualiteTotale: Decimal;
  mensualiteTotaleCents: number;
  totalInterets: Decimal;
  totalAssurance: Decimal;
  coutTotalCredit: Decimal;
  coutTotalRembourse: Decimal;
  tableauAnnuel: LigneAmortissementAnnuel[];
}

export type PretImmobilierOutcome =
  | { ok: true; result: PretImmobilierComputed }
  | { ok: false; error: PretImmobilierError };

export function computePretImmobilier(input: PretImmobilierInput): PretImmobilierOutcome {
  const projet = toCents(input.montantProjet);
  const apport = toCents(input.apportPersonnel);
  const capitalEmprunte = toCents(projet.minus(apport));

  if (capitalEmprunte.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-loan" };
  }
  if (!Number.isInteger(input.dureeAnnees) || input.dureeAnnees < 5 || input.dureeAnnees > 30) {
    return { ok: false, error: "invalid-duration" };
  }
  if (
    input.tauxNominalAnnuel.isNegative() ||
    input.tauxNominalAnnuel.greaterThan(20) ||
    input.tauxAssuranceAnnuel.isNegative() ||
    input.tauxAssuranceAnnuel.greaterThan(5)
  ) {
    return { ok: false, error: "invalid-rate" };
  }

  const n = input.dureeAnnees * 12;
  const tauxMensuel = input.tauxNominalAnnuel.dividedBy(100).dividedBy(12);

  let mensualiteHorsAssurance: Decimal;
  if (tauxMensuel.isZero()) {
    mensualiteHorsAssurance = toCents(capitalEmprunte.dividedBy(n));
  } else {
    const onePlusR = new Decimal(1).plus(tauxMensuel);
    const denom = new Decimal(1).minus(onePlusR.pow(-n));
    mensualiteHorsAssurance = toCents(capitalEmprunte.times(tauxMensuel).dividedBy(denom));
  }

  const mensualiteAssurance = toCents(
    capitalEmprunte.times(input.tauxAssuranceAnnuel.dividedBy(100)).dividedBy(12)
  );
  const mensualiteTotale = toCents(mensualiteHorsAssurance.plus(mensualiteAssurance));

  let restant = capitalEmprunte;
  let totalInterets = new Decimal(0);
  const tableauAnnuel: LigneAmortissementAnnuel[] = [];

  for (let annee = 1; annee <= input.dureeAnnees; annee++) {
    let capAnnee = new Decimal(0);
    let intAnnee = new Decimal(0);
    const assAnnee = toCents(mensualiteAssurance.times(12));

    for (let m = 1; m <= 12; m++) {
      const monthIndex = (annee - 1) * 12 + m;
      const interetMois = toCents(restant.times(tauxMensuel));
      let capitalMois: Decimal;

      if (monthIndex === n || mensualiteHorsAssurance.minus(interetMois).greaterThan(restant)) {
        capitalMois = restant;
      } else {
        capitalMois = toCents(mensualiteHorsAssurance.minus(interetMois));
      }

      restant = toCents(restant.minus(capitalMois));
      capAnnee = toCents(capAnnee.plus(capitalMois));
      intAnnee = toCents(intAnnee.plus(interetMois));
      totalInterets = toCents(totalInterets.plus(interetMois));
    }

    tableauAnnuel.push({
      annee,
      capitalRembourse: capAnnee,
      interetsPayes: intAnnee,
      assurancePayee: assAnnee,
      capitalRestantDu: restant,
    });
  }

  const totalAssurance = toCents(mensualiteAssurance.times(n));
  const coutTotalCredit = toCents(totalInterets.plus(totalAssurance));
  const coutTotalRembourse = toCents(capitalEmprunte.plus(coutTotalCredit));

  return {
    ok: true,
    result: {
      capitalEmprunte,
      dureeAnnees: input.dureeAnnees,
      nombreMensualites: n,
      tauxNominalAnnuel: input.tauxNominalAnnuel.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
      tauxAssuranceAnnuel: input.tauxAssuranceAnnuel.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
      mensualiteHorsAssurance,
      mensualiteAssurance,
      mensualiteTotale,
      mensualiteTotaleCents: centsOf(mensualiteTotale),
      totalInterets,
      totalAssurance,
      coutTotalCredit,
      coutTotalRembourse,
      tableauAnnuel,
    },
  };
}
