import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Server-rendered content under a calculator: explanations, FAQ and the way to
 * Lokna. Everything here is in the initial HTML, so it stays indexable.
 */

export function ToolExplainer({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-10">
      <h2 id={id} className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.65rem]">
        {title}
      </h2>
      <div className="prose mt-4 max-w-none">{children}</div>
    </section>
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function ToolFaq({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line pt-10">
      <h2 id="faq-title" className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.65rem]">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-line-soft rounded-xl border border-line bg-white">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-medium text-ink hover:text-forest focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest [&::-webkit-details-marker]:hidden">
              {item.question}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-7 text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** After the value, never before it: what Lokna does with the same numbers. */
export function ToolCta({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby="tool-cta-title"
      className="grid gap-6 rounded-2xl border border-line bg-white px-6 py-7 sm:px-8 lg:grid-cols-[1.5fr_auto] lg:items-center"
    >
      <div>
        <h2 id="tool-cta-title" className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <div className="mt-2 max-w-2xl text-[15px] leading-7 text-ink-muted">{children}</div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-forest px-5 text-[15px] font-medium text-cream transition-colors hover:bg-forest-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          Essayer Lokna gratuitement
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          href="/gestion-locative"
          className="text-[15px] font-medium text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          Découvrir Lokna
        </Link>
      </div>
    </section>
  );
}
