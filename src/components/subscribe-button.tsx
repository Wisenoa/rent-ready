"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createSubscriptionCheckout } from "@/lib/actions/subscription-actions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubscribeButton() {
  const { data: session, isPending: sessionPending } = useSession();
  const [transitionPending, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  if (sessionPending) {
    return (
      <Button
        disabled
        className="w-full items-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10"
      >
        <Loader2 className="size-4 animate-spin" />
        Chargement…
      </Button>
    );
  }

  const isLoggedIn = !!session?.user;
  const subscriptionStatus = (session?.user as any)?.subscriptionStatus;

  // Authenticated user with expired trial → go to billing to subscribe
  if (isLoggedIn && subscriptionStatus === "TRIAL") {
    const trialEndsAt = (session?.user as any)?.trialEndsAt;
    const trialExpired = trialEndsAt ? new Date(trialEndsAt) < new Date() : false;

    if (trialExpired || subscriptionStatus !== "ACTIVE") {
      return (
        <Button
          onClick={() => {
            setShowLoading(true);
            startTransition(async () => {
              const result = await createSubscriptionCheckout();
              if (result.success && result.data?.url) {
                window.location.href = result.data.url;
              } else {
                // Fallback: navigate to billing page
                window.location.href = "/billing";
              }
            });
          }}
          disabled={showLoading || transitionPending}
          className="w-full items-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-800"
        >
          {showLoading || transitionPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Redirection…
            </>
          ) : (
            "S'abonner maintenant"
          )}
        </Button>
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
    <Link href="/register" className="block">
      <Button className="w-full items-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-800">
        Essai gratuit — 14 jours
      </Button>
    </Link>
  );
}
