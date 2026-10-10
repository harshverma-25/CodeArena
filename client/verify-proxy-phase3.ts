import { NextRequest } from "next/server";
import { proxy } from "./proxy";

function createMockNextRequest(urlStr: string, cookies: Record<string, string> = {}): NextRequest {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  return new NextRequest(new URL(urlStr), {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

function runProxyVerification() {
  console.log("====================================================");
  console.log("🧪 QUIZZY Client Edge Proxy Verification: HD-010");
  console.log("====================================================\n");

  // 1. Unauthenticated visiting /admin
  console.log("▶️ Test 1: Unauthenticated request to /admin...");
  const req1 = createMockNextRequest("http://localhost:3000/admin");
  const res1 = proxy(req1);
  const loc1 = res1.headers.get("location");
  if (!loc1 || !loc1.includes("/login?redirect=%2Fadmin")) {
    throw new Error(`Expected redirect to /login?redirect=%2Fadmin, got: ${loc1}`);
  }
  console.log(`  Redirected to ${loc1} ✅`);

  // 2. Unauthenticated visiting nested /admin/categories
  console.log("▶️ Test 2: Unauthenticated request to nested /admin/categories...");
  const req2 = createMockNextRequest("http://localhost:3000/admin/categories");
  const res2 = proxy(req2);
  const loc2 = res2.headers.get("location");
  if (!loc2 || !loc2.includes("/login?redirect=%2Fadmin%2Fcategories")) {
    throw new Error(`Expected redirect to /login?redirect=%2Fadmin%2Fcategories, got: ${loc2}`);
  }
  console.log(`  Redirected to ${loc2} ✅`);

  // 3. Unauthenticated visiting nested /admin/import
  console.log("▶️ Test 3: Unauthenticated request to nested /admin/import...");
  const req3 = createMockNextRequest("http://localhost:3000/admin/import");
  const res3 = proxy(req3);
  const loc3 = res3.headers.get("location");
  if (!loc3 || !loc3.includes("/login?redirect=%2Fadmin%2Fimport")) {
    throw new Error(`Expected redirect to /login?redirect=%2Fadmin%2Fimport, got: ${loc3}`);
  }
  console.log(`  Redirected to ${loc3} ✅`);

  // 4. Authenticated user with access token accessing /admin
  console.log("▶️ Test 4: Authenticated user accessing /admin...");
  const req4 = createMockNextRequest("http://localhost:3000/admin", {
    codearena_access_token: "mock_jwt_access_token",
  });
  const res4 = proxy(req4);
  const loc4 = res4.headers.get("location");
  if (loc4) {
    throw new Error(`Authenticated user unexpectedly redirected to: ${loc4}`);
  }
  console.log("  Allowed through to page component (no proxy redirection) ✅");

  // 5. Authenticated user with guest token accessing /admin
  console.log("▶️ Test 5: Guest session accessing /admin (allowed through to AdminLayout guard)...");
  const req5 = createMockNextRequest("http://localhost:3000/admin", {
    codearena_guest_token: "mock_guest_token",
  });
  const res5 = proxy(req5);
  const loc5 = res5.headers.get("location");
  if (loc5) {
    throw new Error(`Guest session unexpectedly redirected by proxy to: ${loc5}`);
  }
  console.log("  Guest allowed through to AdminLayout to render Access Restricted UI ✅");

  // 6. Public route access without credentials
  console.log("▶️ Test 6: Public routes (/ and /categories) accessible to all...");
  const req6a = createMockNextRequest("http://localhost:3000/");
  if (proxy(req6a).headers.get("location")) {
    throw new Error("Public homepage / was redirected!");
  }
  const req6b = createMockNextRequest("http://localhost:3000/categories");
  if (proxy(req6b).headers.get("location")) {
    throw new Error("Public route /categories was redirected!");
  }
  console.log("  Public routes accessible without redirect ✅");

  // 7. Authenticated user visiting /login redirects to homepage
  console.log("▶️ Test 7: Authenticated user visiting /login redirects to /...");
  const req7 = createMockNextRequest("http://localhost:3000/login", {
    codearena_access_token: "mock_token",
  });
  const res7 = proxy(req7);
  const loc7 = res7.headers.get("location");
  if (!loc7 || !loc7.endsWith("/")) {
    throw new Error(`Expected redirect to /, got: ${loc7}`);
  }
  console.log("  Authenticated user redirected away from /login to / ✅");

  // 8. Unauthenticated user visiting /login allowed through
  console.log("▶️ Test 8: Unauthenticated user visiting /login allowed through...");
  const req8 = createMockNextRequest("http://localhost:3000/login");
  if (proxy(req8).headers.get("location")) {
    throw new Error("Unauthenticated user visiting /login was redirected!");
  }
  console.log("  Unauthenticated user can view /login ✅");

  console.log("\n====================================================");
  console.log("🎉 ALL EDGE PROXY VERIFICATION TESTS PASSED!");
  console.log("====================================================\n");
}

runProxyVerification();
