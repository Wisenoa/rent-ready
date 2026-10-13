"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import cities from "@/data/cities.json";

type City = (typeof cities)[number];

export function GestionCityExplorer() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("Toutes");

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const c of cities) {
      set.add(c.region);
    }
    return ["Toutes", ...Array.from(set).sort((a, b) => a.localeCompare(b, "fr"))];
  }, []);

  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      const matchSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.department.includes(search);
      const matchRegion =
        selectedRegion === "Toutes" || c.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [search, selectedRegion]);

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-[#FAF9F5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            Réglementations locales
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Lokna dans {cities.length} villes françaises
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Le logiciel est identique partout, mais les règles locales changent : encadrement des loyers, zone tendue, permis de louer. Consultez la fiche réglementaire de votre commune.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#7C8782]" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une ville ou un département (ex: Paris, 69, Bordeaux)..."
              className="w-full rounded-xl border border-[#D5D0C5] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#15241F] placeholder:text-[#7C8782] shadow-2xs focus:border-[#1E3A2F] focus:outline-hidden focus:ring-1 focus:ring-[#1E3A2F]"
            />
          </div>

          {/* Region selector pill carousel / dropdown */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {regions.slice(0, 5).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? "bg-[#1E3A2F] text-white"
                    : "bg-white border border-[#D5D0C5] text-[#5A6660] hover:bg-[#F5F3EF]"
                }`}
              >
                {reg}
              </button>
            ))}
            {regions.length > 5 && (
              <select
                value={regions.slice(5).includes(selectedRegion) ? selectedRegion : ""}
                onChange={(e) => {
                  if (e.target.value) setSelectedRegion(e.target.value);
                }}
                className="rounded-lg border border-[#D5D0C5] bg-white px-2 py-1.5 text-xs text-[#5A6660] focus:outline-hidden"
                aria-label="Autres régions"
              >
                <option value="">Autres régions...</option>
                {regions.slice(5).map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {filteredCities.map((city) => (
            <Link
              key={city.slug}
              href={`/gestion-locative/${city.slug}`}
              className="group flex items-center justify-between rounded-xl border border-[#E5E2DA] bg-white px-3.5 py-2.5 text-xs text-[#15241F] transition-all duration-150 hover:border-[#1E3A2F]/40 hover:bg-[#FAF8F5] hover:shadow-2xs"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="size-3 text-[#7C8782] group-hover:text-[#1E3A2F] shrink-0 transition-colors" aria-hidden="true" />
                <span className="font-medium truncate">{city.name}</span>
              </div>
              <span className="text-[10px] tabular-nums text-[#7C8782] bg-[#FAF8F5] px-1.5 py-0.5 rounded shrink-0">
                {city.department}
              </span>
            </Link>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="py-12 text-center text-xs text-[#5A6660]">
            Aucune ville ne correspond à « {search} ».
            <button
              onClick={() => {
                setSearch("");
                setSelectedRegion("Toutes");
              }}
              className="ml-2 font-medium text-[#1E3A2F] underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/villes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1E3A2F] hover:text-[#15241F] underline underline-offset-4"
          >
            <span>Voir toutes les villes de France et leur réglementation</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
