/**
 * Générateur de lettre de congé pour vente donné par le propriétaire bailleur
 * (article 15 II pour une location vide, article 25-8 pour une location meublée,
 * loi n° 89-462 du 6 juillet 1989).
 *
 * Règles impératives :
 * - Location vide (art. 15) : le congé doit être REÇU par le locataire au moins
 *   6 mois avant l'échéance du bail. À peine de nullité, il indique le prix et
 *   les conditions de la vente projetée, décrit précisément les locaux loués
 *   (et leurs annexes), vaut offre de vente pendant les 2 premiers mois du
 *   délai de préavis légal, reproduit les 5 premiers alinéas de l'article 15 II
 *   et est accompagné de la notice d'information (arrêté du 13 décembre 2017).
 * - Location meublée (art. 25-8) : le congé doit être REÇU par le locataire au
 *   moins 3 mois avant l'échéance du bail et motiver la décision de vendre,
 *   sans droit de préemption légal au profit du locataire.
 * - Mode de notification : lettre recommandée avec accusé de réception (LRAR),
 *   acte de commissaire de justice, ou remise en main propre contre récépissé
 *   ou émargement. Le délai court à compter de la réception effective.
 */
import Decimal from "decimal.js";
import { centsOf, formatEuros, toCents } from "./amount";
import { formatIsoDateFr } from "./quittance-document";

export type TypeBailConge = "vide" | "meublee";

export interface CongeVenteInput {
  typeBail: TypeBailConge;
  dateEcheanceBail: string; // YYYY-MM-DD
  dateCourrier: string; // YYYY-MM-DD
  prixVente: Decimal;
  conditionsPaiement: string;
  descriptionBien: string;
  bailleurNom: string;
  bailleurAdresse: string;
  locataireNom: string;
  bienAdresse: string;
  villeCourrier: string;
}

export type CongeVenteError = "invalid-date" | "zero-price";

export const CONGE_VENTE_ERROR_MESSAGES: Record<CongeVenteError, string> = {
  "invalid-date": "Indiquez la date d'échéance du bail.",
  "zero-price": "Indiquez le prix de vente hors frais d'acte (obligatoire à peine de nullité en location vide).",
};

export interface CongeVenteComputed {
  typeBail: TypeBailConge;
  delaiPreavisMois: 6 | 3;
  droitPreemption: boolean;
  dateEcheanceFr: string;
  dateLimiteReceptionIso: string;
  dateLimiteReceptionFr: string;
  finOffrePreemptionFr: string | null;
  estHorsDelai: boolean;
  prixVente: Decimal;
  prixVenteCents: number;
  objet: string;
  paragraphs: string[];
  alineasArt15: string[] | null;
  plainText: string;
}

export type CongeVenteOutcome =
  | { ok: true; result: CongeVenteComputed }
  | { ok: false; error: CongeVenteError };

function parseIsoUtc(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return d;
}

function toIsoUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Soustrait ou ajoute N mois de quantième à quantième (art. 641 CPC) : si le
 * mois cible compte moins de jours, s'arrête au dernier jour de ce mois.
 */
export function shiftMonthsQuantieme(iso: string, deltaMonths: number): string | null {
  const date = parseIsoUtc(iso);
  if (!date) return null;
  const startDay = date.getUTCDate();
  const targetMonthIndex = date.getUTCMonth() + deltaMonths;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
  const maxDayInTarget = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const day = Math.min(startDay, maxDayInTarget);
  return toIsoUtc(new Date(Date.UTC(targetYear, normalizedMonth, day)));
}

