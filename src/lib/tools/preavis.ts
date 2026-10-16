/**
 * Calculateur de préavis de location (congé donné par le locataire ou par le
 * propriétaire bailleur) selon les articles 15, 25-8 et 25-15 de la loi
 * n° 89-462 du 6 juillet 1989 et l'article 641 du Code de procédure civile.
 *
 * Règle de décompte des délais en mois (art. 641 CPC) :
 * Le délai fixé en mois se calcule de quantième à quantième à compter du jour
 * de la réception effective de la notification. À défaut de quantième identique
 * dans le mois d'échéance, le délai expire le dernier jour de ce mois.
 */
import { shiftMonthsQuantieme } from "./conge-vente";
import { formatIsoDateFr } from "./quittance-document";

export type AuteurConge = "locataire" | "bailleur";
export type TypeBailPreavis = "vide" | "meublee" | "mobilite";
export type MotifReduitLocataire =
  | "aucun"
  | "zone-tendue"
  | "mutation"
  | "perte-emploi"
  | "premier-emploi"
  | "nouvel-emploi"
  | "sante"
  | "rsa-aah"
  | "logement-social";

export const MOTIFS_REDUITS_LABELS: Record<MotifReduitLocataire, string> = {
  aucun: "Aucun motif particulier (hors zone tendue)",
  "zone-tendue": "Logement situé en zone tendue (décret n° 2013-392)",
  mutation: "Mutation professionnelle (sans condition de distance)",
  "perte-emploi": "Perte d'emploi (licenciement, rupture conventionnelle, fin de CDD)",
  "premier-emploi": "Obtention d'un premier emploi",
  "nouvel-emploi": "Nouvel emploi consécutif à une perte d'emploi",
  sante: "État de santé justifiant un changement de domicile (certificat médical)",
  "rsa-aah": "Bénéficiaire du RSA ou de l'Allocation aux adultes handicapés (AAH)",
  "logement-social": "Attribution d'un logement social (HLM)",
};

export interface PreavisInput {
  auteur: AuteurConge;
  typeBail: TypeBailPreavis;
  motifLocataire: MotifReduitLocataire;
  dateReference: string; // YYYY-MM-DD (date de réception pour locataire, date d'échéance du bail pour bailleur)
}

export type PreavisError = "invalid-date";

export const PREAVIS_ERROR_MESSAGES: Record<PreavisError, string> = {
  "invalid-date": "Saisissez une date valide.",
};

export interface PreavisComputed {
  auteur: AuteurConge;
  typeBail: TypeBailPreavis;
  delaiMois: 0 | 1 | 3 | 6;
  dateReferenceFr: string;
  dateCalculeeIso: string;
  dateCalculeeFr: string;
  fondementLegal: string;
  explicationRegle: string;
  justificatifRequis: boolean;
}

export type PreavisOutcome =
  | { ok: true; result: PreavisComputed }
  | { ok: false; error: PreavisError };

export function computePreavis(input: PreavisInput): PreavisOutcome {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateReference.trim())) {
    return { ok: false, error: "invalid-date" };
  }

  if (input.auteur === "locataire") {
    let delaiMois: 1 | 3 = 3;
    let fondementLegal = "Article 15 I de la loi n° 89-462 du 6 juillet 1989";
    let explicationRegle =
      "En location vide hors zone tendue et sans motif légal de réduction, le délai de préavis du locataire est de 3 mois.";
    let justificatifRequis = false;

    if (input.typeBail === "meublee") {
      delaiMois = 1;
      fondementLegal = "Article 25-8 I de la loi n° 89-462 du 6 juillet 1989";
      explicationRegle =
        "En location meublée à usage de résidence principale, le délai de préavis du locataire est toujours d'un mois, sans avoir à justifier d'un motif.";
    } else if (input.typeBail === "mobilite") {
      delaiMois = 1;
      fondementLegal = "Article 25-15 de la loi n° 89-462 du 6 juillet 1989";
      explicationRegle =
        "Dans le cadre d'un bail mobilité, le locataire peut résilier le contrat à tout moment sous réserve de respecter un délai de préavis d'un mois.";
    } else if (input.motifLocataire !== "aucun") {
      delaiMois = 1;
      justificatifRequis = true;
      explicationRegle = `Préavis réduit à 1 mois en location vide (${MOTIFS_REDUITS_LABELS[input.motifLocataire]}). Le motif et son justificatif doivent impérativement être joints au courrier de congé dès son envoi (à défaut, le préavis de 3 mois s'applique).`;
    }

    const finIso = shiftMonthsQuantieme(input.dateReference, delaiMois);
    if (!finIso) return { ok: false, error: "invalid-date" };

    return {
      ok: true,
      result: {
        auteur: "locataire",
        typeBail: input.typeBail,
        delaiMois,
        dateReferenceFr: formatIsoDateFr(input.dateReference),
        dateCalculeeIso: finIso,
        dateCalculeeFr: formatIsoDateFr(finIso),
        fondementLegal,
        explicationRegle,
        justificatifRequis,
      },
    };
  }

  // Congé donné par le propriétaire bailleur
  if (input.typeBail === "mobilite") {
    return {
      ok: true,
      result: {
        auteur: "bailleur",
        typeBail: "mobilite",
        delaiMois: 0,
        dateReferenceFr: formatIsoDateFr(input.dateReference),
        dateCalculeeIso: input.dateReference,
        dateCalculeeFr: formatIsoDateFr(input.dateReference),
        fondementLegal: "Article 25-14 de la loi n° 89-462 du 6 juillet 1989",
        explicationRegle:
          "Le bail mobilité (conclu pour 1 à 10 mois sans reconduction tacite) prend fin automatiquement à la date d'échéance prévue au contrat, sans que le bailleur ait à délivrer de congé.",
        justificatifRequis: false,
      },
    };
  }

  const delaiMois: 6 | 3 = input.typeBail === "vide" ? 6 : 3;
  const limiteIso = shiftMonthsQuantieme(input.dateReference, -delaiMois);
  if (!limiteIso) return { ok: false, error: "invalid-date" };

  return {
    ok: true,
    result: {
      auteur: "bailleur",
      typeBail: input.typeBail,
      delaiMois,
      dateReferenceFr: formatIsoDateFr(input.dateReference),
      dateCalculeeIso: limiteIso,
      dateCalculeeFr: formatIsoDateFr(limiteIso),
      fondementLegal:
        input.typeBail === "vide"
          ? "Article 15 I de la loi n° 89-462 du 6 juillet 1989"
          : "Article 25-8 I de la loi n° 89-462 du 6 juillet 1989",
      explicationRegle:
        input.typeBail === "vide"
          ? "En location vide, le congé du bailleur (uniquement pour vente, reprise ou motif légitime et sérieux) doit être reçu par le locataire au moins 6 mois avant la date d'échéance du bail."
          : "En location meublée, le congé du bailleur (pour vente, reprise ou motif légitime et sérieux) doit être reçu par le locataire au moins 3 mois avant la date d'échéance du bail.",
      justificatifRequis: true,
    },
  };
}
