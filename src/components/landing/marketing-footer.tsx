"use client";

import Link from "next/link";
import { useState } from "react";

const FOOTER_LINKS = {
  Produit: [
    { href: "/gestion-locative", label: "Fonctionnalités" },
    { href: "/features", label: "Fonctionnalités détaillées" },
    { href: "/locations", label: "Gestion locative" },
    { href: "/bail", label: "Baux" },
    { href: "/quittances", label: "Quittances" },
    { href: "/entretien", label: "Entretien" },
    { href: "/pricing", label: "Tarifs" },
  ],
  "Pour bien commencer": [
    { href: "/guides/modele-bail", label: "Modèle de bail gratuit" },
    { href: "/guides/quittance-loyer", label: "Comment faire une quittance" },
    { href: "/guides/depot-garantie", label: "Dépôt de garantie" },
    { href: "/guides/irl-2026", label: "Révision IRL 2026" },
    { href: "/guides/relance-loyer", label: "Lettre de relance" },
  ],
  Ressources: [
    { href: "/blog", label: "Blog" },
    { href: "/glossaire-immobilier", label: "Glossaire" },
    { href: "/guides", label: "Guides pratiques" },
    { href: "/templates", label: "Modèles gratuits" },
    { href: "/outils", label: "Outils et calculateurs" },
    { href: "/demo", label: "Démo" },
  ],
  Développeurs: [
    { href: "https://github.com/Wisenoa/rent-ready", label: "GitHub Repo" },
    { href: "https://github.com/Wisenoa/rent-ready#readme", label: "Documentation" },
    { href: "https://github.com/Wisenoa/rent-ready/blob/master/docs/API_OPENAPI_SPEC.yaml", label: "API Spec" },
  ],
  Outils: [
    { href: "/guides/irl-2026", label: "Révision IRL 2026" },
    { href: "/outils/calculateur-loyer", label: "Calculateur de loyer" },
    { href: "/outils/calculateur-depot-garantie", label: "Dépôt de garantie" },
    { href: "/outils/calculateur-rendement", label: "Rendement locatif" },
    { href: "/outils/lettre-relance-loyer", label: "Lettre de relance" },
    { href: "/modeles/bail-vide", label: "Modèle bail PDF" },
    { href: "/modeles/quittance-de-loyer", label: "Quittance PDF" },
  ],
  Légal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/politique-confidentialite", label: "Confidentialité" },
    { href: "/cgu", label: "CGU" },
  ],
};

export function MarketingFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to email provider (Mailchimp / Brevo)
    setSubmitted(true);
  };

  return (
    <footer className="border-t border-stone-200/60 bg-[#f8f7f4]">
      {/* Newsletter strip */}
      <div className="border-b border-stone-200/60 bg-stone-900 py-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[13px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Newsletter
            </p>
            <p className="text-[14px] text-stone-400 max-w-sm">
              Conseils, modèle de lettres, actualités locatives — chaque semaine.
            </p>
          </div>
          {submitted ? (
            <p className="text-[14px] text-blue-400 font-medium">
              Merci ! Vous êtes inscrit.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full sm:w-auto gap-2 shrink-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                className="w-full sm:w-64 px-3 py-2 rounded-lg text-[13px] bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
              >
                S&apos;inscrire
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 font-bold text-sm text-white">
                R
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-stone-900">
                RentReady
              </span>
            </Link>
            <p className="text-[13px] text-stone-500 leading-relaxed max-w-[200px]">
              Le pilotage automatique de la gestion locative pour propriétaires bailleurs.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-stone-900 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-stone-400">
            &copy; {new Date().getFullYear()} RentReady. Tous droits réservés.
          </p>
          <p className="text-[12px] text-stone-400">
            Conçu en France &middot; Données hébergées en Europe
          </p>
        </div>
      </div>
    </footer>
  );
}
