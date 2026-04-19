"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { spring } from "./motion-config";

const STRIP_TESTIMONIALS = [
  {
    name: "Sophie B.",
    location: "Paris 11e",
    snippet: " Setup en 10 min chrono. La première quittance générée le jour même.",
    stars: 5,
  },
  {
    name: "Jean-Marc L.",
    location: "Toulouse",
    snippet: "IP: La détection automatique des paiements m'évite 20 min de Vérif par mois.",
    stars: 5,
  },
  {
    name: "Camille R.",
    location: "Nantes",
    snippet: "Le portail locataire a divisé par 3 nos échanges email. Plus jamais lost.",
    stars: 5,
  },
];

function MiniStars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-2.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function TestimonialStrip() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-stone-50/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {STRIP_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex items-start gap-3 rounded-2xl border border-stone-200/50 bg-white/80 p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.gentle, delay: i * 0.06 }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-[13px] font-bold">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-semibold text-stone-900">{t.name}</span>
                  <span className="text-[11px] text-stone-400">· {t.location}</span>
                </div>
                <MiniStars />
                <p className="mt-1.5 text-[12px] text-stone-500 leading-relaxed">
                  &ldquo;{t.snippet}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
