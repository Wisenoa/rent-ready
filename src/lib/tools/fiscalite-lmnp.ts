/**
 * Simulateur de fiscalité LMNP (Loueur en Meublé Non Professionnel) :
 * comparaison entre le régime Micro-BIC (article 50-0 du CGI, abattement de
 * 50 % en location meublée longue durée jusqu'à 77 700 € de recettes) et le
 * régime Réel Simplifié (déduction des charges réelles et amortissement du bâti
 * et du mobilier plafonné selon l'article 39 C du CGI).
 *
 * Correction majeure V3.3 : au régime réel, l'impôt sur le revenu (TMI) ET les
 * prélèvements sociaux (17,2 %) sont tous deux assis sur le résultat BIC net
 * après imputation des amortissements.
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export type TmiRate = 0 | 11 | 30 | 41 | 45;

export interface FiscaliteLmnpInput {
  recettesAnnuelles: Decimal;
  chargesDeductiblesAnnuelles: Decimal;
  interetsEmpruntAnnuels: Decimal;
  valeurBienImmobilier: Decimal; // part bâti retenue à 85 % amortie sur 30 ans
  valeurMobilierEtTravaux: Decimal; // amortie sur 7 ans en moyenne
  tmi: TmiRate;
}

export type FiscaliteLmnpError = "zero-revenue" | "zero-property";

export const FISCALITE_LMNP_ERROR_MESSAGES: Record<FiscaliteLmnpError, string> = {
  "zero-revenue": "Indiquez un montant de recettes locatives annuelles supérieur à 0 €.",
  "zero-property": "Indiquez la valeur du bien immobilier pour estimer l'amortissement comptable.",
};

export interface FiscaliteLmnpComputed {
  recettesAnnuelles: Decimal;
  depassePlafondMicroBic: boolean;
  tmi: TmiRate;
  microBic: {
    abattement: Decimal;
    baseImposable: Decimal;
    impotRevenu: Decimal;
    prelevementsSociaux: Decimal;
    impotTotal: Decimal;
  };
  reelSimplifie: {
    totalChargesEtInterets: Decimal;
    resultatAvantAmortissement: Decimal;
    dotationAmortissementBati: Decimal;
    dotationAmortissementMobilier: Decimal;
    dotationAmortissementTotale: Decimal;
    amortissementImpute: Decimal;
    amortissementReportable: Decimal;
    deficitBicReportable: Decimal;
    baseImposable: Decimal;
    impotRevenu: Decimal;
    prelevementsSociaux: Decimal;
    impotTotal: Decimal;
  };
  economieAnnuelleReel: Decimal;
  economieAnnuelleCents: number;
  regimePlusAvantageux: "reel" | "micro";
}

export type FiscaliteLmnpOutcome =
  | { ok: true; result: FiscaliteLmnpComputed }
  | { ok: false; error: FiscaliteLmnpError };

const TAUX_PS = new Decimal("0.172");
const PLAFOND_MICRO_BIC_CLASSIQUE = new Decimal(77_700);

export function computeFiscaliteLmnp(input: FiscaliteLmnpInput): FiscaliteLmnpOutcome {
  if (input.recettesAnnuelles.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-revenue" };
  }
  if (input.valeurBienImmobilier.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-property" };
  }

  const recettes = toCents(input.recettesAnnuelles);
  const charges = toCents(input.chargesDeductiblesAnnuelles);
  const interets = toCents(input.interetsEmpruntAnnuels);
  const valeurBien = toCents(input.valeurBienImmobilier);
  const valeurMobilier = toCents(input.valeurMobilierEtTravaux);
  const tauxTmi = new Decimal(input.tmi).dividedBy(100);

  // 1. Micro-BIC : abattement forfaitaire de 50 % (minimum légal de 305 €, art. 50-0 CGI)
  const abattementBrut = toCents(recettes.times("0.50"));
  const abattementMicro = Decimal.min(recettes, Decimal.max(new Decimal(305), abattementBrut));
  const baseMicro = toCents(Decimal.max(0, recettes.minus(abattementMicro)));
  const irMicro = toCents(baseMicro.times(tauxTmi));
  const psMicro = toCents(baseMicro.times(TAUX_PS));
  const totalMicro = toCents(irMicro.plus(psMicro));

  // 2. Régime Réel Simplifié
  const totalChargesEtInterets = toCents(charges.plus(interets));
  const resultatAvantAmortissement = toCents(recettes.minus(totalChargesEtInterets));

  // Amortissement du bâti : 85 % de la valeur du bien hors terrain sur 30 ans
  const dotationAmortissementBati = toCents(valeurBien.times("0.85").dividedBy(30));
  // Amortissement du mobilier et équipements : sur 7 ans
  const dotationAmortissementMobilier = toCents(valeurMobilier.dividedBy(7));
  const dotationAmortissementTotale = toCents(
    dotationAmortissementBati.plus(dotationAmortissementMobilier)
  );

  // Article 39 C du CGI : l'amortissement ne peut pas créer de déficit fiscal
  let amortissementImpute = new Decimal(0);
  let amortissementReportable = dotationAmortissementTotale;
  let deficitBicReportable = new Decimal(0);
  let baseReel = new Decimal(0);

  if (resultatAvantAmortissement.greaterThan(0)) {
    amortissementImpute = Decimal.min(resultatAvantAmortissement, dotationAmortissementTotale);
    amortissementReportable = toCents(dotationAmortissementTotale.minus(amortissementImpute));
    baseReel = toCents(resultatAvantAmortissement.minus(amortissementImpute));
  } else {
    deficitBicReportable = resultatAvantAmortissement.abs();
  }

  const irReel = toCents(baseReel.times(tauxTmi));
  const psReel = toCents(baseReel.times(TAUX_PS));
  const totalReel = toCents(irReel.plus(psReel));

  const economieAnnuelleReel = toCents(totalMicro.minus(totalReel));
  const regimePlusAvantageux = economieAnnuelleReel.greaterThanOrEqualTo(0) ? "reel" : "micro";

  return {
    ok: true,
    result: {
      recettesAnnuelles: recettes,
      depassePlafondMicroBic: recettes.greaterThan(PLAFOND_MICRO_BIC_CLASSIQUE),
      tmi: input.tmi,
      microBic: {
        abattement: abattementMicro,
        baseImposable: baseMicro,
        impotRevenu: irMicro,
        prelevementsSociaux: psMicro,
        impotTotal: totalMicro,
      },
      reelSimplifie: {
        totalChargesEtInterets,
        resultatAvantAmortissement,
        dotationAmortissementBati,
        dotationAmortissementMobilier,
        dotationAmortissementTotale,
        amortissementImpute,
        amortissementReportable,
        deficitBicReportable,
        baseImposable: baseReel,
        impotRevenu: irReel,
        prelevementsSociaux: psReel,
        impotTotal: totalReel,
      },
      economieAnnuelleReel,
      economieAnnuelleCents: centsOf(economieAnnuelleReel.abs()),
      regimePlusAvantageux,
    },
  };
}
