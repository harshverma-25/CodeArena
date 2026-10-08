# Comprehensive Project Audit & Issue Register

**Document Version**: 3.2.0  
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
* ✅ **Runtime Stability**: Resolved React SSR hydration mismatch in `Navbar.tsx` via `mounted` guard, and eliminated `xhr poll error` by prioritizing WebSocket transport (`transports: ["websocket", "polling"]`) and synchronizing Socket.IO CORS with credentials.

---

## 1. Active Open Issues

### 1.1 In-Memory Battle Rounds & Timers (Zero Fault Tolerance)
* **Domain**: Backend Architecture & Scalability
* **Severity**: **High**
* **Impacted Files**:
  * [`server/src/modules/battle/battle.service.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts)
* **Problem**:
  Active battle round states (`activeRounds`) and countdown timeouts (`activeTimers`) are stored solely in Node.js process memory via `Map`.
  * If the server restarts, crashes, or is deployed across multiple instances, all in-flight battle rounds and timer handles are immediately lost.
  * In-progress matches remain stuck in MongoDB with `status: "IN_PROGRESS"` indefinitely.
* **Remediation**:
  Persist active round timestamps in MongoDB or Redis, and introduce Redis-backed distributed pub/sub timers for multi-node deployments.

---

### 1.2 Absence of Stale Room / Abandoned Battle Garbage Collection
* **Domain**: Database Hygiene & Storage
* **Severity**: **Medium**
* **Impacted Files**:
  * [`server/src/modules/room/room.model.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.model.ts)
  * [`server/src/modules/battle/battle.model.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.model.ts)
* **Problem**:
  Rooms abandoned by hosts (e.g. host closes tab while in `WAITING` status) and battles that never finish remain in the MongoDB collection indefinitely. Because `roomCode` has a `unique: true` index, abandoned rooms permanently tie up 6-character room codes.
* **Remediation**:
  Add a MongoDB TTL index (e.g. expire `createdAt` after 24 hours for `WAITING` rooms) or implement a periodic cleaner job (`cleanStaleRooms`).

---

### 1.3 Legacy Coding Sandbox Schema Remnants
* **Domain**: Schema Hygiene
* **Severity**: **Low**
* **Impacted Files**:
  * [`server/src/modules/user/user.model.ts`](file:///h:/Project/code-arena/server/src/modules/user/user.model.ts)
  * [`server/src/modules/room/room.model.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.model.ts)
  * [`server/src/modules/battle/battle.model.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.model.ts)
* **Problem**:
  * `UserModel` retains `preferredLanguage: { default: 'javascript' }` from the retired coding sandbox platform.
  * `UserModel` retains `clerkId: { sparse: true, unique: true }` despite full native JWT migration.
  * `RoomSettingsSchema` retains `duration: { type: Number, default: 30 } // in minutes`.
  * `BattleSchema` retains `questionCount: { default: 5 }`, whereas quiz lengths are strictly 10, 15, or 20.
* **Remediation**:
  Deprecate and clean unused fields from Mongoose schemas to avoid confusion and wasted storage.

---

### 1.4 Next.js 16 Deprecated `middleware.ts` Convention
* **Domain**: Build & Framework Compatibility
* **Severity**: **Low**
* **Impacted Files**:
  * [`client/middleware.ts`](file:///h:/Project/code-arena/client/middleware.ts)
* **Problem**:
  During `next build`, Next.js 16 emits:
  ```
  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  ```
* **Remediation**:
  Migrate `client/middleware.ts` to `client/proxy.ts` (or follow Next.js 16 proxy documentation) to ensure long-term framework compatibility.

---

### 1.5 Dead Clerk Secrets in Environment Files
* **Domain**: Configuration Hygiene
* **Severity**: **Low**
* **Impacted Files**:
  * [`server/.env`](file:///h:/Project/code-arena/server/.env)
  * [`client/.env`](file:///h:/Project/code-arena/client/.env)
  * [`client/.env.local`](file:///h:/Project/code-arena/client/.env.local)
* **Problem**:
  The environment files still contain `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_CLERK_*` variables despite Clerk dependencies being uninstalled.
* **Remediation**:
  Remove legacy Clerk keys from all `.env` files.

---

## 2. Consolidated Priority & Action Matrix

| Item # | Issue Summary | Category | Severity | Status |
| :---: | :--- | :--- | :---: | :---: |
| **1.1** | In-memory battle rounds & timers (zero fault tolerance) | Backend Architecture | **High** | Open |
| **1.2** | Missing stale room & abandoned battle cleanup (TTL) | Database | **Medium** | Open |
| **1.3** | Legacy coding sandbox schema fields in MongoDB models | Schema Hygiene | **Low** | Open |
| **1.4** | Next.js 16 deprecated `middleware.ts` warning | Build Hygiene | **Low** | Open |
| **1.5** | Dead Clerk keys in `.env` files | Config Hygiene | **Low** | Open |

---

## 3. Recently Resolved Changelog

| Component | Resolution Description | Date |
| :--- | :--- | :---: |
| **Navbar.tsx** | Fixed React SSR hydration mismatch by introducing a `mounted` state guard around localStorage user checks. | Oct 2026 |
| **Socket.IO Client & Server** | Fixed `xhr poll error` by switching to WebSocket-first transport (`transports: ["websocket", "polling"]`), adding `withCredentials: true`, and aligning server Socket CORS credentials. | Oct 2026 |
| **Room Code Generator** | Replaced unconstrained generation loop with bounded 10-attempt `generateUniqueRoomCode` utilizing `RoomModel.exists()` without populates. | Oct 2026 |
| **Dashboard Modals** | Purged dead legacy dark dashboard modals (`BattleForm`, `CreateBattleModal`, `JoinBattleModal`). | Oct 2026 |
| **Room PIN Input** | Enforced strict 6-character alphanumeric PIN validation with visual feedback in `Navbar.tsx`. | Oct 2026 |
