"use client";

import { useState } from "react";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

const ROOMS = [
  {
    id: "entree",
    label: "Entrée",
    icon: "🚪",
    items: [
      { id: "entree_porte", label: "Porte d'entrée (état, serrure, clés)" },
      { id: "entree_huis", label: "Huisseries et vitrages" },
      { id: "entree_sol", label: "Sol (carrelage, parquet, état)" },
      { id: "entree_murs", label: "Murs et plafonds" },
      { id: "entree_interrupteur", label: "Interrupteur et prise électrique" },
      { id: "entree_placard", label: "Placard et étagères" },
    ],
  },
  {
    id: "salon",
    label: "Salon / Séjour",
    icon: "🛋️",
    items: [
      { id: "salon_sol", label: "Sol (parquet, moquette, carrelage)" },
      { id: "salon_murs", label: "Murs et papiers peints" },
      { id: "salon_plafond", label: "Plafond et luminaires" },
      { id: "salon_fenetre", label: "Fenêtres et volets" },
      { id: "salon_porte", label: "Portes intérieures" },
      { id: "salon_electricite", label: "Prises et interrupteurs" },
      { id: "salon_radiateur", label: "Radiateur / chauffage" },
    ],
  },
  {
    id: "cuisine",
    label: "Cuisine",
    icon: "🍳",
    items: [
      { id: "cuisine_sol", label: "Sol" },
      { id: "cuisine_murs", label: "Murs et crédence" },
      { id: "cuisine_plafond", label: "Plafond et hotte" },
      { id: "cuisine_meuble", label: "Meubles hauts et bas" },
      { id: "cuisine_evier", label: "Évier et robineterie" },
      { id: "cuisine_plaque", label: "Plaque de cuisson" },
      { id: "cuisine_four", label: "Four / réfrigérateur" },
      { id: "cuisine_electricite", label: "Prises et interrupteurs" },
    ],
  },
  {
    id: "chambre1",
    label: "Chambre 1",
    icon: "🛏️",
    items: [
      { id: "ch1_sol", label: "Sol" },
      { id: "ch1_murs", label: "Murs et plafonds" },
      { id: "ch1_fenetre", label: "Fenêtre et rideaux" },
      { id: "ch1_porte", label: "Porte" },
      { id: "ch1_electricite", label: "Prises et interrupteurs" },
      { id: "ch1_placard", label: "Placard" },
    ],
  },
  {
    id: "chambre2",
    label: "Chambre 2",
    icon: "🛏️",
    items: [
      { id: "ch2_sol", label: "Sol" },
      { id: "ch2_murs", label: "Murs et plafonds" },
      { id: "ch2_fenetre", label: "Fenêtre et rideaux" },
      { id: "ch2_porte", label: "Porte" },
      { id: "ch2_electricite", label: "Prises et interrupteurs" },
      { id: "ch2_placard", label: "Placard" },
    ],
  },
  {
    id: "sdb",
    label: "Salle de bain",
    icon: "🚿",
    items: [
      { id: "sdb_sol", label: "Sol et murs" },
      { id: "sdb_equipement", label: "Équipements (baignoire/douche, lavabo)" },
      { id: "sdb_robinets", label: "Robinets et canalisations" },
      { id: "sdb_meuble", label: "Meuble vasque et miroir" },
      { id: "sdb_vmc", label: "VMC et ventilation" },
      { id: "sdb_electricite", label: "Luminaire et prises" },
    ],
  },
  {
    id: "wc",
    label: "Toilettes",
    icon: "🚽",
    items: [
      { id: "wc_sol", label: "Sol et murs" },
      { id: "wc_cuvette", label: "Cuvette et abattant" },
      { id: "wc_lavabo", label: "Lavabo et robinets" },
      { id: "wc_ventilation", label: "Ventilation" },
    ],
  },
  {
    id: "exterieur",
    label: "Extérieur / Balcon",
    icon: "🌿",
    items: [
      { id: "ext_balcon", label: "Balcon ou terrasse" },
      { id: "ext_vitrage", label: "Vitrage et porte-fenêtre" },
      { id: "ext_sol", label: "Sol extérieur" },
      { id: "ext_jardin", label: "Jardin (si applicable)" },
      { id: "ext_parking", label: "Place de parking" },
    ],
  },
];

