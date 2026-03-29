import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/gestion-locative"],
        disallow: [
          "/dashboard",
          "/properties",
          "/tenants",
          "/billing",
          "/expenses",
          "/maintenance",
          "/fiscal",
          "/portal",
          "/api",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: "https://www.rentready.fr/sitemap.xml",
  };
}
