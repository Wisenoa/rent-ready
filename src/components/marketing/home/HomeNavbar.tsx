import React from "react";
import Link from "next/link";

export function HomeNavbar() {
  return (
    <header className="border-b border-[#E5E2DA] bg-[#F5F3EF]/95 backdrop-blur-md sticky top-0 z-40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-[#1E3A2F] focus:text-white focus:rounded-md focus:text-xs focus:shadow-md"
      >
        Passer au contenu principal
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]" aria-label="RentReady Accueil">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" aria-hidden="true" />
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#15241F]">
              RentReady
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#5A6660]" aria-label="Navigation principale">
            <a href="#demo" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
              Fonctionnement
            </a>
            <a href="#moments" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
              Moments clés
            </a>
            <a href="#outils" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
              Outils gratuits
            </a>
            <a href="#tarifs" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
              Tarifs
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-[#5A6660] hover:text-[#15241F] transition-colors hidden sm:inline focus:outline-hidden focus-visible:underline"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] text-xs font-medium transition-colors shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F] focus-visible:ring-offset-2"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
