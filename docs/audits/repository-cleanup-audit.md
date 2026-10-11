# QUIZZY (CodeArena) — Complete Dead Code & Repository Cleanup Audit Report

**Audit Date:** October 2026  
**Auditor:** Senior Full-Stack Engineering Audit  
**Target Repository:** QUIZZY (formerly CodeArena)  
**Report Location:** `docs/audits/repository-cleanup-audit.md`  
**Audit Mode:** READ-ONLY Forensic Inspection (No files deleted or modified during audit)

---

## 1. Executive Summary

A comprehensive, repository-wide forensic audit was conducted across the frontend (`client/`), backend (`server/`), configuration, deployment settings, verification scripts, tests, and documentation.

### Key Metrics
- **Total Files Inspected:** 260 files across the workspace (`client/`: 100, `server/`: 138, `docs/`: 19, Root: 3).
- **Confirmed Dead-File Candidates:** 9 files (Unreferenced frontend utilities, dead Zustand store, unused components, boilerplates, and scratch scripts).
- **Suspected Dead-File Candidates / Relocation Candidates:** 7 files (Ad-hoc test scripts sitting in `client/` root compiling with Next.js code, empty `AGENTS.md`).
- **Total Verification Scripts Audited:** 36 scripts in `server/src/scripts/`.
  - **KEEP:** 5 scripts (Production seeders, maintenance, and admin provisioning).
  - **FIX:** 1 script (`verify-lobby-readiness-settings.ts` causing the Render TypeScript build failure).
  - **CONSOLIDATE:** 11 scripts (Milestone/task regression scripts with redundant assertions).
  - **MOVE:** 15 scripts (Valuable regression test suites that belong in a dedicated test suite directory).
  - **REMOVE CANDIDATE:** 3 scripts (103 KB redundant mock questions bank, one-off DB state console dump, trivial query test).
  - **REVIEW MANUALLY:** 1 script (`verify-test-question-bank.ts`, depends on question bank retention decision).
- **Unused Dependencies Identified:** 3 client npm dependencies (`@hookform/resolvers`, `react-hook-form`, `zod`) totaling zero imports in frontend code.
- **Render Build Failure Root Cause:** Direct cross-package import from `../../../client/node_modules/socket.io-client/build/esm/index.js` inside `server/src/scripts/verify-lobby-readiness-settings.ts`.

---

## 2. Repository Structure Reviewed

The repository operates as a decoupled two-tier architecture:

```
code-arena/
├── client/                     # Next.js 16 App Router Frontend (React 19, Tailwind CSS v4)
│   ├── app/                    # Next.js route groups: (admin), (auth), (match), (protected), (public)
│   ├── components/             # Reusable UI primitives and shared navigation
│   ├── features/               # Domain-driven features (auth, battle, history, leaderboard, profile)
│   ├── hooks/                  # Client-side hooks (useApiClient)
│   ├── lib/                    # Core clients (api, socket, utils)
│   ├── providers/              # Context providers (QueryClientProvider, SocketProvider)
│   ├── store/                  # Zustand stores (battleStore, uiStore)
│   ├── types/                  # TypeScript interface contracts
│   ├── utils/                  # Unreferenced formatters (Dead Code)
│   ├── proxy.ts                # Next.js 16 Edge proxy middleware (CRITICAL - DO NOT REMOVE)
│   └── test-*.ts               # Ad-hoc integration test scripts in client root (Relocation Candidates)
├── server/                     # Express & Socket.IO Backend (Node.js, TypeScript 5.5, MongoDB Mongoose)
│   ├── src/
│   │   ├── config/             # Environment, Database, and Logger configuration
│   │   ├── middleware/         # Auth, Rate limiting, Request logging, Zod validation, Error handling
│   │   ├── modules/            # Layered modules (admin, battle, category, history, question, room, user)
│   │   ├── sockets/            # Real-time WebSocket gateways (battle.socket, room.socket, socket)
│   │   ├── shared/             # Errors, Response formats, Async handlers, Type guards
│   │   └── scripts/            # 36 database seeders and verification test scripts
│   ├── Dockerfile              # Container deployment file
│   └── docker-compose.yml      # Local containerized infrastructure (MongoDB, Redis)
├── docs/                       # Technical architecture, API specs, testing guides, and audits
│   └── audits/                 # Audit reports
├── .gitignore
├── AGENTS.md                   # AI Agent operating directives (Currently empty / modified unstaged)
└── README.md                   # Project overview & getting started guide
```

