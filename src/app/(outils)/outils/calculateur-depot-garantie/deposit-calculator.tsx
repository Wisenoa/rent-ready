"use client";

import { useState } from "react";
import { Calculator, Euro, Building2, Home } from "lucide-react";

export function SecurityDepositCalculator() {
  const [rentAmount, setRentAmount] = useState<string>("800");
  const [chargesAmount, setChargesAmount] = useState<string>("100");
  const [leaseType, setLeaseType] = useState<"empty" | "furnished">("empty");

  const rent = parseFloat(rentAmount) || 0;
  const charges = parseFloat(chargesAmount) || 0;
  const totalRent = rent + charges;

  const depositEmpty = rent;
  const depositFurnished = rent * 2;

  const deposit = leaseType === "empty" ? depositEmpty : depositFurnished;
  const maxMonths = leaseType === "empty" ? 1 : 2;

  return (
    <div className="rounded-xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            <Euro className="mb-0.5 mr-1 inline size-4" />
            Loyer mensuel (hors charges)
          </label>
          <div className="relative">
            <input
              type="number"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 pr-10 text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="800"
              min="0"
              step="0.01"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
              €
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            <Euro className="mb-0.5 mr-1 inline size-4" />
            Charges mensuelles
          </label>
          <div className="relative">
            <input
              type="number"
              value={chargesAmount}
              onChange={(e) => setChargesAmount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 pr-10 text-stone-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="100"
              min="0"
              step="0.01"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
              €
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-stone-700">
          Type de location
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setLeaseType("empty")}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
              leaseType === "empty"
                ? "border-blue-600 bg-blue-50 text-blue-900"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
            }`}
          >
            <Home className="size-5" />
            <div className="text-left">
              <div className="font-medium">Location vide</div>
              <div className="text-sm opacity-70">Dépôt: 1 mois</div>
            </div>
          </button>
          <button
            onClick={() => setLeaseType("furnished")}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
              leaseType === "furnished"
                ? "border-blue-600 bg-blue-50 text-blue-900"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
            }`}
          >
            <Building2 className="size-5" />
            <div className="text-left">
              <div className="font-medium">Location meublée</div>
              <div className="text-sm opacity-70">Dépôt: 2 mois</div>
            </div>
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-stone-100 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900">
          <Calculator className="size-5" />
          Résultat du calcul
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 text-center">
            <div className="mb-1 text-sm text-stone-500">Loyer + charges</div>
            <div className="text-2xl font-bold text-stone-900">
              {totalRent.toLocaleString("fr-FR")} €
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="mb-1 text-sm text-blue-600">Plafond légal</div>
            <div className="text-sm font-medium text-blue-900">
              {maxMonths} mois de loyer
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="mb-1 text-sm text-green-600">Dépôt maximum</div>
            <div className="text-2xl font-bold text-green-700">
              {deposit.toLocaleString("fr-FR")} €
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-stone-500">
          Le dépôt de garantie est calculé sur le loyer principal{" "}
          <strong>sans les charges</strong>.
        </p>
      </div>
    </div>
  );
}