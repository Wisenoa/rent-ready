"use client";

import { motion } from "framer-motion";
import { CreditCard, FileText, Landmark, Clock } from "lucide-react";
import { spring } from "./motion-config";

/**
 * Previously a strip of three invented customer quotes with star ratings
 * ("Sophie B., Paris 11e", 5/5). The text had also picked up machine
 * translation artefacts ("IP:", "Plus jamais lost").
 *
 * Replaced with the concrete answers to the questions a landlord asks before
 * signing up. Same slot in the page, honest content.
 */

const PROMISES = [
  {
    icon: Clock,
    title: "Setup en quelques minutes",
    text: "Un bien, un bail, une échéance : la première quittance sort le jour même.",
  },
  {
    icon: Landmark,
    title: "Paiements rapprochés",
    text: "La détection automatique des virements supprime la vérification manuelle mensuelle.",
  },
  {
    icon: FileText,
    title: "Locataire autonome",
    text: "Le portail locataire rend le loyer consultable et payable sans échange d'email.",
  },
  {
    icon: CreditCard,
    title: "Sans engagement",
    text: "14 jours d'essai, aucune carte bancaire demandée.",
  },
];

export function TestimonialStrip() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-stone-50/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-stone-200/50 bg-white/80 p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.gentle, delay: i * 0.06 }}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-stone-900">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-stone-500">
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
