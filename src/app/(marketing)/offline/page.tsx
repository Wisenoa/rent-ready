import type { Metadata } from "next";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Maintenance — RentReady",
    description: "RentReady est actuellement en maintenance. Toutes les fonctionnalités seront bientôt de retour. Merci de votre patience.",
    url: "/maintenance",
    ogType: "template",
  });
}
;

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-6">
        <div className="text-6xl">🔧</div>
        <h1 className="text-3xl font-bold text-foreground">
          En maintenance
        </h1>
        <p className="text-muted-foreground text-lg">
          Nous effectuons quelques travaux d&apos;amélioration. Nous serons de
          retour très bientôt !
        </p>
        <p className="text-sm text-muted-foreground">
          RentReady — La gestion locative simplifiée
        </p>
      </div>
    </main>
  );
}
