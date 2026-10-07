"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  ArrowRightLeft,
  FileCheck2,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { spring } from "./motion-config";

interface StepDetail {
  number: string;
  tag: string;
  title: string;
  lead: string;
  description: string;
  legalNote: string;
}

const STEPS: StepDetail[] = [
  {
    number: "01",
    tag: "1ᵉʳ du mois",
    title: "L'échéance se calcule d'elle-même",
    lead: "Chaque loyer attendu est généré avec une ventilation stricte.",
    description:
      "Dès le premier jour du mois, RentReady initialise l'obligation pour chacun de vos baux actifs. Le loyer nu et les provisions pour charges locatives sont distincts dès la racine. Vos locataires reçoivent leur avis d'échéance clair avec les coordonnées de versement.",
    legalNote: "Décret n° 2015-587 : ventilation obligatoire du loyer principal et des charges.",
  },
  {
    number: "02",
    tag: "Au fil des virements",
    title: "Pointage & rapprochement en 1 clic",
    lead: "Enregistrez le montant réel, RentReady gère les cas particuliers.",
    description:
      "Un virement reçu de 850,00 € ? Déclarez-le en un clic. Un versement partiel de 400,00 € ? RentReady ventile la somme, calcule le solde résiduel exact et tient le journal des dettes sans aucune confusion comptable.",
    legalNote: "Moteur de calcul sans arrondi flottant (decimal.js) : 0,00 € d'écart de caisse.",
  },
  {
    number: "03",
    tag: "Règlement complet ou solde",
    title: "Quittance certifiée ou Reçu de paiement partiel",
    lead: "La règle de la loi de 1989 appliquée sans compromis.",
    description:
      "Si le loyer est réglé à 100 %, la quittance officielle au format PDF/A est générée et consultable sur le portail locataire. Si le solde est partiel, un Reçu de paiement partiel est émis : RentReady refuse formellement de générer une quittance tant que la dette subsiste.",
    legalNote: "Loi du 6 juillet 1989 (art. 21) : quittance obligatoire et gratuite pour paiement intégral.",
  },
];

