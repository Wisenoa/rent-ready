"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createSubscriptionCheckout } from "@/lib/actions/subscription-actions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnualSubscribeButtonProps {
  annualPriceLabel?: string; // e.g. "144 € / an"
  badgeLabel?: string;       // e.g. "2 mois gratuits"
}

export function AnnualSubscribeButton({
  annualPriceLabel = "S'abonner — 144 €/an",
  badgeLabel = "2 mois gratuits",
}: AnnualSubscribeButtonProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const [transitionPending, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  if (sessionPending) {
    return (
      <Button
        disabled
        className="w-full items-center gap-2.5 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
      >
        <Loader2 className="size-4 animate-spin" />
        Chargement…
      </Button>
    );
  }

  const isLoggedIn = !!session?.user;
  const subscriptionStatus = (session?.user as any)?.subscriptionStatus;

  // Authenticated user with expired trial → redirect to Stripe annual checkout
  if (isLoggedIn && subscriptionStatus === "TRIAL") {
    const trialEndsAt = (session?.user as any)?.trialEndsAt;
    const trialExpired = trialEndsAt ? new Date(trialEndsAt) < new Date() : false;

    if (trialExpired || subscriptionStatus !== "ACTIVE") {
      return (
        <div className="space-y-2">
          {badgeLabel && (
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {badgeLabel}
            </span>
          )}
          <Button
            onClick={() => {
              setShowLoading(true);
              startTransition(async () => {
                const result = await createSubscriptionCheckout("year");
                if (result.success && result.data?.url) {
                  window.location.href = result.data.url;
                } else {
                  window.location.href = "/billing";
                }
              });
            }}
            disabled={showLoading || transitionPending}
            className="w-full items-center gap-2.5 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            {showLoading || transitionPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Redirection…
              </>
            ) : (
              annualPriceLabel
            )}
          </Button>
        </div>
      );
    }
  }

  // Logged-in active subscriber
  if (isLoggedIn && subscriptionStatus === "ACTIVE") {
    return (
      <Link href="/billing">
        <Button
          variant="outline"
          className="w-full items-center gap-2.5 rounded-2xl border-stone-300 py-4 text-sm font-semibold shadow-sm"
        >
          Gérer mon abonnement
        </Button>
      </Link>
    );
  }

  // Unauthenticated → link to register
  return (
    <div className="space-y-2">
      {badgeLabel && (
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          {badgeLabel}
        </span>
      )}
      <Link href="/register" className="block">
        <Button className="w-full items-center gap-2.5 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90">
          Essai gratuit — 14 jours
        </Button>
      </Link>
    </div>
  );
}
