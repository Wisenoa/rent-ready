"use client";

import { useState } from "react";
import Link from "next/link";

type Room = {
  name: string;
  surface: string;
  ceilingHeight: string;
  type: "principal" | "accessoire";
  included: boolean;
};

const FAQ = [
  {
    question: "Quelle est la différence entre surface habitable et surface privative ?",
    answer: "La surface habitable (loi Boutin) est la surface de plancher construite après déduction des murs, cloisons, marches, gaines, et parties de moins de 1.80m de hauteur. La surface privative (loi Carrez) est similaire mais s'applique aux lots de copropriété et inclut certaines dépendances. Pour un bail, c'est la surface habitable qui doit être mentionnée.",
  },
  {
    question: "Les combles sont-ils comptés dans la surface habitable ?",
    answer: "Les combles non aménagés ne sont pas compter. Les combles aménagés le sont si la hauteur sous plafond est d'au moins 1.80m. Une pièce mansardée avec une pente de toit ne compte que la partie où la hauteur est ≥ 1.80m.",
  },
  {
    question: "Que se passe-t-il si la surface mentionnée dans le bail est erronée ?",
    answer: "Si la surface réelle est inférieure de plus de 5% à celle mentionnée dans le bail, le locataire peut demander une diminution proportionnelle du loyer. Cette action doit être faite dans les 3 mois suivant la signature du bail.",
  },
  {
    question: "Le balcon ou la terrasse compte-t-il dans la surface habitable ?",
    answer: "Non, les balcons, terrasses et loggias ne sont pas inclus dans la surface habitable. Ils peuvent être mentionnés séparément dans le bail comme annexes.",
  },
  {
    question: "Une cave ou un parking fait-il partie de la surface habitable ?",
    answer: "Non, les caves, garages, parkings et greniers non aménagés ne font pas partie de la surface habitable. Ils peuvent être loués séparément comme annexes.",
  },
];

const ROOM_TYPES = [
  { name: "Séjour / Salon", type: "principal" as const },
  { name: "Chambre", type: "principal" as const },
  { name: "Cuisine", type: "principal" as const },
  { name: "Salle de bain", type: "principal" as const },
  { name: "WC", type: "principal" as const },
  { name: "Bureau / Dressing", type: "principal" as const },
  { name: "Couloir / Entrée", type: "accessoire" as const },
  { name: "Dressing (si > 4m²)", type: "accessoire" as const },
  { name: "Combles aménagés (< 1.80m partie déduite)", type: "principal" as const },
];

