import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import LISTINGS from "@/data/listings";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) return {};
  return baseMetadata({
    title: `${listing.title} — ${listing.price}€/mois à ${listing.city} | RentReady`,
    description: listing.description.slice(0, 160),
    url: `/locations/${listing.id}`,
    ogType: "website",
  });
}

const TYPE_LABELS: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  studio: "Studio",
  colocation: "Colocation",
  "local-commercial": "Local commercial",
};

const ENERGY_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-green-50 text-green-700",
  C: "bg-yellow-50 text-yellow-700",
  D: "bg-orange-50 text-orange-700",
  E: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
  G: "bg-red-200 text-red-900",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.title,
    description: listing.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      postalCode: listing.postalCode,
      addressCountry: "FR",
    },
    numberOfRooms: listing.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.surface,
      unitCode: "MTK",
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <SchemaMarkup data={schema} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Locations", href: "/locations" },
            { label: listing.city, href: `/locations/${listing.id}`, isCurrentPage: true },
          ]}
        />
      </div>

      {/* ── Photo gallery hero ── */}
      <div className="relative bg-stone-900" style={{ aspectRatio: "16/7" }}>
        <Image
          src={listing.photos[0]}
          alt={listing.title}
          fill
          className="object-cover opacity-80"
          priority
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badges overlay */}
        <div className="absolute left-6 top-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-stone-800 backdrop-blur-sm">
            {TYPE_LABELS[listing.type] ?? listing.type}
          </span>
          {listing.furnished && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
              Meublé
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${ENERGY_COLORS[listing.energyRating]}`}
          >
            Énergie {listing.energyRating}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        {/* Title + price row */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-lg text-stone-500">
              <span>📍</span>
              <span>
                {listing.address}, {listing.postalCode} {listing.city}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-700">
              {formatPrice(listing.price)}
              <span className="text-lg font-normal text-stone-500"> /mois</span>
            </div>
            {listing.charges > 0 && (
              <div className="mt-1 text-sm text-stone-500">
                dont {formatPrice(listing.charges)} de charges
              </div>
            )}
          </div>
        </div>

        {/* Quick specs */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
            <div className="text-2xl">📐</div>
            <div className="mt-1 text-lg font-semibold text-stone-800">
              {listing.surface} m²
            </div>
            <div className="text-xs text-stone-500">Surface habitable</div>
          </div>
          {listing.type !== "local-commercial" && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
              <div className="text-2xl">🛏️</div>
              <div className="mt-1 text-lg font-semibold text-stone-800">
                {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} chambres`}
              </div>
              <div className="text-xs text-stone-500">Pièces</div>
            </div>
          )}
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
            <div className="text-2xl">🏢</div>
            <div className="mt-1 text-lg font-semibold text-stone-800">
              {listing.floor !== undefined
                ? listing.floor === 0
                  ? "RDC"
                  : `${listing.floor}e étage`
                : "—"}
            </div>
            <div className="text-xs text-stone-500">Étage</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
            <div className="text-2xl">📅</div>
            <div className="mt-1 text-lg font-semibold text-stone-800">
              {new Date(listing.availableFrom).toLocaleDateString("fr-FR", {
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-xs text-stone-500">Disponibilité</div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">Description</h2>
          <p className="leading-relaxed text-stone-600">{listing.description}</p>
        </section>

        {/* Équipements / Features */}
        {listing.features.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-stone-900">
              Équipements
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {listing.features.map((a) => (
                <div
                  key={a}
                  className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3"
                >
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-stone-700">{a}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Energy & environment */}
        <section className="mb-10 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Performance énergétique
          </h2>
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-2xl font-bold ${ENERGY_COLORS[listing.energyRating]}`}
            >
              {listing.energyRating}
            </span>
            <div>
              <div className="font-medium text-stone-700">
                Classe énergie {listing.energyRating}
              </div>
              <div className="text-sm text-stone-500">
                Indice de performance énergétique (DPE)
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-stone-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">
            Intéressé par ce bien ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            Créez votre dossier locataire en 5 minutes et postulez directement.
            Mise en relation gratuite avec le propriétaire.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Créer mon dossier
            </Link>
            <Link
              href="/locations"
              className="inline-block rounded-lg border border-stone-600 px-6 py-3 font-medium text-white transition-colors hover:border-stone-400 hover:text-stone-200"
            >
              ← Voir tous les biens
            </Link>
          </div>
        </section>

        {/* Logement social notice */}
        <p className="mt-6 text-center text-xs text-stone-400">
          RentReady n&apos;est pas un агence immobiliere. Nous facilitons la mise en
          relation entre propriétaires et locataires via notre plateforme.
        </p>
      </div>
    </div>
  );
}