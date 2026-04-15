import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/gestion-locative",
          "/locations",
          "/bail",
          "/quittances",
          "/maintenance",
          "/pricing",
          "/features",
          "/demo",
          "/blog",
          "/glossaire-immobilier",
          "/modeles",
          "/outils",
          "/mentions-legales",
          "/politique-confidentialite",
          "/cgu",
        ],
        disallow: [
          "/dashboard",
          "/properties",
          "/tenants",
          "/billing",
          "/expenses",
          "/fiscal",
          "/portal",
          "/api",
          "/login",
          "/register",
          "/admin",
          "/account",
        ],
      },
    ],
    sitemap: "https://www.rentready.fr/sitemap.xml",
    host: "https://www.rentready.fr",
  };
}
