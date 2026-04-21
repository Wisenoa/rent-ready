"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ = [
  {
    question: "La plus-value de ma résidence principale est-elle taxée ?",
    answer: "Non, la vente de votre résidence principale est totalement exonérée de plus-value immobilière. C'est l'un des avantages fiscaux les plus importants en France.",
  },
  {
    question: "Comment fonctionne l'abattement pour durée de détention ?",
    answer: "Pour une vente après 5 ans de détention, un abattement de 6% par an s'applique chaque année de la 6e à la 21e année. Après 22 ans, l'exonération est totale pour l'impôt sur le revenu. Pour les prélèvements sociaux, l'exonération totale intervient après 30 ans.",
  },
  {
    question: "Puis-je déduire les travaux de la plus-value ?",
    answer: "Oui, vous pouvez ajouter au prix d'achat : les travaux de construction, reconstruction, extension ou amélioration (si non déjà déductibles), les frais de voirie, et les frais d'acquisition (droits de mutation, honoraires).",
  },
  {
    question: "Quel taux s'applique sur la plus-value imposable ?",
    answer: "L'impôt sur le revenu est actuellement au taux de 19%. Les prélèvements sociaux (CSG, CRDS) s'appliquent au taux de 17.2%. Une surtaxe peut s'appliquer pour les plus-values supérieures à 50 000 €.",
  },
];

export function PlusValueClient() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("2018");
  const [worksAmount, setWorksAmount] = useState("");
  const [isPrimaryResidence, setIsPrimaryResidence] = useState(false);
  const [result, setResult] = useState<{
    grossPlusValue: number;
    taxablePlusValue: number;
    irTax: number;
    socialTax: number;
    totalTax: number;
    netPlusValue: number;
    yearsHeld: number;
  } | null>(null);

  function calculate() {
    const buy = parseFloat(purchasePrice);
    const sell = parseFloat(salePrice);
    const works = parseFloat(worksAmount) || 0;
    if (isNaN(buy) || isNaN(sell) || buy <= 0) return;

    const grossPlusValue = sell - buy - works;
    if (grossPlusValue <= 0) {
      setResult({
        grossPlusValue,
        taxablePlusValue: 0,
        irTax: 0,
        socialTax: 0,
        totalTax: 0,
        netPlusValue: 0,
        yearsHeld: new Date().getFullYear() - parseInt(acquisitionDate),
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const yearsHeld = currentYear - parseInt(acquisitionDate);

    // For secondary residence: no abatement before year 6
    // Year 6-21: 6% per year for IR, 1.65% per year for PS
    // Year 22+: 4% per year for IR, 0% for PS (after 30 years PS is 0)
    // Actually: after 22 years, IR is fully abated (6% × 16 = 96%, then 4% for year 22 = 100%)
    // For PS: 1.65% × 22 = 36.3%, then 1.875% × 8 = 15%, total ~51.3% after 30 years = 100%

    let irAbatement = 0;
    let psAbatement = 0;
    const years = yearsHeld;

    if (years >= 22) {
      irAbatement = 100;
    } else if (years > 5) {
      irAbatement = Math.min(100, (years - 5) * 6);
    }

    if (years >= 30) {
      psAbatement = 100;
    } else if (years > 5) {
      psAbatement = Math.min(100, (years - 5) * 1.65 + 6 * (Math.max(0, years - 22) * 0.75));
    }

    const taxablePlusValue = grossPlusValue * (1 - irAbatement / 100);
    const irTax = taxablePlusValue * 0.19;
    const psTax = grossPlusValue * (1 - psAbatement / 100) * 0.172;
    const totalTax = irTax + psTax;
    const netPlusValue = grossPlusValue - totalTax;

    setResult({ grossPlusValue, taxablePlusValue, irTax, socialTax: psTax, totalTax, netPlusValue, yearsHeld });
  }

  if (isPrimaryResidence) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="text-center py-8">
          <span className="text-5xl mb-4 block">🏠</span>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">Exonération résidence principale</h2>
          <p className="text-stone-600 max-w-lg mx-auto">
            La vente de votre résidence principale est <strong>totalement exonérée de plus-value immobilière</strong>. Vous n'avez aucun impôt à payer sur la plus-value.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span>✅</span> Plus-value nette : <strong>0 €</strong> — Exonéré
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-4">
            <input
              id="isPrimary"
              type="checkbox"
              checked={isPrimaryResidence}
              onChange={(e) => setIsPrimaryResidence(e.target.checked)}
              className="w-5 h-5 accent-blue-600"
            />
            <label htmlFor="isPrimary" className="text-sm font-semibold text-stone-700">
              Ce bien est ma résidence principale (vente avec exonération totale)
            </label>
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-semibold text-stone-700 mb-1">
              Prix d'achat initial (€)
            </label>
            <input
              id="purchasePrice"
              type="number"
              min="0"
              step="5000"
              placeholder="Ex. : 200000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="salePrice" className="block text-sm font-semibold text-stone-700 mb-1">
              Prix de vente (€)
            </label>
            <input
              id="salePrice"
              type="number"
              min="0"
              step="5000"
              placeholder="Ex. : 300000"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="acquisitionDate" className="block text-sm font-semibold text-stone-700 mb-1">
              Année d'acquisition
            </label>
            <select
              id="acquisitionDate"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="worksAmount" className="block text-sm font-semibold text-stone-700 mb-1">
              Montant des travaux déductibles (€) — optionnel
            </label>
            <input
              id="worksAmount"
              type="number"
              min="0"
              step="1000"
              placeholder="Ex. : 20000"
              value={worksAmount}
              onChange={(e) => setWorksAmount(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-stone-400 mt-1">
              Travaux de construction, reconstruction, extension ou amélioration (non déjà déductibles).
            </p>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
          >
            Calculer ma plus-value
          </button>

          {result && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-stone-600">Plus-value brute</span>
                  <span className="text-xl font-bold text-stone-800">
                    {result.grossPlusValue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-stone-600">Durée de détention</span>
                  <span className="text-xl font-bold text-stone-800">{result.yearsHeld} ans</span>
                </div>
                <div className="flex justify-between items-center border-t border-stone-200 pt-3 mb-3">
                  <span className="text-stone-600">Abattement appliqué (IR)</span>
                  <span className="font-semibold text-green-700">
                    {result.yearsHeld < 6 ? "0%" : `${Math.min(100, (result.yearsHeld - 5) * 6)}%`}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-3">Impôts à payer</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Impôt sur le revenu (19%)</span>
                    <span className="font-bold text-red-700">
                      {result.irTax.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Prélèvements sociaux (17.2%)</span>
                    <span className="font-bold text-red-700">
                      {result.socialTax.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2 mt-2">
                    <span className="text-stone-600 font-semibold">Total impôts</span>
                    <span className="font-bold text-red-800 text-lg">
                      {result.totalTax.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 font-semibold">Plus-value NETTE</span>
                  <span className="text-2xl font-bold text-green-700">
                    {result.netPlusValue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </div>

              {result.yearsHeld >= 22 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-700 text-sm">
                    🎉 Après 22 ans de détention, vous êtes <strong>totalement exonéré d'impôt sur le revenu</strong> (reste CSG/CRDS après 30 ans).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
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

      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/outils/calculateur-rendement" className="text-blue-600 hover:underline">Calculateur rendement →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
