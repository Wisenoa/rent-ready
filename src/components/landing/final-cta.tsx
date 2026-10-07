"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

export function FinalCta() {
  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-8 py-16 text-center sm:px-16 sm:py-24 shadow-2xl">
            {/* Ambient subtle glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),transparent_70%)]"
            />

            <div className="relative max-w-2xl mx-auto">
              <span className="inline-flex rounded-full bg-stone-800 border border-stone-700/80 px-3.5 py-1 text-[11px] font-semibold text-stone-300 mb-6 uppercase tracking-wider">
                Prise en main immédiate
              </span>
              <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-white">
                Vos biens méritent une gestion rigoureuse.
                <br className="hidden sm:block" />
                Votre temps aussi.
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-stone-300">
                Passez au suivi automatisé : loyers attendus, encaissements pointés et
                quittances conformes sans y consacrer vos soirées.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-stone-900 shadow-xl transition-all hover:bg-stone-100 hover:scale-102"
                >
                  <span>Démarrer l&apos;essai gratuit 14 jours</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  Sans carte bancaire
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  Prêt en 3 minutes
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  Résiliable en 1 clic
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