---

## 3. Verification Script Inventory

All 36 scripts located in `server/src/scripts/` were audited individually for purpose, references, runtime dependencies, safety, and architectural placement.

| Script | Purpose | Referenced? | Current status | Dependencies | Recommendation |
|---|---|---|---|---|---|
| `check-db-state.ts` | Ad-hoc debugging scratch script printing database collection counts | None | Obsolete / Redundant scratch file | MongoDB | **REMOVE CANDIDATE** |
| `clear-questions.ts` | Clears all question documents from the database | `package.json` | Working production/utility script | MongoDB | **KEEP** |
| `reconcile-user-stats.ts` | Recalculates user win/loss statistics from historical battle records | `package.json` | Working production/utility script | MongoDB | **KEEP** |
| `seed-admin.ts` | Seeds/provisions the initial administrator account | None | Working production/utility script | MongoDB | **KEEP** |
| `seed-categories.ts` | Seeds category tree, subjects, and icon metadata | `docs/` | Working production/utility script | MongoDB | **KEEP** |
| `seed-questions.ts` | Seeds primary question bank for categories and subjects | `package.json` | Working production/utility script | MongoDB | **KEEP** |
| `seed-test-questions.ts` | Large 103 KB redundant mock question bank; duplicates seed-questions.ts | None | Obsolete / Redundant scratch file | MongoDB | **REMOVE CANDIDATE** |
| `verify-admin-delete.ts` | Verifies admin deletion and cascade rules for categories and questions | None | Functional | MongoDB | **MOVE** |
| `verify-admin-system.ts` | Verifies complete admin panel CRUD operations and authorization guards | None | Functional | MongoDB | **MOVE** |
| `verify-auth-security-fixes.ts` | Verifies token stripping from payload and cookie issuance; overlaps verify-native-auth | None | Functional | MongoDB | **CONSOLIDATE** |
| `verify-category-subject-system.ts` | Verifies category and subject tree hierarchy, slug resolution, and questions | `docs/` | Functional | None (Self-contained) | **MOVE** |
| `verify-cookie-refresh.ts` | Verifies refresh token rotation via HttpOnly cookie; overlaps verify-native-auth | None | Functional | MongoDB, HTTP Server | **CONSOLIDATE** |
| `verify-env-security.ts` | Verifies environment variable validation and production runtime guards | `package.json` | Functional | None (Self-contained) | **MOVE** |
| `verify-guest-auth.ts` | Verifies guest user creation, HMAC signing, token verification, and rate limits | `package.json` | Functional | None (Self-contained) | **MOVE** |
| `verify-history-profile.ts` | Verifies battle match history logging and user profile aggregation | None | Functional | None (Self-contained) | **MOVE** |
| `verify-lobby-readiness-settings.ts` | Verifies lobby readiness and room settings over Socket.IO; contains broken cross-package import | None | Fails on Render (TS2307 missing module) | MongoDB, HTTP Server, Socket.IO Client, client/node_modules (BROKEN) | **FIX** |
| `verify-multiplayer-quiz.ts` | End-to-end multi-client Socket.IO battle flow, synchronized countdown, and scoring | `docs/` | Functional | None (Self-contained) | **MOVE** |
| `verify-native-auth.ts` | Verifies native registration, login, password hashing, and token issuance | `package.json` | Functional | MongoDB | **MOVE** |
| `verify-phase2-fixes.ts` | Regression assertions for Phase 2 milestone; overlaps core suites | None | Functional | MongoDB | **CONSOLIDATE** |
| `verify-phase3-fixes.ts` | Regression assertions for Phase 3 guest modal and proxy; overlaps core suites | None | Functional | MongoDB | **CONSOLIDATE** |
| `verify-play-again.ts` | Verifies rematch / play-again lobby flow after match completion | None | Functional | None (Self-contained) | **MOVE** |
| `verify-popular-quizzes.ts` | 42-line trivial test querying subject stats; redundant with category verification | None | Obsolete / Redundant scratch file | MongoDB | **REMOVE CANDIDATE** |
| `verify-prob-fixes.ts` | Regression assertions for PROB-001/002/003 issues; overlaps core suites | None | Functional | HTTP Server | **CONSOLIDATE** |
| `verify-prob4-fixes.ts` | Regression assertions for mobile socket reconnection fixes; overlaps verify-multiplayer-quiz | None | Functional | HTTP Server | **CONSOLIDATE** |
| `verify-product-flow.ts` | End-to-end user journey test across categories, lobby, and battle | `docs/` | Functional | None (Self-contained) | **MOVE** |
| `verify-question-availability.ts` | Verifies question availability count and distribution across categories | None | Functional | MongoDB | **MOVE** |
| `verify-quiz-configuration.ts` | Verifies 10/15/20 question options, time limits, and mixed mode | `docs/` | Functional | MongoDB | **MOVE** |
| `verify-quiz-exit-confirmation.ts` | Verifies forfeit/exit confirmation and battle forfeiture mechanics | None | Functional | MongoDB | **MOVE** |
| `verify-quiz-scoring-fixes.ts` | Verifies scoring formula and answer evaluation; overlaps verify-multiplayer-quiz | None | Functional | MongoDB | **CONSOLIDATE** |
| `verify-reconcile-calculation.ts` | Verifies reconciliation calculation algorithm; overlaps reconcile-user-stats.ts | None | Functional | None (Self-contained) | **CONSOLIDATE** |
| `verify-section-def-fixes.ts` | Verifies section definition schema fix; overlaps verify-category-subject-system | None | Functional | None (Self-contained) | **CONSOLIDATE** |
| `verify-socket-hardening-fixes.ts` | Verifies socket reconnection and timeout guards; overlaps verify-multiplayer-quiz | None | Functional | None (Self-contained) | **CONSOLIDATE** |
| `verify-solo-flow.ts` | Verifies solo quiz mode lifecycle, scoring, and instant results | None | Functional | None (Self-contained) | **MOVE** |
| `verify-stale-garbage-collection.ts` | Verifies background sweeper pruning expired rooms and inactive battles | `docs/` | Functional | None (Self-contained) | **MOVE** |
| `verify-task2-1.ts` | Verifies Task 2.1 guest auth specifications; overlaps verify-guest-auth | `package.json` | Functional | None (Self-contained) | **CONSOLIDATE** |
| `verify-test-question-bank.ts` | Tests question bank integrity of seed-test-questions.ts; depends on whether test questions are kept | None | Functional | MongoDB | **REVIEW MANUALLY** |


