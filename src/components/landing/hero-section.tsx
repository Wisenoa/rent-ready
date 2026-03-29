"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  ScrollText,
  Check,
  Smartphone,
} from "lucide-react";
import { spring, stagger } from "./motion-config";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.normal, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...spring.slow, delay: 0.4 },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-br from-blue-100/40 via-teal-50/20 to-transparent blur-3xl"
      />

      <motion.div
        className="relative mx-auto max-w-6xl px-5 sm:px-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* ─ Copy ─ */}
          <div className="max-w-xl">
            <motion.p
              variants={fadeUp}
              className="mb-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-blue-600"
            >
              Pour les propriétaires indépendants · 1 à 10 lots
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-stone-900"
            >
              Le logiciel de gestion locative pour particuliers{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                qui automatise tout.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg leading-relaxed text-stone-500 sm:text-xl sm:leading-relaxed"
            >
              Quittances conformes à la loi de 1989, détection automatique des
              virements, révision IRL connectée à l&apos;INSEE et portail
              locataire.{" "}
              <span className="text-stone-700">
                Tout pour 15&nbsp;€/mois, sans payer d&apos;agence.
              </span>
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-10">
              <Link href="/register">
                <motion.span
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-stone-900 px-8 py-4 text-[15px] font-semibold text-white shadow-xl shadow-stone-900/15"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.bouncy}
                >
                  Créer mon compte
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
              <p className="mt-3 text-[13px] text-stone-400">
                Sans carte bancaire · Essai gratuit 14 jours
              </p>
            </motion.div>

            {/* Trust badges — Gestalt proximity, right below CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-stone-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3.5 text-stone-400" />
                Connexion bancaire DSP2
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ScrollText className="size-3.5 text-stone-400" />
                Conforme Loi 1989 &amp; Factur-X
              </span>
            </motion.div>
          </div>

          {/* ─ Phone mockup ─ */}
          <motion.div
            variants={scaleIn}
            className="relative mx-auto w-full max-w-[300px] lg:max-w-[340px]"
          >
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-100/50 via-teal-50/30 to-stone-100/50 blur-3xl"
            />
            {/* Phone frame */}
            <motion.div
              className="relative rounded-[2.5rem] border border-stone-200/40 bg-white/60 p-[6px] shadow-2xl shadow-stone-900/8 backdrop-blur-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="rounded-[2.25rem] bg-[#f8f7f4] p-5">
                {/* Status bar */}
                <div className="flex items-center justify-between text-[10px] text-stone-400 mb-6">
                  <span className="font-medium">9:41</span>
                  <Smartphone className="size-3" />
                </div>

                {/* Success notification */}
                <div className="rounded-2xl border border-emerald-100/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Check className="size-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-stone-900">
                        Loyer de 850 € reçu
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        Quittance envoyée à M. Dupont
                      </p>
                      <p className="mt-2 text-[10px] text-stone-400">
                        Il y a 2 min
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mini KPIs */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-stone-400">
                      Encaissé
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-stone-900">
                      2 550 €
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-stone-400">
                      Occupation
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-emerald-600">
                      100 %
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
