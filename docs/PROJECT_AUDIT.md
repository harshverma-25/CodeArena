# CodeArena: Comprehensive Project Audit & Architecture Review

> **Date:** October 2026  
> **Status:** Current State Analysis & Gap Assessment  
> **Objective:** Identify architectural drift, security vulnerabilities, performance bottlenecks, UX inconsistencies, and establish a prioritized transition roadmap towards a production-ready system.

---

## Executive Summary

**CodeArena** was originally envisioned as a real-time 1v1 competitive coding platform utilizing LeetCode-style algorithmic challenges evaluated by a remote Judge0 sandbox runner. Over successive iterations, the actual implementation pivoted toward a **real-time 1v1 speed MCQ battle arena** (testing DSA, DBMS, and JavaScript fundamentals with countdowns, live opponent telemetry, and instant verdict scoring).

However, this transition was left partially completed:
1. **Architectural Schism:** The codebase contains two parallel, unintegrated ecosystems: the original DSA/Judge0 scaffolding (`ProblemModel`, `MatchModel`, `match.service.ts`, Monaco placeholders) and the live MCQ Battle engine (`QuestionModel`, `BattleModel`, `battle.service.ts`, `battle.socket.ts`).
2. **Critical Security Vulnerability:** An unauthenticated test token backdoor (`Bearer mock_test_token_*`) is active in both the Express HTTP middleware and Socket.IO handshake, enabling arbitrary user impersonation in production.
3. **Severe Performance Bottleneck:** The leaderboard and profile engines perform unindexed $O(N \times M)$ full-table scans across all users and battles in Node.js memory on every request.
4. **Broken User Flows:** Critical UI components (such as Dashboard Recent Battles and Problem Practice links) route to dead endpoints or query unpopulated collections.

The table below outlines the health status across primary system domains:

| Domain | Status | Key Risk / Finding |
| :--- | :---: | :--- |
| **Security & Auth** | 🔴 Critical | Hardcoded mock token bypass in REST and WebSockets; permissive CORS fallback. |
| **Database & Scale** | 🔴 Critical | Leaderboard executes full-database in-memory scans; in-memory timer loss on restart. |
| **Architecture Alignment** | 🟠 High | Dual domain collision (MCQ Speed Battle vs. DSA Sandbox); dead `MatchModel` collection. |
| **Feature Continuity** | 🟠 High | Dashboard Recent Battles empty; Problem Practice 404; missing question topics. |
| **Code Structure & Cleanup**| 🟡 Medium | Orphaned landing components; duplicate error/async utilities; 8 empty stub files. |
| **Testing & Documentation**| 🟡 Medium | 0% automated test coverage; OpenAPI and README desynchronized from live APIs. |

---

## 1. Project Structure & Folder Organization

