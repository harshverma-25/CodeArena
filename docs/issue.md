# Comprehensive Project Audit & Issue Register

**Document Version**: 4.0.0  
**Updated**: October 2026  
**Scope**: Full-stack QUIZZY repository (`client/`, `server/`, `docs/`, database schemas, state stores, and real-time multiplayer engine).

---

## 1. Audit Overview

* **Audit Date**: October 10, 2026
* **Repository & Branch**: `harshverma-25/CodeArena` (`main`)
* **Technology Stack Detected**:
  * **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide React, Zustand (battleStore, uiStore), TanStack React Query, Socket.IO Client.
  * **Backend**: Node.js, Express, TypeScript (`tsx` / `tsc`), MongoDB / Mongoose, Socket.IO Server, Zod, Native JWT (Access 15m + Refresh 7d HttpOnly cookie) & HMAC Guest Sessions.
* **Files & Modules Inspected**:
  * Client entry & public routes: `client/app/(public)/page.tsx`, `client/app/layout.tsx`, `client/app/globals.css`, `client/proxy.ts`.
  * Public & Auth components: `client/components/shared/Navbar.tsx`, `client/features/auth/components/PlayAsGuestModal.tsx`, `client/features/auth/guestAuth.ts`, `client/features/auth/nativeAuth.ts`.
  * Match & Battle Arena: `client/app/(protected)/lobby/[roomCode]/page.tsx`, `client/app/(protected)/battle/[roomCode]/page.tsx`, `client/app/(match)/results/[matchId]/page.tsx`, `client/features/battle/hooks/useLiveBattle.ts`, `client/store/battleStore.ts`, `client/store/uiStore.ts`.
  * Profile, Leaderboard, History: `client/features/profile/components/ProfileStats.tsx`, `client/features/leaderboard/components/LeaderboardTable.tsx`, `client/features/history/components/MatchHistoryTable.tsx`.
  * Admin Panel: `client/app/(admin)/admin/page.tsx`, `client/app/(admin)/admin/categories/page.tsx`, `client/app/(admin)/admin/import/page.tsx`, `client/app/(admin)/admin/history/page.tsx`, `client/app/(admin)/admin/layout.tsx`.
  * Backend Modules & Services: `server/src/shared/config/quiz-config.ts`, `server/src/modules/room/room.service.ts`, `server/src/modules/battle/battle.service.ts`, `server/src/modules/question/question.service.ts`, `server/src/modules/category/category.service.ts`, `server/src/modules/subject/subject.service.ts`, `server/src/modules/admin/admin.service.ts`, `server/src/config/env.ts`.
  * Real-time & Sockets: `server/src/sockets/socket.ts`, `server/src/sockets/battle.socket.ts`, `server/src/sockets/room.socket.ts`, `client/lib/socket.ts`.
  * Scripts & Tests: `client/test-flow.ts`, `client/test-complete-game.ts`, `server/src/scripts/verify-env-security.ts`, `server/src/scripts/reconcile-user-stats.ts`.
* **Areas Not Inspected & Why**:
  * Bundled production assets under `client/.next/` and `server/dist/` (build artifacts, not source code).
  * External judge0 compiler services (purged from product scope per Product Truth in `AGENTS.md`).
* **Runtime Verification Limitations**:
  * Live runtime multiplayer with 4 concurrent real humans was verified via automated socket orchestration scripts (`verify-multiplayer-quiz.ts`), rather than manual 4-device browser interaction.

---

## 2. Executive Summary

| Severity | Open | Resolved | Issue IDs |
| :--- | :---: | :---: | :--- |
| **Critical** | 0 | 0 | None |
| **High** | 0 | 3 | `HD-001` (Resolved), `HD-002` (Resolved), `HD-003` (Resolved) |
| **Medium** | 2 | 3 | `HD-004` (Resolved), `HD-005` (Resolved), `HD-009` (Resolved), `HD-006` (Open), `HD-008` (Open) |
| **Low** | 4 | 0 | `HD-007`, `HD-010`, `HD-011`, `HD-012` |
| **Total Issues** | **6 Open** | **6 Resolved** | **12 Total** |

### Key Architectural Resolutions & Active Priorities:
1. ✅ **Dynamic Curriculum & Homepage (HD-001, HD-002, HD-003 Resolved)**:  
   Removed all hardcoded category lists, fallback counts, fabricated popular quizzes, and circular in-page scrolling from the homepage. Dynamic categories are retrieved from `GET /api/v1/categories`, real popular quizzes are computed from completed battles via `GET /api/v1/categories/popular`, and dynamic category browsing routes (`/categories` and `/categories/[slug]`) are fully operational.
2. ✅ **Custom Multiplayer Timers & Server Enforcement (HD-004 Resolved)**:  
   Multiplayer lobby hosts can configure custom time limits per question (`10s`, `20s`, `30s`). The setting is validated server-authoritatively across REST and Socket.IO, persisted in `Room.settings.timeLimit`, carries forward into `Battle.timePerQuestion`, and governs question deadlines, server timeouts, and round transitions.
