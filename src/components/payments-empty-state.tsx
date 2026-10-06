"use client";

import { Plus, Receipt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentsEmptyStateProps {
  onStartLeaseWizard?: () => void;
}

export function PaymentsEmptyState({
  onStartLeaseWizard,
}: PaymentsEmptyStateProps) {
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
              {/* Receipt body */}
              <path
                d="M8 4h16v2l-3 3v15a2 2 0 01-2 2H13a2 2 0 01-2-2V9L8 6V4z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinejoin="round"
              />
              {/* Receipt torn edge */}
              <path
                d="M8 6l3 3M8 9l3 3M8 12l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Euro symbol */}
              <circle cx="20" cy="19" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path
                d="M18 17.5h4M18 19h4M18 20.5h3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Receipt className="size-3.5 text-amber-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucune transaction enregistrée</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        Vos paiements apparaîtront ici une fois votre premier bail mis en place.
        Générez automatiquement des quittances pour chaque paiement reçu.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={onStartLeaseWizard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mr-2"
          >
            <path
              d="M8 1L10.5 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H5.5L8 1Z"
              fill="currentColor"
            />
          </svg>
          Configurer avec guide
        </Button>
        <Button variant="outline" asChild>
          <a href="/leases">
            <Plus className="size-4 mr-2" />
            Créer un bail
          </a>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Quittances PDF automatiques
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Suivi des paiements en retard
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Historique complet
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Export comptable
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 max-w-xs text-center leading-relaxed">
        Chaque paiement enregistré génère automatiquement une quittance à envoyer à votre locataire.
      </p>
    </div>
  );
}
