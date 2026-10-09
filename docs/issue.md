# Comprehensive Project Audit & Issue Register

**Document Version**: 3.3.0  
**Updated**: October 2026  
**Scope**: Frontend Client (`client/`), Backend Service (`server/`), UI/UX Design System, Database Schemas, Real-Time Architecture, and Configuration.

---

## Executive Summary

This document registers the active issues, architectural bottlenecks, and technical debt across the Quizzy codebase.

### Audit Progress to Date:
* ✅ **UI / UX Design & Styling**: Unified brand under **Quizzy**, standardized warm light Stitch design theme, local logo assets, unified `<Navbar />` across all pages, removed ephemeral bookmarks, removed cosmetic audio toggle, standardized on `lucide-react`, and styled in-app Leave Confirmation modal.
* ✅ **Frontend Logic & Authentication**: Fixed silent 401 token refresh in `useApiClient`, aligned cookie `max-age` (15m), implemented socket reconnection lifecycle handlers & in-game reconnection banner, pruned dead state from `uiStore`, and corrected `battleStore.difficulty` casing.
* ✅ **Modal & Feature Parity Gaps**: Purged legacy dark dashboard modals (`CreateBattleModal`, `JoinBattleModal`, `BattleForm`, `/battle/new`) and enforced strict 6-character room PIN validation with UI error feedback.
* ✅ **Room Code Generation**: Replaced unconstrained `while (!isUnique)` loop with bounded 10-attempt `generateUniqueRoomCode` using lightweight `RoomModel.exists()` query and MongoDB duplicate key (`11000`) race condition handling.
* ✅ **In-Memory Battle Rounds & Timers**: Replaced in-memory `activeRounds` / `activeTimers` process state with persistent MongoDB `BattleModel.currentRound` subdocuments, server-authoritative timestamp deadlines, idempotent atomic transitions, and automated sweeper / reconnect recovery.
* ✅ **Stale Room / Abandoned Battle Garbage Collection**: Implemented atomic MongoDB-driven garbage collection (`RoomModel.deleteMany` for stale `WAITING`/`READY` rooms older than 2 hours, `BattleModel.findOneAndUpdate` to `CANCELLED` for abandoned battles), automated periodic cleanup job every 10 minutes on startup, and immediate roomCode freeing for reuse.
* ✅ **Legacy Coding Sandbox Schema Remnants**: Purged obsolete `User.preferredLanguage`, `User.clerkId`, and `Room.duration` from Mongoose schemas, interfaces, DTOs, controllers, and services. Updated `Battle.questionCount` default to 10 with strict `[10, 15, 20]` validation.
* ✅ **Next.js 16 Proxy Migration**: Replaced deprecated `client/middleware.ts` with Next.js 16 `client/proxy.ts` convention, eliminating deprecation build warnings while maintaining exact route protection.
* ✅ **Clerk Secrets & Dead Configuration**: Removed all defunct Clerk publishable/secret environment variables from `.env` and `.env.local` files across client and server.

---

## 1. Active Open Issues

### 1.1 Rate Limiter In-Memory Store & Health Check Exhaustion
* **Domain**: API Resilience & Middleware
* **Severity**: **Medium**
* **Impacted Files**:
  * [`server/src/middleware/rate-limiter.middleware.ts`](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts)
* **Problem**:
  * `rateLimiter` maintains an unbounded in-memory `Map` (`ipRequestCounts`) that only resets counters on subsequent hits by the same IP rather than actively evicting stale entries.
  * Internal/container health-check probes hitting `/health` or `/api/health` are not exempted (only `/api/docs` and `/api/swagger.json` are bypassed). High-frequency monitoring pings can inadvertently deplete rate limits and trigger HTTP 429 errors.
  * In-memory limits do not synchronize across multi-node or clustered deployments.
* **Remediation**:
  Exempt `/health` and monitoring routes from rate limiting, add a periodic stale IP eviction interval, and prepare a Redis-backed store option for clustered environments.

---

