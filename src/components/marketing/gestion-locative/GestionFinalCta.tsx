import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { SITE_NAME, formatEntryPrice } from "@/data/entity";

export function GestionFinalCta() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#1E3A2F] px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-2xl">
          {/* Subtle architectural radial lighting */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-96 w-full max-w-2xl -translate-x-1/2 opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(127, 166, 142, 0.8), rgba(30, 58, 47, 0))",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-[#DCE7E1] backdrop-blur-xs">
              <Shield className="size-3.5" aria-hidden="true" />
              <span>Prêt en 3 minutes</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              Commencez par configurer votre premier bien.
            </h2>

            <p className="text-sm sm:text-base text-[#DCE7E1] leading-relaxed">
              Ajoutez un locataire, un bail : {SITE_NAME} calcule le reste et vous avertit uniquement si une action est requise.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm sm:text-base font-semibold text-[#15241F] shadow-sm hover:bg-[#F5F3EF] hover:shadow-md transition-all"
              >
                <span>Démarrer l&apos;essai gratuit 14 jours</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-[#A8BDB4]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[#7FA68E]" aria-hidden="true" />
                Dès {formatEntryPrice()}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[#7FA68E]" aria-hidden="true" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[#7FA68E]" aria-hidden="true" />
                Résiliable à tout moment
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
