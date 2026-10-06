"use client";

import { useState } from "react";
import Link from "next/link";

const CHARGES_TYPES = [
  { name: "Eau froide collective", typical: 150 },
  { name: "Chauffage collectif", typical: 800 },
  { name: "Ascenseur", typical: 200 },
  { name: "Entretien parties communes", typical: 150 },
  { name: "Taxe ordures ménagères", typical: 120 },
  { name: "Assurance copropriété", typical: 100 },
  { name: "Électricité parties communes", typical: 100 },
  { name: "Gestion et administration", typical: 150 },
];

const FAQ = [
  {
    question: "Qu'est-ce que la provision sur charges locatives ?",
    answer:
      "La provision sur charges est le montant mensuel estimé que le bailleur Demande au locataire pour couvrir les charges de copropriété récupérables. Elle est recalculée chaque année lors de la régularisation annuelle.",
  },
  {
    question: "Quelles charges sont récupérables auprès du locataire ?",
    answer:
      "Les charges récupérables (article 7 de la loi du 6 juillet 1989) comprennent : l'eau froide, le chauffage collectif, l'ascenseur, l'entretien des parties communes, la taxe d'enlèvement des ordures ménagères (TEOM), la taxe de balayage, et les frais de gestion. Les charges non récupérables (gros travaux, extension) sont à la charge du bailleur.",
  },
  {
    question: "Comment se fait la régularisation annuelle des charges ?",
    answer:
      "Une fois par an, le bailleur doit établir un Décompte de charges réel basé sur les factures de copropriété. Si les provisions versées sont supérieures aux dépenses réelles, le trop-perçu est restitué au locataire dans le mois suivant. Si les provisions sont insuffisantes, le complément est réclamé au locataire.",
  },
  {
    question: "Le bailleur peut-il garder un excédent de charges ?",
    answer:
      "Non, le bailleur n'a pas le droit de conserver un excédent de provisions. Le trop-perçu doit être restitué au locataire dans le mois suivant la régularisation. En cas d'excédent permanent sans restitution, le locataire peut saisir la commission de conciliation.",
  },
  {
    question: "Quelle est la différence entre provisions et charges réelles ?",
    answer:
      "Les provisions sont des estimations mensuelles versées par le locataire. Les charges réelles sont les dépenses Effectives de copropriété. La régularisation annuelle permet d'ajuster les provisions aux réalités des dépenses. Une provision mal estimée entraine soit un complément à payer pour le locataire, soit un trop-perçu à restituer.",
  },
];

interface Result {
  annualTotal: number;
  monthlyProvision: number;
  monthlyProvisionPerSqm: number;
  sharePercent: number;
  breakdown: { name: string; annual: number; monthly: number }[];
}

export function ProvisionChargesClient() {
  const [totalAnnual, setTotalAnnual] = useState("");
  const [propertySurface, setPropertySurface] = useState("");
  const [totalBuildingSurface, setTotalBuildingSurface] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const total = parseFloat(totalAnnual) || 0;
    const propSurf = parseFloat(propertySurface) || 0;
    const buildSurf = parseFloat(totalBuildingSurface) || 1;

    if (total <= 0 || propSurf <= 0) return;

    const sharePercent = (propSurf / buildSurf) * 100;
    const shareAnnual = (total * sharePercent) / 100;
    const monthlyProvision = shareAnnual / 12;
    const monthlyPerSqm = monthlyProvision / propSurf;

    const breakdown = CHARGES_TYPES.map((c) => ({
      name: c.name,
      annual: (c.typical / 1500) * shareAnnual,
      monthly: ((c.typical / 1500) * shareAnnual) / 12,
    })).filter((b) => b.annual > 0);

    setResult({
      annualTotal: Math.round(shareAnnual * 100) / 100,
      monthlyProvision: Math.round(monthlyProvision * 100) / 100,
      monthlyProvisionPerSqm: Math.round(monthlyPerSqm * 100) / 100,
      sharePercent: Math.round(sharePercent * 100) / 100,
      breakdown,
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Charges annuelles totales de copropriété (€)</label>
            <input type="number" min="0" step="100" value={totalAnnual} onChange={(e) => { setTotalAnnual(e.target.value); setResult(null); }} placeholder="Ex. : 5000" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-stone-400 mt-1">Consultez votre appel de fonds annuel de copropriété</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Surface habitable de votre lot (m²)</label>
            <input type="number" min="0" step="1" value={propertySurface} onChange={(e) => { setPropertySurface(e.target.value); setResult(null); }} placeholder="Ex. : 65" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Surface totale habitable de la copropriété (m²)</label>
            <input type="number" min="0" step="1" value={totalBuildingSurface} onChange={(e) => { setTotalBuildingSurface(e.target.value); setResult(null); }} placeholder="Ex. : 2000" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-stone-400 mt-1">Surface totale de l'immeuble (voir charges de copropriété)</p>
          </div>
          <button type="button" onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-base">
            Calculer la provision
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-stone-500 mb-1">Provision mensuelle recommandée</p>
              <p className="text-4xl font-bold text-green-700">{result.monthlyProvision.toLocaleString("fr-FR")} €</p>
              <p className="text-sm text-stone-500 mt-1">soit {result.monthlyProvisionPerSqm.toFixed(2)} € / m² par mois</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-green-200 pt-4">
              <div className="text-center">
                <p className="text-xs text-stone-500">Quote-part</p>
                <p className="text-lg font-bold text-stone-800">{result.sharePercent.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-stone-500">Charges annuelles (votre quote-part)</p>
                <p className="text-lg font-bold text-stone-800">{result.annualTotal.toLocaleString("fr-FR")} €</p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-3">
              <p className="text-xs text-stone-500">
                Provision calculée au prorata de la surface ({result.sharePercent.toFixed(2)}% de la surface totale).
                La régularisation annuelle permet d'ajuster selon les dépenses réelles.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">📋 Charges récupérables vs non récupérables</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-sm font-semibold text-green-700 mb-1">✅ Récupérables</p>
            <ul className="text-xs text-green-700 space-y-0.5">
              <li>• Eau froide, chauffage collectif</li>
              <li>• Ascenseur, entretian parties communes</li>
              <li>• Taxe d'enlèvement des ordures (TEOM)</li>
              <li>• Frais de gestion de copropriété</li>
              <li>• Électricité parties communes</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">❌ Non récupérables</p>
            <ul className="text-xs text-red-700 space-y-0.5">
              <li>• Gros travaux et rénovation (ravalement)</li>
              <li>• Création de新的 parties communes</li>
              <li>• Charges de personnels salariés</li>
              <li>• Frais de réunion de copropriété</li>
              <li>• Menues réparations (à la charge bailleur)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-6">Questions fréquentes</h2>
        <div className="space-y-5">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
              <p className="text-stone-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/outils/calculateur-charges-locatives" className="text-blue-600 hover:underline">Calculateur charges locatives →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