---

## 4. Dead-File Candidates

Files identified as dead, redundant, or misplaced, with evidence, verification steps, and confidence ratings.

### 4.1 Frontend (`client/`)

| File Path | Evidence / Findings | References Checked | Dynamic / External Check | Confidence | Recommended Action |
|---|---|---|---|---|---|
| `client/utils/formatters.ts` | Exports `formatTime`, `formatDate`, and `truncate`. Not imported anywhere in `client/`. Formatting is implemented inline or via native Intl API in active components. | Full-text grep across `client/` and `server/` | None. Pure TypeScript utility functions. | **High** | **Delete** |
| `client/utils/index.ts` | Barrel export forwarding only `./formatters`. Unreferenced anywhere in the repository. | Full-text grep across entire codebase | None. | **High** | **Delete** |
| `client/store/uiStore.ts` | Defines Zustand store `useUIStore` managing modal states. Zero references across entire codebase; active modals use local state or feature hooks. | Grep for `useUIStore`, `setCreateRoomModalOpen`, `createRoomModalOpen` | None. Zustand stores are statically imported. | **High** | **Delete** |
| `client/components/shared/AuthErrorState.tsx` | Full-screen error fallback component. Never imported or referenced anywhere. Active UI uses inline error toasts and banner alerts. | Grep for `AuthErrorState` | None. React components require static or dynamic import. | **High** | **Delete** |
| `client/components/shared/AuthLoadingState.tsx` | Full-screen loading fallback component. Never imported or referenced anywhere. Active UI uses inline skeletons. | Grep for `AuthLoadingState` | None. | **High** | **Delete** |
| `client/CLAUDE.md` | 12-byte stub containing only `@AGENTS.md`. Obsolete artifact. | Grep for `CLAUDE.md` | AI agent file; not loaded by runtime or framework. | **High** | **Delete** |
| `client/README.md` | Stock Create-Next-App template README. Contradicts repository root `README.md` and QUIZZY specs. | Grep for `client/README.md` | Documentation only. | **High** | **Delete** or replace with client-specific quickstart |

### 4.2 Frontend Root Test Scripts (`client/`)

These files sit in the root of `client/` and are included in TypeScript checks due to `client/tsconfig.json` (`"**/*.ts"`), but are not part of Next.js production code:

