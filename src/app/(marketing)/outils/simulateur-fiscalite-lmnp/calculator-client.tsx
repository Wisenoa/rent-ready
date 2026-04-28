"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ = [
  {
    question: "Qu'est-ce que le statut LMNP ?",
    answer: "Le Loueur Meublé Non Professionnel (LMNP) est un statut fiscal qui permet de louer un bien meublé tout en bénéficiant d'avantages fiscaux. Vous devez louer un bien équipé de tous les éléments mobiliers nécessaires à la vie quotidienne.",
  },
  {
    question: "Quelle est la différence entre micro-BIC et régime réel ?",
    answer: "Le micro-BIC applique un abattement forfaitaire de 50% (71% pour les locations meublées de tourisme) sur vos revenus locatifs. Le régime réel vous permet de déduire vos charges réelles (intérêts, taxe foncière, assurance, charges de copropriété) et d'amortir le bien sur 20-30 ans.",
  },
  {
    question: "Quand le régime réel est-il plus avantageux que le micro-BIC ?",
    answer: "Le régime réel est généralement plus avantageux quand vos charges déductibles dépassent 50% du loyer (ou 71% pour les meublés de tourisme). C'est souvent le cas pour les biens financés à crédit, avec une taxe foncière élevée ou des charges de copropriété importantes.",
  },
  {
    question: "Qu'est-ce que l'amortissement en LMNP ?",
    answer: "L'amortissement permet de déduire chaque année une partie de la valeur du bien (hors terrain) sur 20-25 ans. Cette déduction n'impacte pas votre trésorerie mais réduit votre imposition. Elle n'est possible que sous le régime réel.",
  },
];

