/**
 * GET /api/property-types
 * Returns all property type guides for SEO content pages.
 */
import { NextResponse } from "next/server";
import { PROPERTY_TYPES } from "@/data/property-types";

export async function GET() {
  const types = PROPERTY_TYPES.map(
    ({ slug, name, shortDescription }) => ({
      slug,
      name,
      shortDescription,
    })
  );

  return NextResponse.json(
    {
      types,
      total: types.length,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