export function SurfaceHabitableClient() {
  const [rooms, setRooms] = useState<Room[]>([
    { name: "Séjour", surface: "", ceilingHeight: "2.50", type: "principal", included: true },
    { name: "Chambre 1", surface: "", ceilingHeight: "2.50", type: "principal", included: true },
    { name: "Chambre 2", surface: "", ceilingHeight: "2.50", type: "principal", included: true },
    { name: "Cuisine", surface: "", ceilingHeight: "2.50", type: "principal", included: true },
    { name: "Salle de bain", surface: "", ceilingHeight: "2.50", type: "principal", included: true },
  ]);

  const [customRooms, setCustomRooms] = useState<Room[]>([]);

  const addRoom = () => {
    setCustomRooms([...customRooms, { name: "", surface: "", ceilingHeight: "2.50", type: "principal", included: true }]);
  };

  const removeRoom = (index: number) => {
    setCustomRooms(customRooms.filter((_, i) => i !== index));
  };

  const updateCustomRoom = (index: number, field: keyof Room, value: string | boolean) => {
    const updated = [...customRooms];
    if (field === "included") {
      updated[index] = { ...updated[index], [field]: value as boolean };
    } else {
      updated[index] = { ...updated[index], [field]: value as string };
    }
    setCustomRooms(updated);
  };

  const updateRoom = (index: number, field: keyof Room, value: string) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: value };
    setRooms(updated);
  };

  const toggleRoom = (index: number) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], included: !updated[index].included };
    setRooms(updated);
  };

  const allRooms = [...rooms.filter(r => r.included), ...customRooms.filter(r => r.included)];

  const habitableSurface = allRooms.reduce((sum, room) => {
    const surface = parseFloat(room.surface) || 0;
    const height = parseFloat(room.ceilingHeight) || 2.50;
    if (surface === 0) return sum;

    if (height < 1.80) return sum; // Not counted at all
    if (height < 2.50) {
      // Proportional reduction for 1.80-2.50m
      return sum + surface * ((height - 1.80) / 0.70);
    }
    return sum + surface;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-stone-800 mb-4">Pièces du logement</h2>

        {/* Default rooms */}
        <div className="space-y-4 mb-6">
          {rooms.map((room, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={room.included}
                onChange={() => toggleRoom(index)}
                className="w-5 h-5 accent-blue-600 flex-shrink-0"
              />
              <div className="flex-1 grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoom(index, "name", e.target.value)}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de la pièce"
                />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={room.surface}
                  onChange={(e) => updateRoom(index, "surface", e.target.value)}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Surface (m²)"
                />
                <input
                  type="number"
                  min="1.0"
                  max="5"
                  step="0.1"
                  value={room.ceilingHeight}
                  onChange={(e) => updateRoom(index, "ceilingHeight", e.target.value)}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hauteur (m)"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Custom rooms */}
        {customRooms.map((room, index) => (
          <div key={index} className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => removeRoom(index)}
              className="text-red-500 hover:text-red-700 text-sm px-2"
            >
              ✕
            </button>
            <div className="flex-1 grid grid-cols-3 gap-3">
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateCustomRoom(index, "name", e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la pièce"
              />
              <input
                type="number"
                min="0"
                step="0.5"
                value={room.surface}
                onChange={(e) => updateCustomRoom(index, "surface", e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Surface (m²)"
              />
              <input
                type="number"
                min="1.0"
                max="5"
                step="0.1"
                value={room.ceilingHeight}
                onChange={(e) => updateCustomRoom(index, "ceilingHeight", e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hauteur (m)"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRoom}
          className="w-full border-2 border-dashed border-stone-300 hover:border-blue-400 text-stone-500 hover:text-blue-600 font-semibold py-3 rounded-xl transition-colors"
        >
          + Ajouter une pièce
        </button>

        {/* Result */}
        {habitableSurface > 0 && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-stone-600 font-semibold">Surface habitable (loi Boutin)</span>
              <span className="text-3xl font-bold text-green-700">
                {habitableSurface.toFixed(2)} m²
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Surface après déduction des parties de moins de 1.80m de hauteur.
              Ne comprend pas : murs, cloisons, marches, gaines, ni annexes (balcon, cave, parking).
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">📋 Ce qui est INCLUS dans la surface habitable</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Toutes les pièces principales (séjour, chambres, cuisine, salle de bain)</li>
          <li>✅ Les bureaux et dressings</li>
          <li>✅ Les parties de hauteur ≥ 1.80m sous combles aménagés</li>
          <li>✅ Les couloirs et entrées</li>
        </ul>
        <h3 className="font-bold text-red-700 mt-4 mb-2">❌ Ce qui est EXCLU de la surface habitable</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>❌ Murs, cloisons, marches et gaines</li>
          <li>❌ Parties de hauteur &lt; 1.80m (sous combles, mansardes)</li>
          <li>❌ Balcons, terrasses, loggias</li>
          <li>❌ Caves, garages, parkings, greniers non aménagés</li>
        </ul>
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
        <Link href="/outils/calculateur-loyer" className="text-blue-600 hover:underline">Calculateur de loyer →</Link>
        <Link href="/modeles/etat-des-lieux" className="text-blue-600 hover:underline">Modèle état des lieux →</Link>
        <Link href="/pricing" className="text-blue-600 hover:underline">Essai gratuit →</Link>
      </div>
    </div>
  );
}
