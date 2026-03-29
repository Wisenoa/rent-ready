import { Metadata } from "next";
import { Calculator, Scale, Info } from "lucide-react";

import { TaxSimulatorForm } from "@/components/tax-simulator-form";
import { EReportingSection } from "./e-reporting-section";

export const metadata: Metadata = {
  title: "Analyse Fiscale",
};

export default function FiscalPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Analyse Fiscale
          </h1>
          <p className="text-muted-foreground mt-1">
            Comparez les régimes fiscaux pour optimiser vos revenus locatifs
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            <Scale className="size-4" />
            <span>Simulation 2026</span>
          </div>
        </div>
      </div>

      {/* Intro cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl border border-dashed p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">LMNP Micro-BIC</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Abattement forfaitaire de 50% sur les recettes
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-dashed p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">LMNP Réel</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Déduction des charges réelles et amortissements
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-dashed p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Scale className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Dispositif Jeanbrun</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Amortissement majoré pour le logement intermédiaire/social
            </p>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <TaxSimulatorForm />

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <Info className="size-4 mt-0.5 shrink-0" />
        <p>
          Ce simulateur est fourni à titre indicatif. Les calculs sont basés sur
          les taux en vigueur pour 2026 (prélèvements sociaux à 18,6%). Consultez
          un expert-comptable pour une analyse personnalisée.
        </p>
      </div>

      {/* E-Reporting B2C */}
      <section>
        <EReportingSection />
      </section>
    </div>
  );
}
