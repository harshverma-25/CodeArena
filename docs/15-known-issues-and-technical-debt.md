# 15 — Known Issues & Technical Debt

## 1. Overview

This document provides a transparent, engineering-level inventory of active technical debt, operational caveats, and upcoming architectural improvements for CodeArena.

---

## 2. Active Technical Debt & Optimization Backlog

### 2.1 Task 2.1 Legacy User Counter Drift
* **Status**: Resolution implemented; pending manual application.
* **Context**: Prior to the implementation of the atomic battle finalization hook, 4 battles were completed on September 30 and October 1, 2026. This caused persistent counter drift for 3 users (`user_wxsCti`, `user_K3dUvO`, `user_5xl0Nv`).
* **Safe Correction**: An automated, non-destructive reconciliation script was created. To sync user records with historical completed battles, run:
  ```bash
  cd server
  npm run reconcile:apply
  ```

### 2.2 Task 2.2: Rate Limiter Cleanup (Upcoming Phase 2 Task)
* **Status**: Scheduled for Phase 2, Task 2.2.
* **Context**: The rate limiter in [`server/src/middleware/rate-limiter.middleware.ts`](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts) currently uses an in-memory sliding window map.
* **Limitations**:
  * In-memory storage does not synchronize across multi-process clusters or load-balanced containers.
  * Rapid polling or health check pings can unnecessarily consume rate-limiting quotas.
* **Remediation Plan**: Refactor rate limiter to exclude internal `/health` endpoints and prepare an optional Redis-backed adapter for clustered deployments.

### 2.3 Distributed In-Memory Socket Timers
* **Status**: Architectural limitation for horizontal scaling.
* **Context**: Question timeout handlers (`setQuestionTimeout`) currently register native Node.js timers (`setTimeout`) within the active server process memory (`BattleService.activeTimers`).
* **Impact**: Works properly for single-instance deployments, but if the backend is scaled horizontally across multiple instances:
  * Sockets connected to Instance A cannot be timed out by Instance B.
* **Remediation Plan**: Integrate Redis Adapter for Socket.IO (`@socket.io/redis-adapter`) and a lightweight distributed queue (e.g. BullMQ / Redis key expiration) for question timeout dispatch.

### 2.4 Question Bank Depth & Fallback Sampling
* **Status**: Functional with fallback; content expansion needed.
* **Context**: Certain topic and difficulty combinations (e.g., `networks` + `hard`) contain fewer than the 10 questions required for a full match.
* **Current Behavior**: The battle engine's 2-tier fallback algorithm gracefully relaxes difficulty and topic constraints to ensure matches always start.
* **Remediation Plan**: Expand the question bank seed files in `server/src/scripts/questions/` to provide at least 50 questions per topic/difficulty permutation.

### 2.5 Root `README.md` Inaccuracy
* **Status**: Scheduled for rewrite.
* **Context**: The root `README.md` still describes an obsolete competitive coding platform with Judge0 sandbox execution.
* **Remediation Plan**: Rewrite `README.md` to reflect the 1v1 MCQ battle platform once documentation in `docs/` is verified.

---

## 3. Risk Assessment Matrix

| Item | Severity | Impact Area | Workaround / Mitigation |
| :--- | :---: | :--- | :--- |
| **Legacy User Counter Drift** | Low | Leaderboard stats | Run `npm run reconcile:apply` to sync database counters. |
| **In-Memory Rate Limiting** | Medium | Multi-node scaling | Single node deployments unaffected; address in Task 2.2. |
| **In-Memory Sockets / Timers** | Medium | Horizontal scalability | Deploy backend on a single vertically-scaled instance until Redis adapter is introduced. |
| **Question Bank Depth** | Low | Question variety | Fallback sampler successfully ensures matches start without errors. |

---

## 4. Document Cross-References
* For database schema and index implementation, see [05 — Database Architecture](05-database-architecture.md).
* For battle engine timer orchestration, see [08 — Battle Engine](08-battle-engine.md).
* For testing and reconciliation commands, see [12 — Testing Guide](12-testing-guide.md).
