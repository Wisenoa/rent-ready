"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ = [
  {
    question: "Quand une indemnité de préavis est-elle due ?",
    answer:
      "L'indemnité de préavis est due lorsque le locataire donne son préavis (dépôt de garantie dans ce cas sert souvent de garantie). Le bailleur peut réclamer une indemnité si le locataire part avant la fin du préavis effectif. Inversement, si le bailleur donne préavis sans motif légitime, il peut devoir une indemnité.",
  },
  {
    question: "Quelle est la durée de préavis en zone tendue ?",
    answer:
      "En zone tendue (villes de plus de 50 000 habitants avec déséquilibre offre/demande), le délai de préavis du locataire est réduit à 1 mois (au lieu de 3). Cette réduction s'applique automatiquement si le locataire est dans l'une des situations prévues : mutation professionnelle, perte d'emploi, nouvelle situation professionnelle exigeant un rapprochement.",
  },
  {
    question: "Le dépôt de garantie peut-il servir d'indemnité de préavis ?",
    answer:
      "Non, le dépôt de garantie et l'indemnité de préavis sont deux choses distinctes. Le dépôt de garantie garantit l'état du logement et les impayés. L'indemnité de préavis compense le manque à gagner du bailleur si le locataire part avant la fin du délai de préavis.",
  },
  {
    question: "Comment est calculée l'indemnité de préavis ?",
    answer:
      "L'indemnité ne peut pas dépasser le montant du loyer et des charges. Elle est calculée au prorata des jours restants si le préavis est plus court que 1 mois. Exemple : 15 jours restants avec un loyer de 900 € = 450 € d'indemnité.",
  },
  {
    question: "Le bailleur peut-il réclamer une indemnité si le locataire part avant 1 mois ?",
    answer:
      "Si le locataire part avant la fin de son préavis effectif, le bailleur peut réclamer une indemnité correspondant à la période non occupée, dans la limite du montant du loyer. Si le bailleur reprends le logement avec un préavis réduit (1 mois en zone tendue), l'indemnité n'est pas applicable.",
  },
];

interface Result {
  monthlyRent: number;
  noticeMonths: number;
  noticeDays: number;
  indemnity: number;
  formula: string;
  note: string;
}

export function IndemnitePreavisClient() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [noticeType, setNoticeType] = useState<"tenant_tensed" | "tenant_untensed" | "landlord" | "landlord_legitimate">("tenant_tensed");
  const [daysRemaining, setDaysRemaining] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent);
    const days = parseInt(daysRemaining) || 0;
    if (isNaN(rent) || rent <= 0) return;

    let indemnity = 0;
    let note = "";
    let formula = "";

    switch (noticeType) {
      case "tenant_tensed":
        // Zone tendue : préavis 1 mois
        indemnity = rent;
        formula = `${rent.toLocaleString("fr-FR")} € × 1 mois = ${rent.toLocaleString("fr-FR")} €`;
        note = "Préavis de 1 mois applicable en zone tendue";
        break;
      case "tenant_untensed":
        // Zone non tendue : préavis 3 mois
        indemnity = rent;
        formula = `${rent.toLocaleString("fr-FR")} € × 1 mois = ${rent.toLocaleString("fr-FR")} €`;
        note = "Préavis de 3 mois en zone non tendue — l'indemnité maximale est 1 mois";
        break;
      case "landlord":
        // Bailleur : préavis 3 mois (ou 6 mois motif légitime)
        indemnity = rent;
        formula = `${rent.toLocaleString("fr-FR")} € × 1 mois = ${rent.toLocaleString("fr-FR")} €`;
        note = "Préavis de 3 mois pour le bailleur — indemnité maximale 1 mois";
        break;
      case "landlord_legitimate":
        // Motif légitime bailleur : préavis 6 mois
        if (days > 0) {
          indemnity = Math.round((rent / 30) * days * 100) / 100;
          formula = `${rent.toLocaleString("fr-FR")} € / 30 jours × ${days} jours = ${indemnity.toLocaleString("fr-FR")} €`;
          note = `Indemnité au prorata des ${days} jours restants après le préavis de 6 mois`;
        } else {
          indemnity = rent * 3;
          formula = `${rent.toLocaleString("fr-FR")} € × 3 mois = ${(rent * 3).toLocaleString("fr-FR")} €`;
          note = "Préavis de 6 mois — indemnité maximale 3 mois";
        }
        break;
    }

    setResult({
      monthlyRent: rent,
      noticeMonths: noticeType === "tenant_tensed" ? 1 : noticeType === "landlord_legitimate" ? 6 : 3,
      noticeDays: days,
      indemnity,
      formula,
      note,
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Loyer mensuel hors charges (€)</label>
            <input type="number" min="0" step="10" value={monthlyRent} onChange={(e) => { setMonthlyRent(e.target.value); setResult(null); }} placeholder="Ex. : 850" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Type de préavis</label>
            <div className="space-y-2">
              {[
                { value: "tenant_tensed", label: "Locataire en zone tendue", desc: "Délai de préavis : 1 mois" },
                { value: "tenant_untensed", label: "Locataire en zone non tendue", desc: "Délai de préavis : 3 mois" },
                { value: "landlord", label: "Bailleur (reprise normale)", desc: "Délai de préavis : 3 mois" },
                { value: "landlord_legitimate", label: "Bailleur avec motif légitime", desc: "Délai de préavis : 6 mois" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <input type="radio" name="noticeType" value={opt.value} checked={noticeType === opt.value} onChange={() => { setNoticeType(opt.value as typeof noticeType); setResult(null); }} className="accent-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{opt.label}</p>
                    <p className="text-xs text-stone-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {noticeType === "landlord_legitimate" && (
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Jours restants après préavis de 6 mois <span className="text-stone-400 font-normal">(optionnel)</span></label>
              <input type="number" min="0" max="30" value={daysRemaining} onChange={(e) => { setDaysRemaining(e.target.value); setResult(null); }} placeholder="Ex. : 15" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-stone-400 mt-1">Laissez vide pour calculer l'indemnité maximale de 3 mois</p>
            </div>
          )}

          <button type="button" onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-base">
            Calculer l'indemnité
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-stone-500 mb-1">Indemnité de préavis maximale</p>
              <p className="text-4xl font-bold text-green-700">{result.indemnity.toLocaleString("fr-FR")} €</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-stone-500 mb-1">Formule</p>
              <p className="text-sm font-mono text-stone-700">{result.formula}</p>
            </div>
            <p className="text-xs text-stone-500 mt-3 text-center">{result.note}</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">📋 Bon à savoir</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ L'indemnité de préavis ne peut pas dépasser le montant du loyer mensuel</li>
          <li>✅ Pour le locataire, elle correspond généralement à 1 mois (peu importe la durée restante)</li>
          <li>✅ Si le préavis est déjà partiellement effectué, l'indemnité est réduite au prorata</li>
          <li>✅ En zone tendue, le locataire n'a qu'un mois de préavis — donc indemnité maximale = 1 mois</li>
          <li>✅ Le bailleur qui donne préavis pour vendre ou habiter doit 3 mois minimum</li>
        </ul>
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
        <Link href="/outils/calculateur-preavis" className="text-blue-600 hover:underline">Calculateur préavis →</Link>
        <Link href="/guides/modele-bail" className="text-blue-600 hover:underline">Guide bail de location →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
