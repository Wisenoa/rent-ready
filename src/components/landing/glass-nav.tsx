"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#cycle-mensuel", label: "Comment ça marche" },
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#simulateurs", label: "Outils gratuits" },
  { href: "#tarifs", label: "Tarifs" },
];

export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#f8f7f4]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 font-bold text-sm text-white">
            R
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-stone-900">
            RentReady
          </span>
        </Link>

        {/* Desktop Curated Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[14px] font-medium text-stone-600 transition-colors hover:text-stone-900 hover:bg-stone-200/50"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <SmartHeaderCta />
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-200/60 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-stone-200/80 bg-[#f8f7f4]/98 backdrop-blur-xl px-5 py-5 space-y-1 shadow-xl"
          onClick={() => setMenuOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-200/50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-stone-200/80 mt-3 space-y-1">
            <Link
              href="/outils"
              className="block rounded-lg px-3.5 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-100"
              onClick={() => setMenuOpen(false)}
            >
              Tous les calculateurs
            </Link>
            <Link
              href="/guides"
              className="block rounded-lg px-3.5 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-100"
              onClick={() => setMenuOpen(false)}
            >
              Guides de gestion
            </Link>
            <Link
              href="/blog"
              className="block rounded-lg px-3.5 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-100"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
          <div className="pt-3 border-t border-stone-200/80 mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-center rounded-xl border border-stone-300 bg-white py-2.5 text-[14px] font-semibold text-stone-800"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-center rounded-xl bg-stone-900 py-2.5 text-[14px] font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Essai gratuit 14 jours
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
