"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const CHARGES_CATEGORIES = [
  {
    label: "Taxe foncière",
    avgPercent: 10,
    note: "En moyenne 1 mois de loyer / an",
  },
  {
    label: "Assurance PNO",
    avgPercent: 5,
    note: "Propriétaire Non Occupant",
  },
  {
    label: "Frais de gestion",
    avgPercent: 8,
    note: "Agence ou autogestion",
  },
  {
    label: "Charges de copropriété",
    avgPercent: 10,
    note: "Partie commune, ascenseur, ménage",
  },
  {
    label: "Travaux/entretien",
    avgPercent: 10,
    note: "Réparations, peinture, plomberie",
  },
  {
    label: "Vacance locative",
    avgPercent: 8,
    note: "Mois sans locataire (défaut)",
  },
  {
    label: "Honoraires hlM / contentieux",
    avgPercent: 3,
    note: "Rare mais possible",
  },
];

const faqData = [
  {
    question: "Que sont les charges locatives ?",
    answer:
      "Les charges locatives sont les dépenses liées à l'utilisation du bien que le bailleur peut récupérer auprès du locataire via les provisions pour charges. On distingue les charges récupérables (eau froide, ordures ménagères, entretien courant) des charges non récupérables (taxe foncière, assurance, frais de gestion).",
  },
  {
    question: "Comment calculer les provisions pour charges ?",
    answer:
      "Le bailleur peut demander des provisions mensuelles basadas sur les charges de l'année précédente. Un récapitulatif annuel doit être fourni au locataire avec le détail des dépenses. Si les provisions sont insuffisantes, le locataire doit payer le complément. Si elles sont excédentaires, elles lui sont restituées.",
  },
  {
    question: "Quelles sont les charges récupérables en location vide ?",
    answer:
      "Les charges récupérables (décret de 1982) incluent : l'eau froide, les eaux usées, les ordures ménagères, la taxe d'enlèvement des ordures ménagères, l'entretien des parties communes, le salaire du gardien, les petites réparations, la maintenance de la chaudière.",
  },
  {
    question: "Peut-on déduire les charges du revenu locatif ?",
    answer:
      "Oui, dans le cadre du régime réel (contre le micro-foncier), toutes les charges engagées pour la gestion du bien sont déductibles : taxe foncière, assurance, frais de gestion, intérêts d'emprunt, travaux de réparation et d'entretien. Cela réduit significativement la imposition.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Charges Locatives", href: "/outils/calculateur-charges-locatives" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur de Charges Locatives",
      description: "Estimez le coût réel de vos charges locatives et Provisions pour charges (charges récupérables).",
      url: "https://www.rentready.fr/outils/calculateur-charges-locatives",
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

function ChargesCalculatorInner() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [customCharges, setCustomCharges] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    totalAnnual: number;
    totalMonthly: number;
    provisions: number;
    netIncome: number;
  } | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent);
    if (isNaN(rent) || rent <= 0) return;

    let totalAnnual = rent * 12;
    CHARGES_CATEGORIES.forEach((cat) => {
      const val = parseFloat(customCharges[cat.label] || "0");
      if (!isNaN(val) && val > 0) {
        totalAnnual += val;
      } else {
        totalAnnual += (rent * 12 * cat.avgPercent) / 100;
      }
    });

    const totalMonthly = totalAnnual / 12;
    const provisions = rent * 0.15; // ~15% of rent for provisions
    const netIncome = rent - provisions;

    setResult({
      totalAnnual,
      totalMonthly,
      provisions,
      netIncome,
    });
  }

  function handleCatChange(label: string, value: string) {
    setCustomCharges((prev) => ({ ...prev, [label]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="chargesRent" className="block text-sm font-semibold text-stone-700 mb-1">
              Loyer mensuel hors charges (€)
            </label>
            <input
              id="chargesRent"
              type="number"
              min="0"
              step="10"
              placeholder="Ex. : 750"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border-t border-stone-100 pt-4">
            <p className="text-sm font-semibold text-stone-600 mb-3">
              Charges réelles (optionnel — laissez vide pour estimation moyenne)
            </p>
            <div className="space-y-3">
              {CHARGES_CATEGORIES.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <label className="w-48 text-sm text-stone-600 shrink-0">
                    {cat.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder={`~${cat.avgPercent}%`}
                    value={customCharges[cat.label] || ""}
                    onChange={(e) => handleCatChange(cat.label, e.target.value)}
                    className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-stone-400 w-40 shrink-0">/{cat.note}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
          >
            Calculer les charges
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-6 md:p-8">
          <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-4">
            Estimation annuelle des charges
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-stone-700">
              <span>Loyer annuel brut</span>
              <span className="font-semibold">
                {(parseFloat(monthlyRent) * 12).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Total charges annuelles</span>
              <span className="font-semibold text-red-600">
                -{result.totalAnnual.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
            <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-stone-900">
              <span>Revenu net annuel estimé</span>
              <span className="text-green-700">
                {result.netIncome * 12 <= 0 ? "0" : (result.netIncome * 12).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-green-200 text-sm text-stone-600">
            <p>
              <strong>Provision mensuelle recommandée :</strong>{" "}
              <span className="text-green-700 font-semibold">
                {result.provisions.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
              /mois (~15% du loyer, à ajuster selon charges réelles)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ChargesCalculatorClient() {
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
              Calculateur de Charges Locatives
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez le coût réel de vos charges de propriété et la provision mensuelle à demander à votre locataire.
            </p>
          </div>

          <div className="mb-10">
            <ChargesCalculatorInner />
          </div>

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Charges locatives : ce que vous devez savoir
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              En location non meublée, le bailleur peut récupérer les chargeslocatives via des provisions mensuelles. Les charges récupérables sont encadrées par le décret du 30 août 1982.
            </p>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">Charges récupérables (décret 1982)</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <ul className="list-disc pl-5 space-y-1 text-stone-700 text-sm">
                <li>Eau froide et eaux usées</li>
                <li>Taxe d'enlèvement des ordures ménagères (TEOM)</li>
                <li>Entretien des parties communes (ménage, éclairage)</li>
                <li>Salaire du gardien et charges sociales</li>
                <li>Petites réparations et maintenance (chaudière, canalisations)</li>
                <li>Ascenseur et équipements communs</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">Charges non récupérables</h3>
            <div className="bg-stone-100 rounded-xl p-4 mb-4">
              <ul className="list-disc pl-5 space-y-1 text-stone-700 text-sm">
                <li>Taxe foncière (entièrement à la charge du propriétaire)</li>
                <li>Assurance PNO (Propriétaire Non Occupant)</li>
                <li>Frais de gestion et honoraires</li>
                <li>Gros travaux et remplacement d'équipements</li>
              </ul>
            </div>
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
