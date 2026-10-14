/**
 * Every link of the public header and footer, in one place.
 *
 * Before this file the site had four headers and four footers: the homepage's,
 * GlassNav (whose anchors pointed at sections that exist on no page), and the
 * two hard-coded bars of the (outils) and (templates) layouts. Each listed a
 * different subset of the site, so what a visitor could reach depended on the
 * page they landed on.
 *
 * Every href here must be a real public route: `site-navigation.test.ts` checks
 * them against `src/data/routes.ts`. Describe only what exists today.
 */

export interface NavLink {
  href: string;
  label: string;
  /** One line under the label in the desktop menus. */
  description?: string;
}

export interface NavGroup {
  id: "produit" | "outils" | "ressources";
  label: string;
  /** Hub of the group, shown as the menu's footer link. */
  hub: NavLink;
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "produit",
    label: "Produit",
    hub: { href: "/gestion-locative", label: "Découvrir Lokna" },
    links: [
      {
        href: "/gestion-locative",
        label: "Gestion locative",
        description: "Le suivi du mois, de l'échéance à la quittance",
      },
      {
        href: "/features",
        label: "Fonctionnalités",
        description: "Paiements, quittances, révision IRL, dépenses",
      },
      {
        href: "/quittances",
        label: "Quittances de loyer",
        description: "Générées quand le mois est soldé, reçu si partiel",
      },
      {
        href: "/bail",
        label: "Gestion des baux",
        description: "Loyer, charges et dates réunis par bail",
      },
      {
        href: "/comparatif/logiciel-gestion-locative",
        label: "Logiciel, tableur ou agence ?",
        description: "Comparer les modes de gestion",
      },
    ],
  },
  {
    id: "outils",
    label: "Outils gratuits",
    hub: { href: "/outils", label: "Tous les outils gratuits" },
    links: [
      {
        href: "/outils/calculateur-irl",
        label: "Calculateur de révision IRL",
        description: "Nouveau loyer avec l'indice INSEE",
      },
      {
        href: "/outils/calculateur-charges-locatives",
        label: "Charges locatives",
        description: "Provision mensuelle à demander au locataire",
      },
      {
        href: "/outils/generateur-quittance",
        label: "Générateur de quittance",
        description: "PDF gratuit, sans inscription",
      },
      {
        href: "/outils/calculateur-depot-garantie",
        label: "Dépôt de garantie",
        description: "Plafond légal selon le bail",
      },
      {
        href: "/outils/lettre-relance-loyer",
        label: "Lettre de relance",
        description: "Rappel, relance, mise en demeure",
      },
      {
        href: "/outils/calculateur-preavis",
        label: "Préavis",
        description: "Date de fin selon le motif et la zone",
      },
    ],
  },
  {
    id: "ressources",
    label: "Guides & ressources",
    hub: { href: "/guides", label: "Tous les guides" },
    links: [
      { href: "/guides", label: "Guides du bailleur", description: "Quittance, bail, IRL, dépôt de garantie" },
      { href: "/blog", label: "Blog", description: "Questions concrètes de propriétaires" },
      { href: "/templates", label: "Modèles", description: "Baux, congés, relances, état des lieux" },
      { href: "/glossaire-immobilier", label: "Glossaire", description: "Les termes de la location expliqués" },
      { href: "/comparatif", label: "Comparatifs", description: "Choisir entre plusieurs solutions" },
      { href: "/villes", label: "Par ville", description: "Règles et repères locaux" },
    ],
  },
];

/** Top-level link shown next to the menus. */
export const NAV_PRICING: NavLink = { href: "/pricing", label: "Tarifs" };

export const AUTH_LINKS = {
  login: { href: "/login", label: "Connexion" },
  signup: { href: "/register", label: "Essayer gratuitement" },
} as const;

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Produit",
    links: [
      { href: "/gestion-locative", label: "Gestion locative" },
      { href: "/features", label: "Fonctionnalités" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/quittances", label: "Quittances" },
      { href: "/bail", label: "Gestion des baux" },
    ],
  },
  {
    title: "Outils gratuits",
    links: [
      { href: "/outils", label: "Tous les outils" },
      { href: "/outils/calculateur-irl", label: "Calculateur IRL" },
      { href: "/outils/calculateur-charges-locatives", label: "Charges locatives" },
      { href: "/outils/generateur-quittance", label: "Générateur de quittance" },
      { href: "/outils/calculateur-depot-garantie", label: "Dépôt de garantie" },
      { href: "/outils/lettre-relance-loyer", label: "Modèle de relance" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/templates", label: "Modèles" },
      { href: "/glossaire-immobilier", label: "Glossaire" },
      { href: "/comparatif", label: "Comparatifs" },
      { href: "/villes", label: "Par ville" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/politique-confidentialite", label: "Confidentialité" },
      { href: "/politique-cookies", label: "Cookies" },
      { href: "/cgu", label: "CGU" },
    ],
  },
];
