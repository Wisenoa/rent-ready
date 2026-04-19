/**
 * Shared SEO metadata helpers for the RentReady marketing site.
 * Import these from any page.tsx to keep titles and descriptions consistent.
 *
 * Includes hreflang support for multilingual (FR primary).
 */

export const BASE_URL = "https://www.rentready.fr";
export const SITE_NAME = "RentReady";
export const DEFAULT_OG_IMAGE = "https://www.rentready.fr/og-image.png";

/** Supported locales */
export const LOCALES = ["fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/** OG image template types — must match /api/og route switch cases */
export type OgType =
  | "default"
  | "article"
  | "template"
  | "feature"
  | "pricing"
  | "outil"
  | "location";

/**
 * Build a dynamic OG image URL for the /api/og endpoint.
 * Falls back to the static OG image if no type is specified.
 *
 * Usage:
 *   buildOgImageUrl({ title: "Mon titre", description: "Ma desc", type: "pricing" })
 */
export function buildOgImageUrl({
  title,
  description,
  type = "default",
}: {
  title: string;
  description?: string;
  type?: OgType;
}): string {
  const params = new URLSearchParams();
  params.set("title", title);
  params.set("type", type);
  if (description) params.set("description", description);
  return `/api/og?${params.toString()}`;
}

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
 *
 * Pass ogType to use a dynamic OG image from /api/og instead of the static fallback.
 */
export function baseMetadata({
  title,
  description,
  url,
  keywords = [],
  type = "website",
  ogType,
  ogDescription,
}: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  type?: "website" | "article";
  /** Use a dynamic OG image template from /api/og */
  ogType?: OgType;
  /** Optional shorter description specifically for the OG image text */
  ogDescription?: string;
}) {
  const ogImageUrl = ogType
    ? buildOgImageUrl({ title, description: ogDescription ?? description, type: ogType })
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}${url}`,
      languages: {
        // Self-referencing hreflang — every page declares its own language version
        [DEFAULT_LOCALE]: `${BASE_URL}${url}`,
      },
    },
    openGraph: {
      title,
      description,
      type,
      url: `${BASE_URL}${url}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate hreflang link tags for a page.
 * Currently FR-only (DEFAULT_LOCALE), but structured to scale
 * if additional locales (en, es, de) are added later.
 *
 * Usage in a page's generateMetadata():
 *   return {
 *     ...baseMetadata({ ... }),
 *     alternates: {
 *       ...buildHreflang("/bail-location"),
 *     }
 *   }
 *
 * The x-default entry is the same as fr for a single-locale site.
 */
export function buildHreflang(canonicalPath: string) {
  const entries: Record<string, string> = {};

  for (const locale of LOCALES) {
    entries[locale] = `${BASE_URL}${canonicalPath}`;
  }

  // x-default: same as primary locale for single-locale sites
  entries["x-default"] = `${BASE_URL}${canonicalPath}`;

  return {
    canonical: `${BASE_URL}${canonicalPath}`,
    languages: entries,
  };
}

/**
 * Type-safe alternates object to spread into generateMetadata() return value.
 */
export type MetadataAlternates = ReturnType<typeof buildHreflang>;
