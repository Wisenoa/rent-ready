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
      ? "rounded-lg border border-l-4 border-l-orange-500 border-orange-200 bg-orange-50/60"
      : "rounded-lg border border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/60";

  return (
    <div
      className={cn(
        "p-4 sm:p-5 transition-all text-neutral-900",
        borderAccent,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
