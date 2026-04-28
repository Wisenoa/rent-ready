"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TenantForm } from "@/components/tenant-form";
import { SampleDataButton } from "@/components/sample-data-button";

interface TenantsEmptyStateProps {
  onStartWizard: () => void;
}

export function TenantsEmptyState({ onStartWizard }: TenantsEmptyStateProps) {
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
              <circle cx="16" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="26" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M30 16C30 13 28 11 26 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Plus className="size-3.5 text-amber-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucun locataire</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        Ajoutez votre premier locataire pour suivre ses paiements et générer des quittances.
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
        <TenantForm>
          <Button variant="outline">
            <Plus className="size-4 mr-2" />
            Ajouter un locataire
          </Button>
        </TenantForm>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Le guide vous aidera à configurer bien + locataire + bail d'un seul coup.
      </p>
      <div className="mt-3">
        <SampleDataButton />
      </div>
    </div>
  );
}