"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, TrendingUp, Receipt, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { spring, stagger } from "./motion-config";

const TOOLS = [
  {
    href: "/outils/calculateur-irl",
    title: "Calculateur de révision IRL",
    badge: "Indice INSEE",
    description:
      "Calculez le montant exact de la revalorisation de votre loyer avec le dernier indice officiel publié par l'INSEE.",
    cta: "Calculer ma révision",
    icon: TrendingUp,
  },
  {
    href: "/outils/calculateur-depot-garantie",
    title: "Plafond du dépôt de garantie",
    badge: "Loi du 6 juillet 1989 art. 22",
    description:
      "Vérifiez immédiatement le montant maximal exigible selon que votre bien est loué vide ou meublé.",
    cta: "Vérifier le plafond",
    icon: ShieldCheck,
  },
  {
    href: "/outils/generateur-quittance",
    title: "Générateur de quittance en ligne",
    badge: "Modèle conforme gratuit",
    description:
      "Éditez en 2 minutes une quittance de loyer gratuite au format PDF avec séparation loyer et charges.",
    cta: "Créer une quittance",
    icon: Receipt,
  },
  {
    href: "/outils/calculateur-charges-locatives",
    title: "Régularisation des charges",
    badge: "Décompte annuel",
    description:
      "Ventilez les dépenses récupérables et comparez-les aux provisions perçues pour calculer le solde exact.",
    cta: "Régulariser mes charges",
    icon: Calculator,
  },
];

export function FreeToolsGateway() {
  return (
    <section id="simulateurs" className="py-24 sm:py-32 lg:py-40 bg-white border-t border-stone-200/80">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            Outils &amp; calculateurs en libre accès
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-stone-900 leading-tight">
            Des simulateurs juridiques gratuits.
            <br />
            <span className="text-stone-600 font-normal">
              Directement utilisables, sans inscription requise.
            </span>
          </h2>
          <p className="mt-4 text-base text-stone-600">
            Nous mettons nos moteurs de calcul à la disposition de tous les propriétaires bailleurs.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.href}
                className="group rounded-2xl border border-stone-200 bg-[#f8f7f4] p-6 flex flex-col justify-between transition-all hover:border-stone-300 hover:shadow-md hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...spring.gentle, delay: idx * stagger.normal }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-900 border border-stone-200 shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200/60">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-[13px] text-stone-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/70">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 group-hover:text-stone-700"
                  >
                    <span>{tool.cta}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
