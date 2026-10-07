"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { spring, stagger } from "./motion-config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger.normal, delayChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

export function HeroSection() {
  // Interactive state for the third property (the realistic landlord exception)
  const [soldeRegle, setSoldeRegle] = useState(false);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 bg-[#f8f7f4]">
      {/* Subtle architectural atmosphere grid & ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e7e5e418_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e418_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 -z-10 h-[560px] w-[980px] rounded-full bg-gradient-to-b from-stone-200/50 via-emerald-100/20 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium tracking-tight text-stone-700 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>Pilotage locatif pour propriétaires indépendants</span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-normal">Loi du 6 juillet 1989</span>
            </span>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="text-[clamp(2.35rem,5.2vw,3.75rem)] font-bold tracking-tight text-stone-900 leading-[1.1]"
          >
            Vos locations tournent.{" "}
            <span className="block text-stone-900 sm:inline sm:text-stone-800">
              RentReady s&apos;occupe du suivi.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-stone-600 font-normal max-w-2xl mx-auto"
          >
            Du loyer exigible à la quittance certifiée, gardez la maîtrise de votre
            patrimoine sans y passer vos soirées. Zéro tableur obsolète, pointage en
            un clic et calcul au centime près.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/register"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 px-7 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Démarrer l&apos;essai gratuit 14 jours</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 text-stone-300" />
            </Link>

            <a
              href="#cycle-mensuel"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-stone-300/80 bg-white/80 px-6 py-3.5 text-[15px] font-medium text-stone-700 shadow-sm backdrop-blur-sm transition-all hover:bg-stone-50 hover:border-stone-400"
            >
              <span>Découvrir le cycle mensuel</span>
              <ChevronDown className="size-4 text-stone-500" />
            </a>
          </motion.div>

          {/* Micro assurances */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[12px] text-stone-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Sans carte bancaire
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Mise en place en 3 minutes
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Données hébergées en France
            </span>
          </motion.div>
        </motion.div>

        {/* ─── The Masterwork Product Scene: Octobre 2026 ─── */}
        <motion.div
          className="mt-14 sm:mt-16 mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.slow, delay: 0.35 }}
        >
          <div className="relative rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white p-4 sm:p-7 shadow-2xl shadow-stone-900/[0.06]">
            {/* Ledger Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white font-semibold text-sm">
                  10
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-semibold text-stone-900 tracking-tight">
                      Octobre 2026
                    </h2>
                    <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                      3 logements actifs
                    </span>
                  </div>
                  <p className="text-[12px] text-stone-500">
                    Grand livre mensuel · Arrêté au 07 octobre 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50/80 px-2.5 py-1 text-[12px] font-medium text-emerald-800 border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {soldeRegle ? "100 % des loyers encaissés" : "86 % des loyers encaissés"}
                </div>
              </div>
            </div>

            {/* Financial Ledger Progress Bar */}
            <div className="pt-5 pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="rounded-xl bg-stone-50/80 p-3 border border-stone-100">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Loyers attendus
                  </p>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                    2 850,00 €
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50/80 p-3 border border-stone-100">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Encaissés
                  </p>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-emerald-700">
                    {soldeRegle ? "2 850,00 €" : "2 450,00 €"}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50/80 p-3 border border-stone-100">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Solde restant
                  </p>
                  <p className={`mt-1 text-lg sm:text-xl font-bold tracking-tight ${soldeRegle ? "text-stone-400" : "text-amber-700"}`}>
                    {soldeRegle ? "0,00 €" : "400,00 €"}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50/80 p-3 border border-stone-100">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Quittances
                  </p>
                  <p className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                    {soldeRegle ? "3 émises" : "2 émises · 1 reçu"}
                  </p>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 flex">
                <motion.div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: soldeRegle ? "100%" : "86%" }}
                />
                {!soldeRegle && (
                  <div className="h-full bg-amber-400" style={{ width: "14%" }} />
                )}
              </div>
            </div>

            {/* Property Ledger Cards */}
            <div className="space-y-2.5">
              {/* Property 1 — Fully Settled */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200/70 bg-stone-50/40 p-3.5 transition-colors hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-stone-900">
                        Studio Rue Oberkampf · Paris 11ᵉ
                      </p>
                    </div>
                    <p className="text-[12px] text-stone-500">
                      Locataire : Camille Laurent · Loyer nu 670,00 € + Provisions 80,00 €
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[14px] font-bold text-stone-900">750,00 €</p>
                    <p className="text-[11px] font-medium text-emerald-700">Réglé le 02 oct.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                    <FileText className="size-3 text-stone-500" />
                    Quittance #2026-10-001
                  </span>
                </div>
              </div>

              {/* Property 2 — Fully Settled */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200/70 bg-stone-50/40 p-3.5 transition-colors hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-stone-900">
                        T3 Avenue Victor Hugo · Lyon 2ᵉ
                      </p>
                    </div>
                    <p className="text-[12px] text-stone-500">
                      Locataire : Alexandre Mercier · Loyer nu 1 520,00 € + Provisions 180,00 €
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[14px] font-bold text-stone-900">1 700,00 €</p>
                    <p className="text-[11px] font-medium text-emerald-700">Réglé le 04 oct.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                    <FileText className="size-3 text-stone-500" />
                    Quittance #2026-10-002
                  </span>
                </div>
              </div>

              {/* Property 3 — The Landlord Reality: Partial Payment or Resolved */}
              <AnimatePresence mode="wait">
                {!soldeRegle ? (
                  <motion.div
                    key="partial"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-amber-50/30 p-3.5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 border border-amber-200/80">
                        <AlertCircle className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-stone-900">
                            T2 Rue de la République · Nantes
                          </p>
                          <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                            Paiement partiel
                          </span>
                        </div>
                        <p className="text-[12px] text-stone-600">
                          Locataire : Éléonore Moreau · Attendu : 800,00 € · Reçu : 400,00 € le 05 oct.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/50">
                      <div className="text-left sm:text-right">
                        <p className="text-[14px] font-bold text-amber-900">Reste 400,00 €</p>
                        <p className="text-[11px] font-medium text-stone-500">
                          Reçu partiel (art. 21)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSoldeRegle(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 px-3 py-1.5 text-[12px] font-medium text-white shadow-sm transition-all hover:scale-102"
                      >
                        <Sparkles className="size-3 text-amber-300" />
                        <span>Encaisser le solde (400 €)</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="settled"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-stone-900">
                            T2 Rue de la République · Nantes
                          </p>
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                            Solde réglé
                          </span>
                        </div>
                        <p className="text-[12px] text-emerald-900">
                          Complément de 400,00 € enregistré · Total perçu : 800,00 €
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-100">
                      <div className="text-left sm:text-right">
                        <p className="text-[14px] font-bold text-stone-900">800,00 €</p>
                        <p className="text-[11px] font-medium text-emerald-700">100 % soldé</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                        <FileText className="size-3 text-stone-500" />
                        Quittance #2026-10-003 débloquée
                      </span>
                      <button
                        type="button"
                        onClick={() => setSoldeRegle(false)}
                        className="text-stone-400 hover:text-stone-600 p-1"
                        title="Réinitialiser l'exemple"
                        aria-label="Réinitialiser l'exemple"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Proof Note */}
            <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                Moteur arithmétique de précision financière (decimal.js) — Aucun flottant JS imprécis
              </span>
              <span className="text-stone-400 hidden sm:inline">
                Démonstration interactive avec données réelles du modèle
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
