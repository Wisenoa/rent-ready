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
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-neutral-200/80 pb-3">
          <div>
            {eyebrow && (
              <span className="text-xs font-medium text-neutral-500 block">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
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
  return <hr className={cn("border-t border-neutral-200/80 my-6", className)} />;
}
