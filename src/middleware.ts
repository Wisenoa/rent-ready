import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for Better Auth session cookie
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;

  // If authenticated and visiting login/register, redirect to dashboard
  if (sessionToken && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users away from private routes
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only intercept private app routes — everything else (/, /login, /register,
  // /api/*, /portal/*, /gestion-locative/*, static files) passes through freely.
  matcher: [
    "/dashboard/:path*",
    "/properties/:path*",
    "/tenants/:path*",
    "/billing/:path*",
    "/maintenance/:path*",
    "/expenses/:path*",
    "/fiscal/:path*",
    "/documents/:path*",
    "/ai-assistant/:path*",
    "/settings/:path*",
  ],
};
