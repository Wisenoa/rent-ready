import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";

export const dynamic = "force-dynamic";

export default function OutilsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] font-[family-name:var(--font-sans)]">
      <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#f8f7f4]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-stone-900"
          >
            RentReady
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/outils/calculateur-irl"
              className="hidden text-sm text-stone-500 transition-colors hover:text-stone-800 sm:inline"
            >
              Calculateur IRL
            </Link>
            <Link
              href="/outils/calculateur-loyer"
              className="hidden text-sm text-stone-500 transition-colors hover:text-stone-800 sm:inline"
            >
              Calculateur Loyer
            </Link>
            <Link
              href="/outils/calculateur-charges"
              className="hidden text-sm text-stone-500 transition-colors hover:text-stone-800 sm:inline"
            >
              Calculateur Charges
            </Link>
            <Link
              href="/outils/calculateur-depot-garantie"
              className="hidden text-sm text-stone-500 transition-colors hover:text-stone-800 sm:inline"
            >
              Dépôt Garantie
            </Link>
            <Link
              href="/modeles"
              className="hidden text-sm text-stone-500 transition-colors hover:text-stone-800 sm:inline"
            >
              Modèles
            </Link>
            <SmartHeaderCta />
          </div>
        </nav>
      </header>

      {/* Skip to main content — accessibility WCAG 2.1 AA */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#1a1a2e] focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
      >
        Aller au contenu principal
      </a>
      <main id="main" className="flex-1">{children}</main>

      <footer className="border-t border-stone-200/60 bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-6">
          <p>
            &copy; {new Date().getFullYear()} RentReady. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-stone-700"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition-colors hover:text-stone-700"
            >
              Confidentialité
            </Link>
            <Link
              href="/cgu"
              className="transition-colors hover:text-stone-700"
            >
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
