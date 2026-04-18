"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

// Benchmarks for France
const BENCHMARKS = [
  { city: "Paris", netYield: "2.5–3.5%", note: "marché tendu, prix élevés" },
  { city: "Lyon", netYield: "3.5–4.5%", note: "bonne liquidité" },
  { city: "Bordeaux", netYield: "3.0–4.0%", note: "en baisse depuis 2022" },
  { city: "Marseille", netYield: "4.0–6.0%", note: "rendement supérieur, tension modérée" },
  { city: "Toulouse", netYield: "3.5–4.5%", note: "croissance démographique" },
  { city: "Lille", netYield: "3.5–5.0%", note: "forte demande locative" },
  { city: "Province moyenne", netYield: "4.0–7.0%", note: "plus accessible, frais moindre" },
];

const faqData = [
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
      "Oui, c'est recommandé. Notre calculateur applique un taux de vacance (par défaut 8%) qui réduit le loyer annuel effectif. Cela donne une picture plus réaliste du rendement attendu sur l'année.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Rendement Locatif", href: "/outils/calculateur-rendement" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur de Rendement Locatif",
      description: "Calculez le rendement NET et BRUT de votre investissement locatif avec benchmarks France",
      url: "https://www.rentready.fr/outils/calculateur-rendement",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqData.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        item: `https://www.rentready.fr${item.href}`,
      })),
    },
  ],
};

function YieldCalculatorInner() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [annualCharges, setAnnualCharges] = useState("");
  const [vacancyRate, setVacancyRate] = useState("8");
  const [result, setResult] = useState<{
    grossYield: number;
    netYield: number;
    annualizedRent: number;
    effectiveRent: number;
  } | null>(null);

  function calculate() {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);
    const charges = parseFloat(annualCharges) || 0;
    const vacancy = parseFloat(vacancyRate) || 0;
    if (isNaN(price) || isNaN(rent) || price <= 0) return;

    const annualizedRent = rent * 12;
    const effectiveRent = annualizedRent * (1 - vacancy / 100);
    const grossYield = (annualizedRent / price) * 100;
    const netYield = ((effectiveRent - charges) / price) * 100;

    setResult({ grossYield, netYield, annualizedRent, effectiveRent });
  }

  return (
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
            step="1000"
            placeholder="Ex. : 200000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="monthlyRent" className="block text-sm font-semibold text-stone-700 mb-1">
            Loyer mensuel hors charges (€)
          </label>
          <input
            id="monthlyRent"
            type="number"
            min="0"
            step="10"
            placeholder="Ex. : 900"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="annualCharges" className="block text-sm font-semibold text-stone-700 mb-1">
            Charges annuelles (€) — laisser vide si inconnu
          </label>
          <input
            id="annualCharges"
            type="number"
            min="0"
            step="100"
            placeholder="Ex. : 2500"
            value={annualCharges}
            onChange={(e) => setAnnualCharges(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-stone-400 mt-1">
            Inclut : taxe foncière, assurance, frais de gestion, chargesCopro non récupérables.
          </p>
        </div>

        <div>
          <label htmlFor="vacancyRate" className="block text-sm font-semibold text-stone-700 mb-1">
            Taux de vacance locative estimé (%)
          </label>
          <input
            id="vacancyRate"
            type="number"
            min="0"
            max="100"
            placeholder="Ex. : 8"
            value={vacancyRate}
            onChange={(e) => setVacancyRate(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-stone-400 mt-1">
            Defaut: 8% — ajustez selon votre marché local.
          </p>
        </div>

        <button
          type="button"
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          Calculer le rendement
        </button>

        {result && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-4">
              Résultat du rendement
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Rendement brut</span>
                <span className="text-2xl font-bold text-green-700">
                  {result.grossYield.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Rendement net (après charges)</span>
                <span className="text-2xl font-bold text-green-700">
                  {result.netYield.toFixed(2)}%
                </span>
              </div>
              <div className="border-t border-green-200 pt-3 mt-3 space-y-2 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Loyer anualisé</span>
                  <span className="font-semibold">
                    {result.annualizedRent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loyer effectif (après vacance {vacancyRate}%)</span>
                  <span className="font-semibold">
                    {result.effectiveRent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function YieldCalculatorClient() {
  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🏠</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Rendement Locatif
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Calculez le rendement NET et BRUT de votre investissement locatif. Inclut les benchmarks par ville et la prise en compte des charges et de la vacance.
            </p>
          </div>

          <div className="mb-10">
            <YieldCalculatorClient />
          </div>

          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Benchmarks de rendement par ville</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-3 font-semibold text-stone-600">Ville</th>
                    <th className="text-right py-2 px-3 font-semibold text-stone-600">Rendement net</th>
                    <th className="text-left py-2 px-3 font-semibold text-stone-600">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARKS.map((b) => (
                    <tr key={b.city} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-2 px-3 font-semibold text-stone-800">{b.city}</td>
                      <td className="py-2 px-3 text-right font-mono text-green-700">{b.netYield}</td>
                      <td className="py-2 px-3 text-stone-500">{b.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Benchmarks indicatifs basés sur les données marché 2024-2025.
            </p>
          </div>

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Comment calculer le rendement locatif ?
            </h2>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Rendement brut</h3>
            <div className="bg-stone-100 rounded-xl p-4 font-mono text-sm text-stone-800 mb-4">
              Rendement brut = (Loyer mensuel × 12) / Prix d'achat × 100
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Rendement net</h3>
            <div className="bg-stone-100 rounded-xl p-4 font-mono text-sm text-stone-800 mb-4">
              Rendement net = (Loyer effectif - Charges) / Prix d'achat × 100
            </div>
            <p className="text-stone-700 leading-relaxed">
              Le rendement net est plus fiable que le brut car il tient compte des charges réelles.
              Notre calculateur applique également un taux de vacance pour refléter les périodes sans locataire.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8 mb-10">
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

          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 mb-8">
            <Link href="/bail" className="text-blue-600 hover:underline">Bail de location →</Link>
            <Link href="/quittances" className="text-blue-600 hover:underline">Quittances automatiques →</Link>
            <Link href="/modeles" className="text-blue-600 hover:underline">Modèles gratuits →</Link>
            <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}
