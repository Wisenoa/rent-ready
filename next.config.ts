import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const config: NextConfig = {
  // ========================================
  // Static generation concurrency
  // ========================================
  // Next defaults to (CPU count - 1) static-generation workers. On a 14-core
  // machine that is 13 concurrent page renders, and peak heap exceeded the
  // default ~4 GB limit part-way through prerendering — the build died with
  // "Ineffective mark-compacts near heap limit" at ~101/135 pages. Bisecting
  // showed no single page is at fault; it is aggregate concurrency (114 static
  // pages passed, 115 failed). Capping workers trades a little wall-clock for a
  // build that reliably completes. Raise via NEXT_BUILD_WORKERS if desired.
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'],
    cpus: Math.max(
      1,
      Number.parseInt(process.env.NEXT_BUILD_WORKERS ?? '', 10) || 4
    ),
  },

  // ========================================
  // TypeScript Configuration
  // ========================================
  // Type errors now fail the build. `ignoreBuildErrors: true` was set to get past
  // a pre-existing backlog, and it hid eight real bugs that tsc had reported
  // plainly and the build discarded:
  //
  //   - the quittance PDF did `rentAmount + chargesAmount` on Decimals, printing
  //     "70040.5" as the total and a 69 300 EUR balance on a paid lease
  //   - four email routes called auth.getSession, which does not exist, and
  //     returned 500 on every request
  //   - the KPI digest queried prisma.subscription, a model that never existed
  //   - both /api/reminders routes included a Prisma relation that was not
  //     declared, so they threw on every request
  //   - the bank webhook matched an incoming transfer against the earliest
  //     pending invoice regardless of amount, so a 12 EUR grocery payment was
  //     recorded against an 850 EUR rent invoice and issued a receipt
  //   - the email sender read the Resend id from the wrong field, so every
  //     delivered email returned ok: false
  //   - registration called auth.api.signUp, which is undefined: nobody could
  //     create an account, and POST /register still returned 200
  //
  // The CI type-check step ratchets the count, so a regression is caught before
  // the build anyway.
  typescript: {
    ignoreBuildErrors: false,
  },

  // ========================================
  // Lint Configuration
  // ========================================
  eslint: {
    // `pnpm lint` runs as its own step; see eslint.config.mjs.
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

      // ────────────────────────────────────────
      // Doublon exact : deux articles, un seul titre
      // ────────────────────────────────────────
      // Both articles carried the exact same title, "Augmentation de loyer :
      // règles et procédure". The thin one (1,994 chars) covered a subset of
      // what the rich one (8,999 chars) already had — same IRL explanation,
      // same zone-tendue limit, same procedure, same pitfalls, same FAQ — so
      // there was nothing to merge. The file is deleted, so this rule is the
      // only thing that keeps the old URL alive.
      {
        // Second exact title collision found in the same pass: "Comment
        // rédiger un contrat de location en 2026", one version ending in
        // ": guide complet". Bodies only shared 2.3% of their text, but the
        // titles were indistinguishable in a SERP, which is the point.
        source: '/blog/comment-rediger-contrat-location',
        destination: '/blog/rediger-contrat-location',
        permanent: true,
      },

      {
        source: '/blog/augmentation-loyer-regles-et-procedure',
        destination: '/blog/augmentation-loyer-regles-procedure',
        permanent: true,
      },

      // ────────────────────────────────────────
      // Slugs d'articles corrigés
      // ────────────────────────────────────────
      // /blog/assurance-loyer-impaye-GLI is deliberately NOT redirected: Next
      // matches redirect sources after normalising the path to lowercase, so a
      // source spelled with an uppercase letter also matches the lowercase URL
      // and sends it back to itself in an endless 308. The slug is now
      // lowercase and resolves, and Next lowercases incoming paths before the
      // page looks the article up, so old mixed-case links still land here.
      // A 301 for the accented slug keeps that inbound link working and hands
      // the signal to the new URL.
      {
        // Next lowercases the path before matching a redirect source, so the
        // literal accented form never matches: the encoded slug arrives as
        // %c3%a9. Both spellings are registered.
        source: '/blog/gestion-compte-banque-s%c3%a9par%c3%a9',
        destination: '/blog/gestion-compte-banque-separe',
        permanent: true,
      },
      {
        source: '/blog/gestion-compte-banque-séparé',
        destination: '/blog/gestion-compte-banque-separe',
        permanent: true,
      },

      // ────────────────────────────────────────
      // /modeles → /templates consolidation
      // ────────────────────────────────────────
      // Two parallel template libraries served the same intents ("modèle bail
      // vide" existed at both /modeles/bail-vide and /templates/bail-vide).
      // Google had to pick one, and the nav/footer only ever linked to
      // /templates, so /modeles was the orphan copy. One canonical destination
      // per intent: 301 the losers. The corresponding page files were deleted,
      // so these rules are the only thing that serves the old URLs.
      { source: '/modeles/augmentation-de-loyer', destination: '/templates/augmentation-de-loyer', permanent: true },
      { source: '/modeles/bail-colocation', destination: '/templates/bail-colocation', permanent: true },
      { source: '/modeles/bail-commercial', destination: '/templates/bail-commercial', permanent: true },
      { source: '/modeles/bail-meuble', destination: '/templates/bail-meuble', permanent: true },
      { source: '/modeles/bail-mobilite', destination: '/templates/bail-mobilite', permanent: true },
      { source: '/modeles/bail-vide', destination: '/templates/bail-vide', permanent: true },
      { source: '/modeles/conge-locataire', destination: '/templates/conge-locataire', permanent: true },
      { source: '/modeles/conge-proprietaire', destination: '/templates/conge-proprietaire', permanent: true },
      { source: '/modeles/etat-des-lieux', destination: '/templates/etat-des-lieux', permanent: true },
      { source: '/modeles/quittance-de-loyer', destination: '/templates/recu-loyer', permanent: true },
      { source: '/modeles/relance-loyer-impaye', destination: '/templates/relance-loyer-impaye', permanent: true },
      { source: '/modeles/bail-professionnel', destination: '/templates/bail-professionnel', permanent: true },
      { source: '/modeles/contrat-de-location', destination: '/templates/contrat-de-location', permanent: true },
      { source: '/modeles/protocol-etat-des-lieux', destination: '/templates/protocol-etat-des-lieux', permanent: true },
      { source: '/modeles/repartition-charges', destination: '/templates/repartition-charges', permanent: true },
      { source: '/modeles', destination: '/templates', permanent: true },

      // Same intent, same document under two slugs. The descriptive slug wins.
      { source: '/templates/colocation', destination: '/templates/bail-colocation', permanent: true },

      // Both IRL calculators rendered the same component under two URLs.
      { source: '/outils/calculateur-revision-irl', destination: '/outils/calculateur-irl', permanent: true },
      { source: '/outils/calculateur-irl-2026', destination: '/outils/calculateur-irl', permanent: true },
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
