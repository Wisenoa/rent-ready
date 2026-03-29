"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./scroll-reveal";

const logos = [
  { name: "Bridge API", label: "Bridge" },
  { name: "Stripe", label: "Stripe" },
  { name: "INSEE", label: "INSEE" },
  { name: "Factur-X", label: "Factur-X" },
  { name: "DSP2", label: "DSP2" },
];

export function SocialProof() {
  return (
    <ScrollReveal className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-8 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-stone-400">
          Intégrations conformes &amp; sécurisées
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {logos.map((logo, i) => (
            <motion.span
              key={logo.name}
              className="text-[15px] font-semibold tracking-tight text-stone-300 select-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
            >
              {logo.label}
            </motion.span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
