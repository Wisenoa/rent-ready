import React from "react";
import { FileText, ShieldCheck, Download, ExternalLink } from "lucide-react";
import { StatusBadge } from "../primitives/status-badge";
import { cn } from "@/lib/utils";

export interface DocumentItem {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  statusLabel: string;
  statusTone?: "calm" | "attention" | "delayed" | "neutral";
  actionType?: "download" | "view" | "custom";
  actionHref?: string;
  actionSlot?: React.ReactNode;
}

interface DocumentRegisterProps {
  documents: DocumentItem[];
  emptyMessage?: string;
  className?: string;
}

/**
 * DocumentRegister — Registre documentaire structuré B+ V2.1
 *
 * Remplace définitivement la "Card Soup" (cartes carrées de 140px).
 * Présente les pièces légales et financières sous forme de registre linéaire
 * haute densité (hauteur ~42px par ligne), scalable de 1 à 50 documents.
 */
export function DocumentRegister({
  documents,
  emptyMessage = "Aucun document archivé pour ce logement.",
  className,
}: DocumentRegisterProps) {
  if (documents.length === 0) {
    return (
      <div className="py-6 px-4 border border-dashed border-[#151413]/20 bg-[#FAF8F3] text-center text-xs text-[#6B6760]">
        <FileText className="size-5 mx-auto mb-1.5 text-[#9E9A90]" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("border border-[#151413]/10 divide-y divide-[#151413]/10 bg-[#FAF8F3]", className)}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-white transition-colors"
        >
          {/* Document & Détail */}
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <FileText className="size-4 text-[#6B6760] shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0">
              <p className="font-medium text-xs sm:text-sm text-[#151413] truncate">
                {doc.title}
              </p>
              {(doc.subtitle || doc.period) && (
                <p className="text-[11px] text-[#6B6760] truncate">
                  {doc.subtitle}
                  {doc.subtitle && doc.period ? " · " : ""}
                  {doc.period}
                </p>
              )}
            </div>
          </div>

          {/* Statut & Action */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#151413]/5">
            <StatusBadge tone={doc.statusTone ?? "neutral"} size="xs">
              {doc.statusLabel}
            </StatusBadge>

            {doc.actionSlot ? (
              doc.actionSlot
            ) : doc.actionHref ? (
              <a
                href={doc.actionHref}
                target={doc.actionType === "view" ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#151413] hover:underline font-medium"
              >
                {doc.actionType === "download" ? (
                  <>
                    <Download className="size-3 text-[#6B6760]" />
                    <span>Télécharger</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="size-3 text-[#6B6760]" />
                    <span>Consulter</span>
                  </>
                )}
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
