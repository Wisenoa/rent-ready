"use client";

import { useState } from "react";
import Link from "next/link";

const RENTAL_TYPES = [
  {
    type: "meuble",
    label: "Location meublée",
    minYears: 1,
    maxYears: 12,
    note: "Bail minimum 1 an, tacite reconduction 1 mois",
    typical: 3,
    fees: { agency: 1, notice: 0.5, renovation: 1.5, ads: 0.3 },
  },
  {
    type: "nu",
    label: "Location nue (vide)",
    minYears: 3,
    maxYears: 12,
    note: "Bail minimum 3 ans, tacite reconduction 2 ans",
    typical: 6,
    fees: { agency: 1, notice: 0.5, renovation: 2, ads: 0.3 },
  },
  {
    type: "mobilite",
    label: "Bail mobilité",
    minYears: 1,
    maxYears: 0,
    note: "1 à 10 mois, non renouvelable, только temporaire",
    typical: 0,
    fees: { agency: 1, notice: 0.5, renovation: 1.5, ads: 0.3 },
  },
];

const FAQ = [
  {
    question: "Quelle est la durée minimale d'un bail de location ?",
    answer:
      "La durée minimale dépend du type de location : 1 an minimum pour une location meublée, 3 ans minimum pour une location nue, et 1 à 10 mois pour un bail mobilité. Le bail ne peut pas êtreinferieur à ces durées légales. En zone tendue, le bail est de 3 ans minimum même pour les meublés.",
  },
  {
    question: "Peut-on romper un bail avant la fin de sa durée ?",
    answer:
      "Oui, le locataire peut rompre le bail à tout moment avec un préavis de 1 mois (meublé) ou 3 mois (nu). Le propriétaire ne peut rompre le bail qu'à son terme (fin de bail) ou pour motifs graves (impayés, troubles de jouissance, vente). Il ne peut pas rompre anticipadamente sans accord du locataire.",
  },
  {
    question: "Quelle différence entre bail de 3 ans et bail de 6 ans ?",
    answer:
      "Le bail de 6 ans (location nue) offre une meilleure sécurité locative et réduit les coûts de turnover. Le bail de 3 ans (meublé ou zone non tendue) offre plus de flexibilité pour le propriétaire qui peut récupérer son bien plus rapidement. La différence principale est la fréquence des renouvellements et donc des coûts associés.",
  },
  {
    question: "Le bail mobilité est-il intéressant pour le propriétaire ?",
    answer:
      "Le bail mobilité est adapté aux locataires en mutation professionnelle ou en formation. Il offre une durée flexible (1-10 mois) mais ne peut pas être renouvelé ni transformé en bail classique. C'est un outil de fidélisation pour certains profils de locataires, mais avec une occupancy plus courte.",
  },
  {
    question: "Comment réduire les coûts de changement de locataire ?",
    answer:
      "Pour réduire les coûts de turnover : (1)，选择优质租户并进行深入背景调查 (2) 提供良好的维护以减少重大维修 (3) 设置明确的租约条款以避免争议 (4) 利用RentReady管理工具跟踪租约到期并提前计划续约或终止。",
  },
];

interface Result {
  type: string;
  minDuration: number;
  recommendedDuration: number;
  annualCost: number;
  turnoverCost: number;
  yearsOccupied: number;
  totalCostPerYear: number;
}

