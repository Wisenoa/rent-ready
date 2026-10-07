"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";
import { PLANS, Plan } from "@/data/entity";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const starterPlan = PLANS.find((p) => p.id === "starter")!;
  const proPlan = PLANS.find((p) => p.id === "pro")!;

  return (
    <section id="tarifs" className="py-24 sm:py-32 lg:py-40 bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            Tarifs clairs &amp; transparents
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-stone-900 leading-tight">
            Le juste prix pour votre patrimoine.
            <br />
            <span className="text-stone-600 font-normal">
              Sans commission sur vos loyers, résiliable en 1 clic.
            </span>
          </h2>
          <p className="mt-4 text-base text-stone-600">
            Tous les forfaits incluent les 14 jours d&apos;essai gratuit sans carte bancaire.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center rounded-full border border-stone-300 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "annual"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>Facturation annuelle</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                2 mois offerts
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <motion.div
            className="relative rounded-3xl border border-stone-200 bg-white p-7 sm:p-9 shadow-lg flex flex-col justify-between"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring.gentle}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-md bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-700">
                  {starterPlan.name}
                </span>
                <span className="text-xs text-stone-500 font-medium">1 à 3 logements</span>
              </div>

              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-stone-900">
                    {billingCycle === "monthly" ? starterPlan.monthlyPrice : Math.round(starterPlan.annualPrice! / 12)}
                  </span>
                  <span className="text-xl font-bold text-stone-700">€</span>
                  <span className="text-sm text-stone-500 font-normal">/mois</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  {billingCycle === "annual"
                    ? `Facturé ${starterPlan.annualPrice} € par an`
                    : "Sans engagement, résiliable à tout moment"}
                </p>
              </div>

              <p className="text-[13px] text-stone-600 mb-6 pb-6 border-b border-stone-100 leading-relaxed">
                {starterPlan.summary}
              </p>

              <ul className="space-y-3 mb-8 text-[13px] text-stone-700">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Jusqu&apos;à 3 biens gérés</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Locataires illimités</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Quittances conformes loi du 6 juillet 1989</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Suivi des paiements &amp; gestion des soldes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Révision annuelle IRL calculée selon l&apos;INSEE</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Portail locataire sécurisé avec jeton unique</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 py-3.5 text-sm font-semibold text-stone-800 transition-all"
              >
                <span>Essai gratuit Starter — 14 jours</span>
                <ArrowRight className="size-4 text-stone-500" />
              </Link>
              <p className="mt-2.5 text-center text-[11px] text-stone-500">
                Sans carte bancaire · Activation immédiate
              </p>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="relative rounded-3xl border-2 border-stone-900 bg-white p-7 sm:p-9 shadow-2xl flex flex-col justify-between"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.gentle, delay: 0.1 }}
          >
            {/* Recommended Ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-1 text-[11px] font-semibold text-white shadow-sm">
              Le choix recommandé
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-md bg-stone-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {proPlan.name}
                </span>
                <span className="text-xs text-stone-500 font-medium">Jusqu&apos;à 10 logements</span>
              </div>

              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-stone-900">
                    {billingCycle === "monthly" ? proPlan.monthlyPrice : Math.round(proPlan.annualPrice! / 12)}
                  </span>
                  <span className="text-xl font-bold text-stone-700">€</span>
                  <span className="text-sm text-stone-500 font-normal">/mois</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  {billingCycle === "annual"
                    ? `Facturé ${proPlan.annualPrice} € par an`
                    : "Sans engagement, résiliable à tout moment"}
                </p>
              </div>

              <p className="text-[13px] text-stone-600 mb-6 pb-6 border-b border-stone-100 leading-relaxed">
                {proPlan.summary}
              </p>

              <ul className="space-y-3 mb-8 text-[13px] text-stone-700">
                <li className="flex items-center gap-2.5 font-medium text-stone-900">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Tout ce qui est inclus dans Starter</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Jusqu&apos;à 10 biens gérés</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Relances automatiques des retards par email</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>OCR et analyse des factures artisans par IA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Conformité Factur-X &amp; exports comptables complets</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Support prioritaire sous 24h ouvrées</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 py-3.5 text-sm font-semibold text-white shadow-lg transition-all"
              >
                <span>Essai gratuit Pro — 14 jours</span>
                <ArrowRight className="size-4 text-stone-300" />
              </Link>
              <p className="mt-2.5 text-center text-[11px] text-stone-500">
                Sans carte bancaire · Activation immédiate
              </p>
            </div>
          </motion.div>
        </div>

        {/* Comparison mini-table against Agency and Excel */}
        <div className="mt-16 max-w-3xl mx-auto rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4 text-center">
            Repères de coût annuel pour 2 appartements loués 800 € / mois
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-stone-50 p-3.5">
              <p className="text-xs text-stone-500 font-medium">Agence de gestion (7 %)</p>
              <p className="text-lg font-bold text-stone-900 mt-1">~1 344 € / an</p>
              <p className="text-[11px] text-stone-500 mt-0.5">+ frais d&apos;entrée</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-3.5">
              <p className="text-xs text-stone-500 font-medium">Tableur Excel manuel</p>
              <p className="text-lg font-bold text-stone-900 mt-1">0 €</p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">~5 h / mois d&apos;astreinte</p>
            </div>
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/60 p-3.5">
              <p className="text-xs text-emerald-800 font-semibold">RentReady Starter</p>
              <p className="text-lg font-bold text-emerald-900 mt-1">89 € / an</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Sérénité &amp; conformité</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
