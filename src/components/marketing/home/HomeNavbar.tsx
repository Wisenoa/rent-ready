import Link from "next/link";
import { LoknaLogo } from "@/components/ui/lokna-logo";
import styles from "./home.module.css";

const LINKS = [
  { href: "#mois", label: "Un mois avec Lokna" },
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "/gestion-locative", label: "Gestion locative" },
];

export function HomeNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#FAF9F5]/10 bg-[#1E3A2F]/95 text-[#FAF9F5] backdrop-blur-md">
      {/* The skip link to #main comes from the root layout. */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="Lokna, accueil"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF9F5]"
          >
            <LoknaLogo variant="light" size={26} />
          </Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-6 text-[14px] text-[#FAF9F5]/80 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} transition-colors hover:text-[#FAF9F5] focus-visible:outline-none`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-[14px] text-[#FAF9F5]/80 transition-colors hover:text-[#FAF9F5] focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none sm:inline"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className={`${styles.cta} rounded-md bg-[#FAF9F5] px-4 py-2 text-[14px] font-medium text-[#1E3A2F] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]`}
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
