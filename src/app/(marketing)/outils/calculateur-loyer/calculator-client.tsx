"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const ZONES_TENDUES = [
  "Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse",
  "Nantes", "Strasbourg", "Rennes", "Grenoble", "Montpellier", "Nice",
  "Angers", "Le Havre", "Saint-Étienne", "Dijon", "Clermont-Ferrand",
  "Tours", "Amiens", "Limoges", "Orléans", "Perpignan", "Brest", "Nîmes",
];

const faqData = [
  {
    question: "Comment calculer un loyer au m² ?",
    answer:
      "Pour calculer un loyer, multipliez la surface habitable du bien (en m²) par le prix au m² dans votre zone. En zone tendue, ce prix ne peut pas dépasser le montant de référence definido par décret. Le loyer mensuel se calcule ainsi : surface (m²) × prix au m² = loyer mensuel charges comprises.",
  },
  {
    question: "Qu'est-ce qu'une zone tendue ?",
    answer:
      "Une zone tendue est une commune ou agglomération où il existe un déséquilibre important entre l'offre et la demande de logements. Dans ces zones, l'encadrement des loyers s'applique : les loyers ne peuvent pas dépasser un montant de référence majoré (et doivent être au minimum égaux au montant de référence minoré).",
  },
  {
    question: "Le montant de référence est-il le même partout ?",
    answer:
      "Non. Le montant de référence evolve selon la zone géographique, le type de logement (vide/meublé), et la taille du logement (studio, T2, T3, etc.). Chaque commune en zone tendue dispose de ses propres tableaux de référence. Consultez le site du政府对 pour votre commune.",
  },
  {
    question: "Peut-on louer au-dessus du montant de référence ?",
    answer:
      "Oui, dans certains cas : si vous effectuez des travaux important de mejora (au moins le équivalent de 12 mois de loyer), ou si le logement était déjà loyer à un prix supérieur au montant de référence avant l'encadrement. Vous devez alors fournir les justifications nécessaires.",
  },
  {
    question: "Le calculateur donne-t-il des résultats garantis ?",
    answer:
      "Non — ce calculateur donne une estimation basée sur les données générales disponibles. Pour connaître le montant exact applicable à votre situation, consultez le tableau de référence de votre commune sur service-public.fr ou adressez-vous à votre commune.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de Loyer", href: "/outils/calculateur-loyer" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur de Loyer au m²",
      description: "Estimez le loyer de votre bien selon la surface et le prix au m². Applicable zone tendue et non tendue.",
      url: "https://www.rentready.fr/outils/calculateur-loyer",
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

export function LoyerCalculatorClient() {
  const [surface, setSurface] = useState("");
  const [pricePerSqm, setPricePerSqm] = useState("");
  const [isZoneTendue, setIsZoneTendue] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ monthlyRent: number; annualRent: number } | null>(null);

  function calculate() {
    const s = parseFloat(surface);
    const p = parseFloat(pricePerSqm);
    if (isNaN(s) || isNaN(p) || s <= 0 || p <= 0) return;
    const monthlyRent = parseFloat((s * p).toFixed(2));
    setResult({ monthlyRent, annualRent: parseFloat((monthlyRent * 12).toFixed(2)) });
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
              Outil gratuit — Mise à jour 2025
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Calculateur de Loyer au m²
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Estimez le loyer mensuel de votre bien selon la surface et le prix au m². Applicable en zone tendue et non tendue.
            </p>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Estimez votre loyer</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="surface">
                  Surface (m²)
                </label>
                <input
                  id="surface"
                  type="number"
                  placeholder="Ex. 65"
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="price">
                  Prix au m² (€/m²)
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="Ex. 18"
                  value={pricePerSqm}
                  onChange={(e) => setPricePerSqm(e.target.value)}
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
            </div>

            <button
              type="button"
              onClick={calculate}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Calculer le loyer
            </button>

            {result && (
              <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Loyer mensuel</div>
                    <div className="text-3xl font-bold text-blue-700">{result.monthlyRent.toLocaleString("fr-FR")} €</div>
                    <div className="text-sm text-blue-600 mt-1">charges comprises</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Loyer annuel</div>
                    <div className="text-3xl font-bold text-blue-700">{result.annualRent.toLocaleString("fr-FR")} €</div>
                    <div className="text-sm text-blue-600 mt-1">avant impôts</div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-4 text-center">
                  Estimation basee sur {surface} m² × {pricePerSqm} €/m²
                  {isZoneTendue !== null && (
                    <span> — zone {isZoneTendue ? "tendue (encadrement)" : "non tendue (liberté)"}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Zone Tendue Info */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Zones tendues en France</h2>
            <p className="text-stone-600 mb-4">
              En zone tendue, les loyers sont encadrés. Ils doivent se situer entre le montant de référence minoré et le montant de référence majoré. Les communes de plus de 50 000 habitants avec un marché locatif tendu sont concernées.
            </p>
            <div className="flex flex-wrap gap-2">
              {ZONES_TENDUES.map((city) => (
                <span key={city} className="bg-stone-100 text-stone-600 text-sm px-3 py-1 rounded-full">
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-4">
              Source : liste officielle des zones tendues. Vérifiez sur service-public.fr pour votre commune exacte.
            </p>
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
            <h2 className="text-xl font-bold text-stone-900 mb-4">Outils complements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/outils/calculateur-caution" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-semibold text-stone-900">Calculateur de Caution</div>
                  <div className="text-sm text-stone-500">Dépôt de garantie maximum</div>
                </div>
              </Link>
              <Link href="/modeles/bail-vide" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle de Bail de Location</div>
                  <div className="text-sm text-stone-500">Bail conforme à la loi 1989</div>
                </div>
              </Link>
              <Link href="/glossaire-immobilier" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-semibold text-stone-900">Glossaire Immobilier</div>
                  <div className="text-sm text-stone-500">Toutes les définitions légales</div>
                </div>
              </Link>
              <Link href="/outils/calculateur-revision-irl" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-semibold text-stone-900">Calculateur de Révision IRL</div>
                  <div className="text-sm text-stone-500">Révision légale du loyer</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Gérez vos loyers en toute conformité</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Avec RentReady, vous suivez vos loyers automatiquement, générez les annexes de révision, et restez dans les clous réglementaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                Essai gratuit 14 jours
              </Link>
              <Link href="/pricing" className="inline-block border-2 border-blue-300 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">
                Voir les tarifs
              </Link>
            </div>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}