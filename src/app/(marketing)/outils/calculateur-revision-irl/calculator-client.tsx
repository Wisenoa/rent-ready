"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

// IRL data — historical values from INSEE
const IRL_HISTORY = [
  { quarter: "Q1 2025", value: 146.02, date: "2025-01-01" },
  { quarter: "Q4 2024", value: 145.77, date: "2024-10-01" },
  { quarter: "Q3 2024", value: 145.48, date: "2024-07-01" },
  { quarter: "Q2 2024", value: 145.25, date: "2024-04-01" },
  { quarter: "Q1 2024", value: 144.65, date: "2024-01-01" },
  { quarter: "Q4 2023", value: 143.83, date: "2023-10-01" },
  { quarter: "Q3 2023", value: 143.41, date: "2023-07-01" },
  { quarter: "Q2 2023", value: 143.02, date: "2023-04-01" },
  { quarter: "Q1 2023", value: 141.10, date: "2023-01-01" },
  { quarter: "Q4 2022", value: 138.89, date: "2022-10-01" },
  { quarter: "Q3 2022", value: 137.38, date: "2022-07-01" },
  { quarter: "Q2 2022", value: 135.84, date: "2022-04-01" },
  { quarter: "Q1 2022", value: 133.93, date: "2022-01-01" },
];

const faqData = [
  {
    question: "Comment est calculée la révision de loyer avec l'IRL ?",
    answer:
      "La formule est encadrée par la loi du 6 juillet 1989 : nouveau loyer = loyer actuel × (nouvel IRL / ancien IRL). Le résultat ne peut pas dépasser la variation de l'IRL applicable. Si vous avez eu une revision dans les 12 derniers mois, vous ne pouvez pas réviser à nouveau.",
  },
  {
    question: "Quand peut-on réviser un loyer avec l'IRL ?",
    answer:
      "La révision du loyer via l'IRL ne peut intervenir qu'une fois par an, à la date anniversaire du bail. Le bailleur doit notifier le locataire au moins 1 mois avant la date d'application (3 mois pour les lieux gas). La clause de révision doit être présente dans le bail.",
  },
  {
    question: "Qu'est-ce que l'IRL et où le trouver ?",
    answer:
      "L'Indice de Référence des Loyers (IRL) est publié trimestriellement par l'INSEE. Il reflète l'évolution des prix à la consommation hors tabac et loyer. Vous pouvez le consulter sur insee.fr ou utiliser notre calculateur qui intègre l'historique INSEE.",
  },
  {
    question: "Peut-on réviser un loyer en zone tendue ?",
    answer:
      "En zone tendue, l'augmentation est encadrée : elle ne peut pas dépasser la variation de l'IRL, sauf en cas de travaux lourde ou de relocation. Notre calculateur donne le montant théorique — vérifiez avec la réglementation applicable à votre commune.",
  },
  {
    question: "Le loyer peut-il baisser si l'IRL baisse ?",
    answer:
      "Oui, la révision peut être négative (baisse) si l'IRL du nouveau trimestre est inférieur à l'IRL de référence. Cependant, le bail doit expressément prévoir cette clause de révision à la baisse pour que le bailleur puisse l'appliquer.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Révision IRL", href: "/outils/calculateur-revision-irl" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur Révision de Loyer IRL",
      description: "Calculez automatiquement la révision de loyer légale selon l'IRL 2026",
      url: "https://www.rentready.fr/outils/calculateur-revision-irl",
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

function IRLCalculatorInner() {
  const [currentRent, setCurrentRent] = useState("");
  const [oldIRLValue, setOldIRLValue] = useState("");
  const [newIRLValue, setNewIRLValue] = useState("");
  const [result, setResult] = useState<{ newRent: number; increase: number; pct: number } | null>(null);

  function calculate() {
    const rent = parseFloat(currentRent);
    const oldI = parseFloat(oldIRLValue);
    const newI = parseFloat(newIRLValue);
    if (isNaN(rent) || isNaN(oldI) || isNaN(newI) || oldI === 0) return;
    const newRent = rent * (newI / oldI);
    const increase = newRent - rent;
    const pct = ((newI / oldI - 1) * 100);
    setResult({ newRent, increase, pct });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="currentRent" className="block text-sm font-semibold text-stone-700 mb-1">
            Loyer actuel (hors charges) — €/mois
          </label>
          <input
            id="currentRent"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex. : 850"
            value={currentRent}
            onChange={(e) => setCurrentRent(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="oldIRL" className="block text-sm font-semibold text-stone-700 mb-1">
              IRL de référence (date de dernière révision)
            </label>
            <input
              id="oldIRL"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex. : 143.83"
              value={oldIRLValue}
              onChange={(e) => setOldIRLValue(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {IRL_HISTORY.slice(0, 5).map((e) => (
                <button
                  key={e.quarter}
                  type="button"
                  onClick={() => setOldIRLValue(String(e.value))}
                  className="text-xs bg-stone-100 hover:bg-blue-100 text-stone-600 px-2 py-1 rounded border border-stone-200 transition-colors"
                >
                  {e.quarter}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="newIRL" className="block text-sm font-semibold text-stone-700 mb-1">
              Nouvel IRL (indice le plus récent)
            </label>
            <input
              id="newIRL"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex. : 146.02"
              value={newIRLValue}
              onChange={(e) => setNewIRLValue(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                const latest = IRL_HISTORY[0];
                if (latest) setNewIRLValue(String(latest.value));
              }}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Utiliser IRL le plus récent ({IRL_HISTORY[0].quarter} = {IRL_HISTORY[0].value})
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          Calculer la révision
        </button>

        {result && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">
              Résultat de la révision
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Nouveau loyer mensuel</span>
                <span className="text-2xl font-bold text-blue-700">
                  {result.newRent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Augmentation mensuelle</span>
                <span className="text-lg font-semibold text-blue-600">
                  +{result.increase.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Variation IRL</span>
                <span className="text-lg font-semibold text-stone-800">
                  +{result.pct.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function IRLCalculatorClient() {
  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🧮</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Révision de Loyer IRL
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Calculez la nouvelle révision de loyer according to the latest IRL published by INSEE.
            </p>
          </div>

          <div className="mb-10">
            <IRLCalculatorInner />
          </div>

          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-stone-800 mb-4">
              Historique des IRL INSEE (derniers trimestres)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-3 font-semibold text-stone-600">Trimestre</th>
                    <th className="text-right py-2 px-3 font-semibold text-stone-600">Valeur IRL</th>
                  </tr>
                </thead>
                <tbody>
                  {IRL_HISTORY.map((entry) => (
                    <tr key={entry.quarter} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-2 px-3 text-stone-700">{entry.quarter}</td>
                      <td className="py-2 px-3 text-right font-mono text-stone-800">{entry.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Source : INSEE — Indice de Référence des Loyers (base 100 au T1 2021)
            </p>
          </div>

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Comment fonctionne la révision de loyer via l'IRL ?
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              La formule est encadrée par la loi du 6 juillet 1989 :{" "}
              <strong>nouveau loyer = loyer actuel × (nouvel IRL / ancien IRL)</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>La clause de révision doit être prévue dans le bail</li>
              <li>La révision ne peut intervenir qu'une fois par an</li>
              <li>Le bailleur doit prévenir le locataire au moins 1 mois à l'avance</li>
              <li>En zone tendue, l'augmentation ne peut pas dépasser la variation de l'IRL</li>
            </ul>
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
