/**
 * GET /api/seo/faq/[slug]/schema
 * Returns FAQPage schema.org JSON-LD for a given page slug.
 */
import { NextRequest, NextResponse } from "next/server";
import { faqGroups, getFaqsBySlug } from "@/data/faqs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate slug is known
  const knownSlugs = faqGroups.map((g) => g.slug);
  if (!knownSlugs.includes(slug)) {
    return NextResponse.json(
      { error: `No FAQ data found for slug: ${slug}` },
      { status: 404 }
    );
  }

  const faqs = getFaqsBySlug(slug);

  if (faqs.length === 0) {
    return NextResponse.json(
      { error: `No FAQ data found for slug: ${slug}` },
      { status: 404 }
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