3. ✅ **Dynamic Lobby Join URL (HD-005 Resolved)**:  
   Purged hardcoded placeholder `https://quizzy.app/join/${roomCode}`. Lobby invite links now dynamically resolve from `window.location.origin` targeting `/lobby/${encodeURIComponent(roomCode)}` safely across SSR, preview, and production.
4. ✅ **Explicit Science Category Timer (HD-009 Resolved)**:  
   Added declarative `science: 30` entry to `CATEGORY_TIMER_MAP` in `server/src/shared/config/quiz-config.ts` alongside helper functions and tests ensuring category timers never override valid custom multiplayer selections.

---

## 3. Detailed Issue Inventory

### HD-001: Homepage Hardcoded Explore Categories & Fake Question Count Fallbacks
* **Severity**: **High**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Homepage & Categories
* **Exact File Path & Line Numbers**: [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/%28public%29/page.tsx)
* **Resolution**:
  * Removed static `exploreCategoriesList` array and hardcoded question count fallbacks (`?? 130`, `?? 320`, `?? 406`, `?? 280`, `?? 150`).
  * Replaced with live fetching from `GET /api/v1/categories`. Categories now render dynamic names, descriptions, and real question counts.
  * Science is correctly rendered as an independent top-level category rather than a child of General Knowledge.
  * Implemented honest empty state: `"No categories available yet."` when 0 categories exist.
  * Category cards link dynamically to `/categories/${cat.slug}`.
* **Verification**: Verified via `client` build and live MongoDB queries returning 4 active categories.

---

