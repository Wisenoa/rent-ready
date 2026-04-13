"use client";

import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaseForm } from "@/components/lease-form";

interface LeasesEmptyStateProps {
  onStartWizard: () => void;
}

export function LeasesEmptyState({ onStartWizard }: LeasesEmptyStateProps) {
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
              <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M10 10H22M10 14H22M10 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="22" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M24.5 24.5L27 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Plus className="size-3.5 text-amber-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucun bail créé</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        Créez votre premier bail pour commencer à suivre les paiements et générer des quittances.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={onStartWizard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mr-2"
          >
            <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H5.5L8 1Z"
              fill="currentColor" />
          </svg>
          Configurer avec guide
        </Button>
        <LeaseForm
          properties={[]}
          tenants={[]}
          trigger={
            <Button variant="outline">
              <FileText className="size-4 mr-2" />
              Créer un bail
            </Button>
          }
        />
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Le guide création vous accompagne étape par étape.
      </p>
    </div>
  );
}