/**
 * SEO Redirect Map for RentReady
 *
 * Centralized redirect registry. All marketing-site redirects should be declared here.
 * Use permanent: true for 301 (SEO impact) and temporary: true for 307.
 *
 * Rules:
 * - NEVER use 302 (temporary redirect loses SEO value)
 * - NEVER chain redirects (a -> b -> c is bad)
 * - Campaign / UTM landing pages should strip tracking params before redirecting
 *
 * For performance, most redirects are handled via next.config.ts `redirects()`.
 * This file is for redirects that need runtime evaluation (e.g., case normalization,
 * query parameter handling) and for documentation of the redirect policy.
 */

/** French keywords used in URL slugs — for consistency enforcement */
export const FR_KEYWORDS = [
  "bail", "quittance", "locataire", "proprietaire", "loyer", "charges",
  "garant", "dépôt-de-garantie", "état-des-lieux", "congé", "préavis",
  "gestion-locative", "entretien", "maintenance", "loyer-nu", "charges-récupérables",
  "colocation", "meublé", "vide", "sci", "fiscal", "impôt", "déclaration",
] as const;

/**
 * URL Structure Policy:
 * - All URLs lowercase, hyphenated
 * - French keywords preserved in URLs (no anglicization)
 * - No underscores, no capitals, no special characters
 * - No trailing slashes (consistent trailing slash = none)
 * - Examples:
 *   /bail-location        NOT /bail_location or /Bail-Location
 *   /quittances-loyer     NOT /quittances_de_loyer or /Quittances-Loyer
 *   /etat-des-lieux       NOT /etat_des_lieux or /etat-des-lieux/
 */
export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean; // true = 301, false = 307
  note?: string;
};

/**
 * Redirect rules that need runtime evaluation.
 * Most static redirects live in next.config.ts — this list is for
 * dynamic patterns that can't be expressed as static paths.
 */
export const runtimeRedirects: RedirectRule[] = [
  // UTM-stripped campaign landing pages → canonical
  // These prevent duplicate content from campaign URLs with tracking params
  {
    source: "/home",
    destination: "/",
    permanent: true,
    note: "Legacy homepage alias",
  },
];

// Re-export base URL for canonical construction
export const BASE_URL = "https://www.rentready.fr";
