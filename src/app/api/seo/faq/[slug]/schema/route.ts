/**
 * GET /api/seo/faq/[slug]/schema
 * Returns FAQPage schema.org JSON-LD for a specific FAQ group.
 *
 * Path param: slug — e.g. "pricing", "calculateur-irl-2026", "calculateur-depot-garantie"
 *
 * Returns 404 for unknown slugs.
 * Cache: public, max-age=3600 (1 hour), stale-while-revalidate=86400 (1 day)
 */
import { NextRequest, NextResponse } from "next/server";
import { faqGroups, getFaqsBySlug } from "@/data/faqs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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
