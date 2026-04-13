"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./scroll-reveal";

const stats = [
  { value: "2 400+", label: "propriétaires actifs" },
  { value: "98%", label: "satisfaction client" },
  { value: "15 min", label: "temps moyen de setup" },
  { value: "0", label: "carte bancaire pour commencer" },
];

const integrations = [
  { label: "Open Banking DSP2", sub: "Lecture sécurisée des comptes" },
  { label: "INSEE", sub: "Indice IRL en temps réel" },
  { label: "Factur-X", sub: "Conformité e-reporting B2C" },
  { label: "RGPD", sub: "Données hébergées en France" },
];

export function SocialProof() {
  return (
    <ScrollReveal className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Stats bar */}
        <div className="mb-14 grid grid-cols-2 gap-px rounded-2xl border border-stone-200/50 bg-stone-200/50 sm:grid-cols-4 overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm px-6 py-6 text-center sm:py-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                {stat.value}
              </p>
              <p className="mt-1 text-[12px] sm:text-[13px] text-stone-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Integration badges */}
        <h2 className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-stone-400">
          Intégrations &amp; conformité
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {integrations.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2.5 rounded-full border border-stone-200/60 bg-white/60 px-4 py-2 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Shield check icon */}
              <svg
                className="size-4 text-blue-600 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 1L2 4v4.5c0 3.1 2.6 6 6 6s6-2.9 6-6V4L8 1z" />
                <path d="M5.5 8l1.8 1.8L10.5 6.5" />
              </svg>
              <span className="text-[13px] font-semibold text-stone-700">
                {item.label}
              </span>
              <span className="hidden text-[11px] text-stone-400 sm:block">
                {item.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
