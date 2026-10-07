"use client";

import Link from "next/link";
import { SAME_AS, SITE_NAME } from "@/data/entity";
import { ShieldCheck } from "lucide-react";

const FOOTER_LINKS = {
  Produit: [
    { href: "/#cycle-mensuel", label: "Cycle mensuel" },
    { href: "/#fonctionnalites", label: "Fonctionnalités" },
    { href: "/#tarifs", label: "Tarifs" },
    { href: "/demo", label: "Démonstration" },
    { href: "/quittances", label: "Quittances de loyer" },
    { href: "/bail", label: "Gestion des baux" },
  ],
  "Outils gratuits": [
    { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
    { href: "/outils/calculateur-depot-garantie", label: "Plafond dépôt de garantie" },
    { href: "/outils/generateur-quittance", label: "Générateur de quittance gratuit" },
    { href: "/outils/calculateur-charges-locatives", label: "Régularisation des charges" },
    { href: "/outils/lettre-relance-loyer", label: "Modèle lettre de relance" },
    { href: "/outils", label: "Tous les calculateurs" },
  ],
  "Guides & Ressources": [
    { href: "/guides/modele-bail", label: "Modèle de bail conforme" },
    { href: "/guides/quittance-loyer", label: "Législation quittance de loyer" },
    { href: "/guides/depot-garantie", label: "Guide dépôt de garantie" },
    { href: "/guides/irl-2026", label: "Guide révision IRL 2026" },
    { href: "/glossaire-immobilier", label: "Glossaire de la gestion locative" },
    { href: "/blog", label: "Blog & actualités" },
  ],
  Légal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/politique-confidentialite", label: "Politique de confidentialité" },
    { href: "/politique-cookies", label: "Gestion des cookies" },
    { href: "/cgu", label: "Conditions Générales d'Utilisation" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f8f7f4] text-stone-600">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 font-bold text-sm text-white">
                R
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-stone-900">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-[13px] text-stone-600 leading-relaxed max-w-xs">
              Pilotage locatif rigoureux et automatisé pour propriétaires indépendants.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[12px] font-medium text-stone-600">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>Hébergé en France · RGPD</span>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-900 mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-stone-600 transition-colors hover:text-stone-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2024–2026 {SITE_NAME}. Tous droits réservés. Conforme à la loi du 6 juillet 1989.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/mentions-legales" className="hover:text-stone-800">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-800">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-stone-800">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}