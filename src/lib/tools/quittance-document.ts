/**
 * Quittance de loyer & reçu de paiement partiel (article 21 de la loi n° 89-462
 * du 6 juillet 1989).
 *
 * Règle métier fondamentale de Lokna :
 * - Un paiement intégral du loyer et des charges de la période ouvre droit à une
 *   **quittance de loyer**.
 * - Un paiement partiel ne doit jamais générer une quittance complète : il donne
 *   lieu à un **reçu de paiement partiel** mentionnant explicitement le solde
 *   restant dû.
 * - Conformément à l'article 21 de la loi du 6 juillet 1989, le loyer nu et les
 *   provisions ou forfaits de charges doivent être distingués, et aucun frais
 *   ne peut être facturé pour la remise de la quittance.
 */
import Decimal from "decimal.js";
import { centsOf, formatEuros, toCents } from "./amount";

export type TypeChargesQuittance = "provision" | "forfait";
export type StatutPaiementQuittance = "complet" | "partiel";
export type ModePaiementQuittance = "virement" | "prelevement" | "cheque" | "especes";

export const MOIS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

export const MODE_PAIEMENT_LABELS: Record<ModePaiementQuittance, string> = {
  virement: "virement bancaire",
  prelevement: "prélèvement automatique",
  cheque: "chèque",
  especes: "espèces",
};

export interface QuittanceInput {
  bailleurNom: string;
  bailleurAdresse: string;
  locataireNom: string;
  bienAdresse: string;
  mois: number; // 1..12
  annee: number; // e.g. 2026
  prorata: boolean;
  jourDebut?: number;
  jourFin?: number;
  loyerMensuel: Decimal;
  chargesMensuelles: Decimal;
  typeCharges: TypeChargesQuittance;
  statutPaiement: StatutPaiementQuittance;
  montantVerse?: Decimal;
  datePaiement: string; // YYYY-MM-DD
  modePaiement: ModePaiementQuittance;
  villeSignature: string;
}

export type QuittanceValidationError =
  | "invalid-month"
  | "invalid-prorata-days"
  | "zero-rent"
  | "partial-amount-required"
  | "partial-amount-zero"
  | "partial-amount-exceeds-total";

export const QUITTANCE_ERROR_MESSAGES: Record<QuittanceValidationError, string> = {
  "invalid-month": "Sélectionnez un mois valide.",
  "invalid-prorata-days": "Le jour de fin doit être postérieur ou égal au jour de début dans le mois choisi.",
  "zero-rent": "Indiquez un loyer hors charges strictement positif.",
  "partial-amount-required": "Indiquez le montant effectivement reçu pour établir le reçu partiel.",
  "partial-amount-zero": "Le montant reçu doit être supérieur à 0,00 €.",
  "partial-amount-exceeds-total":
    "Le montant partiel doit être strictement inférieur au total appelé (sinon choisissez « Paiement complet »).",
};

export interface QuittanceComputed {
  isQuittance: boolean;
  documentTitle: string;
  documentShortLabel: string;
  moisLabel: string;
  joursDansMois: number;
  joursOccupes: number;
  jourDebutEffectif: number;
  jourFinEffectif: number;
  periodeLabel: string;
  periodeCourte: string;
  loyerAppele: Decimal;
  chargesAppelees: Decimal;
  totalAppele: Decimal;
  montantEncaisse: Decimal;
  resteDu: Decimal;
  totalAppeleCents: number;
  montantEncaisseCents: number;
  resteDuCents: number;
  chargesLabel: string;
  datePaiementFr: string;
  modePaiementLabel: string;
  attestationParagraph: string;
  reserveLegaleParagraph: string;
  plainText: string;
  filename: string;
}

export type QuittanceOutcome =
  | { ok: true; result: QuittanceComputed }
  | { ok: false; error: QuittanceValidationError };

export function daysInMonth(mois: number, annee: number): number {
  return new Date(Date.UTC(annee, mois, 0)).getUTCDate();
}

export function formatIsoDateFr(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return iso;
  const dayLabel = day === 1 ? "1er" : String(day);
  return `${dayLabel} ${MOIS_FR[month - 1]} ${year}`;
}

function formatDay(day: number): string {
  return day === 1 ? "1er" : String(day);
}

