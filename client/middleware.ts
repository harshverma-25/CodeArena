import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/problems(.*)",
  "/battle(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/lobby(.*)",
  "/match(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is authenticated and attempts to visit login/register, redirect to dashboard
  if (userId && isAuthRoute(req)) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // If route is protected and user is not authenticated, Clerk handles redirecting to sign-in page
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
