"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, Search } from "lucide-react";

const ALL_TERMS = [
  "Bail", "Bailleur", "Charges locatives", "DPE", "Dépôt de garantie",
  "Décompte de charges", "État des lieux", "IRL", "Locataire",
  "Loyer", "Mise en demeure", "Quittance de loyer", "Révision de loyer",
  "Zone tendue", "SCI", "Colocation", "Diagnostic technique",
  "Provision sur charges", "Trêve hivernale", "Assurance PNO",
];

export function GlossarySidebar() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(ALL_TERMS.slice(0, 10));
    } else {
      const q = search.toLowerCase();
      setFiltered(
        ALL_TERMS.filter((t) => t.toLowerCase().includes(q)).slice(0, 8)
      );
    }
  }, [search]);

  const getLetter = (term: string) => term[0].toUpperCase();

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        {/* Search */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <Search className="size-4 text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Rechercher
            </span>
          </div>
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Popular / filtered terms */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Star className="size-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Termes clés
            </span>
          </div>
          <ul className="space-y-1.5">
            {filtered.map((term) => (
              <li key={term}>
                <a
                  href={`#${getLetter(term)}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs font-medium text-blue-700">
                    {getLetter(term)}
                  </span>
                  {term}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick letter navigation */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Navigation
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
              .filter(Boolean)
              .map((letter) => (
                <a
                  key={letter}
                  href={`#${letter}`}
                  className="flex h-8 items-center justify-center rounded-lg text-sm font-medium text-stone-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  {letter}
                </a>
              ))}
          </div>
        </div>

        {/* Inline CTA */}
        <div className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 text-center">
          <p className="mb-3 text-sm font-medium text-stone-700">
            Appliquez ces termes dans votre gestion locative
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
        </div>
      </div>
    </aside>
  );
}