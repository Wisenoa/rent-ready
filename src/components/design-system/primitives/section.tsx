import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Section({
  children,
  eyebrow,
  title,
  description,
  action,
  className,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || action;

  return (
    <section className={cn("space-y-4", className)} {...props}>
      {hasHeader && (
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[#151413]/10 pb-2">
          <div>
            {eyebrow && (
              <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold block">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#151413]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[#6B6760] mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0 pt-1 sm:pt-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-t border-[#151413]/10 my-6", className)} />;
}
