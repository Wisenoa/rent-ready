"use client";

import { useState } from "react";
import Link from "next/link";

// IRL historical data from INSEE
const IRL_HISTORY = [
  { quarter: "T4-2025", value: 145.78, label: "T4 2025" },
  { quarter: "T3-2025", value: 145.49, label: "T3 2025" },
  { quarter: "T2-2025", value: 145.34, label: "T2 2025" },
  { quarter: "T1-2025", value: 145.17, label: "T1 2025" },
  { quarter: "T4-2024", value: 144.89, label: "T4 2024" },
  { quarter: "T3-2024", value: 144.51, label: "T3 2024" },
  { quarter: "T2-2024", value: 144.21, label: "T2 2024" },
  { quarter: "T1-2024", value: 143.46, label: "T1 2024" },
  { quarter: "T4-2023", value: 142.06, label: "T4 2023" },
  { quarter: "T3-2023", value: 141.03, label: "T3 2023" },
  { quarter: "T2-2023", value: 140.59, label: "T2 2023" },
  { quarter: "T1-2023", value: 138.61, label: "T1 2023" },
];

const FAQ = [
  {
    question: "Quelle est la formule légale pour augmenter un loyer ?",
    answer:
      "La formule est : Nouveau loyer = Loyer actuel × (Nouvel IRL / Ancien IRL). L'augmentation ne peut pas dépasser la variation de l'IRL sur la période. En zone tendue, l'augmentation est encadrée : elle ne peut pas dépasser la variation IRL sauf exceptions (travaux lourds, relocation après-decoration).",
  },
  {
    question: "Quand peut-on augmenter le loyer d'un locataire ?",
    answer:
      "L'augmentation ne peut intervenir qu'une fois par an, à la date anniversaire du bail. Le bailleur doit informer le locataire au moins 1 mois avant la date d'application (3 mois en cas de hausse). La clause d'indexation doit être prévue dans le bail.",
  },
  {
    question: "Qu'est-ce que l'IRL et où le trouver ?",
    answer:
      "L'Indice de Référence des Loyers (IRL) est publié trimestriellement par l'INSEE. Il reflète l'évolution des prix à la consommation hors tabac et loyer. Vous pouvez le consulter sur insee.fr ou utiliser notre calculateur qui intègre l'historique.",
  },
  {
    question: "L'augmentation de loyer est-elle obligatoire ?",
    answer:
      "Non, l'indexation du loyer est une option. Le bail peut prévoir ou non une clause d'indexation. Si elle existe, le bailleur peut l'appliquer ou choisir de ne pas le faire. En zone tendue, si le loyer est inférieur au loyer de référence minoré, le bailleur peut hausser le loyer dans certaines limites.",
  },
  {
    question: "Le locataire peut-il refuser une augmentation légale ?",
    answer:
      "Si l'augmentation respecte la formule légale et les délais de préavis, le locataire ne peut pas la refuser. En cas de désaccord, le locataire peut saisir la commission de conciliation. Si le bail ne contient pas de clause d'indexation, aucune augmentation fondée sur l'IRL n'est possible.",
  },
];

interface CalculationResult {
  currentRent: number;
  newRent: number;
  difference: number;
  percentageChange: number;
  oldIrl: string;
  newIrl: string;
  oldIrlValue: number;
  newIrlValue: number;
  isAboveLimit: boolean;
  maxAllowedRent: number;
}

