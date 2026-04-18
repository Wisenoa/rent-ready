"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { Download } from "lucide-react";

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Lettre de Relance Loyer", href: "/outils/lettre-relance-loyer" },
];

const faqData = [
  {
    question: "Quand envoyer une lettre de relance ?",
    answer:
      "En pratique, on attend 5 à 10 jours après la date d'échéance pour laisser le temps au virement d'être traité. Passé 30 jours, il est recommandé d'engager la procédure formelle de relance en recommandé avec accusé de réception pour préserver vos droits.",
  },
  {
    question: "La lettre de relance doit-elle être en recommandée ?",
    answer:
      "Pour la première relance amiable (email ou courrier simple), le recommandé n'est pas obligatoire. En revanche, la mise en demeure qui précède toute procédure judiciaire DOIT être envoyée en recommandée avec accusé de réception pour avoir une valeur juridique probante.",
  },
  {
    question: "Que faire si le locataire ne paie toujours pas ?",
    answer:
      "Si le loyer reste impayé malgré la mise en demeure, vous pouvez activer la clause résolutoire du bail et engager une procédure judiciaire. Attention : la trêve hivernale (1er novembre au 31 mars) suspend les procédures d'expulsion.",
  },
  {
    question: "Puis-je déduire les impayés de mes revenus ?",
    answer:
      "Les loyers impayés ne sont pas déductibles tant qu'ils ne sont pas définitivement perdus (procédure judiciaire épuisée, locataire insolvable). Conservez tous les courriers et preuves de relances pour documenter votre dossier.",
  },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Générateur de Lettre de Relance Loyer",
      description: "Générez une lettre de relance loyer impayé et une mise en demeure conforme. Prête à envoyer en recommandé.",
      url: "https://www.rentready.fr/outils/lettre-relance-loyer",
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

export function LettreRelanceClient() {
  const [formData, setFormData] = useState({
    bailleurNom: "",
    bailleurAdresse: "",
    bailleurCodePostal: "",
    bailleurVille: "",
    locataireNom: "",
    locataireAdresse: "",
    bienAdresse: "",
    montantDu: "",
    periode: "",
    iban: "",
    delai: "10",
  });
  const [letterType, setLetterType] = useState<"relance" | "miseEnDemeurer">("relance");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function generateLetter(): string {
    const { bailleurNom, bailleurAdresse, bailleurCodePostal, bailleurVille, locataireNom, locataireAdresse, bienAdresse, montantDu, periode, iban, delai } = formData;

    const objet = letterType === "relance"
      ? `Objet : Relance pour impayé de loyer — ${bienAdresse}`
      : `Objet : Mise en demeure pour impayé de loyer — ${bienAdresse}`;

    const contenu = letterType === "relance"
      ? `Par la présente, je me permets de vous rappeler que le loyer du mois de ${periode}, d'un montant de ${montantDu} EUR, n'a pas été réglé à ce jour.\n\nJe vous prie de bien vouloir effectuer le règlement dans un délai de ${delai} jours à compter de la réception du présent courrier, par virement bancaire sur mon compte :\n\nTitulaire : ${bailleurNom}\nIBAN : ${iban}\n\nÀ défaut de règlement dans ce délai, je me verrai dans l'obligation d'engager les procédures prévues par le bail et la législation en vigueur.`
      : `Par la présente, je vous mets en demeure de régler dans un délai de ${delai} jours à compter de la réception du présent courrier le montant de ${montantDu} EUR au titre du loyer impayé pour la période de ${periode}.\n\nPassé ce délai, et conformément à la clause résolutoire de notre bail, je serai contraint d'assigner l'affaire devant le tribunal judiciaire compétent et d'engager la procédure d'expulsion, sans autre préavis.\n\nVous pouvez effectuer le règlement par virement sur mon compte :\n\nTitulaire : ${bailleurNom}\nIBAN : ${iban}`;

    return `${bailleurNom}\n${bailleurAdresse}\n${bailleurCodePostal} ${bailleurVille}\n\n${locataireNom}\n${locataireAdresse}\n\n${objet}\n\n${contenu}\n\nDans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations.\n\n${bailleurNom}`;
  }

  function copyLetter() {
    navigator.clipboard.writeText(generateLetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>✉️</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Générateur de Lettre de Relance Loyer
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Générez une lettre de relance amiable ou une mise en demeure conforme. Copiez-collez ou téléchargez.
            </p>
          </div>

          <div className="space-y-6 mb-10">
            {/* Letter type selector */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Type de courrier</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLetterType("relance")}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      letterType === "relance"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-stone-200 text-stone-500 hover:border-blue-300"
                    }`}
                  >
                    Relance amiable
                  </button>
                  <button
                    type="button"
                    onClick={() => setLetterType("miseEnDemeurer")}
                    className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      letterType === "miseEnDemeurer"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-stone-200 text-stone-500 hover:border-red-300"
                    }`}
                  >
                    Mise en demeure
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  {letterType === "relance"
                    ? "Courrier informel pour les premiers retards. Pas de valeur juridique contraignante."
                    : "Courrier formel avec délai de grâce de 30 jours. Point de départ de la procédure judiciaire."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Nom du bailleur</label>
                    <input name="bailleurNom" value={formData.bailleurNom} onChange={handleChange} placeholder="Jean Dupont" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Nom du locataire</label>
                    <input name="locataireNom" value={formData.locataireNom} onChange={handleChange} placeholder="Marie Martin" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Adresse du bailleur</label>
                  <input name="bailleurAdresse" value={formData.bailleurAdresse} onChange={handleChange} placeholder="12 rue de la Paix" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Code postal</label>
                    <input name="bailleurCodePostal" value={formData.bailleurCodePostal} onChange={handleChange} placeholder="75001" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Ville</label>
                    <input name="bailleurVille" value={formData.bailleurVille} onChange={handleChange} placeholder="Paris" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Adresse du bien (dans le bail)</label>
                  <input name="bienAdresse" value={formData.bienAdresse} onChange={handleChange} placeholder="12 rue de la Paix, 75001 Paris" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Adresse du locataire</label>
                  <input name="locataireAdresse" value={formData.locataireAdresse} onChange={handleChange} placeholder="15 avenue des Champs, 75008 Paris" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Montant dû (€)</label>
                    <input name="montantDu" value={formData.montantDu} onChange={handleChange} placeholder="800.00" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Période concernée</label>
                    <input name="periode" value={formData.periode} onChange={handleChange} placeholder="Janvier 2026" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Délai (jours)</label>
                    <input name="delai" value={formData.delai} onChange={handleChange} placeholder="10" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">IBAN (pour le règlement)</label>
                  <input name="iban" value={formData.iban} onChange={handleChange} placeholder="FR76 XXXX XXXX XXXX XXXX XXX" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Letter preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-800">Aperçu du courrier</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <Download className="size-4" />
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-5 font-mono text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
                {generateLetter() || "Remplissez le formulaire pour générer votre lettre..."}
              </div>
            </div>
          </div>

          {letterType === "miseEnDemeurer" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-red-700">
                <strong>⚠️ Important :</strong> La mise en demeure doit être envoyée en <strong>recommandé avec accusé de réception</strong> pour avoir une valeur juridique. Conservez le récépissé cacheté comme preuve.
              </p>
            </div>
          )}

          <div className="prose prose-stone max-w-none mb-10">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Quand utiliser chaque type de courrier ?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-800 mb-2">Relance amiable</h3>
                <p className="text-sm text-blue-700">
                  À utiliser dans les 5 à 15 jours suivant la date d'échéance. Elle rappelle au locataire ses obligations sans engager de procédure. Peut être envoyée par email ou courrier simple.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-semibold text-red-800 mb-2">Mise en demeure</h3>
                <p className="text-sm text-red-700">
                  À utiliser après 30 jours d'impayé persistant. C'est le document officiel qui lance le compte à rebours de 30 jours avant application de la clause résolutoire. Obligatoirement en recommandé AR.
                </p>
              </div>
            </div>
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
