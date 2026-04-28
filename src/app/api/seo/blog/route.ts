/**
 * GET /api/seo/blog
 *
 * Returns JSON-LD schema.org for the blog listing page:
 *   - WebSite schema (with potentialAction SearchAction)
 *   - ItemList schema (list of blog posts)
 *   - Organization schema (publisher)
 *
 * Cache: public, max-age=3600, stale-while-revalidate=86400
 */
import { NextResponse } from "next/server";
import { articles } from "@/data/articles";

export async function GET() {
  const blogPosts = articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: article.title,
    url: `https://www.rentready.fr/blog/${article.slug}`,
    description: article.excerpt,
  }));

  const schemas = [
    // WebSite
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Blog RentReady",
      url: "https://www.rentready.fr/blog",
      description: "Guides, conseils et Actualités pour propriétaires bailleurs en France.",
      publisher: {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.rentready.fr/blog?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    // ItemList of blog posts
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Articles du blog RentReady",
      description: "Tous les articles du blog RentReady pour les propriétaires bailleurs.",
      url: "https://www.rentready.fr/blog",
      numberOfItems: articles.length,
      itemListElement: blogPosts,
    },
    // Organization (publisher)
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rentready.fr/logo.png",
        width: 300,
        height: 100,
      },
      sameAs: [
        "https://www.linkedin.com/company/rentready",
        "https://twitter.com/rentready_fr",
        "https://www.facebook.com/rentready.fr",
      ],
    },
  ];

  return NextResponse.json(
    { schemas, meta: { totalArticles: articles.length } },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
