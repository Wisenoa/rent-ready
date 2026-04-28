"use client";

import { useEffect, useState } from "react";

function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  };
}

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utms, setUtms] = useState<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }>({});

  useEffect(() => {
    setUtms(getUtmParams());
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/lead/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          properties: formData.get("properties"),
          message: formData.get("message"),
          ...utms,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-800">
          Demande envoyée !
        </p>
        <p className="mt-2 text-sm text-emerald-600">
          Nous vous répondrons sous 24h pour fixer un créneau de 30 minutes.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Hidden UTM fields */}
      <input type="hidden" name="utm_source" value={utms.utm_source ?? ""} />
      <input type="hidden" name="utm_medium" value={utms.utm_medium ?? ""} />
      <input type="hidden" name="utm_campaign" value={utms.utm_campaign ?? ""} />

      <div>
        <label htmlFor="demo-name" className="block text-sm font-medium text-stone-700">
          Votre nom
        </label>
        <input
          type="text"
          id="demo-name"
          name="name"
          required
          className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Jean Dupont"
        />
      </div>

      <div>
        <label htmlFor="demo-email" className="block text-sm font-medium text-stone-700">
          Email professionnel
        </label>
        <input
          type="email"
          id="demo-email"
          name="email"
          required
          className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="jean@exemple.fr"
        />
      </div>

      <div>
        <label htmlFor="demo-properties" className="block text-sm font-medium text-stone-700">
          Nombre de biens à gérer
        </label>
        <select
          id="demo-properties"
          name="properties"
          className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="1-3">1 à 3 biens</option>
          <option value="4-10">4 à 10 biens</option>
          <option value="10+">Plus de 10 biens</option>
        </select>
      </div>

      <div>
        <label htmlFor="demo-message" className="block text-sm font-medium text-stone-700">
          Questions ou besoins spécifiques (optionnel)
        </label>
        <textarea
          id="demo-message"
          name="message"
          rows={3}
          className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Par exemple : je gère une SCI, je veux comprendre comment importer mes baux..."
        />
      </div>

      {error && (
        <div role="alert" aria-live="polite">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-stone-900 py-4 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-800 disabled:opacity-60"
      >
        {loading ? "Envoi en cours..." : "Demander ma démo gratuite"}
      </button>

      <p className="text-center text-xs text-stone-500">
        Sans engagement · Réponse sous 24h
      </p>
    </form>
  );
}
