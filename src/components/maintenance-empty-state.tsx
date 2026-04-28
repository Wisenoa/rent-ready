"use client";

import { Wrench, MessageSquare, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaintenanceEmptyStateProps {
  hasTenants: boolean;
  hasProperties: boolean;
}

export function MaintenanceEmptyState({ hasTenants, hasProperties }: MaintenanceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-4">
      {/* Decorative illustration */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-indigo-600"
            >
              <path d="M8 20L12 16M14 14L18 10M22 6L26 10L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="24" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucune demande de maintenance</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        {!hasTenants || !hasProperties
          ? "Configurez d'abord un bien et un locataire pour recevoir des demandes de maintenance."
          : "Vos locataires pourront vous soumettre des demandes de réparation ici."}
      </p>

      <div className="flex flex-col gap-3 max-w-sm w-full">
        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shrink-0">
            <MessageSquare className="size-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium">Comment ça marche</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Vos locataires peuvent soumettre une demande depuis leur portail. Vous la recevez ici et pouvez la suivre.
            </p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shrink-0">
            <Wrench className="size-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium">Type de demandes</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plomberie, électricité, serrurerie, peintures, électroménager... Tout est centralisé.
            </p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shrink-0">
            <Phone className="size-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium">Suivi en temps réel</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statut, photos, historique — vous gardez une trace complète de chaque intervention.
            </p>
          </div>
        </div>
      </div>

      {(!hasTenants || !hasProperties) && (
        <p className="text-xs text-muted-foreground mt-6 max-w-xs text-center">
          Terminez d'abord la configuration de votre premier bien et locataire via le guide de démarrage.
        </p>
      )}
    </div>
  );
}
