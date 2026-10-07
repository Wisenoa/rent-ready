import React from "react";
import { cn } from "@/lib/utils";
import { StatusDot, type StatusTone } from "./status-dot";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  tone?: StatusTone;
  showDot?: boolean;
  size?: "xs" | "sm" | "default";
}

/**
 * StatusBadge — Badge sémantique discret B+ V2.1
 *
 * Évite le look "pilule criarde". Utilise un fond feutré très clair
 * et une bordure fine pour maintenir la quiétude de la page.
 */
export function StatusBadge({
  children,
  tone = "neutral",
  showDot = false,
  size = "sm",
  className,
  ...props
}: StatusBadgeProps) {
  const toneClasses = {
    calm: "bg-emerald-50 text-emerald-800 border-emerald-200",
    attention: "bg-orange-50 text-orange-800 border-orange-200",
    delayed: "bg-amber-50 text-amber-900 border-amber-200",
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  }[tone];

  const sizeClass = {
    xs: "text-[11px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    default: "text-xs px-2.5 py-1",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-sans font-medium rounded-md",
        toneClasses,
        sizeClass,
        className
      )}
      {...props}
    >
      {showDot && <StatusDot tone={tone} size="sm" />}
      <span>{children}</span>
    </span>
  );
}
