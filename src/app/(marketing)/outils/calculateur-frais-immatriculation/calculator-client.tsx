"use client";

import { useState } from "react";
import Link from "next/link";

const DEPARTEMENTS_TAUX = {
  "01 - Ain": 4.5, "03 - Allier": 4.5, "07 - Ardèche": 4.5, "15 - Cantal": 4.5,
  "21 - Côte-d'Or": 4.5, "26 - Drôme": 4.5, "36 - Indre": 4.5, "42 - Loire": 4.5,
  "43 - Haute-Loire": 4.5, "58 - Nièvre": 4.5, "63 - Puy-de-Dôme": 4.5, "69 - Rhône": 4.5,
  "71 - Saône-et-Loire": 4.5, "79 - Deux-Sèvres": 4.5, "86 - Vienne": 4.5, "87 - Haute-Vienne": 4.5,
  "89 - Yonne": 4.5, "18 - Cher": 5.0, "23 - Creuse": 5.0, "37 - Indre-et-Loire": 5.0,
  "41 - Loir-et-Cher": 5.0, "45 - Loiret": 5.0, "72 - Sarthe": 5.0, "85 - Vendée": 5.0,
  default: 5.0,
};

function getNotaryEmoluments(priceHT: number): number {
  const brackets = [
    { upTo: 6500, rate: 0, fixed: 0 },
    { upTo: 17000, rate: 1.265, fixed: 15.74 },
    { upTo: 60000, rate: 0.687, fixed: 147.34 },
    { upTo: Number.MAX_VALUE, rate: 0.494, fixed: 442.78 },
  ];
  let emoluments = 0;
  let remaining = priceHT;
  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const portion = Math.min(remaining, bracket.upTo - (bracket.upTo === 6500 ? 0 : brackets[brackets.indexOf(bracket) - 1]?.upTo || 0));
    emoluments = bracket.fixed + portion * (bracket.rate / 100);
    remaining -= portion;
  }
  return Math.max(emoluments, 15.74);
}

const FAQ = [
  {
    question: "Que comprennent les frais de notaire (frais de mutation) ?",
    answer:
      "Les frais de notaire se décomposent en 3 parties : (1) Les droits de mutation (taxe de publicité foncière + taxe additionnelle) : environ 4.5% à 5.5% selon le département, (2) Les émoluments du notaire : réglementés par l'État, environ 0.8% à 1% du prix, (3) Les frais de gestion et débours : environ 5% des droits de mutation. Au total, comptez 7% à 9% du prix d'achat pour un ancien, 2% à 3% pour un neuf (TVA réduite).",
  },
  {
    question: "Comment calculer les droits de mutation dans mon département ?",
    answer:
      "Les droits de mutation sont composés de : la taxe de publicité foncière (0.715% à 1.2%), la taxe additionnelle (1.2% à 1.4%), et des frais de gestion (2.5%). Le taux total varie selon les départements entre 4.5% et 5.5%. Par exemple, à Paris (75) le taux est de 5.5%, dans le Rhône (69) il est de 4.5%. Consultez le tableau des taux par département pour une estimation précise.",
  },
  {
    question: "Les frais de notaire sont-ils négociables ?",
    answer:
      "Les émoluments du notaire sont réglementés par l'État et ne sont pas négociables. Cependant, depuis 2016, les notaires peuvent consentir une remise de 10% sur leurs émoluments pour des opérations supérieures à 150 000 €. Les frais de gestion et les droits de mutation ne sont pas négociables non plus. Au total, seuls 10 à 15% des frais de notaire sont potentiellement réducibles.",
  },
  {
    question: "Peut-on obtenir une exonération de frais de mutation ?",
    answer:
      "Oui, dans certains cas : (1) Première maison : dans les zones prioritaires, un dispositif Pinel ou PTZ peut réduire les frais, (2) Donation : les droits de donation sont Calculés avec un abattement de 100 000 € par parent/enfant tous les 15 ans, (3) Succession : exonération entre conjoint ou partenaire de PACS, taxable avec abattements de 159 325 € entre parents/enfants.",
  },
  {
    question: "Faut-il compter des frais supplémentaires après l'achat ?",
    answer:
      "Oui, en plus des frais de notaire, prévoyez : les frais d'agence immobilière si vous passez par une agence (5% à 10% du prix), les frais de garanties et hypothèque (environ 0.5% à 1.5% du prêt), les frais de dossier bancaire (0.5% à 1% du prêt), et les frais de déménagement. Pour un achat à 300 000 €, comptez environ 25 000 € à 30 000 € de frais totaux en sus du prix.",
  },
];

interface Result {
  priceHT: number;
  droitsMutation: number;
  tauxDroits: number;
  emoluments: number;
  fraisGestion: number;
  totalFrais: number;
  totalAPayer: number;
}

