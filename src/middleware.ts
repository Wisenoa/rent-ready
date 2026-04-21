import { NextRequest, NextResponse } from "next/server";

/**
 * RentReady Middleware
 *
 * Responsibilities:
 * 1. Auth gate — redirect unauthenticated users away from private routes
 * 2. Auth redirect — authenticated users visiting /login or /register go to dashboard
 * 3. Lowercase normalization — redirect uppercase URLs to lowercase
 * 4. Trailing slash removal — redirect /path/ to /path (consistent URL canonical form)
 * 5. x-robots-tag: noindex — applied to /portal/* (private app routes)
 * 6. Graceful 404 — never expose internal errors
 */

// Paths that are always public (no auth required)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api",
  "/portal",
  "/gestion-locative",
  "/locations",
  "/bail",
  "/quittances",
  "/maintenance",
  "/pricing",
  "/features",
  "/demo",
  "/blog",
  "/glossaire-immobilier",
  "/outils",
  "/mentions-legales",
  "/politique-confidentialite",
  "/cgu",
  "/modeles",
  "/entretien",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );
}

/**
 * Check if a URL contains uppercase characters.
 * We only redirect if the URL path segment contains uppercase letters.
 * Query strings are left untouched (case-insensitive by convention).
 */
function hasUppercasePath(pathname: string): boolean {
  // Check only the path portion (before ?)
  return /[A-Z]/.test(pathname);
}

/**
 * Remove trailing slash from a pathname.
 * Empty root "/" has no trailing slash to remove.
 * /path/ -> /path, /path/to/ -> /path/to
 */
function removeTrailingSlash(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ── 1. Auth check ────────────────────────────────────────────────
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;

  if (sessionToken && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionToken && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Lowercase URL normalization ───────────────────────────────
  // Redirect UPPERCASE paths to lowercase to prevent duplicate content.
  // Query strings are preserved as-is (case-insensitive in practice).
  if (hasUppercasePath(pathname)) {
    const lowerUrl = new URL(req.url);
    lowerUrl.pathname = pathname.toLowerCase();
    return NextResponse.redirect(lowerUrl, 301);
  }

  // ── 3. Trailing slash removal ────────────────────────────────────
  // Consistent no-trailing-slash policy prevents:
  //   /bail and /bail/ from being treated as different pages
  if (pathname !== "/" && pathname.endsWith("/")) {
    const noSlashUrl = new URL(req.url);
    noSlashUrl.pathname = removeTrailingSlash(pathname);
    // Use 308 (Permanent Redirect) to enforce the canonical form
    return NextResponse.redirect(noSlashUrl, 308);
  }

  // ── 5. DDoS & security headers on all responses ──────────────────
  // These headers help protect against various attack vectors:
  // - X-Content-Type-Options: prevent MIME type sniffing
  // - X-Frame-Options: prevent clickjacking
  // - X-XSS-Protection: legacy XSS filter (modern browsers use CSP)
  // - Referrer-Policy: control referrer information leakage
  // - Permissions-Policy: disable browser features not needed
  // - Strict-Transport-Security: enforce HTTPS (HSTS)
  // - Content-Security-Policy: mitigate XSS and injection attacks
  // - X-Request-Id: useful for request tracing and log correlation
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.stripe.com https://api.openai.com",
      "frame-src 'self' https://js.stripe.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  response.headers.set("X-Request-Id", crypto.randomUUID());

  // ── 6. x-robots-tag: noindex for private app routes ─────────────
  // The /portal/* routes are the authenticated app area.
  // They must never be indexed by search engines.
  if (pathname.startsWith("/portal") || pathname.startsWith("/dashboard")) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
  }

  // ── 7. Graceful 404 handling ────────────────────────────────────
  // If we reach here for an unknown path, let Next.js handle the 404
  // via not-found.tsx — we don't need to add anything special.

  return response;
}

export const config = {
  /*
   * Matcher covers all routes EXCEPT:
   * - _next/static  (static assets, immutable)
   * - _next/image   (optimized images)
   * - favicon.ico   (icon)
   * - public files  (fonts, etc.)
   *
   * This ensures the middleware runs on every page route and API route
   * where we need auth checks or SEO headers.
   */
  matcher: [
    /*
     * Positive: run on these paths
     * Negative: exclude static/_next/assets
     */
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)",
  ],
};
