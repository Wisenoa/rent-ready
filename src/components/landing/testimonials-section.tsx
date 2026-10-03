"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { spring, stagger } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

/**
 * What used to be customer testimonials is now a plain description of what
 * the product does.
 *
 * The previous version rendered three named people with invented cities and
 * parcel counts ("Marie-Claire D., 3 appartements LMNP à Lyon", 5/5 stars).
 * No such customer exists. Shipping invented quotes is the "fake success"
 * pattern we refuse to build, and attaching star ratings to them is a
 * misrepresentation rather than marketing.
 *
 * Concrete capability statements keep the section's rhythm and its job while
 * claiming only what we can stand behind. If attributable testimonials arrive
 * from real customers later, they belong here.
 */

interface Capability {
  title: string;
  points: string[];
}

const capabilities: Capability[] = [
  {
    title: "Le cycle complet, sans tableur",
    points: [
      "Bien, bail, échéance : la même règle s'applique à tout le parc",
      "Les virements reçus sont rapprochés automatiquement des loyers attendus",
      "L'état payé, partiel ou impayé est calculé, jamais saisi à la main",
    ],
  },
  {
    title: "Des documents conformes",
    points: [
      "La quittance sépare loyer et charges et refuse un paiement partiel",
      "Les montants sont calculés en décimal, jamais en virgule flottante",
      "Un document reste reproductible depuis les données de l'époque",
    ],
  },
  {
    title: "Le relais quand il le faut",
    points: [
      "La révision IRL est signalée à la date anniversaire du bail",
      "Les retards affichent le montant dû et l'ancienneté de la dette",
      "Le locataire dispose d'un portail pour consulter et régler son loyer",
    ],
  },
];
export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto mb-16 max-w-xl text-center">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-600">
            Le fonctionnement
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Ce que RentReady fait,
            <br />
            du paiement à la quittance.
          </h2>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map((capability, i) => (
            <motion.div
              key={capability.title}
              className="group relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 p-7 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring.gentle, delay: i * stagger.normal }}
              whileHover={{ y: -3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-teal-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <h3 className="text-[16px] font-semibold leading-snug text-stone-900">
                  {capability.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {capability.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[14px] leading-relaxed text-stone-600"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            {
              icon: (
                <svg className="size-3.5 text-stone-600 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 8l1.8 1.8L10.5 6.5" />
                </svg>
              ),
              text: "Hébergement cloud européen conforme RGPD",
            },
            {
              icon: (
                <svg className="size-3.5 text-stone-600 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
                </svg>
              ),
              text: "Synchronisation bancaire DSP2 sécurisée",
            },
            {
              icon: (
                <svg className="size-3.5 text-stone-600 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="2" width="10" height="12" rx="1.5" />
                  <path d="M6 6h4M6 9h4M6 12h2" />
                </svg>
              ),
              text: "Quittances conformes loi du 6 juillet 1989",
            },
          ].map((badge, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[12px] text-stone-600"
            >
              {badge.icon}
              {badge.text}
              {i < 2 && <span className="hidden sm:inline ml-2 text-stone-700">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