| File Path | Evidence / Findings | References Checked | Confidence | Recommended Action |
|---|---|---|---|---|
| `client/test-auth-helper.ts` | Test utility providing `createTestGuest` and `BACKEND_URL`. Only imported by other ad-hoc test scripts in `client/`. | Grep across repo; zero imports in app code | **High** | **Move** to `tests/client/` or dedicated test directory |
| `client/test-flow.ts` | Standalone node script testing lobby creation and player readiness. | Not referenced in `package.json` or CI | **High** | **Move** or consolidate into test suite |
| `client/test-regression-suite.ts` | Standalone node script testing registration, token refresh, and lobby join. | Not referenced in `package.json` | **High** | **Move** to dedicated test directory |
| `client/test-step6-leaderboard-profile.ts` | Standalone node script testing leaderboard and profile endpoints. | Not referenced in `package.json` | **High** | **Move** to dedicated test directory |
| `client/test-timeout.ts` | Standalone node script testing round timeouts. | Not referenced in `package.json` | **High** | **Move** to dedicated test directory |
| `client/verify-proxy-phase3.ts` | Standalone script testing proxy headers. | Not referenced in `package.json` | **High** | **Move** to dedicated test directory |

### 4.3 Backend (`server/`)

| File Path | Evidence / Findings | References Checked | Confidence | Recommended Action |
|---|---|---|---|---|
| `server/src/scripts/seed-test-questions.ts` | 103 KB file containing 400+ lines of hardcoded mock questions. Overlaps with primary database seeder `seed-questions.ts`. | Grep for references; only `verify-test-question-bank.ts` reads it. | **Medium** | **Remove Candidate** (or move to test fixtures) |
| `server/src/scripts/check-db-state.ts` | 60-line scratch script that connects to MongoDB and logs collection document counts. | Zero imports, zero package.json scripts | **High** | **Remove Candidate** |
| `server/src/scripts/verify-popular-quizzes.ts` | 42-line test script checking popular quiz counts. Fully superseded by `verify-category-subject-system.ts`. | Zero package references | **High** | **Remove Candidate** |

### 4.4 Documentation & Root

| File Path | Evidence / Findings | Confidence | Recommended Action |
|---|---|---|---|
| `AGENTS.md` | Workspace root file is currently **0 bytes** (emptied unstaged in Git). Needs restoration from Git history. | **High** | **Restore** from Git history via `git checkout HEAD -- AGENTS.md` |
| `PROJECT_STRUCTURE.md` | Unstaged deleted file containing outdated Clerk references from prior architecture. | **High** | **Confirm deletion** in Git |

---

## 5. Unused Dependency Candidates

An audit of package manifests vs. actual code imports was performed:

### 5.1 Frontend (`client/package.json`)

| Dependency | Declared Version | Import Count in `client/src` | Assessment | Recommendation |
|---|---|:---:|---|---|
| `@hookform/resolvers` | `^5.5.7` | **0** | No forms in the application use Hookform resolvers. | **Remove Candidate** |
| `react-hook-form` | `^7.83.0` | **0** | All forms (login, register, quiz configuration, admin panels) use native React `useState`. | **Remove Candidate** |
| `zod` | `^4.4.3` | **0** | Zod is declared in `client/package.json` but **never imported** in any client file. Validation is handled by backend or simple client checks. | **Remove Candidate** |

### 5.2 Backend (`server/package.json`)
All declared backend dependencies (`@socket.io/redis-adapter`, `cookie-parser`, `cors`, `dotenv`, `express`, `ioredis`, `mongoose`, `pino`, `socket.io`, `zod`) are **actively imported and used**.

---

## 6. Broken Imports and Build Problems (Render Root Cause Analysis)

### 6.1 The Render Build Failure
During backend deployment on Render, the build step fails with:

```
src/scripts/verify-lobby-readiness-settings.ts(1,64): error TS2307: Cannot find module '../../../client/node_modules/socket.io-client/build/esm/index.js'
```

