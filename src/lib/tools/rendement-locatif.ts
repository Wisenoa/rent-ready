/**
 * Calculateur de rentabilité et rendement locatif (brut, acte en main et net de
 * charges et de vacance locative, avant impôt).
 *
 * Conventions explicites :
 * - Rendement brut (sur prix net vendeur) = (Loyer mensuel HC × 12) ÷ Prix d'achat × 100
 * - Rendement brut acte en main = (Loyer mensuel HC × 12) ÷ Coût total d'acquisition × 100
 * - Rendement net de charges (avant impôt) = Revenu locatif net annuel ÷ Coût total d'acquisition × 100
 *   où Coût total = Prix d'achat + Frais d'acquisition (notaire, agence) + Travaux
 *   et Revenu net annuel = Loyers HC encaissés (après vacance) − (Taxe foncière + Charges non récupérables +Assurance PNO/GLI).
 */
import Decimal from "decimal.js";
import { centsOf, toCents } from "./amount";

export interface RendementInput {
  prixAchat: Decimal;
  fraisAcquisition: Decimal;
  travaux: Decimal;
  loyerMensuelHc: Decimal;
  vacanceMoisParAn: Decimal; // 0 .. 11
  taxeFonciereAnnuelle: Decimal;
  chargesNonRecuperablesAnnuelles: Decimal;
  assuranceAnnuelle: Decimal;
}

export type RendementError = "zero-price" | "zero-rent" | "invalid-vacancy";

export const RENDEMENT_ERROR_MESSAGES: Record<RendementError, string> = {
  "zero-price": "Indiquez un prix d'acquisition supérieur à 0 €.",
  "zero-rent": "Indiquez un loyer mensuel hors charges supérieur à 0 €.",
  "invalid-vacancy": "La vacance locative doit être comprise entre 0 et 11 mois par an.",
};

export interface RendementComputed {
  prixAchat: Decimal;
  fraisAcquisition: Decimal;
  travaux: Decimal;
  coutTotalProjet: Decimal;
  loyerAnnuelPlein: Decimal;
  perteVacanceAnnuelle: Decimal;
  loyerAnnuelEffectif: Decimal;
  totalChargesAnnuelles: Decimal;
  revenuNetAnnuel: Decimal;
  revenuNetMensuel: Decimal;
  revenuNetAnnuelCents: number;
  rendementBrutSurPrix: Decimal;
  rendementBrutActeEnMain: Decimal;
  rendementNetCharges: Decimal;
}

export type RendementOutcome =
  | { ok: true; result: RendementComputed }
  | { ok: false; error: RendementError };

export function formatPercent(value: Decimal, digits = 2): string {
  const rounded = value.toDecimalPlaces(digits, Decimal.ROUND_HALF_UP);
  const absText = rounded.abs().toFixed(digits).replace(".", ",");
  if (rounded.isNegative() && !rounded.isZero()) return `−${absText} %`;
  return `${absText} %`;
}

export function computeRendementLocatif(input: RendementInput): RendementOutcome {
  if (input.prixAchat.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-price" };
  }
  if (input.loyerMensuelHc.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-rent" };
  }
  if (input.vacanceMoisParAn.isNegative() || input.vacanceMoisParAn.greaterThan(11)) {
    return { ok: false, error: "invalid-vacancy" };
  }

  const prixAchat = toCents(input.prixAchat);
  const fraisAcquisition = toCents(input.fraisAcquisition);
  const travaux = toCents(input.travaux);
  const coutTotalProjet = toCents(prixAchat.plus(fraisAcquisition).plus(travaux));

  const loyerMensuel = toCents(input.loyerMensuelHc);
  const loyerAnnuelPlein = toCents(loyerMensuel.times(12));
  const perteVacanceAnnuelle = toCents(loyerMensuel.times(input.vacanceMoisParAn));
  const loyerAnnuelEffectif = toCents(loyerAnnuelPlein.minus(perteVacanceAnnuelle));

  const totalChargesAnnuelles = toCents(
    toCents(input.taxeFonciereAnnuelle)
      .plus(toCents(input.chargesNonRecuperablesAnnuelles))
      .plus(toCents(input.assuranceAnnuelle))
  );

  const revenuNetAnnuel = toCents(loyerAnnuelEffectif.minus(totalChargesAnnuelles));
  const revenuNetMensuel = toCents(revenuNetAnnuel.dividedBy(12));

  const rendementBrutSurPrix = loyerAnnuelPlein
    .dividedBy(prixAchat)
    .times(100)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const rendementBrutActeEnMain = loyerAnnuelPlein
    .dividedBy(coutTotalProjet)
    .times(100)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const rendementNetCharges = revenuNetAnnuel
    .dividedBy(coutTotalProjet)
    .times(100)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    ok: true,
    result: {
      prixAchat,
      fraisAcquisition,
      travaux,
      coutTotalProjet,
      loyerAnnuelPlein,
      perteVacanceAnnuelle,
      loyerAnnuelEffectif,
      totalChargesAnnuelles,
      revenuNetAnnuel,
      revenuNetMensuel,
      revenuNetAnnuelCents: centsOf(revenuNetAnnuel),
      rendementBrutSurPrix,
      rendementBrutActeEnMain,
      rendementNetCharges,
    },
  };
}
