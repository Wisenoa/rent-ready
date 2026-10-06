"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    basePrice: 9,
    maxProperties: 3,
    description: "Idéal pour démarrer",
    features: ["Quittances conformes", "Révision IRL", "Relances automatic", "Portail locataire"],
  },
  {
    id: "pro",
    name: "Pro",
    basePrice: 15,
    maxProperties: 10,
    description: "Pour gestion professionnelle",
    features: [
      "Tout Starter +",
      "OCR IA factures",
      "Export comptable",
      "Conformité Factur-X",
      "Multi-utilisateurs",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    basePrice: 0,
    maxProperties: 999,
    description: "Pour agences et SCI",
    features: ["Tout Pro +", "API access", "Support dédié", "Onboarding personnalisé", "Reporting avancé"],
    isCustom: true,
  },
];

const ADDONS = [
  { id: "relance", label: "Relance automatique des impayés", included: true, planRequired: "starter" },
  { id: "ocr", label: "OCR IA — lecture automatique des factures", included: false, planRequired: "pro" },
  { id: "export", label: "Export comptable (FEC, PDF)", included: false, planRequired: "pro" },
  { id: "facturx", label: "Conformité Factur-X", included: false, planRequired: "pro" },
  { id: "portail", label: "Portail locataire avancé", included: true, planRequired: "starter" },
  { id: "irl-auto", label: "Révision IRL automatique", included: true, planRequired: "starter" },
  { id: "multiuser", label: "Multi-utilisateurs avec rôles", included: false, planRequired: "pro" },
  { id: "api", label: "Accès API & webhooks", included: false, planRequired: "agency" },
];

function getRecommendedPlan(propertyCount: number): string {
  if (propertyCount <= 3) return "starter";
  if (propertyCount <= 10) return "pro";
  return "agency";
}

function getAddonsForPlan(planId: string): string[] {
  return ADDONS.filter((a) => a.planRequired === planId || (planId === "agency")).map((a) => a.id);
}

function getPrice(planId: string, propertyCount: number, selectedAddons: string[]): number {
  if (planId === "agency") return 0;
  const base = PLANS.find((p) => p.id === planId)?.basePrice ?? 9;
  // Extra properties over the base limit
  const plan = PLANS.find((p) => p.id === planId);
  const extra = Math.max(0, propertyCount - (plan?.maxProperties ?? 3));
  const extraCost = extra * 2; // 2 €/mois par bien supplémentaire
  return base + extraCost;
}

export function PricingCalculatorClient() {
  const [propertyCount, setPropertyCount] = useState(3);
  const [selectedPlan, setSelectedPlan] = useState("starter");

  const recommendedPlan = getRecommendedPlan(propertyCount);
  const monthlyPrice = getPrice(selectedPlan, propertyCount, []);
  const yearlySavings = selectedPlan !== "agency" && monthlyPrice > 0 ? monthlyPrice * 2 : 0; // 2 months free on annual

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Gratuit — Takes 30 seconds
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl text-balance">
          Estimez votre tarif RentReady en 30 secondes
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Sélectionnez le nombre de biens que vous gérez et découvrez le plan adapté à votre situation.
          Aucun frais caché.
        </p>
      </div>

      {/* Property Count Selector */}
      <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Combien de biens gérez-vous ?</h2>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => {
                setPropertyCount(n);
                setSelectedPlan(getRecommendedPlan(n));
              }}
              className={`flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                propertyCount === n
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                  : "border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {n === 20 ? "20+ biens" : `${n} bien${n > 1 ? "s" : ""}`}
            </button>
          ))}
        </div>

        {/* Custom count */}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-stone-500">Autre nombre :</label>
          <input
            type="number"
            min={1}
            max={500}
            value={propertyCount > 20 ? propertyCount : ""}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v > 0) {
                setPropertyCount(v);
                setSelectedPlan(getRecommendedPlan(v));
              }
            }}
            placeholder="Ex: 7"
            className="w-20 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mb-10">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">
          Plan recommandé pour {propertyCount} bien{propertyCount > 1 ? "s" : ""}
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isRecommended = plan.id === getRecommendedPlan(propertyCount);
            const isSelected = plan.id === selectedPlan;
            return (
              <div
                key={plan.id}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all ${
                  isSelected
                    ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-md ring-2 ring-blue-200"
                    : isRecommended
                    ? "border-stone-200 bg-white"
                    : "border-stone-200 bg-white opacity-60"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {isRecommended && !isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-stone-100 px-3 py-0.5 text-xs font-medium text-stone-600">
                    Recommandé
                  </div>
                )}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
                    Sélectionné
                  </div>
                )}

                <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-stone-500">{plan.description}</p>

                <div className="mt-4 mb-4">
                  {plan.isCustom ? (
                    <div className="text-2xl font-bold text-stone-900">Sur devis</div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-stone-900">
                        {getPrice(plan.id, propertyCount, []) === 0 && plan.basePrice > 0
                          ? getPrice(plan.id, propertyCount, [])
                          : getPrice(plan.id, propertyCount, [])}
                        {getPrice(plan.id, propertyCount, []) > 0 && (
                          <span className="text-base font-normal text-stone-500">/mois</span>
                        )}
                      </div>
                      {getPrice(plan.id, propertyCount, []) > 0 && (
                        <p className="mt-1 text-xs text-stone-400">
                          soit {getPrice(plan.id, propertyCount, []) * 10} €/an (facturation annuelle)
                        </p>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                  {plan.id === "starter" && `Jusqu'à 3 biens — ${plan.basePrice} €/mois`}
                  {plan.id === "pro" && `Jusqu'à 10 biens — ${plan.basePrice} €/mois`}
                  {plan.id === "agency" && "Biens illimités — tarif personnalisé"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      {selectedPlan !== "agency" && (
        <div className="mb-10 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
          <div className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-600">
            Votre estimation
          </div>
          <div className="text-4xl font-bold text-stone-900">
            {monthlyPrice} €<span className="text-lg font-normal text-stone-500">/mois</span>
          </div>
          <p className="mt-2 text-sm text-stone-500">
            {propertyCount} bien{propertyCount > 1 ? "s" : ""} · Plan {PLANS.find((p) => p.id === selectedPlan)?.name}
          </p>
          {yearlySavings > 0 && (
            <p className="mt-1 text-sm text-green-600">
              Économisez {yearlySavings} € avec la facturation annuelle (2 mois offerts)
            </p>
          )}
        </div>
      )}

      {selectedPlan === "agency" && (
        <div className="mb-10 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
          <div className="mb-2 text-lg font-bold text-stone-900">Tarif Agency — sur devis</div>
          <p className="text-sm text-stone-600">
           Tarif personnalisé basé sur la taille de votre portfolio et vos besoins spécifiques. Includes dedicated support, onboarding, and SLA.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Démarrer l&apos;essai gratuit de 14 jours
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-8 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Voir tous les tarifs en détail
        </Link>
      </div>

      {/* Reassurance */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-stone-400">
        <span>✓ Essai gratuit 14 jours</span>
        <span>✓ Sans carte bancaire</span>
        <span>✓ Sans engagement</span>
        <span>✓ Résiliation en 1 clic</span>
      </div>
    </div>
  );
}