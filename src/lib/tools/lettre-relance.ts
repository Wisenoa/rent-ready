/**
 * Générateur de lettre de relance de loyer impayé (relance amiable ou mise en
 * demeure de payer en LRAR).
 *
 * Références légales :
 * - Article 7 a) de la loi n° 89-462 du 6 juillet 1989 : obligation du locataire
 *   de payer le loyer et les charges récupérables aux termes convenus.
 * - Article 24 de la loi n° 89-462 (modifié par la loi n° 2023-668 du 27 juillet
 *   2023) : la clause résolutoire est obligatoire dans tout bail d'habitation et
 *   produit effet 6 semaines après un commandement de payer délivré par
 *   commissaire de justice demeuré infructueux.
 */
import Decimal from "decimal.js";
import { centsOf, formatEuros, toCents } from "./amount";
import { formatIsoDateFr } from "./quittance-document";

export type TonRelance = "amiable" | "mise-en-demeure";

export interface LettreRelanceInput {
  ton: TonRelance;
  bailleurNom: string;
  bailleurAdresse: string;
  locataireNom: string;
  bienAdresse: string;
  periodeImpayee: string;
  dateEcheance: string; // YYYY-MM-DD
  dateCourrier: string; // YYYY-MM-DD
  villeCourrier: string;
  loyerHorsCharges: Decimal;
  charges: Decimal;
  montantDejaVerse: Decimal;
}

export type LettreRelanceError = "zero-total" | "already-paid";

export const LETTRE_RELANCE_ERROR_MESSAGES: Record<LettreRelanceError, string> = {
  "zero-total": "Indiquez un montant de loyer supérieur à 0,00 €.",
  "already-paid": "Le montant déjà versé couvre la totalité de l'échéance : aucun solde impayé ne subsiste.",
};

export interface LettreRelanceComputed {
  ton: TonRelance;
  modeEnvoiLabel: string;
  objet: string;
  totalAppele: Decimal;
  montantDejaVerse: Decimal;
  resteDu: Decimal;
  resteDuCents: number;
  dateEcheanceFr: string;
  dateCourrierFr: string;
  paragraphs: string[];
  plainText: string;
  prochaineEtape: string;
}

export type LettreRelanceOutcome =
  | { ok: true; result: LettreRelanceComputed }
  | { ok: false; error: LettreRelanceError };