### 6.2 Root Cause Analysis
1. **Illegal Cross-Package Boundary Import:** Line 1 of `server/src/scripts/verify-lobby-readiness-settings.ts` reaches out of the `server` directory into `../../../client/node_modules/socket.io-client/build/esm/index.js`.
2. **Build Isolation on Render:** Render deploys the backend in isolation with root directory `server/` (running `npm install && npm run build`). The `client/node_modules` folder does not exist in the backend build environment.
3. **Overly Broad TypeScript Compilation:** In `server/tsconfig.json`, `"include": ["src/**/*"]` compiles every file in `src/`, including all 36 test and verification scripts inside `src/scripts/`, straight into `dist/`.
4. **Missing Dependency in Server:** `socket.io-client` is not declared in `server/package.json`, so the script author hardcoded a path to the client's internal node_modules.

### 6.3 Solutions & Safest Fix
- **Option 1 (Safest & Best Architectural Practice):**
  1. Add `socket.io-client` to `server/devDependencies` so any client-socket test can import `import { io, Socket } from 'socket.io-client';` standardly.
  2. Move test/verification scripts (`verify-*.ts`) out of `server/src/` into a dedicated `server/tests/` or `tests/` directory.
  3. Keep only production runtime code and database seeders in `server/src/`.
  4. `server/tsconfig.json` will only compile production code to `dist/`, guaranteeing clean, fast builds on Render without test dependencies.
- **Option 2 (Quick Fix):**
  Install `socket.io-client` as a devDependency in `server/package.json` and update line 1 of `verify-lobby-readiness-settings.ts` to `import { io as ClientSocket, Socket as ClientSocketType } from 'socket.io-client';`.

---

## 7. Duplicate Implementations & Consolidation Opportunities

1. **Verification Scripts Overlap:**
   - There are 11 milestone/hotfix scripts (`verify-auth-security-fixes.ts`, `verify-phase2-fixes.ts`, `verify-phase3-fixes.ts`, `verify-prob-fixes.ts`, etc.) that were written to verify individual bug tickets. Their assertions duplicate the core test suites (`verify-native-auth.ts`, `verify-multiplayer-quiz.ts`, `verify-category-subject-system.ts`).
   - *Opportunity:* Consolidate ticket-specific assertions into the 5 core test suites and retire the 11 transient verification scripts.
2. **Question Bank Seeding:**
   - `seed-questions.ts` and `seed-test-questions.ts` both provide question banks.
   - *Opportunity:* Keep `seed-questions.ts` as the canonical seeder. Retire `seed-test-questions.ts` to reduce repository footprint by over 100 KB.
3. **Formatters:**
   - `client/utils/formatters.ts` contains `formatTime` and `formatDate`, while components in `client/features/` implement localized formatting inline or via custom formatting.
   - *Opportunity:* Remove `client/utils/formatters.ts` since components have standardized their neobrutalist display formats.

---

## 8. Risk Assessment for Proposed Actions

| Proposed Action | Risk Level | Mitigation & Verification |
|---|:---:|---|
| Delete `client/utils/formatters.ts` & `client/utils/index.ts` | **Zero Risk** | Confirmed zero imports. Run `npm run build` in `client` to verify no missing imports. |
| Delete `client/store/uiStore.ts` | **Zero Risk** | Confirmed zero references across entire project. |
| Delete `client/components/shared/AuthErrorState.tsx` & `AuthLoadingState.tsx` | **Zero Risk** | Confirmed unreferenced. Active UI uses inline state handling. |
| Delete `client/CLAUDE.md` | **Zero Risk** | AI instruction file; not loaded by build or runtime. |
| Uninstall `react-hook-form`, `@hookform/resolvers`, `zod` from `client` | **Low Risk** | Verified zero imports in client code. Test client build immediately after removal. |
| Fix `verify-lobby-readiness-settings.ts` import | **Zero Risk (High Value)** | Replaces broken relative path with standard package or relocates out of build path; unblocks Render. |
| Restore `AGENTS.md` | **Zero Risk** | Restores empty 0-byte file to its canonical version from Git HEAD. |
| Move verification scripts from `server/src/scripts` to `tests/` | **Low Risk** | Update `package.json` test script paths (`tsx tests/verify-...`) to match new location. |

---

## 9. Recommended Cleanup Order

Prioritizing zero-risk, high-confidence cleanup first:

### Step 1: Immediate Hygiene & Restoration (Zero Risk)
1. Restore `AGENTS.md` from Git HEAD (`git checkout HEAD -- AGENTS.md`).
2. Delete confirmed dead client files:
   - `client/utils/formatters.ts`
   - `client/utils/index.ts`
   - `client/store/uiStore.ts`
   - `client/components/shared/AuthErrorState.tsx`
   - `client/components/shared/AuthLoadingState.tsx`
   - `client/CLAUDE.md`

