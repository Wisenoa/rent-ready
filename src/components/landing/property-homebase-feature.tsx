"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileCheck,
  TrendingUp,
  UserCheck,
  Shield,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { spring } from "./motion-config";

interface FeaturePillar {
  id: "payments" | "lease" | "irl";
  title: string;
  badge: string;
  summary: string;
}

const PILLARS: FeaturePillar[] = [
  {
    id: "payments",
    title: "Le Statut & le Pointage",
    badge: "Zéro doute sur l'état du mois",
    summary:
      "Chaque logement affiche en grand l'état de son loyer courant : réglé avec quittance disponible, paiement partiel avec solde calculé, ou attente avec déclaration en 1 clic.",
  },
  {
    id: "lease",
    title: "Le Bail & le Locataire",
    badge: "Toutes les clés du contrat",
    summary:
      "Loyer hors charges, charges locatives réelles, dépôt de garantie légalement plafonné (art. 22) et portail locataire autonome accessible via lien sécurisé.",
  },
  {
    id: "irl",
    title: "La Révision IRL INSEE",
    badge: "Indexation automatique à l'anniversaire",
    summary:
      "Plus aucun oubli de revalorisation de loyer. RentReady applique les indices trimestriels officiels publiés par l'INSEE dès la date anniversaire du bail.",
  },
];

export function PropertyHomebaseFeature() {
  const [activePillar, setActivePillar] = useState<"payments" | "lease" | "irl">("payments");

  return (
    <section id="fonctionnalites" className="py-24 sm:py-32 lg:py-40 bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            Architecture centrée sur vos biens
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-stone-900 leading-tight">
            Chaque logement a son quartier général.
          </h2>
          <p className="mt-4 text-base text-stone-600">
            Fini les onglets dispersés, les dossiers éparpillés sur votre disque et les
            échanges d&apos;emails introuvables. Tout ce qui concerne un logement est
            regroupé au même endroit.
          </p>
        </ScrollReveal>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {PILLARS.map((pillar) => {
            const isActive = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-stone-900 text-white shadow-md"
                    : "bg-white text-stone-600 border border-stone-200/80 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                {pillar.title}
              </button>
            );
          })}
        </div>

        {/* Interactive Showcase Box */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Descriptive block */}
            <div className="lg:col-span-5">
              {PILLARS.map((p) => {
                if (p.id !== activePillar) return null;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring.gentle}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200/60 mb-4">
                      {p.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                      {p.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
                      {p.summary}
                    </p>

                    <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2.5 text-[13px] text-stone-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-900 text-xs font-bold">
                          ✓
                        </span>
                        <span>Visibilité instantanée sans recalcul manuel</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[13px] text-stone-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-900 text-xs font-bold">
                          ✓
                        </span>
                        <span>Conformité avec les textes législatifs en vigueur</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[13px] text-stone-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-900 text-xs font-bold">
                          ✓
                        </span>
                        <span>Accès mobile fluide et ergonomique</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulated UI Screen */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-stone-200/90 bg-[#f8f7f4] p-5 sm:p-6 shadow-inner">
                {/* Property Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-stone-900">
                        T3 Victor Hugo · Lyon 2ᵉ
                      </p>
                      <p className="text-[11px] text-stone-500">
                        65 m² · Meublé · Bail actif depuis le 01/09/2024
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-stone-200/70 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                    Lot #P-69002
                  </span>
                </div>

                {/* Sub-view Content based on active tab */}
                <AnimatePresence mode="wait">
                  {activePillar === "payments" && (
                    <motion.div
                      key="v-payments"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="rounded-xl bg-white p-4 border border-stone-200/80 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                            Statut Octobre 2026
                          </p>
                          <p className="text-xl font-bold text-stone-900 mt-0.5">
                            1 700,00 € réglé
                          </p>
                          <p className="text-[11px] text-emerald-700 font-medium">
                            Encaissé le 04/10 · Virement bancaire
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                          <FileCheck className="size-3.5" />
                          Quittance émise
                        </span>
                      </div>

                      <div className="rounded-xl bg-white p-3.5 border border-stone-200/80 text-[12px] text-stone-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Loyer nu :</span>
                          <span className="font-semibold text-stone-900">1 520,00 €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provisions pour charges :</span>
                          <span className="font-semibold text-stone-900">180,00 €</span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-stone-100 font-bold text-stone-900">
                          <span>Total mensuel :</span>
                          <span>1 700,00 €</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activePillar === "lease" && (
                    <motion.div
                      key="v-lease"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="rounded-xl bg-white p-4 border border-stone-200/80 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[14px] font-bold text-stone-900">
                              Locataire : Alexandre Mercier
                            </p>
                            <p className="text-[11px] text-stone-500">
                              alexandre.mercier@email.fr · 06 12 34 56 78
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                            <ExternalLink className="size-3" />
                            Portail actif
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                          <div>
                            <span className="text-stone-500">Dépôt de garantie :</span>
                            <span className="ml-1 font-semibold text-stone-900">
                              3 040,00 € (2 mois nu, meublé)
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500">Durée du bail :</span>
                            <span className="ml-1 font-semibold text-stone-900">1 an reconductible</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-stone-100/80 p-3 text-[11px] text-stone-600 flex items-center justify-between">
                        <span>Plafond légal respecté (loi 1989 art. 22)</span>
                        <span className="font-semibold text-stone-800">Conforme</span>
                      </div>
                    </motion.div>
                  )}

                  {activePillar === "irl" && (
                    <motion.div
                      key="v-irl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="rounded-xl bg-white p-4 border border-stone-200/80 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[13px] font-bold text-stone-900">
                            Prochaine révision IRL : 01/09/2027
                          </p>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                            Indice INSEE T3
                          </span>
                        </div>
                        <p className="text-[12px] text-stone-600 leading-relaxed">
                          Dernière formule appliquée :
                          <br />
                          <code className="mt-1 inline-block rounded bg-stone-100 px-2 py-1 font-mono text-[11px] text-stone-800">
                            800 € × (145,78 ÷ 144,64) = 806,31 €
                          </code>
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-200/60 text-[12px] text-emerald-800 flex items-center justify-between">
                        <span>Alerte envoyée 30 jours avant la date anniversaire</span>
                        <span className="font-semibold">0 omission</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
