/**
 * Calculateur de plus-value immobilière des particuliers (CGI articles 150 U,
 * 150 VB, 150 VC, 200 B et 1609 nonies G).
 *
 * Règles fiscales exactes :
 * - Frais d'acquisition : forfait de 7,5 % du prix d'achat ou frais réels sur
 *   justificatifs (art. 150 VB II-3° CGI).
 * - Travaux : forfait de 15 % du prix d'achat si le bien bâti est détenu depuis
 *   plus de 5 ans, ou montant réel sur factures d'entreprises (art. 150 VB II-4°).
 * - Abattement IR (19 %) : 6 %/an de la 6e à la 21e année, 4 % la 22e année
 *   (exonération totale d'IR au bout de 22 ans).
 * - Abattement PS (17,2 %) : 1,65 %/an de la 6e à la 21e année, 1,60 % la 22e
 *   année, 9 %/an de la 23e à la 30e année (exonération totale à 30 ans).
 * - Surtaxe progressive de 2 % à 6 % lorsque la plus-value nette imposable à
 *   l'IR excède 50 000 € (art. 1609 nonies G du CGI).
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export type NatureBienPlusValue = "locatif-secondaire" | "residence-principale";
export type ModeFraisAcquisition = "forfait-7-5" | "reel";
export type ModeTravauxPlusValue = "forfait-15" | "reel";

export interface PlusValueInput {
  natureBien: NatureBienPlusValue;
  prixAcquisition: Decimal;
  prixCession: Decimal;
  anneesDetention: number; // années pleines révolues (0..50)
  modeFraisAcquisition: ModeFraisAcquisition;
  fraisAcquisitionReels: Decimal;
  modeTravaux: ModeTravauxPlusValue;
  travauxReels: Decimal;
}

export type PlusValueError = "zero-purchase" | "zero-sale" | "invalid-years";

export const PLUS_VALUE_ERROR_MESSAGES: Record<PlusValueError, string> = {
  "zero-purchase": "Indiquez un prix d'acquisition supérieur à 0 €.",
  "zero-sale": "Indiquez un prix de vente supérieur à 0 €.",
  "invalid-years": "Indiquez une durée de détention comprise entre 0 et 60 années pleines.",
};

export interface PlusValueComputed {
  exonere: boolean;
  motifExoneration: string | null;
  anneesDetention: number;
  prixAcquisition: Decimal;
  fraisAcquisitionRetenus: Decimal;
  travauxRetenus: Decimal;
  forfaitTravauxNonEligible: boolean;
  prixAcquisitionCorrige: Decimal;
  prixCession: Decimal;
  plusValueBrute: Decimal;
  tauxAbattementIr: Decimal; // 0..100
  tauxAbattementPs: Decimal; // 0..100
  plusValueNetteIr: Decimal;
  plusValueNettePs: Decimal;
  impotRevenu: Decimal;
  prelevementsSociaux: Decimal;
  surtaxe: Decimal;
  impotTotal: Decimal;
  impotTotalCents: number;
  netVendeurApresImpot: Decimal;
}

export type PlusValueOutcome =
  | { ok: true; result: PlusValueComputed }
  | { ok: false; error: PlusValueError };

export function computeAbattementIrPercent(years: number): Decimal {
  if (years <= 5) return new Decimal(0);
  if (years >= 22) return new Decimal(100);
  return new Decimal(years - 5).times(6);
}

export function computeAbattementPsPercent(years: number): Decimal {
  if (years <= 5) return new Decimal(0);
  if (years >= 30) return new Decimal(100);
  if (years <= 21) {
    return new Decimal(years - 5).times(new Decimal("1.65"));
  }
  if (years === 22) {
    return new Decimal(28);
  }
  return new Decimal(28).plus(new Decimal(years - 22).times(9));
}

/**
 * Calcul de la taxe sur les plus-values immobilières élevées (> 50 000 € de
 * plus-value nette imposable à l'IR, article 1609 nonies G du CGI) avec lissage.
 */
