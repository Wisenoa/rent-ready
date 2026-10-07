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
    <header className={cn("space-y-2 border-b border-[#151413]/10 pb-5", className)}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6760] font-medium">
        <Calendar className="size-3.5 text-[#6B6760]" />
        <span>
          Mois en cours{stoppedDate ? ` · Arrêté au ${stoppedDate}` : ""}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal capitalize">
            <span className="sr-only">Tableau de bord · </span>
            {monthName}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6760] mt-1">
            Tableau de bord opérationnel & suivi des encaissements
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-white border border-[#151413]/10 text-[#151413] transition-colors"
              >
                <Building2 className="size-3 text-[#6B6760]" />
                <span>Logements ({propertiesCount})</span>
              </Link>
            )}

            {typeof activeTenantsCount === "number" && (
              <Link
                href="/tenants"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-white border border-[#151413]/10 text-[#151413] transition-colors"
              >
                <Users className="size-3 text-[#6B6760]" />
                <span>Locataires ({activeTenantsCount})</span>
              </Link>
            )}

            <Link
              href="/billing"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#151413] hover:bg-[#2A2725] text-[#F8F6F0] font-medium transition-colors"
            >
              <Receipt className="size-3 text-[#F8F6F0]" />
              <span>Quittances & Facturation</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
