import React from "react";
import Link from "next/link";
import Decimal from "decimal.js";
import { ArrowRight, Receipt, Check } from "lucide-react";
import { StatusDot } from "../primitives/status-dot";
import { Money } from "../primitives/money";
import { cn } from "@/lib/utils";

export interface RentRowProps {
  propertyId: string;
  propertyName: string;
  propertyLocation?: string;
  tenantName?: string;
  leaseDetail?: string; // e.g. "Bail meublé 1 an"
  totalRent?: Decimal | number | string | null;
  status: "PAID" | "PARTIAL" | "LATE" | "PENDING" | "VACANT";
  paidDate?: string | null;
  dueDate?: string | null;
  remainingAmount?: Decimal | number | string | null;
  exceptionNotice?: string;
  actionSlot?: React.ReactNode;
  quittanceUrl?: string;
  className?: string;
}

/**
 * RentRow — Ligne de grand livre B+ V2.1 avec rétraction mécanique
 *
 * Implémente la règle de l'attention proportionnée :
 * - Si Réglé (PAID) : ligne compacte (hauteur ~48px), point vert feutré, silence visuel.
 * - Si Exception (PARTIAL / LATE / PENDING) : ligne développée avec accent terracotta ou ambre,
 *   explication de l'acompte ou du retard, et bouton d'action directe.
 * - Si Vacant : ligne compacte signalant l'absence de bail actif.
 */
export function RentRow({
  propertyId,
  propertyName,
  propertyLocation,
  tenantName,
  leaseDetail,
  totalRent,
  status,
  paidDate,
  dueDate,
  remainingAmount,
  exceptionNotice,
  actionSlot,
  quittanceUrl = "/billing",
  className,
}: RentRowProps) {
  const isPaid = status === "PAID";
  const isVacant = status === "VACANT";
  const isException = !isPaid && !isVacant;

  if (isException) {
    // ─── ÉTAT DÉVELOPPÉ (ATTENTION / EXCEPTION) ───
    const isPartial = status === "PARTIAL";
    const accentBorder = isPartial
      ? "rounded-lg border border-l-4 border-l-orange-500 border-neutral-200 bg-orange-50/40"
      : "rounded-lg border border-l-4 border-l-amber-500 border-neutral-200 bg-amber-50/40";

    return (
      <div
        className={cn(
          "p-3.5 sm:p-4 space-y-3 transition-all duration-200",
          accentBorder,
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusDot tone={isPartial ? "attention" : "delayed"} />
              <Link
                href={`/properties/${propertyId}`}
                className="font-semibold text-sm text-neutral-900 hover:underline truncate"
              >
                {propertyName}
              </Link>
              {propertyLocation && (
                <span className="text-xs text-neutral-500 hidden sm:inline">
                  · {propertyLocation}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 mt-0.5">
              {tenantName ? (
                <>Locataire : <strong className="font-medium text-neutral-900">{tenantName}</strong></>
              ) : (
                "Aucun locataire"
              )}
              {totalRent && (
                <> · Loyer contractuel : <Money amount={totalRent} size="xs" tone="ink" /></>
              )}
            </p>
          </div>

          {remainingAmount && (
            <div className="text-left sm:text-right shrink-0">
              <p className="text-xs font-semibold text-orange-700">
                Solde de <Money amount={remainingAmount} size="sm" tone="attention" /> à pointer
              </p>
              {totalRent && (
                <p className="text-[11px] text-neutral-500">
                  (sur <Money amount={totalRent} size="xs" tone="muted" />)
                </p>
              )}
            </div>
          )}
        </div>

        {exceptionNotice && (
          <p className="text-xs text-neutral-600 border-t border-neutral-200/80 pt-2 leading-relaxed">
            {exceptionNotice}
          </p>
        )}

        {actionSlot && (
          <div className="pt-1 flex justify-end">
            {actionSlot}
          </div>
        )}
      </div>
    );
  }

  // ─── ÉTAT COMPACT (RÉGLÉ OU VACANT) ───
  return (
    <div
      className={cn(
        "rounded-lg py-2.5 px-3 bg-white hover:bg-neutral-50/60 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <StatusDot tone={isPaid ? "calm" : "neutral"} />
        <div className="min-w-0">
          <Link
            href={`/properties/${propertyId}`}
            className="font-medium text-sm text-neutral-900 hover:underline truncate block"
          >
            {propertyName}
          </Link>
          <p className="text-xs text-neutral-500 truncate">
            {tenantName ? `${tenantName} ` : ""}
            {leaseDetail ? `· ${leaseDetail}` : ""}
            {propertyLocation ? ` · ${propertyLocation}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        {totalRent && (
          <div className="text-right">
            <Money amount={totalRent} size="sm" tone="ink" />
            {paidDate && (
              <p className="text-[11px] text-emerald-700 font-medium">
                ✓ Réglé {paidDate}
              </p>
            )}
            {dueDate && !paidDate && (
              <p className="text-[11px] text-neutral-500">
                Échéance {dueDate}
              </p>
            )}
          </div>
        )}

        {isPaid ? (
          <Link
            href={quittanceUrl}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60 transition-colors font-medium"
          >
            <Check className="size-3" />
            <span>Quittance prête</span>
          </Link>
        ) : isVacant ? (
          <Link
            href={`/leases/new?propertyId=${propertyId}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors font-medium shadow-xs"
          >
            <span>Créer bail</span>
            <ArrowRight className="size-3" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
