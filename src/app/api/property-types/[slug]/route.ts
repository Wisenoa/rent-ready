/**
 * GET /api/property-types/[slug]
 * Returns a single property type guide with full content.
 */
import { NextRequest, NextResponse } from "next/server";
import { PROPERTY_TYPES } from "@/data/property-types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const propertyType = PROPERTY_TYPES.find((t) => t.slug === slug);

  if (!propertyType) {
    return NextResponse.json(
      { error: `Property type not found: ${slug}` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      ...propertyType,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
