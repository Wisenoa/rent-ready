import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

function sendToAnalytics({ name, delta, id, rating }: {
  name: string;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}) {
  // In production, send to your analytics endpoint
  // For now, log to console in structured format
  console.log(`[WebVitals] ${name}: ${delta.toFixed(2)}ms (rating: ${rating}) id=${id}`);
}

export function reportWebVitals() {
  const handleEntry = (metric: { name: string; delta: number; id: string; rating: 'good' | 'needs-improvement' | 'poor' }) => {
    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      sendToAnalytics(metric);
    }
  };

  onCLS(handleEntry);
  onFID(handleEntry);
  onFCP(handleEntry);
  onLCP(handleEntry);
  onTTFB(handleEntry);
  onINP(handleEntry);
}