export function FraisImmatriculationClient() {
  const [price, setPrice] = useState("");
  const [departement, setDepartement] = useState("default");
  const [propertyType, setPropertyType] = useState<"ancien" | "neuf">("ancien");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const priceValue = parseFloat(price) || 0;
    if (priceValue <= 0) return;

    const tauxMutation = DEPARTEMENTS_TAUX[departement as keyof typeof DEPARTEMENTS_TAUX] || DEPARTEMENTS_TAUX.default;
    const droitsMutation = (priceValue * tauxMutation) / 100;
    const fraisGestion = droitsMutation * 0.025;
    const emoluments = getNotaryEmoluments(priceValue);
    const totalFrais = droitsMutation + fraisGestion + emoluments;

    setResult({
      priceHT: priceValue,
      droitsMutation: Math.round(droitsMutation * 100) / 100,
      tauxDroits: tauxMutation,
      emoluments: Math.round(emoluments * 100) / 100,
      fraisGestion: Math.round(fraisGestion * 100) / 100,
      totalFrais: Math.round(totalFrais * 100) / 100,
      totalAPayer: Math.round((priceValue + totalFrais) * 100) / 100,
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres de l'achat</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Prix d'achat du bien (€)</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setResult(null); }}
              placeholder="Ex. : 285000"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Type de bien</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setPropertyType("ancien"); setResult(null); }}
                className={`p-4 rounded-xl border font-semibold transition-colors ${propertyType === "ancien" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}
              >
                🏚️ Ancien
                <p className="text-xs font-normal mt-1">7% - 9% de frais</p>
              </button>
              <button
                type="button"
                onClick={() => { setPropertyType("neuf"); setResult(null); }}
                className={`p-4 rounded-xl border font-semibold transition-colors ${propertyType === "neuf" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}
              >
                🏗️ Neuf / VEFA
                <p className="text-xs font-normal mt-1">2% - 3% de frais</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Département du bien</label>
            <select
              value={departement}
              onChange={(e) => { setDepartement(e.target.value); setResult(null); }}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="default">Sélectionner un département</option>
              {Object.entries(DEPARTEMENTS_TAUX).filter(([k]) => k !== "default").map(([key, taux]) => (
                <option key={key} value={key}>{key} ({taux}%)</option>
              ))}
            </select>
            <p className="text-xs text-stone-400 mt-1">Le taux de taxe de publicité foncière varie selon les départements</p>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors text-base"
          >
            Calculer les frais de notaire
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className="bg-purple-50 border border-purple-300 rounded-xl p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-stone-500 mb-1">Frais de mutation estimés</p>
                <p className="text-4xl font-bold text-purple-700">
                  {result.totalFrais.toLocaleString("fr-FR")} €
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  {(result.totalFrais / result.priceHT * 100).toFixed(2)}% du prix d'achat
                </p>
              </div>
              <div className="space-y-3 border-t border-purple-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Prix d'achat</span>
                  <span className="font-semibold text-stone-800">{result.priceHT.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Droits de mutation ({result.tauxDroits}%)</span>
                  <span className="font-semibold text-stone-800">{result.droitsMutation.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Émoluments du notaire (réglementés)</span>
                  <span className="font-semibold text-stone-800">{result.emoluments.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Frais de gestion</span>
                  <span className="font-semibold text-stone-800">{result.fraisGestion.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm border-t border-purple-200 pt-3">
                  <span className="font-bold text-stone-800">TOTAL À PAYER</span>
                  <span className="font-bold text-purple-700">{result.totalAPayer.toLocaleString("fr-FR")} €</span>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-3">
                <p className="text-xs text-stone-500">
                  <strong>Estimation indicative.</strong> Les frais réels peuvent varier selon les cas particuliers (exonérations, donations, first achat). Consultez un notaire pour un devis précis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-5">
        <h3 className="font-bold text-stone-800 mb-3">🏛️ Taux de droits de mutation par département</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            ["Taux 4.5%", "Ain, Ardèche, Côte-d'Or, Drôme, Loire, Rhône, Saône-et-Loire..."],
            ["Taux 5.0%", "Cher, Indre, Loir-et-Cher, Loiret, Sarthe, Vendée..."],
            ["Taux 5.5%+", "Paris, Hauts-de-Seine, Yvelines, Val-d'Oise..."],
          ].map(([taux, depts]) => (
            <div key={taux} className="border border-stone-200 rounded-lg p-2">
              <p className="font-bold text-stone-800">{taux}</p>
              <p className="text-stone-500 text-xs">{depts}</p>
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
        <Link href="/outils/calculateur-rentabilite" className="text-blue-600 hover:underline">Calculateur rentabilité →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Simuler mon investissement →</Link>
      </div>
    </div>
  );
}
