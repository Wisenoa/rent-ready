"use client";

import { motion } from "framer-motion";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (value: boolean) => void;
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? "text-stone-900" : "text-stone-400"
        }`}
      >
        Mensuel
      </span>

      <button
        role="switch"
        aria-checked={isAnnual}
        aria-label="Choisir un abonnement annuel ou mensuel"
        onClick={() => onToggle(!isAnnual)}
        className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-stone-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        style={{ width: 52, height: 28 }}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
            isAnnual ? "translate-x-6" : "translate-x-1"
          }`}
        />
        {isAnnual && (
          <motion.span
            layoutId="annual-glow"
            className="absolute inset-0 rounded-full bg-emerald-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </button>

      <span className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${
            isAnnual ? "text-stone-900" : "text-stone-400"
          }`}
        >
          Annuel
        </span>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          −17%
        </span>
      </span>
    </div>
  );
}
