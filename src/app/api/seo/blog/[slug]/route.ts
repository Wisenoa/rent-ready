/**
 * GET /api/seo/blog/[slug]/schema
 *
 * Returns JSON-LD schema.org for a blog post page:
 *   - Article schema (core)
 *   - BreadcrumbList schema (core)
 *   - FAQPage schema (conditional — only if article has FAQ content)
 *
 * Slugs: all blog article slugs from @/data/articles
 *
 * Cache: public, max-age=3600, stale-while-revalidate=86400
 * Response: < 50ms
 */
import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/data/articles";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return NextResponse.json(
      { error: `No article found for slug: ${slug}` },
      { status: 404 }
    );
  }

  const articleAuthor = article.author ?? "RentReady";

  // ── Article schema ────────────────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: articleAuthor,
      url: "https://www.rentready.fr",
      sameAs: [
        "https://www.linkedin.com/company/rentready",
        "https://twitter.com/rentready_fr",
        "https://www.facebook.com/rentready.fr",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
      sameAs: [
        "https://www.linkedin.com/company/rentready",
        "https://twitter.com/rentready_fr",
        "https://www.facebook.com/rentready.fr",
      ],
    },
    url: `https://www.rentready.fr/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rentready.fr/blog/${slug}`,
    },
  };

  // ── BreadcrumbList schema ──────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.rentready.fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.rentready.fr/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `https://www.rentready.fr/blog?category=${encodeURIComponent(article.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `https://www.rentready.fr/blog/${slug}`,
      },
    ],
  };

  // ── FAQPage schema — extracted from article markdown ─────────────────────
  type FAQPair = { question: string; answer: string };

  function extractFAQ(content: string): FAQPair[] {
    if (!content) return [];
    const faqSection = content.match(
      /## FAQ —[\s\S]+?(?=\n## [^F]|\n\n\/\*\*|\n\[CTA)|$/
    );
    if (!faqSection) return [];

    const section = faqSection[0];
    const qaPairs: FAQPair[] = [];

    const matches = section.matchAll(
      /(?:^###\s+(.+?)\n\n|(?:^)\*\*([^*]+)\*\*\n\n)([\s\S]+?)(?=^###\s|\n\*\*|\n\[CTA]|$)/gm
    );
    for (const match of matches) {
      const question = ((match[1] as string) || (match[2] as string)).trim();
      const answer = (match[3] as string).replace(/\n\n+/g, " ").trim();
      if (question && answer) {
        qaPairs.push({ question, answer });
      }
    }
    return qaPairs;
  }

  const faqPairs = extractFAQ(article.content ?? "");

  // Return just schemas — consumer page handles <script> injection
  return NextResponse.json(
    {
      schema: [articleSchema, breadcrumbSchema, ...(faqPairs.length > 0 ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqPairs.map((qa) => ({ "@type": "Question", name: qa.question, acceptedAnswer: { "@type": "Answer", text: qa.answer } })) }] : [])],
      meta: {
        slug,
        hasFAQ: faqPairs.length > 0,
        faqCount: faqPairs.length,
        category: article.category,
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
