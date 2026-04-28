"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  description: string;
  monthlyPrice: number | null; // null means "contact us"
  annualPrice: number | null;
  isAnnual: boolean;
  badge?: string;
  badgeColor?: "blue" | "emerald" | "amber";
  isHighlighted?: boolean;
  highlightColor?: "blue" | "emerald" | "amber";
  features: string[];
  cta: React.ReactNode;
  ctaNote?: string;
  propertyLimit?: string;
}

const badgeStyles = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

const highlightStyles = {
  blue: "border-blue-200/50 from-blue-50/40 to-white/60 shadow-blue-900/5",
  emerald:
    "border-emerald-200/50 from-emerald-50/40 to-white/60 shadow-emerald-900/5",
  amber:
    "border-amber-200/50 from-amber-50/30 to-white/60 shadow-amber-900/5",
};

const checkStyles = {
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
};

export function PricingCard({
  name,
  description,
  monthlyPrice,
  annualPrice,
  isAnnual,
  badge,
  badgeColor = "blue",
  isHighlighted = false,
  highlightColor = "blue",
  features,
  cta,
  ctaNote,
  propertyLimit,
}: PricingCardProps) {
  const displayPrice = isAnnual ? annualPrice : monthlyPrice;
  const period = isAnnual ? "/an" : "/mois";

  return (
    <motion.div
      layout
      className={`relative flex flex-col overflow-hidden rounded-[2rem] border bg-white/60 p-8 backdrop-blur-xl transition-shadow duration-300 sm:p-10 ${
        isHighlighted
          ? `${highlightStyles[highlightColor]} border-2 shadow-2xl`
          : "border-stone-200/30 shadow-xl shadow-stone-900/[0.04]"
      }`}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className={`absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl ${
          isHighlighted
            ? highlightColor === "emerald"
              ? "bg-emerald-100/40"
              : highlightColor === "amber"
              ? "bg-amber-100/40"
              : "bg-blue-100/40"
            : "bg-stone-100/20"
        }`}
      />
      <div aria-hidden className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-teal-100/20 blur-3xl" />

      <div className="relative flex flex-col flex-1">
        {/* Badge */}
        {badge && (
          <div className="mb-6 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[badgeColor]}`}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Plan name + limit */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-stone-900">{name}</h3>
          {propertyLimit && (
            <p className="mt-0.5 text-sm text-stone-500">{propertyLimit}</p>
          )}
        </div>
        <p className="mb-8 text-sm text-stone-500 leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="mb-8">
          {displayPrice !== null ? (
            <div className="flex items-baseline gap-1">
              <motion.span
                key={displayPrice}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-5xl font-extrabold tracking-tighter ${
                  isHighlighted && highlightColor === "emerald"
                    ? "text-emerald-700"
                    : "text-stone-900"
                }`}
              >
                {displayPrice}
              </motion.span>
              <span
                className={`text-xl font-semibold ${
                  isHighlighted && highlightColor === "emerald"
                    ? "text-emerald-600"
                    : "text-stone-400"
                }`}
              >
                €
              </span>
              <span className="text-base text-stone-400">{period}</span>
            </div>
          ) : (
            <div className="text-4xl font-extrabold tracking-tight text-stone-900">
              Sur devis
            </div>
          )}

          {isAnnual && monthlyPrice && annualPrice && (
            <p className="mt-1.5 text-sm font-medium text-emerald-600">
              Soit{" "}
              {Math.round(annualPrice / 12)} €/mois · Économie de{" "}
              {monthlyPrice * 12 - annualPrice} €/an
            </p>
          )}
          {!isAnnual && monthlyPrice && (
            <p className="mt-1.5 text-sm text-stone-500">
              Sans engagement · Résiliez quand vous voulez
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-stone-600"
            >
              <span
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${checkStyles[badgeColor]}`}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {cta}
        {ctaNote && (
          <p className="mt-3 text-center text-xs text-stone-400">{ctaNote}</p>
        )}
      </div>
    </motion.div>
  );
}
