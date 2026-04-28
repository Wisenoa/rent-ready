"use client";

import { useState } from "react";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

// French cities classified as "zone tendue" (tight rental market)
const ZONES_TENDUES = [
  "Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse",
  "Nantes", "Strasbourg", "Rennes", "Grenoble", "Montpellier", "Nice",
  "Angers", "Le Havre", "Saint-Étienne", "Grenoble", "Aix-en-Provence",
  "Brest", "Nîmes", "Le Mans", "Dijon", "Clermont-Ferrand", "Tours",
  "Amiens", "Limoges", "Metz", "Orléans", "Perpignan", "Béziers",
];

const ZONE_TENDUE_DEPT = [
  75, 69, 13, 33, 59, 31, 44, 67, 35, 38, 34, 6,
  49, 76, 42, 26, 29, 30, 72, 21, 63, 37, 80, 87, 57, 45, 66, 34,
];

const faqData = [
  {
    question: "Qu'est-ce qu'une zone tendue ?",
    answer:
      "Une zone tendue est une zone géographique où il existe un déséquilibre important entre l'offre et la demande de logements. En France, les villes de plus de 50 000 habitants avec un marché locatif tendu sont classées comme telles. Dans ces zones, le dépôt de garantie est limité à 1 mois de loyer (contre 2 mois en zone non tendue).",
  },
  {
    question: "Le dépôt de garantie est-il restitué à la fin du bail ?",
    answer:
      "Oui, le dépôt de garantie doit être restitué au locataire dans les 2 mois suivant la remise des clés, déduction faite des sommes dues au titre des éventuels dégradations ou impayés. Si des retenues sont faites, le propriétaire doit fournir un état exécutoire des sommes retenues.",
  },
  {
    question: "Peut-on demander une caution en plus du dépôt ?",
    answer:
      "Oui, en plus du dépôt de garantie, le bailleur peut demander au locataire de fournir une caution (garant), c'est-à-dire un tiers qui s'engage à payer en cas de défaillance. La caution peut être un garant physique (parent, ami) ou une garantie loyers impayés (GLI) via une assurance.",
  },
  {
    question: "Le dépôt de garantie doit-il être bloqué sur un compte ?",
    answer:
      "Depuis la loi ALUR de 2014, le dépôt de garantie doit être restitué dans les mêmes conditions que le loyer. En pratique, le propriétaire verse le dépôt sur son compte mais doit pouvoir le restituer en cas de départ dans les règles. Certains dispositifs (type LOCAMASS) permettent de sécurisé le dépôt.",
  },
  {
    question: "La règle du dépôt est-elle différente pour une location meublée ?",
    answer:
      "En zone tendue, le dépôt maximum est limité à 1 mois, que le bien soit meublé ou vide. En zone non tendue, le dépôt peut atteindre 2 mois pour une location meublée (contre 1 mois pour le vide), quelle que soit la zone.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Caution", href: "/outils/calculateur-caution" },
];

function DepositCalculatorInner() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [zoneType, setZoneType] = useState<"tendue" | "non-tendue">("non-tendue");
  const [isFurnished, setIsFurnished] = useState(false);
  const [result, setResult] = useState<{
    maxDeposit: number;
    oneMonth: number;
    twoMonths: number;
    rule: string;
  } | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent);
    if (isNaN(rent) || rent <= 0) return;

    const max = rent * (zoneType === "tendue" ? 1 : 2);
    setResult({
      maxDeposit: max,
      oneMonth: rent,
      twoMonths: max,
      rule:
        zoneType === "tendue"
          ? "En zone tendue, le dépôt ne peut pas dépasser 1 mois de loyer (hors charges) pour les locations vides et meublées."
          : isFurnished
          ? "En zone non tendue, le dépôt peut atteindre 2 mois pour les locations meublées et 1 mois pour les locations vides."
          : "En zone non tendue, le dépôt maximum est de 2 mois pour les locations vides et meublées.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="monthlyRent" className="block text-sm font-semibold text-stone-700 mb-1">
              Loyer mensuel hors charges (€)
            </label>
            <input
              id="monthlyRent"
              type="number"
              min="0"
              step="10"
              placeholder="Ex. : 750"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Type de zone
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setZoneType("tendue")}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  zoneType === "tendue"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-stone-200 text-stone-500 hover:border-blue-300"
                }`}
              >
                Zone tendue
              </button>
              <button
                type="button"
                onClick={() => setZoneType("non-tendue")}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  zoneType === "non-tendue"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-stone-200 text-stone-500 hover:border-blue-300"
                }`}
              >
                Zone non tendue
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Type de location
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFurnished(false)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  !isFurnished
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-stone-200 text-stone-500 hover:border-blue-300"
                }`}
              >
                Location vide
              </button>
              <button
                type="button"
                onClick={() => setIsFurnished(true)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  isFurnished
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-stone-200 text-stone-500 hover:border-blue-300"
                }`}
              >
                Location meublée
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors shadow-sm"
          >
            Calculer le maximum légal
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-6 md:p-8">
          <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-4">
            Dépôt de garantie maximum
          </h3>
          <div className="text-4xl font-bold text-green-700 mb-4">
            {result.maxDeposit.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
          <div className="space-y-2 text-stone-700 text-sm">
            <div className="flex justify-between">
              <span>1 mois de loyer</span>
              <span className="font-semibold">
                {(parseFloat(monthlyRent) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>2 mois de loyer</span>
              <span className="font-semibold">
                {result.twoMonths.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <p className="text-sm text-stone-600">{result.rule}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function DepositCalculatorClient() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🔐</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Caution de Loyer
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Calculez le montant maximum de dépôt de garantie légal pour votre location selon la zone et le type de bail.
            </p>
          </div>

          <div className="mb-10">
            <DepositCalculatorClient />
          </div>

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Les règles du dépôt de garantie en France
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              Le dépôt de garantie est une somme versée par le locataire au propriétaire lors de la signature du bail.
              Il sert à couvrir d'éventuels impayés ou dégradations à la fin du bail.
            </p>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">En zone tendue</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <ul className="list-disc pl-5 space-y-2 text-stone-700 text-sm">
                <li>Location vide : dépôt maximum = <strong>1 mois de loyer</strong></li>
                <li>Location meublée : dépôt maximum = <strong>1 mois de loyer</strong></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">En zone non tendue</h3>
            <div className="bg-stone-100 rounded-xl p-4 mb-4">
              <ul className="list-disc pl-5 space-y-2 text-stone-700 text-sm">
                <li>Location vide : dépôt maximum = <strong>2 mois de loyer</strong></li>
                <li>Location meublée : dépôt maximum = <strong>2 mois de loyer</strong></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-stone-800 mb-3">Comment savoir si votre ville est en zone tendue ?</h3>
            <p className="text-stone-700 leading-relaxed mb-2">
              Les zones tendues sont définies par arrêté préfectoral. En général, elles incluent :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>Paris et la petite couronne</li>
              <li>Les grandes métropoles régionales (Lyon, Marseille, Bordeaux, Lille, Toulouse...)</li>
              <li>Les villes de plus de 50 000 habitants avec un marché locatif tendu</li>
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
  );
}
