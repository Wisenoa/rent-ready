"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl bg-forest px-6 py-14 text-center sm:px-16 sm:py-20 shadow-[0_40px_80px_-40px_rgba(6,24,18,0.6)]">
            {/* Ambient subtle glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(127,166,142,0.22),transparent_70%)]"
            />

            <div className="relative max-w-2xl mx-auto">
              <span className="inline-flex rounded-full bg-cream/10 border border-cream/15 px-3.5 py-1 text-[11px] font-semibold text-cream/80 mb-6 uppercase tracking-wider">
                Prise en main immédiate
              </span>
              <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight tracking-[-0.03em] text-cream">
                Vos biens méritent une gestion rigoureuse.
                <br className="hidden sm:block" />
                Votre temps aussi.
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-cream/80">
                Passez au suivi automatisé : loyers attendus, encaissements pointés et
                quittances conformes sans y consacrer vos soirées.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-cream px-8 py-4 text-[15px] font-semibold text-forest shadow-xl transition-all hover:bg-white hover:scale-102"
                >
                  <span>Démarrer l&apos;essai gratuit 14 jours</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-cream/70">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-sage-300" />
                  Sans carte bancaire
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-sage-300" />
                  Prêt en 3 minutes
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-sage-300" />
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
