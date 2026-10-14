import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface ToolCardData {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

/** A tool in a list: icon, name, what it does. Used by /outils. */
export function ToolCard({ tool }: { tool: ToolCardData }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group flex w-full flex-col rounded-xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(21,36,31,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-[0_18px_40px_-28px_rgba(6,24,18,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sage-50 text-forest">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <span className="mt-4 text-[16px] font-semibold text-ink">{tool.title}</span>
      <span className="mt-1.5 flex-1 text-[14px] leading-6 text-ink-muted">{tool.description}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium text-forest">
        Ouvrir l&apos;outil
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </span>
    </Link>
  );
}

/**
 * A tool shown first, with a preview of the answer it gives — computed from the
 * same data and functions as the tool itself.
 */
export function FeaturedToolCard({
  tool,
  preview,
  action,
}: {
  tool: ToolCardData;
  preview: ReactNode;
  action: string;
}) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(21,36,31,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-sage-300 hover:shadow-[0_30px_60px_-40px_rgba(6,24,18,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest motion-reduce:transition-none"
    >
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-forest text-cream">
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </span>
        <span className="mt-5 text-[1.2rem] font-semibold tracking-[-0.015em] text-ink">{tool.title}</span>
        <span className="mt-2 text-[15px] leading-6 text-ink-muted">{tool.description}</span>
      </div>
      <div className="border-t border-line-soft bg-paper px-6 py-4 sm:px-7">{preview}</div>
      <div className="flex items-center justify-between gap-3 border-t border-line-soft px-6 py-4 text-[15px] font-medium text-forest sm:px-7">
        {action}
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </div>
    </Link>
  );
}