const ALINEAS_ART_15_II = [
  "« II. — Lorsqu'il est fondé sur la décision de vendre le logement, le congé doit, à peine de nullité, indiquer le prix et les conditions de la vente projetée. Le congé vaut offre de vente au profit du locataire : l'offre est valable pendant les deux premiers mois du délai de préavis. Les dispositions de l'article 46 de la loi n° 65-557 du 10 juillet 1965 fixant le statut de la copropriété des immeubles bâtis ne sont pas applicables au congé fondé sur la décision de vendre le logement.",
  "À l'expiration du délai de préavis, le locataire qui n'a pas accepté l'offre de vente est déchu de plein droit de tout titre d'occupation sur le local.",
  "Le locataire qui accepte l'offre dispose, à compter de la date d'envoi de sa réponse au bailleur, d'un délai de deux mois pour la réalisation de l'acte de vente. Si, dans sa réponse, il notifie son intention de recourir à un prêt, l'acceptation par le locataire de l'offre de vente est subordonnée à l'obtention du prêt et le délai de réalisation de la vente est porté à quatre mois. Le contrat de location est prorogé jusqu'à l'expiration du délai de réalisation de la vente. Si, à l'expiration de ce délai, la vente n'a pas été réalisée, l'acceptation de l'offre de vente est nulle de plein droit et le locataire est déchu de plein droit de tout titre d'occupation.",
  "Dans le cas où le propriétaire décide de vendre à des conditions ou à un prix plus avantageux pour l'acquéreur, le notaire doit, lorsque le bailleur n'y a pas préalablement procédé, notifier ces conditions et prix au locataire. Cette notification doit, à peine de nullité, reproduire les cinq premiers alinéas du présent II. Elle vaut offre de vente au profit du locataire. Cette offre est valable pendant une durée d'un mois à compter de sa réception. L'offre qui n'a pas été acceptée dans le délai d'un mois est caduque.",
  "Le locataire qui accepte l'offre ainsi notifiée dispose, à compter de la date d'envoi de sa réponse au bailleur ou au notaire, d'un délai de deux mois pour la réalisation de l'acte de vente. Si, dans sa réponse, il notifie son intention de recourir à un prêt, l'acceptation par le locataire de l'offre de vente est subordonnée à l'obtention du prêt et le délai de réalisation de la vente est porté à quatre mois. Si, à l'expiration de ce délai, la vente n'a pas été réalisée, l'acceptation de l'offre de vente est nulle de plein droit. »",
];

