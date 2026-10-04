/**
 * Source de vérité des données réglementaires publiées.
 *
 * OBJECTIF
 * Chaque valeur réglementaire affichée sur le site doit pouvoir répondre à six
 * questions : VALUE, SOURCE, SOURCE URL, DATE VERIFIED, APPLIES FROM, LAST
 * CHECKED. Ce fichier est le seul endroit où ces attributs vivent ; le contenu
 * public est censé les lire ici plutôt que de les réécrire.
 *
 * RÉUTILISATION — ET NON DUPLICATION
 * Les valeurs INSEE ne sont PAS recopiées. `IRL_INDICES` reste la source unique
 * (src/lib/irl-calculator.ts) et `IRL_SOURCE_RECORDS` en est une projection :
 * supprimer ou corriger une valeur dans irl-calculator.ts la met à jour ici
 * automatiquement. Le test `regulatory-sources.test.ts` compare les deux tables
 * valeur par valeur pour qu'une divergence soit impossible à merger en silence.
 * (Ce mécanisme a déjà payé : cinq valeurs de la table IRL étaient fausses
 * avant le 2026-10-04 et le test ne vérifiait que la forme du tableau.)
 *
 * RÈGLE DUREE — NE PAS INVENTER
 * Une valeur dont la source primaire n'a pas pu être consultée est enregistrée
 * avec `verified: false` et une raison. Elle reste visible et testée, et le test
 * refuse qu'elle soit utilisée dans du contenu public sans revue explicite.
 * Aucune statistique propriétaire n'est publiée ici : ce fichier ne contient
 * que du texte primaire (Légifrance, Service-Public, INSEE, impots.gouv.fr,
 * ministère de l'Économie).
 *
 * PASSÉ DE VÉRIFICATION : 2026-10-04
 * Sources effectivement consultées ce jour-là (voir SOURCES) : F13723 (IRL,
 * vérifié 12/07/2026), F1311 (révision du loyer, 08/08/2025), F31269 (dépôt de
 * garantie, 09/06/2026), F35247 (quittance, 25/08/2025), F1310 (montant du
 * loyer, 01/08/2026), F479 (prescription, 10/04/2025), F947 (charges
 * récupérables, 15/04/2025), F1991 (revenus fonciers, 15/04/2026), F32744
 * (revenus de location meublée, 15/04/2026), ministère de l'Économie (taux
 * d'intérêt légal). Légifrance était injoignable depuis cet environnement :
 * les articles sont cités tels que Service-Public les référence, sans avoir pu
 * être ouverts.
 */

import { IRL_INDICES, IRL_SOURCE_URL } from "@/lib/irl-calculator";

/** Date de la passe de vérification qui a produit les `dateVerified` ci-dessous. */
export const VERIFICATION_RUN_DATE = "2026-10-04";

export type RegulatoryCategory =
  | "irl"
  | "depot-garantie"
  | "quittance"
  | "revision-loyer"
  | "montant-du-loyer"
  | "prescription"
  | "charges"
  | "fiscalite"
  | "interet-legal";

export interface RegulatorySource {
  /** Identifiant stable, kebab-case. Utilisé par le contenu et par les tests. */
  id: string;
  category: RegulatoryCategory;
  /** Libellé affichable, en français. */
  label: string;
  /** VALUE — l'énoncé de la règle ou la valeur numérique. */
  value: string;
  /** Unité, uniquement si `value` est un nombre. */
  unit?: string;
  /** Article ou texte qui fonde la valeur, tel que référencé par la source. */
  legalBasis?: string;
  /** SOURCE — qui publie cette valeur. */
  source: string;
  /** SOURCE URL. */
  sourceUrl: string;
  /** DATE — date de publication de la source (celle de sa vérification editoriale). */
  publishedAt: string;
  /** DATE VERIFIED — dernière consultation manuelle de la source. */
  dateVerified: string;
  /**
   * APPLIES FROM — date la plus ancienne connue à laquelle la valeur s'applique.
   * Quand la date d'entrée en vigueur exacte n'est pas documentée par la source,
   * on retient la date de vérification de la source : c'est la seule date que
   * l'on peut défendre sans l'inventer.
   */
  appliesFrom: string;
  /** LAST CHECKED — identique à `dateVerified`, gardé explicite pour l'audit. */
  lastChecked: string;
  /** false = source primaire non consultable lors de la passe. Raison obligatoire. */
  verified: boolean;
  /** Raison de la non-vérification. Requis par le type quand `verified: false`. */
  verificationNote?: string;
}

