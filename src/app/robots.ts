import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Allow all public marketing pages
        allow: [
          // Core marketing pages
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
          "/comparatif",
          // Blog
          "/blog",
          "/blog/**",
          // Glossary
          "/glossaire-immobilier",
          "/glossaire-immobilier/**",
          // Templates & Models
          "/templates",
          "/templates/**",
          "/modeles",
          "/modeles/**",
          // Outils (calculators, generators, simulators)
          "/outils",
          "/outils/**",
          // Guides
          "/guides",
          "/guides/**",
          // Legal pages
          "/mentions-legales",
          "/politique-confidentialite",
          "/cgu",
          // City/region programmatic pages
          "/gestion-locative/**",
          "/bail/**",
        ],
        // Block all internal/app routes — must never be indexed
        disallow: [
          // Private app routes
          "/portal/**",
          "/dashboard/**",
          "/account/**",
          // Auth routes — no SEO value, must not be indexed
          "/login/**",
          "/register/**",
          // Internal API — never expose to crawlers
          "/api/**",
          // Admin
          "/admin/**",
          // Billing/payments (internal)
          "/billing/**",
          "/expenses/**",
          "/fiscal/**",
          // Properties, tenants (internal management)
          "/properties/**",
          "/tenants/**",
          // Internal tools
          "/properties",
          "/tenants",
          "/billing",
          "/expenses",
          "/fiscal",
        ],
      },
    ],
    // Sitemap must be declared so search engines discover all public URLs
    sitemap: "https://www.rentready.fr/sitemap.xml",
    host: "https://www.rentready.fr",
  };
}
