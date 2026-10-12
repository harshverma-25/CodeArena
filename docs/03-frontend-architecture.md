# 03 — Frontend Architecture

## 1. Overview & Framework Choices

The CodeArena client application is built with **Next.js 16 (App Router)** and **React 19**, styled with **TailwindCSS v4**, and backed by **Zustand** and **TanStack React Query v5**.

The client is optimized for sub-second page transitions, reactive real-time 1–4 player quiz interfaces, and clean responsive views across mobile and desktop devices.

```mermaid
graph TD
    subgraph Routing ["Next.js App Router (client/app/)"]
        Public["(public) — Landing, Login, Register"]
        Protected["(protected) — Dashboard, Lobby, Battle, Leaderboard, History, Profile"]
        Match["(match) — Standalone Battle Results"]
    end

    subgraph State ["Client State Layer"]
        Zustand["Zustand (battleStore, uiStore)"]
        QueryCache["TanStack Query Cache"]
    end

    subgraph Features ["Feature Modules (client/features/)"]
        AuthF["auth"]
        BattleF["battle"]
        DashF["dashboard"]
        HistF["history"]
        LeadF["leaderboard"]
        ProfF["profile"]
    end

    Routing --> Features
    Features --> State
    Features --> SocketManager["SocketManager (Socket.IO Client)"]
```

---

## 2. Directory Layout & Route Groups

The `client/` codebase is organized around standard Next.js conventions and domain-driven feature modules:

```text
client/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── categories/page.tsx         <-- Category & subject tree management
│   │       ├── history/page.tsx            <-- Bulk question import history audit
│   │       ├── import/page.tsx             <-- Preview-backed JSON/CSV bulk import
│   │       ├── layout.tsx                  <-- Admin dashboard sidebar & header layout
│   │       └── page.tsx                    <-- Global system stats & management overview
│   ├── (match)/
│   │   ├── results/[matchId]/page.tsx      <-- Post-match victory/defeat/rankings screen
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── battle/[roomCode]/page.tsx      <-- Real-time 1–4 player quiz arena
│   │   ├── dashboard/page.tsx              <-- User dashboard & quick play (redirects to /)
│   │   ├── history/page.tsx                <-- Paginated match history
│   │   ├── leaderboard/page.tsx            <-- Global rankings table
│   │   ├── lobby/[roomCode]/page.tsx       <-- Match waiting room & readiness (1–4 players)
│   │   ├── profile/page.tsx                <-- Authenticated profile & stats
│   │   ├── profile/[username]/page.tsx     <-- Public profile view
│   │   └── layout.tsx                      <-- Protected layout with unified Navbar
│   ├── (public)/
│   │   ├── login/page.tsx                  <-- Native credentials sign-in & Guest button
│   │   ├── register/page.tsx               <-- Native user registration
│   │   ├── page.tsx                        <-- Landing page with hero & CTA
│   │   └── layout.tsx                      <-- Public layout with LandingNav
│   ├── globals.css                         <-- Global Tailwind styles & arcade theme tokens
│   └── layout.tsx                          <-- Root layout with AppProviders & Google Fonts
├── components/                             <-- Shared UI components (Navbar, modals, avatar SVG)
├── features/                               <-- Domain-specific components & hooks
├── hooks/                                  <-- Utility React hooks (visibility, online recovery)
├── lib/                                    <-- Singletons (api.ts, socket.ts)
├── proxy.ts                                <-- Next.js 16 route protection proxy
├── store/                                  <-- Zustand stores (battleStore, uiStore)
└── types/                                  <-- TypeScript domain interfaces
```

---

## 3. Route Protection & Next.js 16 Proxy Convention

