"use client";

import { useState } from "react";
import LISTINGS, { type Listing } from "@/data/listings";
import { ListingCard } from "@/components/listings/listing-card";

const ALL_CITIES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice",
  "Nantes", "Montpellier", "Strasbourg", "Bordeaux",
  "Lille", "Rennes", "Grenoble",
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
  { label: "1 ch.", value: "1" },
  { label: "2 ch.", value: "2" },
  { label: "3+ ch.", value: "3" },
];

export function ListingSearch() {
  const [selectedCity, setSelectedCity] = useState("Tous");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState("all");

  const filtered = LISTINGS.filter((l) => {
    if (selectedCity !== "Tous" && !l.city.includes(selectedCity)) return false;
    const range = PRICE_RANGES[selectedPrice];
    if (l.price < range.min || l.price > range.max) return false;
    if (selectedBedrooms !== "all") {
      const n = parseInt(selectedBedrooms);
      if (n === 0 && l.type !== "studio") return false;
      if (n > 0 && l.bedrooms < n) return false;
    }
    return true;
  });

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        {/* City */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-stone-600">Ville</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="Tous">Toutes</option>
            {ALL_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-stone-200" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-stone-600">Loyer</label>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setSelectedPrice(i)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedPrice === i
                    ? "bg-blue-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-stone-200" />

        {/* Bedrooms */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-stone-600">Type</label>
          <div className="flex flex-wrap gap-1.5">
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

      {/* ── Results count + reset ── */}
      <div className="mb-6 flex items-center gap-3">
        <p className="text-sm text-stone-500">
          <span className="font-semibold text-stone-800">{filtered.length}</span>{" "}
          bien{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          {selectedCity !== "Tous" ? ` à ${selectedCity}` : ""}
        </p>
        {(selectedCity !== "Tous" || selectedPrice !== 0 || selectedBedrooms !== "all") && (
          <button
            onClick={() => {
              setSelectedCity("Tous");
              setSelectedPrice(0);
              setSelectedBedrooms("all");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white py-16 text-center">
          <p className="text-stone-500">Aucun bien ne correspond à vos critères.</p>
          <button
            onClick={() => {
              setSelectedCity("Tous");
              setSelectedPrice(0);
              setSelectedBedrooms("all");
            }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}