export function DureeBailClient() {
  const [rentalType, setRentalType] = useState("nu");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [expectedYears, setExpectedYears] = useState("6");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent) || 0;
    const years = parseInt(expectedYears) || 6;
    const config = RENTAL_TYPES.find((r) => r.type === rentalType) || RENTAL_TYPES[1];

    if (rent <= 0) return;

    // Avg months between tenants
    const emptyMonths = rentalType === "mobilite" ? 1 : 2;
    // Renovation cost (months of rent)
    const renovationMonths = config.fees.renovation;
    // Agency fees (1 month rent)
    const agencyFees = rent * config.fees.agency;
    // Notice period cost (months)
    const noticeMonths = rentalType === "nu" ? 3 : 1;
    // Ad costs
    const adCosts = rent * config.fees.ads * 3; // 3 ads per search

    const turnoverCost =
      agencyFees +
      rent * (emptyMonths + renovationMonths) +
      adCosts;

    // Cost per year
    const numTurnovers = years / config.typical;
    const totalCost = turnoverCost * numTurnovers;
    const annualCost = totalCost / years;
    const totalCostPerYear = annualCost + rent * 0.02; // 2% management cost

    setResult({
      type: config.label,
      minDuration: config.minYears,
      recommendedDuration: config.typical,
      annualCost: Math.round(annualCost * 100) / 100,
      turnoverCost: Math.round(turnoverCost * 100) / 100,
      yearsOccupied: years,
      totalCostPerYear: Math.round(totalCostPerYear * 100) / 100,
    });
  }

  const selectedType = RENTAL_TYPES.find((r) => r.type === rentalType);

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Type de location</label>
            <div className="space-y-2">
              {RENTAL_TYPES.map((r) => (
                <label key={r.type} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${rentalType === r.type ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:border-stone-300"}`}>
                  <input type="radio" name="rentalType" value={r.type} checked={rentalType === r.type} onChange={(e) => setRentalType(e.target.value)} className="mt-1" />
                  <div>
                    <p className="font-semibold text-stone-800">{r.label}</p>
                    <p className="text-xs text-stone-500">{r.note}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Loyer mensuel (€)</label>
            <input type="number" min="0" step="10" value={monthlyRent} onChange={(e) => { setMonthlyRent(e.target.value); setResult(null); }} placeholder="Ex. : 850" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Horizon d'investissement (années)</label>
            <input type="number" min="1" max="30" value={expectedYears} onChange={(e) => { setExpectedYears(e.target.value); setResult(null); }} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-stone-400 mt-1">Durée prevue avant vente ou changement de stratégie</p>
          </div>
          <button type="button" onClick={calculate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors text-base">
            Analyser la durée optimale
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-indigo-50 border border-indigo-300 rounded-xl p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-indigo-500 mb-1">Durée minimale légale</p>
                <p className="text-4xl font-bold text-indigo-700">
                  {result.minDuration > 0 ? `${result.minDuration} ans` : "1-10 mois"}
                </p>
                <p className="text-sm text-stone-500 mt-1">pour {result.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-indigo-200 pt-4">
                <div className="text-center">
                  <p className="text-xs text-stone-500">Coût par changement (turnover)</p>
                  <p className="text-lg font-bold text-stone-800">{result.turnoverCost.toLocaleString("fr-FR")} €</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-stone-500">Coût annuel moyen</p>
                  <p className="text-lg font-bold text-stone-800">{result.annualCost.toLocaleString("fr-FR")} €</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <h3 className="font-semibold text-stone-800 mb-2">📊 Analyse sur {result.yearsOccupied} ans</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Avec un bail de {result.recommendedDuration} ans ({result.type}), vous auriez environ{" "}
                <strong>{Math.round(result.yearsOccupied / result.recommendedDuration * 10) / 10}</strong> changements de locataire
                sur {result.yearsOccupied} ans, pour un coût total de turnover estimé à{" "}
                <strong>{(result.turnoverCost * result.yearsOccupied / result.recommendedDuration).toLocaleString("fr-FR")} €</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-5">
        <h3 className="font-bold text-stone-800 mb-2">⚖️ Cadre légal des durées de bail</h3>
        <div className="space-y-2 text-sm text-stone-600">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span>Location nue (vide)</span>
            <span className="font-semibold">6 ans minimum</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span>Location meublée (hors zone tendue)</span>
            <span className="font-semibold">1 an minimum</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span>Location meublée (zone tendue)</span>
            <span className="font-semibold">3 ans minimum</span>
          </div>
          <div className="flex justify-between">
            <span>Bail mobilité</span>
            <span className="font-semibold">1 à 10 mois</span>
          </div>
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
        <Link href="/outils/modele-bail" className="text-blue-600 hover:underline">Modèle de bail gratuit →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Gérer mes locations →</Link>
      </div>
    </div>
  );
}
