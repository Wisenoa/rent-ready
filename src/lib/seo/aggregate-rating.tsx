/**
 * AggregateRating schema builder — E-E-A-T trust signal.
 *
 * Google uses AggregateRating to display star ratings in rich results.
 * Use on: product pages, template pages, tool pages.
 *
 * @see https://schema.org/AggregateRating
 */

export interface AggregateRatingInput {
  /** Overall rating value (e.g. 4.8) */
  ratingValue: number;
  /** Total number of ratings received */
  reviewCount: number;
  /** Optional: best rating (defaults to 5) */
  bestRating?: number;
  /** Optional: rating count string (e.g. "2400+") for display */
  ratingCountDisplay?: string;
}

/**
 * Builds a Schema.org AggregateRating object.
 * Use with buildGraphSchema() to embed in a @graph array.
 */
export function buildAggregateRatingSchema(input: AggregateRatingInput) {
  const { ratingValue, reviewCount, bestRating = 5 } = input;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: ratingValue.toFixed(1),
    bestRating: bestRating,
    reviewCount: reviewCount,
    ...(input.ratingCountDisplay
      ? { itemReviewed: { "@type": "Offer", name: "RentReady" } }
      : {}),
  };
}

/**
 * TrustScoreBar — visual star rating component for display.
 * Shows filled/partial stars + rating number + review count.
 */
interface TrustScoreBarProps {
  rating: number; // e.g. 4.8
  reviewCount: number;
  maxStars?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}

export function TrustScoreBar({
  rating,
  reviewCount,
  maxStars = 5,
  size = "sm",
  showCount = true,
}: TrustScoreBarProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);
  const starSize = size === "sm" ? "size-3" : "size-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="inline-flex items-center gap-2">
      {/* Stars */}
      <div className={`flex gap-0.5 ${starSize}`} aria-label={`Note ${rating} sur ${maxStars}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && <HalfStarIcon className="text-amber-400" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={`empty-${i}`} className="text-stone-200" />
        ))}
      </div>

      {/* Numeric rating */}
      <span className={`font-semibold text-stone-900 ${textSize}`}>
        {rating.toFixed(1)}
      </span>

      {/* Review count */}
      {showCount && (
        <span className={`text-stone-400 ${textSize}`}>
          ({reviewCount.toLocaleString("fr-FR")} avis)
        </span>
      )}
    </div>
  );
}

function StarIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.6l-3.7 2 .7-4.1-3-2.9 4.1-.7L8 1z" />
    </svg>
  );
}

function HalfStarIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path fill="url(#half)" d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.6l-3.7 2 .7-4.1-3-2.9 4.1-.7L8 1z" />
    </svg>
  );
}
