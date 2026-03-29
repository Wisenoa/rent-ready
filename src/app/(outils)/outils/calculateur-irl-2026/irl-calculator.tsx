"use client";

import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";

const irlEntries = [
  { key: "T4-2025", label: "T4 2025 — 145,78", valeur: 145.78 },
  { key: "T3-2025", label: "T3 2025 — 144,51", valeur: 144.51 },
  { key: "T2-2025", label: "T2 2025 — 143,58", valeur: 143.58 },
  { key: "T1-2025", label: "T1 2025 — 143,46", valeur: 143.46 },
  { key: "T4-2024", label: "T4 2024 — 145,47", valeur: 145.47 },
  { key: "T3-2024", label: "T3 2024 — 144,51", valeur: 144.51 },
  { key: "T2-2024", label: "T2 2024 — 143,58", valeur: 143.58 },
  { key: "T1-2024", label: "T1 2024 — 143,46", valeur: 143.46 },
  { key: "T4-2023", label: "T4 2023 — 142,06", valeur: 142.06 },
  { key: "T3-2023", label: "T3 2023 — 141,03", valeur: 141.03 },
  { key: "T2-2023", label: "T2 2023 — 140,59", valeur: 140.59 },
  { key: "T1-2023", label: "T1 2023 — 138,61", valeur: 138.61 },
] as const;

const selectClasses =
  "h-10 w-full rounded-lg border border-stone-300 bg-transparent px-3 text-sm text-stone-900 transition-colors outline-none focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20";

export function IrlCalculator() {
  const [loyerActuel, setLoyerActuel] = useState("");
  const [irlReference, setIrlReference] = useState("");
  const [irlNouveau, setIrlNouveau] = useState("T4-2025");

  const referenceEntry = irlEntries.find((e) => e.key === irlReference);
  const nouveauEntry = irlEntries.find((e) => e.key === irlNouveau);
  const loyer = parseFloat(loyerActuel);

  const canCalculate =
    !isNaN(loyer) && loyer > 0 && referenceEntry && nouveauEntry;

  const result = canCalculate
    ? (() => {
        const nouveauLoyer =
          loyer * (nouveauEntry.valeur / referenceEntry.valeur);
        return {
          nouveauLoyer,
          augmentation: nouveauLoyer - loyer,
          pourcentage:
            (nouveauEntry.valeur / referenceEntry.valeur - 1) * 100,
        };
      })()
    : null;

  return (
    <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Calculator className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold text-stone-900">
            Calculer la révision de votre loyer
          </h2>
          <p className="text-sm text-stone-500">
            Renseignez les informations ci-dessous
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="loyer"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Loyer actuel (€)
          </label>
          <input
            id="loyer"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="Ex : 850"
            value={loyerActuel}
            onChange={(e) => setLoyerActuel(e.target.value)}
            className="h-10 w-full rounded-lg border border-stone-300 bg-transparent px-3 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="irl-ref"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            IRL de référence
          </label>
          <select
            id="irl-ref"
            value={irlReference}
            onChange={(e) => setIrlReference(e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>
              Sélectionnez…
            </option>
            {irlEntries.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="irl-new"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Nouvel IRL
          </label>
          <select
            id="irl-new"
            value={irlNouveau}
            onChange={(e) => setIrlNouveau(e.target.value)}
            className={selectClasses}
          >
            {irlEntries.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-8 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-700">
            <TrendingUp className="size-4" />
            Résultat de la révision
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-stone-500">Nouveau loyer</p>
              <p className="text-3xl font-bold text-stone-900">
                {result.nouveauLoyer.toFixed(2)}&nbsp;€
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Augmentation</p>
              <p className="text-xl font-semibold text-stone-700">
                +{result.augmentation.toFixed(2)}&nbsp;€
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Variation</p>
              <p className="text-xl font-semibold text-stone-700">
                {result.pourcentage >= 0 ? "+" : ""}
                {result.pourcentage.toFixed(2)}&nbsp;%
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Calcul : {loyer.toFixed(2)} × ({nouveauEntry!.valeur.toFixed(2)} ÷{" "}
            {referenceEntry!.valeur.toFixed(2)}) ={" "}
            {result.nouveauLoyer.toFixed(2)} €
          </p>
        </div>
      )}
    </div>
  );
}
