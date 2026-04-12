export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Gestion" | "Calculs" | "Juridique" | "Fiscalité";
  date: string;
  readTime: string;
  content?: string;
};

export const articles: Article[] = [
  {
    slug: "comment-gerer-loyers-impayes",
    title: "Comment gérer les loyers impayés en 2026",
    excerpt:
      "Guide complet pour les propriétaires face aux impayés: prévention, procédure de recouvrement, mise en demeure et recours légaux.",
    category: "Gestion",
    date: "2026-01-15",
    readTime: "8 min",
  },
  {
    slug: "revision-loyer-irl-guide-complet",
    title: "Révision de loyer et IRL: guide complet 2026",
    excerpt:
      "Tout savoir sur la révision annuelle des loyers: formule IRL, calcul, date anniversaire et limites de l'augmentation.",
    category: "Calculs",
    date: "2026-01-10",
    readTime: "6 min",
  },
  {
    slug: "depot-garantie-regles-essentielles",
    title: "Dépôt de garantie: les règles essentielles à connaître en 2026",
    excerpt:
      "Plafonds légaux, restitution, délais et litiges. Tout ce que les propriétaires doivent savoir sur la caution.",
    category: "Juridique",
    date: "2026-01-05",
    readTime: "5 min",
  },
  {
    slug: "etat-des-lieux-entree-sortie",
    title: "État des lieux d'entrée et de sortie: mode d'emploi 2026",
    excerpt:
      "Comment réaliser un état des lieux complet et éviter les litiges à la fin du bail. Checklist et conseils pratiques.",
    category: "Juridique",
    date: "2026-02-20",
    readTime: "7 min",
  },
  {
    slug: "loi-alur-proprietaire-bailleur",
    title: "Loi ALUR: impact sur les propriétaires bailleurs en 2026",
    excerpt:
      "Les obligations de la loi ALUR: diagnostics obligatoires, plafonds, zone tendue et encadrement des loyers.",
    category: "Juridique",
    date: "2026-02-15",
    readTime: "10 min",
  },
  {
    slug: "optimiser-fiscalite-loyers",
    title: "Optimiser la fiscalité de vos revenus locatifs en 2026",
    excerpt:
      "Régime réel, micro-foncier, LMNP: comment choisir le régime fiscal adapté à votre situation locative.",
    category: "Fiscalité",
    date: "2026-03-01",
    readTime: "9 min",
  },
  {
    slug: "modele-quittance-loyer-pdf-gratuit",
    title: "Modèle de quittance de loyer PDF gratuit — Comment remplir une quittance conforme",
    excerpt:
      "Téléchargez notre modèle de quittance de loyer PDF gratuit et découvrez comment remplir chaque mention obligatoire. Quittance conforme loi 89-462 en 5 minutes.",
    category: "Gestion",
    date: "2026-04-14",
    readTime: "6 min",
  },
  {
    slug: "lettre-relance-loyer-impaye-modele",
    title: "Lettre de relance pour loyer impayé — Modèle gratuit et conseils juridiques",
    excerpt:
      "Téléchargez notre modèle de lettre de relance pour loyer impayé. Conseils juridiques, délai légal, étapes de la procédure d'impayé. Gratuit.",
    category: "Gestion",
    date: "2026-04-17",
    readTime: "7 min",
  },
  {
    slug: "charges-locatives-decompte-annualise",
    title: "Charges locatives : le guide complet du décompte annualisé",
    excerpt:
      "Charges locatives : comment établir le décompte annualisé, quelles sont les charges récupérables, quand envoyer le relevé au locataire. Guide complet 2026.",
    category: "Gestion",
    date: "2026-04-21",
    readTime: "8 min",
  },
  {
    slug: "assurance-loyer-impaye-gli",
    title: "Assurance loyer impayé (GLI) : comment protéger vos revenus locatifs",
    excerpt:
      "La Garantie Loyer Impayé (GLI) vous protège contre les impayés, dégradations et frais de procédure. Comparatif des offres et conseils pour bien choisir.",
    category: "Gestion",
    date: "2026-04-24",
    readTime: "7 min",
  },
  {
    slug: "quittance-loyer-mentions-obligatoires",
    title: "Quittance de loyer : mentions obligatoires et modèle gratuit",
    excerpt:
      "Quittance de loyer : toutes les mentions obligatoires selon la loi du 6 juillet 1989. Téléchargez un modèle gratuit et découvrez comment la générer automatiquement.",
    category: "Juridique",
    date: "2026-04-28",
    readTime: "5 min",
  },
  {
    slug: "calculer-rendement-locatif-brut-net",
    title: "Calcul rendement locatif brut et net — Formule et simulateur gratuit",
    excerpt:
      "Calculez le rendement locatif brut et net de votre investissement immobilier. Formule, exemple chiffré, et conseils pour maximiser votre rentabilité.",
    category: "Fiscalité",
    date: "2026-05-01",
    readTime: "6 min",
  },
  {
    slug: "etat-des-lieux-proprietaire-modele",
    title: "État des lieux : modèle gratuit et procédure pour propriétaires",
    excerpt:
      "État des lieux d'entrée et de sortie : modèle gratuit, checklist, et conseils pour protéger votre dépôt de garantie. Conforme décret 2016-382.",
    category: "Juridique",
    date: "2026-05-05",
    readTime: "6 min",
  },
  {
    slug: "bail-colocation-modele-clauses",
    title: "Bail de colocation : modèle et clauses essentielles en 2026",
    excerpt:
      "Bail de colocation : comment rédiger le contrat, quelles clauses ajouter, modèle gratuit. Droits et obligations des colocataires.",
    category: "Juridique",
    date: "2026-05-08",
    readTime: "7 min",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