export function computeQuittanceDocument(input: QuittanceInput): QuittanceOutcome {
  if (!Number.isInteger(input.mois) || input.mois < 1 || input.mois > 12) {
    return { ok: false, error: "invalid-month" };
  }
  if (input.loyerMensuel.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-rent" };
  }

  const joursDansMois = daysInMonth(input.mois, input.annee);
  const moisLabel = MOIS_FR[input.mois - 1];

  let jourDebutEffectif = 1;
  let jourFinEffectif = joursDansMois;

  if (input.prorata) {
    const debut = input.jourDebut ?? 1;
    const fin = input.jourFin ?? joursDansMois;
    if (
      !Number.isInteger(debut) ||
      !Number.isInteger(fin) ||
      debut < 1 ||
      fin > joursDansMois ||
      debut > fin
    ) {
      return { ok: false, error: "invalid-prorata-days" };
    }
    jourDebutEffectif = debut;
    jourFinEffectif = fin;
  }

  const joursOccupes = jourFinEffectif - jourDebutEffectif + 1;
  const ratio =
    joursOccupes === joursDansMois
      ? new Decimal(1)
      : new Decimal(joursOccupes).dividedBy(joursDansMois);

  const loyerAppele = toCents(input.loyerMensuel.times(ratio));
  const chargesAppelees = toCents(input.chargesMensuelles.times(ratio));
  const totalAppele = toCents(loyerAppele.plus(chargesAppelees));

  let montantEncaisse = totalAppele;
  if (input.statutPaiement === "partiel") {
    if (!input.montantVerse) {
      return { ok: false, error: "partial-amount-required" };
    }
    const verse = toCents(input.montantVerse);
    if (verse.lessThanOrEqualTo(0)) {
      return { ok: false, error: "partial-amount-zero" };
    }
    if (verse.greaterThanOrEqualTo(totalAppele)) {
      return { ok: false, error: "partial-amount-exceeds-total" };
    }
    montantEncaisse = verse;
  }

  const resteDu = toCents(totalAppele.minus(montantEncaisse));
  const isQuittance = resteDu.isZero();

  const documentTitle = isQuittance
    ? "QUITTANCE DE LOYER"
    : "REÇU DE PAIEMENT PARTIEL DE LOYER";
  const documentShortLabel = isQuittance ? "Quittance de loyer" : "Reçu de paiement partiel";

  const periodeLabel =
    joursOccupes === joursDansMois
      ? `du 1er ${moisLabel} ${input.annee} au ${joursDansMois} ${moisLabel} ${input.annee}`
      : `du ${formatDay(jourDebutEffectif)} ${moisLabel} ${input.annee} au ${formatDay(jourFinEffectif)} ${moisLabel} ${input.annee} (${joursOccupes} j. / ${joursDansMois})`;

  const periodeCourte = `${moisLabel} ${input.annee}`;
  const chargesLabel =
    input.typeCharges === "forfait" ? "Forfait de charges" : "Provision pour charges";
  const datePaiementFr = formatIsoDateFr(input.datePaiement);
  const modePaiementLabel = MODE_PAIEMENT_LABELS[input.modePaiement];

  const bailleurNom = input.bailleurNom.trim() || "Nom du bailleur";
  const bailleurAdresse = input.bailleurAdresse.trim() || "Adresse du bailleur";
  const locataireNom = input.locataireNom.trim() || "Nom du locataire";
  const bienAdresse = input.bienAdresse.trim() || "Adresse du logement loué";
  const villeSignature = input.villeSignature.trim() || "Paris";

  const attestationParagraph = isQuittance
    ? `Je soussigné(e) ${bailleurNom}, propriétaire du logement désigné ci-dessus, déclare avoir reçu de ${locataireNom} la somme de ${formatEuros(montantEncaisse)} par ${modePaiementLabel} le ${datePaiementFr}, au titre du paiement intégral du loyer et des charges pour la période ${periodeLabel}, et lui en donne quittance, sous réserve de tous mes droits.`
    : `Je soussigné(e) ${bailleurNom}, propriétaire du logement désigné ci-dessus, déclare avoir reçu de ${locataireNom} la somme de ${formatEuros(montantEncaisse)} par ${modePaiementLabel} le ${datePaiementFr}, à valoir sur le loyer et les charges de la période ${periodeLabel} (total appelé : ${formatEuros(totalAppele)}). Il reste dû à ce jour un solde de ${formatEuros(resteDu)}.`;

  const reserveLegaleParagraph = isQuittance
    ? "Conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989, la présente quittance distingue le loyer et les charges et est remise gratuitement au locataire. Elle ne présume pas du paiement des termes antérieurs."
    : "Conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989, ce document constitue un reçu de paiement partiel et ne vaut pas quittance libératoire. Le bailleur conserve l'intégralité de ses droits pour le recouvrement du solde restant dû.";

  const lines = [
    documentTitle,
    `Période : ${periodeLabel}`,
    "",
    `Bailleur : ${bailleurNom} — ${bailleurAdresse}`,
    `Locataire : ${locataireNom}`,
    `Adresse du logement : ${bienAdresse}`,
    "",
    attestationParagraph,
    "",
    "Détail des sommes :",
    `- Loyer hors charges : ${formatEuros(loyerAppele)}`,
    `- ${chargesLabel} : ${formatEuros(chargesAppelees)}`,
    `- Total appelé pour la période : ${formatEuros(totalAppele)}`,
    `- Montant reçu le ${datePaiementFr} (${modePaiementLabel}) : ${formatEuros(montantEncaisse)}`,
    ...(!isQuittance ? [`- Solde restant dû : ${formatEuros(resteDu)}`] : []),
    "",
    `Fait à ${villeSignature}, le ${datePaiementFr}`,
    `Signature du bailleur : ${bailleurNom}`,
    "",
    reserveLegaleParagraph,
  ];

  const monthPad = String(input.mois).padStart(2, "0");
  const prefix = isQuittance ? "quittance-loyer" : "recu-partiel-loyer";

  return {
    ok: true,
    result: {
      isQuittance,
      documentTitle,
      documentShortLabel,
      moisLabel,
      joursDansMois,
      joursOccupes,
      jourDebutEffectif,
      jourFinEffectif,
      periodeLabel,
      periodeCourte,
      loyerAppele,
      chargesAppelees,
      totalAppele,
      montantEncaisse,
      resteDu,
      totalAppeleCents: centsOf(totalAppele),
      montantEncaisseCents: centsOf(montantEncaisse),
      resteDuCents: centsOf(resteDu),
      chargesLabel,
      datePaiementFr,
      modePaiementLabel,
      attestationParagraph,
      reserveLegaleParagraph,
      plainText: lines.join("\n"),
      filename: `${prefix}-${input.annee}-${monthPad}.pdf`,
    },
  };
}
