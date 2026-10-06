"use client";

import { useState } from "react";
import Link from "next/link";

const LEGAL_INTEREST_RATE = 3; // Taux d'intérêt légal en France
const MONTHS_PROCEDURE = 3; // Délai moyen procédure (mois)

const FAQ = [
  {
    question: "À partir de combien de jours un loyer est-il considéré comme impayé ?",
    answer:
      "Un loyer est considéré comme impayé dès le premier jour après la date d'échéance prévue dans le bail. La mayoría des baux prévoit un délai de grâce de quelques jours avant mise en demeure. Dès 1 mois d'impayé, le bailleur peut engager une procédure d'expulsion.",
  },
  {
    question: "Quelles pénalités peuvent être réclamées pour un loyer impayé ?",
    answer:
      "Le bailleur peut réclamer : (1) les intérêts de retard au taux légal (3% par an en 2026), (2) une indemnité pour trouble de jouissance, (3) les frais de procédure (huissier, avocat). Le taux de pénalité ne peut pas dépasser 10% du loyer mensuel hors charges.",
  },
  {
    question: "Comment lancer une procédure d'expulsion pour impayé de loyer ?",
    answer:
      "La procédure comprends : (1) la mise en demeure avec délai de 8 jours, (2) le commandement de payer delivered par huissier, (3) le assignment au tribunal judiciaire, (4) l'obtention d'un titre exécutoire, (5) l'intervention d'un Commissaire de Justice pour l'expulsion. La durée totale est généralement de 6 à 18 mois.",
  },
  {
    question: "La garantie Visale peut-elle couvrir les impayés ?",
    answer:
      "Oui, si le locataire bénéficie du dispositif Visale (腻Evolution du logement pour les salaries en mutation), Action Logement garantit le paiement des loyers impayés jusqu'à 9 mois. Le bailleur est remboursé dans les 30 jours suivant la constatation de l'impayé.",
  },
  {
    question: "Le bailleur peut-il résilier le bail immédiatement en cas d'impayé ?",
    answer:
      "Non, même en cas d'impayé, le bailleur doit respecter la procédure légale. Il faut d'abord mettre en demeure le locataire, puis si l'impayé persiste (généralement plus de 2 mois), saisir le tribunal pour obtenir la résiliation du bail et l'expulsion.",
  },
];

interface Result {
  totalUnpaid: number;
  monthsUnpaid: number;
  penaltyRate: number;
  lateFees: number;
  disturbanceCompensation: number;
  totalDue: number;
  legalNoticeMonths: number;
  evictionTimeline: string;
}

export function ImpayesLoyerClient() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [charges, setCharges] = useState("");
  const [monthsUnpaid, setMonthsUnpaid] = useState("1");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const rent = parseFloat(monthlyRent) || 0;
    const ch = parseFloat(charges) || 0;
    const months = parseInt(monthsUnpaid) || 1;

    if (rent <= 0) return;

    const totalUnpaid = (rent + ch) * months;
    const lateFees = totalUnpaid * (LEGAL_INTEREST_RATE / 100) * (months / 12);
    const disturbanceCompensation = Math.min(rent * 0.10, 150); // max 10% du loyer ou 150€
    const totalDue = totalUnpaid + lateFees + disturbanceCompensation;

    setResult({
      totalUnpaid: Math.round(totalUnpaid * 100) / 100,
      monthsUnpaid: months,
      penaltyRate: LEGAL_INTEREST_RATE,
      lateFees: Math.round(lateFees * 100) / 100,
      disturbanceCompensation: Math.round(disturbanceCompensation * 100) / 100,
      totalDue: Math.round(totalDue * 100) / 100,
      legalNoticeMonths: MONTHS_PROCEDURE,
      evictionTimeline: months >= 2 ? "Procédure d'évacuation possibile" : "Relance amiable recommandable",
    });
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres de l'impayé</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Loyer mensuel hors charges (€)</label>
            <input type="number" min="0" step="10" value={monthlyRent} onChange={(e) => { setMonthlyRent(e.target.value); setResult(null); }} placeholder="Ex. : 850" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Charges mensuelles (€) <span className="text-stone-400 font-normal">(optionnel)</span></label>
            <input type="number" min="0" step="10" value={charges} onChange={(e) => { setCharges(e.target.value); setResult(null); }} placeholder="Ex. : 100" className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Nombre de mois d'impayé</label>
            <input type="number" min="1" max="24" step="1" value={monthsUnpaid} onChange={(e) => { setMonthsUnpaid(e.target.value); setResult(null); }} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="button" onClick={calculate} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors text-base">
            Calculer le montant de l'impayé
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-300 rounded-xl p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-red-500 mb-1">Total des sommes dues</p>
                <p className="text-4xl font-bold text-red-700">{result.totalDue.toLocaleString("fr-FR")} €</p>
              </div>
              <div className="space-y-3 border-t border-red-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Loyers et charges impayés ({result.monthsUnpaid} mois)</span>
                  <span className="font-semibold text-stone-800">{result.totalUnpaid.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Intérêts de retard ({result.penaltyRate}%/an)</span>
                  <span className="font-semibold text-stone-800">{result.lateFees.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Indemnité pour trouble de jouissance</span>
                  <span className="font-semibold text-stone-800">{result.disturbanceCompensation.toLocaleString("fr-FR")} €</span>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-3">
                <p className="text-xs text-stone-500">
                  <strong>Important :</strong> Ces montants sont des estimations à titre indicatif. Consultez un avocat ou saisissez la commission de conciliation pour faire valoir vos droits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
        <h3 className="font-bold text-amber-800 mb-2">⚠️ Procédure légale à suivre</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">1.</span>
            <p className="text-sm text-amber-700"><strong>Jour 1-15 :</strong> Relance amiable par courrier ou email</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">2.</span>
            <p className="text-sm text-amber-700"><strong>Jour 15+ :</strong> Mise en demeure avec accusé de réception (délai de 8 jours)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">3.</span>
            <p className="text-sm text-amber-700"><strong>2 mois+ :</strong> Assignation au tribunal judiciaire</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">4.</span>
            <p className="text-sm text-amber-700"><strong>6-18 mois :</strong> Expulsion éventuelle avec Commissaire de Justice</p>
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
        <Link href="/outils/lettre-relance-loyer" className="text-blue-600 hover:underline">Générateur lettre de relance →</Link>
        <Link href="/guides/relance-loyer" className="text-blue-600 hover:underline">Guide relance loyer →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Protéger mon bien →</Link>
      </div>
    </div>
  );
}
