import React from "react";
import Decimal from "decimal.js";
import { Money } from "../primitives/money";
import { cn } from "@/lib/utils";

interface FinancialSummaryProps {
  expected: Decimal | number | string;
  received: Decimal | number | string;
  outstanding: Decimal | number | string;
  collectionPercentage?: number;
  className?: string;
}

/**
 * FinancialSummary — Synthèse financière tabulaire B+ V2.1
 *
 * Affiche la triade fondamentale du grand livre mensuel :
 * Attendus / Reçus / Solde à percevoir.
 * Zéro arithmétique flottante, chiffres tabulaires rigoureusement alignés.
 */
export function FinancialSummary({
  expected,
  received,
  outstanding,
  collectionPercentage,
  className,
}: FinancialSummaryProps) {
  const outstandingDec = new Decimal(outstanding ?? 0);
  const isAllPaid = outstandingDec.isZero();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-3 gap-4 border-b border-neutral-200/80 pb-4 sm:pb-5">
        {/* 1. Attendus */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-neutral-500 block">
            Loyers attendus
          </span>
          <div>
            <Money amount={expected} size="2xl" tone="ink" />
          </div>
        </div>

        {/* 2. Reçus */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-neutral-500 block">
            Loyers perçus
          </span>
          <div>
            <Money amount={received} size="2xl" tone="calm" />
          </div>
        </div>

        {/* 3. Solde */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-neutral-500 block">
            Reste à percevoir
          </span>
          <div>
            <Money
              amount={outstanding}
              size="2xl"
              tone={isAllPaid ? "calm" : "attention"}
            />
          </div>
        </div>
      </div>

      {typeof collectionPercentage === "number" && (
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, collectionPercentage))}%` }}
            />
          </div>
          <span className="font-sans text-xs tabular-nums font-medium text-neutral-700">
            {collectionPercentage}% collecté
          </span>
        </div>
      )}
    </div>
  );
}
