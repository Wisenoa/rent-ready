"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const faqData = [
  {
    question: "Qu'est-ce que le dépôt de garantie ?",
    answer:
      "Le dépôt de garantie est une somme versée par le locataire au bailleur lors de la signature du bail. Il garantit le paiement des sommes dues en cas de dégradations ou d'impayés à la fin du bail. Le montant maximum est encadré par la loi selon la zone géographique et le type de location.",
  },
  {
    question: "Quel est le montant maximum du dépôt de garantie ?",
    answer:
      "En zone tendue, le dépôt est limité à 1 mois de loyer hors charges, pour les locations vides et meublées. En zone non tendue : 1 mois pour le vide, 2 mois pour le meublé. Le dépôt ne peut pas être utilisé comme dernier mois de loyer.",
  },
  {
    question: "Qu'est-ce qu'une zone tendue ?",
    answer:
      "Une zone tendue est une zone géographique où il existe un déséquilibre entre l'offre et la demande de logements (villes de plus de 50 000 habitants avec un marché locatif tendu). Dans ces zones, le dépôt de garantie est limité à 1 mois, que le logement soit meublé ou vide.",
  },
  {
    question: "Le dépôt doit-il être restitué avec intérêts ?",
    answer:
      "Non, le dépôt de garantie n'est pas productif d'intérêts au bénéfice du locataire. Il doit être restitué dans les 2 mois suivant la remise des clés, déduction faite des sommes dues au titre des dégradations constatoes ou des impayés de loyer.",
  },
  {
    question: " Peut-on demander une caution en plus du dépôt ?",
    answer:
      "Oui, le bailleur peut demander une caution (garant tiers) en plus du dépôt de garantie. Il peut s'agir d'un garant physique, d'une garantie loyers impayés (GLI) auprès d'un assureur, ou d'une action-logement. La caution ne remplace pas le dépôt de garantie.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Dépôt de Garantie", href: "/outils/calculateur-depot-garantie" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur de Dépôt de Garantie",
      description: "Calculez le dépôt de garantie maximum légal pour votre location selon la zone et le type de bail.",
      url: "https://www.rentready.fr/outils/calculateur-depot-garantie",
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

export function DepotGarantieCalculatorClient() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [isZoneTendue, setIsZoneTendue] = useState<boolean | null>(null);
  const [isFurnished, setIsFurnished] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ maxDeposit: number; legalBasis: string } | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent);
    if (isNaN(rent) || rent <= 0) return;
    if (isZoneTendue === null || isFurnished === null) return;

    let maxDeposit: number;
    let legalBasis: string;

    if (isZoneTendue) {
      maxDeposit = rent;
      legalBasis = "Zone tendue : dépôt limité à 1 mois de loyer (loi ALUR 2014)";
    } else {
      maxDeposit = isFurnished ? rent * 2 : rent;
      legalBasis = isFurnished
        ? "Zone non tendue + location meublée : dépôt limité à 2 mois de loyer (loi 1989)"
        : "Zone non tendue + location vide : dépôt limité à 1 mois de loyer (loi 1989)";
    }

    setResult({ maxDeposit, legalBasis });
  }

  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Mis à jour — Base légale 2025
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Calculateur de Dépôt de Garantie
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Calculez le montant maximum du dépôt de garantie légal pour votre location selon la zone géographique et le type de bail.
            </p>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Estimez le dépôt maximum</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="rent">
                  Loyer mensuel hors charges (€)
                </label>
                <input
                  id="rent"
                  type="number"
                  placeholder="Ex. 800"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Zone tendue ?</label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsZoneTendue(true)}
                    className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                      isZoneTendue === true ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsZoneTendue(false)}
                    className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                      isZoneTendue === false ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Non
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Type de location</label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsFurnished(false)}
                    className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                      isFurnished === false ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Vide
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFurnished(true)}
                    className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${
                      isFurnished === true ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Meublé
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={calculate}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Calculer le dépôt maximum
            </button>

            {result && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-center mb-4">
                  <div className="text-xs text-green-600 uppercase tracking-wide mb-1">Dépôt de garantie maximum</div>
                  <div className="text-4xl font-bold text-green-700">{result.maxDeposit.toLocaleString("fr-FR")} €</div>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Base légale</div>
                  <div className="text-sm text-stone-700">{result.legalBasis}</div>
                </div>
                <div className="flex items-start gap-2 text-sm text-green-700">
                  <svg className="size-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span>Ce montant ne peut pas être dépassé. Le dépôt doit être restitué dans les 2 mois suivant la fin du bail.</span>
                </div>
              </div>
            )}
          </div>

          {/* Reference Table */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Règles de dépôt par situation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-semibold text-stone-700">Situation</th>
                    <th className="text-left py-3 px-4 font-semibold text-stone-700">Zone</th>
                    <th className="text-right py-3 px-4 font-semibold text-stone-700">Dépôt maximum</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { situation: "Location vide", zone: "Tendue", deposit: "1 mois de loyer", bg: "bg-blue-50" },
                    { situation: "Location vide", zone: "Non tendue", deposit: "1 mois de loyer", bg: "" },
                    { situation: "Location meublée", zone: "Tendue", deposit: "1 mois de loyer", bg: "bg-blue-50" },
                    { situation: "Location meublée", zone: "Non tendue", deposit: "2 mois de loyer", bg: "" },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-stone-100 ${row.bg}`}>
                      <td className="py-3 px-4 font-medium text-stone-900">{row.situation}</td>
                      <td className="py-3 px-4 text-stone-600">{row.zone}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-700">{row.deposit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-500 mt-4">Source : loi du 6 juillet 1989 (art. 22) et loi ALUR 2014. Base légale applicable en 2025.</p>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <details key={i} className="group border border-stone-200 rounded-xl">
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-stone-50 list-none">
                    <span className="font-semibold text-stone-900">{faq.question}</span>
                    <svg className="size-5 text-stone-400 group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-stone-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>

          {/* Internal Links */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Outils complémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/outils/calculateur-loyer" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">🏠</span>
                <div>
                  <div className="font-semibold text-stone-900">Calculateur de Loyer</div>
                  <div className="text-sm text-stone-500">Estimez le loyer au m²</div>
                </div>
              </Link>
              <Link href="/modeles/bail-vide" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle de Bail de Location</div>
                  <div className="text-sm text-stone-500">Conforme à la loi 1989</div>
                </div>
              </Link>
              <Link href="/glossaire-immobilier" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-semibold text-stone-900">Glossaire Immobilier</div>
                  <div className="text-sm text-stone-500">Toutes les définitions légales</div>
                </div>
              </Link>
              <Link href="/modeles/etat-des-lieux" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">🏠</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle État des Lieux</div>
                  <div className="text-sm text-stone-500">Checklist entrée et sortie</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Gérez vos dépôts de garantie facilement</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              RentReady vous aide à calculer les dépôts, suivre les restitutions, et gérer les retenues en toute conformité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                Essai gratuit 14 jours
              </Link>
              <Link href="/outils" className="inline-block border-2 border-blue-300 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">
                Autres outils gratuits
              </Link>
            </div>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}