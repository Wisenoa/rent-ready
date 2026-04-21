"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, CreditCard, ExternalLink, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createSubscriptionCheckout, createBillingPortal } from "@/lib/actions/subscription-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";

interface SubscriptionBannerProps {
  status: SubscriptionStatus;
  trialEndsAt: Date | string | null;
  stripeCustomerId: string | null;
}

function isTrialExpired(trialEndsAt: Date | string | null): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) < new Date();
}

export function SubscriptionBanner({ status, trialEndsAt, stripeCustomerId }: SubscriptionBannerProps) {
  const [isPending, startTransition] = useTransition();
  const [showPortalLoading, setShowPortalLoading] = useState(false);

  const trialExpired = isTrialExpired(trialEndsAt);
  const hasStripeCustomer = !!stripeCustomerId;

  // Active subscriber — show plan benefits
  if (status === "ACTIVE") {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Abonnement actif</p>
              <p className="text-sm text-emerald-700">
                Vous avez accès à toutes les fonctionnalités RentReady.
              </p>
            </div>
          </div>
          {hasStripeCustomer && (
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 shrink-0"
              onClick={() => {
                setShowPortalLoading(true);
                startTransition(async () => {
                  const result = await createBillingPortal();
                  if (result.success && result.data?.url) {
                    window.location.href = result.data.url;
                  } else {
                    toast.error(result.error ?? "Impossible d'ouvrir le portail");
                    setShowPortalLoading(false);
                  }
                });
              }}
              disabled={showPortalLoading}
            >
              {showPortalLoading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="size-4 mr-2" />
              )}
              Gérer mon abonnement
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Trial — show countdown + upgrade CTA
  if (status === "TRIAL" && !trialExpired && trialEndsAt) {
    const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (
      <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Crown className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                Période d&apos;essai — {daysLeft} jour{daysLeft !== 1 ? "s" : ""} restant{daysLeft !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-amber-700">
                Votre essai expire le {format(new Date(trialEndsAt), "d MMMM yyyy", { locale: fr })}.
                Souscrivez pour débloquer toutes les fonctionnalités.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <ExternalLink className="size-4 mr-1" />
                Voir les tarifs
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                startTransition(async () => {
                  const result = await createSubscriptionCheckout();
                  if (result.success && result.data?.url) {
                    window.location.href = result.data.url;
                  } else {
                    toast.error(result.error ?? "Impossible de démarrer l'abonnement");
                  }
                });
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Crown className="size-4 mr-1" />
              )}
              S&apos;abonner
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Trial expired OR cancelled/expired — block access + upgrade CTA
  if (status === "TRIAL" || status === "EXPIRED" || status === "CANCELLED") {
    return (
      <Card className="border-red-200 bg-red-50/50 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">
                {status === "TRIAL" && trialExpired ? "Essai expiré" : "Abonnement résilié"}
              </p>
              <p className="text-sm text-red-700">
                Souscrivez pour continuer à utiliser RentReady et accéder à toutes les fonctionnalités.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <ExternalLink className="size-4 mr-1" />
                Voir les tarifs
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                startTransition(async () => {
                  const result = await createSubscriptionCheckout();
                  if (result.success && result.data?.url) {
                    window.location.href = result.data.url;
                  } else {
                    toast.error(result.error ?? "Impossible de démarrer l'abonnement");
                  }
                });
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Crown className="size-4 mr-1" />
              )}
              S&apos;abonner
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // PAST_DUE
  if (status === "PAST_DUE") {
    return (
      <Card className="border-orange-200 bg-orange-50/50 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-orange-900">Paiement en retard</p>
              <p className="text-sm text-orange-700">
                Votre dernier paiement a échoué. Mettez à jour vos informations de paiement pour maintenir votre abonnement.
              </p>
            </div>
          </div>
          {hasStripeCustomer && (
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
              onClick={() => {
                startTransition(async () => {
                  const result = await createBillingPortal();
                  if (result.success && result.data?.url) {
                    window.location.href = result.data.url;
                  } else {
                    toast.error(result.error ?? "Impossible d'ouvrir le portail");
                  }
                });
              }}
              disabled={showPortalLoading}
            >
              {showPortalLoading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="size-4 mr-2" />
              )}
              Mettre à jour le paiement
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
