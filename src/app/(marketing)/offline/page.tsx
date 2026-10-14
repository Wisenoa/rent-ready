import type { Metadata } from "next";
import { SITE_NAME } from "@/data/entity";
import { baseMetadata } from "@/lib/seo/metadata";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: `Maintenance — ${SITE_NAME}`,
    description: `${SITE_NAME} est actuellement en maintenance. Toutes les fonctionnalités seront bientôt de retour. Merci de votre patience.`,
    url: "/maintenance",
    ogType: "template",
  });
}
;

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-6">
        <div className="text-6xl">🔧</div>
        <h1 className="text-3xl font-semibold text-foreground">
          En maintenance
        </h1>
        <p className="text-muted-foreground text-lg">
          Nous effectuons quelques travaux d&apos;amélioration. Nous serons de
          retour très bientôt !
        </p>
        <p className="text-sm text-muted-foreground">
          {SITE_NAME} — La gestion locative simplifiée
        </p>
      </div>
    </div>
  );
}
