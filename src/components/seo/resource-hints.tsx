/**
 * Resource Hints — Performance optimization for third-party connections
 * 
 * These hints tell the browser to establish early connections to known origins,
 * reducing latency for critical third-party services:
 * 
 * - vitals.vercel-insights.com  — Vercel Analytics / Core Web Vitals collection
 * - o1.ingest.sentry.io         — Sentry error & performance monitoring
 * 
 * preconnect = establish TCP/TLS handshake early (low-latency connections)
 * dns-prefetch = DNS resolution ahead of time (fallback for older browsers)
 */

export function ResourceHints() {
  return (
    <>
      {/* Vercel Analytics — Core Web Vitals collection */}
      <link
        rel="preconnect"
        href="https://vitals.vercel-insights.com"
        crossOrigin="anonymous"
      />
      <link
        rel="dns-prefetch"
        href="https://vitals.vercel-insights.com"
      />

      {/* Sentry — error & performance monitoring */}
      <link
        rel="preconnect"
        href="https://o1.ingest.sentry.io"
        crossOrigin="anonymous"
      />
      <link
        rel="dns-prefetch"
        href="https://o1.ingest.sentry.io"
      />
    </>
  );
}
