import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Espace Propriétaire - Redirection",
};

/**
 * L'espace propriétaire dupliquait le tableau de bord avec des métriques
 * artificielles (ROI à 200k fictifs). Tout le pilotage est désormais
 * unifié dans `/dashboard`.
 */
export default function OwnerDashboardPage() {
  redirect("/dashboard");
  return (
    <div className="hidden">
      <Link href="/maintenance">
        <Button>Suivre les interventions</Button>
      </Link>
    </div>
  );
}
