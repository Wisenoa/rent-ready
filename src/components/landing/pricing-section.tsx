"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

const features = [
  "Jusqu'à 10 biens immobiliers",
  "Locataires illimités",
  "Quittances et reçus conformes",
  "Détection automatique des loyers",
  "Révision IRL (INSEE)",
  "Portail locataire & maintenance",
  "OCR factures artisans (IA)",
  "Conformité Factur-X 2026",
  "Support email prioritaire",
  "Mises à jour légales incluses",
];

export function PricingSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto mb-16 max-w-xl text-center sm:mb-20">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Un prix unique.
            <br />
            Zéro mauvaise surprise.
          </h2>
        </ScrollReveal>

        {/* Pricing card */}
        <div className="mx-auto max-w-md">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-stone-200/30 bg-white/60 shadow-2xl shadow-stone-900/[0.04] backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={spring.gentle}
            whileHover={{ y: -4 }}
          >
            {/* "Most popular" ribbon */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-b-full bg-blue-600 px-4 py-1 text-[11px] font-semibold text-white shadow-sm">
              Le plus complet
            </div>
            {/* Decorative glow */}
            <div
              aria-hidden
              className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-100/30 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-teal-100/20 blur-3xl"
            />

            <div className="relative p-8 sm:p-10">
              {/* Price */}
              <div className="mb-10 text-center">
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-extrabold tracking-tighter text-stone-900">
                    15
                  </span>
                  <span className="ml-1 text-xl font-semibold text-stone-500">
                    €
                  </span>
                  <span className="ml-1.5 text-base text-stone-500">/mois</span>
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  ou{" "}
                  <strong className="text-stone-700">150&nbsp;€/an</strong>{" "}
                  <span className="ml-1 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    2 mois offerts
                  </span>
                </p>
              </div>

              {/* Features */}
              <ul className="mb-10 space-y-3">
                {features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    className="flex items-start gap-3 text-[14px] text-stone-600"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring.snappy, delay: i * 0.04 }}
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-blue-600"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/register">
                <motion.span
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-0.5 hover:bg-stone-800"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.bouncy}
                >
                  Essai gratuit — 14 jours
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
              {/* Trust micro-strip */}
              <p className="mt-3 text-center text-[12px] text-stone-500">
                Sans carte bancaire · Annulation libre · Sans engagement
              </p>
              {/* Trust badges row */}
              <div className="mt-3 flex items-center justify-center gap-x-4 gap-y-1">
                {[
                  "Hébergement RGPD France",
                  "DSP2 sécurisé",
                  "Conforme loi 1989",
                ].map((label, i) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-500"
                  >
                    <svg className="size-3 text-emerald-600 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 6l2.5 2.5L10 3.5" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini cost comparison table */}
            <div className="mb-8 rounded-2xl border border-stone-100 bg-stone-50/80 p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                Comparaison annuelle — 1 bien à 1 000 €/mois
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Agence (~7 %)", value: "~840 € / an", accent: false },
                  { label: "Excel", value: "0 € (mais ~6 h/mois)", accent: false },
                  { label: "RentReady", value: "180 € / an", accent: true },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px] ${
                      row.accent ? "bg-blue-50/70" : "bg-white/60"
                    }`}
                  >
                    <span className={row.accent ? "font-semibold text-blue-700" : "text-stone-600"}>
                      {row.label}
                    </span>
                    <span className={row.accent ? "font-semibold text-blue-700" : "text-stone-500"}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial pull-quotes */}
            <div className="mb-8 space-y-4">
              {[
                {
                  text: "J'ai récupéré mes week-ends. La quittance part toute seule.",
                  name: "Marie-Claire D., 3 appartements LMNP",
                },
                {
                  text: "Pour 15 € par mois, c'est une assurance tranquillité.",
                  name: "Thomas R., 2 studios meublés",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex gap-3 rounded-2xl border border-stone-100 bg-white/60 p-4"
                >
                  <div className="mt-0.5 size-5 shrink-0 text-blue-500">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 1.5h4v4h-4v-4zm-5 9h4v4H1.5v-4zm7-1a3.5 3.5 0 014 4 3.5 3.5 0 01-4 4H8V6.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] italic text-stone-600">"{t.text}"</p>
                    <p className="mt-1 text-[11px] font-medium text-stone-500">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
