import { redirect } from "next/navigation";

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
  return null;
}
