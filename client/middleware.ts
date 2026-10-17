import { NextResponse, NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/admin",
  "/battle",
  "/profile",
  "/settings",
  "/lobby",
  "/leaderboard",
  "/history",
  "/results",
];

const AUTH_PREFIXES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const hasAccessToken =
    req.cookies.has("codearena_access_token") ||
    req.cookies.has("refreshToken") ||
    req.cookies.has("codearena_session");
  const hasGuestToken = req.cookies.has("codearena_guest_token");
  const isAuthenticated = hasAccessToken || hasGuestToken;

  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Re-export as proxy for backwards compatibility with tests and internal tooling
export const proxy = middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.[\\w]+$|_next/image|_next/static|favicon.ico).*)",
  ],
};
