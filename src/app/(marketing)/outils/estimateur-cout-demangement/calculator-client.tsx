"use client";

import { useState } from "react";
import Link from "next/link";

const FURNITURE_LEVELS = [
  { id: "studio", label: "Studio / T1", volumeMin: 8, volumeMax: 15, pricePerKm: 0.5 },
  { id: "t2", label: "T2 / Appartement 2 pièces", volumeMin: 15, volumeMax: 30, pricePerKm: 0.7 },
  { id: "t3", label: "T3 / Appartement 3 pièces", volumeMin: 30, volumeMax: 50, pricePerKm: 0.9 },
  { id: "t4", label: "T4 / Maison 4 pièces", volumeMin: 50, volumeMax: 80, pricePerKm: 1.1 },
  { id: "t5plus", label: "T5+ / Maison 5 pièces+", volumeMin: 80, volumeMax: 120, pricePerKm: 1.3 },
];

const SERVICE_PRICES = {
  packing: { label: "Emballage complet par déménageur", pricePerCbm: 25 },
  unpacking: { label: "Déballage et déballage", pricePerCbm: 15 },
  disassembly: { label: "Démontage / Remontage meubles", flat: 150 },
  storage: { label: "Stockage temporaire (par m³/mois)", pricePerCbm: 20 },
  fragile: { label: "Protection objets fragiles", flat: 120 },
  cleaning: { label: "Nettoyage logement quitté", flat: 100 },
};

const FAQ = [
  {
    question: "Combien coûte un déménagement en France en moyenne ?",
    answer:
      "Le coût moyen d'un déménagement en France varie de 300 € à 2 500 € selon le volume et la distance. Un déménagement local (moins de 50 km) pour un T3 coûte généralement entre 600 € et 1 200 €. Un déménagement longue distance (plus de 500 km) pour le même volume peut coûter entre 1 200 € et 2 500 €.",
  },
  {
    question: "Comment calculer le volume à déménager ?",
    answer:
      "La méthode la plus simple : multipliez la superficie de votre logement par 0.4 pour un logement meublé ou 0.3 pour un logement peu meublé. Par exemple, un appartement de 60 m² meublé représente environ 24 m³. Vous pouvez aussi utiliser un calculateur de volume en ligne ou demander un devis à un déménageur.",
  },
  {
    question: "Les frais de déménagement sont-ils déductibles des impôts ?",
    answer:
      "Oui, dans certains cas : si vous êtes salarié et devez déménager pour des raisons professionnelles (mutation, nouvel emploi à plus de 70 km), vous pouvez déduire vos frais réels de déménagement. Vous devez opter pour le régime des frais réels dans votre déclaration d'impôts et conserver les factures.",
  },
  {
    question: "Faut-il réserver un déménageur à l'avance ?",
    answer:
      "Oui, il est recommandé de réserver au moins 2 à 3 mois à l'avance, surtout entre mai et septembre (période de pointe des déménagement). Les prix sont généralement plus bas en hiver (novembre à mars). Comparez toujours au moins 3 devis de déménagement pour obtenir le meilleur prix.",
  },
  {
    question: "Quelle est la différence entre un déménagement avec professionnel et en demenageur ?",
    answer:
      "Le déménageur professionnel fournit le camion, les équipements, et la main d'œuvre. C'est la formule la plus complète mais aussi la plus chère. Vous pouvez aussi louer un camion et déménager vous-même (formule économique) ou utiliser un container de stockage (type SOS Demenagement) où vouslez vos affaires et le container est transporté.",
  },
];

interface Result {
  volume: number;
  basePrice: number;
  distancePrice: number;
  servicesTotal: number;
  totalEstimate: number;
  totalMin: number;
  totalMax: number;
  selectedServices: string[];
}

