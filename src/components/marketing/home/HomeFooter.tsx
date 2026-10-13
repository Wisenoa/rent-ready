import Link from "next/link";
import { LoknaLogo } from "@/components/ui/lokna-logo";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { href: "/gestion-locative", label: "Logiciel de gestion locative" },
      { href: "/features", label: "Fonctionnalités" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/quittances", label: "Quittances de loyer" },
      { href: "/register", label: "Essai gratuit" },
    ],
  },
  {
    title: "Outils gratuits",
    links: [
      { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
      { href: "/outils/generateur-quittance", label: "Générateur de quittance" },
      { href: "/outils/modele-quittance-loyer-pdf", label: "Modèle de quittance PDF" },
      { href: "/outils/calculateur-depot-garantie", label: "Plafond du dépôt de garantie" },
      { href: "/outils", label: "Tous les outils" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/guides", label: "Guides du bailleur" },
      { href: "/villes", label: "Gestion locative par ville" },
      { href: "/glossaire-immobilier", label: "Glossaire" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/politique-confidentialite", label: "Confidentialité et RGPD" },
      { href: "/cgu", label: "CGU" },
    ],
  },
];

export function HomeFooter() {
  return (
    <footer className="border-t border-[#D9D5CC] bg-[#F5F3EF] text-[#4F5D56]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <LoknaLogo size={24} />
          <p className="mt-3 max-w-[18rem] text-[14px] leading-6">
            Logiciel de gestion locative pour les propriétaires bailleurs qui
            louent eux-mêmes.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-[14px] font-semibold text-[#15241F]">{column.title}</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#15241F] focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto max-w-7xl border-t border-[#D9D5CC] px-5 py-6 text-[13px] sm:px-8">
        © 2024–2026 Lokna. Tous droits réservés.
      </p>
    </footer>
  );
}
