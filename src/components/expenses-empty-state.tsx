"use client";

import { Plus, Sparkles, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseOcrDialog } from "@/components/expense-ocr-dialog";

interface ExpensesEmptyStateProps {
  properties: Array<{ id: string; name: string }>;
  onTrySampleData?: () => void;
}

export function ExpensesEmptyState({ properties, onTrySampleData }: ExpensesEmptyStateProps) {
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
              <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M10 12H22M10 16H18M10 20H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="22" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M24 22L26 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
            <Plus className="size-3.5 text-amber-600" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Aucune dépense enregistrée</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center leading-relaxed">
        Ajoutez vos premières dépenses pour suivre votre rentabilité locative et exporter vos justificatifs.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <ExpenseOcrDialog
          properties={properties}
          trigger={
            <Button variant="outline">
              <Sparkles className="size-4 mr-2" />
              Scanner une facture
            </Button>
          }
        />
        <ExpenseForm
          properties={properties}
          trigger={
            <Button>
              <Plus className="size-4 mr-2" />
              Ajouter une dépense
            </Button>
          }
        />
      </div>

      {onTrySampleData && (
        <button
          type="button"
          onClick={onTrySampleData}
          className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Je préfère essayer avec des données de démonstration
        </button>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Suivi par bien
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Export PDF fiscal
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Catégorisation auto
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Scan IA inclus
        </div>
      </div>
    </div>
  );
}
