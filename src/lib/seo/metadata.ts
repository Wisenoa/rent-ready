/**
 * Shared SEO metadata helpers for the RentReady marketing site.
 * Import these from any page.tsx to keep titles and descriptions consistent.
 */

export const BASE_URL = "https://www.rentready.fr";
export const SITE_NAME = "RentReady";
export const DEFAULT_OG_IMAGE = "https://www.rentready.fr/og-image.png";

/**
 * Build a full title string:
 *   "Page Topic | RentReady"
 * or for city pages:
 *   "Page Topic à Ville | RentReady"
 */
export function buildTitle(page: string, city?: string): string {
  return city ? `${page} à ${city} | RentReady` : `${page} | RentReady`;
}

/**
 * Default metadata shape for generateMetadata().
 * Override title/description as needed per page.
 */
export function baseMetadata({
  title,
  description,
  url,
  keywords = [],
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  type?: "website" | "article";
}) {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${BASE_URL}${url}` },
    openGraph: {
      title,
      description,
      type,
      url: `${BASE_URL}${url}`,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
