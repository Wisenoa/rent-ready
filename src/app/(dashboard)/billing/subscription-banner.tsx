"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
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

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * The wall clock is an external mutable source, so it is read through
 * useSyncExternalStore rather than Date.now()/new Date() in the render body —
 * a render must be pure and idempotent, and a value that changes on every
 * re-render makes the banner flicker between two different answers.
 *
 * The banner counts whole days, so the snapshot is rounded down to the start of
 * the current day. That is deliberate:
 *  - it matches the unit the UI displays, so the value only changes when the
 *    displayed number would change;
 *  - server render and hydration both land on the same day boundary, so there
 *    is no hydration mismatch (getServerSnapshot is the same computation).
 *
 * The store is module-level: the timer and the cached snapshot are shared by
 * every banner instance, and the first subscriber starts the ticker.
 */
function startOfCurrentDay(): number {
  return Math.floor(Date.now() / MS_PER_DAY) * MS_PER_DAY;
}

let daySnapshot = startOfCurrentDay();
const dayListeners = new Set<() => void>();
let dayTicker: ReturnType<typeof setInterval> | undefined;

function refreshDaySnapshot() {
  const next = startOfCurrentDay();
  if (next === daySnapshot) return;
  daySnapshot = next;
  for (const listener of dayListeners) listener();
}

function subscribeToDay(onStoreChange: () => void) {
  dayListeners.add(onStoreChange);
  if (dayListeners.size === 1) {
    // A tab can stay open across midnight, so catch up on subscribe.
    refreshDaySnapshot();
    dayTicker = setInterval(refreshDaySnapshot, 60 * 1000);
  }
  return () => {
    dayListeners.delete(onStoreChange);
    if (dayListeners.size === 0 && dayTicker) {
      clearInterval(dayTicker);
      dayTicker = undefined;
    }
  };
}

function getDaySnapshot(): number {
  return daySnapshot;
}

/**
 * Fresh per render on purpose: subscribe() only runs on the client, so a
 * long-lived server process would otherwise serve a day snapshot frozen at
 * module-init time. Hydration calls this too, and both sides land on the same
 * day boundary because the value is rounded.
 */
function getServerDaySnapshot(): number {
  return startOfCurrentDay();
}

function isTrialExpired(trialEndsAt: Date | string | null, now: number): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() < now;
}

/** Whole days between `now` and the trial end; 0 once the trial is over. */
function trialDaysLeft(trialEndsAt: Date | string, now: number): number {
  return Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - now) / MS_PER_DAY));
}

export function SubscriptionBanner({ status, trialEndsAt, stripeCustomerId }: SubscriptionBannerProps) {
  const [isPending, startTransition] = useTransition();
  const [showPortalLoading, setShowPortalLoading] = useState(false);

  // One clock read, shared by every branch below: the expired check and the
  // countdown must never disagree because they sampled the clock separately.
  const now = useSyncExternalStore(subscribeToDay, getDaySnapshot, getServerDaySnapshot);
  const trialExpired = isTrialExpired(trialEndsAt, now);
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
    const daysLeft = trialDaysLeft(trialEndsAt, now);
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
