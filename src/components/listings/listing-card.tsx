import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/data/listings";

interface ListingCardProps {
  listing: Listing;
}

const TYPE_LABELS: Record<Listing["type"], string> = {
  appartement: "Appartement",
  maison: "Maison",
  studio: "Studio",
  colocation: "Colocation",
  "local-commercial": "Local commercial",
};

const ENERGY_COLORS: Record<Listing["energyRating"], string> = {
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

function formatSurface(n: number) {
  return `${n} m²`;
}

export function ListingCard({ listing }: ListingCardProps) {
  const href = `/locations/${listing.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={listing.photos[0]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
            {TYPE_LABELS[listing.type]}
          </span>
        </div>
        {/* Energy rating */}
        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${ENERGY_COLORS[listing.energyRating]}`}
          >
            {listing.energyRating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-xl font-bold text-stone-900">
            {formatPrice(listing.price)}
          </span>
          <span className="text-sm text-stone-500">/mois</span>
          {listing.charges > 0 && (
            <span className="ml-1 text-xs text-stone-400">
              {formatPrice(listing.charges)} charges
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-sm font-semibold leading-snug text-stone-800 group-hover:text-blue-700">
          {listing.title}
        </h3>

        {/* Location */}
        <p className="mb-3 flex items-center gap-1 text-xs text-stone-500">
          <span>📍</span>
          <span>
            {listing.city}, {listing.postalCode}
          </span>
        </p>

        {/* Specs */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
            {formatSurface(listing.surface)}
          </span>
          {listing.type !== "local-commercial" && (
            <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} ch.`}
            </span>
          )}
          {listing.floor !== undefined && (
            <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              {listing.floor > 0 ? `${listing.floor}e étage` : "RDC"}
            </span>
          )}
          {listing.furnished && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
              Meublé
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-400">
          <span>{listing.landlordType === "particulier" ? "Particulier" : listing.landlordType === "agence" ? "Agence" : "Gestionnaire"}</span>
          <span className="flex items-center gap-1">
            Disponibilité{" "}
            {new Date(listing.availableFrom).toLocaleDateString("fr-FR", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}