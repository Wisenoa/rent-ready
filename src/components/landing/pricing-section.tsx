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
                  <span className="ml-1 text-xl font-semibold text-stone-400">
                    €
                  </span>
                  <span className="ml-1.5 text-base text-stone-400">/mois</span>
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
                    />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/register">
                <motion.span
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-stone-900 py-4 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/10"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.bouncy}
                >
                  Essai gratuit — 14 jours
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
              <p className="mt-3 text-center text-[12px] text-stone-400">
                Sans carte bancaire · Annulable en 1 clic
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
