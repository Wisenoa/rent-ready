import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { track } from '@vercel/analytics/react';

/**
 * Sends Core Web Vitals metrics to Vercel Analytics.
 *
 * Vercel Analytics automatically collects LCP, CLS, FID/INP, and TTFB from
 * real user sessions in production when @vercel/analytics is installed and
 * the <Analytics /> component is present in the layout (confirmed in layout.tsx).
 *
 * This supplemental reporting captures the full metric object including
 * the rating (good/needs-improvement/poor) and attribution data for
 * debugging performance issues in the Vercel Analytics dashboard.
 */

function sendToAnalytics(metric: {
  name: string;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}) {
  // Always log in development for local inspection
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[WebVitals] ${metric.name}: ${metric.delta.toFixed(2)}ms (rating: ${metric.rating}) id=${metric.id}`
    );
    return;
  }

  // In production: send to Vercel Analytics as a custom event
  // Vercel Analytics automatically bins these into the CWV dashboard,
  // but tracking them as named events gives us per-metric granularity.
  try {
    track(`cwv_${metric.name.toLowerCase()}`, {
      value: metric.delta,
      rating: metric.rating,
      id: metric.id,
    });
  } catch {
    // Fail silently — never block the page thread for analytics
  }
}

export function reportWebVitals() {
  const handleEntry = (metric: {
    name: string;
    delta: number;
    id: string;
    rating: 'good' | 'needs-improvement' | 'poor';
  }) => {
    sendToAnalytics(metric);
  };

  onCLS(handleEntry);   // Cumulative Layout Shift
  onFCP(handleEntry);   // First Contentful Paint
  onLCP(handleEntry);   // Largest Contentful Paint
  onTTFB(handleEntry);  // Time to First Byte
  onINP(handleEntry);   // Interaction to Next Paint (replaces FID)
}