export function AugmentationLoyerClient() {
  const [currentRent, setCurrentRent] = useState("");
  const [oldIrlQuarter, setOldIrlQuarter] = useState("T4-2024");
  const [newIrlQuarter, setNewIrlQuarter] = useState("T4-2025");
  const [result, setResult] = useState<CalculationResult | null>(null);

  function calculate() {
    const rent = parseFloat(currentRent);
    if (isNaN(rent) || rent <= 0) return;

    const oldEntry = IRL_HISTORY.find((e) => e.quarter === oldIrlQuarter);
    const newEntry = IRL_HISTORY.find((e) => e.quarter === newIrlQuarter);
    if (!oldEntry || !newEntry) return;

    const ratio = newEntry.value / oldEntry.value;
    const newRent = Math.round(rent * ratio * 100) / 100;
    const difference = Math.round((newRent - rent) * 100) / 100;
    const percentageChange = Math.round((ratio - 1) * 10000) / 100;

    setResult({
      currentRent: rent,
      newRent,
      difference,
      percentageChange,
      oldIrl: oldEntry.label,
      newIrl: newEntry.label,
      oldIrlValue: oldEntry.value,
      newIrlValue: newEntry.value,
      isAboveLimit: false,
      maxAllowedRent: newRent,
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres de calcul</h2>

        <div className="space-y-5">
          {/* Current Rent */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Loyer actuel hors charges (€ / mois)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={currentRent}
              onChange={(e) => {
                setCurrentRent(e.target.value);
                setResult(null);
              }}
              placeholder="Ex. : 850"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Old IRL */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              IRL de référence (date de signature ou dernière révision)
            </label>
            <select
              value={oldIrlQuarter}
              onChange={(e) => {
                setOldIrlQuarter(e.target.value);
                setResult(null);
              }}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {IRL_HISTORY.map((entry) => (
                <option key={entry.quarter} value={entry.quarter}>
                  {entry.label} — IRL : {entry.value}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mt-1">
              Trimestre utilisé dans votre bail pour l'indexation
            </p>
          </div>

          {/* New IRL */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Nouvel IRL applicable (dernier trimestre en vigueur)
            </label>
            <select
              value={newIrlQuarter}
              onChange={(e) => {
                setNewIrlQuarter(e.target.value);
                setResult(null);
              }}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {IRL_HISTORY.map((entry) => (
                <option key={entry.quarter} value={entry.quarter}>
                  {entry.label} — IRL : {entry.value}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mt-1">
              Dernier IRL publié par l'INSEE ({IRL_HISTORY[0].label})
            </p>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-base"
          >
            Calculer l'augmentation
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-stone-500 mb-1">Nouveau loyer après révision IRL</p>
              <p className="text-4xl font-bold text-green-700">{result.newRent.toLocaleString("fr-FR")} €</p>
              <p className="text-stone-500 text-sm mt-1">par mois (hors charges)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-green-200 pt-4">
              <div className="text-center">
                <p className="text-xs text-stone-500">Augmentation</p>
                <p className="text-lg font-bold text-green-700">+{result.difference.toLocaleString("fr-FR")} €</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-stone-500">Variation IRL</p>
                <p className="text-lg font-bold text-green-700">+{result.percentageChange}%</p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-3">
              <p className="text-xs text-stone-500 mb-1">Formule appliquée</p>
              <p className="text-sm font-mono text-stone-700">
                {result.currentRent.toLocaleString("fr-FR")} € × ({result.newIrlValue} / {result.oldIrlValue}) = {result.newRent.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-semibold">IRL de référence : {result.oldIrl}</p>
              <p className="text-xs text-blue-700 font-semibold">Nouvel IRL : {result.newIrl}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">📋 Règles à connaître</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ La révision ne peut avoir lieu qu'une fois par an (date anniversaire du bail)</li>
          <li>✅ Le locataire doit être averti au moins 1 mois avant l'application</li>
          <li>✅ La clause d'indexation doit être présente dans le bail pour être applicable</li>
          <li>✅ En zone tendue, l'augmentation est plafonnée à la variation IRL sauf exceptions</li>
          <li>✅ L'IRL est publié par l'INSEE chaque trimestre (janvier, avril, juillet, octobre)</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-6">Questions fréquentes</h2>
        <div className="space-y-5">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
              <p className="text-stone-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Links */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/outils/calculateur-revision-irl" className="text-blue-600 hover:underline">Calculateur Révision IRL →</Link>
        <Link href="/guides/irl-2026" className="text-blue-600 hover:underline">Guide IRL 2026 →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