### Issue 1.1: Root Workspace Fragmentation & Empty Shared Directory
- **Problem:** The repository has `client`, `server`, `shared`, and `docs` directories, but lacks a root-level `package.json` and workspace manager (npm/pnpm workspaces or Turborepo). Furthermore, [shared/index.ts](file:///h:/Project/code-arena/shared/index.ts) is an empty stub (`// TODO: Implement`). Types and interfaces are duplicated between `client/types/index.ts` and `server/src/types`.
- **Why It Matters:** Developers must run independent `npm install` and `npm run dev` commands in separate terminals. Types between client and server easily diverge, causing subtle runtime serialization bugs.
- **Recommended Solution:** Initialize an npm or pnpm workspace at the repository root. Hoist shared TypeScript schemas (Zod validators, DTOs, room/battle enums) into `@codearena/shared` so both client and server consume a single source of truth.
- **Priority:** Medium

### Issue 1.2: Loose Scratch Scripts in Client Root
- **Problem:** Six manual end-to-end test scripts reside directly in the root of the `client` directory:
  - `test-complete-game.ts`
  - `test-flow.ts`
  - `test-step5-history-results.ts`
  - `test-step6-leaderboard-profile.ts`
  - `test-step7-comprehensive.ts`
  - `test-timeout.ts`
- **Why It Matters:** Clutters client project root, confuses new contributors, bypasses CI/CD, and embeds hardcoded mock tokens directly in the repository.
- **Recommended Solution:** Move these scripts into a dedicated `tests/e2e` or `server/tests/manual` directory, and integrate standardized test runners (Vitest or Playwright).
- **Priority:** Low

### Issue 1.3: Empty and Abandoned Backend Stubs
- **Problem:** 
  1. The entire [server/src/modules/auth](file:///h:/Project/code-arena/server/src/modules/auth) directory contains 8 files (`auth.controller.ts`, `auth.model.ts`, `auth.routes.ts`, `auth.service.ts`, etc.) that each contain only `// TODO: Implement`.
  2. [server/src/modules/history/history.model.ts](file:///h:/Project/code-arena/server/src/modules/history/history.model.ts) is an empty stub (`// TODO: Implement`).
  3. [server/src/shared/config/index.ts](file:///h:/Project/code-arena/server/src/shared/config/index.ts) and [server/src/shared/middleware/index.ts](file:///h:/Project/code-arena/server/src/shared/middleware/index.ts) are empty stubs.
  4. The directory `docs/frontend` is completely empty.
- **Why It Matters:** Dead boilerplate code bloats the repository, misleads developers during navigation, and adds cognitive overhead.
- **Recommended Solution:** Safely remove unused stub directories or complete them if there is a deliberate requirement for a local auth layer alongside Clerk.
- **Priority:** Low

---

## 2. Frontend & Backend Architecture

### Issue 2.1: Dual Domain Identity Conflict (DSA Sandbox vs. MCQ Battle)
- **Problem:** 
  - The documentation ([docs/PRD.md](file:///h:/Project/code-arena/docs/PRD.md), [README.md](file:///h:/Project/code-arena/README.md)) and parts of the client ([app/(protected)/problems](file:///h:/Project/code-arena/client/app/(protected)/problems/page.tsx), [ProblemPanel.tsx](file:///h:/Project/code-arena/client/features/match/components/ProblemPanel.tsx)) define CodeArena as a competitive code-execution platform.
  - The live battle engine ([server/src/modules/battle](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts), [server/src/sockets/battle.socket.ts](file:///h:/Project/code-arena/server/src/sockets/battle.socket.ts), [client/features/battle](file:///h:/Project/code-arena/client/features/battle/hooks/useLiveBattle.ts)) is a real-time MCQ quiz duel.
  - [client/app/(match)/match/[matchId]/page.tsx](file:///h:/Project/code-arena/client/app/(match)/match/[matchId]/page.tsx#L116) explicitly states: *"Old code execution system removed. MCQ battle arena module will be connected in Step 2."*
- **Why It Matters:** The codebase is pulled in two opposing directions. Features built for one domain (e.g. Monaco editor code submission, hidden test cases) conflict with features built for the other (instant MCQ option locking, timer countdowns, answer breakdowns).
- **Recommended Solution:** Formally commit to the core product identity:
  - If **MCQ Speed Duel** is the chosen product direction: retire the unused DSA `Problem` model and Judge0 references, and fully brand the UI around rapid quiz battles.
  - If **Both Modes** are desired: cleanly namespace them into two distinct battle modes: `Algorithmic Duel` (Code execution) and `Speed Trivia` (MCQ).
- **Priority:** High

### Issue 2.2: Judge0 Execution Layer Completely Absent
- **Problem:** [README.md](file:///h:/Project/code-arena/README.md#L3) states *"It integrates with the Judge0 API for secure, multi-language sandbox code execution"* and [docs/ProgressTracker.md](file:///h:/Project/code-arena/docs/ProgressTracker.md#L26) marks Judge0 as `✅ 100% Complete`. However, searching the entire server codebase reveals **zero** Judge0 client implementation, queue handler, or submission runner.
- **Why It Matters:** False architectural claims create confusion and obstruct deployment planning.
- **Recommended Solution:** Align documentation and progress tracking with the actual codebase. If code execution is needed in a future milestone, create a proper Judge0 service under `server/src/modules/submission`.
- **Priority:** Medium

### Issue 2.3: Ephemeral In-Memory Timers in Battle Service
- **Problem:** [server/src/modules/battle/battle.service.ts](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts#L20) tracks question timeouts using a local JavaScript Map:
  ```ts
  private activeTimers = new Map<string, NodeJS.Timeout>();
  ```
- **Why It Matters:** 
  1. If the Node.js process crashes, restarts, or deploys while battles are running, all active timeouts are lost, leaving battles frozen in an unfinished state forever.
  2. The application cannot scale horizontally behind a load balancer (e.g., across multiple container replicas) because timers and socket state are pinned to a single Node process.
- **Recommended Solution:** Store question deadlines as absolute UTC timestamps (`questionDeadline: Date`) in MongoDB (already partially stored on the player object). Implement a background worker (e.g., BullMQ with Redis or a lightweight cron sweeper) to expire overdue questions server-side, eliminating stateful process-bound timers.
- **Priority:** High

---

## 3. Existing Features & User Flows

### Issue 3.1: Dashboard "Recent Battles" Component Always Empty
- **Problem:** On [client/features/dashboard/components/RecentBattles.tsx](file:///h:/Project/code-arena/client/features/dashboard/components/RecentBattles.tsx), the component calls [useRecentMatches](file:///h:/Project/code-arena/client/features/dashboard/hooks/useRecentMatches.ts#L48):
  ```ts
  api.get('/matches/history?page=1&limit=5')
  ```
  On the backend, `GET /api/v1/matches/history` queries [matchRepository.findHistory](file:///h:/Project/code-arena/server/src/modules/match/match.repository.ts#L20) against `MatchModel`. However, all battles played in the app are saved exclusively to `BattleModel` via `battleService`. As a result, `MatchModel` remains permanently empty.
- **Why It Matters:** Every user who finishes a battle returns to the dashboard to find "No battles recorded yet", breaking user feedback and progression.
- **Recommended Solution:** Update `useRecentMatches` to fetch from `/history?page=1&limit=5` (which queries `BattleModel` via `historyService`), matching the format rendered by [MatchHistoryTable.tsx](file:///h:/Project/code-arena/client/features/history/components/MatchHistoryTable.tsx).
- **Priority:** High

### Issue 3.2: Broken Practice Solution Link (404 Not Found)
- **Problem:** On the Problem details page ([client/app/(protected)/problems/[slug]/page.tsx](file:///h:/Project/code-arena/client/app/(protected)/problems/[slug]/page.tsx#L250)), the primary CTA button links to:
  ```tsx
  <Link href={`/problems/${problem.slug}/solve`}>Practice Solution</Link>
  ```
  The route `/problems/[slug]/solve` does not exist anywhere in `client/app`.
- **Why It Matters:** Clicking the primary action on problem pages leads directly to a Next.js 404 page.
- **Recommended Solution:** Either implement the dedicated problem practice/solving workspace or temporarily replace this button with an active action (e.g. view starter code or create challenge).
- **Priority:** High

### Issue 3.3: "Challenge with Battle Room" Ignores Problem Parameter
- **Problem:** On [client/app/(protected)/problems/[slug]/page.tsx](file:///h:/Project/code-arena/client/app/(protected)/problems/[slug]/page.tsx#L259), the secondary CTA links to `/battle/new?problemId=${problem._id}`. However, [BattleForm.tsx](file:///h:/Project/code-arena/client/features/battle/components/BattleForm.tsx) does not read `problemId` from URL search parameters, and only creates MCQ battles.
- **Why It Matters:** Users expect the battle room to feature the problem they selected, but are presented with an unrelated MCQ battle creation dialog.
- **Recommended Solution:** Remove the misleading query parameter or map the problem's topic/difficulty into `BattleForm` initial values.
- **Priority:** Medium

### Issue 3.4: Topic Scarcity & Room Creation Failures
- **Problem:** 
  - [BattleForm.tsx](file:///h:/Project/code-arena/client/features/battle/components/BattleForm.tsx#L9-L20) offers 10 topics: `DSA`, `DBMS`, `JavaScript`, `OS`, `CN`, `OOP`, `Java`, `CPP`, `SQL`, and `random`.
  - However, [server/src/scripts/questions](file:///h:/Project/code-arena/server/src/scripts/questions) only contains JSON files for 3 topics: `DSA`, `DBMS`, and `JavaScript` (~6 questions each).
  - When a user selects `OS`, `CN`, `OOP`, `Java`, `CPP`, or `SQL`, [room.service.ts](file:///h:/Project/code-arena/server/src/modules/room/room.service.ts#L30) checks `questionRepository.hasMatchingQuestion` and throws a `400 Bad Request` ("No published questions are currently available").
- **Why It Matters:** 60% of topic options presented in the UI immediately fail with an error when submitted.
- **Recommended Solution:** Seed questions for all listed topics or restrict the UI dropdown to only topics that have at least 15 verified published questions.
- **Priority:** High

### Issue 3.5: Asymmetric Question Assignment in 1v1 Battles
- **Problem:** In [server/src/modules/battle/battle.service.ts](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts#L156-L157):
  ```ts
  const p1Questions = sampledQuestions.slice(0, actualQuestionCount).map((q) => q.questionId);
  const p2Questions = sampledQuestions.slice(actualQuestionCount, actualQuestionCount * 2).map((q) => q.questionId);
  ```
- **Why It Matters:** Player 1 and Player 2 receive completely different questions. In competitive duels, this produces unfair matches where one player receives harder questions than the other. Furthermore, requesting 10 questions requires 20 distinct questions in the database; with only ~6 questions seeded, question count silently collapses to 3 or falls back to unintended topics.
- **Recommended Solution:** Assign the **same** ordered array of questions to both players so they compete head-to-head on identical material.
- **Priority:** High

---

## 4. UI/UX Inconsistencies & Design Problems

### Issue 4.1: Entire Landing Component Suite Orphaned
- **Problem:** [client/components/landing](file:///h:/Project/code-arena/client/components/landing) contains 10 polished, feature-rich landing components:
  - `HeroSection.tsx` (173 lines)
  - `InteractiveBattleDemo.tsx` (385 lines)
  - `MatchDemonstration.tsx` (364 lines)
  - `CurriculumGrid.tsx` (254 lines)
  - `TopicCurriculum.tsx` (223 lines)
  - `MatchProtocol.tsx` (104 lines)
  - `AntiCheatSpecs.tsx` (92 lines)
  - `FinalCta.tsx` (82 lines)
  - `LandingNavbar.tsx` (175 lines)
  - `LandingFooter.tsx` (80 lines)
  
  Yet [client/app/(public)/page.tsx](file:///h:/Project/code-arena/client/app/(public)/page.tsx) uses **none** of them, rendering a bare-bones generic hero section instead.
- **Why It Matters:** Substantial front-end engineering effort is completely hidden from users, leaving the public landing page looking basic and incomplete.
- **Recommended Solution:** Reconstruct `app/(public)/page.tsx` using the pre-built landing components from `components/landing`, consolidating duplicate components (`CurriculumGrid` vs `TopicCurriculum`, `InteractiveBattleDemo` vs `MatchDemonstration`).
- **Priority:** Medium

### Issue 4.2: Confusing Route and Entity Naming
- **Problem:** 
  - Battle results route is located at `app/(match)/results/[matchId]/page.tsx`, but the parameter passed to it is actually a `battleId`, and it calls `/api/v1/history/battles/${matchId}`.
  - Active battles live at `/battle/[roomCode]`, but the route group is named `(protected)`.
  - There is an abandoned page at `app/(match)/match/[matchId]/page.tsx`.
- **Why It Matters:** Creates extreme confusion when debugging navigation flows and linking between history, lobby, and battle screens.
- **Recommended Solution:** Standardize route hierarchy:
  - `/battle/[roomCode]` for active arena.
  - `/battle/results/[battleId]` (or `/history/[battleId]`) for completed battle breakdowns.
  - Delete or archive the unused `(match)/match/[matchId]` route.
- **Priority:** Medium

### Issue 4.3: Visual Palette & Styling Inconsistencies
- **Problem:** While `globals.css` defines a unified HSL token design system (`--background`, `--card`, `--primary`), several components bypass these tokens and hardcode Tailwind zinc classes (`bg-zinc-950`, `bg-zinc-900/60`, `border-border/60`), resulting in inconsistent contrast and borders across screens.
- **Why It Matters:** Degrades visual polish and causes theme fragmentation.
- **Recommended Solution:** Replace hardcoded zinc utility classes with semantic design tokens (`bg-card`, `bg-muted`, `border-border`).
- **Priority:** Low

---

## 5. Code Duplication & Component Architecture

### Issue 5.1: Duplicate Error Classes with Incompatible Signatures
- **Problem:** The backend contains two distinct error classes:
  1. [server/src/shared/errors/api-error.ts](file:///h:/Project/code-arena/server/src/shared/errors/api-error.ts): `constructor(statusCode: number, message: string, ...)`
  2. [server/src/utils/app-error.ts](file:///h:/Project/code-arena/server/src/utils/app-error.ts): `constructor(message: string, statusCode: number, ...)` which extends `ApiError` via `super(statusCode, message)`.
- **Why It Matters:** Having two error classes with inverted parameter order (`(statusCode, message)` vs `(message, statusCode)`) is a major trap for developers, frequently resulting in status codes being assigned as `NaN` or messages assigned as numbers.
- **Recommended Solution:** Consolidate into a single canonical `ApiError` class in `shared/errors/api-error.ts` and refactor all controllers/services to use standard parameter ordering.
- **Priority:** High

### Issue 5.2: Duplicate Async Handlers
- **Problem:** Identical `asyncHandler` wrappers exist at [server/src/utils/async-handler.ts](file:///h:/Project/code-arena/server/src/utils/async-handler.ts) and [server/src/shared/utils/async-handler.ts](file:///h:/Project/code-arena/server/src/shared/utils/async-handler.ts).
- **Why It Matters:** Violates DRY, creates confusion on which utility to import.
- **Recommended Solution:** Delete `server/src/utils/async-handler.ts` and import exclusively from `server/src/shared/utils/async-handler.js`.
- **Priority:** Low

### Issue 5.3: Stale DSA State in `battleStore.ts`
- **Problem:** [client/store/battleStore.ts](file:///h:/Project/code-arena/client/store/battleStore.ts#L18-L23) maintains state and action interfaces for DSA code execution:
  ```ts
  export interface OpponentProgress {
    testCasesPassed: number;
    totalTestCases: number;
    isTyping: boolean;
    submissionStatus?: "idle" | "running" | "success" | "failed";
  }
  ```
  These fields are never used by the live MCQ battle system, while MCQ battle state is shoehorned in via `battleInitData: BattleInitPayload | null`.
- **Why It Matters:** Pollutes the global state store with zombie properties, making store actions unpredictable.
- **Recommended Solution:** Refactor `battleStore.ts` to cleanly represent live battle state (current question index, selected option, time remaining, score telemetry).
- **Priority:** Medium

---

## 6. Database Structure & API Organization

### Issue 6.1: $O(N \times M)$ In-Memory Full-Table Scans in Leaderboard
- **Problem:** In [server/src/modules/user/user.service.ts](file:///h:/Project/code-arena/server/src/modules/user/user.service.ts#L111-L130):
  ```ts
  // Fetches ALL users in the entire database:
  const allUsers = await UserModel.find({}).sort({ createdAt: 1 }).exec();

  // Fetches ALL completed battles in the entire database:
  const completedBattles = await BattleModel.find({ status: BattleStatus.COMPLETED })
    .populate('players.userId', 'username displayName avatar')
    .populate('winnerId', 'username displayName avatar')
    .exec();

  // Iterates through all users and all battles in JavaScript memory:
  const userStats = allUsers.map((user) => { ... });
  ```
  Moreover, [user.service.ts:L271](file:///h:/Project/code-arena/server/src/modules/user/user.service.ts#L271) calls `this.getLeaderboard({ page: 1, limit: 1000 })` every time **any** user visits their profile!
- **Why It Matters:** 
  1. As users and battles accumulate, this operation will exhaust server RAM and trigger process Out-Of-Memory (OOM) crashes.
  2. Every single profile page load or leaderboard view performs two unindexed, unpaginated full-collection scans.
  3. [UserModel](file:///h:/Project/code-arena/server/src/modules/user/user.model.ts) already has persistent counter fields (`wins`, `losses`, `draws`, `matchesPlayed`) that are incremented on battle completion, but `getLeaderboard` ignores them completely.
- **Recommended Solution:** 
  1. Add compound indexes to `UserModel`: `{ wins: -1, matchesPlayed: -1 }`.
  2. Query the leaderboard directly using indexed MongoDB queries:
     ```ts
     UserModel.find({})
       .sort({ wins: -1, matchesPlayed: -1 })
       .skip(skip)
       .limit(limit)
       .select('username displayName avatar wins losses draws matchesPlayed');
     ```
  3. Calculate global rank on profile requests using `UserModel.countDocuments({ wins: { $gt: user.wins } }) + 1` instead of scanning the whole database.
- **Priority:** High

### Issue 6.2: Misplaced Route Mounting in `app.ts`
- **Problem:** In [server/src/app.ts](file:///h:/Project/code-arena/server/src/app.ts#L91-L92):
  ```ts
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/leaderboard', userRoutes);
  ```
  Because the exact same `userRoutes` router is mounted at both `/api/v1/users` and `/api/v1/leaderboard`:
  - `GET /api/v1/leaderboard/me` routes to `userController.getMe`.
  - `GET /api/v1/leaderboard/:username` routes to `userController.getByUsername`.
  - `GET /api/v1/users` returns the leaderboard.
- **Why It Matters:** Pollutes the REST API namespace with duplicate, confusing endpoint aliases.
- **Recommended Solution:** Separate leaderboard into a dedicated controller and router (`leaderboard.routes.ts`) mounted solely at `/api/v1/leaderboard`.
- **Priority:** Medium

### Issue 6.3: Unbounded Memory Leak in In-Memory Rate Limiter
- **Problem:** In [server/src/middleware/rate-limiter.middleware.ts](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts#L4):
  ```ts
  const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
  ```
  New IPs are inserted on connection, but expired entries are **never deleted**.
- **Why It Matters:** Over days of uptime under public traffic, `ipRequestCounts` grows monotonically, causing a gradual memory leak.
- **Recommended Solution:** Add a periodic cleanup timer (`setInterval`) that deletes expired IP keys from the Map, or adopt standard Redis-backed rate limiting (e.g. `rate-limiter-flexible`).
- **Priority:** Medium

---

## 7. Security, Error Handling & Validation

### Issue 7.1: CRITICAL BACKDOOR: Unauthenticated Mock Token Bypass
- **Problem:** In [server/src/middleware/auth.middleware.ts](file:///h:/Project/code-arena/server/src/middleware/auth.middleware.ts#L14-L16):
  ```ts
  const authHeader = req.headers.authorization;
  if (!clerkId && authHeader?.startsWith('Bearer mock_test_token_')) {
    clerkId = authHeader.split(' ')[1].replace('mock_test_token_', '');
  }
  ```
  And in [server/src/sockets/socket.ts](file:///h:/Project/code-arena/server/src/sockets/socket.ts#L30-L35):
  ```ts
  if (token.startsWith('mock_test_token_')) {
    const clerkId = token.replace('mock_test_token_', '');
    const dbUser = await userService.getOrCreateUser(clerkId);
    socket.data.user = dbUser;
    return next();
  }
  ```
  In [userService.getOrCreateUser](file:///h:/Project/code-arena/server/src/modules/user/user.service.ts#L48-L65), any ID starting with `user_` is automatically created in the database without contacting Clerk.
- **Why It Matters:** **Severe Security Hole.** This allows anyone on the internet to bypass authentication completely. An attacker can send `Authorization: Bearer mock_test_token_user_<victim_id>` to impersonate any user, alter profile settings, participate in battles, or forge scores without valid credentials. This bypass has no `process.env.NODE_ENV !== 'production'` guard.
- **Recommended Solution:** 
  1. Immediately restrict `mock_test_token_` acceptance to `NODE_ENV === 'test'` only.
  2. For development and production, strictly require cryptographically verified Clerk JWT tokens.
- **Priority:** High

### Issue 7.2: Public Leaderboard and Profiles Locked Behind Authentication
- **Problem:** In [server/src/modules/user/user.routes.ts](file:///h:/Project/code-arena/server/src/modules/user/user.routes.ts#L15):
  ```ts
  router.use(asyncHandler(authenticate));
  ```
  Because this authentication middleware is applied globally to all user routes:
  - `GET /api/v1/leaderboard` requires a valid Clerk token.
  - `GET /api/v1/users/profile/:username` requires a valid Clerk token.
- **Why It Matters:** Guests and unauthenticated landing page visitors cannot view public profiles or the global leaderboard. Furthermore, [client/middleware.ts](file:///h:/Project/code-arena/client/middleware.ts#L3) does not protect `/leaderboard`, so guest visitors see the leaderboard UI try to load, followed by an abrupt 401 error.
- **Recommended Solution:** Move `authenticate` to protect only sensitive endpoints (`/me`, `PATCH /me`). Make `/leaderboard` and `/:username` publicly accessible with optional auth context.
- **Priority:** Medium

### Issue 7.3: Insecure CORS & Environment Configuration
- **Problem:** In [server/src/app.ts](file:///h:/Project/code-arena/server/src/app.ts#L38-L41):
  ```ts
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));
  ```
  `CORS_ORIGIN` is not defined in [server/src/config/env.ts](file:///h:/Project/code-arena/server/src/config/env.ts) Zod schema. If the variable is unset, it defaults to `*` with `credentials: true`.
- **Why It Matters:** Browser CORS specifications reject responses that combine `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`. In production environments, this can cause requests to fail or leave the backend vulnerable to CSRF-style cross-origin exploits.
- **Recommended Solution:** Add `CORS_ORIGIN` to `env.ts` validation and ensure production environments specify explicit allowed origins (e.g. `https://codearena.dev`).
- **Priority:** Medium

---

## 8. Missing Tests & Documentation

### Issue 8.1: Complete Lack of Automated Test Suites
- **Problem:**
  - Neither `client/package.json` nor `server/package.json` contains a test runner script (`"test"`).
  - There are zero unit test files (`*.test.ts`, `*.spec.ts`) anywhere in the repository.
  - The only testing mechanism is manual execution of the 6 scratch scripts in `client/`.
- **Why It Matters:** Any refactoring or architectural cleanup risks silently breaking socket synchronization, countdown deadlines, or room lifecycle logic.
- **Recommended Solution:** 
  1. Install Vitest in `server` and write unit/integration tests for `battleService`, `roomService`, and `userService`.
  2. Implement automated integration tests using `@socket.io/component-emitter` or mock socket clients.
- **Priority:** High

### Issue 8.2: Out-Of-Sync API Documentation & README
- **Problem:**
  - [server/src/modules/docs/openapi.ts](file:///h:/Project/code-arena/server/src/modules/docs/openapi.ts) does not document `/api/v1/history`, `/api/v1/history/battles/:battleId`, or `/api/v1/questions`.
  - [README.md](file:///h:/Project/code-arena/README.md) details a Judge0 sandbox execution pipeline that is non-existent.
  - [docs/ProgressTracker.md](file:///h:/Project/code-arena/docs/ProgressTracker.md) lists Judge0 and Submissions as 100% complete.
- **Why It Matters:** Onboarding developers and external API consumers cannot rely on the documentation.
- **Recommended Solution:** Regenerate `openapi.ts` to document all active REST endpoints (Users, Rooms, Questions, History, Leaderboard), and update `README.md` to accurately reflect the platform's current feature set.
- **Priority:** Medium

### Issue 8.3: Client Linter Failure (56 Problems: 25 Errors, 31 Warnings)
- **Problem:** Running `npm run lint` in `client` fails with exit code 1, flagging 25 errors and 31 warnings. Key failure categories include:
  1. **`react-hooks/set-state-in-effect` (Cascading Renders):**
     - [client/features/battle/hooks/useLobbySocket.ts:79](file:///h:/Project/code-arena/client/features/battle/hooks/useLobbySocket.ts#L79) (`setRoom(initialRoomData)`) and line 162 (`setIsConnected(socket.connected)`).
     - [client/features/match/hooks/useMatchSocket.ts:46](file:///h:/Project/code-arena/client/features/match/hooks/useMatchSocket.ts#L46) (`setIsConnected(socket.connected)`).
     - [client/features/profile/components/ProfileStats.tsx:41](file:///h:/Project/code-arena/client/features/profile/components/ProfileStats.tsx#L41) (`setDisplayName(dbUser.displayName)`).
  2. **`react/no-unescaped-entities`:** Unescaped single quotes (`'`) in [RecentBattles.tsx:L93](file:///h:/Project/code-arena/client/features/dashboard/components/RecentBattles.tsx#L93) and [MatchHistoryTable.tsx:L150](file:///h:/Project/code-arena/client/features/history/components/MatchHistoryTable.tsx#L150) (`"You haven't..."`).
  3. **`@typescript-eslint/no-explicit-any`:** Widespread explicit `any` usage across [useApiClient.ts](file:///h:/Project/code-arena/client/hooks/useApiClient.ts), [useSocket.ts](file:///h:/Project/code-arena/client/hooks/useSocket.ts), and [socket.ts](file:///h:/Project/code-arena/client/lib/socket.ts).
- **Why It Matters:** Next.js production builds (`next build`) enforce ESLint rules and will fail during CI/CD or Vercel deployments unless these errors are resolved. Additionally, synchronous `setState` in `useEffect` causes React 19 cascading renders that degrade performance.
- **Recommended Solution:** 
  1. Refactor state initialization to derive initial values directly during state declaration (`useState(() => initialValue)`) or in event callbacks rather than in synchronous effects.
  2. Escape unescaped apostrophes (`&apos;`).
  3. Replace `any` types with explicit generic parameters or `unknown`.
- **Priority:** High

---

## 9. Existing Bugs & Potential Risks Summary

| ID | Component | Summary of Bug / Risk |
| :--- | :--- | :--- |
| **BUG-01** | `auth.middleware.ts` & `socket.ts` | **Backdoor:** `Bearer mock_test_token_*` allows full auth bypass for any user ID. |
| **BUG-02** | `user.service.ts` | **OOM Crash Risk:** `getLeaderboard` loads all users and battles into memory on every request. |
| **BUG-03** | `useRecentMatches.ts` | **Broken UI:** Dashboard Recent Battles queries empty `MatchModel` instead of `BattleModel`. |
| **BUG-04** | `problems/[slug]/page.tsx` | **Broken Link:** "Practice Solution" button links to `/problems/[slug]/solve` (404). |
| **BUG-05** | `BattleForm.tsx` & `room.service.ts` | **Validation Failure:** 6 out of 10 topic choices in BattleForm immediately fail room creation. |
| **BUG-06** | `battle.service.ts` | **Unfair Matches:** 1v1 players receive different questions instead of identical sets. |
| **BUG-07** | `rate-limiter.middleware.ts` | **Memory Leak:** `ipRequestCounts` Map never purges expired IP records. |
| **BUG-08** | `user.routes.ts` | **Access Lockout:** Leaderboard and public profiles cannot be viewed by guests. |
| **BUG-09** | `battle.service.ts` | **State Loss:** Active timeouts are stored in Node.js process memory; lost on restart. |
| **BUG-10** | `app.ts` | **Routing Glitch:** `userRoutes` mounted at `/api/v1/leaderboard`, exposing `/leaderboard/me`. |
| **BUG-11** | `client` build/lint | **Build Blocker:** 25 ESLint errors (React 19 effect violations & unescaped quotes) block `next build`. |

---

## Prioritized Improvement Plan

To transition CodeArena into a clean, stable, and production-ready system without breaking existing functionality, the following 4-phase roadmap is recommended:

```mermaid
graph TD
    P1[Phase 1: Security & Critical Bugs] --> P2[Phase 2: Performance & Data Integrity]
    P2 --> P3[Phase 3: Architecture Alignment & Dead Code Cleanup]
    P3 --> P4[Phase 4: UI/UX Polish, Tests & Documentation]
```

### Phase 1: Security Hardening & Critical Bug Fixes (Immediate)
*Target: Eliminate critical vulnerabilities and repair broken user flows.*
1. **Remove / Restrict Mock Token Backdoor:** Restrict `mock_test_token_` parsing in `auth.middleware.ts` and `socket.ts` to `NODE_ENV === 'test'`.
2. **Fix Client ESLint Build Blockers:** Resolve the 25 errors (React 19 `set-state-in-effect`, unescaped quotes, explicit `any`) so `next build` passes for production deployments.
3. **Fix Dashboard Recent Battles:** Update `useRecentMatches.ts` to fetch from `/api/v1/history?page=1&limit=5` so real user battles appear on the dashboard.
4. **Fix 404 Practice Link:** Update `problems/[slug]/page.tsx` to handle practice mode gracefully without pointing to a missing route.
5. **Fix Topic Dropdown & Question Seeding:** Add seed questions for missing topics (`OS`, `CN`, `OOP`, `Java`, `CPP`, `SQL`) or limit `BattleForm` options to topics with available questions.
6. **Harmonize 1v1 Question Sets:** Ensure both players in a battle receive the identical set of questions for fair competition.

### Phase 2: Performance Optimization & Data Integrity
*Target: Protect the server against memory leaks and OOM crashes.*
1. **Refactor Leaderboard & Profiles:** 
   - Add indexes on `UserModel` (`wins`, `matchesPlayed`).
   - Query leaderboard using native MongoDB indexed pagination rather than in-memory sorting.
   - Stop calling `getLeaderboard(1000)` inside `getUserProfileByUsername`.
2. **Fix Rate Limiter Memory Leak:** Add TTL cleanup to `rate-limiter.middleware.ts` or adopt Redis rate limiting.
3. **Separate Leaderboard Routes:** Mount a dedicated `leaderboard.routes.ts` at `/api/v1/leaderboard` and open it to public/guest access.
4. **Make Public Profiles Accessible:** Allow unauthenticated users to view `GET /api/v1/users/profile/:username`.

### Phase 3: Architectural Cleanup & Dead Code Removal
*Target: Consolidate the codebase around the active MCQ Battle model and remove ambiguity.*
1. **Resolve Error Class Duplication:** Consolidate `AppError` and `ApiError` into a single canonical class in `shared/errors/api-error.ts`.
2. **Clean Up Unused Stubs:** Remove empty stub files in `server/src/modules/auth`, `history.model.ts`, and root `shared/index.ts`.
3. **Retire or Re-route Legacy Match Code:** Deprecate unpopulated `MatchModel` or migrate it into the active battle lifecycle. Remove zombie route `app/(match)/match/[matchId]`.
4. **Clean Global Store:** Remove unused DSA code-execution fields from `battleStore.ts`.

### Phase 4: UI/UX Polish, Test Automation & Documentation
*Target: Elevate product presentation, verify reliability, and update documentation.*
1. **Revitalize Landing Page:** Integrate pre-built components from `client/components/landing` into `app/(public)/page.tsx`.
2. **Theme & Token Standardization:** Replace hardcoded zinc background and border classes with semantic design system tokens.
3. **Establish Automated Test Suite:**
   - Configure Vitest in `server` and write unit tests for room creation, battle lifecycle, and answer scoring.
   - Move client loose test scripts into `tests/e2e`.
4. **Synchronize Documentation:** Update `docs/backend`, `README.md`, and OpenAPI 3.0 specification to accurately reflect the live REST API and WebSocket events.
