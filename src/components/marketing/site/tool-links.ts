import type { NavLink } from "./nav-data";

/**
 * What to read or use next, per free tool. Curated, not generated: each entry
 * is the guide that explains the rule the tool applies, the tools a landlord
 * reaches for right after, and the Lokna page that automates it — only where
 * that page exists and says something true about the subject.
 *
 * `site-navigation.test.ts` checks every href against the public routes.
 */
export interface ToolLinks {
  learn?: NavLink;
  next: NavLink[];
  product?: NavLink;
}

const GESTION: NavLink = { href: "/gestion-locative", label: "Le suivi des loyers dans Lokna" };

export const TOOL_LINKS: Record<string, ToolLinks> = {
  "/outils/calculateur-irl": {
    learn: { href: "/guides/irl-2026", label: "Guide : la révision du loyer et l'IRL" },
    next: [
      { href: "/templates/augmentation-de-loyer", label: "Lettre de révision de loyer" },
      { href: "/outils/calculateur-loyer", label: "Calculateur de loyer" },
    ],
    product: { href: "/features#revision-irl", label: "La révision IRL dans Lokna" },
  },
  "/outils/calculateur-loyer": {
    learn: { href: "/glossaire-immobilier/encadrement-loyer", label: "L'encadrement des loyers, expliqué" },
    next: [
      { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
      { href: "/outils/calculateur-depot-garantie", label: "Plafond du dépôt de garantie" },
    ],
    product: GESTION,
  },
  "/outils/calculateur-charges-locatives": {
    learn: { href: "/blog/charges-locatives-recuperables-liste-2026", label: "La liste des charges récupérables" },
    next: [
      { href: "/templates/repartition-charges", label: "Modèle de répartition des charges" },
      { href: "/outils/calculateur-loyer", label: "Calculateur de loyer" },
    ],
    product: GESTION,
  },
  "/outils/calculateur-depot-garantie": {
    learn: { href: "/guides/depot-garantie", label: "Guide : le dépôt de garantie" },
    next: [
      { href: "/outils/checklist-etat-lieux", label: "Checklist état des lieux" },
      { href: "/templates/etat-des-lieux", label: "Modèle d'état des lieux" },
    ],
    product: GESTION,
  },
  "/outils/calculateur-preavis": {
    learn: { href: "/glossaire-immobilier/preavis-loyer", label: "Le préavis, expliqué" },
    next: [
      { href: "/templates/conge-locataire", label: "Modèle de congé" },
      { href: "/outils/generateur-conge-vente", label: "Congé pour vente" },
    ],
    product: { href: "/bail", label: "Les baux dans Lokna" },
  },
  "/outils/calculateur-rendement": {
    learn: { href: "/glossaire-immobilier/rendement-locatif", label: "Le rendement locatif, expliqué" },
    next: [
      { href: "/outils/simulateur-pret-immobilier", label: "Simulateur de prêt" },
      { href: "/outils/simulateur-fiscalite-lmnp", label: "Fiscalité LMNP" },
    ],
    product: GESTION,
  },
  "/outils/calculateur-plus-value": {
    next: [
      { href: "/outils/calculateur-rendement", label: "Rendement locatif" },
      { href: "/outils/simulateur-fiscalite-lmnp", label: "Fiscalité LMNP" },
    ],
  },
  "/outils/calculateur-surface-habitable": {
    learn: { href: "/glossaire-immobilier/surface-habitable", label: "La surface habitable, expliquée" },
    next: [
      { href: "/outils/calculateur-loyer", label: "Calculateur de loyer" },
      { href: "/templates/bail-vide", label: "Modèle de bail vide" },
    ],
    product: { href: "/bail", label: "Les baux dans Lokna" },
  },
  "/outils/checklist-etat-lieux": {
    learn: { href: "/guides/depot-garantie", label: "Guide : le dépôt de garantie" },
    next: [
      { href: "/templates/etat-des-lieux", label: "Modèle d'état des lieux" },
      { href: "/outils/calculateur-depot-garantie", label: "Plafond du dépôt de garantie" },
    ],
  },
  "/outils/generateur-conge-vente": {
    learn: { href: "/glossaire-immobilier/conge-location", label: "Le congé, expliqué" },
    next: [
      { href: "/outils/calculateur-preavis", label: "Calculateur de préavis" },
      { href: "/templates/conge-proprietaire", label: "Modèle de congé propriétaire" },
    ],
    product: { href: "/bail", label: "Les baux dans Lokna" },
  },
  "/outils/generateur-quittance": {
    learn: { href: "/guides/quittance-loyer", label: "Guide : la quittance de loyer" },
    next: [
      { href: "/outils/lettre-relance-loyer", label: "Lettre de relance" },
      { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
    ],
    product: { href: "/quittances", label: "Les quittances dans Lokna" },
  },
  "/outils/modele-quittance-loyer-pdf": {
    learn: { href: "/guides/quittance-loyer", label: "Guide : la quittance de loyer" },
    next: [
      { href: "/outils/generateur-quittance", label: "Générateur de quittance" },
      { href: "/outils/lettre-relance-loyer", label: "Lettre de relance" },
    ],
    product: { href: "/quittances", label: "Les quittances dans Lokna" },
  },
  "/outils/lettre-relance-loyer": {
    learn: { href: "/guides/relance-loyer", label: "Guide : relancer un loyer impayé" },
    next: [
      { href: "/templates/relance-loyer-impaye", label: "Modèle de mise en demeure" },
      { href: "/outils/generateur-quittance", label: "Générateur de quittance" },
    ],
    product: GESTION,
  },
  "/outils/simulateur-fiscalite-lmnp": {
    learn: { href: "/glossaire-immobilier/location-meuble", label: "La location meublée, expliquée" },
    next: [
      { href: "/outils/calculateur-rendement", label: "Rendement locatif" },
      { href: "/outils/calculateur-plus-value", label: "Plus-value immobilière" },
    ],
  },
  "/outils/simulateur-pret-immobilier": {
    learn: { href: "/glossaire-immobilier/apport-personnel", label: "L'apport personnel, expliqué" },
    next: [
      { href: "/outils/calculateur-rendement", label: "Rendement locatif" },
      { href: "/outils/calculateur-plus-value", label: "Plus-value immobilière" },
    ],
  },
  "/outils/simulateur-loi-jeanbrun": {
    next: [
      { href: "/outils/calculateur-rendement", label: "Rendement locatif" },
      { href: "/outils/simulateur-fiscalite-lmnp", label: "Fiscalité LMNP" },
    ],
  },
};