export function CoutDemangementClient() {
  const [furnitureType, setFurnitureType] = useState("t3");
  const [customVolume, setCustomVolume] = useState("");
  const [distance, setDistance] = useState("50");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const furnitureConfig = FURNITURE_LEVELS.find((f) => f.id === furnitureType) || FURNITURE_LEVELS[2];

  function calculate() {
    const volume = parseFloat(customVolume) || ((furnitureConfig.volumeMin + furnitureConfig.volumeMax) / 2);
    const dist = parseInt(distance) || 50;

    if (volume <= 0) return;

    // Base price: volume × price coefficient
    const basePrice = volume * 30; // 30€/m³ base

    // Distance price: volume × price per km (with minimum 100km)
    const effectiveDist = Math.max(dist, 10);
    const distancePrice = volume * furnitureConfig.pricePerKm * effectiveDist;

    // Services
    let servicesTotal = 0;
    const services: string[] = [];
    selectedServices.forEach((svc) => {
      const p = SERVICE_PRICES[svc as keyof typeof SERVICE_PRICES];
      if (!p) return;
      if ("pricePerCbm" in p) {
        servicesTotal += p.pricePerCbm * volume;
        services.push(p.label);
      } else {
        servicesTotal += p.flat;
        services.push(p.label);
      }
    });

    const totalEstimate = basePrice + distancePrice + servicesTotal;
    const totalMin = totalEstimate * 0.7;
    const totalMax = totalEstimate * 1.4;

    setResult({
      volume: Math.round(volume * 10) / 10,
      basePrice: Math.round(basePrice),
      distancePrice: Math.round(distancePrice),
      servicesTotal: Math.round(servicesTotal),
      totalEstimate: Math.round(totalEstimate),
      totalMin: Math.round(totalMin),
      totalMax: Math.round(totalMax),
      selectedServices: services,
    });
  }

  function toggleService(svc: string) {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
    setResult(null);
  }

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-6">Paramètres du déménagement</h2>
        <div className="space-y-5">
          {/* Furniture type selector */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Taille du logement</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {FURNITURE_LEVELS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { setFurnitureType(f.id); setCustomVolume(""); setResult(null); }}
                  className={`p-3 rounded-xl border text-left transition-colors ${furnitureType === f.id ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:border-stone-300"}`}
                >
                  <p className="font-semibold text-stone-800 text-sm">{f.label}</p>
                  <p className="text-xs text-stone-400">{f.volumeMin}-{f.volumeMax} m³</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Volume exact <span className="text-stone-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={customVolume}
              onChange={(e) => { setCustomVolume(e.target.value); setResult(null); }}
              placeholder={`Volume estimé : ${Math.round((furnitureConfig.volumeMin + furnitureConfig.volumeMax) / 2)} m³`}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Distance (km)</label>
            <input
              type="number"
              min="1"
              step="10"
              value={distance}
              onChange={(e) => { setDistance(e.target.value); setResult(null); }}
              placeholder="Ex. : 50"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">Services complémentaires</label>
            <div className="space-y-2">
              {Object.entries(SERVICE_PRICES).map(([key, svc]) => (
                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedServices.includes(key) ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:border-stone-300"}`}>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(key)}
                    onChange={() => toggleService(key)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800 text-sm">{svc.label}</p>
                    <p className="text-xs text-stone-400">
                      {"pricePerCbm" in svc ? `${svc.pricePerCbm} €/m³` : `${svc.flat} € (forfait)`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors text-base"
          >
            Estimer le coût du déménagement
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className="bg-orange-50 border border-orange-300 rounded-xl p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-stone-500 mb-1">Fourchette de prix estimée</p>
                <p className="text-4xl font-bold text-orange-700">
                  {result.totalMin.toLocaleString("fr-FR")} – {result.totalMax.toLocaleString("fr-FR")} €
                </p>
              </div>
              <div className="space-y-3 border-t border-orange-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Volume estimé</span>
                  <span className="font-semibold text-stone-800">{result.volume} m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Tarif base ({result.volume} m³ × 30 €)</span>
                  <span className="font-semibold text-stone-800">{result.basePrice.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Frais de distance ({distance} km)</span>
                  <span className="font-semibold text-stone-800">{result.distancePrice.toLocaleString("fr-FR")} €</span>
                </div>
                {result.servicesTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Services ({result.selectedServices.length})</span>
                    <span className="font-semibold text-stone-800">{result.servicesTotal.toLocaleString("fr-FR")} €</span>
                  </div>
                )}
              </div>
              <div className="mt-4 bg-white rounded-lg p-3">
                <p className="text-xs text-stone-500">
                  <strong>Note :</strong> Ces prix sont des estimations indicatives. Pour un devis précis, demandez des devis à plusieurs entreprises de déménagement. Les prix varient selon la saison, la disponibilité, et les conditions d'accès.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing guide */}
      <div className="bg-stone-100 border border-stone-300 rounded-xl p-5">
        <h3 className="font-bold text-stone-800 mb-3">📊 Prix moyens du déménagement en France</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-600">Studio / T1 (10-15 m³, &lt;50 km)</span>
            <span className="font-semibold text-stone-800">300 – 600 €</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-600">T2 / Appartement 2 pièces (20-30 m³)</span>
            <span className="font-semibold text-stone-800">500 – 1 000 €</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-600">T3 / Appartement 3 pièces (30-50 m³)</span>
            <span className="font-semibold text-stone-800">700 – 1 500 €</span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-600">T4 / Maison 4 pièces (50-80 m³)</span>
            <span className="font-semibold text-stone-800">1 000 – 2 200 €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">T5+ / Maison 5 pièces+ (80-120 m³)</span>
            <span className="font-semibold text-stone-800">1 500 – 3 000 €</span>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-6">Questions fréquentes</h2>
        <div className="space-y-5">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-semibold text-stone-800 mb-2">{item.question}</h3>
              <p className="text-stone-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
        <Link href="/guides/quittance-loyer" className="text-blue-600 hover:underline">Guide quittance de loyer →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Logiciel gestion locative →</Link>
      </div>
    </div>
  );
}
