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
    question: "Quelle est la durée de préavis normale pour un locataire ?",
    answer:
      "En zone non tendue, le préavis normal est de 3 mois pour une location vide et 1 mois pour une location meublée. En zone tendue, le préavis est réduit à 1 mois pour les deux types de location (loi ALUR 2014). Le préavis court à partir du jour où le bailleur reçoit la lettre de démission.",
  },
  {
    question: "Qu'est-ce qu'une zone tendue ?",
    answer:
      "Une zone tendue est une zone géographique où il existe un déséquilibre entre l'offre et la demande de logements. En France, les communes de plus de 50 000 habitants avec un marché locatif tendu sont classées comme zones tendues. Le classement est réévalué régulièrement par décret. Vérifiez le statut de votre commune sur le site du gouvernement.",
  },
  {
    question: "Peut-on réduire le préavis à 1 mois en zone non tendue ?",
    answer:
      "Oui, dans certains cas exceptionnels le préavis peut être réduit à 1 mois : mutation professionnelle (prise de fonction), perte d'emploi, nouvel emploi (suite à unemployment), raisons de santé. Le locataire doit fournir un justificatif lors de l'envoi de sa lettre de résiliation.",
  },
  {
    question: "Comment calculer la date de fin de préavis ?",
    answer:
      "Le préavis commence le jour où le bailleur (ou son mandataire) reçoit la lettre de résiliation recommandée avec accusé de réception. Il expire à la fin du mois qui suit. Par exemple, un préavis reçu le 15 mars se termine le 30 avril (jour correspondant du mois suivant).",
  },
  {
    question: "Le locataire doit-il payer le loyer pendant le préavis ?",
    answer:
      "Oui, le locataire est tenu de payer le loyer et les charges jusqu'à la fin du préavis, même s'il a trouvé un nouveau locataire entre-temps. Cependant, si le propriétaire reloue le logement avant la fin du préavis, il peut essere tenu de reverser une partie du dépôt au locataire sortant.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de Préavis Locataire", href: "/outils/calculateur-preavis" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur de Préavis Locataire",
      description: "Calculez la durée de préavis applicable pour votre départ de location selon la zone et la situation.",
      url: "https://www.rentready.fr/outils/calculateur-preavis",
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

type NoticeType = "normal" | "mutation" | "perte_emploi" | "sante";

export function PreavisCalculatorClient() {
  const [isZoneTendue, setIsZoneTendue] = useState<boolean | null>(null);
  const [isFurnished, setIsFurnished] = useState<boolean | null>(null);
  const [noticeType, setNoticeType] = useState<NoticeType>("normal");
  const [result, setResult] = useState<{ months: number; endDate: string; legalBasis: string; explanation: string } | null>(null);

  function calculate() {
    if (isZoneTendue === null || isFurnished === null) return;

    let months: number;
    let legalBasis: string;
    let explanation: string;

    if (noticeType !== "normal") {
      // Reduced preavis — valid reasons
      months = 1;
      const reasons: Record<NoticeType, string> = {
        normal: "",
        mutation: "Mutation professionnelle (prise de fonction dans une nouvelle entreprise)",
        perte_emploi: "Perte d'emploi (licenciement, rupture conventionnelle)",
        sante: "Reasons de santé justifiées par un certificat médical",
      };
      legalBasis = `Préavis réduit à 1 mois — motif: ${reasons[noticeType]} (article 15 loi 1989)`;
      explanation = `Votre situation vous permet de bénéficier d'un préavis réduit à 1 mois, quel que soit le type de location ou la zone géographique. Vous devez joindre un justificatif à votre lettre de résiliation.`;
    } else if (isZoneTendue) {
      months = 1;
      legalBasis = "Zone tendue + location vide ou meublée : préavis de 1 mois (loi ALUR 2014)";
      explanation = "Depuis la loi ALUR de 2014, en zone tendue, le préavis est limité à 1 mois pour tous les types de location.";
    } else if (isFurnished) {
      months = 1;
      legalBasis = "Zone non tendue + location meublée : préavis de 1 mois (loi 1989, art. 15)";
      explanation = "Pour une location meublée en zone non tendue, le préavis légal est de 1 mois.";
    } else {
      months = 3;
      legalBasis = "Zone non tendue + location vide : préavis de 3 mois (loi 1989, art. 15)";
      explanation = "Pour une location vide en zone non tendue, le préavis légal est de 3 mois. Vous pouvez partir avant en négociant avec le bailleur.";
    }

    // Calculate end date
    const today = new Date();
    const endDateObj = new Date(today.getFullYear(), today.getMonth() + months, today.getDate());
    const endDate = endDateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    setResult({ months, endDate, legalBasis, explanation });
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
              Calculateur de Préavis Locataire
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Calculez la durée de préavis légale pour votre départ de location selon votre situation, votre zone géographique, et le type de bail.
            </p>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Votre situation</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Votre commune est-elle en zone tendue ?</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsZoneTendue(true)}
                    className={`flex-1 rounded-xl border px-6 py-4 font-semibold transition-colors text-center ${
                      isZoneTendue === true ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Oui — zone tendue
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsZoneTendue(false)}
                    className={`flex-1 rounded-xl border px-6 py-4 font-semibold transition-colors text-center ${
                      isZoneTendue === false ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Non — zone non tendue
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Type de location</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFurnished(false)}
                    className={`flex-1 rounded-xl border px-6 py-4 font-semibold transition-colors text-center ${
                      isFurnished === false ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Location vide
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFurnished(true)}
                    className={`flex-1 rounded-xl border px-6 py-4 font-semibold transition-colors text-center ${
                      isFurnished === true ? "bg-blue-600 text-white border-blue-600" : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    Location meublée
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Motif du départ (optionnel — permet un préavis réduit)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {([
                    { value: "normal", label: "Départ normal", desc: "Sans motif particulier" },
                    { value: "mutation", label: "Mutation professionnelle", desc: "Nouvelle prise de fonction > 50 km" },
                    { value: "perte_emploi", label: "Perte d'emploi", desc: "Licenciement, rupture conventionnelle" },
                    { value: "sante", label: "Raisons de santé", desc: "Certificat médical requis" },
                  ] as { value: NoticeType; label: string; desc: string }[]).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNoticeType(option.value)}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        noticeType === option.value ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <div className="font-semibold text-stone-900">{option.label}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={calculate}
              className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-colors"
            >
              Calculer mon préavis
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
              <div className="text-center mb-6">
                <div className="text-xs text-stone-500 uppercase tracking-wide mb-2">Durée de préavis légale</div>
                <div className="text-5xl font-bold text-blue-700">{result.months} <span className="text-2xl">mois</span></div>
              </div>

              <div className="space-y-4">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Date de fin de préavis (estimation)</div>
                  <div className="text-lg font-bold text-stone-900">À partir du {result.endDate}</div>
                  <p className="text-sm text-stone-500 mt-1">Le préavis commence dès réception de votre lettre recommandée par le bailleur.</p>
                </div>

                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Base légale</div>
                  <div className="text-sm text-stone-700 font-medium">{result.legalBasis}</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-blue-800 leading-relaxed">{result.explanation}</div>
                </div>

                {noticeType === "normal" && isZoneTendue === false && !isFurnished && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <div>
                        <p className="text-sm text-yellow-800 font-semibold">Astuce</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Si vous trouvez un locataire qui reprend le bail avant la fin du préavis, le propriétaire peut être tenu de vous libérer du loyers剩余部分. Négociez avec votre bailleur.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zone Tendue List */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Principales communes en zone tendue</h2>
            <p className="text-stone-600 text-sm mb-4">
              Ces communes ont un préavis réduit à 1 mois pour tous les types de location depuis la loi ALUR 2014.
            </p>
            <div className="flex flex-wrap gap-2">
              {ZONES_TENDUES.map((city) => (
                <span key={city} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-4">
              Source : décret zones tendues. Vérifiez le classement exact de votre commune sur service-public.fr.
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
            <h2 className="text-xl font-bold text-stone-900 mb-4">Outils complémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/modeles/conge-locataire" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle de Congé Locataire</div>
                  <div className="text-sm text-stone-500">Lettre de résiliation de bail</div>
                </div>
              </Link>
              <Link href="/outils/lettre-relance-loyer" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">✉️</span>
                <div>
                  <div className="font-semibold text-stone-900">Lettre de Relance Loyer</div>
                  <div className="text-sm text-stone-500">Avant de partir, vérifiez vos paiements</div>
                </div>
              </Link>
              <Link href="/glossaire-immobilier" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-semibold text-stone-900">Glossaire Immobilier</div>
                  <div className="text-sm text-stone-500">Toutes les définitions légales</div>
                </div>
              </Link>
              <Link href="/modeles/bail-vide" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📝</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle de Bail de Location</div>
                  <div className="text-sm text-stone-500">Conforme à la loi 1989</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Gérez vos locations en toute conformité</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Avec RentReady, vous avez accès à tous les modèles de documents, calculs légaux, et suivi de vos obligations baillistes.
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