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
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