/**
 * Bibliothèques de sources. `publishedAt` est la date de vérification éditoriale
 * imprimée sur la page par l'éditeur : c'est la seule date de publication
 * disponible pour un contenu institutionnel continuously mis à jour.
 */
export const SOURCES = {
  irl: {
    name: "Service-Public — Indice de référence des loyers (IRL), F13723",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F13723",
    publishedAt: "2026-07-12",
  },
  revisionLoyer: {
    name: "Service-Public — Augmentation et révision du loyer en cours de bail d’habitation, F1311",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1311",
    publishedAt: "2025-08-08",
  },
  montantLoyer: {
    name: "Service-Public — Montant du loyer d'un logement appartenant à un propriétaire privé, F1310",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1310",
    publishedAt: "2026-08-01",
  },
  depotGarantie: {
    name: "Service-Public — Dépôt de garantie dans un bail d'habitation, F31269",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31269",
    publishedAt: "2026-06-09",
  },
  quittance: {
    name: "Service-Public — Quittance de loyer : comment l'obtenir ?, F35247",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F35247",
    publishedAt: "2025-08-25",
  },
  prescription: {
    name: "Service-Public — Délai de prescription d'une dette de loyer ou de charges locatives, F479",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F479",
    publishedAt: "2025-04-10",
  },
  chargesRecuperables: {
    name: "Service-Public — Charges à payer par le locataire (charges récupérables), F947",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F947",
    publishedAt: "2025-04-15",
  },
  revenusFonciers: {
    name: "Service-Public — Impôt sur le revenu : revenus locatifs (location non meublée), F1991",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1991",
    publishedAt: "2026-04-15",
  },
  revenusMeubles: {
    name: "Service-Public — Impôt sur le revenu : revenus d'une location meublée, F32744",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F32744",
    publishedAt: "2026-04-15",
  },
  interetLegal: {
    name: "Ministère de l'Économie — Tout savoir sur le taux d'intérêt légal",
    url: "https://www.economie.gouv.fr/particuliers/gerer-mon-argent/emprunter-et-sassurer/tout-savoir-sur-le-taux-dinteret-legal",
    publishedAt: "2025-12-15",
  },
  inseeIrl: {
    name: "INSEE — Indice de référence des loyers (IRL), série idBank 001515333",
    url: IRL_SOURCE_URL,
    publishedAt: "2026-07-12",
  },
} as const;

/**
 * Projection des indices INSEE — aucune valeur n'est dupliquée ici.
 *
 * `appliesFrom` est la date de publication au Journal officiel : c'est à
 * compter de cette date que l'indice peut servir de référence de révision.
 */
export const IRL_SOURCE_RECORDS: RegulatorySource[] = IRL_INDICES.map((entry) => ({
  id: `irl-${entry.quarter.toLowerCase()}`,
  category: "irl" as const,
  label: `IRL ${entry.quarter} (${entry.trimester}e trimestre ${entry.year}, métropole continent)`,
  value: entry.value.toString(),
  unit: "point de base (base 100 au 4e trimestre 1998)",
  legalBasis: "Loi n° 89-462 du 6 juillet 1989, article 17-1",
  source: SOURCES.inseeIrl.name,
  sourceUrl: IRL_SOURCE_URL,
  publishedAt: entry.publicationDate,
  dateVerified: VERIFICATION_RUN_DATE,
  appliesFrom: entry.publicationDate,
  lastChecked: VERIFICATION_RUN_DATE,
  verified: true,
}));

/** Raccourci de construction, pour que `appliesFrom` ne soit jamais oublié. */
function rule(params: {
  id: string;
  category: RegulatoryCategory;
  label: string;
  value: string;
  unit?: string;
  legalBasis?: string;
  source: (typeof SOURCES)[keyof typeof SOURCES];
  appliesFrom?: string;
  verified?: boolean;
  verificationNote?: string;
}): RegulatorySource {
  const verified = params.verified ?? true;
  if (!verified && !params.verificationNote) {
    throw new Error(
      `Entrée ${params.id} : verified:false exige une verificationNote (pas de trou muet).`
    );
  }
  return {
    id: params.id,
    category: params.category,
    label: params.label,
    value: params.value,
    ...(params.unit ? { unit: params.unit } : {}),
    legalBasis: params.legalBasis,
    source: params.source.name,
    sourceUrl: params.source.url,
    publishedAt: params.source.publishedAt,
    dateVerified: VERIFICATION_RUN_DATE,
    appliesFrom: params.appliesFrom ?? params.source.publishedAt,
    lastChecked: VERIFICATION_RUN_DATE,
    verified,
    ...(params.verificationNote ? { verificationNote: params.verificationNote } : {}),
  };
}

