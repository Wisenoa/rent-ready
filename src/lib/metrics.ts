import { Counter, Histogram, collectDefaultMetrics, register } from 'prom-client';

// ─────────────────────────────────────────────
// Collect default Node.js metrics once at startup
// ─────────────────────────────────────────────
collectDefaultMetrics({ register });

// ─────────────────────────────────────────────
// Custom HTTP request metrics
// ─────────────────────────────────────────────
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'] as const,
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Re-export register for the metrics route
export { register };
