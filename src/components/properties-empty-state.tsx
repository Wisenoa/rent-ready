"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyForm } from "@/components/property-form";
import { SampleDataButton } from "@/components/sample-data-button";

interface EmptyStateCTAProps {
  onStartWizard: () => void;
}

export function PropertiesEmptyState({
  onStartWizard,
}: EmptyStateCTAProps) {
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
              <rect x="4" y="10" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="8" y="14" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="18" y="14" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M4 14 L16 6 L28 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="10" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Plus className="size-3.5 text-amber-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucun bien enregistré</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        Configurez votre premier bien en moins de 5 minutes avec notre guide pas à pas.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <PropertyForm
          trigger={
            <>
              <Plus className="size-4 mr-2" />
              Ajouter un logement
            </>
          }
        />
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Vous pouvez importer vos biens plus tard depuis n'importe quelle page.
      </p>
      <div className="mt-3">
        <SampleDataButton />
      </div>
    </div>
  );
}