# Comprehensive Project Audit & Issue Register

**Document Version**: 1.0.0  
**Generated**: October 2026  
**Scope**: Frontend Client (`client/`), Backend Service (`server/`), UI/UX Design System, Database Schemas, Real-Time Architecture, and Configuration.

---

## Executive Summary

This document registers all detected issues, edge cases, visual discrepancies, architectural bottlenecks, dead code, and technical debt across the CodeArena / Quizly codebase.

Items are grouped into 5 core domains:
1. [UI / UX Design & Styling Discrepancies](#1-ui--ux-design--styling-discrepancies)
2. [Frontend Logic, Authentication & State Management](#2-frontend-logic-authentication--state-management)
3. [Modal & Feature Parity Gaps](#3-modal--feature-parity-gaps)
4. [Backend Architecture, Database & Real-Time Engine](#4-backend-architecture-database--real-time-engine)
5. [Configuration, Deprecations & Build Hygiene](#5-configuration-deprecations--build-hygiene)

---

## 1. UI / UX Design & Styling Discrepancies

### 1.1 Brand Identity Fracture ("QUIZLY" vs "CodeArena") — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Unified the entire platform under the brand name **Quizzy** across all headers, footers, auth pages, battle engine, lobby, modals, and metadata.

---

### 1.2 Dual-Theme Visual Fracture (Light Stitch vs Dark Mode) — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Standardized the entire project on the warm light Stitch design theme (`#fff8f0` surface, `#f3ede4` containers, `#317a63` green primary, `#1d1b16` text). Completely retired `/dashboard` and the pitch-black dark theme.

---

### 1.3 External Hotlinked Image Dependency — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Replaced temporary Google CDN hotlinks with local high-resolution Quizzy logo assets at `/images/quizzy-logo.png` and `/logo.png`.

---

### 1.4 Non-Functional "Ghost" Header Buttons & Navbar Fragmentation — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Unified navigation into a single shared `<Navbar />` across all public and protected pages. Removed the ghost notification bell. Implemented image-only Quizzy logo (no redundant text), navigation pill container (`Leaderboard`, `History`, `Profile`), PIN Join Room interface, real-time synchronized Search, and interactive Profile dropdown menu.

---

### 1.5 Ephemeral Bookmark Feature — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Completely removed unpersisted ephemeral bookmark state and buttons from quiz cards.

---

### 1.6 Cosmetic Audio Toggle — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Completely removed the non-functional sound toggle button from the battle header.

---

### 1.7 Dual Icon System Overhead — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Standardized exclusively on `lucide-react`. Removed the Google Material Symbols CDN `<link>` and font stylesheets, replacing every `<span className="material-symbols-outlined">...</span>` across all pages.

---

### 1.8 Browser-Native `window.confirm` Modal — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Replaced browser `window.confirm` in the battle engine with an in-app custom styled Quizzy Leave Confirmation Modal matching the warm Stitch design language.

---

## 2. Frontend Logic, Authentication & State Management

### 2.1 Silent 401 Refresh Token Failure in `useApiClient` — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Implemented custom `ApiError` class in `client/lib/api.ts` attaching `statusCode = response.status` to failed fetch responses. Automatic 401 token refresh in `useApiClient.ts` now triggers reliably on token expiration.

---

### 2.2 Access Token Cookie `max-age` Mismatch — [RESOLVED]
* **Status**: **RESOLVED**
* **Resolution**: Aligned `NATIVE_COOKIE_NAME` cookie `max-age` in `client/features/auth/nativeAuth.ts` with the 15-minute (`900s`) access token lifespan `NATIVE_ACCESS_TOKEN_MAX_AGE`.

---

### 2.3 Socket Reconnection Failure Unhandled in UI
* **Severity**: Medium (Fault Tolerance)
* **Impacted Files**:
  * [`client/lib/socket.ts`](file:///h:/Project/code-arena/client/lib/socket.ts#L25)
  * [`client/features/battle/hooks/useLiveBattle.ts`](file:///h:/Project/code-arena/client/features/battle/hooks/useLiveBattle.ts#L70)
* **Problem**:
  `SocketManager` sets `reconnectionAttempts: 5`. When all 5 attempts fail (e.g. temporary network drop), Socket.IO fires `reconnect_failed`. The manager does not propagate this event or update `useLiveBattle`, leaving the user staring at an unresponsive in-progress quiz without a "Connection Lost" prompt or reconnect button.
* **Remediation**:
  Listen for `reconnect_failed` in `SocketManager` and update `status` to `"error"` with a clear "Disconnected — Reconnect" UI action.

---

### 2.4 Dead State in Zustand UI Store
* **Severity**: Low (Code Hygiene)
* **Impacted Files**:
  * [`client/store/uiStore.ts`](file:///h:/Project/code-arena/client/store/uiStore.ts#L4-L7)
* **Problem**:
  `uiStore.ts` declares and manages `sidebarOpen`, `inviteModalOpen`, and `activeRoomCode`, but there is neither a Sidebar nor an InviteModal component anywhere in the application.
* **Remediation**:
  Prune unused states from `uiStore.ts` to keep Zustand stores lean and maintainable.

---

### 2.5 Difficulty Casing Discrepancy in `battleStore`
* **Severity**: Low (Type Consistency)
* **Impacted Files**:
  * [`client/store/battleStore.ts`](file:///h:/Project/code-arena/client/store/battleStore.ts#L25)
* **Problem**:
  `battleStore.ts` defines difficulty as `"EASY" | "MEDIUM" | "HARD" | null` (uppercase), whereas the backend and all modern types strictly use lowercase `"easy" | "medium" | "hard" | "random"`.
* **Remediation**:
  Update `BattleState.difficulty` type in `battleStore.ts` to match the canonical lowercase schema.

---

## 3. Modal & Feature Parity Gaps

### 3.1 `BattleForm` on Dashboard Lacks Category & Subject Hierarchy
* **Severity**: **High** (Feature Inconsistency)
* **Impacted Files**:
  * [`client/features/battle/components/BattleForm.tsx`](file:///h:/Project/code-arena/client/features/battle/components/BattleForm.tsx#L9-L50)
  * [`client/features/dashboard/components/CreateBattleModal.tsx`](file:///h:/Project/code-arena/client/features/dashboard/components/CreateBattleModal.tsx#L61)
* **Problem**:
  When creating a quiz room from the Dashboard via `CreateBattleModal`, the modal renders `BattleForm.tsx`. `BattleForm.tsx` still uses hardcoded legacy topics (`DSA`, `DBMS`, `JavaScript`, `OS`, `CN`, `OOP`, `Java`, `CPP`, `SQL`) and has **zero options** for the Category/Subject system (`Aptitude`, `General Knowledge`, `Programming`), nor does it support Mixed Category mode!
  Users can only choose dynamic Categories from the public homepage, creating a split feature experience.
* **Remediation**:
  Refactor `BattleForm.tsx` to fetch active categories and subjects dynamically via `/categories`, matching the landing page engine.

---

### 3.2 Inconsistent Room Code Validation Constraints
* **Severity**: Medium (Input Validation)
* **Impacted Files**:
  * [`client/features/dashboard/components/JoinBattleModal.tsx`](file:///h:/Project/code-arena/client/features/dashboard/components/JoinBattleModal.tsx#L33)
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L416)
* **Problem**:
  `JoinBattleModal.tsx` validates room codes between **4 and 8 characters**:
  ```ts
  if (trimmedCode.length < 4 || trimmedCode.length > 8)
  ```
  However, the backend engine exclusively generates 6-character uppercase alphanumeric room codes (`generateRoomCode()`), and the homepage enforces `maxLength={6}`. Allowing 4, 5, 7, or 8 characters confuses users.
* **Remediation**:
  Enforce exact 6-character validation (`length !== 6`) in `JoinBattleModal.tsx`.

---

## 4. Backend Architecture, Database & Real-Time Engine

### 4.1 In-Memory Battle Rounds & Timers (Zero Fault Tolerance)
* **Severity**: **High** (Architectural Scalability & Resilience)
* **Impacted Files**:
  * [`server/src/modules/battle/battle.service.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.service.ts#L44-L45)
* **Problem**:
  Active battle round states (`activeRounds`) and countdown timeouts (`activeTimers`) are stored solely in Node.js process memory via `Map`.
  * If the server restarts, crashes, or is deployed behind a multi-container load balancer, all in-flight battle rounds and timer handles are immediately lost.
  * Active battles remain stuck in MongoDB with `status: "IN_PROGRESS"` indefinitely.
* **Remediation**:
  Persist active round timestamps in the database or Redis, and introduce Redis-backed distributed pub/sub timers for multi-node deployments.

---

### 4.2 Absence of Stale Room / Abandoned Battle Garbage Collection
* **Severity**: Medium (Database Growth & Code Space Pollution)
* **Impacted Files**:
  * [`server/src/modules/room/room.model.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.model.ts#L31-L49)
  * [`server/src/modules/battle/battle.model.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.model.ts#L28-L52)
* **Problem**:
  Rooms that are abandoned by hosts (e.g. host closes tab while in `WAITING` status) and battles that never finish remain in the MongoDB collection forever.
  Because `roomCode` has a `unique: true` index, abandoned rooms permanently tie up 6-character room codes.
* **Remediation**:
  Add a MongoDB TTL index (e.g. expire `createdAt` after 24 hours for `WAITING` rooms) or implement a lightweight periodic cleaner function (`cleanStaleRooms`).

---

### 4.3 Room Code Generation Loop Performs Expensive Populates
* **Severity**: Medium (Performance Bottleneck)
* **Impacted Files**:
  * [`server/src/modules/room/room.service.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.service.ts#L126-L130)
  * [`server/src/modules/room/room.repository.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.repository.ts#L12)
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

### 4.4 Legacy Coding Sandbox Schema Remnants
* **Severity**: Low (Schema Hygiene)
* **Impacted Files**:
  * [`server/src/modules/user/user.model.ts`](file:///h:/Project/code-arena/server/src/modules/user/user.model.ts#L6), [`L20`](file:///h:/Project/code-arena/server/src/modules/user/user.model.ts#L20)
  * [`server/src/modules/room/room.model.ts`](file:///h:/Project/code-arena/server/src/modules/room/room.model.ts#L24)
  * [`server/src/modules/battle/battle.model.ts`](file:///h:/Project/code-arena/server/src/modules/battle/battle.model.ts#L34)
* **Problem**:
  * `UserModel` retains `preferredLanguage: { default: 'javascript' }` from the retired coding sandbox platform.
  * `UserModel` retains `clerkId: { sparse: true, unique: true }` despite full native JWT migration.
  * `RoomSettingsSchema` retains `duration: { type: Number, default: 30 } // in minutes`.
  * `BattleSchema` retains `questionCount: { default: 5 }`, whereas quiz lengths are strictly 10, 15, or 20.
* **Remediation**:
  Deprecate and clean unused fields from Mongoose schemas to avoid confusion and wasted storage.

---

## 5. Configuration, Deprecations & Build Hygiene

### 5.1 Next.js 16 Deprecated `middleware.ts` Convention
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

### 5.2 Dead Clerk Secrets in Environment Files
* **Severity**: Low (Config Cleanliness)
* **Impacted Files**:
  * [`server/.env`](file:///h:/Project/code-arena/server/.env#L6-L7)
  * [`client/.env`](file:///h:/Project/code-arena/client/.env#L1-L2), [`L7-L8`](file:///h:/Project/code-arena/client/.env#L7-L8)
  * [`client/.env.local`](file:///h:/Project/code-arena/client/.env.local#L1-L2), [`L7-L8`](file:///h:/Project/code-arena/client/.env.local#L7-L8)
* **Problem**:
  The environment files still contain `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_CLERK_*` variables despite Clerk dependencies being uninstalled.
* **Remediation**:
  Remove legacy Clerk keys from all `.env` files.

---

## 6. Consolidated Priority & Action Matrix

| Item # | Issue Summary | Category | Severity | Status |
| :---: | :--- | :--- | :---: | :---: |
| **2.1** | Silent 401 token refresh failure in `useApiClient` | Frontend / Auth | **Critical** | **RESOLVED** ✅ |
| **1.1** | Dual brand identity fracture ("QUIZLY" vs "CodeArena") | UI / UX | **High** | **RESOLVED** ✅ |
| **1.2** | Dual-theme visual fracture (Light Stitch vs Dark Mode) | UI / UX | **High** | **RESOLVED** ✅ |
| **3.1** | `BattleForm` on Dashboard missing Category/Subject hierarchy | Feature Parity | **High** | Pending (Phase 1) |
| **4.1** | In-memory battle rounds & timers (zero fault tolerance) | Backend Architecture | **High** | Pending (Phase 2) |
| **2.2** | Access token cookie `max-age` set to 7 days instead of 15m | Frontend / Auth | **Medium** | **RESOLVED** ✅ |
| **1.3** | External hotlinked Google CDN logo dependency | UI / Assets | **Medium** | **RESOLVED** ✅ |
| **3.2** | Inconsistent room code length validation (4-8 vs 6) | Validation | **Medium** | Pending (Phase 1) |
| **4.2** | Missing stale room & abandoned battle cleanup (TTL) | Database | **Medium** | Pending (Phase 2) |
| **4.3** | `createRoom` generation loop performs redundant populates | Database / Performance | **Medium** | Pending (Phase 2) |
| **2.3** | Socket reconnection failure unhandled in UI | Realtime UX | **Medium** | Pending (Phase 2) |
| **1.4** | Dead search & notification buttons in homepage header | UI / UX | **Low** | **RESOLVED** ✅ |
| **1.5** | Bookmark state is in-memory only (wiped on reload) | UI / UX | **Low** | **RESOLVED** ✅ |
| **1.6** | Cosmetic audio toggle in battle header (no sound engine) | Polish | **Low** | **RESOLVED** ✅ |
| **1.7** | Dual icon libraries (Material Symbols + Lucide) | Bundle / Styling | **Low** | **RESOLVED** ✅ |
| **1.8** | Native `window.confirm` modal when leaving live quiz | Polish | **Low** | **RESOLVED** ✅ |
| **2.4** | Dead state in Zustand `uiStore` (`sidebarOpen`, `inviteModalOpen`)| Code Hygiene | **Low** | Pending (Phase 2) |
| **2.5** | Casing mismatch in `battleStore.difficulty` (uppercase) | Type Consistency | **Low** | Pending (Phase 2) |
| **4.4** | Legacy coding sandbox schema fields in MongoDB models | Schema Hygiene | **Low** | Pending (Phase 3) |
| **5.1** | Next.js 16 deprecated `middleware.ts` warning | Build Hygiene | **Low** | Pending (Phase 3) |
| **5.2** | Dead Clerk keys in `.env` files | Config Hygiene | **Low** | Pending (Phase 3) |
