import React from "react";
import Link from "next/link";
import { Calendar, Building2, Users, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthHeaderProps {
  monthName: string;
  stoppedDate?: string;
  propertiesCount?: number;
  activeTenantsCount?: number;
  actionsSlot?: React.ReactNode;
  className?: string;
}

/**
 * MonthHeader — En-tête architectural du mois B+ V2.1
 *
 * Utilise la typographie Serif éditoriale pour ancrer le cycle temporel
 * et offre une circulation rapide sans surcharge visuelle.
 */
export function MonthHeader({
  monthName,
  stoppedDate,
  propertiesCount,
  activeTenantsCount,
  actionsSlot,
  className,
}: MonthHeaderProps) {
  return (
    <header className={cn("space-y-3 border-b border-neutral-200/80 pb-4 sm:pb-5", className)}>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight capitalize">
            <span className="sr-only">Tableau de bord · </span>
            {monthName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Suivi des encaissements et des loyers{stoppedDate ? ` au ${stoppedDate}` : ""}
          </p>
        </div>

        {/* Liens de circulation secondaires */}
        {actionsSlot ? (
          <div className="shrink-0">{actionsSlot}</div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {typeof propertiesCount === "number" && (
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 transition-colors font-medium shadow-xs"
              >
                <Building2 className="size-3.5 text-neutral-500" />
                <span>Logements ({propertiesCount})</span>
              </Link>
            )}

            {typeof activeTenantsCount === "number" && (
              <Link
                href="/tenants"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 transition-colors font-medium shadow-xs"
              >
                <Users className="size-3.5 text-neutral-500" />
                <span>Locataires ({activeTenantsCount})</span>
              </Link>
            )}

            <Link
              href="/billing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-colors shadow-xs"
            >
              <Receipt className="size-3.5" />
              <span>Quittances & Facturation</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
