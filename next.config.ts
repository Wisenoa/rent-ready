import type { NextConfig } from 'next';

const config: NextConfig = {
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
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Permissions-Policy', 
            value: 'camera=(), microphone=(), geolocation=()' 
          },
        ],
      },
      {
        source: '/api/(.*)',
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

export default config;