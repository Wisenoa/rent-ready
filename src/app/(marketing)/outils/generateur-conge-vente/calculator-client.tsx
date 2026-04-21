"use client";

import { useState } from "react";
import Link from "next/link";

const INFO = [
  {
    title: "congé pour vente : ce qu'il faut savoir",
    content: "Le congé pour vente est la notification par laquelle le propriétaire informe son locataire qu'il entend vendre le bien loué. Ce congé doit être délivré au moins 6 mois avant la fin du bail (ou 3 mois pour une location meublée saisonnière).",
  },
  {
    title: "Congé pour vente = droit de préemption du locataire",
    content: "Lors d'un congé pour vente, le locataire bénéficie d'un droit de préemption : il peut acheter le bien aux mêmes conditions. Le propriétaire doit donc lui proposer la vente en premier.",
  },
  {
    title: "Forme et délai du congé",
    content: "Le congé pour vente doit être adressé par lettre recommandée avec accusé de réception, ou signifié par huissier. Il doit être délivré au moins 6 mois avant la fin du bail. En pratique, il est recommandé de le envoyer 7 mois avant pour tenir compte des délais postaux.",
  },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function CongeVenteClient() {
  const [formData, setFormData] = useState({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    tenantAddress: "",
    propertyAddress: "",
    propertyType: "vide",
    leaseStartDate: "",
    salePrice: "",
    notaryName: "",
    notaryAddress: "",
    agentName: "",
    agentAddress: "",
  });

  const [result, setResult] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const generate = () => {
    if (!formData.landlordName || !formData.tenantName || !formData.propertyAddress || !formData.leaseStartDate) return;

    const today = new Date();
    const endOfBail = new Date(formData.leaseStartDate);
    endOfBail.setFullYear(endOfBail.getFullYear() + 1);
    const sixMonthsBefore = new Date(endOfBail);
    sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);

    const letter = `
LETTRE RECOMMANDEE AVEC ACCUSE DE RECEPTION

[Nom et Prénom du Bailleur]
[Adresse du Bailleur]

À [Ville], le ${formatDate(today)}

À l'attention de [Nom et Prénom du Locataire]
[Adresse du bien loué]

Objet : Congé pour vente du bien situé [adresse complète du bien]

Madame, Monsieur,

Par la présente, nous avons l'honneur de vous notifier notre décision de donner congé pour vente du logement que vous occupez en vertu d'un bail sous seing privé en date du ${formData.leaseStartDate}, et portant sur le bien situé :

${formData.propertyAddress}

Ce congé vous est notifié conformément aux dispositions des articles 15 et 15-1 de la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs.

Vous êtes informé(e) que, conformément à l'article 15 de la loi du 6 juillet 1989, vous bénéficiez d'un droit de préemption vous permettant d'acquérir le bien susvisé aux conditions et prix qui seront convenus.

À cet effet, nous vous informons que :

- Prix de vente envisagé : ${formData.salePrice || "[à compléter]"}
- Le bien sera vendu libre de toute occupation

Vous disposerez d'un délai de deux mois à compter de la notification du présent congé pour nous faire connaître votre intention d'acquérir le bien. Passé ce délai, votre silence sera considéré comme un refus.

Si vous choisissez de ne pas user de votre droit de préemption, nous vous remercions de bien vouloir libérer les lieux à l'échéance de votre bail, soit le ${formatDate(endOfBail)}.

Nous restons à votre disposition pour tout renseignement complémentaire.

Veuillez agréer, Madame, Monsieur, l'assurance de nos salutations distinguées.

${formData.landlordName}

${formData.notaryName ? `Notaire chargé de la transaction :\n${formData.notaryName}\n${formData.notaryAddress}` : ""}

${formData.agentName ? `Agence chargée de la vente :\n${formData.agentName}\n${formData.agentAddress}` : ""}
`.trim();

    setResult(letter);
  };

  return (
    <div className="space-y-8">
      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-bold text-amber-800 mb-3">⚠️ Informations importantes</h2>
        <div className="space-y-3">
          {INFO.map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-amber-900 text-sm">{item.title}</h3>
              <p className="text-amber-700 text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-5">Vos informations</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Nom et Prénom du Bailleur</label>
              <input type="text" value={formData.landlordName} onChange={(e) => update("landlordName", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. : Dupont Jean" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Adresse du Bailleur</label>
              <input type="text" value={formData.landlordAddress} onChange={(e) => update("landlordAddress", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. : 12 rue de la Paix, 75002 Paris" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Nom et Prénom du Locataire</label>
              <input type="text" value={formData.tenantName} onChange={(e) => update("tenantName", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. : Martin Sophie" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Adresse du bien loué</label>
              <input type="text" value={formData.tenantAddress} onChange={(e) => update("tenantAddress", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="même adresse que le bien" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Adresse complète du bien</label>
            <input type="text" value={formData.propertyAddress} onChange={(e) => update("propertyAddress", e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex. : 45 avenue des Champs, 75008 Paris" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Date de début du bail</label>
              <input type="date" value={formData.leaseStartDate} onChange={(e) => update("leaseStartDate", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Prix de vente envisagé (€)</label>
              <input type="text" value={formData.salePrice} onChange={(e) => update("salePrice", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. : 350 000" />
            </div>
          </div>

          <details className="group">
            <summary className="cursor-pointer text-sm text-blue-600 font-semibold hover:text-blue-700">
              + Informations optionnelles (notaire, agence)
            </summary>
            <div className="mt-4 space-y-4 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Nom du Notaire</label>
                  <input type="text" value={formData.notaryName} onChange={(e) => update("notaryName", e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optionnel" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Adresse du Notaire</label>
                  <input type="text" value={formData.notaryAddress} onChange={(e) => update("notaryAddress", e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optionnel" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Agence immobilière</label>
                  <input type="text" value={formData.agentName} onChange={(e) => update("agentName", e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optionnel" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Adresse de l'agence</label>
                  <input type="text" value={formData.agentAddress} onChange={(e) => update("agentAddress", e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optionnel" />
                </div>
              </div>
            </div>
          </details>

          <button
            type="button"
            onClick={generate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
          >
            Générer le congé pour vente
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-stone-800">Votre lettre de congé pour vente</h2>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Copier
            </button>
          </div>
          <pre className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
            {result}
          </pre>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>⚠️ Important :</strong> Envoyez cette lettre en <strong>lettre recommandée avec accusé de réception</strong>. Conservez une copie et l'accusé de réception comme preuve. Nous vous recommandons de faire vérifier ce document par un avocat avant envoi.
            </p>
          </div>
        </div>
      )}

      {/* Related links */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/modeles/conge-proprietaire" className="text-blue-600 hover:underline">Modèle congé propriétaire →</Link>
        <Link href="/modeles/bail-vide" className="text-blue-600 hover:underline">Modèle bail vide →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
