"use client";

import { useState, useMemo } from "react";
import type { Listing } from "@/data/listings";

interface ListingFiltersProps {
  listings: Listing[];
  onFilter: (filtered: Listing[]) => void;
}

const ALL_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Grenoble",
];

const PRICE_RANGES = [
  { label: "Tous", min: 0, max: Infinity },
  { label: "≤ 600 €", min: 0, max: 600 },
  { label: "600–800 €", min: 600, max: 800 },
  { label: "800–1000 €", min: 800, max: 1000 },
  { label: "1000–1300 €", min: 1000, max: 1300 },
  { label: "> 1300 €", min: 1300, max: Infinity },
];

const BEDROOM_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "Studio", value: "0" },
  { label: "1 chambre", value: "1" },
  { label: "2 chambres", value: "2" },
  { label: "3+ chambres", value: "3" },
];

export function ListingFilters({ listings, onFilter }: ListingFiltersProps) {
  const [selectedCity, setSelectedCity] = useState<string>("Tous");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("all");

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[selectedPriceRange];
    return listings.filter((l) => {
      if (selectedCity !== "Tous" && !l.city.includes(selectedCity)) return false;
      if (l.price < range.min || l.price > range.max) return false;
      if (selectedBedrooms !== "all") {
        const n = parseInt(selectedBedrooms);
        if (n === 0 && l.type !== "studio" && l.bedrooms !== 0) return false;
        if (n > 0 && l.bedrooms < n) return false;
      }
      return true;
    });
  }, [listings, selectedCity, selectedPriceRange, selectedBedrooms]);

  // Notify parent whenever filters change
  useMemo(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  const activeCount = filtered.length;

  return (
    <div className="mb-8 space-y-4">
      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        {/* City */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-600">Ville</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="Tous">Toutes</option>
            {ALL_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-600">Loyer</label>
          <div className="flex flex-wrap gap-1">
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setSelectedPriceRange(i)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedPriceRange === i
                    ? "bg-blue-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-600">Chambres</label>
          <div className="flex flex-wrap gap-1">
            {BEDROOM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedBedrooms(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedBedrooms === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2 border-t border-stone-200 pt-3 text-sm text-stone-500">
        <span>
          <strong className="font-semibold text-stone-800">{activeCount}</strong>{" "}
          bien{activeCount !== 1 ? "s" : ""} trouvé{activeCount !== 1 ? "s" : ""}
          {selectedCity !== "Tous" ? ` à ${selectedCity}` : ""}
        </span>
        {(selectedCity !== "Tous" || selectedPriceRange !== 0 || selectedBedrooms !== "all") && (
          <button
            onClick={() => {
              setSelectedCity("Tous");
              setSelectedPriceRange(0);
              setSelectedBedrooms("all");
            }}
            className="ml-2 text-xs text-blue-600 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}