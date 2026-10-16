/**
 * Simulateur prospectif d'amortissement locatif sur 9 ans (« Loi Jeanbrun »)
 * comparé aux régimes existants (Micro-BIC et LMNP Réel linéaire).
 *
 * Honnêteté réglementaire :
 * Ce simulateur présente à titre indicatif un barème d'amortissement dégressif
 * sur 9 ans (5,5 % les années 1 à 3, 4,5 % les années 4 à 6, 3,5 % les années
 * 7 à 9 sur 80 % de la valeur du bien hors terrain) face aux régimes en vigueur
 * du Code général des impôts (Micro-BIC art. 50-0 et LMNP Réel art. 39 C).
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";
import type { TmiRate } from "./fiscalite-lmnp";

export interface LoiJeanbrunInput {
  prixAcquisition: Decimal;
  loyerMensuelHc: Decimal;
  chargesAnnuellesDeductibles: Decimal;
  tmi: TmiRate;
}

export type LoiJeanbrunError = "zero-price" | "zero-rent";

export const LOI_JEANBRUN_ERROR_MESSAGES: Record<LoiJeanbrunError, string> = {
  "zero-price": "Indiquez un prix d'acquisition supérieur à 0 €.",
  "zero-rent": "Indiquez un loyer mensuel hors charges supérieur à 0 €.",
};

export interface AnneeJeanbrun {
  annee: number;
  tauxAmortissementPct: string;
  dotationAmortissement: Decimal;
  baseImposable: Decimal;
  impotAnnuel: Decimal;
}

export interface LoiJeanbrunComputed {
  prixAcquisition: Decimal;
  baseAmortissable80Pct: Decimal;
  loyerAnnuel: Decimal;
  chargesAnnuelles: Decimal;
  tmi: TmiRate;
  tauxGlobalImpositionPct: Decimal; // TMI + 17,2 %
  cumul9Ans: {
    impotMicroBic: Decimal;
    impotLmnpLineaire: Decimal;
    impotAmortissementDegressif: Decimal;
    amortissementTotalDegressif: Decimal;
    economieVsMicroBic: Decimal;
    economieVsMicroBicCents: number;
  };
  echeancier9Ans: AnneeJeanbrun[];
}

export type LoiJeanbrunOutcome =
  | { ok: true; result: LoiJeanbrunComputed }
  | { ok: false; error: LoiJeanbrunError };

const TAUX_PS = new Decimal("0.172");
const TAUX_DEGRESSIFS = [
  new Decimal("0.055"),
  new Decimal("0.055"),
  new Decimal("0.055"),
  new Decimal("0.045"),
  new Decimal("0.045"),
  new Decimal("0.045"),
  new Decimal("0.035"),
  new Decimal("0.035"),
  new Decimal("0.035"),
];

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
  const chargesAnnuelles = toCents(input.chargesAnnuellesDeductibles);
  const resultatAvantAmort = Decimal.max(0, loyerAnnuel.minus(chargesAnnuelles));

  const tauxIr = new Decimal(input.tmi).dividedBy(100);
  const tauxGlobal = tauxIr.plus(TAUX_PS);
  const tauxGlobalImpositionPct = tauxGlobal.times(100).toDecimalPlaces(1, Decimal.ROUND_HALF_UP);

  // 1. Micro-BIC annuel (abattement 50 %) sur 9 ans
  const baseMicroAnnuelle = toCents(loyerAnnuel.times("0.50"));
  const impotMicroAnnuel = toCents(baseMicroAnnuelle.times(tauxGlobal));
  const impotMicroBic9Ans = toCents(impotMicroAnnuel.times(9));

  // 2. LMNP Réel linéaire classique (85 % sur 30 ans = 2,833 %/an)
  const dotationLineaire = toCents(prix.times("0.85").dividedBy(30));
  const baseLineaireAnnuelle = toCents(Decimal.max(0, resultatAvantAmort.minus(dotationLineaire)));
  const impotLineaireAnnuel = toCents(baseLineaireAnnuelle.times(tauxGlobal));
  const impotLmnpLineaire9Ans = toCents(impotLineaireAnnuel.times(9));

  // 3. Profil dégressif 9 ans (5,5 % / 4,5 % / 3,5 % sur 80 % du prix)
  let impotDegressif9Ans = new Decimal(0);
  let amortTotalDegressif = new Decimal(0);
  const echeancier9Ans: AnneeJeanbrun[] = [];

  for (let i = 0; i < 9; i++) {
    const taux = TAUX_DEGRESSIFS[i];
    const dotation = toCents(baseAmortissable80Pct.times(taux));
    const baseImp = toCents(Decimal.max(0, resultatAvantAmort.minus(dotation)));
    const impotAnnee = toCents(baseImp.times(tauxGlobal));

    amortTotalDegressif = toCents(amortTotalDegressif.plus(dotation));
    impotDegressif9Ans = toCents(impotDegressif9Ans.plus(impotAnnee));

    echeancier9Ans.push({
      annee: i + 1,
      tauxAmortissementPct: `${taux.times(100).toFixed(1).replace(".", ",")} %`,
      dotationAmortissement: dotation,
      baseImposable: baseImp,
      impotAnnuel: impotAnnee,
    });
  }

  const economieVsMicroBic = toCents(impotMicroBic9Ans.minus(impotDegressif9Ans));

  return {
    ok: true,
    result: {
      prixAcquisition: prix,
      baseAmortissable80Pct,
      loyerAnnuel,
      chargesAnnuelles,
      tmi: input.tmi,
      tauxGlobalImpositionPct,
      cumul9Ans: {
        impotMicroBic: impotMicroBic9Ans,
        impotLmnpLineaire: impotLmnpLineaire9Ans,
        impotAmortissementDegressif: impotDegressif9Ans,
        amortissementTotalDegressif: amortTotalDegressif,
        economieVsMicroBic,
        economieVsMicroBicCents: centsOf(Decimal.max(0, economieVsMicroBic)),
      },
      echeancier9Ans,
    },
  };
}
