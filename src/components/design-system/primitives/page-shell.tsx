import React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "wide" | "full";
}

/**
 * PageShell — Socle architectural B+ V2.1
 *
 * Immerge l'interface dans la texture feutrée "fond papier" (#F8F6F0)
 * et établit la typographie et la palette d'encre contrastée.
 */
export function PageShell({
  children,
  className,
  maxWidth = "default",
  ...props
}: PageShellProps) {
  const maxWidthClass =
    maxWidth === "wide"
      ? "max-w-6xl"
      : maxWidth === "full"
      ? "max-w-none"
      : "max-w-5xl";

  return (
    <div
      className={cn(
        "min-h-full bg-[#F8F6F0] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#F8F6F0]",
        "-m-6 p-6 sm:p-8 md:p-10",
        className
      )}
      {...props}
    >
      <div className={cn("mx-auto space-y-8", maxWidthClass)}>
        {children}
      </div>
    </div>
  );
}
