/**
 * Checklist interactive d'état des lieux d'entrée et de sortie conforme au
 * décret n° 2016-382 du 30 mars 2016 et à l'article 3-2 de la loi n° 89-462 du
 * 6 juillet 1989.
 */
import { formatIsoDateFr } from "./quittance-document";

export type TypeEtatDesLieux = "entree" | "sortie";
export type EtatElement = "bon" | "usage" | "degradation" | "non-verifie";

export const ETAT_ELEMENT_LABELS: Record<EtatElement, string> = {
  bon: "Bon état",
  usage: "Usure normale (vétusté)",
  degradation: "Anomalie / dégradation à noter",
  "non-verifie": "À contrôler",
};

export interface PosteEtatDesLieux {
  id: string;
  piece: string;
  intitule: string;
  detailObligatoire: string;
}

export const POSTES_ETAT_DES_LIEUX: PosteEtatDesLieux[] = [
  {
    id: "compteur-elec",
    piece: "Compteurs & équipements",
    intitule: "Compteur électrique (PDL / index HP-HC)",
    detailObligatoire: "Relever le numéro de point de livraison (14 chiffres) et les index en kWh.",
  },
  {
    id: "compteur-eau",
    piece: "Compteurs & équipements",
    intitule: "Compteur d'eau froide (et eau chaude collective)",
    detailObligatoire: "Relever les index en m³ pour la régularisation des charges.",
  },
  {
    id: "compteur-gaz",
    piece: "Compteurs & équipements",
    intitule: "Compteur de gaz (PCE / index m³) et chauffage",
    detailObligatoire: "Tester l'allumage de la chaudière ou des radiateurs.",
  },
  {
    id: "daaf-securite",
    piece: "Compteurs & équipements",
    intitule: "Détecteur avertisseur autonome de fumée (DAAF) et VMC",
    detailObligatoire: "Vérifier la présence du DAAF, son bouton test et l'aspiration des bouches VMC.",
  },
  {
    id: "cles-acces",
    piece: "Clés & accès",
    intitule: "Jeux de clés, badges Vigik, télécommandes, boîte aux lettres",
    detailObligatoire: "Compter chaque clé et badge remis pièce par pièce (entrée, porte palière, cave, parking).",
  },
  {
    id: "entree-sejour-sols-murs",
    piece: "Entrée & pièce principale",
    intitule: "Revêtements de sols, plinthes, murs et plafonds",
    detailObligatoire: "Préciser la nature (parquet, carrelage, peinture) et les marques éventuelles.",
  },
  {
    id: "entree-sejour-menuiseries",
    piece: "Entrée & pièce principale",
    intitule: "Fenêtres, double vitrage, volets, prises et interrupteurs",
    detailObligatoire: "Tester l'ouverture/fermeture des ouvrants et des volets roulants ou battants.",
  },
  {
    id: "cuisine-equipements",
    piece: "Cuisine",
    intitule: "Évier, robinetterie, joints d'étanchéité, plaques et hotte",
    detailObligatoire: "Contrôler l'écoulement sans fuite sous le siphon et l'état des joints silicone.",
  },
  {
    id: "chambres",
    piece: "Chambre(s)",
    intitule: "Sols, murs, placards aménagés, radiateurs et ouvrants",
    detailObligatoire: "Vérifier le coulissement des portes de placard et l'état des poignées.",
  },
  {
    id: "sanitaires-sdb",
    piece: "Salle de bains & WC",
    intitule: "Douche/baignoire, joints, lavabo, chasse d'eau et ventilation",
    detailObligatoire: "Distinguer le jaunissement normal des joints (vétusté) d'un défaut d'entretien.",
  },
];

export interface SyntheseEtatDesLieuxInput {
  typeEdl: TypeEtatDesLieux;
  dateEdl: string;
  bienAdresse: string;
  locataireNom: string;
  indexElectricite: string;
  indexEauFroide: string;
  indexGaz: string;
  nombreCles: string;
  etats: Record<string, EtatElement>;
  observations: string;
}

export interface SyntheseEtatDesLieuxComputed {
  typeEdl: TypeEtatDesLieux;
  dateEdlFr: string;
  totalPostes: number;
  nbVerifies: number;
  nbBonEtat: number;
  nbUsureNormale: number;
  nbDegradations: number;
  nbNonVerifies: number;
  rappelLegal: string;
  plainText: string;
}

export function computeSyntheseEtatDesLieux(
  input: SyntheseEtatDesLieuxInput
): SyntheseEtatDesLieuxComputed {
  let nbBonEtat = 0;
  let nbUsureNormale = 0;
  let nbDegradations = 0;
  let nbNonVerifies = 0;

  for (const poste of POSTES_ETAT_DES_LIEUX) {
    const etat = input.etats[poste.id] ?? "non-verifie";
    if (etat === "bon") nbBonEtat++;
    else if (etat === "usage") nbUsureNormale++;
    else if (etat === "degradation") nbDegradations++;
    else nbNonVerifies++;
  }

  const totalPostes = POSTES_ETAT_DES_LIEUX.length;
  const nbVerifies = totalPostes - nbNonVerifies;
  const dateEdlFr = formatIsoDateFr(input.dateEdl);

  const rappelLegal =
    input.typeEdl === "entree"
      ? "Article 3-2 de la loi du 6 juillet 1989 : le locataire peut demander au bailleur de compléter l'état des lieux d'entrée dans les 10 jours calendaires suivant son établissement, ainsi que pendant le premier mois de la période de chauffe concernant l'état des éléments de chauffage."
      : "Décret n° 2016-382 du 30 mars 2016 : à la sortie, seule une dégradation imputable au locataire (et non l'usure normale liée au temps et à la vétusté) peut justifier une retenue sur le dépôt de garantie, appuyée par un devis ou une facture.";

  const lines = [
    `SYNTHÈSE D'ÉTAT DES LIEUX ${input.typeEdl === "entree" ? "D'ENTRÉE" : "DE SORTIE"}`,
    `Date : ${dateEdlFr}`,
    `Logement : ${input.bienAdresse.trim() || "Adresse à préciser"}`,
    `Locataire : ${input.locataireNom.trim() || "Nom du locataire"}`,
    "",
    "Relevés des compteurs et clés :",
    `- Électricité : ${input.indexElectricite.trim() || "Non renseigné"}`,
    `- Eau froide : ${input.indexEauFroide.trim() || "Non renseigné"}`,
    `- Gaz : ${input.indexGaz.trim() || "Non renseigné"}`,
    `- Clés et badges remis : ${input.nombreCles.trim() || "Non renseigné"}`,
    "",
    `Points contrôlés (${nbVerifies}/${totalPostes}) :`,
    ...POSTES_ETAT_DES_LIEUX.map((poste) => {
      const etat = input.etats[poste.id] ?? "non-verifie";
      return `- [${ETAT_ELEMENT_LABELS[etat]}] ${poste.piece} — ${poste.intitule}`;
    }),
    ...(input.observations.trim()
      ? ["", "Observations et réserves :", input.observations.trim()]
      : []),
    "",
    rappelLegal,
  ];

  return {
    typeEdl: input.typeEdl,
    dateEdlFr,
    totalPostes,
    nbVerifies,
    nbBonEtat,
    nbUsureNormale,
    nbDegradations,
    nbNonVerifies,
    rappelLegal,
    plainText: lines.join("\n"),
  };
}
