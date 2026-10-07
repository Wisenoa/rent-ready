import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "../primitives/status-badge";
import type { StatusTone } from "../primitives/status-dot";
import { cn } from "@/lib/utils";

interface PropertyHeaderProps {
  propertyName: string;
  propertyType?: string;
  surface?: number | null;
  rooms?: number | null;
  city?: string | null;
  isFurnished?: boolean;
  statusText?: string;
  statusTone?: StatusTone;
  actionsSlot?: React.ReactNode;
  className?: string;
}

/**
 * PropertyHeader — En-tête architectural de la Property Home Base B+ V2.1
 *
 * Combine le fil d'ariane feutré, l'identité du bien en typographie serif noble,
 * les caractéristiques architecturales et le macaron d'état mensuel.
 */
export function PropertyHeader({
  propertyName,
  propertyType,
  surface,
  rooms,
  city,
  isFurnished,
  statusText,
  statusTone = "neutral",
  actionsSlot,
  className,
}: PropertyHeaderProps) {
  // Construire la ligne de sous-titre
  const attributes: string[] = ["Gestion directe"];
  if (surface) attributes.push(`${surface} m²`);
  if (typeof isFurnished === "boolean") {
    attributes.push(isFurnished ? "Meublé" : "Non meublé");
  } else if (propertyType) {
    attributes.push(propertyType);
  }
  if (rooms) attributes.push(`${rooms} pièce${rooms > 1 ? "s" : ""}`);
  if (city) attributes.push(city);

  return (
    <header className={cn("space-y-3 border-b border-neutral-200/80 pb-5", className)}>
      {/* Fil d'ariane & actions secondaires */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors group font-medium"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Tableau de bord</span>
        </Link>

        {actionsSlot && <div className="shrink-0">{actionsSlot}</div>}
      </div>

      {/* Titre & Statut */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-500">
            {attributes.join(" · ")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-0.5">
            {propertyName}
          </h1>
        </div>

        {statusText && (
          <div className="shrink-0 pt-1 sm:pt-0">
            <StatusBadge tone={statusTone} showDot size="default">
              {statusText}
            </StatusBadge>
          </div>
        )}
      </div>
    </header>
  );
}
