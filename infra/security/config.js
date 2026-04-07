# ========================================
# Security Configuration
# ========================================

# Rate Limiting Configuration
# Per-tenant rate limits

const SECURITY_CONFIG = {
  rateLimits: {
    // Global API rate limit (requests per minute)
    global: {
      max: 100,
      windowMs: 60000, // 1 minute
    },
    
    // Per-tenant rate limits
    tenant: {
      // API calls
      api: {
        max: 200,
        windowMs: 60000,
      },
      
      // Authentication attempts
      auth: {
        max: 10,
        windowMs: 900000, // 15 minutes
      },
      
      // Webhook endpoints (higher limit for bank webhooks)
      webhook: {
        max: 1000,
        windowMs: 60000,
      },
      
      // File uploads
      upload: {
        max: 10,
        windowMs: 60000,
      },
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Tenant-ID',
      'X-Request-ID',
    ],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400, // 24 hours
  },

  // Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Next.js
        "'unsafe-eval'", // Required for some libraries
        'https://js.stripe.com',
      ],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:'],
      'frame-src': ['https://js.stripe.com', 'https://hooks.stripe.com'],
      'connect-src': ["'self'", 'https:', 'wss:'],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
    },
  },

  // Authentication
  auth: {
    sessionTimeout: 86400000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    passwordMinLength: 12,
    passwordRequirements: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      specialChars: true,
    },
  },

  // API Security
  api: {
    // Request timeout (ms)
    timeout: 30000,
    
    // Max request body size
    maxBodySize: '10mb',
    
    // Require HTTPS
    requireHTTPS: process.env.NODE_ENV === 'production',
    
    // API key prefix for tenant identification
    tenantHeaderName: 'X-Tenant-ID',
  },

  // Webhook Security
  webhooks: {
    // Verify webhook signatures
    verifySignatures: true,
    
    // Allowed providers
    allowedProviders: ['stripe', 'bridge', 'powens'],
    
    // Webhook timeout (ms)
    timeout: 10000,
  },

  // File Upload Security
  uploads: {
    // Max file size (bytes)
    maxSize: 10 * 1024 * 1024, // 10 MB
    
    // Allowed MIME types
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    
    // Scan for malware (if service available)
    scanForMalware: false,
    
    // Storage bucket
    bucket: process.env.MINIO_BUCKET || 'rent-ready-docs',
  },
};

module.exports = { SECURITY_CONFIG };