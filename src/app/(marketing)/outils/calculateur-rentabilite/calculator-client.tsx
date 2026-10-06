"use client";

import { useState } from "react";
import Link from "next/link";

const BENCHMARKS = [
  { city: "Paris", netYield: "2.5–3.5%", note: "marché tendu, prix élevés" },
  { city: "Lyon", netYield: "3.5–4.5%", note: "bonne liquidité" },
  { city: "Bordeaux", netYield: "3.0–4.0%", note: "en baisse depuis 2022" },
  { city: "Marseille", netYield: "4.0–6.0%", note: "rendement supérieur, tension modérée" },
  { city: "Toulouse", netYield: "3.5–4.5%", note: "forte demande locative" },
  { city: "Lille", netYield: "3.5–5.0%", note: "forte demande locative" },
  { city: "Province moyenne", netYield: "4.0–7.0%", note: "plus accessible, frais moindres" },
];

const FAQ = [
  {
    question: "Quelle est la différence entre rendement brut et rendement net ?",
    answer:
      "Le rendement brut = (loyer mensuel × 12) / prix d'achat × 100. Il ne tient pas compte des charges. Le rendement net = (loyer annuel - charges) / prix d'achat × 100. Il est plus réaliste car il déduit les charges de propriété (taxe foncière, assurance, gestion, travaux).",
  },
  {
    question: "Qu'est-ce qu'un bon rendement locatif en France ?",
    answer:
      "Cela dépend de la ville. En province, un bon rendement net se situe entre 4% et 7%. À Paris, il est plutôt entre 2.5% et 3.5% en raison des prix élevés. Un rendement net supérieur à 5% est généralement considéré comme intéressant.",
  },
  {
    question: "Quelles charges sont déductibles du rendement ?",
    answer:
      "Les principales charges déductibles : taxe foncière, assurance PNO (Propriétaire Non Occupant), frais de gestion (environ 8-10% du loyer), charges de copropriété non récupérables, intérêts d'emprunt, et travaux de réparation/entretien.",
  },
  {
    question: "Faut-il inclure la vacance locative dans le calcul ?",
    answer:
      "Oui, c'est recommandé. Notre calculateur applique un taux de vacance (par défaut 8%) qui réduit le loyer annuel effectif. Cela donne une image plus réaliste du rendement attendu sur l'année.",
  },
  {
    question: "Le rendement locatif est-il le seul critère à considérer ?",
    answer:
      "Non. Laplus-value potentielle, la fiscalite (micro-BIC, réel, LMNP), la tension du marché locatif, et les frais de gestion future sont autant d'éléments à prendre en compte. Un rendement plus faible à Paris peut être compensé par une forte appreciation.",
  },
];

interface Result {
  grossYield: number;
  netYield: number;
  annualNetRent: number;
  effectiveAnnualRent: number;
  totalInvestment: number;
}

function getYieldLabel(yield_: number): string {
  if (yield_ >= 7) return "Excellent";
  if (yield_ >= 5) return "Bon";
  if (yield_ >= 3) return "Moyen";
  return "Faible";
}

function getYieldColor(yield_: number): string {
  if (yield_ >= 7) return "text-green-700 bg-green-50 border-green-300";
  if (yield_ >= 5) return "text-blue-700 bg-blue-50 border-blue-300";
  if (yield_ >= 3) return "text-orange-700 bg-orange-50 border-orange-300";
  return "text-red-700 bg-red-50 border-red-300";
}

export function RentabiliteClient() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notaryFees, setNotaryFees] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [annualCharges, setAnnualCharges] = useState("");
  const [vacancyRate, setVacancyRate] = useState("8");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const price = parseFloat(purchasePrice);
    const notary = parseFloat(notaryFees) || price * 0.08;
    const rent = parseFloat(monthlyRent);
    const charges = parseFloat(annualCharges) || 0;
    const vacancy = parseFloat(vacancyRate) || 0;

    if (isNaN(price) || isNaN(rent) || price <= 0 || rent <= 0) return;

    const totalInvestment = price + notary;
    const annualRent = rent * 12;
    const effectiveRent = annualRent * (1 - vacancy / 100);
    const annualNetRent = effectiveRent - charges;
    const grossYield = (annualRent / totalInvestment) * 100;
    const netYield = (annualNetRent / totalInvestment) * 100;

    setResult({
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      annualNetRent: Math.round(annualNetRent * 100) / 100,
      effectiveAnnualRent: Math.round(effectiveRent * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres de l'investissement</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Prix d'achat du bien (€)</label>
            <input type="number" min="0" step="5000" value={purchasePrice} onChange={(e) => { setPurchasePrice(e.target.value); setResult(null); }} placeholder="Ex. : 200000" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Frais de notaire (€) <span className="text-stone-400 font-normal">(défaut : 8% du prix)</span></label>
            <input type="number" min="0" step="500" value={notaryFees} onChange={(e) => { setNotaryFees(e.target.value); setResult(null); }} placeholder="Ex. : 16000" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Loyer mensuel estimé (€ / mois)</label>
            <input type="number" min="0" step="10" value={monthlyRent} onChange={(e) => { setMonthlyRent(e.target.value); setResult(null); }} placeholder="Ex. : 900" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Charges annuelles (€) <span className="text-stone-400 font-normal">(taxe foncière, assurance, gestion...)</span></label>
            <input type="number" min="0" step="100" value={annualCharges} onChange={(e) => { setAnnualCharges(e.target.value); setResult(null); }} placeholder="Ex. : 2400" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Taux de vacance locative (%) <span className="text-stone-400 font-normal">(défaut : 8%)</span></label>
            <input type="number" min="0" max="100" step="1" value={vacancyRate} onChange={(e) => { setVacancyRate(e.target.value); setResult(null); }} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="button" onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-base">
            Calculer la rentabilité
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className={`border rounded-xl p-6 ${getYieldColor(result.netYield)}`}>
              <div className="text-center mb-4">
                <p className="text-sm opacity-70 mb-1">Rendement net</p>
                <p className="text-5xl font-bold">{result.netYield.toFixed(2)}%</p>
                <p className="text-sm mt-1 opacity-80">Rendement {getYieldLabel(result.netYield)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-current border-opacity-20 pt-4">
                <div className="text-center">
                  <p className="text-xs opacity-70">Rendement brut</p>
                  <p className="text-xl font-bold">{result.grossYield.toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-70">Loyer net effectif / an</p>
                  <p className="text-xl font-bold">{result.effectiveAnnualRent.toLocaleString("fr-FR")} €</p>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Investissement total : <strong>{result.totalInvestment.toLocaleString("fr-FR")} €</strong> (prix d'achat + frais de notaire)</p>
              <p className="text-xs text-stone-500">Revenu net annuel : <strong>{result.annualNetRent.toLocaleString("fr-FR")} €</strong> après charges et vacance</p>
            </div>
          </div>
        )}
      </div>

      {/* Benchmarks */}
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-4">Benchmarks par ville</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENCHMARKS.map((b) => (
            <div key={b.city} className="bg-stone-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-800">{b.city}</span>
                <span className="text-sm font-bold text-green-700">{b.netYield}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">{b.note}</p>
            </div>
          ))}
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
        <Link href="/outils/calculateur-rendement-locatif" className="text-blue-600 hover:underline">Calculateur rendement locatif →</Link>
        <Link href="/guides" className="text-blue-600 hover:underline">Guide fiscal LMNP →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
