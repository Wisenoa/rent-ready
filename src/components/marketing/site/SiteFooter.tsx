import Link from "next/link";

import { LoknaLogo } from "@/components/ui/lokna-logo";
import { CONTACT_EMAIL } from "@/data/entity";

import { FOOTER_COLUMNS } from "./nav-data";

/**
 * The one footer of every public page. Links come from `nav-data.ts`; the
 * reassurance lines are facts checked against the product (hosting at OVH in
 * France, trial without a card) — nothing here may describe a planned feature.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper text-ink-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            aria-label="Lokna, accueil"
            className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
          >
            <LoknaLogo size={24} />
          </Link>
          <p className="mt-3 max-w-[19rem] text-[14px] leading-6">
            Le logiciel de gestion locative des propriétaires qui louent
            eux-mêmes, d&apos;un à dix logements.
          </p>
          <ul className="mt-4 space-y-1.5 text-[13px] leading-5">
            <li>Données hébergées en France (OVH)</li>
            <li>14 jours d&apos;essai, sans carte bancaire</li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-[14px] font-semibold text-ink">{column.title}</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-ink focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto max-w-7xl border-t border-line px-5 py-6 text-[13px] sm:px-8">
        © 2024–2026 Lokna. Tous droits réservés.
      </p>
    </footer>
  );
}
