/**
 * Simulateur officiel du « Statut du bailleur privé » (dispositif « Jeanbrun »,
 * issu de la loi n° 2026-103 du 19 février 2026 de finances pour 2026,
 * entrée en vigueur le 21 février 2026).
 *
 * Principes et règles juridico-fiscales :
 * 1. Nature juridique : investissement locatif en LOCATION NUE (revenus fonciers,
 *    imprimé 2044). Il remplace l'ancien dispositif Pinel par un mécanisme
 *    d'amortissement comptable déductible des revenus fonciers.
 * 2. Base amortissable : forfait de 80 % du prix d'acquisition (hors terrain,
 *    qui représente forfaitairement 20 % de la valeur).
 * 3. Taux d'amortissement annuel sur 9 ans selon l'option de loyer conventionné :
 *    - Secteur intermédiaire : 3,5 % par an (soit 31,5 % sur 9 ans).
 *    - Secteur social (décote de loyer d'environ 15 %) : 4,5 % par an (soit 40,5 % sur 9 ans).
 *    - Secteur très social (décote de loyer d'environ 30 %) : 5,5 % par an (soit 49,5 % sur 9 ans).
 * 4. Imputation du déficit foncier : l'amortissement et les charges déductibles
 *    viennent en déduction des revenus fonciers. Le déficit foncier généré
 *    (hors intérêts d'emprunt) est imputable sur le revenu global dans la limite
 *    légale de 10 700 € par an, le solde étant reportable sur les revenus fonciers
 *    des 10 années suivantes.
 * 5. Conditions d'éligibilité légales :
 *    - Logement situé dans un immeuble collectif (les maisons individuelles sont exclues).
 *    - Logement neuf (ou VEFA) ou ancien faisant l'objet de travaux de rénovation
 *      représentant au moins 30 % du coût total d'acquisition.
 *    - Location nue à titre de résidence principale du locataire pendant au moins 9 ans.
 *    - Respect des plafonds de loyers et de ressources des locataires.
 *    - Interdiction stricte de louer à un ascendant, un descendant ou un membre du foyer fiscal.
 * 6. Sortie et revente :
 *    - À la revente, les amortissements déduits sont réintégrés pour le calcul de
 *      la plus-value immobilière des particuliers (le prix d'acquisition retenu
 *      est minoré du montant des amortissements déduits).
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";
import type { TmiRate } from "./fiscalite-lmnp";

export type SecteurJeanbrun = "intermediaire" | "social" | "tres-social";

export const SECTEUR_JEANBRUN_INFO: Record<
  SecteurJeanbrun,
  { label: string; tauxPct: number; plafondAnnuelEuros: number; decoteLoyerLabel: string }
> = {
  intermediaire: {
    label: "Secteur intermédiaire",
    tauxPct: 3.5,
    plafondAnnuelEuros: 8_000,
    decoteLoyerLabel: "Loyer intermédiaire plafonné",
  },
  social: {
    label: "Secteur social",
    tauxPct: 4.5,
    plafondAnnuelEuros: 10_000,
    decoteLoyerLabel: "Loyer social (décote ~15 % par rapport au marché)",
  },
  "tres-social": {
    label: "Secteur très social",
    tauxPct: 5.5,
    plafondAnnuelEuros: 12_000,
    decoteLoyerLabel: "Loyer très social (décote ~30 % par rapport au marché)",
  },
};

export interface LoiJeanbrunInput {
  prixAcquisition: Decimal;
  loyerMensuelHc: Decimal;
  chargesAnnuellesDeductibles: Decimal;
  interetsEmpruntAnnuels?: Decimal;
  secteur: SecteurJeanbrun;
  tmi: TmiRate;
}

export type LoiJeanbrunError = "zero-price" | "zero-rent";

export const LOI_JEANBRUN_ERROR_MESSAGES: Record<LoiJeanbrunError, string> = {
  "zero-price": "Indiquez un prix d'acquisition supérieur à 0 €.",
  "zero-rent": "Indiquez un loyer mensuel hors charges supérieur à 0 €.",
};

export interface AnneeJeanbrun {
  annee: number;
  loyerAnnuel: Decimal;
  chargesDeductibles: Decimal;
  amortissementAnnuel: Decimal;
  resultatFoncier: Decimal;
  deficitImputeRevenuGlobal: Decimal;
  deficitReportable: Decimal;
  baseImposableFoncier: Decimal;
  impotFoncierAnnuel: Decimal;
  economieVsFoncierClassique: Decimal;
}

export interface LoiJeanbrunComputed {
  prixAcquisition: Decimal;
  baseAmortissable80Pct: Decimal;
  secteur: SecteurJeanbrun;
  tauxAmortissementAnnuelPct: number;
  plafondAnnuelEuros: number;
  amortissementTheorique: Decimal;
  amortissementAnnuel: Decimal;
  amortissementPlafonne: boolean;
  depassementPlafondAnnuel: Decimal;
  amortissementTotal9Ans: Decimal;
  loyerAnnuel: Decimal;
  chargesAnnuellesDeductibles: Decimal;
  interetsEmpruntAnnuels: Decimal;
  tmi: TmiRate;
  tauxGlobalImpositionPct: Decimal; // TMI + 17,2 %
  regimeFoncierClassique: {
    baseImposableAnnuelle: Decimal;
    impotAnnuel: Decimal;
    impotTotal9Ans: Decimal;
  };
  regimeMicroFoncier: {
    eligible: boolean;
    baseImposableAnnuelle: Decimal;
    impotAnnuel: Decimal;
    impotTotal9Ans: Decimal;
  };
  statutJeanbrun: {
    impotTotal9Ans: Decimal;
    economieTotaleVsFoncierClassique: Decimal;
    economieTotaleCents: number;
    amortissementReintegreRevente: Decimal;
  };
  echeancier9Ans: AnneeJeanbrun[];
}

export type LoiJeanbrunOutcome =
  | { ok: true; result: LoiJeanbrunComputed }
  | { ok: false; error: LoiJeanbrunError };

const TAUX_PS = new Decimal("0.172");
const PLAFOND_DEFICIT_FONCIER_GLOBAL = new Decimal(10_700);

export function computeLoiJeanbrun(input: LoiJeanbrunInput): LoiJeanbrunOutcome {
  if (input.prixAcquisition.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-price" };
  }
  if (input.loyerMensuelHc.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-rent" };
  }

  const prix = toCents(input.prixAcquisition);
  const baseAmortissable80Pct = toCents(prix.times("0.80"));
  const loyerAnnuel = toCents(input.loyerMensuelHc.times(12));
  const charges = toCents(input.chargesAnnuellesDeductibles);
  const interets = toCents(input.interetsEmpruntAnnuels ?? new Decimal(0));
  const totalChargesHorsInterets = charges;
  const totalChargesAvecInterets = toCents(charges.plus(interets));

  const tauxInfo = SECTEUR_JEANBRUN_INFO[input.secteur];
  const tauxAmortRatio = new Decimal(tauxInfo.tauxPct).dividedBy(100);
  const amortissementTheorique = toCents(baseAmortissable80Pct.times(tauxAmortRatio));
  const plafondAnnuel = new Decimal(tauxInfo.plafondAnnuelEuros);
  const amortissementPlafonne = amortissementTheorique.greaterThan(plafondAnnuel);
  const depassementPlafondAnnuel = amortissementPlafonne
    ? toCents(amortissementTheorique.minus(plafondAnnuel))
    : new Decimal(0);
  const amortissementAnnuel = amortissementPlafonne ? plafondAnnuel : amortissementTheorique;
  const amortissementTotal9Ans = toCents(amortissementAnnuel.times(9));

  const tauxIr = new Decimal(input.tmi).dividedBy(100);
  const tauxGlobal = tauxIr.plus(TAUX_PS);
  const tauxGlobalImpositionPct = tauxGlobal.times(100).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  // 1. Régime des revenus fonciers classique au réel (sans amortissement du bâti)
  const resultatFoncierClassique = toCents(loyerAnnuel.minus(totalChargesAvecInterets));
  const baseFoncierClassique = Decimal.max(0, resultatFoncierClassique);
  const impotFoncierClassiqueAnnuel = toCents(baseFoncierClassique.times(tauxGlobal));
  const impotFoncierClassique9Ans = toCents(impotFoncierClassiqueAnnuel.times(9));

  // 2. Micro-foncier classique (abattement 30 % si loyer brut annuel <= 15 000 €)
  const microEligible = loyerAnnuel.lessThanOrEqualTo(15_000);
  const baseMicroFoncierAnnuelle = microEligible
    ? toCents(loyerAnnuel.times("0.70"))
    : baseFoncierClassique;
  const impotMicroFoncierAnnuel = toCents(baseMicroFoncierAnnuelle.times(tauxGlobal));
  const impotMicroFoncier9Ans = toCents(impotMicroFoncierAnnuel.times(9));

  // 3. Statut du bailleur privé Jeanbrun (amortissement déductible des revenus fonciers)
  let impotJeanbrun9Ans = new Decimal(0);
  let deficitFoncierCumuleReportable = new Decimal(0);
  const echeancier9Ans: AnneeJeanbrun[] = [];

  for (let annee = 1; annee <= 9; annee++) {
    // Règle du déficit foncier :
    // Revenus bruts - charges (hors intérêts) - amortissement = résultat hors intérêts
    // Puis déduction des intérêts d'emprunt
    const totalDeductions = toCents(totalChargesAvecInterets.plus(amortissementAnnuel));
    const soldeFoncierBrut = toCents(loyerAnnuel.minus(totalDeductions));

    let deficitImputeRevenuGlobal = new Decimal(0);
    let baseImposableFoncier = new Decimal(0);
    let impotFoncierAnnuel = new Decimal(0);

    if (soldeFoncierBrut.isNegative()) {
      const deficitTotal = soldeFoncierBrut.abs();
      // Les intérêts d'emprunt ne peuvent pas s'imputer sur le revenu global,
      // seul le déficit provenant des charges et de l'amortissement s'impute dans la limite de 10 700 €
      const deficitHorsInterets = Decimal.max(
        0,
        toCents(totalChargesHorsInterets.plus(amortissementAnnuel).minus(loyerAnnuel))
      );
      deficitImputeRevenuGlobal = Decimal.min(
        deficitTotal,
        Decimal.min(PLAFOND_DEFICIT_FONCIER_GLOBAL, deficitHorsInterets)
      );
      const deficitNonImpute = toCents(deficitTotal.minus(deficitImputeRevenuGlobal));
      deficitFoncierCumuleReportable = toCents(
        deficitFoncierCumuleReportable.plus(deficitNonImpute)
      );

      // Économie sur le revenu global grâce à l'imputation du déficit foncier (au taux TMI)
      // L'impôt foncier de l'année est 0
      impotFoncierAnnuel = new Decimal(0);
    } else {
      // Résultat foncier positif : imputation des déficits antérieurs reportables
      let soldeApresDéficitReporte = soldeFoncierBrut;
      if (deficitFoncierCumuleReportable.greaterThan(0)) {
        const imputation = Decimal.min(soldeFoncierBrut, deficitFoncierCumuleReportable);
        soldeApresDéficitReporte = toCents(soldeFoncierBrut.minus(imputation));
        deficitFoncierCumuleReportable = toCents(
          deficitFoncierCumuleReportable.minus(imputation)
        );
      }
      baseImposableFoncier = soldeApresDéficitReporte;
      impotFoncierAnnuel = toCents(baseImposableFoncier.times(tauxGlobal));
    }

    impotJeanbrun9Ans = toCents(impotJeanbrun9Ans.plus(impotFoncierAnnuel));
    const economieVsFoncierClassique = toCents(
      impotFoncierClassiqueAnnuel.minus(impotFoncierAnnuel).plus(deficitImputeRevenuGlobal.times(tauxIr))
    );

    echeancier9Ans.push({
      annee,
      loyerAnnuel,
      chargesDeductibles: totalChargesAvecInterets,
      amortissementAnnuel,
      resultatFoncier: soldeFoncierBrut,
      deficitImputeRevenuGlobal,
      deficitReportable: deficitFoncierCumuleReportable,
      baseImposableFoncier,
      impotFoncierAnnuel,
      economieVsFoncierClassique,
    });
  }

  const economieTotale = toCents(
    echeancier9Ans.reduce((acc, row) => acc.plus(row.economieVsFoncierClassique), new Decimal(0))
  );

  return {
    ok: true,
    result: {
      prixAcquisition: prix,
      baseAmortissable80Pct,
      secteur: input.secteur,
      tauxAmortissementAnnuelPct: tauxInfo.tauxPct,
      plafondAnnuelEuros: tauxInfo.plafondAnnuelEuros,
      amortissementTheorique,
      amortissementAnnuel,
      amortissementPlafonne,
      depassementPlafondAnnuel,
      amortissementTotal9Ans,
      loyerAnnuel,
      chargesAnnuellesDeductibles: charges,
      interetsEmpruntAnnuels: interets,
      tmi: input.tmi,
      tauxGlobalImpositionPct,
      regimeFoncierClassique: {
        baseImposableAnnuelle: baseFoncierClassique,
        impotAnnuel: impotFoncierClassiqueAnnuel,
        impotTotal9Ans: impotFoncierClassique9Ans,
      },
      regimeMicroFoncier: {
        eligible: microEligible,
        baseImposableAnnuelle: baseMicroFoncierAnnuelle,
        impotAnnuel: impotMicroFoncierAnnuel,
        impotTotal9Ans: impotMicroFoncier9Ans,
      },
      statutJeanbrun: {
        impotTotal9Ans: impotJeanbrun9Ans,
        economieTotaleVsFoncierClassique: economieTotale,
        economieTotaleCents: centsOf(Decimal.max(0, economieTotale)),
        amortissementReintegreRevente: amortissementTotal9Ans,
      },
      echeancier9Ans,
    },
  };
}
