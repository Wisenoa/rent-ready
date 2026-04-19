/**
 * Lighthouse CI Configuration
 * 
 * Runs against preview/staging URLs in CI.
 * Asserts minimum scores to block PR merge if performance degrades.
 * 
 * Usage:
 *   npx @lhci/cli autorun
 * 
 * Or in CI (see .github/workflows/ci.yml lighthouse job):
 *   npx @lhci/cli autorun --config=lighthouserc.js
 */

module.exports = {
  ci: {
    collect: {
      // Start the server before Lighthouse runs
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30_000,
      
      // URLs to audit — marketing landing pages
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/pricing',
        'http://localhost:3000/features',
        'http://localhost:3000/demo',
      ],
      
      // Number of runs per URL (median is used for assertions)
      numberOfRuns: 3,
      
      // Settings for headless Chrome
      settings: {
        preset: 'desktop',
        throttling: {
          // Simulate 4G connection
          rttMs: 40,
          throughputKbps: 10_240,
          cpuSlowdownMultiplier: 1,
        },
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },

    assert: {
      // Minimum scores (0–100). PRs that drop below these fail.
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.90 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.90 }],
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.90 }],
        
        // PWA (advisory — don't block merge)
        'categories:pwa': ['warn', { minScore: 0.70 }],
        
        // Core Web Vitals targets
        'first-contentful-paint': ['error', { maxNumericValue: 1_800 }],   // FCP < 1.8s
        'largest-contentful-paint': ['error', { maxNumericValue: 2_500 }],  // LCP < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],    // CLS < 0.1
        'total-blocking-time': ['error', { maxNumericValue: 200 }],         // TBT < 200ms
        'speed-index': ['error', { maxNumericValue: 3_400 }],               // SI < 3.4s
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],   // INP < 200ms (replaces FID in CWV)
        
        // No console errors on marketing pages
        'no-console-errors': ['error', { minScore: 1 }],
        
        // Images must have explicit width/height (prevents CLS)
        'image-alt': 'error',
        'uses-webp-images': 'warn',
        'uses-optimized-images': 'warn',
      },
    },

    upload: {
      // Upload to temporary public storage for viewing results
      // In CI, use GitHub artifact storage instead
      target: 'temporary-public-storage',
      
      // Alternative: upload to LHCI server (set LHCI_UPLOAD_URL env var)
      // target: 'lhci',
      // token: process.env.LHCI_BUILD_TOKEN,
    },

    server: {
      // Optional: run a tiny LHCI server to collect results across branches
      // port: 9001,
      // storage: './.lighthouseci',
    },
  },
};
