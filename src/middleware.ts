import { NextRequest, NextResponse } from "next/server";

/**
 * Public routes that bypass authentication.
 * The middleware only checks for the PRESENCE of a session cookie —
 * actual session validation happens in server components via auth.api.getSession().
 */
const publicPrefixes = [
  "/login",
  "/register",
  "/api/auth",
  "/api/webhooks",
  "/portal",
  "/gestion-locative",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Root "/" is public (page.tsx handles redirect to /dashboard)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Public routes: auth pages, API endpoints, marketing pages, portal
  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    // If user is already authenticated and visits /login or /register, redirect to dashboard
    const sessionToken = req.cookies.get("better-auth.session_token")?.value;
    if (sessionToken && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes: check for session cookie
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - Static files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|map)).*)",
  ],
};
