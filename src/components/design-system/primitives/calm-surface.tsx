import React from "react";
import { cn } from "@/lib/utils";

interface CalmSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "subtle" | "raised";
  className?: string;
}

/**
 * CalmSurface — Surface feutrée pour les éléments réglés et calmes
 *
 * Fond papier beige rehaussé ou blanc avec filet d'encre ultra-fin.
 * Zéro couleur d'alarme, zéro shadow bruyante.
 */
export function CalmSurface({
  children,
  variant = "subtle",
  className,
  ...props
}: CalmSurfaceProps) {
  const bgClass = variant === "raised" ? "bg-white shadow-sm" : "bg-white";

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200/80 p-4 sm:p-5 text-neutral-900",
        bgClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
