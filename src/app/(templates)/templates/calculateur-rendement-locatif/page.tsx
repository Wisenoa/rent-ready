import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Calculateur de Rendement Locatif Gratuit — Brut & Net | RentReady",
  description:
    "Calculez le rendement brut et net de votre investissement locatif. Estimez la rentabilité nette de frais et charges, le TRI et le cash-flow. Outil gratuit.",
  keywords: [
    "calculateur rendement locatif",
    "rendement immobilier",
    "rentabilite location",
    "cash flow investissement",
    " TRI investissement locatif",
  ],
  openGraph: {
    title: "Calculateur de Rendement Locatif — RentReady",
    description:
      "Estimez le rendement brut et net de votre investissement locatif. Outil gratuit, aucun compte requis.",
    type: "website",
    url: "https://www.rentready.fr/templates/calculateur-rendement-locatif",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/calculateur-rendement-locatif",
  },
};

export default function CalculateurRendementPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
            📊 Calculateur gratuit
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Calculateur de Rendement Locatif
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            Estimez le rendement brut et net de votre investissement locatif.
            Comparez plusieurs biens pour choisir le meilleur.
          </p>
        </header>

        {/* Calculator placeholder */}
        <section className="mb-12 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-stone-900">
            Simulez votre rendement
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Prix d'achat (€)
              </label>
              <input
                type="number"
                placeholder="250000"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Loyer mensuel (€)
              </label>
              <input
                type="number"
                placeholder="1200"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Charges annuelles (€)
              </label>
              <input
                type="number"
                placeholder="2400"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Frais de notaire (€)
              </label>
              <input
                type="number"
                placeholder="20000"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Taxe foncière annuelle (€)
              </label>
              <input
                type="number"
                placeholder="1200"
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto">
              Calculer le rendement →
            </button>
          </div>
        </section>

        {/* Results explanation */}
        <section className="mb-12 rounded-2xl bg-amber-50 p-8">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">
            Comment interpreter les résultats ?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <div className="mb-2 text-2xl font-bold text-amber-600">4-5%</div>
              <p className="text-xs text-stone-500">Rendement brut moyen France</p>
              <p className="mt-2 text-sm text-stone-600">
                En dessous de 4%, la rentabilité est faible. Visez 6%+ pour un bon investissement.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="mb-2 text-2xl font-bold text-blue-600">2-3%</div>
              <p className="text-xs text-stone-500">Rendement net moyen</p>
              <p className="mt-2 text-sm text-stone-600">
                Après charges, taxe foncière et vacances locative. Le vrai indicateur.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="mb-2 text-2xl font-bold text-emerald-600">+5%</div>
              <p className="text-xs text-stone-500">Objectif net recommandé</p>
              <p className="mt-2 text-sm text-stone-600">
                Un rendement net de 5%+ apres vacance et charges est un bon investissement.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12 rounded-2xl bg-stone-900 px-6 py-10 text-center text-white">
          <h2 className="text-xl font-bold">
            Suivez vos rendements avec RentReady
          </h2>
          <p className="mx-auto mt-2 max-w-md text-stone-300">
            Automatisez le suivi de vos loyers, générez des quittances et estimez la révision IRL.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
            <ArrowRight className="size-4" />
          </Link>
        </section>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Tarifs →
          </Link>
        </nav>
      </article>
    </div>
  );
}
