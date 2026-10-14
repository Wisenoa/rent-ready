"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const QuittanceGeneratorForm = dynamic(
  () => import("@/components/landing/quittance-generator-form").then((mod) => mod.QuittanceGeneratorForm),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Générateur de Quittance", href: "/outils/generateur-quittance" },
];

// Legal answers: article 21 of loi n° 89-462 du 6 juillet 1989 (Légifrance).
// It sets no deadline and requires no IRL mention; do not add either back.
const faqData = [
  {
    question: "La quittance de loyer est-elle obligatoire ?",
    answer:
      "Oui, dès que le locataire la demande : le bailleur doit alors la lui transmettre gratuitement (article 21 de la loi du 6 juillet 1989). La loi ne fixe pas de délai précis. Si le locataire n'a payé qu'une partie du loyer, le bailleur lui délivre un reçu, pas une quittance.",
  },
  {
    question: "Que doit contenir une quittance de loyer conforme ?",
    answer:
      "La loi exige que la quittance détaille les sommes versées en distinguant le loyer et les charges. En pratique, elle mentionne aussi le nom du bailleur et du locataire, l'adresse du logement, la période couverte et la date du paiement, et elle est souvent signée par le bailleur.",
  },
  {
    question: "Peut-on demander des frais pour générer une quittance ?",
    answer:
      "Non. La délivrance d'une quittance de loyer est gratuite pour le locataire. Le bailleur ne peut pas facturer ce service. Notre générateur est 100% gratuit.",
  },
  {
    question: "Faut-il mentionner l'IRL sur la quittance ?",
    answer:
      "Non, la loi ne l'exige pas. L'indice de référence des loyers sert à calculer la révision annuelle du loyer ; après une révision, la quittance indique simplement le nouveau montant. Pour calculer une révision, utilisez notre calculateur IRL.",
  },
];

;

export function GenerateurQuittanceClient() {
  return (
    <>

      <div className="min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-sage-100 text-forest text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🧾</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-ink mb-3 leading-tight">
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
            <h2 className="text-2xl font-semibold text-ink mb-4">
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
            <h2 className="text-xl font-semibold text-stone-800 mb-6">Questions fréquentes</h2>
            <div className="space-y-5">
              {faqData.map((item, i) => (
                <div key={i} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-600 mb-8">
            <Link href="/bail" className="text-forest hover:underline">Bail de location →</Link>
            <Link href="/quittances" className="text-forest hover:underline">Quittances automatiques →</Link>
            <Link href="/templates" className="text-forest hover:underline">Modèles gratuits →</Link>
            <Link href="/pricing" className="text-forest hover:underline">Tarifs →</Link>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}