Client-side route access is regulated by [`client/proxy.ts`](file:///h:/Project/code-arena/client/proxy.ts) using the Next.js 16 `proxy(req: NextRequest)` convention:

```typescript
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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Legacy dashboard route redirects cleanly to home
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const hasAccessToken = req.cookies.has("codearena_access_token") || req.cookies.has("refreshToken");
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
```

---

## 4. State Management Architecture

The application bifurcates state into **Ephemeral Real-Time State** (Zustand) and **Cached Server State** (TanStack Query):

### 4.1 Zustand Stores (`client/store/`)
1. **`useBattleStore`** ([`battleStore.ts`](file:///h:/Project/code-arena/client/store/battleStore.ts)):
   * **Connection**: `isSocketConnected: boolean`.
   * **Room State**: `roomCode`, `matchId`, `status` (`idle`, `lobby`, `countdown`, `active`, `completed`).
   * **Timers**: Authoritative countdown timers synched to server round deadlines.
   * **Players**: Array of `Player` objects (1–4 players) with readiness, score, submitted status, and rankings.
   * **Active Question Cache**: Sanitized question queue, current round question, locked options, and round reveal states.
2. **`useUiStore`** ([`uiStore.ts`](file:///h:/Project/code-arena/client/store/uiStore.ts)):
   * Manages modal overlays, custom toast triggers, and mobile drawer visibility.

### 4.2 TanStack Query Cache (`client/features/*/hooks/`)
* **`useLeaderboard(page, limit)`**: Fetches and caches paginated leaderboard data (`['leaderboard', page, limit]`).
* **`usePublicProfile(username)`**: Caches public user statistics and recent battle records.
* **`useMatchHistory(page, limit)`**: Caches paginated completed matches.
* **`useCategories()`**: Fetches and caches active question categories and subjects.
* **`useAdminOverview()` & `useImportHistory()`**: Caches administrative metrics and bulk ingestion audit logs.

---

## 5. Real-Time Socket Manager (`client/lib/socket.ts`)

WebSocket connections are managed through a centralized `SocketManager` singleton:
* **WebSocket-First Transport**: Configured with `transports: ["websocket", "polling"]` and `withCredentials: true` to eliminate unnecessary polling round-trips.
* **Token Synchronization**: Ensures the socket reconnects automatically with the active bearer token (native JWT access token or HMAC guest token).
* **Lifecycle Handlers**: Subscribes to `connect`, `disconnect`, `connect_error`, and handles auto-reconnection and in-game reconnection banners.
* **Background Tab Recovery**: Listens to browser `visibilitychange` and `online` events, instantly re-synchronizing socket state when the mobile device or tab returns to the foreground.

---

## 6. UI Design System & Viewport Adaptation

* **Arcade Neobrutalism Design System**: Bold, high-contrast neobrutalist aesthetic featuring heavy retro borders (`border-4 border-black`), offset drop shadows (`shadow-[4px_4px_0px_#000]`), and high-energy arcade badges.
* **Unified Navigation**: `<Navbar />` is unified across all public, protected, and admin views, with responsive drawer support and instant 6-character room PIN validation.
* **Live Quiz Arena Viewport Responsiveness**:
  * **Mobile Layout**: Question card and option buttons are elevated to the very top of the DOM and rendered first (`order-1`). Secondary components (opponent list, live telemetry) appear underneath.
  * **Automatic Question Auto-Scroll**: When `battle:next_question` dispatches, the client automatically executes smooth viewport scroll to the top of the question container so the user never misses the prompt.
  * **Sticky Mobile Timer Pill**: A compact floating pill timer anchors to the top bar on mobile screens to preserve maximum vertical space for question and options.
  * **Desktop Arena Optimization**: Compact full-page layout calibrated so all critical battle elements fit comfortably in view without forcing user scroll.
* **Offline Avatar System**: Instant client-side and server-side SVG generation producing distinct procedural retro robot/pixel avatars without external network calls.

---

## 7. Document Cross-References
* For backend APIs consumed by the client, see [09 — API Reference](09-api-reference.md).
* For real-time battle event structures, see [07 — Real-Time Socket Architecture](07-realtime-socket-architecture.md).
* For authentication handshakes, see [06 — Authentication & Security](06-authentication-security.md).
