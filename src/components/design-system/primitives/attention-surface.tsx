import React from "react";
import { cn } from "@/lib/utils";

interface AttentionSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  level?: "primary" | "secondary";
  className?: string;
}

/**
 * AttentionSurface — Pavé de tension pour les exceptions actives
 *
 * Utilise un accent de bordure gauche terracotta vif (primary) ou ambre (secondary),
 * avec un fond chaud très subtil.
 */
export function AttentionSurface({
  children,
  level = "primary",
  className,
  ...props
}: AttentionSurfaceProps) {
  const borderAccent =
    level === "primary"
      ? "border-l-[3px] border-l-[#C2410C] border-[#FED7AA]/70 bg-[#FFF7ED]/50"
      : "border-l-[3px] border-l-[#D97706] border-[#FDE68A]/70 bg-[#FEF3C7]/40";

  return (
    <div
      className={cn(
        "border p-4 sm:p-5 transition-all",
        borderAccent,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
