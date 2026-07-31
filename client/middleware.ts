import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are protected. All pages under dashboard, problems, battle, etc. are protected.
// Public routes: landing (/), login, register.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/problems(.*)",
  "/battle(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/lobby(.*)",
  "/match(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
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