export function computeSurtaxePlusValue(pvNetteIr: Decimal): Decimal {
  if (pvNetteIr.lessThanOrEqualTo(50_000)) return new Decimal(0);

  let raw: Decimal;
  if (pvNetteIr.lessThanOrEqualTo(60_000)) {
    raw = pvNetteIr.times("0.02").minus(new Decimal(60_000).minus(pvNetteIr).times("0.05"));
  } else if (pvNetteIr.lessThanOrEqualTo(100_000)) {
    raw = pvNetteIr.times("0.02");
  } else if (pvNetteIr.lessThanOrEqualTo(110_000)) {
    raw = pvNetteIr.times("0.03").minus(new Decimal(110_000).minus(pvNetteIr).times("0.10"));
  } else if (pvNetteIr.lessThanOrEqualTo(150_000)) {
    raw = pvNetteIr.times("0.03");
  } else if (pvNetteIr.lessThanOrEqualTo(160_000)) {
    raw = pvNetteIr.times("0.04").minus(new Decimal(160_000).minus(pvNetteIr).times("0.15"));
  } else if (pvNetteIr.lessThanOrEqualTo(200_000)) {
    raw = pvNetteIr.times("0.04");
  } else if (pvNetteIr.lessThanOrEqualTo(210_000)) {
    raw = pvNetteIr.times("0.05").minus(new Decimal(210_000).minus(pvNetteIr).times("0.20"));
  } else if (pvNetteIr.lessThanOrEqualTo(250_000)) {
    raw = pvNetteIr.times("0.05");
  } else if (pvNetteIr.lessThanOrEqualTo(260_000)) {
    raw = pvNetteIr.times("0.06").minus(new Decimal(260_000).minus(pvNetteIr).times("0.25"));
  } else {
    raw = pvNetteIr.times("0.06");
  }

  return toCents(Decimal.max(0, raw));
}

