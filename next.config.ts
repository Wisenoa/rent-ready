import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const config: NextConfig = {
  // ========================================
  // TypeScript Configuration
  // ========================================
  typescript: {
    // Pre-existing TS configuration issues in node_modules - skip in CI
    ignoreBuildErrors: true,
  },

  // ========================================
  // Lint Configuration
  // ========================================
  eslint: {
    // ESLint 9 + rushstack patch incompatibility — lint is handled by CI
    ignoreDuringBuilds: true,
  },

  // ========================================
  // Output Configuration (Required for Docker)
  // ========================================
  output: 'standalone',

  // ========================================
  // External Packages (Prevent build analysis of React Email)
  // ========================================
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-pdf/renderer',
  ],

  // ========================================
  // Image Optimization
  // ========================================
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ========================================
  // Headers for Security
  // ========================================
  async headers() {
    return [
        {
        source: '/((?!_next/static|_next/image|images|fonts|favicon.ico).)*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; frame-ancestors 'none'; img-src 'self' data: https: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com;",
          },
          { 
            key: 'Permissions-Policy', 
            value: 'camera=(), microphone=(), geolocation=()' 
          },
        ],
      },
      // Static assets — aggressive caching
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // Marketing pages — SWR caching ( ISR / stale-while-revalidate )
      // Note: route groups like (marketing) are not URL paths
      // Use /:path* syntax (not /*) since path-to-regexp requires modifier on param
      {
        source: '/blog/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/modeles/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/templates/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/outils/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/glossaire-immobilier/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/bail/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/gestion-locative/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-Tenant-ID, X-Request-ID'
          },
        ],
      },
    ];
  },

  // ========================================
  // Redirects
  // ========================================
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ========================================
  // Rewrites (API Proxy for Webhooks)
  // ========================================
  async rewrites() {
    return [
      {
        source: '/api/webhooks/bank/:path*',
        destination: '/api/webhooks/bank/:path*',
      },
    ];
  },

  // ========================================
  // Experimental Features
  // ========================================
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'],
  },

  // ========================================
  // Environment Variables Exposed to Client
  // ========================================
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },

  // ========================================
  // Logging
  // ========================================
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG || 'wisenoa',
  project: 'rent-ready',
  widenClientFileUpload: false,
  tunnelRoute: '/api/sentry-error',
});
