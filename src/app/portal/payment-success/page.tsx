import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Paiement confirmé — RentReady",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; tx?: string }>;
}) {
  const { session_id, tx } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center">
          <CheckCircle2 className="size-20 text-emerald-500 mb-4" />
          <h1 className="text-2xl font-semibold">Paiement confirmé !</h1>
          <p className="text-muted-foreground mt-2">
            Votre paiement a été traité avec succès. Votre propriétaire a été
            notifié et votre quittance sera disponible dans votre espace
            locataire sous 24h.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2 text-left">
          <p className="text-sm text-muted-foreground">
            Un email de confirmation a été envoyé à votre adresse email.
          </p>
          <p className="text-sm text-muted-foreground">
            La quittance de loyer sera disponible dans la section{" "}
            <span className="font-medium text-foreground">Mes Quittances</span>{" "}
            de votre espace locataire.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
