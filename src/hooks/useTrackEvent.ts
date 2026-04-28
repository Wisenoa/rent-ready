'use client';

import { useCallback } from 'react';
import { AnalyticsEvent, AnalyticsProperties } from '@/lib/analytics';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * Hook for tracking analytics events from client components.
 *
 * Usage:
 *   const { trackEvent } = useTrackEvent();
 *   trackEvent('signup_completed', { userId: user.id, method: 'email' });
 *
 * Works for both PostHog (if NEXT_PUBLIC_POSTHOG_KEY is set) and
 * Plausible (if NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set).
 */
export function useTrackEvent() {
  const trackEvent = useCallback(
    (event: AnalyticsEvent, properties: AnalyticsProperties = {}) => {
      // PostHog (primary)
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture(event, properties);
      }

      // Plausible (secondary — for marketing site pageviews)
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(event, { props: properties as Record<string, string | number | boolean> });
      }

      // Always log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[TrackEvent] ${event}`, properties);
      }
    },
    []
  );

  return { trackEvent };
}