### HD-002: Homepage Fabricated "Most Played Quizzes" & Static Play Counts
* **Severity**: **High**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Homepage & Dashboard
* **Exact File Path & Line Numbers**: [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/%28public%29/page.tsx), [`server/src/modules/category/category.service.ts`](file:///h:/Project/code-arena/server/src/modules/category/category.service.ts)
* **Resolution**:
  * Removed static `mostPlayedQuizzes` array containing fabricated counts (`"1.2K played"`, `"980 played"`, etc.).
  * Created `GET /api/v1/categories/popular` endpoint in backend that aggregates genuinely completed matches (`BattleStatus.COMPLETED`) with room settings and topic resolution.
  * Populates real play counts and live available question counts without fake numbers or placeholder records.
  * Implemented honest empty state: `"No popular quizzes yet. Be the first to play!"` with an invitation to play from available categories.
* **Verification**: Verified via `verify-popular-quizzes.ts` script and live MongoDB completed battle aggregations.

---

### HD-003: Missing Dynamic Category Browsing Routes & Dummy Circular In-Page Scrolling
* **Severity**: **High**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Navigation & Routing
* **Exact File Path & Line Numbers**: [`client/app/(public)/categories/page.tsx`](file:///h:/Project/code-arena/client/app/%28public%29/categories/page.tsx), [`client/app/(public)/categories/[slug]/page.tsx`](file:///h:/Project/code-arena/client/app/%28public%29/categories/%5Bslug%5D/page.tsx), [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/%28public%29/page.tsx)
* **Resolution**:
  * Created dedicated `client/app/(public)/categories/page.tsx` (`/categories`) listing all active categories with search filtering, question counts, and subject navigation.
  * Created dynamic `client/app/(public)/categories/[slug]/page.tsx` (`/categories/[slug]`) fetching real category and subject data via `GET /api/v1/categories/:categoryId/subjects`, supporting mixed-category battles and direct subject-level Solo / Multiplayer room creation.
  * Replaced circular in-page smooth scrolls on homepage ("View All Categories" and "View All Quizzes") with real navigation to `/categories`.
  * Implemented empty states (`"No subjects available in this category yet."`) and not-found states (`"Category Not Found"`).
* **Verification**: Next.js 16 production build succeeded generating `○ /categories` and `ƒ /categories/[slug]`.

---
---

### HD-004: Lobby Disconnected Timer Selection vs. Server-Authoritative Category Timers
* **Severity**: **Medium**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Multiplayer Lobby & Battle Configuration
* **Exact File Path & Line Numbers**: [`client/app/(protected)/lobby/[roomCode]/page.tsx:701-721`](file:///h:/Project/code-arena/client/app/%28protected%29/lobby/%5BroomCode%5D/page.tsx#L701-L721), [`server/src/shared/config/quiz-config.ts:25-37`](file:///h:/Project/code-arena/server/src/shared/config/quiz-config.ts#L25-L37), [`server/src/modules/room/room.service.ts:89-108, 321-332`](file:///h:/Project/code-arena/server/src/modules/room/room.service.ts), [`server/src/modules/room/room.validation.ts:11-35, 53-75`](file:///h:/Project/code-arena/server/src/modules/room/room.validation.ts), [`server/src/sockets/socket.validator.ts:28-30`](file:///h:/Project/code-arena/server/src/sockets/socket.validator.ts#L28-L30)
* **Resolution Description**:
  1. **Allowed Values**: Strictly `[10, 20, 30]` seconds per question. Exported `MULTIPLAYER_TIMER_OPTIONS` and type predicate `isValidMultiplayerTimeLimit()`. Documented default for newly created multiplayer rooms is `30s` (fallback `DEFAULT_MULTIPLAYER_TIME_LIMIT`).
  2. **Validation**: Updated both REST (`createRoomSchema`, `updateSettingsSchema`) and Socket.IO (`roomUpdateSettingsPayloadSchema`) to validate `timeLimit` in `[10, 20, 30]`. Unsupported values (e.g. 15s, 45s, 60s) are rejected server-authoritatively with 400 Bad Request.
  3. **Room Persistence**: Forwarded `timeLimit` through `roomController` and `roomService.createRoom` / `updateSettings`, saving it authoritatively to `Room.settings.timeLimit` in MongoDB.
  4. **Battle Enforcement**: `battleService.startBattle` carries `room.settings.timeLimit` into `battle.timePerQuestion`. Governs round deadlines, question timeout calculation, and reconnect sync. Category defaults (`CATEGORY_TIMER_MAP`) never override a user-selected multiplayer duration. Solo mode continues to use category timers (`getCategoryTimeLimit`).
  5. **Client Resilience**: In `page.tsx`, if the server rejects a setting update, the UI automatically rolls back `selectedTimeLimit` to `room.settings.timeLimit` and surfaces a toast error without claiming optimistic success.
* **Dependencies / Risks**: None. Legacy rooms without `timeLimit` default safely to 30s.
* **Acceptance Criteria**:
  Host can select 10s, 20s, or 30s; server persists and enforces it through every battle round; invalid values rejected; solo mode unaffected.
* **Verification Method**: Verified with `npx tsx server/src/scripts/verify-phase2-fixes.ts` and `npx tsx server/src/scripts/verify-quiz-configuration.ts` (all checkpoints passed).

---

### HD-005: Hardcoded External Domain Fallback in Lobby Invite URL
* **Severity**: **Medium**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Multiplayer Lobby
* **Exact File Path & Line Numbers**: [`client/app/(protected)/lobby/[roomCode]/page.tsx:85-89, 139-145, 620-630`](file:///h:/Project/code-arena/client/app/%28protected%29/lobby/%5BroomCode%5D/page.tsx#L85-L89)
* **Resolution Description**:
  1. Removed placeholder `https://quizzy.app/join/${roomCode}` entirely.
  2. Dynamically derives join link from active browser origin: `${window.location.origin}/lobby/${encodeURIComponent(roomCode)}`.
  3. Safe during SSR by falling back to relative canonical path `/lobby/${encodeURIComponent(roomCode)}`.
  4. Encodes `roomCode` safely using `encodeURIComponent`.
  5. Copy action safely resolves origin URL and copies verified `/lobby/[roomCode]` path to clipboard.
* **Dependencies / Risks**: None.
* **Acceptance Criteria**:
  No hardcoded `quizzy.app` URLs remain; copied link points to current host origin at `/lobby/${roomCode}`.
* **Verification Method**: Verified with `npx tsx server/src/scripts/verify-phase2-fixes.ts` and automated grep across entire client codebase.

---

### HD-006: Hardcoded Fallback URL & Raw Fetch in `PlayAsGuestModal.tsx`
* **Severity**: **Medium**
* **Status**: **Confirmed**
* **Feature Area**: Authentication
* **Exact File Path & Line Numbers**: [`client/features/auth/components/PlayAsGuestModal.tsx:29-30`](file:///h:/Project/code-arena/client/features/auth/components/PlayAsGuestModal.tsx#L29-L30)
* **Current Behavior**:
  Constructs `const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"` and invokes raw `fetch`, bypassing the centralized `apiRequest` / `useApiClient` pipeline.
* **Evidence**:
  ```typescript
  // client/features/auth/components/PlayAsGuestModal.tsx:29-31
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/auth/guest`, { ... });
  ```
* **Why This Is a Problem**:
  Bypasses centralized error formatting, token refresh logic, and network error handling provided by `useApiClient`. In deployments where `NEXT_PUBLIC_API_URL` is omitted or proxied, it will fail by targeting `http://localhost:5000`.
* **Expected Behavior**:
  Use `useApiClient` or `apiRequest('/auth/guest', ...)` like the rest of the frontend client.
* **Correct Source of Truth**: `client/lib/api.ts` (`apiRequest`).
* **Recommended Fix**:
  Refactor `handleGuestLogin` to use `useApiClient().post('/auth/guest', ...)`.
* **Dependencies / Risks**: None.
* **Acceptance Criteria**:
  Guest login route goes through centralized API transport.
* **Verification Method**: Log in as guest; observe request handled through `useApiClient`.

---

### HD-007: Legacy Sandbox `durationMinutes: 30` in Zustand `battleStore.ts`
* **Severity**: **Low**
* **Status**: **Confirmed**
* **Feature Area**: Battle Store & State Management
* **Exact File Path & Line Numbers**: [`client/store/battleStore.ts:62, 72, 87`](file:///h:/Project/code-arena/client/store/battleStore.ts#L62)
* **Current Behavior**:
  Initial state, action `setRoomDetails`, and `resetBattle` retain `durationMinutes: 30`, a legacy remnant from coding sandbox implementations.
* **Evidence**:
  ```typescript
  // client/store/battleStore.ts:62
  durationMinutes: 30,
  // client/store/battleStore.ts:87
  durationMinutes: 30,
  ```
* **Why This Is a Problem**:
  QUIZZY is a round-based multiplayer quiz platform where rounds have per-question second deadlines (30s/60s). Retaining 30-minute match durations confuses developers and creates dead state.
* **Expected Behavior**:
  State store should only contain quiz-relevant properties (`timePerQuestion`, `questionDeadline`, `currentQuestionIndex`).
* **Correct Source of Truth**: Round-based battle state.
* **Recommended Fix**:
  Remove `durationMinutes` from `BattleState` interface and initial Zustand state.
* **Dependencies / Risks**: Check if any remaining component reads `durationMinutes` (none found during grep).
* **Acceptance Criteria**:
  `durationMinutes` completely removed from `battleStore.ts`.
* **Verification Method**: Run `npm run build` in `client/` after cleanup.

---

### HD-008: Client Test Scripts Hardcoded to Obsolete `mock_test_token_` and Clerk IDs
* **Severity**: **Medium**
* **Status**: **Confirmed**
* **Feature Area**: Developer Tooling & Integration Tests
* **Exact File Path & Line Numbers**: [`client/test-flow.ts:6-14`](file:///h:/Project/code-arena/client/test-flow.ts#L6-L14), [`client/test-complete-game.ts:6-14`](file:///h:/Project/code-arena/client/test-complete-game.ts#L6-L14), [`client/test-timeout.ts:7-14`](file:///h:/Project/code-arena/client/test-timeout.ts#L7-L14), [`client/test-step5-history-results.ts:7-14`](file:///h:/Project/code-arena/client/test-step5-history-results.ts#L7-L14), [`client/test-step6-leaderboard-profile.ts:7-14`](file:///h:/Project/code-arena/client/test-step6-leaderboard-profile.ts#L7-L14), [`client/test-step7-comprehensive.ts:7-14`](file:///h:/Project/code-arena/client/test-step7-comprehensive.ts#L7-L14)
* **Current Behavior**:
  Six integration test scripts in `client/` contain hardcoded tokens (`mock_test_token_user_3HIxvzCofKPVuwGi0EMZbK3dUvO`), hardcoded `clerkId`, and `BACKEND_URL = 'http://localhost:5000'`.
* **Evidence**:
  ```typescript
  // client/test-flow.ts:6-8
  const USER_1 = {
    clerkId: 'user_3HIxvzCofKPVuwGi0EMZbK3dUvO',
    token: 'mock_test_token_user_3HIxvzCofKPVuwGi0EMZbK3dUvO',
    username: 'AliceHost',
  };
  ```
* **Why This Is a Problem**:
  Backdoor test tokens are strictly rejected by the server outside `NODE_ENV === 'test'`. Running these scripts against a local development server fails with 401 Unauthorized, misleading engineers.
* **Expected Behavior**:
  Test scripts should dynamically create guest sessions (`POST /api/v1/auth/guest`) or authenticate with test accounts, or be consolidated into `server/src/scripts/verify-multiplayer-quiz.ts`.
* **Correct Source of Truth**: Native JWT & Guest authentication routes.
* **Recommended Fix**:
  Update client test scripts to authenticate via `/api/v1/auth/guest` or remove obsolete scripts in favor of backend verification suites.
* **Dependencies / Risks**: None.
* **Acceptance Criteria**:
  Scripts execute cleanly using valid authentication tokens.
* **Verification Method**: Run `npx tsx client/test-flow.ts` and verify socket handshake succeeds.

---

### HD-009: Missing Explicit Mapping for Top-Level `science` in Backend `CATEGORY_TIMER_MAP`
* **Severity**: **Medium**
* **Status**: **Resolved (Verified)**
* **Feature Area**: Quiz Configuration & Timers
* **Exact File Path & Line Numbers**: [`server/src/shared/config/quiz-config.ts:17-23`](file:///h:/Project/code-arena/server/src/shared/config/quiz-config.ts#L17-L23)
* **Resolution Description**:
  1. Added explicit, declarative `science: 30` mapping to `CATEGORY_TIMER_MAP`.
  2. Type-safe derivation in `getCategoryTimeLimit('science')` resolves to 30 seconds.
  3. Separated category defaults from user-selected multiplayer durations where custom selections (10s, 20s, 30s) take absolute precedence over category defaults in multiplayer matches.
* **Dependencies / Risks**: None.
* **Acceptance Criteria**:
  `CATEGORY_TIMER_MAP['science'] === 30` and `getCategoryTimeLimit('science') === 30`.
* **Verification Method**: Verified with `npx tsx server/src/scripts/verify-phase2-fixes.ts` and `npx tsx server/src/scripts/verify-quiz-configuration.ts`.

---

### HD-010: Missing `/admin` in Next.js Edge Proxy Protected Prefixes
* **Severity**: **Low**
* **Status**: **Confirmed**
* **Feature Area**: Route Guards & Edge Proxy
* **Exact File Path & Line Numbers**: [`client/proxy.ts:3-11`](file:///h:/Project/code-arena/client/proxy.ts#L3-L11)
* **Current Behavior**:
  `PROTECTED_PREFIXES` guards `/battle`, `/profile`, `/settings`, `/lobby`, `/leaderboard`, `/history`, `/results`, but does not list `/admin`.
* **Evidence**:
  ```typescript
  // client/proxy.ts:3-11
  const PROTECTED_PREFIXES = [
    "/battle",
    "/profile",
    "/settings",
    "/lobby",
    "/leaderboard",
    "/history",
    "/results",
  ];
  ```
* **Why This Is a Problem**:
  Unauthenticated visitors attempting to access `/admin` are not immediately redirected to `/login?redirect=/admin` by the Next.js edge proxy, relying instead on client-side React rendering in `admin/layout.tsx` to handle the redirection.
* **Expected Behavior**:
  The Next.js edge proxy should intercept unauthenticated requests to `/admin` before rendering any page components.
* **Correct Source of Truth**: `client/proxy.ts`.
* **Recommended Fix**:
  Add `"/admin"` to `PROTECTED_PREFIXES` in `client/proxy.ts`.
* **Dependencies / Risks**: Ensure guest tokens are either handled or redirected appropriately.
* **Acceptance Criteria**:
  Unauthenticated requests to `/admin` redirect to `/login?redirect=/admin`.
* **Verification Method**: Open `/admin` in an incognito window; verify immediate redirect to `/login?redirect=%2Fadmin`.

---

### HD-011: Unused Stub File `history.model.ts`
* **Severity**: **Low**
* **Status**: **Confirmed**
* **Feature Area**: Database Schemas & Hygiene
* **Exact File Path & Line Numbers**: [`server/src/modules/history/history.model.ts:1`](file:///h:/Project/code-arena/server/src/modules/history/history.model.ts#L1)
* **Current Behavior**:
  Contains only `// TODO: Implement`. Match history is already authoritatively derived directly from `BattleModel` via `HistoryRepository`.
* **Evidence**:
  ```typescript
  // server/src/modules/history/history.model.ts:1
  // TODO: Implement
  ```
* **Why This Is a Problem**:
  Dead stub file creates the impression that a separate match history table or model is missing.
* **Expected Behavior**:
  Document that `BattleModel` is the single source of truth for match history, or remove the file.
* **Correct Source of Truth**: `server/src/modules/battle/battle.model.ts`.
* **Recommended Fix**:
  Remove the unused stub file or add explicit export documentation.
* **Dependencies / Risks**: None.
* **Acceptance Criteria**:
  No dead stub files in `server/src/modules/history/`.
* **Verification Method**: Check directory contents.

---

### HD-012: Historical Pre-Atomic Win/Loss Counter Drift on Legacy Test Accounts
* **Severity**: **Low**
* **Status**: **Confirmed**
* **Feature Area**: Database Data Integrity
* **Exact File Path & Line Numbers**: [`server/src/scripts/reconcile-user-stats.ts:12-18`](file:///h:/Project/code-arena/server/src/scripts/reconcile-user-stats.ts#L12-L18)
* **Current Behavior**:
  Three historical test user records (`user_wxsCti`, `user_K3dUvO`, `user_5xl0Nv`) created prior to atomic battle finalization have drifted win/loss counters in MongoDB.
* **Evidence**:
  Documented in `reconcile-user-stats.ts` validation report.
* **Why This Is a Problem**:
  Causes minor discrepancies in test accounts on leaderboards if not reconciled.
* **Expected Behavior**:
  All user stats match exact aggregation of completed `BattleModel` records.
* **Correct Source of Truth**: MongoDB `BattleModel` records.
* **Recommended Fix**:
  Execute `npm run reconcile:apply` in production database maintenance window.
* **Dependencies / Risks**: None (script is idempotent).
* **Acceptance Criteria**:
  All user documents have stats equal to their aggregated battle records.
* **Verification Method**: Run `npx tsx server/src/scripts/reconcile-user-stats.ts --dry-run`.

---

## 4. Feature-by-Feature Audit

### 4.1 Homepage and Navigation
* **Status**: ✅ **Resolved** (`HD-001`, `HD-002`, `HD-003`).
* **Findings**:
  * Homepage now dynamically fetches and renders categories from `GET /api/v1/categories` with real live question counts and honest empty state.
  * Homepage retrieves genuinely most-played quizzes from completed battles via `GET /api/v1/categories/popular` with zero fake numbers or records.
  * Circular smooth scrolling was replaced with real Next.js links to `/categories`.
  * Science is rendered as an independent top-level Category.
  * Category cards navigate dynamically to `/categories/[slug]`.

### 4.2 Authentication and User Profile
* **Status**: Confirmed issue found (`HD-006`).
* **Findings**:
  * `PlayAsGuestModal.tsx` hardcodes fallback API URL and uses raw `fetch`.
  * Real user profile, display name editing, stats, and match history in `ProfileStats.tsx` correctly consume backend APIs (`/users/me` and `/users/me/profile`). No hardcoded mock users.

### 4.3 Dashboard and User Statistics
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * The `/dashboard` route is permanently redirected to `/` via `proxy.ts:18-20` in accordance with the single-page arcade layout architecture.
  * Real stats are rendered dynamically on the `/profile` and `/leaderboard` pages.

### 4.4 Categories and Subjects
* **Status**: ✅ **Resolved** (`HD-001`, `HD-003`); Open item (`HD-009`).
* **Findings**:
  * Created `/categories` page rendering all active categories with search filtering and question counts.
  * Created dynamic `/categories/[slug]` page rendering category details, subjects, question counts, and quick-launch Solo / Multiplayer quiz actions.
  * Backend `GET /api/v1/categories` and `GET /api/v1/categories/:categoryId/subjects` are fully consumed by frontend routes.

### 4.5 Quiz Configuration and Question Selection
* **Status**: Confirmed issue found (`HD-009`).
* **Findings**:
  * Single source of truth is `server/src/shared/config/quiz-config.ts` enforcing `[10, 15, 20]` question counts.
  * Missing explicit `science: 30` entry in `CATEGORY_TIMER_MAP`.
  * Question sampler (`sampleRandomPublished`) uses MongoDB `$sample` aggregation with 2-tier fallback; no hardcoded question lists.

### 4.6 Learn and Practice Mode
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * Solo practice rooms use `POST /api/v1/rooms/solo` backed by real database questions and identical server-authoritative timer logic.

### 4.7 Live Quiz Arena
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * `client/app/(protected)/battle/[roomCode]/page.tsx` receives questions one-by-one via live Socket.IO events (`battle:init`, `battle:next_question`).
  * No answers or question pools are embedded or exposed client-side.

### 4.8 Quiz Results and Performance Analysis
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * `client/app/(match)/results/[matchId]/page.tsx` retrieves server-authoritative results from `GET /api/v1/battles/:matchId/results`.
  * Solo mode renders only the player's real score and speed; multiplayer renders only actual connected players. No fabricated opponents.

### 4.9 Multiplayer Lobby and Room Management
* **Status**: Confirmed issues found (`HD-004`, `HD-005`).
* **Findings**:
  * Lobby has non-functional `[10s, 20s, 30s]` buttons that conflict with server-authoritative timers.
  * Invite URL input falls back to `https://quizzy.app/join/${roomCode}`.

### 4.10 Real-Time Gameplay and Scoring
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * Scoring is calculated server-side using clamped time difference formula in `battle.service.ts:316`. Client only displays server-reported scores.

### 4.11 Match History, Leaderboards, and Achievements
* **Status**: Confirmed issue found (`HD-012`).
* **Findings**:
  * `LeaderboardTable.tsx` and `MatchHistoryTable.tsx` fetch live paginated data from `/leaderboard` and `/history`.
  * Legitimate empty states exist when no matches have occurred.

### 4.12 Admin Overview and Curriculum Management
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * Admin Overview (`/admin`), Categories (`/admin/categories`), and Import (`/admin/import`) dynamically fetch live statistics, categories, subjects, and question counts from `/admin/overview` and `/categories`.

### 4.13 Question Import and Import History
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * 5-step JSON import preview and execution consume live endpoints (`/admin/import/preview`, `/admin/import/execute`).
  * Import history is dynamically retrieved from `ImportAuditModel` via `GET /api/v1/admin/import/history`.

### 4.14 Backend APIs and Database Access
* **Status**: Confirmed issue found (`HD-011`).
* **Findings**:
  * APIs use Mongoose models (`CategoryModel`, `SubjectModel`, `QuestionModel`, `RoomModel`, `BattleModel`, `UserModel`, `ImportAuditModel`).
  * Stub file `history.model.ts` is unused.

### 4.15 Socket.IO and Persistent State
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * Active round deadlines (`startedAt`, `deadline`, `revealExpiresAt`) are persistently stored in MongoDB `BattleModel.currentRound` with automated background sweepers.

### 4.16 Environment Configuration and Security
* **Status**: Confirmed issue found (`HD-010`).
* **Findings**:
  * Zod schema in `server/src/config/env.ts` enforces 32-byte secrets in production.
  * Next.js proxy in `client/proxy.ts` protects sensitive routes but omits `/admin`.

### 4.17 Error Handling, Loading States, and Empty States
* **Status**: No confirmed hardcoded-data issues found.
* **Findings**:
  * Loading skeletons, error retry banners, and empty states throughout the app are legitimate UI states and do not present fake data as real.

### 4.18 Tests, Scripts, and Documentation
* **Status**: Confirmed issue found (`HD-008`).
* **Findings**:
  * Integration scripts in `client/test-*.ts` retain obsolete mock tokens and Clerk parameters.

---

## 5. Duplicate and Conflicting Sources of Truth

| Domain | Source A | Source B | Owner / Canonical Source of Truth |
| :--- | :--- | :--- | :--- |
| **Category Timers** | `client/app/.../lobby/[roomCode]/page.tsx:703` (`[10s, 20s, 30s]`) | `server/src/shared/config/quiz-config.ts` (`CATEGORY_TIMER_MAP`) | **Backend `quiz-config.ts`**: Timers are strictly server-authoritative by category. Client must display this value read-only. |
| **Category Hierarchy** | `client/app/(public)/page.tsx:167` (Hardcoded Science under GK) | MongoDB `CategoryModel` (`slug: "science"` top-level) | **MongoDB `CategoryModel`**: Science is an independent category containing Physics, Chemistry, and Biology. |
| **Quiz Question Count** | `client/store/battleStore.ts` (`durationMinutes: 30`) | `BattleModel.questionCount` (`enum: [10, 15, 20]`) | **`quiz-config.ts` & `BattleModel`**: Questions counts are 10, 15, or 20. |
| **API Base URL** | `client/lib/api.ts` (`API_URL`) | `client/features/auth/.../PlayAsGuestModal.tsx:29` (Inline `process.env`) | **`client/lib/api.ts`**: All HTTP traffic must route through `apiRequest` / `useApiClient`. |
| **Protected Route Registry** | `client/proxy.ts` (`PROTECTED_PREFIXES`) | `client/app/(admin)/admin/layout.tsx` (Component-level check) | **`client/proxy.ts`**: Edge proxy must include `/admin` to prevent unauthenticated rendering. |

---

## 6. Recommended Fix Order

### Phase 0 — Security & Route Protection
* **`HD-010`**: Add `"/admin"` to `PROTECTED_PREFIXES` in `client/proxy.ts`.
* **`HD-006`**: Refactor `PlayAsGuestModal.tsx` to use `useApiClient` rather than raw `fetch` and hardcoded fallback URL.

### Phase 1 — Core Curriculum & Timer Truth
* **`HD-009`**: Add `science: 30` to `CATEGORY_TIMER_MAP` in `server/src/shared/config/quiz-config.ts`.
* **`HD-004`**: Replace disconnected `[10s, 20s, 30s]` buttons in lobby with authoritative category timer badge.
* **`HD-005`**: Replace `https://quizzy.app` fallback in lobby invite input with dynamic `window.location.origin` path.

### Phase 2 — Dynamic Homepage & Categories Browsing
* **`HD-001`**: Refactor homepage `exploreCategoriesList` to render dynamic category cards from `GET /api/v1/categories`.
* **`HD-002`**: Replace static `mostPlayedQuizzes` with real popular subjects/categories from database.
* **`HD-003`**: Implement dynamic `/categories` and `/categories/[slug]` pages for exploring subjects and launching quizzes.

### Phase 3 — Cleanup & Test Hygiene
* **`HD-007`**: Remove legacy `durationMinutes: 30` from `battleStore.ts`.
* **`HD-008`**: Update or retire `client/test-*.ts` scripts using obsolete mock tokens.
* **`HD-011`**: Clean up unused stub file `server/src/modules/history/history.model.ts`.
* **`HD-012`**: Reconcile legacy test account counters via `npm run reconcile:apply`.

---

## 7. Active Open Architectural Issues (Preserved from v3.3.0)

### 7.1 Rate Limiter In-Memory Store & Health Check Exhaustion
* **Domain**: API Resilience & Middleware
* **Severity**: **Medium**
* **Impacted Files**: [`server/src/middleware/rate-limiter.middleware.ts`](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts)
* **Problem**: In-memory IP tracking map does not synchronize across multi-node clusters; `/health` endpoint should be exempted.

### 7.2 Socket.IO Horizontal Clustering & Event Synchronization
* **Domain**: Real-Time Architecture & Horizontal Scaling
* **Severity**: **Medium**
* **Impacted Files**: [`server/src/sockets/socket.ts`](file:///h:/Project/code-arena/server/src/sockets/socket.ts)
* **Problem**: In-memory Socket.IO adapter requires Redis adapter (`@socket.io/redis-adapter`) for multi-instance deployments.

### 7.3 Question Bank Depth in Specific Topic / Difficulty Permutations
* **Domain**: Content & Question Bank Coverage
* **Severity**: **Low**
* **Impacted Files**: `server/src/scripts/questions/`
* **Problem**: Niche difficulty permutations have fewer seeded questions, potentially causing question repetition during consecutive matches.

---

## 8. Audit Completion Summary

* **Total Issues**: 12
* **Resolved Issues**: 6 (`HD-001`, `HD-002`, `HD-003`, `HD-004`, `HD-005`, `HD-009`)
* **Open Issues**: 6
* **Highest-Priority Open Issues**:
  1. **`HD-006`**: Hardcoded Fallback URL & Raw Fetch in `PlayAsGuestModal.tsx`
  2. **`HD-010`**: Missing `/admin` in Next.js Edge Proxy Protected Prefixes
  3. **`HD-008`**: Client Test Scripts Hardcoded to Obsolete `mock_test_token_` and Clerk IDs
  4. **`HD-007`**: Obsolete Hardcoded `durationMinutes: 30` in `battleStore.ts`
  5. **`HD-011`**: Unused Legacy Schema Stub `server/src/modules/history/history.model.ts`
  6. **`HD-012`**: User Statistics Counter Inconsistencies on Legacy Test Accounts
* **Areas Requiring Manual Device Testing**: Multi-device real-time sync with 4 distinct physical phones/browsers across different networks.
* **Next Recommended Phase**: **Phase 3** (`HD-006`, `HD-010`, `HD-007`, `HD-008`, `HD-011`, `HD-012`).

---

## 9. Recently Resolved Changelog

| Component | Resolution Description | Date |
| :--- | :--- | :---: |
| **Phase 2: Custom Multiplayer Timers (HD-004)** | Supported `[10, 20, 30]` seconds per question in multiplayer lobbies. Validated across REST and Socket.IO schemas, persisted in `Room.settings.timeLimit`, carried into `Battle.timePerQuestion`, server-authoritatively enforced for deadlines and timeouts, and UI error recovery added. | Oct 2026 |
| **Phase 2: Dynamic Lobby Invite URL (HD-005)** | Replaced hardcoded `https://quizzy.app/join/${roomCode}` fallback with safe dynamic browser origin `${window.location.origin}/lobby/${encodeURIComponent(roomCode)}` and SSR fallback to relative canonical path. | Oct 2026 |
| **Phase 2: Explicit Science Timer (HD-009)** | Added declarative `science: 30` to `CATEGORY_TIMER_MAP` in `quiz-config.ts`. Verified category defaults never override user-selected multiplayer durations while keeping solo mode intact. | Oct 2026 |
| **Phase 1: Dynamic Categories (HD-001)** | Removed hardcoded `exploreCategoriesList` and fallback counts (`?? 130`, `?? 320`, etc.). Homepage dynamically queries `GET /api/v1/categories`, renders active categories with real MongoDB question counts, and treats Science as an independent top-level category with honest empty states. | Oct 2026 |
| **Phase 1: Real Popular Quizzes (HD-002)** | Removed fabricated popularity numbers (`"1.2K played"`, etc.). Added backend `GET /api/v1/categories/popular` aggregating completed matches from `BattleModel` with room settings and topic resolution. Real play counts and honest empty states. | Oct 2026 |
| **Phase 1: Dynamic Category Routing (HD-003)** | Implemented `/categories` and dynamic `/categories/[slug]` pages fetching real subjects from `GET /api/v1/categories/:categoryId/subjects`, supporting mixed-category battles and direct subject-level Solo / Multiplayer room creation. Removed circular in-page scrolling. | Oct 2026 |
| **Admin Panel & Import** | Complete 5-step JSON question import with Zod validation, category/subject tree management, import history audit logging, and seed-admin script. | Oct 2026 |
| **Battle Engine & Timers** | Removed in-memory `activeRounds` / `activeTimers` process state. Added persistent `BattleModel.currentRound` subdocuments, server-authoritative timestamp deadlines, atomic transitions, and automated sweeper. | Oct 2026 |
| **Room & Battle GC** | Added compound index `{ status: 1, updatedAt: 1 }` on `RoomModel`, `deleteStaleWaitingRooms()` atomic query, periodic background GC, and guaranteed roomCode reuse. | Oct 2026 |
| **Schema Hygiene** | Removed legacy `clerkId`, `preferredLanguage`, and `Room.duration` from schemas, controllers, and services. Updated `BattleModel.questionCount` to `default: 10, enum: [10, 15, 20]`. | Oct 2026 |
| **Next.js 16 Proxy** | Migrated `client/middleware.ts` to `client/proxy.ts` exporting `proxy(req: NextRequest)`. | Oct 2026 |
| **Clerk Config Cleanup** | Purged dead Clerk environment variables across server and client `.env` files. | Oct 2026 |
| **Navbar.tsx** | Fixed React SSR hydration mismatch by introducing a `mounted` state guard around localStorage user checks. | Oct 2026 |
| **Socket.IO Transport** | Standardized on WebSocket-first transport with cookie credentials. | Oct 2026 |
| **Token Family Rotation** | Implemented RFC 6749 §10.4 refresh token rotation with token family revocation. | Oct 2026 |
| **Guest DB Cleanup** | Added MongoDB partial TTL index on `createdAt` to purge guest accounts after 7 days. | Oct 2026 |
