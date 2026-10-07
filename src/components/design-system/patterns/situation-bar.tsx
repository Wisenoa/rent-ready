import React from "react";
import Decimal from "decimal.js";
import { Check, Clock, AlertCircle, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Money } from "../primitives/money";
import { StatusBadge } from "../primitives/status-badge";
import { cn } from "@/lib/utils";

interface PropertySituationBarProps {
  monthName: string;
  contractRent?: Decimal | number | string | null;
  rentPortion?: Decimal | number | string | null;
  chargesPortion?: Decimal | number | string | null;
  amountReceived?: Decimal | number | string | null;
  amountRemaining?: Decimal | number | string | null;
  status: "PAID" | "PARTIAL" | "LATE" | "PENDING" | "VACANT";
  paidDate?: string | null;
  dueDate?: string | null;
  actionSlot?: React.ReactNode;
  propertyId?: string;
  className?: string;
}

/**
 * PropertySituationBar — Baromètre de situation du mois en cours
 *
 * Affiche clairement :
 * 1. Le loyer contractuel ventilation nu + charges
 * 2. Le paiement constaté avec la date ou le solde
 * 3. L'action prioritaire en un clic
 * 4. La transparence légale (Reçu d'acompte art. 21 / Quittance prête)
 */
export function PropertySituationBar({
  monthName,
  contractRent,
  rentPortion,
  chargesPortion,
  amountReceived,
  amountRemaining,
  status,
  paidDate,
  dueDate,
  actionSlot,
  propertyId,
  className,
}: PropertySituationBarProps) {
  const isPaid = status === "PAID";
  const isPartial = status === "PARTIAL";
  const isLate = status === "LATE";
  const isVacant = status === "VACANT";

  if (isVacant) {
    return (
      <div
        className={cn(
          "border border-[#151413]/10 bg-[#FAF8F3] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          className
        )}
      >
        <div className="flex items-start gap-3.5">
          <div className="size-9 bg-[#151413]/5 flex items-center justify-center shrink-0 mt-0.5">
            <Home className="size-4 text-[#151413]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#151413]">
              Ce logement est actuellement vacant
            </h2>
            <p className="text-xs text-[#6B6760] mt-0.5 max-w-xl leading-relaxed">
              Aucun bail actif n&apos;est enregistré sur ce bien. Créez un contrat de location pour
              activer le suivi mensuel des paiements et la délivrance des quittances.
            </p>
          </div>
        </div>

        {propertyId && (
          <Link
            href={`/leases/new?propertyId=${propertyId}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] text-xs font-medium shrink-0 transition-colors"
          >
            <span>Créer un bail pour ce bien</span>
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    );
  }

  // Si actif : bandeau situation du mois
  const borderTone = isPartial
    ? "border-l-[3px] border-l-[#C2410C] border-[#FED7AA]/60 bg-[#FFF7ED]/30"
    : isLate
    ? "border-l-[3px] border-l-[#D97706] border-[#FDE68A]/60 bg-[#FEF3C7]/30"
    : "border border-[#151413]/10 bg-[#FAF8F3]";

  return (
    <div className={cn("border p-4 sm:p-5 transition-all space-y-4", borderTone, className)}>
      <div className="flex items-center justify-between text-xs text-[#6B6760] border-b border-[#151413]/10 pb-2">
        <span className="uppercase tracking-wider font-semibold">
          Situation de {monthName}
        </span>
        <span>Échéance mensuelle</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* 1. Loyer contractuel */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
            Loyer contractuel
          </span>
          <div>
            <Money amount={contractRent} size="xl" tone="ink" />
          </div>
          {rentPortion && chargesPortion && (
            <p className="text-[11px] text-[#6B6760]">
              <Money amount={rentPortion} size="xs" tone="muted" /> loyer nu +{" "}
              <Money amount={chargesPortion} size="xs" tone="muted" /> charges
            </p>
          )}
        </div>

        {/* 2. Paiement constaté */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
            Paiement constaté
          </span>
          {isPaid ? (
            <div>
              <Money amount={amountReceived ?? contractRent} size="xl" tone="calm" />
              {paidDate && (
                <p className="text-[11px] text-[#166534] mt-0.5">
                  ✓ Reçu le {paidDate}
                </p>
              )}
            </div>
          ) : isPartial ? (
            <div>
              <div className="flex items-baseline gap-2">
                <Money amount={amountReceived} size="xl" tone="attention" />
                <span className="text-xs text-[#C2410C] font-semibold">reçu</span>
              </div>
              <p className="text-[11px] text-[#C2410C] font-medium mt-0.5">
                Reste à régler : <Money amount={amountRemaining} size="xs" tone="attention" />
              </p>
            </div>
          ) : (
            <div>
              <span className="text-sm font-semibold text-[#D97706] block">
                {isLate ? "Loyer en retard" : "En attente de règlement"}
              </span>
              {dueDate && (
                <p className="text-[11px] text-[#6B6760] mt-0.5">
                  Échéance au {dueDate}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3. Action & Transparence Légale */}
        <div className="space-y-2 md:text-right flex flex-col md:items-end justify-center">
          {actionSlot && <div className="shrink-0">{actionSlot}</div>}

          {/* Vérité produit légale Art. 21 */}
          <p className="text-[11px] text-[#6B6760] leading-tight">
            {isPaid ? (
              "Quittance libératoire disponible"
            ) : isPartial ? (
              "Reçu d'acompte émis (art. 21) · Quittance bloquée jusqu'au solde"
            ) : (
              "Quittance disponible dès réception du loyer"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