export function SimulateurLmnpClient() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [annualCharges, setAnnualCharges] = useState("");
  const [propertyTax, setPropertyTax] = useState("");
  const [insurance, setInsurance] = useState("");
  const [managementFees, setManagementFees] = useState("");
  const [interestPayments, setInterestPayments] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [taxBracket, setTaxBracket] = useState("11");
  const [result, setResult] = useState<{
    grossRent: number;
    microBIC: { taxableIncome: number; tax: number };
    realRegime: { taxableIncome: number; tax: number; amortization: number };
    bestRegime: "micro" | "real" | "equal";
    yearlyAmortization: number;
    totalDeduction: number;
  } | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent) || 0;
    const charges = parseFloat(annualCharges) || 0;
    const tax = parseFloat(propertyTax) || 0;
    const insuranceAmount = parseFloat(insurance) || 0;
    const management = parseFloat(managementFees) || 0;
    const interest = parseFloat(interestPayments) || 0;
    const price = parseFloat(purchasePrice) || 0;
    const bracket = parseFloat(taxBracket) / 100;

    const grossRent = rent * 12;

    // Micro-BIC (50% abatement for residential furnished)
    const microAbatement = grossRent * 0.50;
    const microTaxableIncome = grossRent - microAbatement;
    const microTax = microTaxableIncome * bracket + microTaxableIncome * 0.172; // IR + PS

    // Real regime
    const totalCharges = charges + tax + insuranceAmount + management + interest;
    // Amortization: building is ~80-85% of price, amortized over 25 years
    const buildingValue = price * 0.85;
    const yearlyAmortization = buildingValue / 25;
    const amortizedInterest = Math.min(interest, yearlyAmortization); // interest first, then amortization
    const realTaxableIncome = Math.max(0, grossRent - totalCharges - yearlyAmortization);
    const realTax = realTaxableIncome * bracket + Math.max(0, grossRent - totalCharges) * 0.172;

    const bestRegime = Math.abs(microTax - realTax) < 10 ? "equal"
      : microTax < realTax ? "micro" : "real";

    setResult({
      grossRent,
      microBIC: { taxableIncome: microTaxableIncome, tax: microTax },
      realRegime: { taxableIncome: realTaxableIncome, tax: realTax, amortization: yearlyAmortization },
      bestRegime,
      yearlyAmortization,
      totalDeduction: totalCharges + yearlyAmortization,
    });
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="monthlyRent" className="block text-sm font-semibold text-stone-700 mb-1">
              Loyer mensuel hors charges (€)
            </label>
            <input
              id="monthlyRent"
              type="number"
              min="0"
              step="10"
              placeholder="Ex. : 800"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="annualCharges" className="block text-sm font-semibold text-stone-700 mb-1">
                Charges annuelles non récupérables (€)
              </label>
              <input
                id="annualCharges"
                type="number"
                min="0"
                step="100"
                placeholder="Ex. : 800"
                value={annualCharges}
                onChange={(e) => setAnnualCharges(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="propertyTax" className="block text-sm font-semibold text-stone-700 mb-1">
                Taxe foncière (€)
              </label>
              <input
                id="propertyTax"
                type="number"
                min="0"
                step="100"
                placeholder="Ex. : 1200"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="insurance" className="block text-sm font-semibold text-stone-700 mb-1">
                Assurance PNO (€)
              </label>
              <input
                id="insurance"
                type="number"
                min="0"
                step="50"
                placeholder="Ex. : 300"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="managementFees" className="block text-sm font-semibold text-stone-700 mb-1">
                Frais de gestion (€)
              </label>
              <input
                id="managementFees"
                type="number"
                min="0"
                step="50"
                placeholder="Ex. : 600"
                value={managementFees}
                onChange={(e) => setManagementFees(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="interestPayments" className="block text-sm font-semibold text-stone-700 mb-1">
                Intérêts d'emprunt annuels (€)
              </label>
              <input
                id="interestPayments"
                type="number"
                min="0"
                step="100"
                placeholder="Ex. : 3000"
                value={interestPayments}
                onChange={(e) => setInterestPayments(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-semibold text-stone-700 mb-1">
                Prix d'achat du bien (€) — pour amortissement
              </label>
              <input
                id="purchasePrice"
                type="number"
                min="0"
                step="5000"
                placeholder="Ex. : 200000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="taxBracket" className="block text-sm font-semibold text-stone-700 mb-1">
              Taux marginal d'imposition (IR)
            </label>
            <select
              id="taxBracket"
              value={taxBracket}
              onChange={(e) => setTaxBracket(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">0% (première tranche)</option>
              <option value="11">11% (deuxième tranche)</option>
              <option value="30">30% (troisième tranche)</option>
              <option value="41">41% (quatrième tranche)</option>
              <option value="45">45% (cinquième tranche)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
          >
            Calculer ma fiscalite LMNP
          </button>

          {result && (
            <div className="space-y-4">
              {/* Best regime badge */}
              <div className={`rounded-xl p-4 text-center ${result.bestRegime === "micro" ? "bg-blue-50 border border-blue-300" : result.bestRegime === "real" ? "bg-green-50 border border-green-300" : "bg-stone-100 border border-stone-300"}`}>
                <p className="font-bold text-lg">
                  {result.bestRegime === "micro" ? "📊 Le régime micro-BIC est plus avantageux" :
                   result.bestRegime === "real" ? "✅ Le régime réel est plus avantageux" :
                   "⚖️ Les deux régimes sont equivalents"}
                </p>
                <p className="text-sm text-stone-600 mt-1">
                  Économie estimée : <strong>{Math.abs(result.microBIC.tax - result.realRegime.tax).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}/an</strong>
                </p>
              </div>

              {/* Micro-BIC */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                <h3 className="font-bold text-stone-800 mb-3">📊 Régime micro-BIC (abattement 50%)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Loyer annuel</span>
                    <span className="font-semibold">{result.grossRent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Abattement forfaitaire (50%)</span>
                    <span className="text-red-600">-{(result.grossRent * 0.50).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2">
                    <span className="text-stone-600">Revenu imposable</span>
                    <span className="font-semibold">{result.microBIC.taxableIncome.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2">
                    <span className="text-stone-600 font-bold">Imposition totale</span>
                    <span className="font-bold text-red-700 text-lg">{result.microBIC.tax.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                </div>
              </div>

              {/* Real regime */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-800 mb-3">📊 Régime réel (amortissement)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Loyer annuel</span>
                    <span className="font-semibold">{result.grossRent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Charges déductibles</span>
                    <span className="text-red-600">
                      -{parseFloat(annualCharges || "0") + parseFloat(propertyTax || "0") + parseFloat(insurance || "0") + parseFloat(managementFees || "0") + parseFloat(interestPayments || "0") <= 0
                        ? "0"
                        : (parseFloat(annualCharges) + parseFloat(propertyTax) + parseFloat(insurance) + parseFloat(managementFees) + parseFloat(interestPayments)).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Amortissement (25 ans)</span>
                    <span className="text-blue-600">-{result.yearlyAmortization.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-stone-600">Revenu imposable</span>
                    <span className="font-semibold">{result.realRegime.taxableIncome.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-stone-600 font-bold">Imposition totale</span>
                    <span className="font-bold text-red-700 text-lg">{result.realRegime.tax.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                  </div>
                </div>
                <div className="mt-3 bg-green-100 rounded-lg p-3 text-sm">
                  <p className="text-green-800">
                    💡 <strong>Déductions totales : {result.totalDeduction.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}/an</strong>
                    <br />
                    <span className="text-green-700">L'amortissement de {result.yearlyAmortization.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} ne réduit pas votre trésorerie mais diminue votre impôt.</span>
                  </p>
                </div>
              </div>
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
        <Link href="/modeles" className="text-blue-600 hover:underline">Modèles de bail →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
