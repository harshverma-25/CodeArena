# Quizzy (CodeArena) — Active Issues & Technical Problems Register

**Document Version**: 5.0.0  
**Updated**: October 2026  
**Status**: Active Open Issues Register (Resolved audit items HD-001 – HD-012 archived)  
**Scope**: Full-stack application (`client/`, `server/`, database schemas, and real-time multiplayer engine).

---

## 1. Executive Summary

All 12 historical hardcoded-data and architecture defects from Phases 1–4 (`HD-001` through `HD-012`) have been **fully resolved and verified**.

This register now tracks **active operational problems, architectural debt, and operational risks** requiring attention.

### Active Issues Breakdown

| Issue ID | Severity | Title | Impact Area | Status |
| :--- | :---: | :--- | :--- | :---: |
| **PROB-001** | **High** | Empty Question Bank in Active Database | Match Gameplay & Room Creation | **Active / Open** |
| **PROB-002** | **Medium** | Rate Limiter In-Memory Store & Health Check Exhaustion | API Middleware & Health Probes | **Active / Open** |
| **PROB-003** | **Medium** | Socket.IO Horizontal Clustering & Redis Adapter Missing | Real-Time Scaling & Multi-Node Cluster | **Active / Open** |
| **PROB-004** | **Low** | Question Pool Depth for High-Difficulty Niche Permutations | Gameplay Variety & Content Depth | **Active / Open** |
| **PROB-005** | **Low** | Physical Multi-Device Concurrency Testing Gap | QA & Real-World Network Verification | **Active / Open** |

---

## 2. Active Problems & Technical Debt Register

