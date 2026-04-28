import { ApiReference } from "@scalar/api-reference";
import { openapiSpec } from "@/lib/openapi/spec";

export const dynamic = "force-static";

export async function GET() {
  const html = ApiReference({
    spec: {
      ...openapiSpec,
    },
    configuration: {
      pageTitle: "RentReady API — Documentation",
      metaData: {
        description:
          "API REST pour la gestion locative — biens, locataires, baux, paiements et maintenance.",
        title: "RentReady API",
      },
      theme: "purple",
      defaultOpenAllTags: false,
      hideModels: false,
      hideInternal: true,
    },
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