### 1.2 Socket.IO Horizontal Clustering & Event Synchronization
* **Domain**: Real-Time Architecture & Horizontal Scaling
* **Severity**: **Medium**
* **Impacted Files**:
  * [`server/src/sockets/socket.ts`](file:///h:/Project/code-arena/server/src/sockets/socket.ts)
  * [`server/src/sockets/battle.socket.ts`](file:///h:/Project/code-arena/server/src/sockets/battle.socket.ts)
* **Problem**:
  Socket.IO uses the default in-memory adapter. While single-instance deployments work properly, horizontally scaling the backend across multiple containers/instances isolates rooms and broadcast events to the instance where a client is connected.
* **Remediation**:
  Integrate `@socket.io/redis-adapter` or a Redis pub/sub backplane to distribute socket events across load-balanced instances.

---

### 1.3 Question Bank Depth in Specific Topic / Difficulty Permutations
* **Domain**: Content & Question Bank
* **Severity**: **Low**
* **Impacted Files**:
  * [`server/src/scripts/seed-questions.ts`](file:///h:/Project/code-arena/server/src/scripts/seed-questions.ts)
  * `server/src/scripts/questions/`
* **Problem**:
  While the 2-tier fallback sampler cleanly relaxes constraints when a pool lacks sufficient questions, niche subject/difficulty permutations (e.g., specific subjects under `hard` difficulty) have fewer seeded questions, potentially causing repetitive questions during consecutive 20-question matches.
* **Remediation**:
  Expand question seed datasets to provide at least 30–50 verified questions per subject/difficulty matrix.

---

### 1.4 Historical Legacy User Counter Drift (Pre-Atomic Hook Records)
* **Domain**: Database Data Integrity
* **Severity**: **Low**
* **Impacted Files**:
  * [`server/src/scripts/reconcile-user-stats.ts`](file:///h:/Project/code-arena/server/src/scripts/reconcile-user-stats.ts)
* **Problem**:
  Three historical test user records (`user_wxsCti`, `user_K3dUvO`, `user_5xl0Nv`) completed prior to the deployment of atomic battle finalization have drifted win/loss counters in MongoDB.
* **Remediation**:
  Apply non-destructive reconciliation script (`npm run reconcile:apply`) against production databases.

---

### 1.5 Client Test Script Drift (`client/test-flow.ts`)
* **Domain**: Script & Test Hygiene
* **Severity**: **Low**
* **Impacted Files**:
  * [`client/test-flow.ts`](file:///h:/Project/code-arena/client/test-flow.ts)
* **Problem**:
  `client/test-flow.ts` retains mock test tokens and legacy parameters (`duration: 30`, `clerkId`) rather than exercising the current Native JWT / Guest auth and Category/Subject quiz configuration.
* **Remediation**:
  Update `client/test-flow.ts` to reflect native/guest tokens and category/subject fields, or consolidate with `server/src/scripts/verify-product-flow.ts`.

---

### 1.6 Unused Stub File `history.model.ts`
* **Domain**: Schema Hygiene
* **Severity**: **Low**
* **Impacted Files**:
  * [`server/src/modules/history/history.model.ts`](file:///h:/Project/code-arena/server/src/modules/history/history.model.ts)
* **Problem**:
  `history.model.ts` contains only `// TODO: Implement`. Match history is already authoritatively derived directly from `BattleModel` via `HistoryRepository`.
* **Remediation**:
  Remove the obsolete stub file or replace it with a formal export/alias documentation.

---

## 2. Issue Priority Matrix

| Item # | Issue Summary | Category | Severity | Status |
| :---: | :--- | :--- | :---: | :---: |
| **1.1** | Rate Limiter in-memory store & health check exhaustion | API Resilience | **Medium** | Open |
| **1.2** | Socket.IO horizontal clustering & event synchronization | Real-Time Scaling | **Medium** | Open |
| **1.3** | Question bank pool depth in specific topic/difficulty permutations | Content Coverage | **Low** | Open |
| **1.4** | Historical user counter drift (3 legacy accounts) | Data Integrity | **Low** | Open |
| **1.5** | Client test script drift (`client/test-flow.ts`) | Test Hygiene | **Low** | Open |
| **1.6** | Unused stub file `history.model.ts` | Schema Hygiene | **Low** | Open |

---

## 3. Recently Resolved Changelog

| Component | Resolution Description | Date |
| :--- | :--- | :---: |
| **Battle Engine & Timers** | Removed in-memory `activeRounds` / `activeTimers` process state. Added persistent `BattleModel.currentRound` subdocuments, server-authoritative timestamp deadlines (`startedAt`, `deadline`, `revealExpiresAt`), atomic MongoDB state transitions, and a background sweeper for live socket events. | Oct 2026 |
| **Room & Battle GC** | Added compound index `{ status: 1, updatedAt: 1 }` on `RoomModel`, `deleteStaleWaitingRooms()` atomic query, `cleanAbandonedBattles()` in `BattleService`, automated startup and 10-minute periodic background GC, and guaranteed roomCode reuse. | Oct 2026 |
| **Schema Hygiene** | Removed `clerkId` and `preferredLanguage` from `UserModel` and `IUser`. Removed `duration` from `RoomModel` and `RoomSettings`. Updated `BattleModel.questionCount` to `default: 10, enum: [10, 15, 20]`. Removed obsolete methods (`findByClerkId`, `updateByClerkId`, `incrementStats`). | Oct 2026 |
| **Next.js 16 Proxy** | Migrated `client/middleware.ts` to `client/proxy.ts` exporting `proxy(req: NextRequest)`, preserving all route guards and eliminating framework deprecation warnings. | Oct 2026 |
| **Clerk Config Cleanup** | Removed dead `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_CLERK_*` variables across server and client `.env` and `.env.local` files. | Oct 2026 |
| **Navbar.tsx** | Fixed React SSR hydration mismatch by introducing a `mounted` state guard around localStorage user checks. | Oct 2026 |
| **Socket.IO Client & Server** | Fixed `xhr poll error` by switching to WebSocket-first transport (`transports: ["websocket", "polling"]`), adding `withCredentials: true`, and aligning server Socket CORS credentials. | Oct 2026 |
| **Room Code Generator** | Replaced unconstrained generation loop with bounded 10-attempt `generateUniqueRoomCode` utilizing `RoomModel.exists()` without populates. | Oct 2026 |
| **Dashboard Modals** | Purged dead legacy dark dashboard modals (`BattleForm`, `CreateBattleModal`, `JoinBattleModal`). | Oct 2026 |
| **Room PIN Input** | Enforced strict 6-character alphanumeric PIN validation with visual feedback in `Navbar.tsx`. | Oct 2026 |
| **Auth Response Security (A-1)** | Stripped `refreshToken` from JSON responses in register, login, and refresh endpoints; token is strictly delivered via HttpOnly cookie. | Oct 2026 |
| **Production JWT Secrets (A-2)** | Enforced required 32+ character secrets in Zod env schema for production mode; eliminated cross-secret chaining and default fallbacks in production. | Oct 2026 |
| **Token Family Rotation (A-3)** | Implemented RFC 6749 §10.4 refresh token family rotation, tracking active/consumed token hashes, and revoking entire token families upon reuse detection. | Oct 2026 |
| **Guest DB Cleanup (A-4)** | Added MongoDB partial TTL index on `createdAt` with `partialFilterExpression: { isGuest: true }` to automatically purge guest accounts after 7 days. | Oct 2026 |
| **Guest Rate Limiter (A-5)** | Added periodic 5-minute background interval sweeper to evict expired IP records from `guestCreationCounts` map, preventing memory leaks. | Oct 2026 |
| **Buffer Encoding (A-6)** | Switched signature buffer conversion to `Buffer.from(sig, 'base64url')` in `jwt.ts` and `auth.service.ts` for efficient timing-safe comparison. | Oct 2026 |
| **Room Settings DTO (E-1)** | Updated REST `updateSettings` controller to forward `categoryId`, `subjectId`, `isMixedCategory`, and `questionCount` alongside `topic` and `difficulty`. | Oct 2026 |
| **Multiplayer Draw Stats (B-1)** | Fixed draw detection for multi-way ties in 3–4 player games; only players specifically tied for 1st place receive `isDraw: true`, while lower-scoring players receive `isLoss: true`. | Oct 2026 |
| **Score Formula Guard (B-2)** | Clamped elapsed time (`0` to `roundDuration`) and potential score (`100` to `1000`) against clock skew and negative timestamp exploits. | Oct 2026 |
| **Sampling Uniqueness (B-3)** | Added over-sampling buffer and MongoDB aggregation `$group` by `$questionId` in `sampleRandomPublished` to guarantee 100% duplicate-free question sampling. | Oct 2026 |
| **Win Streak Tracking (B-4)** | Added `currentStreak` and `highestWinStreak` to `UserModel` schema, and implemented atomic `$set` / `$max` aggregation pipeline in `recordBattleStatsById` to accurately track win streaks and historical peaks. | Oct 2026 |
| **Socket Rate Limiting & Validation (C-1)** | Implemented per-socket sliding-window rate limiting on all room & battle events; added strict Zod validation schemas for all event payloads to protect database integrity. | Oct 2026 |
| **Room Code Join Protection (C-2)** | Enforced 6-character alphanumeric validation and added brute-force join attempt throttling (max 5 failed joins per 60s per user) to safeguard rooms. | Oct 2026 |
| **Safe Disconnect State (C-3)** | Updated socket disconnect handler to only mutate ready state in `WAITING`/`READY` rooms, preventing silenced exceptions during active in-progress battles. | Oct 2026 |
| **Advance Round Acknowledgment (C-4)** | Added host authorization checks and explicit `battle:advance_acknowledged` socket feedback with `{ success: true/false }` status. | Oct 2026 |