export function computePlusValue(input: PlusValueInput): PlusValueOutcome {
  if (input.prixAcquisition.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-purchase" };
  }
  if (input.prixCession.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-sale" };
  }
  if (
    !Number.isInteger(input.anneesDetention) ||
    input.anneesDetention < 0 ||
    input.anneesDetention > 60
  ) {
    return { ok: false, error: "invalid-years" };
  }

  const prixAcquisition = toCents(input.prixAcquisition);
  const prixCession = toCents(input.prixCession);

  const fraisAcquisitionRetenus =
    input.modeFraisAcquisition === "forfait-7-5"
      ? toCents(prixAcquisition.times("0.075"))
      : toCents(input.fraisAcquisitionReels);

  const forfaitTravauxNonEligible =
    input.modeTravaux === "forfait-15" && input.anneesDetention < 5;

  const travauxRetenus =
    input.modeTravaux === "forfait-15"
      ? input.anneesDetention >= 5
        ? toCents(prixAcquisition.times("0.15"))
        : new Decimal(0)
      : toCents(input.travauxReels);

  const prixAcquisitionCorrige = toCents(
    prixAcquisition.plus(fraisAcquisitionRetenus).plus(travauxRetenus)
  );
  const plusValueBrute = toCents(prixCession.minus(prixAcquisitionCorrige));

  const tauxAbattementIr = computeAbattementIrPercent(input.anneesDetention);
  const tauxAbattementPs = computeAbattementPsPercent(input.anneesDetention);

  if (input.natureBien === "residence-principale") {
    return {
      ok: true,
      result: {
        exonere: true,
        motifExoneration:
          "Exonération totale au titre de la résidence principale (article 150 U II-1° du CGI).",
        anneesDetention: input.anneesDetention,
        prixAcquisition,
        fraisAcquisitionRetenus,
        travauxRetenus,
        forfaitTravauxNonEligible,
        prixAcquisitionCorrige,
        prixCession,
        plusValueBrute,
        tauxAbattementIr: new Decimal(100),
        tauxAbattementPs: new Decimal(100),
        plusValueNetteIr: new Decimal(0),
        plusValueNettePs: new Decimal(0),
        impotRevenu: new Decimal(0),
        prelevementsSociaux: new Decimal(0),
        surtaxe: new Decimal(0),
        impotTotal: new Decimal(0),
        impotTotalCents: 0,
        netVendeurApresImpot: prixCession,
      },
    };
  }

  if (prixCession.lessThanOrEqualTo(15_000)) {
    return {
      ok: true,
      result: {
        exonere: true,
        motifExoneration:
          "Exonération totale lorsque le prix de cession est inférieur ou égal à 15 000 € (article 150 U II-6° du CGI).",
        anneesDetention: input.anneesDetention,
        prixAcquisition,
        fraisAcquisitionRetenus,
        travauxRetenus,
        forfaitTravauxNonEligible,
        prixAcquisitionCorrige,
        prixCession,
        plusValueBrute,
        tauxAbattementIr,
        tauxAbattementPs,
        plusValueNetteIr: new Decimal(0),
        plusValueNettePs: new Decimal(0),
        impotRevenu: new Decimal(0),
        prelevementsSociaux: new Decimal(0),
        surtaxe: new Decimal(0),
        impotTotal: new Decimal(0),
        impotTotalCents: 0,
        netVendeurApresImpot: prixCession,
      },
    };
  }

  if (plusValueBrute.lessThanOrEqualTo(0)) {
    return {
      ok: true,
      result: {
        exonere: true,
        motifExoneration:
          "Aucune plus-value imposable : le prix de vente est inférieur ou égal au prix d'acquisition majoré des frais et travaux.",
        anneesDetention: input.anneesDetention,
        prixAcquisition,
        fraisAcquisitionRetenus,
        travauxRetenus,
        forfaitTravauxNonEligible,
        prixAcquisitionCorrige,
        prixCession,
        plusValueBrute,
        tauxAbattementIr,
        tauxAbattementPs,
        plusValueNetteIr: new Decimal(0),
        plusValueNettePs: new Decimal(0),
        impotRevenu: new Decimal(0),
        prelevementsSociaux: new Decimal(0),
        surtaxe: new Decimal(0),
        impotTotal: new Decimal(0),
        impotTotalCents: 0,
        netVendeurApresImpot: prixCession,
      },
    };
  }

  const plusValueNetteIr = toCents(
    plusValueBrute.times(new Decimal(100).minus(tauxAbattementIr).dividedBy(100))
  );
  const plusValueNettePs = toCents(
    plusValueBrute.times(new Decimal(100).minus(tauxAbattementPs).dividedBy(100))
  );

  const impotRevenu = toCents(plusValueNetteIr.times("0.19"));
  const prelevementsSociaux = toCents(plusValueNettePs.times("0.172"));
  const surtaxe = computeSurtaxePlusValue(plusValueNetteIr);
  const impotTotal = toCents(impotRevenu.plus(prelevementsSociaux).plus(surtaxe));
  const netVendeurApresImpot = toCents(prixCession.minus(impotTotal));

  const exonere30Ans = input.anneesDetention >= 30;

  return {
    ok: true,
    result: {
      exonere: exonere30Ans,
      motifExoneration: exonere30Ans
        ? "Exonération totale d'impôt sur le revenu (dès 22 ans) et de prélèvements sociaux (dès 30 ans)."
        : null,
      anneesDetention: input.anneesDetention,
      prixAcquisition,
      fraisAcquisitionRetenus,
      travauxRetenus,
      forfaitTravauxNonEligible,
      prixAcquisitionCorrige,
      prixCession,
      plusValueBrute,
      tauxAbattementIr,
      tauxAbattementPs,
      plusValueNetteIr,
      plusValueNettePs,
      impotRevenu,
      prelevementsSociaux,
      surtaxe,
      impotTotal,
      impotTotalCents: centsOf(impotTotal),
      netVendeurApresImpot,
    },
  };
}
