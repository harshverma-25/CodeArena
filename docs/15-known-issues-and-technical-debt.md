# 15 — Known Issues & Technical Debt

## 1. Overview

This document provides a transparent, engineering-level inventory of active technical debt, operational caveats, and upcoming architectural improvements for Quizzy. Every item is backed by direct source code evidence and prioritized by operational risk.

---

## 2. Operational Considerations & Backlog Register

### Issue 2.3: Question Bank Pool Depth in Specific Topic/Difficulty Permutations
* **ID**: `ISSUE-2.3`
* **Title**: Question Pool Depth Expansion for High-Difficulty Niche Subjects
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/scripts/seed-questions.ts`](file:///h:/Project/code-arena/server/src/scripts/seed-questions.ts)
  * [`server/src/scripts/questions/`](file:///h:/Project/code-arena/server/src/scripts/questions/)
* **Evidence**:
  * While the 2-tier fallback sampler in `BattleService` (`sampleRandomPublished`) relaxes constraints to ensure matches always start cleanly, certain niche combinations (e.g., `networks` on `hard`) have smaller seeded sets in initial bootstrap files.
* **Impact**:
  * Consecutive 20-question matches in the exact same narrow subject may repeat questions across games unless new questions are imported.
* **Operational Resolution**:
  * Administrators can use the Admin Portal (`/admin/import`) or CLI seeders to continuously ingest questions via CSV/JSON.
* **Status**: Operational Feature Available (Admin Import)

---

### Issue 2.4: Historical Legacy User Counter Drift
* **ID**: `ISSUE-2.4`
* **Title**: Historical Statistics Reconciliation for Early Beta Test Accounts
* **Severity**: Low
* **Confidence**: Confirmed
* **Affected Files**:
  * [`server/src/scripts/reconcile-user-stats.ts`](file:///h:/Project/code-arena/server/src/scripts/reconcile-user-stats.ts)
* **Evidence**:
  * 4 early test battles finalized prior to the deployment of atomic completion transactions on Sept 30 / Oct 1, 2026, exhibited counter variance in 3 legacy test accounts (`user_wxsCti`, `user_K3dUvO`, `user_5xl0Nv`).
* **Impact**:
  * Minor statistics variance on leaderboard for those 3 legacy test accounts.
* **Remediation**:
  * Execute `npm run reconcile:apply` against the target database if updating legacy records.
* **Status**: Maintenance Tool Ready

---

## 3. Resolved Issues Archive

| Issue ID | Title | Resolution Summary | Status |
| :---: | :--- | :--- | :---: |
| **ISSUE-2.1** | Rate Limiter Health Check Depletion & Memory Map Leak | Added explicit `/health` and `/api/v1/health` bypasses; added a 15-minute periodic interval to evict expired IP buckets from process memory. | **Resolved** |
| **ISSUE-2.2** | Missing Redis Adapter for Clustered Socket.IO | Integrated `@socket.io/redis-adapter` with `ioredis` in `server/src/sockets/socket.ts`. Activated automatically when `REDIS_URI` is present, while maintaining zero-config in-memory adapter for single-node development. | **Resolved** |
| **ISSUE-2.5** | Client Test Script Drift (`client/test-flow.ts`) | Refactored `client/test-flow.ts` to use native guest session creation via `POST /api/v1/auth/guest` and valid room parameters. | **Resolved** |
| **ISSUE-2.6** | Obsolete Stub File `history.model.ts` | Removed obsolete `history.model.ts` stub. History records are queried directly from `BattleModel` through `HistoryRepository`. | **Resolved** |
| **ISSUE-1.1** | In-Memory Battle Rounds & Timers (Zero Fault Tolerance) | Replaced in-memory Maps with persistent MongoDB `BattleModel.currentRound` subdocuments, server-authoritative timestamps (`startedAt`, `deadline`, `revealExpiresAt`), and 1s background sweeper. | **Resolved** |
| **ISSUE-1.2** | Missing Stale Room & Abandoned Battle Cleanup (GC) | Implemented automated periodic garbage collection (every 10m on startup) pruning stale WAITING/READY rooms older than 2 hours, pruning FINISHED/CANCELLED rooms older than 7 days, and cancelling abandoned battles. | **Resolved** |
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
* For active system status summary, see [Project Issues Register](issue.md).
