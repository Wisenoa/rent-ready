import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Decimal from "decimal.js";
import { AlertCircle, ArrowRight, History } from "lucide-react";
import { ReminderButton } from "@/components/reminder-button";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { getRentExceptions, type RentException } from "@/lib/queries/arrears";
import { formatCurrency } from "@/lib/format";
import { Money } from "@/components/design-system/primitives/money";
import { StatusBadge } from "@/components/design-system/primitives/status-badge";
import { StatusDot } from "@/components/design-system/primitives/status-dot";
import { cn } from "@/lib/utils";

/**
 * ArrearsSection — Traitement prioritaire des exceptions de loyers (B+ V2.1)
 *
 * Implémente l'architecture d'attention proportionnée :
 * 1. Les retards du mois en cours : Déploiement clair avec solde, explication et boutons d'action.
 * 2. Les arriérés historiques : Synthèse compacte groupée par bail (zéro panique de cartes empilées).
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

  return (
    <div className="space-y-4">
      {/* 1. Retards du mois en cours — Priorité d'action immédiate */}
      {currentMonthExceptions.length > 0 && (
        <div className="rounded-lg border border-l-4 border-l-orange-500 border-orange-200 bg-orange-50/50 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-orange-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <StatusDot tone="attention" />
              <h2 className="text-sm sm:text-base font-semibold text-neutral-900">
                Loyers en attente ce mois-ci ({format(now, "MMMM yyyy", { locale: fr })})
              </h2>
            </div>
            <StatusBadge tone="attention" size="xs">
              {currentMonthExceptions.length} à traiter
            </StatusBadge>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Ces loyers sont échus pour le mois en cours et nécessitent un pointage ou une relance.
          </p>

          <div className="divide-y divide-orange-200/60">
            {currentMonthExceptions.map((exception) => {
              const alreadyPaidDec = new Decimal(exception.alreadyPaid);
              const isPartial = alreadyPaidDec.gt(0);

              return (
                <div
                  key={exception.transactionId}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-neutral-900">
                        {exception.tenant.firstName} {exception.tenant.lastName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        · {exception.property.name}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <div className="font-semibold text-sm text-neutral-900">
                        {isPartial ? (
                          <>
                            <Money amount={exception.remaining} tone="attention" size="sm" />
                            <span className="text-neutral-500 font-normal text-xs ml-1">
                              restant sur <Money amount={exception.totalDue} tone="muted" size="xs" />
                            </span>
                          </>
                        ) : (
                          <Money amount={exception.remaining} tone="attention" size="sm" />
                        )}
                      </div>

                      {isPartial && (
                        <StatusBadge tone="attention" size="xs">
                          Partiellement payé
                        </StatusBadge>
                      )}

                      <StatusBadge tone={exception.daysLate > 0 ? "delayed" : "neutral"} size="xs">
                        {exception.daysLate === 0
                          ? "Échéance aujourd'hui"
                          : `${exception.daysLate} jour${exception.daysLate > 1 ? "s" : ""} de retard`}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
                    <ReminderButton
                      transactionId={exception.transactionId}
                      label="Relancer"
                    />
                    <MarkPaidButton
                      transactionId={exception.transactionId}
                      defaultAmount={Number(exception.remaining)}
                      label="Enregistrer"
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs h-8 px-3 rounded-md"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Arriérés historiques groupés par bail (Calme & Synthèse) */}
      {historicalByLease.size > 0 && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
            <div className="flex items-center gap-2">
              <History className="size-4 text-neutral-500" />
              <h3 className="text-xs font-semibold text-neutral-700">
                Arriérés des mois antérieurs
              </h3>
            </div>
            <span className="text-xs font-semibold text-neutral-900 font-sans tabular-nums">
              Total : {formatCurrency(
                Array.from(historicalByLease.values())
                  .reduce((sum, h) => sum.plus(h.totalRemaining), new Decimal(0))
                  .toFixed(2)
              )}
            </span>
          </div>

          <div className="divide-y divide-neutral-200/80">
            {Array.from(historicalByLease.entries()).map(([leaseId, data]) => (
              <div
                key={leaseId}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-medium text-neutral-900">
                    {data.tenant.firstName} {data.tenant.lastName}
                  </span>
                  <span className="text-[#6B6760]"> — {data.property.name}</span>
                  <p className="text-[#6B6760] text-[11px] mt-0.5">
                    {data.count} période{data.count > 1 ? "s" : ""} impayée{data.count > 1 ? "s" : ""} (le plus ancien a {data.oldestDaysLate} j de retard)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Money amount={data.totalRemaining.toFixed(2)} size="sm" tone="ink" />
                  <Link
                    href="/billing"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#151413]/15 bg-white hover:bg-[#FAF8F3] text-[#151413] transition-colors font-medium"
                  >
                    <span>Régulariser</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}