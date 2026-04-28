import { openapiSpec } from "@/lib/openapi/spec";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(openapiSpec, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
