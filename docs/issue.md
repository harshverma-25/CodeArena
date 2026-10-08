# Comprehensive Project Audit & Issue Register

**Document Version**: 2.0.0  
**Updated**: October 2026  
**Scope**: Frontend Client (`client/`), Backend Service (`server/`), UI/UX Design System, Database Schemas, Real-Time Architecture, and Configuration.

---

## Executive Summary

This document registers the remaining open issues, edge cases, architectural bottlenecks, and technical debt across the Quizzy codebase. All items from **Section 1 (UI / UX Design & Styling)** and **Section 2 (Frontend Logic, Authentication & State Management)** have been resolved.

### Remaining Active Domains:
1. [Modal & Feature Parity Gaps](#1-modal--feature-parity-gaps)
2. [Backend Architecture, Database & Real-Time Engine](#2-backend-architecture-database--real-time-engine)
3. [Configuration, Deprecations & Build Hygiene](#3-configuration-deprecations--build-hygiene)
4. [Consolidated Priority & Action Matrix](#4-consolidated-priority--action-matrix)

---

## 1. Modal & Feature Parity Gaps

### 1.1 `BattleForm` on Dashboard Lacks Category & Subject Hierarchy
* **Severity**: **High** (Feature Inconsistency)
* **Impacted Files**:
  * [`client/features/battle/components/BattleForm.tsx`](file:///h:/Project/code-arena/client/features/battle/components/BattleForm.tsx)
  * [`client/features/dashboard/components/CreateBattleModal.tsx`](file:///h:/Project/code-arena/client/features/dashboard/components/CreateBattleModal.tsx)
* **Problem**:
  When creating a quiz room from the Dashboard via `CreateBattleModal`, the modal renders `BattleForm.tsx`. `BattleForm.tsx` still uses hardcoded legacy topics (`DSA`, `DBMS`, `JavaScript`, `OS`, `CN`, `OOP`, `Java`, `CPP`, `SQL`) and has **zero options** for the Category/Subject system (`Aptitude`, `General Knowledge`, `Programming`), nor does it support Mixed Category mode. Users can only choose dynamic Categories from the public homepage, creating a split feature experience.
* **Remediation**:
  Refactor `BattleForm.tsx` to fetch active categories and subjects dynamically via `/categories`, matching the landing page engine.

---

### 1.2 Inconsistent Room Code Validation Constraints
* **Severity**: Medium (Input Validation)
* **Impacted Files**:
  * [`client/features/dashboard/components/JoinBattleModal.tsx`](file:///h:/Project/code-arena/client/features/dashboard/components/JoinBattleModal.tsx)
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx)
* **Problem**:
  `JoinBattleModal.tsx` validates room codes between **4 and 8 characters**:
  ```ts
  if (trimmedCode.length < 4 || trimmedCode.length > 8)
  ```
  However, the backend engine exclusively generates 6-character uppercase alphanumeric room codes (`generateRoomCode()`), and the homepage enforces `maxLength={6}`. Allowing 4, 5, 7, or 8 characters confuses users.
* **Remediation**:
  Enforce exact 6-character validation (`length !== 6`) in `JoinBattleModal.tsx`.

---

## 2. Backend Architecture, Database & Real-Time Engine

### 2.1 In-Memory Battle Rounds & Timers (Zero Fault Tolerance)
* **Severity**: **High** (Architectural Scalability & Resilience)
* **Impacted Files**:
  * [`server/src/modules/battle/battle.service.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts)
* **Problem**:
  Active battle round states (`activeRounds`) and countdown timeouts (`activeTimers`) are stored solely in Node.js process memory via `Map`.
  * If the server restarts, crashes, or is deployed behind a multi-container load balancer, all in-flight battle rounds and timer handles are immediately lost.
  * Active battles remain stuck in MongoDB with `status: "IN_PROGRESS"` indefinitely.
* **Remediation**:
  Persist active round timestamps in the database or Redis, and introduce Redis-backed distributed pub/sub timers for multi-node deployments.

---

### 2.2 Absence of Stale Room / Abandoned Battle Garbage Collection
* **Severity**: Medium (Database Growth & Code Space Pollution)
* **Impacted Files**:
  * [`server/src/modules/room/room.model.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.model.ts)
  * [`server/src/modules/battle/battle.model.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.model.ts)
* **Problem**:
  Rooms that are abandoned by hosts (e.g. host closes tab while in `WAITING` status) and battles that never finish remain in the MongoDB collection forever. Because `roomCode` has a `unique: true` index, abandoned rooms permanently tie up 6-character room codes.
* **Remediation**:
  Add a MongoDB TTL index (e.g. expire `createdAt` after 24 hours for `WAITING` rooms) or implement a lightweight periodic cleaner function (`cleanStaleRooms`).

---

### 2.3 Room Code Generation Loop Performs Expensive Populates
* **Severity**: Medium (Performance Bottleneck)
* **Impacted Files**:
  * [`server/src/modules/room/room.service.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.service.ts)
  * [`server/src/modules/room/room.repository.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.repository.ts)
* **Problem**:
  When creating a room, `RoomService` loops:
  ```ts
  while (!isUnique) {
    roomCode = this.generateRoomCode();
    const existingRoom = await roomRepository.findByRoomCode(roomCode);
    if (!existingRoom) isUnique = true;
  }
  ```
  `findByRoomCode` executes `.populate('hostId').populate('players.userId')`. Executing full population queries inside an unconstrained generation loop creates unnecessary database overhead. Moreover, there is no maximum iteration guard.
* **Remediation**:
  Use `RoomModel.exists({ roomCode })` with an iteration cap (e.g., max 10 attempts) instead of full record retrieval with populated references.

---

### 2.4 Legacy Coding Sandbox Schema Remnants
* **Severity**: Low (Schema Hygiene)
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

## 3. Configuration, Deprecations & Build Hygiene

### 3.1 Next.js 16 Deprecated `middleware.ts` Convention
* **Severity**: Low (Deprecation Warning)
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

### 3.2 Dead Clerk Secrets in Environment Files
* **Severity**: Low (Config Cleanliness)
* **Impacted Files**:
  * [`server/.env`](file:///h:/Project/code-arena/server/.env)
  * [`client/.env`](file:///h:/Project/code-arena/client/.env)
  * [`client/.env.local`](file:///h:/Project/code-arena/client/.env.local)
* **Problem**:
  The environment files still contain `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_CLERK_*` variables despite Clerk dependencies being uninstalled.
* **Remediation**:
  Remove legacy Clerk keys from all `.env` files.

---

## 4. Consolidated Priority & Action Matrix

| Item # | Issue Summary | Category | Severity | Status |
| :---: | :--- | :--- | :---: | :---: |
| **1.1** | `BattleForm` on Dashboard missing Category/Subject hierarchy | Feature Parity | **High** | Open |
| **2.1** | In-memory battle rounds & timers (zero fault tolerance) | Backend Architecture | **High** | Open |
| **1.2** | Inconsistent room code length validation (4-8 vs 6) | Validation | **Medium** | Open |
| **2.2** | Missing stale room & abandoned battle cleanup (TTL) | Database | **Medium** | Open |
| **2.3** | `createRoom` generation loop performs redundant populates | Database / Performance | **Medium** | Open |
| **2.4** | Legacy coding sandbox schema fields in MongoDB models | Schema Hygiene | **Low** | Open |
| **3.1** | Next.js 16 deprecated `middleware.ts` warning | Build Hygiene | **Low** | Open |
| **3.2** | Dead Clerk keys in `.env` files | Config Hygiene | **Low** | Open |
