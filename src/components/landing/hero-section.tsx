"use client";

import { useState, useEffect } from "react";
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

const CYCLING_NOTIFICATIONS = [
  { amount: "850 €", tenant: "M. Dupont", time: "il y a 2 min" },
  { amount: "720 €", tenant: "Mme Martin", time: "il y a 14 min" },
  { amount: "1 200 €", tenant: "SCI Dupont", time: "il y a 1h" },
];

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
  const [notifIdx, setNotifIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifIdx((i) => (i + 1) % CYCLING_NOTIFICATIONS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const notif = CYCLING_NOTIFICATIONS[notifIdx];

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

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <motion.span
                  className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-9 py-4 text-[15px] font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.bouncy}
                >
                  {/* Subtle shine sweep on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                    }}
                  />
                  Créer mon compte gratuitement
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </motion.span>
              </Link>
              <Link href="/demo">
                <motion.span
                  className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/80 px-6 py-4 text-[15px] font-semibold text-stone-700 shadow-lg shadow-stone-900/5 backdrop-blur-sm transition-all hover:-translate-y-0.5 active:translate-y-0 hover:border-stone-300 hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.bouncy}
                >
                  <svg className="size-4 text-stone-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M6.5 5.5L11 8l-4.5 2.5V5.5z" fill="currentColor" stroke="none" />
                  </svg>
                  Voir la démo
                </motion.span>
              </Link>
            </motion.div>
            <p className="mt-4 text-[13px] text-stone-500">
              Sans carte bancaire · Essai gratuit 14 jours · Annulation libre
            </p>

            {/* Trust badges — Gestalt proximity, right below CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-stone-500"
            >
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3.5 text-stone-500" />
                Connexion bancaire DSP2
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ScrollText className="size-3.5 text-stone-500" />
                Conforme Loi 1989 &amp; Factur-X
              </span>
            </motion.div>

            {/* Press mentions — "As seen in" strip */}
            <motion.div variants={fadeUp} className="mt-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
                Mentions presse
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-6">
                {["Le Monde", "Les Echos", "Challenges"].map((m) => (
                  <span key={m} className="text-[14px] font-semibold text-stone-500">
                    {m}
                  </span>
                ))}
              </div>
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
                <div className="flex items-center justify-between text-[10px] text-stone-500 mb-6">
                  <span className="font-medium">9:41</span>
                  <Smartphone className="size-3" />
                </div>

                {/* Success notification — cycles through realistic rent payments */}
                <motion.div
                  key={notifIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-emerald-100/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Check className="size-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-stone-900">
                        Loyer de {notif.amount} reçu
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        Quittance envoyée à {notif.tenant}
                      </p>
                      <p className="mt-2 text-[10px] text-stone-500">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Mini KPIs */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-stone-500">
                      Encaissé
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-stone-900">
                      2 550 €
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-stone-500">
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
