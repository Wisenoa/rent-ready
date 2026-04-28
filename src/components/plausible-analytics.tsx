'use client';

/**
 * Plausible Analytics integration for the marketing site.
 *
 * Plausible is privacy-first and GDPR-compliant — ideal for:
 * - Marketing pages (no cookie consent required in EU)
 * - SEO performance tracking (organic sessions, referrers)
 * - Simple pageview + custom event tracking
 *
 * For product in-app analytics, use PostHogProvider instead.
 *
 * Env vars required (add to .env.local):
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=rentready.fr
 *   NEXT_PUBLIC_PLAUSIBLE_API_KEY=<optional — for server-side API>
 *
 * The data-domain attribute must match your Plausible site domain.
 * Events are tracked via window.plausible() (injected by the script below).
 */

const PLAUSIBLE_SCRIPT = `https://plausible.io/js/script.tagged-events.js`;

interface PlausibleAnalyticsProps {
  domain?: string;
  children?: React.ReactNode;
}

export function PlausibleAnalytics({ domain }: PlausibleAnalyticsProps) {
  const siteDomain = domain ?? process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'rentready.fr';

  return (
    <>
      {/* Plausible Analytics — loads asynchronously, never blocks rendering */}
      <script
        defer
        data-domain={siteDomain}
        src={PLAUSIBLE_SCRIPT}
      />
      {/* Enable link tagging for outbound link tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments);
            };
          `,
        }}
      />
    </>
  );
}

/**
 * Hook to track custom Plausible events.
 *
 * Usage:
 *   import { usePlausible } from '@/components/plausible-analytics';
 *   const plausible = usePlausible();
 *   plausible('Signup', { props: { method: 'email' } });
 *
 * Note: Plausible's custom event API uses window.plausible directly.
 * This hook is a thin wrapper for TypeScript support.
 */
export function usePlausible() {
  const trackEvent = (
    eventName: string,
    options?: { props?: Record<string, string | number | boolean> }
  ) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, options);
    }
  };

  return { trackEvent };
}
