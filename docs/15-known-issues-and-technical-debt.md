# 15 — Known Issues & Technical Debt

## 1. Overview

This document provides a transparent, engineering-level inventory of active technical debt, operational caveats, and upcoming architectural improvements for Quizzy. Every item is backed by direct source code evidence and prioritized by operational risk.

---

## 2. Active Technical Debt & Issues Register

### Issue 2.1: Rate Limiter In-Memory Store & Health Check Exhaustion
* **ID**: `ISSUE-2.1`
* **Title**: Rate Limiter In-Memory Sliding Window & Health Check Quota Depletion
* **Severity**: Medium
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/middleware/rate-limiter.middleware.ts`](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts)
* **Evidence**:
  * Lines 8–12: Only paths starting with `/api/docs` and `/api/swagger.json` bypass rate limiting. Health checks (`/health` and `/api/v1/health`) are not bypassed.
  * Lines 4, 17–28: `ipRequestCounts` is an unbounded `Map<string, { count: number; resetTime: number }>` in process memory that only resets when the same IP makes a subsequent request after `resetTime`. Expired IP records are never evicted automatically.
* **Impact**:
  * High-frequency health probes (e.g. Docker/Kubernetes/AWS ALB pings every 5–10s) rapidly consume the 500 request quota per window, causing HTTP 429 errors.
  * In-memory limits do not synchronize across multi-process clusters or load-balanced containers.
* **Reproduction Conditions**:
  * Issue $>500$ GET requests to `/health` or `/api/v1/health` from the same IP within 15 minutes.
* **Recommended Next Step**:
  * Add `req.path === '/health' || req.path === '/api/v1/health'` to bypass condition.
  * Add periodic TTL cleanup interval or Redis-backed sliding window adapter for clustered deployments.
* **Status**: Confirmed

---

### Issue 2.2: Socket.IO Horizontal Clustering & Broadcast Isolation
* **ID**: `ISSUE-2.2`
* **Title**: Missing Redis Adapter for Clustered Socket.IO Deployments
* **Severity**: Medium
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/sockets/socket.ts`](file:///h:/Project/code-arena/server/src/sockets/socket.ts)
  * [`server/src/sockets/battle.socket.ts`](file:///h:/Project/code-arena/server/src/sockets/battle.socket.ts)
* **Evidence**:
  * `initializeSocket()` initializes `new Server(httpServer, { ... })` using the default in-memory adapter without `@socket.io/redis-adapter`.
* **Impact**:
  * Single-instance deployments function properly. In multi-instance or load-balanced container clusters, players connected to Instance A will not receive room broadcasts or round reveals emitted on Instance B.
* **Reproduction Conditions**:
  * Run two server processes behind a round-robin load balancer; connect two players in the same room across different instances.
* **Recommended Next Step**:
  * Integrate `@socket.io/redis-adapter` backed by Redis pub/sub when configuring horizontal autoscaling.
* **Status**: Accepted Risk (Single-node deployments unaffected)

---

### Issue 2.3: Question Bank Pool Depth in Specific Topic/Difficulty Permutations
* **ID**: `ISSUE-2.3`
* **Title**: Limited Question Pool Depth for High-Difficulty Niche Subjects
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/scripts/seed-questions.ts`](file:///h:/Project/code-arena/server/src/scripts/seed-questions.ts)
  * [`server/src/scripts/questions/`](file:///h:/Project/code-arena/server/src/scripts/questions/)
* **Evidence**:
  * While the 2-tier fallback sampler in `BattleService` (`sampleRandomPublished`) relaxes constraints to ensure matches always start, certain combinations (e.g., `networks` on `hard`) have fewer than 20 seeded questions in database seed files.
* **Impact**:
  * Consecutive 20-question matches in the same narrow subject may repeat questions across games.
* **Reproduction Conditions**:
  * Create back-to-back 20-question rooms with identical subject and difficulty.
* **Recommended Next Step**:
  * Expand question seed files in `server/src/scripts/questions/` to provide at least 30–50 questions per subject/difficulty matrix.
* **Status**: Confirmed

---

### Issue 2.4: Historical Legacy User Counter Drift
* **ID**: `ISSUE-2.4`
* **Title**: Unapplied Statistics Reconciliation for 3 Historical Accounts
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/scripts/reconcile-user-stats.ts`](file:///h:/Project/code-arena/server/src/scripts/reconcile-user-stats.ts)
* **Evidence**:
  * 4 battles were finalized prior to the deployment of atomic completion transactions on Sept 30 / Oct 1, 2026, causing counter drift in 3 test accounts (`user_wxsCti`, `user_K3dUvO`, `user_5xl0Nv`).
* **Impact**:
  * Minor statistics variance on leaderboard for those 3 historical accounts.
* **Reproduction Conditions**:
  * Run `npm run reconcile:dry-run` to view the 3 affected accounts.
* **Recommended Next Step**:
  * Execute `npm run reconcile:apply` against the target database.
* **Status**: Confirmed

---

### Issue 2.5: Client Test Script Drift (`client/test-flow.ts`)
* **ID**: `ISSUE-2.5`
* **Title**: Legacy Parameters and Mock Tokens in Scratch Test Flow Script
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`client/test-flow.ts`](file:///h:/Project/code-arena/client/test-flow.ts)
* **Evidence**:
  * Uses hardcoded `clerkId`, `mock_test_token_*`, and sends legacy `duration: 30` in room creation body.
* **Impact**:
  * Script fails against development/production servers where mock tokens are strictly rejected.
* **Reproduction Conditions**:
  * Run `npx tsx client/test-flow.ts` against `NODE_ENV=development`.
* **Recommended Next Step**:
  * Update `client/test-flow.ts` to use native login / guest session and category room parameters, or deprecate in favor of `server/src/scripts/verify-product-flow.ts`.
* **Status**: Confirmed

---

### Issue 2.6: Unused Stub File `history.model.ts`
* **ID**: `ISSUE-2.6`
* **Title**: Obsolete Stub File in History Module
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/modules/history/history.model.ts`](file:///h:/Project/code-arena/server/src/modules/history/history.model.ts)
* **Evidence**:
  * Contains only `// TODO: Implement`. History is derived directly from `BattleModel` via `HistoryRepository`.
* **Impact**:
  * Codebase confusion for developers looking for historical match models.
* **Reproduction Conditions**:
  * Static code inspection.
* **Recommended Next Step**:
  * Remove or add explanatory comment export.
* **Status**: Confirmed

---

## 3. Resolved Issues Archive

| Issue ID | Title | Resolution Summary | Status |
| :---: | :--- | :--- | :---: |
| **ISSUE-1.1** | In-Memory Battle Rounds & Timers (Zero Fault Tolerance) | Replaced in-memory Maps with persistent MongoDB `BattleModel.currentRound` subdocuments, server-authoritative timestamps (`startedAt`, `deadline`, `revealExpiresAt`), and 1s background sweeper. | **Resolved** |
| **ISSUE-1.2** | Missing Stale Room & Abandoned Battle Cleanup (GC) | Implemented automated periodic garbage collection (every 10m on startup) pruning stale WAITING/READY rooms older than 2 hours and cancelling abandoned battles, immediately releasing room codes. | **Resolved** |
| **ISSUE-1.3** | Legacy Coding Sandbox Schema Remnants | Purged obsolete `User.preferredLanguage`, `User.clerkId`, and `Room.duration`. Updated `Battle.questionCount` to default 10 with strict `[10, 15, 20]` validation. | **Resolved** |
| **ISSUE-1.4** | Next.js 16 Deprecated `middleware.ts` Warning | Migrated to Next.js 16 `client/proxy.ts` convention, eliminating deprecation build warnings while preserving exact route protection. | **Resolved** |
| **ISSUE-1.5** | Dead Clerk Secrets in Environment Files | Removed all defunct Clerk publishable/secret environment variables from client and server `.env` files. | **Resolved** |
| **ISSUE-1.6** | React SSR Hydration Mismatch in Navbar | Fixed `localStorage` hydration mismatch by adding a `mounted` state guard in `Navbar.tsx`. | **Resolved** |
| **ISSUE-1.7** | Socket.IO Client XHR Poll Error | Aligned Socket.IO transport to WebSocket-first (`transports: ["websocket", "polling"]`), added `withCredentials: true`, and aligned server CORS credentials. | **Resolved** |
| **ISSUE-1.8** | Unconstrained Room Code Generation Loop | Replaced unconstrained `while` loop with bounded 10-attempt generator using lightweight `RoomModel.exists()` and duplicate key (`11000`) race handling. | **Resolved** |
| **ISSUE-1.9** | Legacy Dark Dashboard Modals | Purged dead legacy dark dashboard modals (`BattleForm`, `CreateBattleModal`, `JoinBattleModal`). | **Resolved** |
| **ISSUE-1.10** | Missing Room PIN Format Validation | Enforced strict 6-character alphanumeric PIN validation with UI error feedback in `Navbar.tsx`. | **Resolved** |

---

## 4. Document Cross-References
* For database schema and index implementation, see [05 — Database Architecture](05-database-architecture.md).
* For battle engine timer orchestration, see [08 — Battle Engine](08-battle-engine.md).
* For testing and reconciliation commands, see [12 — Testing Guide](12-testing-guide.md).