export function computeCongeVente(input: CongeVenteInput): CongeVenteOutcome {
  const echeance = parseIsoUtc(input.dateEcheanceBail);
  if (!echeance) {
    return { ok: false, error: "invalid-date" };
  }
  const prix = toCents(input.prixVente);
  if (prix.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-price" };
  }

  const delaiPreavisMois: 6 | 3 = input.typeBail === "vide" ? 6 : 3;
  const droitPreemption = input.typeBail === "vide";

  const dateLimiteReceptionIso = shiftMonthsQuantieme(input.dateEcheanceBail, -delaiPreavisMois)!;
  const dateEcheanceFr = formatIsoDateFr(input.dateEcheanceBail);
  const dateLimiteReceptionFr = formatIsoDateFr(dateLimiteReceptionIso);
  const dateCourrierFr = formatIsoDateFr(input.dateCourrier);

  // En location vide, l'offre de vente vaut pendant les 2 premiers mois du préavis légal (soit entre M-6 et M-4).
  const finOffrePreemptionIso = droitPreemption
    ? shiftMonthsQuantieme(input.dateEcheanceBail, -4)
    : null;
  const finOffrePreemptionFr = finOffrePreemptionIso ? formatIsoDateFr(finOffrePreemptionIso) : null;

  const courrierDate = parseIsoUtc(input.dateCourrier);
  const limiteDate = parseIsoUtc(dateLimiteReceptionIso);
  const estHorsDelai =
    courrierDate !== null && limiteDate !== null && courrierDate.getTime() > limiteDate.getTime();

  const bailleurNom = input.bailleurNom.trim() || "Nom du bailleur";
  const bailleurAdresse = input.bailleurAdresse.trim() || "Adresse du bailleur";
  const locataireNom = input.locataireNom.trim() || "Nom du locataire";
  const bienAdresse = input.bienAdresse.trim() || "Adresse du logement loué";
  const ville = input.villeCourrier.trim() || "Paris";
  const descriptionBien =
    input.descriptionBien.trim() ||
    "Appartement à usage d'habitation et ses annexes éventuelles tels que désignés au contrat de location";
  const conditionsPaiement =
    input.conditionsPaiement.trim() ||
    "Paiement comptant le jour de la signature de l'acte authentique de vente devant notaire, hors frais d'acte notarié à la charge de l'acquéreur";

  const objet =
    input.typeBail === "vide"
      ? "Objet : Congé pour vendre valant offre de vente (article 15 de la loi n° 89-462 du 6 juillet 1989) — LRAR"
      : "Objet : Congé pour vendre (article 25-8 de la loi n° 89-462 du 6 juillet 1989) — LRAR";

  const paragraphs =
    input.typeBail === "vide"
      ? [
          "Madame, Monsieur,",
          `Propriétaire du logement que vous occupez actuellement au ${bienAdresse}, je vous notifie par la présente mon intention de ne pas renouveler votre bail d'habitation à son échéance du ${dateEcheanceFr}, en raison de ma décision de vendre ce bien libre de toute occupation, conformément à l'article 15 de la loi n° 89-462 du 6 juillet 1989.`,
          `Désignation précise des locaux loués objet de la vente : ${descriptionBien}, situés ${bienAdresse}.`,
          `Prix et conditions de la vente projetée : le bien est proposé au prix de ${formatEuros(prix)} (${conditionsPaiement}).`,
          `Conformément à l'article 15 II de la loi du 6 juillet 1989, le présent congé vaut offre de vente à votre profit pendant les deux premiers mois du délai légal de préavis de six mois, soit jusqu'au ${finOffrePreemptionFr}. Si vous acceptez cette offre dans ce délai, vous disposerez de deux mois à compter de l'envoi de votre réponse pour signer l'acte authentique (délai porté à quatre mois si vous notifiez votre intention de recourir à un prêt immobilier).`,
          `À défaut d'acceptation de l'offre de vente dans ce délai, vous devrez avoir libéré les lieux, rendu les clés et effectué l'état des lieux de sortie au plus tard le ${dateEcheanceFr}. Vous trouverez jointe au présent courrier la notice d'information relative aux obligations du bailleur et aux voies de recours et d'indemnisation du locataire (arrêté du 13 décembre 2017).`,
          "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        ]
      : [
          "Madame, Monsieur,",
          `Propriétaire du logement meublé que vous occupez actuellement au ${bienAdresse}, je vous notifie par la présente mon intention de ne pas renouveler votre contrat de location à son échéance du ${dateEcheanceFr}, en raison de ma décision de mettre en vente ce bien (${descriptionBien}), conformément à l'article 25-8 de la loi n° 89-462 du 6 juillet 1989.`,
          `En matière de location meublée, le délai de préavis légal du bailleur est de trois mois avant l'échéance du bail et ce congé n'ouvre pas de droit de préemption légal. À titre purement informatif, la mise en vente est envisagée au prix de ${formatEuros(prix)} (${conditionsPaiement}) ; vous pouvez naturellement me faire part de votre intérêt si vous souhaitez formuler une offre d'acquisition.`,
          `En conséquence, je vous remercie de bien vouloir libérer les lieux, restituer les clés et convenir d'une date pour l'état des lieux de sortie au plus tard le ${dateEcheanceFr}.`,
          "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        ];

  const alineasArt15 = droitPreemption ? ALINEAS_ART_15_II : null;

  const lines = [
    bailleurNom,
    bailleurAdresse,
    "",
    `À l'attention de ${locataireNom}`,
    bienAdresse,
    "",
    `À ${ville}, le ${dateCourrierFr}`,
    "Lettre recommandée avec accusé de réception (ou signification par commissaire de justice)",
    "",
    objet,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    `Signature du bailleur : ${bailleurNom}`,
    ...(alineasArt15
      ? [
          "",
          "---",
          "Reproduction obligatoire des cinq premiers alinéas de l'article 15 II de la loi n° 89-462 du 6 juillet 1989 (à peine de nullité) :",
          "",
          ...alineasArt15.flatMap((a) => [a, ""]),
        ]
      : []),
  ];

  return {
    ok: true,
    result: {
      typeBail: input.typeBail,
      delaiPreavisMois,
      droitPreemption,
      dateEcheanceFr,
      dateLimiteReceptionIso,
      dateLimiteReceptionFr,
      finOffrePreemptionFr,
      estHorsDelai,
      prixVente: prix,
      prixVenteCents: centsOf(prix),
      objet,
      paragraphs,
      alineasArt15,
      plainText: lines.join("\n"),
    },
  };
}
