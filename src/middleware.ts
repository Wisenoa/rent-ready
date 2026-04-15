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

  // ── 4. x-robots-tag: noindex for private app routes ─────────────
  // The /portal/* routes are the authenticated app area.
  // They must never be indexed by search engines.
  const response = NextResponse.next();

  if (pathname.startsWith("/portal") || pathname.startsWith("/dashboard")) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
    return response;
  }

  // ── 5. Graceful 404 handling ────────────────────────────────────
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
