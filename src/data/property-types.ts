/**
 * Property type data for SEO content API.
 * Used to power /api/property-types and /api/property-types/[slug]
 */

export interface PropertyTypeGuide {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  legalSpecificities: string[];
  commonIssues: string[];
  managementTips: string[];
  targetAudience: string[];
  updatedAt: string;
}

export const PROPERTY_TYPES: PropertyTypeGuide[] = [
  {
    slug: 'appartement',
    updatedAt: '2026-04-15',
    name: "Appartement",
    shortDescription:
      "Logement situé dans un immeuble collectif, composé de pièces communicantes.",
    fullDescription:
      "L'appartement est un logement situé dans un immeuble à plusieurs étages, composé de pièces communicantes (salon, chambres, cuisine, salle de bain) et disposant d'un accès，独立 à l'escalier ou à l'ascenseur. C'est le type de bien locatif le plus courant en France, représentant environ 75% du parc locatif privé. La gestion d'un appartement implique la coordination avec la copropriété pour les parties communes.",
    legalSpecificities: [
      "Loi du 6 juillet 1989 applicable",
      "Dépôt de garantie max 1 mois loyer nu (location vide)",
      "Surface minimale habitable : 9m², hauteur sous plafond 2,20m minimum",
      "En zone tendue : encadrement des loyers applicable",
      "Si copropriété : respect du règlement de copropriété обязателен",
    ],
    commonIssues: [
      "Troubles de voisinage (bruits, odeurs)",
      " Impayés de charges de copropriété",
      "Travaux votés en assemblée générale à charge du propriétaire",
      "Dégradation des parties communes par le locataire",
      "Vacance locative entre deux locataires",
    ],
    managementTips: [
      "Vérifiez l'assurance PNO (Propriétaire Non Occupant)",
      "Constituez un fonds de réserve pour travaux imprévus",
      "Effectuez des visites de contrôle annuelles (avec accord du locataire)",
      "Utilisez un outil de gestion locative pour centraliser les documents",
      "Anticipez les assemblées générales de copropriété",
    ],
    targetAudience: [
      "Étudiants et jeunes actifs en zone urbaine",
      "Couples sans enfants",
      "Personnes seules",
      "Investisseurs locatifs recherchant la liquidité",
    ],
  },
  {
    slug: 'maison',
    updatedAt: '2026-04-15',
    name: "Maison",
    shortDescription:
      "Logement individuel avec accès，独立 et terrain éventuel.",
    fullDescription:
      "La maison individuelle est un logement detached de tout autre bâtiment, avec un accès，独立 à la rue et potentiellement un terrain (jardin, cour, parking). La maison représente environ 20% du parc locatif privé français. Elle offre généralement plus d'espace qu'un appartement et attire des familles ou des locataires recherchant plus d'autonomie. La gestion d'une maison implique l'entretien du terrain et des équipements extérieurs.",
    legalSpecificities: [
      "Loi du 6 juillet 1989 applicable",
      "Pas de règles de copropriété (sauf lotissement)",
      "Dépôt de garantie max 1 mois loyer nu (location vide)",
      "Obligation d'entretien du jardin et des espaces extérieurs par le locataire (si prévu au bail)",
      "Vérification de la conformité de l'assainissement individuel",
    ],
    commonIssues: [
      "Entretien extérieur à la charge du propriétaire (toiture, façade, clôture)",
      "Coûts de chauffage plus élevés (fioul, électrique)",
      "Vandalisme ou effraction (pas de sécurité d'immeuble)",
      "Dégradation du jardin par le locataire",
      "Litiges sur l'entretien de la piscine ou du portail",
    ],
    managementTips: [
      "Visites de contrôle régulières (avec préavis)",
      "Provisionzacja fonds travaux pour grosses réparations",
      "Clause claire sur l'entretien du jardin dans le bail",
      "Vérification annually of heating system",
      "Souscription à une assurance propriétaire appropriée",
    ],
    targetAudience: [
      "Familles avec enfants",
      "Retraités",
      "Locataires recherchant un animal de compagnie",
      "Personnes recherch-ant davantage d'espace",
    ],
  },
  {
    slug: 'studio',
    updatedAt: '2026-04-15',
    name: "Studio",
    shortDescription: "Logement d'une seule pièce principale avec coin cuisine et salle de bain.",
    fullDescription:
      "Le studio (ou T1 nu) est un logement composé d'une seule pièce principale qui sert de salon et de chambre, avec un coin cuisine intégré et une salle de bain séparée. C'est le format le plus demandé en zone urbaine, notamment par les étudiants et les jeunes actifs. La surface minimale habitable est de 9m² mais un studio fonctionnel nécessite généralement 20 à 30m² pour un confort acceptable.",
    legalSpecificities: [
      "Loi du 6 juillet 1989 applicable",
      "Surface minimale : 9m² (sinon décence non respectée)",
      "Dépôt de garantie max 1 mois loyer nu",
      "Encadrement des loyers applicable en zone tendue",
      "Pas de pièces独立ées — toute la surface est une seule pièce principale",
    ],
    commonIssues: [
      "Risque d'isolement du locataire (surface réduite)",
      "Turnover élevé (studieurs changent souvent)",
      "Machines à laver et sèche-linge souvent partagés",
      "Problèmes d'humidité dans les petits espaces",
      "Valeur locative basse, risque de sous-location",
    ],
    managementTips: [
      "Ciblez les étudiants et jeunes actifs via les réseaux sociaux",
      "Proposez un bail meublé pour justifier un loyer plus élevé",
      "Installez une ventilation mécanique contrôlée (VMC)",
      "Prévoir le remplacement fréquent des équipements",
      "Mettez en place un état des lieux minutieux à chaque rotation",
    ],
    targetAudience: [
      "Étudiants",
      "Jeunes actifs en début de carrière",
      "Stagiaires et alternance",
      "Personnes en mobilité professionnelle",
    ],
  },
  {
    slug: 'local-commercial',
    updatedAt: '2026-04-15',
    name: "Local commercial",
    shortDescription: "Local destiné à une activité commerciale, artisanale ou libérale.",
    fullDescription:
      "Le local commercial est un bien immobilier destiné à l'exercice d'une activité commerciale, artisanale, industrielle ou libérale. Il est régi par le Code de Commerce et non par la loi du 6 juillet 1989. Le bail commercial (ou bail 3/6/9) offre une protection forte au locataire (droit au renouvellement, indemnité d'éviction) et implique des obligations spécifiques pour le bailleur.",
    legalSpecificities: [
      "Bail commercial réglementé par le Code de Commerce (art. L. 145-1 et suivants)",
      "Durée minimale : 6 ans (bail 3/6/9)",
      "Pas de dépôt de garantie réglementé mais souvent 3 à 6 mois de loyer",
      "Loyer plafonné en zone tendue (loi Pinel zones)",
      "Charges généralement plus complexes à récupérer (Taxe Foncière, assurances)",
    ],
    commonIssues: [
      "Vacance locative longue (activité поиска locataire commercial)",
      "Travaux d'aménagement à la charge du propriétaire bailleur",
      "Dégradation du pas-de-porte (droit d'entrée)",
      "Disputes sur la répartition des charges",
      "Droit de préférence du locataire commercial",
    ],
    managementTips: [
      "Vérifiez la solidité financière du locataire commercial avant signature",
      "Négociez un dépôt de garantie provisions pour garantir les impayés",
      "Prévoyez une nomenclature claire des charges dans le bail",
      "Anticipez les discussions sur le renouvellement du bail",
      "Documentez l'état des lieux avec photos détaillées",
    ],
    targetAudience: [
      "Commerçants indépendants",
      "Artisans etauto-entrepreneurs",
      "Professionnels libéraux (avocats, médecins,Experts comptables)",
      "Franchisés et réseaux d'entreprise",
    ],
  },
  {
    slug: 'parking',
    updatedAt: '2026-04-15',
    name: "Place de parking / Garage",
    shortDescription: "Espace de stationnement pour véhicule, box ou place ouverte.",
    fullDescription:
      "Une place de parking ou un garage est un espace réservé au stationnement d'un ou plusieurs véhicules. En France, les places de parking sont de plus en plus稀缺 en zone urbaine, ce qui en fait un investissement locatif intéressant avec un хороший rendement locatif. La location d'une place de parking peut être soumise à la loi du 6 juillet 1989 si elle constitue la résidence principale du locataire.",
    legalSpecificities: [
      "Si liée à un logement : bail accessoire au bail principal",
      "Si独立ée : может être soumise à la loi de 1989 si résidence principale",
      "Pas de dépôt de garantie obligatoire mais usual 1 mois",
      "Pas d'encadrement des loyers sauf exception",
      "Tutelle des règles de copropriété applicables",
    ],
    commonIssues: [
      "Usage non conforme (stockage de matériaux, atelier)",
      "Difficulté à récupérer la place en cas d'impayé",
      "Litiges sur l'accès ou le voisinage immédiat",
      "Vandalisme在空中停车场",
      "Rescisory clause enforcement",
    ],
    managementTips: [
      "Précisez l'usage exclusif pour stationnement dans le bail",
      "Installez une barrière ou un система контроля доступа",
      "Vérifiez l'assurance du locataire pour couvrir les dommages",
      "Proposez un bail annuel renouvelé par tacite reconduction",
      "Gardez des photos de l'état de la place à chaque entrée/sortie",
    ],
    targetAudience: [
      "Propriétaires de véhicules sans garage",
      "Salariés en zone urbaine cherchant une solution de stationnement",
      "Commerces cherchant des places pour leurs employés",
      "Investisseurs cherchant un хороший rendement locatif",
    ],
  },
  {
    slug: 'colocation-type',
    updatedAt: '2026-04-15',
    name: "Colocation",
    shortDescription: "Location partagée entre plusieurs locataires d'un même bien.",
    fullDescription:
      "La colocation est une forme de location dans laquelle plusieurs locataires partagent un même logement. Elle peut être régie par un bail unique avec clause de solidarité (chaque colocataire est responsable de l'intégralité du loyer) ou par des baux individuels. La colocation a connu un essor important en France, notamment chez les jeunes actifs et les étudiants.",
    legalSpecificities: [
      "Bail unique с clause de solidarité ou baux individuels au choix",
      "Surface minimale par occupant : 9m² (sinon décence non respectée)",
      "Dépôt de garantie peut être demandé à chaque colocataire",
      "Départ d'un colocataire : le bail continue avec les restants",
      "En zone tendue : каждый colocataire doit avere un bail individualisé",
    ],
    commonIssues: [
      "Départ d'un colocataire et recherche de replacement",
      "Troubles de voisinage entre colocataires",
      "Impays частичные (un seul colocataire ne paie pas)",
      "Utilisation partagée des espaces et des équipements",
      "Désaccords sur les charges (visites, eau, internet)",
    ],
    managementTips: [
      "Utilisez des baux individuels pour faciliter les remplacements",
      "Prévoyez une clause de solidarité ou un garant pour chaque colocataire",
      "Mettez en place un compte joint pour les charges partagées",
      "Procédez à des états des lieux d'entrée/sortie pour chaque ocupant",
      "Préparez un règlement intérieur clair dès le départ",
    ],
    targetAudience: [
      "Étudiants",
      "Jeunes actifs en zone urbaine",
      "Personnes en situation de mobilité professionnelle",
      "Locataires cherchant à réduire leurs coûts de logement",
    ],
  },
  {
    slug: 'meuble',
    updatedAt: '2026-04-15',
    name: "Meublé",
    shortDescription: "Location d'un logement équipé avec mobilier complet selon la liste réglementaire.",
    fullDescription:
      "Une location meublée est un logement équipé de tous les éléments nécessaires à la vie quotidienne du locataire, conformément à la liste réglementaire (arrêté du 31 juillet 1991). Le mobilier doit inclure la literie, les plaques de cuisson, le réfrigérateur, les ustensiles de cuisine, etc. Le loyer d'un meublé peut être supérieur à celui d'un vide comparable, et la durée du bail est de 1 an (renouvelable).",
    legalSpecificities: [
      "Bail de 1 an minimum (ou 9 mois pour bail mobilité)",
      "Dépôt de garantie max 2 mois de loyer (contre 1 pour le vide)",
      "Loyer peut être libre en zone non tendue (encadrement en zone tendue)",
      "Amortissement fiscal possible sur le mobilier (régime LMNP/LMP)",
      "Si bail mobilité : pas de tacite reconduction, только renew на определенный срок",
    ],
    commonIssues: [
      "Usure et dégradation du mobilier plus rapide qu'en vide",
      "Vol de petits équipements (ustensiles, électroménager)",
      "Coût de remplacement du mobilier entre deux locations",
      "Vacance locative entre deux locataires meublés",
      "Litiges sur l'inventaire de départ et de sortie du mobilier",
    ],
    managementTips: [
      "Constituez un inventaire détaillé avec photos à chaque état des lieux",
      "Provisions pour le remplacement du mobilier tous les 5 à 7 ans",
      "Choisissez des mobilier résistantes et neutres",
      "Souscrivez une assurance spécifiques pour le mobilier loué",
      "Mettez à jour le bail à chaque changement de mobilier significatif",
    ],
    targetAudience: [
      "Étudiants et jeunes actifs preferant ne pas investir dans leur mobilier",
      "Expatriés et personnes en mobilité internationale",
      "Locataires recherchant un logement clé en main",
      "Investisseurs cherchant un loyer plus élevé et avantages fiscaux",
    ],
  },
  {
    slug: 'vide',
    updatedAt: '2026-04-15',
    name: "Location vide",
    shortDescription: "Location d'un bien sans mobilier, bail de 3 ans minimum.",
    fullDescription:
      "La location vide (ou location nue) est le формат traditionnel de location en France, avec un bail de 3 ans minimum pour les particuliers bailleurs. C'est le формат le plus courant pour les investissements locatifs longue durée. Le loyer est généralement inférieur à celui d'un meublé comparable, mais la vacance locative может быть longer et les droits du locataire plus importants.",
    legalSpecificities: [
      "Bail de 3 ans minimum (6 ans si personne morale bailleur)",
      "Dépôt de garantie max 1 mois de loyer nu",
      "Loyer encadré en zone tendue (loi Climat et Résilience)",
      "Révision de loyer possible chaque année sur IRL",
      "Congé du bailleur必须有正当理由 : reprise, vente, motif légitime",
    ],
    commonIssues: [
      "Vacance locative entre deux locataires",
      "Coût de remise en état entre deux locations",
      "Troubles de jouissance (bruits, impayés)",
      "Procédures decongé longues et coûteuses",
      "Dégradation lente du bien par un locataire au long cours",
    ],
    managementTips: [
      "Constituez une épargne de reserva pour les périodes de vacance",
      "Effectuez des visits de contrôle tous les 3 ans (avec accord)",
      "Anticipez les procedures de congé (délai de 6 mois)",
      "Mettez à jour régulièrement le bien pour maintenir sa valeur",
      "Utilisez ungestionnaire locatif pour vous décharger des contraintes",
    ],
    targetAudience: [
      "Familles stable rechercheant un logement longue durée",
      "Retraités ne souhaitant pas déménager",
      "Locataires en zone rurale où le meublé est moins courant",
      "Propriétaires investissant pour des revenus complémentaires",
    ],
  },
];
