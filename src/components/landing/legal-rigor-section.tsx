"use client";

import { motion } from "framer-motion";
import { Scale, Calculator, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { spring, stagger } from "./motion-config";

const PILLARS = [
  {
    icon: Scale,
    title: "Loi du 6 juillet 1989 (art. 21)",
    tag: "Conformité stricte",
    description:
      "La loi impose la remise gratuite d'une quittance uniquement pour un loyer réglé à 100 %. En cas de versement partiel, RentReady édite un reçu de paiement partiel avec solde résiduel : jamais de quittance anticipée erronée.",
  },
  {
    icon: Calculator,
    title: "Moteur arithmétique decimal.js",
    tag: "Zéro centime d'écart",
    description:
      "Tous les calculs monétaires (loyer nu, provisions pour charges, régularisations annuelles, reliquats) s'exécutent en arithmétique décimale stricte. Aucune approximation à virgule flottante JavaScript.",
  },
  {
    icon: ShieldCheck,
    title: "Indices IRL officiels de l'INSEE",
    tag: "Sources gouvernementales",
    description:
      "Les révisions de loyer utilisent directement les séries chronologiques publiées par l'INSEE chaque trimestre. La formule légale est appliquée à la lettre, éliminant tout risque de contestation par le locataire.",
  },
  {
    icon: Lock,
    title: "Portail locataire chiffré & RGPD",
    tag: "Hébergement souverain",
    description:
      "Vos locataires accèdent à leurs quittances et documents via un lien d'accès tokenisé chiffré, sans mot de passe à retenir. Vos données de gestion restent confidentielles et hébergées sur le territoire européen.",
  },
];

export function LegalRigorSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-white border-b border-stone-200/80">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            Rigueur juridique & technique
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-stone-900 leading-tight">
            Une gestion locative qui résiste aux contrôles.
          </h2>
          <p className="mt-4 text-base text-stone-600">
            RentReady n&apos;est pas un simple carnet de notes. C&apos;est un moteur
            financier et juridique pensé pour sécuriser vos relations avec vos locataires.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                className="group relative rounded-3xl border border-stone-200 bg-[#f8f7f4] p-7 sm:p-9 transition-all hover:border-stone-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...spring.gentle, delay: idx * stagger.normal }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-white">
                    <Icon className="size-6" />
                  </div>
                  <span className="rounded-full bg-white border border-stone-200/90 px-3 py-1 text-[11px] font-semibold text-stone-700">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-stone-900">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-stone-600">
                  {pillar.description}
                </p>

                <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center gap-2 text-[12px] font-medium text-emerald-800">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Vérifié et éprouvé sur le moteur de production</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