export function computeLettreRelance(input: LettreRelanceInput): LettreRelanceOutcome {
  const loyer = toCents(input.loyerHorsCharges);
  const charges = toCents(input.charges);
  const totalAppele = toCents(loyer.plus(charges));
  const dejaVerse = toCents(input.montantDejaVerse);

  if (totalAppele.lessThanOrEqualTo(0)) {
    return { ok: false, error: "zero-total" };
  }
  if (dejaVerse.greaterThanOrEqualTo(totalAppele)) {
    return { ok: false, error: "already-paid" };
  }

  const resteDu = toCents(totalAppele.minus(dejaVerse));
  const bailleurNom = input.bailleurNom.trim() || "Nom du bailleur";
  const bailleurAdresse = input.bailleurAdresse.trim() || "Adresse du bailleur";
  const locataireNom = input.locataireNom.trim() || "Nom du locataire";
  const bienAdresse = input.bienAdresse.trim() || "Adresse du logement loué";
  const periode = input.periodeImpayee.trim() || "du mois en cours";
  const ville = input.villeCourrier.trim() || "Paris";
  const dateEcheanceFr = formatIsoDateFr(input.dateEcheance);
  const dateCourrierFr = formatIsoDateFr(input.dateCourrier);

  const modeEnvoiLabel =
    input.ton === "amiable"
      ? "Courrier simple ou e-mail (1er rappel courtois)"
      : "Lettre recommandée avec accusé de réception (LRAR)";

  const objet =
    input.ton === "amiable"
      ? `Objet : Rappel d'échéance de loyer — ${periode}`
      : `Objet : Mise en demeure de payer les loyers et charges — LRAR`;

  const detailMontants = dejaVerse.greaterThan(0)
    ? `Loyer hors charges : ${formatEuros(loyer)} + provisions sur charges : ${formatEuros(charges)} (total appelé : ${formatEuros(totalAppele)}), sous déduction de votre versement partiel de ${formatEuros(dejaVerse)}, soit un solde restant dû de ${formatEuros(resteDu)}.`
    : `Loyer hors charges : ${formatEuros(loyer)} + provisions sur charges : ${formatEuros(charges)}, soit un total restant dû de ${formatEuros(resteDu)}.`;

  const paragraphs =
    input.ton === "amiable"
      ? [
          "Madame, Monsieur,",
          `Sauf erreur de ma part ou croisement de votre règlement avec le présent courrier, je constate que l'échéance de loyer de la période ${periode}, exigible le ${dateEcheanceFr} pour le logement situé ${bienAdresse}, n'a pas encore été intégralement réglée à ce jour.`,
          `Pour rappel, le décompte s'établit comme suit : ${detailMontants}`,
          `S'agissant vraisemblablement d'un simple oubli, je vous remercie de bien vouloir procéder au règlement de la somme de ${formatEuros(resteDu)} dans les meilleurs délais. Si votre paiement a été effectué entre-temps, je vous prie de ne pas tenir compte de ce rappel.`,
          "Si vous rencontrez une difficulté passagère, je reste à votre disposition pour en échanger dès maintenant et convenir, le cas échéant, d'un échéancier écrit.",
          "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        ]
      : [
          "Madame, Monsieur,",
          `Malgré mon précédent rappel concernant le logement que vous occupez au ${bienAdresse}, je constate qu'à la date du ${dateCourrierFr}, le terme de la période ${periode} (exigible le ${dateEcheanceFr}) demeure impayé à hauteur de ${formatEuros(resteDu)}.`,
          `Le détail des sommes dues conformément à l'article 7 a) de la loi n° 89-462 du 6 juillet 1989 est le suivant : ${detailMontants}`,
          `Par la présente, je vous mets formellement en demeure de régler la somme de ${formatEuros(resteDu)} sous un délai de huit (8) jours à compter de la réception de ce courrier recommandé.`,
          "À défaut de règlement intégral ou d'accord écrit d'apurement dans ce délai, je me verrai contraint(e) de transmettre le dossier à un commissaire de justice afin de vous faire délivrer un commandement de payer visant la clause résolutoire du bail (article 24 de la loi du 6 juillet 1989, prévoyant un délai de six semaines) et de déclarer l'incident auprès du garant ou de l'assurance loyers impayés.",
          "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        ];

  const lines = [
    bailleurNom,
    bailleurAdresse,
    "",
    `À l'attention de ${locataireNom}`,
    bienAdresse,
    "",
    `À ${ville}, le ${dateCourrierFr}`,
    modeEnvoiLabel,
    "",
    objet,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    bailleurNom,
  ];

  const prochaineEtape =
    input.ton === "amiable"
      ? "Sans régularisation sous 8 à 10 jours après ce rappel amiable, envoyez une mise en demeure par lettre recommandée avec accusé de réception (LRAR) et prévenez la caution ou l'assurance loyers impayés (GLI)."
      : "Si la mise en demeure reste sans effet après 8 jours, mandatez un commissaire de justice pour délivrer un commandement de payer. Depuis la loi n° 2023-668 du 27 juillet 2023, la clause résolutoire laisse 6 semaines au locataire pour apurer sa dette.";

  return {
    ok: true,
    result: {
      ton: input.ton,
      modeEnvoiLabel,
      objet,
      totalAppele,
      montantDejaVerse: dejaVerse,
      resteDu,
      resteDuCents: centsOf(resteDu),
      dateEcheanceFr,
      dateCourrierFr,
      paragraphs,
      plainText: lines.join("\n"),
      prochaineEtape,
    },
  };
}