/**
 * Toutes les valeurs réglementaires centralisées, hors IRL (voir
 * IRL_SOURCE_RECORDS) et hors quantification : les règles dont la source primaire
 * n'a pas pu être atteinte sont listées dans REGULATORY_GAPS, sans valeur.
 */
export const REGULATORY_SOURCES: RegulatorySource[] = [
  // ---------------------------------------------------------------- IRL / 17-1
  rule({
    id: "irl-formule-revision",
    category: "revision-loyer",
    label: "Formule de la révision annuelle du loyer",
    value:
      "Nouveau loyer = montant actuel du loyer mensuel × (IRL du trimestre de référence de l'année en cours ÷ IRL du même trimestre de l'année précédente)",
    legalBasis: "Loi n° 89-462, article 17-1",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-arrondi",
    category: "revision-loyer",
    label: "Arrondi du résultat de la révision",
    value:
      "Le résultat doit être arrondi à la deuxième décimale la plus proche (INSEE, règle d'arrondi)",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-frequence-clause",
    category: "revision-loyer",
    label: "Conditions de la révision annuelle",
    value:
      "Une révision par an au maximum, et uniquement si le bail contient une clause de révision annuelle. Sans cette clause, le loyer ne peut pas être révisé.",
    legalBasis: "Loi n° 89-462, article 17-1",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-delai-application",
    category: "revision-loyer",
    label: "Délai pour appliquer la révision",
    value:
      "La révision doit être appliquée durant l'année qui suit la date de révision. Une fois le délai d'un an écoulé, la révision non appliquée est perdue pour le propriétaire.",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-non-retroactive",
    category: "revision-loyer",
    label: "Portée de la révision",
    value:
      "La révision n'est pas rétroactive : elle ne s'applique qu'à partir de la date de la demande du propriétaire.",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-complement-de-loyer",
    category: "revision-loyer",
    label: "Assiette de la révision en présence d'un complément de loyer",
    value:
      "Si un complément de loyer s'applique, le montant à réviser est le total du loyer de base et du complément de loyer.",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-exemple-officiel",
    category: "revision-loyer",
    label: "Exemple chiffré de révision (source)",
    value:
      "Bail signé le 20/07/2025 à 600 € : 600 × 148,37 ÷ 146,68 = 606,91 € au 20/07/2026",
    source: SOURCES.revisionLoyer,
  }),
  rule({
    id: "irl-interdit-logement-f-g-metropole",
    category: "revision-loyer",
    label: "Interdiction de réviser un logement classé F ou G (métropole)",
    value:
      "En métropole, la révision est interdite lorsque le bail est signé, renouvelé ou tacitement reconduit depuis le 24 août 2022 et concerne un logement classé F ou G au DPE.",
    legalBasis: "Loi n° 89-462, article 17-1",
    source: SOURCES.revisionLoyer,
    appliesFrom: "2022-08-24",
  }),
  rule({
    id: "irl-interdit-logement-f-g-dom",
    category: "revision-loyer",
    label: "Interdiction de réviser un logement classé F ou G (DOM)",
    value:
      "En Guadeloupe, Guyane, Martinique, La Réunion et Mayotte, la révision est interdite lorsque le bail est signé, renouvelé ou tacitement reconduit depuis le 1er juillet 2024 et concerne un logement classé F ou G au DPE.",
    legalBasis: "Loi n° 89-462, article 17-1",
    source: SOURCES.revisionLoyer,
    appliesFrom: "2024-07-01",
  }),

  // ------------------------------------------------------- Montant du loyer
  rule({
    id: "loyer-libre-premiere-mise-en-location",
    category: "montant-du-loyer",
    label: "Première mise en location",
    value:
      "Lors de la première mise en location, le propriétaire fixe librement le montant du loyer — l'encadrement des loyers ne s'applique qu'aux locations suivantes.",
    source: SOURCES.montantLoyer,
  }),
  rule({
    id: "loyer-majoration-travaux-15-pct",
    category: "montant-du-loyer",
    label: "Majoration pour travaux d'amélioration (changement de locataire)",
    value:
      "Au changement de locataire, le loyer annuel peut être augmenté de 15 % du montant TTC des travaux d'amélioration, si les travaux ont été réalisés avant ou après le départ du précédent locataire et représentent au moins 50 % de la dernière année de loyer hors charges.",
    source: SOURCES.montantLoyer,
  }),
  rule({
    id: "loyer-libre-travaux-recents",
    category: "montant-du-loyer",
    label: "Loyer librement fixé après travaux récents d'un montant élevé",
    value:
      "Le loyer est fixé librement lorsque des travaux d'amélioration ont été réalisés depuis moins de 6 mois pour un montant au moins égal à la dernière année de loyer.",
    source: SOURCES.montantLoyer,
  }),
  rule({
    id: "loyer-sous-evaluation-plafond",
    category: "montant-du-loyer",
    label: "Plafond de la hausse en cas de loyer manifestement sous-évalué",
    value:
      "Lorsque le loyer appliqué au précédent locataire est manifestement sous-évalué, l'augmentation ne peut pas dépasser 50 % de la différence entre le montant de référence du voisinage (logements comparables) et le dernier loyer appliqué.",
    source: SOURCES.montantLoyer,
  }),

  // -------------------------------------------------------- Dépôt de garantie
  rule({
    id: "dg-plafond-location-vide",
    category: "depot-garantie",
    label: "Plafond du dépôt de garantie — logement vide",
    value: "1 mois de loyer hors charges",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-plafond-location-meublee",
    category: "depot-garantie",
    label: "Plafond du dépôt de garantie — logement meublé",
    value: "2 mois de loyer hors charges",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-interdit-loyer-trimestriel",
    category: "depot-garantie",
    label: "Dépôt de garantie interdit en paiement trimestriel (logement vide)",
    value:
      "Lorsque le loyer est payable d'avance chaque trimestre, le dépôt de garantie est interdit (logement vide).",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-interdit-bail-mobilite",
    category: "depot-garantie",
    label: "Dépôt de garantie interdit en bail mobilité",
    value: "En cas de bail mobilité, le dépôt de garantie est interdit.",
    legalBasis: "Loi n° 89-462, article 25-17",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-delai-restitution-edl-conforme",
    category: "depot-garantie",
    label: "Délai de restitution — état des lieux conforme",
    value:
      "1 mois maximum à compter du jour où le locataire rend les clés, lorsque l'état des lieux de sortie est conforme à l'état des lieux d'entrée.",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-delai-restitution-edl-non-conforme",
    category: "depot-garantie",
    label: "Délai de restitution — état des lieux non conforme",
    value:
      "2 mois maximum à compter du jour où le locataire rend les clés, lorsque l'état des lieux de sortie n'est pas conforme à l'état des lieux d'entrée.",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-point-de-depart-restitution",
    category: "depot-garantie",
    label: "Fait générateur du délai de restitution",
    value:
      "Le délai court à compter du jour où le locataire rend les clés, en main propre ou par lettre recommandée avec accusé de réception.",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-majoration-retard-restitution",
    category: "depot-garantie",
    label: "Majoration du dépôt non restitué dans le délai",
    value:
      "Le montant à rendre est augmenté d'une somme égale à 10 % du loyer mensuel hors charges pour chaque mois commencé au-delà du délai applicable.",
    legalBasis: "Loi n° 89-462, article 22",
    source: SOURCES.depotGarantie,
  }),
  rule({
    id: "dg-prescription-action-judiciaire",
    category: "depot-garantie",
    label: "Délai pour saisir le juge après restitution tardive",
    value:
      "Le locataire doit saisir le juge des contentieux de la protection dans les 3 ans à compter du jour où le dépôt de garantie aurait dû être rendu.",
    legalBasis: "Loi n° 89-462, article 7-1",
    source: SOURCES.depotGarantie,
  }),

  // --------------------------------------------------------------- Quittance
  rule({
    id: "quittance-gratuite-sur-demande",
    category: "quittance",
    label: "La quittance de loyer est gratuite et due sur demande",
    value:
      "Le propriétaire, l'agence ou le bailleur social doit remettre gratuitement une quittance de loyer lorsque le locataire la demande. Aucune clause du bail ne peut prévoir de frais à ce titre.",
    legalBasis: "Loi n° 89-462, article 4 p (clause réputée non écrite) et article 21",
    source: SOURCES.quittance,
  }),
  rule({
    id: "quittance-detail-loyer-charges",
    category: "quittance",
    label: "Mentions obligatoires de la quittance",
    value:
      "La quittance doit indiquer le détail des sommes versées, en distinguant le loyer et les charges locatives.",
    legalBasis: "Loi n° 89-462, article 21",
    source: SOURCES.quittance,
  }),
  rule({
    id: "quittance-paiement-partiel",
    category: "quittance",
    label: "Paiement partiel : reçu et non quittance",
    value:
      "Lorsque le locataire ne paie qu'une partie du montant du loyer, le bailleur doit remettre un reçu, pas une quittance de loyer.",
    legalBasis: "Loi n° 89-462, article 21",
    source: SOURCES.quittance,
  }),
  rule({
    id: "quittance-transmission-electronique",
    category: "quittance",
    label: "Transmission par courrier électronique",
    value:
      "La quittance peut être transmise par mail, à condition que le locataire ait donné son accord.",
    source: SOURCES.quittance,
  }),

  // ------------------------------------------------------------- Prescription
  rule({
    id: "prescription-loyer-charges-3-ans",
    category: "prescription",
    label: "Délai pour réclamer un impayé de loyer ou de charges",
    value:
      "Le propriétaire peut réclamer pendant 3 ans tout impayé de loyer ou de charges, y compris après le départ du locataire. Une dette de mars 2026 est réclamable jusqu'en mars 2029.",
    legalBasis: "Loi n° 89-462, article 7-1",
    source: SOURCES.prescription,
  }),
  rule({
    id: "prescription-revision-loyer-1-an",
    category: "prescription",
    label: "Délai pour appliquer la révision annuelle du loyer",
    value:
      "Si le propriétaire n'a pas fait la révision annuelle du loyer, il dispose d'un an pour réagir.",
    source: SOURCES.prescription,
  }),
  rule({
    id: "prescription-copropriete-regularisation",
    category: "prescription",
    label: "Point de départ du délai en copropriété",
    value:
      "Lorsque le logement est situé dans une copropriété, le délai de 3 ans débute à la date de la régularisation des charges, et non à la date de paiement de la somme indue.",
    source: SOURCES.prescription,
  }),

  // ------------------------------------------------------------------ Charges
  rule({
    id: "charges-liste-fermee-par-decret",
    category: "charges",
    label: "Les charges récupérables sont une liste fermée",
    value:
      "La liste des charges récupérables est fixée par décret. Une dépense qui n'y figure pas ne peut pas être imputée au locataire.",
    source: SOURCES.chargesRecuperables,
  }),

  // ---------------------------------------------------------------- Fiscalité
  rule({
    id: "micro-foncier-seuil",
    category: "fiscalite",
    label: "Seuil du régime micro-foncier (revenus fonciers)",
    value:
      "Si le montant annuel des revenus fonciers (charges non comprises) ne dépasse pas 15 000 €, le régime micro-foncier s'applique automatiquement ; le régime réel reste possible.",
    source: SOURCES.revenusFonciers,
  }),
  rule({
    id: "micro-foncier-abattement",
    category: "fiscalite",
    label: "Abattement forfaitaire du régime micro-foncier",
    value:
      "Abattement forfaitaire de 30 % sur les revenus fonciers, sans déduction des travaux et charges.",
    source: SOURCES.revenusFonciers,
  }),
  rule({
    id: "micro-foncier-formulaire",
    category: "fiscalite",
    label: "Formulaire de déclaration des revenus fonciers",
    value:
      "Formulaire n° 2042 : le montant brut sans abattement est reporté sur la déclaration de revenus en ligne sur l'espace personnel impots.gouv.fr.",
    source: SOURCES.revenusFonciers,
  }),
  rule({
    id: "lmnp-seuil-qualification",
    category: "fiscalite",
    label: "Condition de loueur en meublé non professionnel (LMNP)",
    value:
      "L'activité est celle d'un loueur en meublé non professionnel si l'une des deux conditions est remplie : recettes annuelles inférieures à 23 000 € pour l'ensemble du foyer fiscal, ou recettes inférieures au montant total des autres revenus d'activité du foyer.",
    source: SOURCES.revenusMeubles,
  }),
  rule({
    id: "lmnp-plafond-micro-bic",
    category: "fiscalite",
    label: "Plafond du régime micro-BIC en location meublée",
    value:
      "Plafond de recettes de 83 600 € avec un abattement forfaitaire pour frais de 50 % ; les charges ne peuvent pas être déduites. Les revenus 2026 se déclarent en avril 2027.",
    source: SOURCES.revenusMeubles,
  }),
  rule({
    id: "lmnp-declaration-activite-siret",
    category: "fiscalite",
    label: "Déclaration de l'activité de loueur en meublé",
    value:
      "L'inscription au répertoire Sirène de l'Insee (obtention d'un numéro SIRET) doit être effectuée dans les 15 jours qui suivent le premier jour de location. La formalité est gratuite.",
    source: SOURCES.revenusMeubles,
  }),

  // ----------------------------------------------------------- Intérêt légal
  rule({
    id: "interet-legal-frequence-et-variantes",
    category: "interet-legal",
    label: "Fixation et variantes du taux d'intérêt légal",
    value:
      "Le taux d'intérêt légal est fixé chaque semestre par arrêté publié au Journal officiel. Il existe un taux d'intérêt légal simple (somme versée dans les deux mois suivant la date d'application du jugement) et un taux d'intérêt légal majoré (autres cas). Il diffère selon le statut du créancier : particulier n'agissant pas pour des besoins professionnels, ou autre.",
    source: SOURCES.interetLegal,
  }),
  rule({
    id: "interet-legal-particuliers-s1-2026",
    category: "interet-legal",
    label: "Taux d'intérêt légal — créances des particuliers, 1er semestre 2026",
    value: "6,67",
    unit: "%",
    legalBasis: "Arrêté du 15 décembre 2025",
    source: SOURCES.interetLegal,
    appliesFrom: "2026-01-01",
  }),
  rule({
    id: "interet-legal-autres-s1-2026",
    category: "interet-legal",
    label: "Taux d'intérêt légal — autres créances, 1er semestre 2026",
    value: "2,62",
    unit: "%",
    legalBasis: "Arrêté du 15 décembre 2025",
    source: SOURCES.interetLegal,
    appliesFrom: "2026-01-01",
  }),
  rule({
    id: "interet-legal-particuliers-s2-2026",
    category: "interet-legal",
    label: "Taux d'intérêt légal — créances des particuliers, 2e semestre 2026",
    value: "6,84",
    unit: "%",
    legalBasis: "Arrêté du 26 juin 2026 (cité par le site, non consulté)",
    source: SOURCES.interetLegal,
    appliesFrom: "2026-07-01",
    verified: false,
    verificationNote:
      "NON VÉRIFIÉ LE 2026-10-04. La page du ministère de l'Économie consultée ce jour-là ('Tout savoir sur le taux d'intérêt légal') ne publie que le taux du premier semestre 2026 (arrêté du 15 décembre 2025 : 6,67 % / 2,62 %). L'arrêté du 26 juin 2026 annoncé n'a pas pu être ouvert : Légifrance est inaccessible depuis cet environnement. La valeur est conservée parce que le site la publie déjà et que le test legal-accuracy.test.ts la verrouille ; elle doit être confirmée contre l'arrêté au prochain accès à Légifrance.",
  }),
];