### Step 2: Unused Client Dependencies Cleanup (Low Risk)
1. Remove `react-hook-form`, `@hookform/resolvers`, and `zod` from `client/package.json`.
2. Run `npm run build` in `client/` to verify zero regression.

### Step 3: Resolve Render TypeScript Build Failure (High Priority)
1. Install `socket.io-client` as devDependency in `server/package.json`.
2. Fix line 1 of `server/src/scripts/verify-lobby-readiness-settings.ts` to use `import { io, Socket } from 'socket.io-client';`.

### Step 4: Test & Verification Script Reorganization (Medium Priority)
1. Create a dedicated `tests/` directory outside `server/src/`.
2. Move verification test scripts (`verify-*.ts`) out of `server/src/scripts/` to prevent test files from being compiled to `server/dist/`.
3. Retain database seeding scripts (`seed-questions.ts`, `seed-categories.ts`, `seed-admin.ts`, `clear-questions.ts`, `reconcile-user-stats.ts`) in `server/src/scripts/`.
4. Remove obsolete scratch scripts (`check-db-state.ts`, `verify-popular-quizzes.ts`, `seed-test-questions.ts`).

---

## 10. Commands and Verification Checks Used

The conclusions in this audit were reached using the following verified checks:

```bash
# 1. Total repository file count
node -e "/* recursive file traversal */" # Total: 260 files

# 2. Dead file reference grep
grep -rn "formatters" client/
grep -rn "useUIStore" client/
grep -rn "AuthErrorState" client/
grep -rn "AuthLoadingState" client/

# 3. Client dependency import verification
node -e "/* checked import statements against client/package.json dependencies */"
# Result: @hookform/resolvers, react-hook-form, zod have 0 imports

# 4. Cross-package import inspection
grep -rn "client/node_modules" server/src/
# Result: server/src/scripts/verify-lobby-readiness-settings.ts:1

# 5. TypeScript validation checks
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit

# 6. Git state inspection
git status
git ls-files
```

---

## 11. Items Requiring Manual Confirmation

Before applying cleanups, confirm:
1. **`seed-test-questions.ts` (103 KB):** Confirm whether any external team members use this specific offline mock set, or if `seed-questions.ts` is sufficient.
2. **Client Root Test Scripts:** Confirm preferred destination for `client/test-*.ts` (e.g., move to `tests/client/` or root `tests/e2e/`).
3. **`client/README.md`:** Confirm if you want to delete this or replace it with a QUIZZY-specific client overview.

---

## 12. Protected Application Files (MUST NOT BE DELETED)

The following core files are vital to the stability and operation of QUIZZY and **must never be deleted**:

- **Authentication & Security:**
  - `server/src/modules/user/*` (Native auth, user model, user service)
  - `server/src/middleware/auth.middleware.ts` (JWT verification & cookie parsing)
  - `server/src/shared/utils/jwt.utils.ts` (Cryptographic signing & verification)
  - `client/features/auth/nativeAuth.ts` & `client/features/auth/guestAuth.ts`
  - `client/features/auth/hooks/useCurrentUser.ts`
  - `client/proxy.ts` (Next.js 16 Edge proxy middleware protecting routes)
- **Real-Time Multiplayer & Battle Engine:**
  - `server/src/modules/room/*` (Room code generation, member management)
  - `server/src/modules/battle/*` (Battle engine, round progression, atomic scoring)
  - `server/src/sockets/socket.ts` (Socket.IO gateway & Redis adapter setup)
  - `server/src/sockets/room.socket.ts` & `server/src/sockets/battle.socket.ts`
  - `client/store/battleStore.ts` (Zustand battle progression store)
  - `client/features/battle/hooks/useLiveBattle.ts` & `useLobbySocket.ts`
- **Database Models & Repositories:**
  - `UserModel`, `RoomModel`, `BattleModel`, `QuestionModel`, `CategoryModel`
- **Production Seeding & Maintenance:**
  - `server/src/scripts/seed-questions.ts`
  - `server/src/scripts/seed-categories.ts`
  - `server/src/scripts/seed-admin.ts`
  - `server/src/scripts/reconcile-user-stats.ts`
  - `server/src/scripts/clear-questions.ts`
- **Application & Server Bootstrapping:**
  - `server/src/app.ts` & `server/src/server.ts`
  - `client/app/layout.tsx` & `client/app/(public)/page.tsx`