const faqData = [
  {
    question: "Qu'est-ce qu'un état des lieux ?",
    answer:
      "L'état des lieux est un document qui décrit l'état d'un logement lors de l'entrée et de la sortie du locataire. Il est obligatoire et doit être joint au bail. Il permet de comparer l'état du logement entre le début et la fin de la location pour évaluer les éventuelles dégradations.",
  },
  {
    question: "L'état des lieux est-il obligatoire ?",
    answer:
      "Oui, l'état des lieux est obligatoire depuis la loi du 6 juillet 1989. Il doit être établi lors de la remise des clés (entrée) et lors de la restitution des clés (sortie). Un modèle conforme doit être signé par les deux parties.",
  },
  {
    question: "Comment remplir l'état des lieux ?",
    answer:
      "Parcourez chaque pièce et chaque item de la checklist. Cochez « OK » si l'élément est en bon état, ou décrivez la dégradation constatée si applicable. Utilisez des photos pour appuyer vos constatations. Les deux parties (bailleur et locataire) doivent signer chaque page.",
  },
  {
    question: "Que faire en cas de dégradations à la sortie ?",
    answer:
      "Si des dégradations sont constatées par rapport à l'état des lieux d'entrée, le propriétaire peut conserver une partie du dépôt de garantie pour couvrir les travaux de réparation. Il doit fournir un état exécutoire des sommes retenues. En cas de litige, le depósito peut être restitué après accord des deux parties ou décision de justice.",
  },
  {
    question: "Peut-on faire un état des lieux numérique ?",
    answer:
      "Oui, l'état des lieux peut être établi sursupport numérique (email, PDF) s'il est signé par les deux parties. Il doit conserver une trace permettant de le produire en cas de litige. Notre checklist est un outil d'aide — pour un document officiel, utilisez le modèle conforme de l'annexe de la loi 1989.",
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Checklist État des Lieux", href: "/outils/checklist-etat-lieux" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Checklist État des Lieux",
      description: "Checklist interactive pour réaliser un état des lieux entrée ou sortie conforme à la loi.",
      url: "https://www.rentready.fr/outils/checklist-etat-lieux",
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

type ItemState = "ok" | "ko" | "na";

export function ChecklistEDLClient() {
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  function toggleItem(roomId: string, itemId: string) {
    setStates((prev) => {
      const key = `${roomId}_${itemId}`;
      const next: Record<string, ItemState> = { ...prev };
      const current = prev[key] || "na";
      next[key] = current === "ok" ? "ko" : current === "ko" ? "na" : "ok";
      return next;
    });
  }

  function getState(roomId: string, itemId: string): ItemState {
    return states[`${roomId}_${itemId}`] || "na";
  }

  function getRoomProgress(room: typeof ROOMS[0]) {
    const itemStates = room.items.map((i) => getState(room.id, i.id));
    const ok = itemStates.filter((s) => s === "ok").length;
    const ko = itemStates.filter((s) => s === "ko").length;
    const total = itemStates.filter((s) => s !== "na").length;
    return { ok, ko, total, totalItems: room.items.length };
  }

  const totalOk = Object.values(states).filter((s) => s === "ok").length;
  const totalKo = Object.values(states).filter((s) => s === "ko").length;
  const totalItems = ROOMS.reduce((acc, r) => acc + r.items.length, 0);

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
              Outil gratuit — Téléchargement PDF inclus
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Checklist État des Lieux
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Checklist interactive pour.realiser un état des lieux entrée ou sortie conforme. Parcourez chaque pièce, cochez les éléments, ajoutez des notes.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-stone-900">Progression</h2>
              <span className="text-sm text-stone-500">{totalOk + totalKo} / {totalItems} items vérifiés</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3 mb-4">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${((totalOk + totalKo) / totalItems) * 100}%` }}
              />
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-stone-600">OK: <strong className="text-stone-900">{totalOk}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500" />
                <span className="text-stone-600">Dégradations: <strong className="text-stone-900">{totalKo}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-stone-300" />
                <span className="text-stone-600">Non vérifié: <strong className="text-stone-900">{totalItems - totalOk - totalKo}</strong></span>
              </div>
            </div>
          </div>

          {/* Rooms */}
          {ROOMS.map((room) => {
            const progress = getRoomProgress(room);
            return (
              <div key={room.id} className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{room.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-stone-900">{room.label}</h2>
                    <p className="text-sm text-stone-500">
                      {progress.total} / {progress.totalItems} vérifiés
                      {progress.ko > 0 && (
                        <span className="text-red-500 ml-2">— {progress.ko} dégradation(s)</span>
                      )}
                    </p>
                  </div>
                  <div className="w-24 bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progress.ko > 0 ? "bg-red-400" : progress.total === progress.totalItems ? "bg-green-400" : "bg-blue-400"}`}
                      style={{ width: `${(progress.total / progress.totalItems) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {room.items.map((item) => {
                    const state = getState(room.id, item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                          state === "ok" ? "border-green-300 bg-green-50" : state === "ko" ? "border-red-300 bg-red-50" : "border-stone-200"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(room.id, item.id)}
                          className={`size-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                            state === "ok" ? "border-green-500 bg-green-500 text-white" :
                            state === "ko" ? "border-red-500 bg-red-500 text-white" :
                            "border-stone-300 hover:border-blue-400"
                          }`}
                          aria-label={state === "ok" ? "Marquer comme OK" : state === "ko" ? "Marquer comme dégradation" : "Non vérifié"}
                        >
                          {state === "ok" && (
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                          {state === "ko" && (
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 text-sm font-medium ${state === "ko" ? "text-red-700" : "text-stone-700"}`}>
                          {item.label}
                        </span>
                        <input
                          type="text"
                          placeholder="Note (ex: rayure mineure)"
                          value={notes[`${room.id}_${item.id}`] || ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [`${room.id}_${item.id}`]: e.target.value }))}
                          className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Signature Section */}
          <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-stone-200 rounded-xl p-4">
                <h3 className="font-semibold text-stone-700 mb-3">Bailleur</h3>
                <div className="space-y-2">
                  <input type="text" placeholder="Nom prénom" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-500">Date:</span>
                    <input type="date" className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <p className="text-xs text-stone-400 italic">Signature (upload photo ou numérique)</p>
                    <div className="h-16 border-2 border-dashed border-stone-200 rounded-lg flex items-center justify-center text-stone-400 text-sm mt-2">
                      Zone signature
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-stone-200 rounded-xl p-4">
                <h3 className="font-semibold text-stone-700 mb-3">Locataire</h3>
                <div className="space-y-2">
                  <input type="text" placeholder="Nom prénom" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-500">Date:</span>
                    <input type="date" className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <p className="text-xs text-stone-400 italic">Signature (upload photo ou numérique)</p>
                    <div className="h-16 border-2 border-dashed border-stone-200 rounded-lg flex items-center justify-center text-stone-400 text-sm mt-2">
                      Zone signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Important sur le plan légal</h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Cette checklist est un outil d'aide à la réalisation de l'état des lieux. Pour produire un document officiel recevable en cas de litige, utilisez le modèle prévu par l'arrêté du 15 mars 2012 (annexe II du Code de la construction et de l'habitation). Le modèle officiel est disponible sur <Link href="/modeles/etat-des-lieux" className="font-semibold underline">notre page Modèles</Link>.
                </p>
              </div>
            </div>
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
            <h2 className="text-xl font-bold text-stone-900 mb-4">Ressources complémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/modeles/etat-des-lieux" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-semibold text-stone-900">Modèle Officiel État des Lieux</div>
                  <div className="text-sm text-stone-500">Modèle légal à télécharger</div>
                </div>
              </Link>
              <Link href="/modeles/protocol-etat-des-lieux" className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold text-stone-900">Protocole État des Lieux</div>
                  <div className="text-sm text-stone-500">Guide complet et détaillé</div>
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
                  <div className="text-sm text-stone-500">Bail conforme à la loi 1989</div>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Gérez vos états des lieux avec RentReady</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Générez des états des lieux PDF conformes, stockez les photos, et comparez automatiquement entrée et sortie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                Essai gratuit 14 jours
              </Link>
              <Link href="/outils" className="inline-block border-2 border-blue-300 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">
                Autres outils gratuits
              </Link>
            </div>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}