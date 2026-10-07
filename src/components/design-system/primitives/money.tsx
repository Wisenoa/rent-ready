import React from "react";
import Decimal from "decimal.js";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: Decimal | number | string | null | undefined;
  tone?: "ink" | "calm" | "attention" | "delayed" | "muted";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  perPeriod?: string; // e.g. "/ mois"
}

/**
 * Money — Présentation financière tabulaire stricte
 *
 * Règle AGENTS.md §10 : Aucune logique financière en float JS.
 * Prend un Decimal/number/string et le formate canoniquement via Intl fr-FR.
 * Force la typographie monospace tabulaire pour l'alignement des chiffres et virgules.
 */
export function Money({
  amount,
  tone = "ink",
  size = "base",
  perPeriod,
  className,
  ...props
}: MoneyProps) {
  const formatted = formatCurrency(amount);

  const toneClass = {
    ink: "text-[#151413]",
    calm: "text-[#166534]",
    attention: "text-[#C2410C]",
    delayed: "text-[#D97706]",
    muted: "text-[#6B6760]",
  }[tone];

  const sizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold",
    "2xl": "text-2xl font-bold tracking-tight",
    "3xl": "text-3xl sm:text-4xl font-bold tracking-tight",
  }[size];

  return (
    <span
      className={cn("font-mono tabular-nums inline-flex items-baseline gap-1", toneClass, sizeClass, className)}
      {...props}
    >
      <span>{formatted}</span>
      {perPeriod && (
        <span className="text-xs font-normal font-sans text-[#6B6760]">
          {perPeriod}
        </span>
      )}
    </span>
  );
}
