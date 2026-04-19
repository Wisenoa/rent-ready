"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { RelatedContent } from "@/components/seo/related-links";

// IRL — latest values from INSEE 2025
const IRL_DATA = [
  { quarter: "T1 2025", value: 146.02, date: "Jan 2025" },
  { quarter: "T4 2024", value: 145.77, date: "Oct 2024" },
  { quarter: "T3 2024", value: 145.48, date: "Jul 2024" },
  { quarter: "T2 2024", value: 145.25, date: "Apr 2024" },
  { quarter: "T1 2024", value: 144.65, date: "Jan 2024" },
  { quarter: "T4 2023", value: 143.83, date: "Oct 2023" },
  { quarter: "T3 2023", value: 143.41, date: "Jul 2023" },
  { quarter: "T2 2023", value: 143.02, date: "Apr 2023" },
  { quarter: "T1 2023", value: 141.10, date: "Jan 2023" },
  { quarter: "T4 2022", value: 138.89, date: "Oct 2022" },
  { quarter: "T3 2022", value: 137.38, date: "Jul 2022" },
  { quarter: "T2 2022", value: 135.84, date: "Apr 2022" },
];

const faqData = [
  {
    question: "Qu'est-ce que l'IRL ?",
    answer:
      "L'Indice de Référence des Loyers (IRL) est un indice trimestriel publié par l'INSEE. Il sert de base légale pour la révision des loyers dans le secteur privé. Il reflète l'évolution des prix à la consommation hors tabac et hors loyers, représentant ainsi l'inflation vécue par les ménages.",
  },
  {
    question: "Comment utiliser ce calculateur IRL ?",
    answer:
      "Entrez votre loyer actuel et cliquez sur le trimestre de référence qui correspond à votre bail. Le calculateur affichera automatiquement l'IRL en vigueur, la variation sur un an, et vous guidera vers le calcul de révision pour appliquer la hausse légale à votre loyer.",
  },
  {
    question: "Quand peut-on réviser un loyer avec l'IRL ?",
    answer:
      "La révision via l'IRL ne peut intervenir qu'une fois par an, à la date anniversaire du contrat de location. Le bailleur doit informer le locataire au moins 1 mois avant la date d'application (3 mois pour les locations meublées). Il faut aussi que le bail contienne une clause de révision.",
  },
  {
    question: "Quelle est la valeur actuelle de l'IRL ?",
    answer:
      "Au T1 2025, l'IRL s'établit à 146,02. La variation sur un an (T1 2024 à T1 2025) est de +0,95%. Utilisez notre calculateur de révision de loyer pour appliquer cette hausse à votre bail.",
  },
  {
    question: "Le loyer peut-il baisse si l'IRL baisse ?",
    answer:
      "Oui, si l'IRL du nouveau trimestre est inférieur à celui de l'année précédente, la révision peut être négative. Mais le bail doit expressément prévoir la révision à la baisse pour que le bailleur puisse l'appliquer. En pratique, la clause de révision est généralement symétrique.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur IRL", href: "/outils/calculateur-irl" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur IRL — Indice de Référence des Loyers",
      description: "Consultez l'historique des IRL et la variation annuelle. Outil gratuit pour propriétaires et locataires.",
      url: "https://www.rentready.fr/outils/calculateur-irl",
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

export function IRLCalculatorClient() {
  const [selectedQuarter, setSelectedQuarter] = useState(IRL_DATA[0]);

  const previousYearQuarter = IRL_DATA.find(
    (q) => q.quarter === selectedQuarter.quarter.replace("2025", "2024").replace("T1 2025", "T1 2024")
  );

  const variation =
    previousYearQuarter && previousYearQuarter.value !== 0
      ? (((selectedQuarter.value - previousYearQuarter.value) / previousYearQuarter.value) * 100).toFixed(2)
      : null;

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
              Mis à jour Avril 2025 — Source INSEE
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Calculateur IRL — Indice de Référence des Loyers
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Consultez l'historique des IRL et la variation annuelle. Utilisez ce resultat pour calculer la révision de votre loyer.
            </p>
          </div>

          {/* IRL Table */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-1">Historique des IRL</h2>
            <p className="text-sm text-stone-500 mb-6">Derniers trimestres publies par l'INSEE</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-semibold text-stone-700">Trimestre</th>
                    <th className="text-right py-3 px-4 font-semibold text-stone-700">Valeur IRL</th>
                    <th className="text-right py-3 px-4 font-semibold text-stone-700">Variation annuelle</th>
                  </tr>
                </thead>
                <tbody>
                  {IRL_DATA.map((q) => {
                    const prevQ = IRL_DATA.find((p) => p.quarter === q.quarter.replace("2025", "2024").replace("T1 2025", "T1 2024").replace("2024", "2023").replace("T1 2024", "T1 2023").replace("T1 2023", "T1 2022"));
                    const prev = IRL_DATA[IRL_DATA.indexOf(q) + 4];
                    const pct = prev ? (((q.value - prev.value) / prev.value) * 100).toFixed(2) : null;
                    return (
                      <tr
                        key={q.quarter}
                        className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer ${selectedQuarter.quarter === q.quarter ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedQuarter(q)}
                      >
                        <td className="py-3 px-4 font-medium text-stone-900">{q.quarter} <span className="text-stone-400 text-xs">({q.date})</span></td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-stone-900">{q.value}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${pct && parseFloat(pct) >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {pct ? `${parseFloat(pct) >= 0 ? "+" : ""}${pct}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected IRL Detail */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Trimestre selectionne : {selectedQuarter.quarter}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-50 rounded-xl p-4 text-center">
                <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Valeur IRL</div>
                <div className="text-2xl font-bold text-stone-900">{selectedQuarter.value}</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-4 text-center">
                <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Date de publication</div>
                <div className="text-2xl font-bold text-stone-900">{selectedQuarter.date}</div>
              </div>
              {variation && (
                <div className="bg-stone-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Variation 1 an</div>
                  <div className={`text-2xl font-bold ${parseFloat(variation) >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {parseFloat(variation) >= 0 ? "+" : ""}{variation}%
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Statut</div>
                <div className="text-2xl font-bold text-blue-700">Actif</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>Pour réviser un loyer :</strong> utilisez le{' '}
                <Link href="/outils/calculateur-revision-irl" className="font-semibold underline hover:no-underline">
                  Calculateur de Révision de Loyer
                </Link>{' '}
                avec la valeur IRL ci-dessus et la formule légale : nouveau loyer = loyer actuel × (nouvel IRL / ancien IRL).
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Questions fréquentes sur l'IRL</h2>
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
              <Link href="/outils/calculateur-revision-irl" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-semibold text-stone-900">Calculateur de Révision de Loyer</div>
                  <div className="text-sm text-stone-500">Apply the IRL to your rent</div>
                </div>
              </Link>
              <Link href="/modeles/bail-vide" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle de Bail de Location</div>
                  <div className="text-sm text-stone-500">Bail conforme avec clause IRL</div>
                </div>
              </Link>
              <Link href="/glossaire-immobilier" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-semibold text-stone-900">Glossaire Immobilier</div>
                  <div className="text-sm text-stone-500">Toutes les definitions legales</div>
                </div>
              </Link>
              <Link href="/outils/calculateur-caution" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-semibold text-stone-900">Calculateur Caution</div>
                  <div className="text-sm text-stone-500">Deposit maximum legal</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Genererez vos documents avec l'IRL</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              RentReady calcul automatiquement la révision IRL de vos loyers et genere les annexes pour vos baux.
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

          <RelatedContent currentUrl="/outils/calculateur-irl" currentCategory="Outils" type="tools" limit={3} />
        </div>
      </div>
    </>
  );
}