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
    calm: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
    attention: "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
    delayed: "bg-[#FEF3C7] text-[#78350F] border-[#FDE68A]",
    neutral: "bg-[#FAF8F3] text-[#6B6760] border-[#E5E0D8]",
  }[tone];

  const sizeClass = {
    xs: "text-[11px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    default: "text-xs px-2.5 py-1",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-sans font-medium rounded-none",
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
