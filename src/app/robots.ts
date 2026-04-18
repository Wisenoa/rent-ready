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
          "/entretien",
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
          "/app/*",   // catch-all: /app/* routes are internal tools, not marketing pages
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
