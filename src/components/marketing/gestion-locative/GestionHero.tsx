import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { formatEntryPrice, SITE_NAME } from "@/data/entity";

export function GestionHero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24">
      {/* Subtle architectural ambient background glow */}
      <div 
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(127, 166, 142, 0.25), rgba(245, 243, 239, 0) 70%)"
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              {
                label: "Logiciel de gestion locative",
                href: "/gestion-locative",
                isCurrentPage: true,
              },
            ]}
          />
        </div>

        {/* Hero Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left / Editorial Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Target Audience Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-white/80 backdrop-blur-xs px-3.5 py-1.5 text-xs font-medium text-[#1E3A2F] shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-[#1E3A2F]" aria-hidden="true" />
              <span>Conçu pour les propriétaires bailleurs indépendants (1 à 10 biens)</span>
            </div>

            {/* Main Title (H1) */}
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#15241F] leading-[1.12]">
              La gestion locative sans tableur, sans stress, sans paperasse.
            </h1>

            {/* Refined Subhead */}
            <p className="text-base sm:text-lg text-[#5A6660] leading-relaxed max-w-2xl font-normal">
              {SITE_NAME} réunit vos biens, locataires, loyers et quittances dans un espace clair et rigoureux.
              Calcul automatique des encaissements, quittances conformes à la loi de 1989 en un clic, et rappels de révision IRL.
              <strong className="block mt-2 font-medium text-[#15241F]">
                Tout ce qui est en règle reste silencieux. Vous n&apos;intervenez que si une action est requise.
              </strong>
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] px-6 py-3.5 text-sm sm:text-base font-medium text-white shadow-sm transition-all hover:bg-[#15241F] hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
              >
                <span>Essayer gratuitement 14 jours</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
              <a
                href="#demo-interactive"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D0C5] bg-white/90 px-5 py-3.5 text-sm sm:text-base font-medium text-[#15241F] shadow-2xs transition-colors hover:bg-[#F5F3EF] hover:border-[#BFB9AC] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
              >
                <span>Voir la simulation en direct</span>
              </a>
            </div>

            {/* Micro-proof & Guarantee info */}
            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#5A6660]">
              <span className="flex items-center gap-1.5 font-medium text-[#1E3A2F]">
                <CheckCircle2 className="size-3.5 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                Dès {formatEntryPrice()}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                Sans carte bancaire requise
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                Conforme loi du 6 juillet 1989
              </span>
            </div>
          </div>

          {/* Right / Visual Product Composition Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-[#E5E2DA] bg-white p-2.5 shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Architectural Lifestyle Visual */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#FAF8F5]">
                <Image
                  src="/images/challenge/hero-lifestyle.webp"
                  alt="Intérieur lumineux d'appartement parisien avec bureau en chêne et suivi de gestion locative Lokna"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover transition-transform duration-500 hover:scale-102"
                />
                {/* Subtle soft gradient scrim on the visual bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating pill on the image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-white/95 backdrop-blur-md px-3 py-2 text-xs border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[#1E3A2F] animate-pulse" aria-hidden="true" />
                    <span className="font-medium text-[#15241F]">Vue d&apos;ensemble du patrimoine</span>
                  </div>
                  <span className="text-[11px] text-[#5A6660] font-medium">3 logements · 100% à jour</span>
                </div>
              </div>

              {/* Floating Real Product Interface Mockup Card */}
              <div className="mt-3 rounded-xl border border-[#E5E2DA] bg-[#FAF8F5]/80 p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-2 text-[11px] text-[#5A6660]">
                  <span className="font-semibold text-[#15241F] flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-[#1E3A2F]" aria-hidden="true" />
                    Tableau de bord · Échéance courante
                  </span>
                  <span className="font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded">
                    3 350,00 € encaissés
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#15241F] font-medium">12 Rue de Turenne, Paris 4e</span>
                    <span className="tabular-nums font-semibold text-[#1E3A2F]">1 100,00 € ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#15241F] font-medium">45 Av. de Saxe, Lyon 3e</span>
                    <span className="tabular-nums font-semibold text-[#1E3A2F]">1 600,00 € ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#15241F] font-medium">8 Rue Victor Hugo, Nantes</span>
                    <span className="tabular-nums font-semibold text-[#1E3A2F]">650,00 € ✓</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E2DA] flex items-center justify-between text-[11px] text-[#5A6660]">
                  <span>Quittances conformes loi 1989</span>
                  <span className="font-medium text-[#15241F]">Émises & prêtes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
