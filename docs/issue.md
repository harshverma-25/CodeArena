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

### 1.1 Brand Identity Fracture ("QUIZLY" vs "CodeArena")
* **Severity**: High (Brand Inconsistency)
* **Impacted Files**:
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L396) — Uses **"QUIZLY"**
  * [`client/app/(protected)/lobby/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/lobby/[roomCode]/page.tsx#L450) — Uses **"QUIZLY"**
  * [`client/app/(protected)/battle/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/battle/[roomCode]/page.tsx#L149) — Uses **"QUIZLY"**
  * [`client/components/shared/Navbar.tsx`](file:///h:/Project/code-arena/client/components/shared/Navbar.tsx#L76) — Uses **"CodeArena"**
  * [`client/app/(public)/login/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/login/page.tsx#L205) — Uses **"CodeArena"**
  * [`client/app/(public)/register/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/register/page.tsx#L108) — Uses **"CodeArena"**
  * [`client/app/(match)/results/[matchId]/page.tsx`](file:///h:/Project/code-arena/client/app/(match)/results/[matchId]/page.tsx#L240) — Uses **"CodeArena"**
* **Problem**:
  The application switches between two completely different brand names depending on which page the user is viewing. A visitor lands on "QUIZLY", logs in to "CodeArena", enters a "QUIZLY" waiting room, battles in "QUIZLY", and finishes on a "CodeArena" results page.
* **Remediation**:
  Unify the platform under a single chosen brand name (or sub-brand e.g., "CodeArena Quizly") consistently across headers, logos, document titles, footers, and modal titles.

---

### 1.2 Dual-Theme Visual Fracture (Light Stitch vs Dark Mode)
* **Severity**: High (Visual Cohesion)
* **Impacted Files**:
  * [`client/app/globals.css`](file:///h:/Project/code-arena/client/app/globals.css#L96-L105) (`:root` defined as Dark Mode `--background: #111111`)
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L383) (Light Stitch theme `bg-surface` / `#fff8f0`)
  * [`client/app/(protected)/battle/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/battle/[roomCode]/page.tsx#L142) (Light Stitch theme `bg-[#fff8f0]`)
  * [`client/app/(protected)/dashboard/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/dashboard/page.tsx#L8) (Dark Mode `bg-background` / `text-muted-foreground`)
  * [`client/components/shared/Navbar.tsx`](file:///h:/Project/code-arena/client/components/shared/Navbar.tsx#L67) (Dark Mode `bg-background` / border-border)
* **Problem**:
  The app lacks a unified theme provider. The Landing, Lobby, Battle, and Results screens use custom light cream/beige colors (`#fff8f0`, `#f3ede4`, `#317a63`), while the Dashboard, Leaderboard, History, Profile, Login, and Register screens inherit a pitch-black dark theme (`#111111`). Navigating between pages creates an uncomfortable flash of contrast.
* **Remediation**:
  Standardize on one primary design language (preferably the warm Stitch aesthetic or an intentional, toggleable Dark/Light Theme with NextThemes).

---

### 1.3 External Hotlinked Image Dependency
* **Severity**: Medium (Reliability & Offline Support)
* **Impacted Files**:
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L393)
  * [`client/app/(protected)/lobby/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/lobby/[roomCode]/page.tsx#L446)
* **Problem**:
  The logo `src` points to a temporary/external Google CDN link (`https://lh3.googleusercontent.com/aida-public/...`). If this asset is rotated, deleted, or blocked by firewalls/adblockers, the brand logo appears as a broken image icon.
* **Remediation**:
  Download the SVG/PNG asset directly into `client/public/images/logo.png` (or SVG) and reference it locally via Next.js `<Image />`.

---

### 1.4 Non-Functional "Ghost" Header Buttons
* **Severity**: Low / Medium (User Experience)
* **Impacted Files**:
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L437-L453)
* **Problem**:
  The public homepage header features a Search button (`search`) and a Notification bell with an active badge (`notifications`), but neither has an `onClick` handler, state, modal, or input trigger. They click without any visual or functional feedback.
* **Remediation**:
  Either attach a functional search filter overlay / notification center, or remove these placeholder icons until Phase 3.

---

### 1.5 Ephemeral Bookmark Feature
* **Severity**: Low (Functional Polish)
* **Impacted Files**:
  * [`client/app/(public)/page.tsx`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L222-L227), [`L850-L865`](file:///h:/Project/code-arena/client/app/(public)/page.tsx#L850-L865)
* **Problem**:
  The bookmark icon on quiz cards toggles local component state `bookmarkedIds`. It does not persist to `localStorage` or the backend user profile. Refreshing the page wipes all bookmarks, and there is no "Bookmarked Quizzes" tab to view saved cards.
* **Remediation**:
  Persist bookmark selections to `localStorage` (for guests) or User profile metadata (for registered users) and add a "Saved" filter tab.

---

### 1.6 Cosmetic Audio Toggle
* **Severity**: Low (Polish)
* **Impacted Files**:
  * [`client/app/(protected)/battle/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/battle/[roomCode]/page.tsx#L178-L189)
* **Problem**:
  A sound toggle (`Volume2` / `VolumeX`) exists in the battle header, toggling `soundEnabled`. However, there are no audio files, Web Audio synthesis, or sound effects implemented anywhere in the quiz flow.
* **Remediation**:
  Integrate subtle countdown tick and answer result chimes via lightweight Web Audio synth, or omit the toggle until audio assets are integrated.

---

### 1.7 Dual Icon System Overhead
* **Severity**: Low (Bundle Size & Visual Consistency)
* **Impacted Files**:
  * [`client/app/layout.tsx`](file:///h:/Project/code-arena/client/app/layout.tsx#L42-L45)
  * Various component pages using both `lucide-react` and Google Material Symbols Outlined.
* **Problem**:
  The client imports `lucide-react` while also loading Google Material Symbols font via a CDN `<link>`. This creates two competing icon visual weights and adds extra network font requests.
* **Remediation**:
  Standardize on one icon library (e.g. `lucide-react`) across all components.

---

### 1.8 Browser-Native `window.confirm` Modal
* **Severity**: Low (UX Consistency)
* **Impacted Files**:
  * [`client/app/(protected)/battle/[roomCode]/page.tsx`](file:///h:/Project/code-arena/client/app/(protected)/battle/[roomCode]/page.tsx#L194)
* **Problem**:
  Leaving an active quiz triggers a standard browser `window.confirm(...)` alert dialog, which freezes UI rendering and clashes with the application design.
* **Remediation**:
  Replace `window.confirm` with an in-app confirmation modal or dialog.

---

## 2. Frontend Logic, Authentication & State Management

### 2.1 Silent 401 Refresh Token Failure in `useApiClient`
* **Severity**: **Critical** (Authentication Reliability)
* **Impacted Files**:
  * [`client/lib/api.ts`](file:///h:/Project/code-arena/client/lib/api.ts#L34-L38)
  * [`client/hooks/useApiClient.ts`](file:///h:/Project/code-arena/client/hooks/useApiClient.ts#L36)
* **Problem**:
  In `useApiClient.ts`, automatic token refresh checks:
  ```ts
  if (err?.statusCode === 401 && getAccessToken())
  ```
  However, in `client/lib/api.ts`, errors are thrown as standard JS `Error` objects:
  ```ts
  throw new Error(errorData.message || `API request failed with status ${response.status}`);
  ```
  Standard `Error` instances **do not have** a `.statusCode` property. Thus `err?.statusCode` is always `undefined`, and the automatic 401 token refresh **never executes**. When an access token expires after 15 minutes, API calls fail indefinitely until the user manually logs in again.
* **Remediation**:
  Update `client/lib/api.ts` to attach `statusCode = response.status` to the error instance before throwing, or create an `ApiError` class in the client.

---

### 2.2 Access Token Cookie `max-age` Mismatch
* **Severity**: High (Session Security)
* **Impacted Files**:
  * [`client/features/auth/nativeAuth.ts`](file:///h:/Project/code-arena/client/features/auth/nativeAuth.ts#L29)
* **Problem**:
  In `setNativeSession`:
  ```ts
  document.cookie = `${NATIVE_COOKIE_NAME}=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
  ```
  The cookie is set with `max-age=604800` (7 days), but the access token JWT has an expiration of only 15 minutes (`900s`). Next.js middleware relies on `req.cookies.has("codearena_access_token")` to grant route access, so the client route guard thinks the session is valid for 7 days even though the token is invalid on the server.
* **Remediation**:
  Align cookie `max-age` with the 15-minute access token lifespan, or manage route authentication via a distinct session flag cookie that tracks the 7-day refresh token.

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

| Item # | Issue Summary | Category | Severity | Recommended Fix Phase |
| :---: | :--- | :--- | :---: | :---: |
| **2.1** | Silent 401 token refresh failure in `useApiClient` | Frontend / Auth | **Critical** | Phase 1 (Immediate) |
| **1.1** | Dual brand identity fracture ("QUIZLY" vs "CodeArena") | UI / UX | **High** | Phase 1 |
| **1.2** | Dual-theme visual fracture (Light Stitch vs Dark Mode) | UI / UX | **High** | Phase 1 |
| **3.1** | `BattleForm` on Dashboard missing Category/Subject hierarchy | Feature Parity | **High** | Phase 1 |
| **4.1** | In-memory battle rounds & timers (zero fault tolerance) | Backend Architecture | **High** | Phase 2 |
| **2.2** | Access token cookie `max-age` set to 7 days instead of 15m | Frontend / Auth | **Medium** | Phase 1 |
| **1.3** | External hotlinked Google CDN logo dependency | UI / Assets | **Medium** | Phase 1 |
| **3.2** | Inconsistent room code length validation (4-8 vs 6) | Validation | **Medium** | Phase 1 |
| **4.2** | Missing stale room & abandoned battle cleanup (TTL) | Database | **Medium** | Phase 2 |
| **4.3** | `createRoom` generation loop performs redundant populates | Database / Performance | **Medium** | Phase 2 |
| **2.3** | Socket reconnection failure unhandled in UI | Realtime UX | **Medium** | Phase 2 |
| **1.4** | Dead search & notification buttons in homepage header | UI / UX | **Low** | Phase 2 |
| **1.5** | Bookmark state is in-memory only (wiped on reload) | UI / UX | **Low** | Phase 2 |
| **1.6** | Cosmetic audio toggle in battle header (no sound engine) | Polish | **Low** | Phase 2 |
| **1.7** | Dual icon libraries (Material Symbols + Lucide) | Bundle / Styling | **Low** | Phase 2 |
| **1.8** | Native `window.confirm` modal when leaving live quiz | Polish | **Low** | Phase 2 |
| **2.4** | Dead state in Zustand `uiStore` (`sidebarOpen`, `inviteModalOpen`)| Code Hygiene | **Low** | Phase 2 |
| **2.5** | Casing mismatch in `battleStore.difficulty` (uppercase) | Type Consistency | **Low** | Phase 2 |
| **4.4** | Legacy coding sandbox schema fields in MongoDB models | Schema Hygiene | **Low** | Phase 3 |
| **5.1** | Next.js 16 deprecated `middleware.ts` warning | Build Hygiene | **Low** | Phase 3 |
| **5.2** | Dead Clerk keys in `.env` files | Config Hygiene | **Low** | Phase 3 |
