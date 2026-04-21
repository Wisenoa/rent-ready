"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, Search } from "lucide-react";
import glossaryData from "@/data/glossary.json";

// Slug -> label mapping from actual glossary data
const GLOSSARY_TERMS = glossaryData.map((e) => ({
  slug: e.slug,
  label: e.term,
}));

export function GlossarySidebar() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(GLOSSARY_TERMS.slice(0, 10));

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(GLOSSARY_TERMS.slice(0, 12));
    } else {
      const q = search.toLowerCase();
      setFiltered(
        GLOSSARY_TERMS.filter(
          (t) =>
            t.label.toLowerCase().includes(q) ||
            t.slug.toLowerCase().includes(q)
        ).slice(0, 12)
      );
    }
  }, [search]);

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

        {/* Term links */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Glossaire
            </span>
          </div>
          <ul className="space-y-1.5">
            {filtered.map((term) => (
              <li key={term.slug}>
                <Link
                  href={`/glossaire-immobilier/${term.slug}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs font-medium text-blue-700">
                    {term.label[0]}
                  </span>
                  {term.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
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
