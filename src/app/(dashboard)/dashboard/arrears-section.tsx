import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Decimal from "decimal.js";
import { AlertCircle, ArrowRight, CreditCard, Clock, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ReminderButton } from "@/components/reminder-button";
import { getRentExceptions, type RentException } from "@/lib/queries/arrears";
import { formatCurrency } from "@/lib/format";

/**
 * « Actions Requises » — Traitement prioritaire des exceptions de loyers.
 *
 * Différencie rigoureusement :
 * 1. Les retards du mois en cours (Action immédiate pour le propriétaire)
 * 2. Les arriérés historiques groupés par bail (Évite l'effet de panique
 *    des 10 cartes empilées lors de l'import d'un bail rétroactif).
 */
export async function ArrearsSection({ userId }: { userId: string }) {
  const exceptions = await getRentExceptions(userId);

  if (exceptions.length === 0) return null;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Séparation du mois en cours vs historique
  const currentMonthExceptions: RentException[] = [];
  const historicalByLease = new Map<
    string,
    {
      tenant: { firstName: string; lastName: string };
      property: { name: string };
      count: number;
      totalRemaining: Decimal;
      oldestDaysLate: number;
    }
  >();

  for (const exc of exceptions) {
    if (exc.periodStart >= currentMonthStart) {
      currentMonthExceptions.push(exc);
    } else {
      const existing = historicalByLease.get(exc.leaseId);
      if (existing) {
        existing.count += 1;
        existing.totalRemaining = existing.totalRemaining.plus(new Decimal(exc.remaining));
        existing.oldestDaysLate = Math.max(existing.oldestDaysLate, exc.daysLate);
      } else {
        historicalByLease.set(exc.leaseId, {
          tenant: exc.tenant,
          property: exc.property,
          count: 1,
          totalRemaining: new Decimal(exc.remaining),
          oldestDaysLate: exc.daysLate,
        });
      }
    }
  }

  const totalRemaining = exceptions.reduce(
    (sum, e) => sum.plus(new Decimal(e.remaining)),
    new Decimal(0)
  );

  return (
    <div className="space-y-4">
      {/* 1. Retards du mois en cours — Priorité d'action immédiate */}
      {currentMonthExceptions.length > 0 && (
        <Card className="border-amber-200/80 bg-amber-50/20 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-900">
                <AlertCircle className="size-5 text-amber-600" />
                Loyers en attente ce mois-ci ({format(now, "MMMM yyyy", { locale: fr })})
              </CardTitle>
              <Badge variant="outline" className="text-amber-800 bg-amber-100/70 border-amber-300">
                {currentMonthExceptions.length} à traiter
              </Badge>
            </div>
            <CardDescription className="text-xs text-amber-900/80">
              Ces loyers sont échus pour le mois en cours et nécessitent un pointage ou une relance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-amber-200/50">
              {currentMonthExceptions.map((exception) => {
                const partial = new Decimal(exception.alreadyPaid).gt(0);

                return (
                  <li
                    key={exception.transactionId}
                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {exception.tenant.firstName} {exception.tenant.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {exception.property.name}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <span className="font-semibold text-foreground text-sm font-mono">
                          {partial
                            ? `${formatCurrency(exception.remaining)} / ${formatCurrency(exception.totalDue)}`
                            : formatCurrency(exception.remaining)}
                        </span>
                        {partial && (
                          <Badge variant="secondary" className="text-[11px]">
                            Partiellement payé
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[11px] text-amber-800 bg-amber-100/60 border-amber-300"
                        >
                          {exception.daysLate === 0
                            ? "Échéance aujourd'hui"
                            : `${exception.daysLate} jour${exception.daysLate > 1 ? "s" : ""} de retard`}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <ReminderButton
                        transactionId={exception.transactionId}
                        label="Relancer"
                      />
                      <Link
                        href="/billing"
                        className={cn(buttonVariants({ size: "sm" }), "bg-stone-900 hover:bg-stone-800 text-white text-xs h-8")}
                      >
                        Enregistrer
                        <ArrowRight className="size-3 ml-1" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 2. Arriérés historiques groupés par bail (Calme & Synthèse) */}
      {historicalByLease.size > 0 && (
        <Card className="border-border/60 bg-muted/20 shadow-sm">
          <CardHeader className="pb-2.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <History className="size-4 text-muted-foreground" />
                Arriérés des mois antérieurs
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground font-mono">
                Total : {formatCurrency(
                  Array.from(historicalByLease.values())
                    .reduce((sum, h) => sum.plus(h.totalRemaining), new Decimal(0))
                    .toFixed(2)
                )}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border/40">
              {Array.from(historicalByLease.entries()).map(([leaseId, data]) => (
                <div
                  key={leaseId}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-medium text-foreground">
                      {data.tenant.firstName} {data.tenant.lastName}
                    </span>
                    <span className="text-muted-foreground"> — {data.property.name}</span>
                    <p className="text-muted-foreground mt-0.5">
                      {data.count} période{data.count > 1 ? "s" : ""} impayée{data.count > 1 ? "s" : ""} (le plus ancien a {data.oldestDaysLate} j de retard)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold font-mono text-sm text-foreground">
                      {formatCurrency(data.totalRemaining.toFixed(2))}
                    </span>
                    <Link
                      href="/billing"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs")}
                    >
                      Régulariser
                      <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}