/** Index par identifiant, construit à partir de la même table. */
const BY_ID = new Map<string, RegulatorySource>([
  ...REGULATORY_SOURCES,
  ...IRL_SOURCE_RECORDS,
].map((entry) => [entry.id, entry]));

/** Toutes les entrées, IRL comprise. */
export const ALL_REGULATORY_SOURCES: RegulatorySource[] = [
  ...REGULATORY_SOURCES,
  ...IRL_SOURCE_RECORDS,
];

export function getRegulatorySource(id: string): RegulatorySource | undefined {
  return BY_ID.get(id);
}

export function getVerifiedSources(): RegulatorySource[] {
  return ALL_REGULATORY_SOURCES.filter((entry) => entry.verified);
}

export function getUnverifiedSources(): RegulatorySource[] {
  return ALL_REGULATORY_SOURCES.filter((entry) => !entry.verified);
}

/**
 * Une valeur est publiable si elle est vérifiée. Le contenu public doit passer
 * par ici plutôt que lire `REGULATORY_SOURCES` directement.
 */
export function isPublishable(id: string): boolean {
  return BY_ID.get(id)?.verified === true;
}

/**
 * Citation prête à afficher : valeur, source, URL, date de vérification.
 * Lève une erreur sur une valeur non vérifiée pour empêcher qu'une citation
 * non sourcée se glisse dans une page.
 */
