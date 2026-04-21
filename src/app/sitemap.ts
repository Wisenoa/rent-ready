import type { MetadataRoute } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cities = require("../data/cities.json") as Array<{ slug: string }>;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { articles } = require("../data/articles") as { articles: Array<{ slug: string; date: string; updatedAt?: string }> };

const BASE_URL = "https://www.rentready.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/gestion-locative`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bail`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/quittances`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/entretien`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/demo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/glossaire-immobilier`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Glossary term pages (30 terms — rich internal linking hub)
    ...(["quittance-loyer","bail-location","caution-locative","garant-loyer","etat-des-lieux","irl-indice-reference-loyers","loyer-nu","charges-recuperables","conge-location","preavis-loyer","depot-garantie","visale","colocation","location-vide","location-meuble","bail-mobilite","encadrement-loyer","loyer-ccai","revision-loyer","apport-personnel","rendement-locatif","vacance-locative","surface-habitable","loi-carrez","declaration-impot","taxe-fonciere","gerance-immobiliere","maintenance-locative","impaye-loyer","relance-loyer"] as const).map((slug) => ({
      url: `${BASE_URL}/glossaire-immobilier/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Template library listing page
    {
      url: `${BASE_URL}/templates`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Guides listing + individual guide pages
    {
      url: `${BASE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guides/modele-bail`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guides/quittance-loyer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guides/depot-garantie`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guides/irl-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guides/relance-loyer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Template library
    {
      url: `${BASE_URL}/modeles/bail-meuble`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/bail-vide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/bail-mobilite`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/bail-commercial`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/bail-colocation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/etat-des-lieux`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/modeles/quittance-de-loyer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Tools / Calculators
    {
      url: `${BASE_URL}/outils/calculateur-revision-irl`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-rendement`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-caution`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/generateur-quittance`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-charges-locatives`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/modele-bail-location`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/lettre-relance-loyer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-irl`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-loyer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-depot-garantie`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-preavis`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/checklist-etat-lieux`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/outils/calculateur-plus-value`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/outils/calculateur-surface-habitable`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/outils/generateur-conge-vente`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/outils/simulateur-fiscalite-lmnp`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/outils/simulateur-pret-immobilier`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politique-confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politique-cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgu`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Blog posts — use real article data so sitemap stays in sync with content
  const blogPages: MetadataRoute.Sitemap = articles.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // City/region pages — bail and gestion-locative
  const cityPages: MetadataRoute.Sitemap = (
    cities as Array<{ slug: string }>
  ).flatMap((city) => [
    {
      url: `${BASE_URL}/gestion-locative/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bail/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [...staticPages, ...blogPages, ...cityPages];
}
