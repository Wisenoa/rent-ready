"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { spring, stagger } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie-Claire D.",
    role: "3 appartements LMNP à Lyon",
    text: "Gérer mes 3 appartements LMNP me prenait des heures chaque mois. Entre le suivi des virements, l'envoi des quittances et la comptabilité des charges, c'était un enfer administratif. RentReady a tout automatisé : je reçois une notification quand le loyer arrive, la quittance part toute seule, et mon comptable a accès à un export propre en fin d'année. J'ai récupéré mes week-ends.",
    stars: 5,
  },
  {
    name: "Thomas R.",
    role: "2 studios meublés à Bordeaux",
    text: "Ce qui m'a convaincu, c'est la conformité légale. Je n'arrivais jamais à savoir si mes quittances respectaient bien la loi de 1989. RentReady sépare automatiquement le loyer des charges, vérifie que le paiement est complet avant d'émettre le document, et prépare déjà le format Factur-X pour 2027. Pour 15 € par mois, c'est une assurance tranquillité.",
    stars: 5,
  },
  {
    name: "Isabelle & Marc P.",
    role: "6 lots en SCI familiale à Nantes",
    text: "Avec 6 locataires et une SCI, le suivi devenait ingérable sur Excel. Les retards de paiement passaient entre les mailles, et on oubliait systématiquement la révision IRL. Depuis RentReady, le calcul de l'indice INSEE est automatique, les relances se font toutes seules, et le portail locataire a divisé par trois nos appels téléphoniques.",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="size-3.5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto mb-16 max-w-xl text-center sm:mb-20">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Ils nous font confiance
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Des propriétaires sereins.
            <br />
            Des revenus sécurisés.
          </h2>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              className="group relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 p-7 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring.gentle, delay: i * stagger.normal }}
              whileHover={{ y: -3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-teal-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <Quote className="mb-4 size-6 text-stone-200" strokeWidth={1.5} />
                <Stars count={t.stars} />
                <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
                  {t.text}
                </p>
                <footer className="mt-5 border-t border-stone-100/60 pt-4">
                  <p className="text-[14px] font-semibold text-stone-900">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-stone-400">{t.role}</p>
                </footer>
              </div>
            </motion.blockquote>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-stone-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span>🇪🇺 Hébergement cloud européen conforme RGPD</span>
          <span className="hidden sm:inline">·</span>
          <span>🔐 Synchronisation bancaire DSP2 sécurisée</span>
          <span className="hidden sm:inline">·</span>
          <span>📜 Quittances conformes loi du 6 juillet 1989</span>
        </motion.div>
      </div>
    </section>
  );
}
