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

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Deterministic color from name string
function getAvatarColor(name: string): string {
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
    "bg-purple-100 text-purple-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="size-3.5 fill-amber-400 text-amber-400"
        />
      ))}
      <span className="ml-0.5 text-[12px] font-semibold text-amber-600">
        {count}/5
      </span>
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
                <footer className="mt-5 flex items-center gap-3 border-t border-stone-100/60 pt-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${getAvatarColor(t.name)}`}
                    aria-hidden="true"
                  >
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-stone-900">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-stone-400">{t.role}</p>
                  </div>
                </footer>
              </div>
            </motion.blockquote>
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
                <svg className="size-3.5 text-stone-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 8l1.8 1.8L10.5 6.5" />
                </svg>
              ),
              text: "Hébergement cloud européen conforme RGPD",
            },
            {
              icon: (
                <svg className="size-3.5 text-stone-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
                </svg>
              ),
              text: "Synchronisation bancaire DSP2 sécurisée",
            },
            {
              icon: (
                <svg className="size-3.5 text-stone-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="2" width="10" height="12" rx="1.5" />
                  <path d="M6 6h4M6 9h4M6 12h2" />
                </svg>
              ),
              text: "Quittances conformes loi du 6 juillet 1989",
            },
          ].map((badge, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[12px] text-stone-400"
            >
              {badge.icon}
              {badge.text}
              {i < 2 && <span className="hidden sm:inline ml-2 text-stone-300">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
