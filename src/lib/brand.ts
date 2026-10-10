/**
 * Source unique de vérité pour l'identité de marque Lokna.
 *
 * Tous les modules (UI, SEO, emails, PDF, mentions légales) doivent importer
 * leurs constantes de marque depuis ce fichier ou via `src/data/entity.ts`.
 */

export const BRAND = {
  name: "Lokna",
  legalName: "Lokna SAS",
  domain: "lokna.fr",
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lokna.fr",
  supportEmail: "support@lokna.fr",
  contactEmail: "contact@lokna.fr",
  notificationEmail: "notifications@lokna.fr",
  dpoEmail: "dpo@lokna.fr",
  tagline: "Gestion locative claire, rigoureuse et automatisée pour propriétaires indépendants",
  foundingYear: 2024,
  colors: {
    primary: "#0B3B2C", // Deep Forest Green
    secondary: "#7FA68E", // Sage Green
    accent: "#E07A5F", // Terracotta Accent
    cream: "#F8F6F1", // Warm Cream Background
    dark: "#082E22",
  },
} as const;

export type Brand = typeof BRAND;
