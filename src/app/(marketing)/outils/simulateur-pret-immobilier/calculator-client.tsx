"use client";

import { useState } from "react";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";

const faqData = [
  {
    question: "Quel taux d'emprunt utiliser pour mon simulation ?",
    answer: "Les taux varient selon votre profil et la durée. En 2024-2025, comptez environ 3.5-4.2% sur 15 ans, 3.8-4.5% sur 20 ans, et 4.0-4.8% sur 25 ans. Consultez votre banquier ou un courtier pour un taux précis.",
  },
  {
    question: "Les frais de notaire sont-ils inclus dans le pret ?",
    answer: "Non, les frais de notaire (environ 7-8% du prix d'achat) et la garantie du prêt ne sont généralement pas financés à 100% par le prêt. Prévoyez un apport personnel correspondant à ces frais.",
  },
  {
    question: "Peut-on déduire les intérêts d'un prêt locatif ?",
    answer: "Oui, dans le cadre du régime réel, les intérêts d'emprunt sont déductibles des revenus locatifs. Cela réduit votre imposition et améliore votre rendement net.",
  },
  {
    question: "Quelle durée choisir pour mon pret immobilier ?",
    answer: "Une durée plus courte = mensualités plus élevées mais intérêts totaux moindres. Une durée plus longue = mensualités basses mais coût total plus élevé. Pour un investissement locatif, 20-25 ans est souvent un bon compromis.",
  },
];

export function SimulateurPretClient() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [rate, setRate] = useState("");
  const [duration, setDuration] = useState("20");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    borrowedAmount: number;
    amortizationSchedule: { month: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  function calculate() {
    const price = parseFloat(purchasePrice);
    const down = parseFloat(downPayment) || 0;
    const annualRate = parseFloat(rate) / 100;
    const years = parseInt(duration);
    if (isNaN(price) || isNaN(annualRate) || isNaN(years) || price <= 0) return;

    const borrowedAmount = price - down;
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = borrowedAmount / numPayments;
    } else {
      monthlyPayment =
        (borrowedAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalCost = monthlyPayment * numPayments;
    const totalInterest = totalCost - borrowedAmount;

    // Generate amortization schedule (yearly for display)
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = borrowedAmount;
    for (let m = 1; m <= numPayments; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: m,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    setResult({ monthlyPayment, totalInterest, totalCost, borrowedAmount, amortizationSchedule: schedule });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-semibold text-stone-700 mb-1">
              Prix d'achat du bien (€)
            </label>
            <input
              id="purchasePrice"
              type="number"
              min="0"
              step="5000"
              placeholder="Ex. : 250000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="downPayment" className="block text-sm font-semibold text-stone-700 mb-1">
              Apport personnel (€)
            </label>
            <input
              id="downPayment"
              type="number"
              min="0"
              step="5000"
              placeholder="Ex. : 50000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rate" className="block text-sm font-semibold text-stone-700 mb-1">
                Taux d'intérêt annuel (%)
              </label>
              <input
                id="rate"
                type="number"
                min="0"
                max="15"
                step="0.1"
                placeholder="Ex. : 4.2"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-stone-700 mb-1">
                Durée (années)
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10 ans</option>
                <option value="15">15 ans</option>
                <option value="20">20 ans</option>
                <option value="25">25 ans</option>
                <option value="30">30 ans</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
          >
            Calculer ma mensualité
          </button>

          {result && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-4">
                Résultat de la simulation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Montant emprunté</span>
                  <span className="text-xl font-bold text-stone-800">
                    {result.borrowedAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Mensualité</span>
                  <span className="text-3xl font-bold text-green-700">
                    {result.monthlyPayment.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Intérêts totaux</span>
                  <span className="text-xl font-bold text-stone-800">
                    {result.totalInterest.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-green-200 pt-3 mt-3">
                  <span className="text-stone-600 font-semibold">Coût total du crédit</span>
                  <span className="text-xl font-bold text-stone-800">
                    {result.totalCost.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Amortization Table */}
      {result && (
        <div className="bg-white rounded-2xl shadow border border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Tableau d'amortissement (par année)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 px-3 font-semibold text-stone-600">Année</th>
                  <th className="text-right py-2 px-3 font-semibold text-stone-600">Capital remboursé</th>
                  <th className="text-right py-2 px-3 font-semibold text-stone-600">Intérêts</th>
                  <th className="text-right py-2 px-3 font-semibold text-stone-600">Capital restant dû</th>
                </tr>
              </thead>
              <tbody>
                {[1, 5, 10, 15, 20, 25, 30].filter(y => y <= parseInt(duration)).map((year) => {
                  const entries = result.amortizationSchedule.filter(e => e.month >= (year - 1) * 12 + 1 && e.month <= year * 12);
                  const principal = entries.reduce((s, e) => s + e.principal, 0);
                  const interest = entries.reduce((s, e) => s + e.interest, 0);
                  const lastEntry = entries[entries.length - 1];
                  return (
                    <tr key={year} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-2 px-3 font-semibold text-stone-800">Année {year}</td>
                      <td className="py-2 px-3 text-right font-mono text-stone-700">
                        {principal.toLocaleString("fr-FR")} €
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-stone-700">
                        {interest.toLocaleString("fr-FR")} €
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-stone-700">
                        {lastEntry?.balance.toLocaleString("fr-FR")} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-6">Questions fréquentes</h2>
        <div className="space-y-5">
          {faqData.map((item, i) => (
            <div key={i} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
              <p className="text-stone-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/outils/calculateur-rendement" className="text-blue-600 hover:underline">Calculateur rendement locatif →</Link>
        <Link href="/modeles" className="text-blue-600 hover:underline">Modèles de bail gratuits →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