### PROB-001: Operational Blocker — Empty Question Bank in Active Database
* **Severity**: **High** (Operational Blocker for Gameplay)
* **Status**: **Open**
* **Affected Area**: Room Creation, Solo Practice, Multiplayer Battle Engine
* **Files Impacted**:
  * [`server/src/modules/room/room.service.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.service.ts)
  * [`server/src/modules/question/question.repository.ts`](file:///h:/Project/code-arena/server/src/modules/question/question.repository.ts)
  * [`server/src/scripts/questions/`](file:///h:/Project/code-arena/server/src/scripts/questions/)
* **Problem Description**:
  The MongoDB `questions` collection currently contains **0 published questions** following the recent database cleanup. Creating any new solo or multiplayer match via `POST /api/v1/rooms` or `POST /api/v1/rooms/solo` will be rejected by the server with:
  ```json
  {
    "statusCode": 400,
    "message": "Not enough questions available for the selected topic and difficulty."
  }
  ```
* **Reproduction Steps**:
  1. Start the server and client.
  2. Attempt to create a solo room or multiplayer lobby with any category or question count (10, 15, 20).
  3. The request will fail with an HTTP 400 Bad Request error.
* **Resolution Steps**:
  1. **Option 1 (Web UI Import)**: Log in as an admin at `http://localhost:3000/admin/import`, select a Category and Subject, and upload questions in the required JSON format.
  2. **Option 2 (CLI Seeder)**: Add question JSON files to `server/src/scripts/questions/` (using [`template.json.example`](file:///h:/Project/code-arena/server/src/scripts/questions/template.json.example) as reference) and run:
     ```bash
     cd server
     npm run seed:questions
     ```

---

### PROB-002: Rate Limiter In-Memory Sliding Window & Health Check Quota Depletion
* **Severity**: **Medium**
* **Status**: **Open**
* **Affected Area**: API Resilience, Health Monitoring, Container Orchestration
* **Files Impacted**:
  * [`server/src/middleware/rate-limiter.middleware.ts`](file:///h:/Project/code-arena/server/src/middleware/rate-limiter.middleware.ts)
* **Problem Description**:
  1. The custom rate-limiter middleware tracks IP requests in an in-memory `Map<string, { count: number; resetTime: number }>`.
  2. Only paths starting with `/api/docs` and `/api/swagger.json` are excluded from rate limiting. Health monitoring routes (`/health` and `/api/v1/health`) are **not** exempted.
  3. Automated load balancer health probes (e.g. AWS ALB, Docker health checks, Kubernetes liveness probes) polling every 5–10 seconds quickly exhaust the 500-request window quota, resulting in false `429 Too Many Requests` responses and unhealthy container restarts.
  4. The in-memory map has no automatic TTL eviction for stale IP keys, leading to unbounded memory usage over long uptimes.
* **Reproduction Steps**:
  1. Send $>500$ GET requests to `/health` or `/api/v1/health` within a 15-minute window from the same IP.
  2. Subsequent health checks will fail with HTTP 429.
* **Recommended Next Steps**:
  1. Add explicit bypass logic for health check endpoints:
     ```typescript
     if (req.path === '/health' || req.path === '/api/v1/health') {
       return next();
     }
     ```
  2. Add an automatic eviction interval to sweep expired entries from `ipRequestCounts`, or replace with a distributed Redis sliding window for clustered environments.

---

### PROB-003: Socket.IO Horizontal Clustering & Missing Redis Adapter
* **Severity**: **Medium**
* **Status**: **Open (Accepted for single-node deployments)**
* **Affected Area**: Real-Time Multiplayer Scalability & Multi-Process Clusters
* **Files Impacted**:
  * [`server/src/sockets/socket.ts`](file:///h:/Project/code-arena/server/src/sockets/socket.ts)
  * [`server/src/sockets/battle.socket.ts`](file:///h:/Project/code-arena/server/src/sockets/battle.socket.ts)
  * [`server/src/sockets/room.socket.ts`](file:///h:/Project/code-arena/server/src/sockets/room.socket.ts)
* **Problem Description**:
  Socket.IO is configured with the default in-memory adapter. While this functions correctly for a single Node.js process, it does not support horizontal scaling across multiple load-balanced nodes or PM2 cluster mode:
  * Players connected to Server Instance A will not receive socket broadcasts (`room:user_joined`, `battle:reveal`, `battle:next_question`) emitted by Server Instance B.
  * Reconnection recovery fails if the user is balanced to a different server instance.
* **Reproduction Steps**:
  1. Spin up two server instances on ports 5001 and 5002 behind a round-robin reverse proxy.
  2. Connect Player 1 to Instance A and Player 2 to Instance B in the same room.
  3. Events emitted by Player 1 will not reach Player 2.
* **Recommended Next Steps**:
  1. Integrate `@socket.io/redis-adapter` and `@socket.io/redis-emitter`.
  2. Configure Redis pub/sub credentials in `server/src/config/env.ts`.

---

### PROB-004: Question Pool Depth for High-Difficulty Niche Permutations
* **Severity**: **Low**
* **Status**: **Open**
* **Affected Area**: Question Variety & Anti-Repetition
* **Files Impacted**:
  * [`server/src/modules/question/question.repository.ts`](file:///h:/Project/code-arena/server/src/modules/question/question.repository.ts)
  * [`server/src/scripts/questions/`](file:///h:/Project/code-arena/server/src/scripts/questions/)
* **Problem Description**:
  When population of questions is restored, niche combinations (such as `hard` difficulty in specialized subjects like `Computer Networks` or `Data Interpretation`) often have fewer than 20 total questions available.
  * Although the fallback sampler relaxes constraints to ensure matches start, consecutive 20-question games in the same subject can result in question repetition.
* **Recommended Next Steps**:
  * Target a minimum bank depth of 30–50 questions per subject, with balanced distribution across easy, medium, and hard difficulty tiers.

---

### PROB-005: Physical Multi-Device Concurrency Testing Gap
* **Severity**: **Low**
* **Status**: **Open (Testing Limitation)**
* **Affected Area**: Real-World Network & Mobile Device Verification
* **Problem Description**:
  Multiplayer synchronization, room joining, and concurrent round reveals are verified via automated Node.js socket orchestration scripts (`verify-multiplayer-quiz.ts`). However:
  * Physical multi-device browser behavior across real cellular networks (3G/4G/5G latency variance, mobile Safari/Chrome backgrounding, network switching) has not been verified manually across 4 concurrent mobile devices.
* **Recommended Next Steps**:
  * Conduct a staging verification session using 4 distinct mobile devices on separate networks to stress-test socket heartbeat timeouts, reconnection resilience, and mobile viewport performance.

---

## 3. Resolved Issues Baseline (Archived)

All 12 previously identified audit issues (`HD-001` through `HD-012`) have been fully resolved, verified, and merged into the main codebase:

| ID | Issue Description | Resolution Summary | Status |
| :--- | :--- | :--- | :---: |
| **HD-001** | Homepage hardcoded explore categories & fallback counts | Replaced with dynamic `GET /api/v1/categories` live counts and empty state | ✅ Resolved |
| **HD-002** | Fabricated "Most Played Quizzes" play counts | Created backend aggregation `GET /api/v1/categories/popular` from completed battles | ✅ Resolved |
| **HD-003** | Missing `/categories` and `/categories/[slug]` routes | Built dedicated dynamic category and subject browsing pages | ✅ Resolved |
| **HD-004** | Lobby timer disconnected from server timers | Supported selectable `[10, 20, 30]` seconds enforced server-authoritatively | ✅ Resolved |
| **HD-005** | Hardcoded `https://quizzy.app` in lobby invite link | Switched to dynamic `window.location.origin` and safe SSR canonical fallback | ✅ Resolved |
| **HD-006** | Hardcoded fallback URL and raw fetch in `PlayAsGuestModal` | Centralized to `useApiClient` with unified error handling and cookie credentials | ✅ Resolved |
| **HD-007** | Obsolete `durationMinutes: 30` in Zustand `battleStore.ts` | Removed dead sandbox state; second-based timers remain single source of truth | ✅ Resolved |
| **HD-008** | Client test scripts using mock tokens and Clerk IDs | Upgraded test suite with `test-auth-helper.ts` (real guest sessions and native auth) | ✅ Resolved |
| **HD-009** | Missing explicit mapping for `science` in `CATEGORY_TIMER_MAP` | Added declarative `science: 30` in backend config and category timer resolvers | ✅ Resolved |
| **HD-010** | Missing `/admin` in Next.js edge proxy protected prefixes | Added `/admin` to `PROTECTED_PREFIXES` in `client/proxy.ts` | ✅ Resolved |
| **HD-011** | Dead stub file `server/src/modules/history/history.model.ts` | Deleted stub; affirmed `BattleModel` as single source of truth | ✅ Resolved |
| **HD-012** | Historical user counter drift audit | Ran dry-run audit (0 discrepancies); created unit test suite `verify-reconcile-calculation` | ✅ Clean |