export function MonthlyCycleStory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="cycle-mensuel" className="py-24 sm:py-32 lg:py-40 bg-white border-y border-stone-200/80">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            La colonne vertébrale du produit
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-stone-900 leading-tight">
            Le cycle mensuel idéal.
            <br />
            <span className="text-stone-600 font-normal">
              De l&apos;échéance à la quittance, sans jamais vous perdre.
            </span>
          </h2>
          <p className="mt-4 text-base text-stone-600">
            Un processus prévisible, rigoureux et automatisé qui tourne chaque mois
            sans vous forcer à ouvrir un tableur.
          </p>
        </ScrollReveal>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left rounded-2xl p-5 border transition-all ${
                  isCurrent
                    ? "bg-[#f8f7f4] border-stone-900 shadow-md ring-1 ring-stone-900/10"
                    : "bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-bold ${
                      isCurrent ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-stone-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-[12px] text-stone-500 line-clamp-2">
                  {step.lead}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Demonstration */}
        <div className="rounded-3xl border border-stone-200 bg-[#f8f7f4] p-6 sm:p-10 lg:p-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Descriptive prose & legal context */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/80 px-3 py-1 text-[11px] font-semibold text-stone-700 mb-4">
                Étape {STEPS[activeStep].number} · {STEPS[activeStep].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {STEPS[activeStep].title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-stone-700">
                {STEPS[activeStep].description}
              </p>

              <div className="mt-6 rounded-xl bg-white border border-stone-200/80 p-3.5 flex items-start gap-3 shadow-sm">
                <ShieldAlert className="size-4 text-stone-700 shrink-0 mt-0.5" />
                <p className="text-[12px] font-medium text-stone-700 leading-snug">
                  {STEPS[activeStep].legalNote}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 disabled:opacity-40"
                >
                  Précédent
                </button>
                <span className="text-xs text-stone-500 font-medium">
                  {activeStep + 1} / {STEPS.length}
                </span>
                <button
                  type="button"
                  disabled={activeStep === STEPS.length - 1}
                  onClick={() => setActiveStep((p) => Math.min(STEPS.length - 1, p + 1))}
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>

            {/* Right Column: Visual Stage Reproduction */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={spring.gentle}
                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <CalendarClock className="size-5 text-stone-700" />
                        <div>
                          <p className="text-[14px] font-semibold text-stone-900">
                            Avis d&apos;échéance · Octobre 2026
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Bail #B-2024-08 · Studio Rue Oberkampf
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700">
                        Exigible au 01/10/2026
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-stone-50">
                        <span className="text-[13px] text-stone-700">Loyer nu mensuel</span>
                        <span className="text-[14px] font-mono font-semibold text-stone-900">
                          670,00 €
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-stone-50">
                        <span className="text-[13px] text-stone-700">Provisions pour charges locatives</span>
                        <span className="text-[14px] font-mono font-semibold text-stone-900">
                          80,00 €
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-stone-100 px-3">
                        <span className="text-[14px] font-bold text-stone-900">Total exigible</span>
                        <span className="text-[16px] font-mono font-bold text-stone-900">
                          750,00 €
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-emerald-50/80 p-3 border border-emerald-200/60 flex items-center justify-between text-[12px] text-emerald-800">
                      <span>✓ Avis préparé et accessible au locataire</span>
                      <span className="font-semibold">Automatique</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={spring.gentle}
                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <ArrowRightLeft className="size-5 text-stone-700" />
                        <div>
                          <p className="text-[14px] font-semibold text-stone-900">
                            Enregistrement du règlement perçu
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Période : Octobre 2026 · Total attendu : 800,00 €
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/60">
                        Paiement partiel détecté
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="rounded-xl border border-stone-200 p-3.5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[13px] font-semibold text-stone-800">
                            Virement reçu le 05/10/2026
                          </span>
                          <span className="font-mono text-emerald-700 font-bold text-[14px]">
                            + 400,00 €
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Émetteur : Éléonore Moreau · Réf : Loyer Nantes Octobre
                        </p>
                      </div>

                      <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-semibold text-amber-900">
                            Solde résiduel dû par le locataire
                          </span>
                          <span className="font-mono text-amber-900 font-bold text-[15px]">
                            400,00 €
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-amber-800">
                          Conservé en dette active. Le mois suivant n&apos;efface pas le reliquat.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-[12px] text-stone-600 bg-stone-50 rounded-xl p-3 border border-stone-100">
                      <span>Rapprochement sans approximation</span>
                      <span className="font-semibold text-stone-900">1 clic de validation</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={spring.gentle}
                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <FileCheck2 className="size-5 text-emerald-700" />
                        <div>
                          <p className="text-[14px] font-semibold text-stone-900">
                            Quittance certifiée conforme · Loi du 6 juillet 1989
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Numéro unique : 2026-10-001 · Format PDF/A pérenne
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200/60">
                        Conforme art. 21
                      </span>
                    </div>

                    {/* Paper Document Preview Effect */}
                    <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50/50 p-4 font-mono text-[11px] text-stone-700 space-y-2">
                      <div className="flex justify-between border-b border-stone-200 pb-2">
                        <span>BAILLEUR : M. Martin (Bailleur)</span>
                        <span>DATE : 02/10/2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LOCATAIRE : Camille Laurent</span>
                        <span>BIEN : Paris 11ᵉ</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 space-y-1">
                        <div className="flex justify-between">
                          <span>LOYER PRINCIPAL :</span>
                          <span className="font-bold">670,00 €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PROVISIONS CHARGES :</span>
                          <span className="font-bold">80,00 €</span>
                        </div>
                        <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-300">
                          <span>TOTAL RÉGLÉ REÇU :</span>
                          <span>750,00 €</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[12px] text-emerald-800 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/50">
                      <Check className="size-4 shrink-0 text-emerald-700" />
                      <span>
                        Disponible en permanence sur l&apos;espace locataire sans intervention manuelle.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
