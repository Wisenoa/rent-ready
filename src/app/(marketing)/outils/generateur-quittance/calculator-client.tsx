"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const QuittanceGeneratorForm = dynamic(
  () => import("@/components/landing/quittance-generator-form") as unknown as Promise<React.ComponentType>,
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Générateur de Quittance", href: "/outils/generateur-quittance" },
];

const faqData = [
  {
    question: "La quittance de loyer est-elle obligatoire ?",
    answer:
      "Non, la quittance de loyer n'est pas obligatoire pour le bailleur. Cependant, depuis la loi du 6 juillet 1989, le locataire peut demander une quittance à tout moment et le bailleur doit la fournir dans un délai d'un mois. La quittance est donc quasi-indispensable en pratique.",
  },
  {
    question: "Que doit contenir une quittance de loyer conforme ?",
    answer:
      "Une quittance conforme doit mentionner : le nom et adresse du bailleur, le nom du locataire, l'adresse du bien, le montant du loyer et des charges, la période concernée, la signature du bailleur, et optionally le rappel de l'indice IRL utilisé pour les révisions.",
  },
  {
    question: "Peut-on demander des frais pour générer une quittance ?",
    answer:
      "Non. La délivrance d'une quittance de loyer est gratuite pour le locataire. Le bailleur ne peut pas facturer ce service. Notre générateur est 100% gratuit.",
  },
  {
    question: "Comment fonctionne la mention IRL sur la quittance ?",
    answer:
      "Si le loyer a été révisé selon l'IRL (Indice de Référence des Loyers), la quittance doit mentionner l'indice utilisé et sa date de référence. Notre générateur inclut automatiquement cette mention si vous utilisez la révision IRL.",
  },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Générateur de Quittance de Loyer",
      description: "Générez une quittance de loyer PDF conforme à la loi du 6 juillet 1989 en 30 secondes.",
      url: "https://www.rentready.fr/outils/generateur-quittance",
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

export function GenerateurQuittanceClient() {
  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🧾</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Générateur de Quittance de Loyer
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Générez une quittance de loyer PDF conforme à la loi du 6 juillet 1989. Mentions obligatoires incluses, téléchargement instantané.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8 mb-8">
            <QuittanceGeneratorForm />
          </div>

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Pourquoi utiliser un générateur de quittance ?
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              La quittance de loyer est le document officiel qui prouve qu'un locataire a payé son loyer. Bien qu'elle ne soit pas obligatoire pour le bailleur, il doit en fournir une si le locataire la demande (loi du 6 juillet 1989, article 21).
            </p>
            <p className="text-stone-700 leading-relaxed mb-4">
              Une quittance mal rédigée peut être contestée. Notre générateur inclut automatiquement toutes les mentions obligatoires :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-4">
              <li>Identité complète du bailleur (nom, adresse)</li>
              <li>Identité du locataire</li>
              <li>Adresse complète du bien loué</li>
              <li>Montant du loyer hors charges et montant des charges</li>
              <li>Période couverte par le paiement</li>
              <li>Signature du bailleur</li>
              <li>Optionnel : mention de l'indice IRL pour les révisions</li>
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
