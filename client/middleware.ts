import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/battle(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/lobby(.*)",
  "/leaderboard(.*)",
  "/history(.*)",
  "/results(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const hasGuestToken = req.cookies.has("codearena_guest_token");

  // If user is authenticated and attempts to visit login/register, redirect to dashboard
  if ((userId || hasGuestToken) && isAuthRoute(req)) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // If route is protected and user is neither Clerk-authenticated nor active Guest, redirect to login
  if (isProtectedRoute(req) && !hasGuestToken) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.[\\w]+$|_next/image|_next/static|favicon.ico).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
