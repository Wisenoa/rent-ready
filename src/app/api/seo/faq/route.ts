/**
 * GET /api/seo/faq
 * GET /api/seo/faq?slug=pricing
 *
 * Returns FAQPage schema.org JSON-LD for a given page slug.
 * If no slug is provided, returns all FAQ groups.
 */
import { NextRequest, NextResponse } from "next/server";
import { faqGroups, getFaqsBySlug } from "@/data/faqs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const faqs = getFaqsBySlug(slug);
    if (faqs.length === 0) {
      return NextResponse.json(
        { error: `No FAQ found for slug: ${slug}` },
        { status: 404 }
      );
    }

    const group = faqGroups.find((g) => g.slug === slug);
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      name: group?.title ?? slug,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    return NextResponse.json(schema, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  }

  // No slug: return all FAQ groups summary
  return NextResponse.json(
    {
      groups: faqGroups.map((g) => ({
        slug: g.slug,
        title: g.title,
        count: g.faqs.length,
      })),
      totalGroups: faqGroups.length,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
