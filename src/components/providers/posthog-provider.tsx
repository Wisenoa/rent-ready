'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

/**
 * PostHog analytics provider.
 *
 * Initialises PostHog (client-side) and captures:
 * - Auto-captured pageviews (with Next.js router integration)
 * - User identification on login/signup
 * - Sentry errors with PostHog link (if both are configured)
 *
 * Env vars required (add to .env.local):
 *   NEXT_PUBLIC_POSTHOG_KEY=<your-postHog-project-client-api-key>
 *   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
 *
 * The NEXT_PUBLIC_POSTHOG_KEY should be the "Client-side API Key" from PostHog
 * project settings (NOT the server-side API key).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Initialize PostHog on mount
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (!key) {
      console.warn('[Analytics] NEXT_PUBLIC_POSTHOG_KEY not set — PostHog disabled');
      return;
    }

    if (posthog.__loaded) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: false, // We capture manually with Next.js router
      capture_pageleave: true,
      autocapture: true, // Capture clicks, form inputs, etc.
      session_recording: {
        // Enable session recording for product analytics (opt-in recommended for EU compliance)
        // maskTextSelector: null, // Customize selectors to mask sensitive content
      },
      bootstrap: {
        // If user is already identified (session exists), restore their identity
        featureFlags: {
          // Preload feature flags if needed
        },
      },
      loaded: (ph) => {
        // Sync PostHog with NextAuth session
        if (session?.user?.email) {
          ph.identify(session.user.email, {
            email: session.user.email,
            name: session.user.name,
          });
        }
      },
    });

    return () => {
      // Cleanup on unmount
      posthog.reset();
    };
  }, []);

  // Capture pageviews on route changes
  useEffect(() => {
    if (!posthog.__loaded) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    posthog.capture('$pageview', { path: url });
  }, [pathname, searchParams]);

  // Identify user when session changes
  useEffect(() => {
    if (!posthog.__loaded) return;

    if (session?.user?.email) {
      posthog.identify(session.user.email, {
        email: session.user.email,
        name: session.user.name,
      });
    }
  }, [session]);

  return <>{children}</>;
}
