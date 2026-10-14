"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { TOOL_LINKS } from "./tool-links";

/**
 * Rendered by the /outils layouts under every tool page: the guide behind the
 * tool, the next tools, the matching Lokna page, and the way back to /outils.
 * A client component only for usePathname — it renders on the server like the
 * rest of the page, so the links are in the initial HTML.
 */
export function ToolRelated() {
  const pathname = usePathname() ?? "";
  const links = TOOL_LINKS[pathname];
  if (!links) return null;
  const items = [...(links.learn ? [links.learn] : []), ...links.next, ...(links.product ? [links.product] : [])];

  return (
    <nav aria-labelledby="tool-related-title" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="tool-related-title" className="text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">
            Pour aller plus loin
          </h2>
          <Link
            href="/outils"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Tous les outils gratuits
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                className="group flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-cream px-4 py-3.5 text-[14px] font-medium text-ink transition-colors hover:border-sage-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                {item.label}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-forest transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
