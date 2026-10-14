import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import type { NavLink } from "./nav-data";

/**
 * "Do it now" box placed where a guide or a product page explains something a
 * free tool computes. One primary tool, optionally one secondary link.
 */
export function ToolCallout({
  title,
  text,
  tool,
  secondary,
  className = "",
}: {
  title: string;
  text: string;
  tool: NavLink;
  secondary?: NavLink;
  className?: string;
}) {
  return (
    <aside
      aria-label={title}
      className={`not-prose flex flex-col gap-4 rounded-xl border border-sage-200 bg-sage-50 p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-forest">
          <Calculator aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[15px] font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-[14px] leading-6 text-ink-muted">{text}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
        {secondary ? (
          <Link
            href={secondary.href}
            className="text-[14px] font-medium text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {secondary.label}
          </Link>
        ) : null}
        <Link
          href={tool.href}
          className="inline-flex items-center gap-1.5 rounded-md bg-forest px-4 py-2.5 text-[14px] font-medium text-cream transition-colors hover:bg-forest-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          {tool.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </aside>
  );
}