export function buildCitation(id: string): string {
  const entry = BY_ID.get(id);
  if (!entry) throw new Error(`Source réglementaire inconnue : ${id}`);
  if (!entry.verified) {
    throw new Error(
      `Source réglementaire non vérifiée, citation interdite : ${id} — ${entry.verificationNote ?? ""}`
    );
  }
  const value = entry.unit ? `${entry.value} ${entry.unit}` : entry.value;
  return `${value} — ${entry.source} (${entry.sourceUrl}), vérifié le ${entry.dateVerified}`;
}

/**
 * Étiquettes explicites des trous de sourcing : règles que le site publie ou
 * devrait publier, dont la source primaire n'a pas pu être atteinte lors de la
 * passe. Aucune valeur n'est affirmée ici — c'est le principe.
 */
export interface RegulatoryGap {
  id: string;
  label: string;
  /** Ce qui manque précisément. */
  missing: string;
  /** Éditeur à consulter en priorité. */
  officialSource: string;
  /** Statut au 2026-10-04. */
  status: "a-sourcer" | "bloque-legifrance" | "a-confirmer-aupres-source";
}

export const REGULATORY_GAPS: RegulatoryGap[] = [
  {
    id: "preavis-locataire",
    label: "Délai de préavis du locataire (durée légale et cas de réduction)",
    missing:
      "Aucun texte primaire consulté lors de la passe : la page Service-Public sur le congé du locataire n'a pas été atteinte et Légifrance est inaccessible.",
    officialSource: "Service-Public — « Donner congé à son locataire » (article 15, loi n° 89-462)",
    status: "bloque-legifrance",
  },
  {
    id: "preavis-bailleur",
    label: "Délai de préavis du bailleur (durée légale)",
    missing:
      "Aucun texte primaire consulté lors de la passe, pour la même raison que le locataire.",
    officialSource: "Service-Public — « Donner congé à un locataire » (article 15, loi n° 89-462)",
    status: "bloque-legifrance",
  },
  {
    id: "charges-revision-23-11",
    label: "Révision annuelle des charges locatives (article 23-11) et délai de régularisation",
    missing:
      "La page Service-Public « Réviser ses charges locatives » n'a pas été identifiée lors de la passe ; aucune date de délai n'est donc affirmée.",
    officialSource: "Service-Public — charges récupérables (F947) et article 23-11 de la loi n° 89-462",
    status: "a-sourcer",
  },
  {
    id: "bareme-2044",
    label: "Barème du formulaire 2044 des revenus fonciers et notice explicative",
    missing:
      "La notice 2044 (impots.gouv.fr, millésime 2026) n'a pas renvoyé de contenu exploitable lors de la passe. Seul le renvoi au formulaire 2042 est vérifié.",
    officialSource: "impots.gouv.fr — notice du formulaire n° 2044, millésime 2026",
    status: "a-confirmer-aupres-source",
  },
  {
    id: "duree-visite",
    label: "Durée légale de visite du logement",
    missing:
      "Le site ne publie pas cette durée et aucune source primaire n'a été consultée pour la passe. Valeur volontairement absente plutôt qu'inventée.",
    officialSource: "À déterminer — la durée de visite de référence relève d'un texte distinct selon le type de bail",
    status: "a-sourcer",
  },
  {
    id: "superficie-reference",
    label: "Valeurs de référence de superficie (surface habitable, surface annexe)",
    missing:
      "Le site ne publie pas de valeur de référence de superficie ; les seules surfaces citées dans le corpus sont celles de la loi Carrez (copropriété), qui ne sont pas un seuil réglementaire.",
    officialSource: "À déterminer — seuils de décence et surfaces de référence selon le type de bail",
    status: "a-sourcer",
  },
];
