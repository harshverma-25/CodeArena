# CodeArena - Complete Repository Structural Inventory

This document provides a comprehensive structural inventory of the entire **CodeArena** repository. It catalogues every directory, subdirectory, and file across the frontend, backend, documentation, configuration, scripts, and root files.

---

## 1. Overview & General Statistics

- **Repository Root:** `h:\Project\code-arena`
- **Total Folders Catalogued:** 84
- **Total Files Catalogued:** 234
- **Empty Files (0 bytes):** 0
- **Excluded Generated / Hidden Directories:**
  - `.git/`: Git VCS internal storage and commit history.
  - `node_modules/` (in root, client, and server): Third-party vendor dependencies installed via npm.
  - `client/.next/`: Next.js production build artifacts, compiled chunks, and development caches.
  - `server/dist/`: TypeScript compiler (`tsc`) output directory containing transpiled JavaScript.

### Files by Major Area
| Major Area | Folder Path | Total Files | Total Lines (approx.) | Primary Tech / Language |
| :--- | :--- | :--- | :--- | :--- |
| **Root Level** | `./` | 3 | 1,020 | Markdown, Git config |
| **Documentation** | `docs/` | 12 | 2,050 | Markdown specifications |
| **Backend Service** | `server/` | 93 | 6,850 | Node.js, Express, TypeScript, Mongoose, Socket.IO |
| **Frontend Application** | `client/` | 126 | 13,420 | Next.js 16, React 19, TailwindCSS, TypeScript |
| **Total** | | **234** | **~23,340** | |

---

## 2. Complete Folder Tree

The tree below shows every folder, subfolder, and file in the CodeArena repository:

```text
CodeArena/
├── client/
│   ├── app/
│   │   ├── (match)/
│   │   │   ├── match/
│   │   │   │   └── [matchId]/
│   │   │   │       └── page.tsx
│   │   │   ├── results/
│   │   │   │   └── [matchId]/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (protected)/
│   │   │   ├── battle/
│   │   │   │   ├── [roomCode]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx
│   │   │   ├── lobby/
│   │   │   │   └── [roomCode]/
│   │   │   │       └── page.tsx
│   │   │   ├── problems/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   ├── [username]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   │   └── [[...login]]/
│   │   │   │       └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── [[...register]]/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── shared/
│   │   │   ├── AuthErrorState.tsx
│   │   │   ├── AuthLoadingState.tsx
│   │   │   └── Navbar.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── index.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   └── useCurrentUser.ts
│   │   │   ├── clerkTheme.ts
│   │   │   └── index.ts
│   │   ├── battle/
│   │   │   ├── components/
│   │   │   │   ├── BattleForm.tsx
│   │   │   │   ├── BattleHeader.tsx
│   │   │   │   ├── BattleResultsHeader.tsx
│   │   │   │   ├── BattleResultsModal.tsx
│   │   │   │   ├── BattleResultsView.tsx
│   │   │   │   ├── BattleScoreBoard.tsx
│   │   │   │   ├── BattleSettings.tsx
│   │   │   │   ├── BattleSkeleton.tsx
│   │   │   │   ├── BattleStatus.tsx
│   │   │   │   ├── InviteCodeCard.tsx
│   │   │   │   ├── PlayerList.tsx
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── QuestionReviewCard.tsx
│   │   │   │   └── WaitingForOpponent.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBattleMutations.ts
│   │   │   │   ├── useBattleResult.ts
│   │   │   │   ├── useLiveBattle.ts
│   │   │   │   ├── useLobbySocket.ts
│   │   │   │   └── useRoom.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── CreateBattleModal.tsx
│   │   │   │   ├── JoinBattleModal.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   ├── RecentBattles.tsx
│   │   │   │   ├── StatsOverview.tsx
│   │   │   │   └── WelcomeHeader.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardStats.ts
│   │   │   │   └── useRecentMatches.ts
│   │   │   └── index.ts
│   │   ├── history/
│   │   │   ├── components/
│   │   │   │   └── MatchHistoryTable.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMatchHistory.ts
│   │   │   └── index.ts
│   │   ├── leaderboard/
│   │   │   ├── components/
│   │   │   │   └── LeaderboardTable.tsx
│   │   │   └── hooks/
│   │   │       └── useLeaderboard.ts
│   │   ├── match/
│   │   │   ├── components/
│   │   │   │   ├── MatchHeader.tsx
│   │   │   │   └── ProblemPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMatch.ts
│   │   │   │   └── useMatchSocket.ts
│   │   │   └── index.ts
│   │   ├── problems/
│   │   │   ├── components/
│   │   │   │   ├── DifficultyBadge.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ProblemFilters.tsx
│   │   │   │   ├── ProblemsSkeleton.tsx
│   │   │   │   └── ProblemTable.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProblemAvailability.ts
│   │   │   │   ├── useProblemBySlug.ts
│   │   │   │   └── useProblems.ts
│   │   │   └── index.ts
│   │   └── profile/
│   │       ├── components/
│   │       │   ├── ProfileStats.tsx
│   │       │   └── PublicProfileView.tsx
│   │       ├── hooks/
│   │       │   ├── useUpdateProfile.ts
│   │       │   └── useUserProfile.ts
│   │       └── index.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   └── useApiClient.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── socket.ts
│   │   └── utils.ts
│   ├── providers/
│   │   ├── AuthSyncProvider.tsx
│   │   ├── index.tsx
│   │   ├── QueryProvider.tsx
│   │   └── SocketProvider.tsx
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── store/
│   │   ├── battleStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── index.ts
│   ├── .env
│   ├── .env.example
│   ├── .env.local
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── eslint.config.mjs
│   ├── middleware.ts
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── test-complete-game.ts
│   ├── test-flow.ts
│   ├── test-step5-history-results.ts
│   ├── test-step6-leaderboard-profile.ts
│   ├── test-step7-comprehensive.ts
│   ├── test-timeout.ts
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── docs/
│   ├── backend/
│   │   ├── 01-BACKEND-ARCHITECTURE.md
│   │   ├── 02-DATABASE.md
│   │   ├── 03-API.md
│   │   ├── 04-SOCKETS.md
│   │   └── 05-IMPLEMENTATION-ROADMAP.md
│   ├── frontend/
│   │   ├── 01-FRONTEND-VISION.md
│   │   ├── 02-FRONTEND-ARCHITECTURE.md
│   │   ├── 03-DESIGN-SYSTEM.md
│   │   ├── 04-IMPLEMENTATION-ROADMAP.md
│   │   └── 05-WIREFRAMES.md
│   ├── PRD.md
│   └── ProgressTracker.md
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── clerk.ts
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── logger.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── not-found.middleware.ts
│   │   │   ├── rate-limiter.middleware.ts
│   │   │   ├── request-logger.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── modules/
│   │   │   ├── battle/
│   │   │   │   ├── battle.model.ts
│   │   │   │   ├── battle.repository.ts
│   │   │   │   ├── battle.service.ts
│   │   │   │   ├── battle.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── docs/
│   │   │   │   ├── docs.routes.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── openapi.ts
│   │   │   ├── history/
│   │   │   │   ├── history.controller.ts
│   │   │   │   ├── history.model.ts
│   │   │   │   ├── history.repository.ts
│   │   │   │   ├── history.routes.ts
│   │   │   │   ├── history.service.ts
│   │   │   │   ├── history.types.ts
│   │   │   │   ├── history.validator.ts
│   │   │   │   └── index.ts
│   │   │   ├── match/
│   │   │   │   ├── index.ts
│   │   │   │   ├── match.controller.ts
│   │   │   │   ├── match.model.ts
│   │   │   │   ├── match.repository.ts
│   │   │   │   ├── match.routes.ts
│   │   │   │   ├── match.service.ts
│   │   │   │   ├── match.types.ts
│   │   │   │   └── match.validation.ts
│   │   │   ├── problem/
│   │   │   │   ├── index.ts
│   │   │   │   ├── problem.controller.ts
│   │   │   │   ├── problem.model.ts
│   │   │   │   ├── problem.repository.ts
│   │   │   │   ├── problem.routes.ts
│   │   │   │   ├── problem.service.ts
│   │   │   │   ├── problem.types.ts
│   │   │   │   └── problem.validation.ts
│   │   │   ├── question/
│   │   │   │   ├── index.ts
│   │   │   │   ├── question.controller.ts
│   │   │   │   ├── question.model.ts
│   │   │   │   ├── question.repository.ts
│   │   │   │   ├── question.routes.ts
│   │   │   │   ├── question.service.ts
│   │   │   │   ├── question.types.ts
│   │   │   │   └── question.validation.ts
│   │   │   ├── room/
│   │   │   │   ├── index.ts
│   │   │   │   ├── room.controller.ts
│   │   │   │   ├── room.model.ts
│   │   │   │   ├── room.repository.ts
│   │   │   │   ├── room.routes.ts
│   │   │   │   ├── room.service.ts
│   │   │   │   ├── room.types.ts
│   │   │   │   └── room.validation.ts
│   │   │   └── user/
│   │   │       ├── index.ts
│   │   │       ├── user.controller.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.repository.ts
│   │   │       ├── user.routes.ts
│   │   │       ├── user.service.ts
│   │   │       ├── user.types.ts
│   │   │       └── user.validation.ts
│   │   ├── scripts/
│   │   │   ├── questions/
│   │   │   │   ├── dbms.json
│   │   │   │   ├── dsa.json
│   │   │   │   └── javascript.json
│   │   │   ├── seed-questions.ts
│   │   │   └── seed.ts
│   │   ├── shared/
│   │   │   ├── errors/
│   │   │   │   ├── api-error.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   │   ├── api-response.ts
│   │   │   │   ├── async-handler.ts
│   │   │   │   ├── http-status.ts
│   │   │   │   └── index.ts
│   │   │   └── validators/
│   │   │       └── index.ts
│   │   ├── sockets/
│   │   │   ├── battle.socket.ts
│   │   │   ├── index.ts
│   │   │   ├── room.socket.ts
│   │   │   └── socket.ts
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── CODEBASE_AUDIT.md
└── README.md
```

---

## 3. Comprehensive File-by-File Inventory

Every file in the repository is catalogued below with its relative path, extension, approximate line count, empty status, special category tag, and apparent responsibility.

### 3.1 Root Level Files
| Rel Path | Ext | Lines | Empty? | Category / Tags | Apparent Responsibility |
| :--- | :--- | :--- | :--- | :--- | :--- |

### 3.1 Root Level Files (3 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.gitignore` | `(none)` | 38 | No | Configuration | Specifies intentionally untracked files for Git to ignore across the workspace. |
| `CODEBASE_AUDIT.md` | `.md` | 340 | No | Documentation | Comprehensive architectural audit report detailing repository health, safe cleanup, and recommendations. |
| `README.md` | `.md` | 117 | No | Documentation | Repository overview, project goals, features, and quickstart documentation. |

### 3.2 Documentation Files (docs/) (12 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `docs/backend/01-BACKEND-ARCHITECTURE.md` | `.md` | 669 | No | Documentation | System design specification for Node.js, Express, and Socket.IO architecture. |
| `docs/backend/02-DATABASE.md` | `.md` | 424 | No | Documentation | MongoDB database design, schema models, relations, and indexing strategy. |
| `docs/backend/03-API.md` | `.md` | 532 | No | Documentation | REST API endpoint specifications, route parameters, and request/response payloads. |
| `docs/backend/04-SOCKETS.md` | `.md` | 466 | No | Documentation | Socket.IO event contract specification for real-time room and battle coordination. |
| `docs/backend/05-IMPLEMENTATION-ROADMAP.md` | `.md` | 555 | No | Documentation | Backend phase-by-phase implementation sequence and technical prerequisites. |
| `docs/frontend/01-FRONTEND-VISION.md` | `.md` | 92 | No | Documentation | High-level UX vision and UI interactive requirements for CodeArena. |
| `docs/frontend/02-FRONTEND-ARCHITECTURE.md` | `.md` | 326 | No | Documentation | Next.js App Router structure, state management, and real-time integration guide. |
| `docs/frontend/03-DESIGN-SYSTEM.md` | `.md` | 471 | No | Documentation | Design tokens, dark mode palette, typography, and UI component standards. |
| `docs/frontend/04-IMPLEMENTATION-ROADMAP.md` | `.md` | 307 | No | Documentation | Frontend implementation milestones from lobby creation to battle results. |
| `docs/frontend/05-WIREFRAMES.md` | `.md` | 535 | No | Documentation | Component layouts, ASCII wireframes, and responsive dashboard specifications. |
| `docs/PRD.md` | `.md` | 269 | No | Documentation | Product Requirements Document detailing features, user personas, and battle mechanics. |
| `docs/ProgressTracker.md` | `.md` | 389 | No | Documentation | Sprint and milestone completion tracker for features and architectural tasks. |

### 3.3 Server Core & Root Configuration (server/) (10 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/app.ts` | `.ts` | 107 | No | Entry Point | Express application entrypoint configuring CORS, security headers, rate limiting, and route mounting. |
| `server/src/server.ts` | `.ts` | 58 | No | Entry Point | HTTP server and Socket.IO bootstrap initiating database connection and network listeners. |
| `server/.dockerignore` | `(none)` | 9 | No | Very Small / Placeholder, Configuration | Prevents local modules, logs, and artifacts from being copied into Docker images. |
| `server/.env` | `(none)` | 11 | No | Configuration | Active backend environment variables (PORT, MONGO_URI, CLERK credentials, CORS). |
| `server/.env.example` | `.example` | 19 | No | Configuration | Template demonstrating required backend environment variables for new environments. |
| `server/docker-compose.yml` | `.yml` | 33 | No | Configuration | Docker Compose definition for containerized backend services and MongoDB. |
| `server/Dockerfile` | `(none)` | 28 | No | Configuration | Container build recipe for packaging the Node.js TypeScript backend service. |
| `server/package-lock.json` | `.json` | 2575 | No | Configuration | Deterministic dependency lockfile for npm package installations in backend. |
| `server/package.json` | `.json` | 32 | No | Configuration | Backend package manifest declaring Node.js dependencies, scripts, and runtime engines. |
| `server/tsconfig.json` | `.json` | 17 | No | Configuration | TypeScript compiler configuration for NodeNext module resolution and dist build target. |

### 3.4 Server Config & Middleware (server/src/config/, middleware/) (10 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/config/clerk.ts` | `.ts` | 6 | No | Configuration | Initializes Clerk SDK client instance for backend user authentication and profile synchronization. |
| `server/src/config/database.ts` | `.ts` | 38 | No | Configuration | Establishes and monitors Mongoose connection lifecycle to MongoDB database. |
| `server/src/config/env.ts` | `.ts` | 37 | No | Configuration | Parses and validates environment configuration variables with safe fallback defaults. |
| `server/src/config/logger.ts` | `.ts` | 40 | No | Configuration | Configures Pino structured logger with formatted output for development and production. |
| `server/src/middleware/auth.middleware.ts` | `.ts` | 34 | No | Standard Source | Authenticates incoming requests via Clerk JWT verification and test token support. |
| `server/src/middleware/error.middleware.ts` | `.ts` | 51 | No | Standard Source | Centralized Express error handling middleware returning standardized ApiResponse format. |
| `server/src/middleware/not-found.middleware.ts` | `.ts` | 10 | No | Standard Source | 404 handler for undefined API routes emitting standard ApiError responses. |
| `server/src/middleware/rate-limiter.middleware.ts` | `.ts` | 37 | No | Standard Source | Protects API routes from abusive traffic using in-memory IP request counters. |
| `server/src/middleware/request-logger.middleware.ts` | `.ts` | 13 | No | Standard Source | Logs incoming HTTP requests, response status codes, and latency using Pino. |
| `server/src/middleware/validate.middleware.ts` | `.ts` | 24 | No | Standard Source | Express middleware validating request body, query, and params against Zod schemas. |

### 3.5 Server Sockets & Types (server/src/sockets/, types/) (5 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/sockets/battle.socket.ts` | `.ts` | 143 | No | Standard Source | Handles real-time battle events (answer submissions, live score broadcasting, timeouts). |
| `server/src/sockets/index.ts` | `.ts` | 3 | No | Very Small / Placeholder | Barrel exporter for Socket.IO gateway initialization functions. |
| `server/src/sockets/room.socket.ts` | `.ts` | 160 | No | Standard Source | Manages real-time lobby lifecycle (room join, ready state toggling, host start). |
| `server/src/sockets/socket.ts` | `.ts` | 105 | No | Standard Source | Initializes Socket.IO server, binds CORS, and provides getIo() singleton accessor. |
| `server/src/types/express.d.ts` | `.ts` | 15 | No | Standard Source | Ambient TypeScript declarations augmenting Express Request with authenticated user context. |

### 3.6 Server Shared Utilities & Errors (server/src/shared/) (7 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/shared/errors/api-error.ts` | `.ts` | 26 | No | Standard Source | Defines standardized ApiError and AppError classes with HTTP status codes. |
| `server/src/shared/errors/index.ts` | `.ts` | 2 | No | Very Small / Placeholder | Barrel export for shared backend error classes. |
| `server/src/shared/utils/api-response.ts` | `.ts` | 14 | No | Standard Source | Standardized API response wrapper utility class providing uniform JSON payloads. |
| `server/src/shared/utils/async-handler.ts` | `.ts` | 12 | No | Standard Source | Wraps async Express route handlers to forward unhandled promise rejections to next(). |
| `server/src/shared/utils/http-status.ts` | `.ts` | 16 | No | Standard Source | Semantic constants map for standard HTTP response status codes. |
| `server/src/shared/utils/index.ts` | `.ts` | 5 | No | Standard Source | Barrel export for shared backend utilities. |
| `server/src/shared/validators/index.ts` | `.ts` | 82 | No | Standard Source | Reusable Zod schemas for pagination, ObjectIds, difficulty, topic, and room codes. |

### 3.7 Server Database Scripts & Seed Data (server/src/scripts/) (5 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/scripts/questions/dbms.json` | `.json` | 63 | No | Standard Source | Seed question dataset containing DBMS MCQ questions with options and explanations. |
| `server/src/scripts/questions/dsa.json` | `.json` | 63 | No | Standard Source | Seed question dataset containing DSA MCQ questions with options and explanations. |
| `server/src/scripts/questions/javascript.json` | `.json` | 63 | No | Standard Source | Seed question dataset containing JavaScript fundamentals MCQ questions. |
| `server/src/scripts/seed-questions.ts` | `.ts` | 74 | No | Standard Source | Database seeding script populating MCQ question bank from JSON topic files. |
| `server/src/scripts/seed.ts` | `.ts` | 277 | No | Standard Source | Database seeding script populating sample DSA coding problems and test cases. |

### 3.8 Server Modules: Battle & Room (13 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/modules/battle/battle.model.ts` | `.ts` | 61 | No | Standard Source | Mongoose schema and model for active Battle state, assigned questions, and player answers. |
| `server/src/modules/battle/battle.repository.ts` | `.ts` | 40 | No | Standard Source | Data access layer for creating, retrieving, and updating Battle documents in MongoDB. |
| `server/src/modules/battle/battle.service.ts` | `.ts` | 602 | No | Standard Source | Core MCQ battle orchestrator handling scoring, timers, question progression, and results. |
| `server/src/modules/battle/battle.types.ts` | `.ts` | 110 | No | Standard Source | TypeScript interfaces, enums (BattleStatus), and payload contracts for battle domain. |
| `server/src/modules/battle/index.ts` | `.ts` | 5 | No | Standard Source | Barrel export for the battle module. |
| `server/src/modules/room/index.ts` | `.ts` | 9 | No | Standard Source | Barrel export for the room module. |
| `server/src/modules/room/room.controller.ts` | `.ts` | 176 | No | Standard Source | HTTP controller handling room creation, joining, settings updates, and status queries. |
| `server/src/modules/room/room.model.ts` | `.ts` | 55 | No | Standard Source | Mongoose schema and model for battle rooms, participant players, and lobby settings. |
| `server/src/modules/room/room.repository.ts` | `.ts` | 50 | No | Standard Source | Data access repository for creating, finding, and updating room records by code. |
| `server/src/modules/room/room.routes.ts` | `.ts` | 71 | No | Standard Source | Express routes exposing POST /api/v1/rooms, /join, /leave, /ready, and settings updates. |
| `server/src/modules/room/room.service.ts` | `.ts` | 323 | No | Standard Source | Manages room lifecycle, unique 6-character room codes, host privileges, and player readiness. |
| `server/src/modules/room/room.types.ts` | `.ts` | 38 | No | Standard Source | TypeScript interfaces and status enums (WAITING, READY, IN_PROGRESS, COMPLETED) for rooms. |
| `server/src/modules/room/room.validation.ts` | `.ts` | 97 | No | Standard Source | Zod schemas validating room creation parameters, join payloads, and settings. |

### 3.9 Server Modules: Question, Problem & Match (24 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/modules/match/index.ts` | `.ts` | 9 | No | Standard Source | Barrel export for the match module. |
| `server/src/modules/match/match.controller.ts` | `.ts` | 113 | No | Standard Source | HTTP controller handling legacy match start and match history endpoints. |
| `server/src/modules/match/match.model.ts` | `.ts` | 41 | No | Standard Source | Mongoose schema and model for legacy 1v1 match records. |
| `server/src/modules/match/match.repository.ts` | `.ts` | 73 | No | Standard Source | Data access repository for legacy match documents. |
| `server/src/modules/match/match.routes.ts` | `.ts` | 41 | No | Standard Source | Express routes exposing POST /api/v1/matches/start and history endpoints. |
| `server/src/modules/match/match.service.ts` | `.ts` | 90 | No | Standard Source | Match service delegating match initiation to the real-time battle engine. |
| `server/src/modules/match/match.types.ts` | `.ts` | 30 | No | Standard Source | TypeScript interfaces and status enums for the legacy match domain. |
| `server/src/modules/match/match.validation.ts` | `.ts` | 33 | No | Standard Source | Zod schema validating match start requests, matchId params, and history queries. |
| `server/src/modules/problem/index.ts` | `.ts` | 12 | No | Standard Source | Barrel export for the problem module. |
| `server/src/modules/problem/problem.controller.ts` | `.ts` | 61 | No | Standard Source | HTTP controller handling DSA coding problem queries, slugs, and random selections. |
| `server/src/modules/problem/problem.model.ts` | `.ts` | 80 | No | Standard Source | Mongoose schema and model for DSA coding problems and structured test cases. |
| `server/src/modules/problem/problem.repository.ts` | `.ts` | 86 | No | Standard Source | Data access repository performing filtered queries and aggregations on problems. |
| `server/src/modules/problem/problem.routes.ts` | `.ts` | 48 | No | Standard Source | Express routes exposing GET /api/v1/problems, /:slug, /random, and /availability. |
| `server/src/modules/problem/problem.service.ts` | `.ts` | 97 | No | Standard Source | Business logic for problem retrieval, filtering, and availability matrix counting. |
| `server/src/modules/problem/problem.types.ts` | `.ts` | 66 | No | Standard Source | TypeScript interfaces, topics enum, and difficulty enums for coding problems. |
| `server/src/modules/problem/problem.validation.ts` | `.ts` | 42 | No | Standard Source | Zod schemas validating problem pagination, slug parameters, and filter queries. |
| `server/src/modules/question/index.ts` | `.ts` | 7 | No | Standard Source | Barrel export for the question module. |
| `server/src/modules/question/question.controller.ts` | `.ts` | 43 | No | Standard Source | HTTP controller serving random MCQ questions and question bank queries. |
| `server/src/modules/question/question.model.ts` | `.ts` | 47 | No | Standard Source | Mongoose schema and model for MCQ questions, options, correct answers, and explanations. |
| `server/src/modules/question/question.repository.ts` | `.ts` | 119 | No | Standard Source | Queries questions by topic and difficulty, and samples random balanced question sets. |
| `server/src/modules/question/question.routes.ts` | `.ts` | 30 | No | Standard Source | Express routes exposing GET /api/v1/questions and GET /api/v1/questions/:id. |
| `server/src/modules/question/question.service.ts` | `.ts` | 85 | No | Standard Source | Service managing question selection, answer verification, and question bank stats. |
| `server/src/modules/question/question.types.ts` | `.ts` | 48 | No | Standard Source | TypeScript interfaces and document definitions for MCQ questions and review payloads. |
| `server/src/modules/question/question.validation.ts` | `.ts` | 24 | No | Standard Source | Zod schemas validating question filtering and question ID parameters. |

### 3.10 Server Modules: User, History & Docs (19 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/src/modules/docs/docs.routes.ts` | `.ts` | 281 | No | Standard Source | Express routes serving interactive Swagger/OpenAPI documentation and raw JSON spec. |
| `server/src/modules/docs/index.ts` | `.ts` | 4 | No | Standard Source | Barrel export for the API documentation module. |
| `server/src/modules/docs/openapi.ts` | `.ts` | 612 | No | Standard Source | Complete OpenAPI 3.0 specification definition for CodeArena REST endpoints. |
| `server/src/modules/history/history.controller.ts` | `.ts` | 49 | No | Standard Source | HTTP controller handling match history retrieval and detailed battle review requests. |
| `server/src/modules/history/history.model.ts` | `.ts` | 2 | No | Very Small / Placeholder | Placeholder stub file kept for module symmetry; history delegates to BattleModel. |
| `server/src/modules/history/history.repository.ts` | `.ts` | 47 | No | Standard Source | Queries completed Battle documents from MongoDB for paginated user match histories. |
| `server/src/modules/history/history.routes.ts` | `.ts` | 37 | No | Standard Source | Express routes exposing GET /api/v1/history and GET /api/v1/history/:battleId. |
| `server/src/modules/history/history.service.ts` | `.ts` | 292 | No | Standard Source | Formats battle records into user match history summaries and question reviews. |
| `server/src/modules/history/history.types.ts` | `.ts` | 101 | No | Standard Source | TypeScript interfaces for battle history items and question-by-question review cards. |
| `server/src/modules/history/history.validator.ts` | `.ts` | 15 | No | Standard Source | Zod schema validating history pagination parameters and battle ID URL params. |
| `server/src/modules/history/index.ts` | `.ts` | 6 | No | Standard Source | Barrel export for the match history module. |
| `server/src/modules/user/index.ts` | `.ts` | 8 | No | Standard Source | Barrel export for the user module. |
| `server/src/modules/user/user.controller.ts` | `.ts` | 86 | No | Standard Source | HTTP controller handling user profile synchronization, profile updates, and leaderboards. |
| `server/src/modules/user/user.model.ts` | `.ts` | 26 | No | Standard Source | Mongoose schema and model for registered players, Clerk mappings, and ratings. |
| `server/src/modules/user/user.repository.ts` | `.ts` | 54 | No | Standard Source | Data access repository for finding users by Clerk ID, username, and updating profiles. |
| `server/src/modules/user/user.routes.ts` | `.ts` | 62 | No | Standard Source | Express routes exposing /api/v1/users/me, /sync, /profile/:username, and /leaderboard. |
| `server/src/modules/user/user.service.ts` | `.ts` | 357 | No | Standard Source | Business logic for user synchronization, live profile stats computation, and leaderboard rankings. |
| `server/src/modules/user/user.types.ts` | `.ts` | 82 | No | Standard Source | TypeScript interfaces for user documents, public profile statistics, and leaderboard entries. |
| `server/src/modules/user/user.validation.ts` | `.ts` | 41 | No | Standard Source | Zod schemas validating user profile update payloads and leaderboard query params. |

### 3.11 Client Root & Configuration (client/) (16 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/.env` | `(none)` | 9 | No | Configuration | Default frontend environment variables configuration. |
| `client/.env.example` | `.example` | 12 | No | Configuration | Template demonstrating required frontend environment variables (NEXT_PUBLIC_CLERK_*, API_URL). |
| `client/.env.local` | `.local` | 9 | No | Configuration | Active local frontend environment variables overriding defaults with live Clerk and API keys. |
| `client/.gitignore` | `(none)` | 42 | No | Configuration | Specifies Next.js build output (.next), node_modules, and local env files to ignore in Git. |
| `client/AGENTS.md` | `.md` | 6 | No | Documentation | Agentic AI pair programming guidelines and architectural context documentation for frontend. |
| `client/CLAUDE.md` | `.md` | 2 | No | Very Small / Placeholder, Documentation | Compact development command cheat sheet and guidelines for coding assistants. |
| `client/eslint.config.mjs` | `.mjs` | 21 | No | Configuration | ESLint flat configuration setting up Next.js core web vitals and TypeScript rules. |
| `client/middleware.ts` | `.ts` | 42 | No | Entry Point | Next.js edge middleware routing authentication checks with Clerk clerkMiddleware(). |
| `client/next-env.d.ts` | `.ts` | 7 | No | Standard Source | Auto-generated TypeScript declaration file ensuring Next.js types are included by the compiler. |
| `client/next.config.ts` | `.ts` | 8 | No | Configuration | Next.js build configuration options, image domain allowances, and compiler settings. |
| `client/package-lock.json` | `.json` | 7487 | No | Configuration | Deterministic dependency lockfile for npm package installations in client. |
| `client/package.json` | `.json` | 40 | No | Configuration | Frontend package manifest declaring Next.js, React 19, TailwindCSS, and client dependencies. |
| `client/postcss.config.mjs` | `.mjs` | 8 | No | Very Small / Placeholder, Configuration | PostCSS configuration file loading the TailwindCSS v4 plugin. |
| `client/README.md` | `.md` | 37 | No | Documentation | Client application documentation covering Next.js setup, development scripts, and deployment. |
| `client/tsconfig.json` | `.json` | 42 | No | Configuration | TypeScript compiler configuration for Next.js App Router and @/* path aliases. |
| `client/tsconfig.tsbuildinfo` | `.tsbuildinfo` | 1 | No | Configuration | Incremental TypeScript build cache file speeding up consecutive type checking passes. |

### 3.12 Client Test Scripts (client/test-*.ts) (6 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/test-complete-game.ts` | `.ts` | 150 | No | Test File | Automated test script simulating a complete end-to-end 2-player battle flow via sockets. |
| `client/test-flow.ts` | `.ts` | 153 | No | Test File | Automated integration test verifying lobby creation, joining, settings changes, and readiness. |
| `client/test-step5-history-results.ts` | `.ts` | 250 | No | Test File | Integration test verifying match completion, score recording, and history review endpoints. |
| `client/test-step6-leaderboard-profile.ts` | `.ts` | 137 | No | Test File | Integration test verifying dynamic leaderboard ranking calculations and player profile stats. |
| `client/test-step7-comprehensive.ts` | `.ts` | 313 | No | Test File | Comprehensive test suite executing edge-case scenarios, disconnections, and rate limiting. |
| `client/test-timeout.ts` | `.ts` | 114 | No | Test File | Test script verifying server-enforced question timer expirations and automatic question advancement. |

### 3.13 Client App Router Pages (client/app/) (21 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/app/(match)/match/[matchId]/page.tsx` | `.tsx` | 125 | No | Standard Source | Match arena page orchestrating problem overview and 1v1 battle session. |
| `client/app/(match)/results/[matchId]/page.tsx` | `.tsx` | 91 | No | Standard Source | Official battle performance report card and detailed question review breakdown page. |
| `client/app/(match)/layout.tsx` | `.tsx` | 14 | No | Standard Source | Dedicated full-screen layout for focused match and battle review views. |
| `client/app/(protected)/battle/[roomCode]/page.tsx` | `.tsx` | 140 | No | Standard Source | Live MCQ Battle Arena page with real-time question cards, timers, and live scoreboards. |
| `client/app/(protected)/battle/new/page.tsx` | `.tsx` | 40 | No | Standard Source | Create Battle page allowing hosts to configure topics, difficulty, and create rooms. |
| `client/app/(protected)/dashboard/page.tsx` | `.tsx` | 41 | No | Standard Source | User dashboard displaying combat statistics overview, quick action buttons, and recent battles. |
| `client/app/(protected)/history/page.tsx` | `.tsx` | 24 | No | Standard Source | Match History page rendering paginated battle records with filtering and result status. |
| `client/app/(protected)/leaderboard/page.tsx` | `.tsx` | 24 | No | Standard Source | Global Leaderboard page showcasing ranked players by wins, matches, and accuracy. |
| `client/app/(protected)/lobby/[roomCode]/page.tsx` | `.tsx` | 249 | No | Standard Source | Battle Room Lobby page providing participant list, host settings, ready toggles, and start action. |
| `client/app/(protected)/problems/[slug]/page.tsx` | `.tsx` | 272 | No | Standard Source | Coding problem description page with problem specifications, constraints, and test examples. |
| `client/app/(protected)/problems/page.tsx` | `.tsx` | 171 | No | Standard Source | Coding problems browser page with topic, difficulty, and keyword search filters. |
| `client/app/(protected)/profile/[username]/page.tsx` | `.tsx` | 64 | No | Standard Source | Public player profile view displaying user stats, rank tier, and recent combat records. |
| `client/app/(protected)/profile/page.tsx` | `.tsx` | 24 | No | Standard Source | Personal player profile page with editable display name, stats, and historical performance. |
| `client/app/(protected)/layout.tsx` | `.tsx` | 18 | No | Standard Source | Protected route group layout embedding the Navbar and global authentication guard. |
| `client/app/(public)/login/[[...login]]/page.tsx` | `.tsx` | 20 | No | Standard Source | Clerk sign-in page embedding Clerk SignIn widget with dark mode styling. |
| `client/app/(public)/register/[[...register]]/page.tsx` | `.tsx` | 20 | No | Standard Source | Clerk registration page embedding Clerk SignUp widget with dark mode styling. |
| `client/app/(public)/layout.tsx` | `.tsx` | 16 | No | Standard Source | Public layout wrapper for unauthenticated views (landing page, authentication pages). |
| `client/app/(public)/page.tsx` | `.tsx` | 151 | No | Entry Point | Public landing page presenting CodeArena feature highlights, CTA buttons, and interactive visuals. |
| `client/app/favicon.ico` | `.ico` | 31 | No | Standard Source | CodeArena brand favicon asset displayed in web browser tabs. |
| `client/app/globals.css` | `.css` | 89 | No | Standard Source | Global Tailwind CSS styling, dark mode theme variables, and custom typography utilities. |
| `client/app/layout.tsx` | `.tsx` | 46 | No | Entry Point | Root application layout providing Clerk authentication, React Query, and Socket providers. |

### 3.14 Client UI Components (client/components/) (7 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/components/shared/AuthErrorState.tsx` | `.tsx` | 68 | No | Standard Source | Full-screen error card displayed when user synchronization with backend fails. |
| `client/components/shared/AuthLoadingState.tsx` | `.tsx` | 56 | No | Standard Source | Animated loading screen with status messages displayed during authentication bootstrap. |
| `client/components/shared/Navbar.tsx` | `.tsx` | 116 | No | Standard Source | Global navigation bar providing links to Arena, Problems, Leaderboard, History, and user profile. |
| `client/components/ui/button.tsx` | `.tsx` | 55 | No | Standard Source | Customizable button component with multiple stylistic variants and size options. |
| `client/components/ui/card.tsx` | `.tsx` | 79 | No | Standard Source | Card container UI primitive with Header, Title, Description, Content, and Footer subcomponents. |
| `client/components/ui/input.tsx` | `.tsx` | 25 | No | Standard Source | Standard text input field UI primitive with focus styling and dark mode accents. |
| `client/components/index.ts` | `.ts` | 5 | No | Standard Source | Barrel export for shared components and UI primitives. |

### 3.15 Client Features: Battle & Match (25 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/features/battle/components/BattleForm.tsx` | `.tsx` | 165 | No | Standard Source | Form component for configuring topic, difficulty, question count, and creating a new room. |
| `client/features/battle/components/BattleHeader.tsx` | `.tsx` | 117 | No | Standard Source | Live battle top bar displaying topic, difficulty, question progression counter, and countdown timer. |
| `client/features/battle/components/BattleResultsHeader.tsx` | `.tsx` | 267 | No | Standard Source | Summary header for the results view highlighting victory/defeat outcome and final scores. |
| `client/features/battle/components/BattleResultsModal.tsx` | `.tsx` | 170 | No | Standard Source | Modal overlay displayed immediately upon battle completion with outcome highlights. |
| `client/features/battle/components/BattleResultsView.tsx` | `.tsx` | 145 | No | Standard Source | Comprehensive results review view rendering player comparisons and question review cards. |
| `client/features/battle/components/BattleScoreBoard.tsx` | `.tsx` | 137 | No | Standard Source | Split scoreboard showing both players, current question indices, scores, and connection indicators. |
| `client/features/battle/components/BattleSettings.tsx` | `.tsx` | 251 | No | Standard Source | Host controls panel inside lobby for tuning topic, difficulty, and question count. |
| `client/features/battle/components/BattleSkeleton.tsx` | `.tsx` | 38 | No | Standard Source | Loading placeholder skeleton displayed during battle state synchronization. |
| `client/features/battle/components/BattleStatus.tsx` | `.tsx` | 93 | No | Standard Source | Lobby status card displaying readiness summary, connection status, and room instructions. |
| `client/features/battle/components/InviteCodeCard.tsx` | `.tsx` | 63 | No | Standard Source | Copyable room invitation code and URL card for inviting friends to battle. |
| `client/features/battle/components/PlayerList.tsx` | `.tsx` | 119 | No | Standard Source | Lobby card rendering player avatars, usernames, host badges, and ready indicators. |
| `client/features/battle/components/QuestionCard.tsx` | `.tsx` | 112 | No | Standard Source | Interactive MCQ card rendering question prompt, code snippet, option choices, and submission state. |
| `client/features/battle/components/QuestionReviewCard.tsx` | `.tsx` | 166 | No | Standard Source | Post-battle review card showing options, selected answer, correct answer, and detailed explanation. |
| `client/features/battle/components/WaitingForOpponent.tsx` | `.tsx` | 66 | No | Standard Source | Intermission indicator displayed when a player finishes all questions before their opponent. |
| `client/features/battle/hooks/useBattleMutations.ts` | `.ts` | 103 | No | Standard Source | React Query mutation hooks for creating rooms, joining, updating settings, and starting matches. |
| `client/features/battle/hooks/useBattleResult.ts` | `.ts` | 29 | No | Standard Source | React Query hook fetching completed battle performance breakdown from GET /api/v1/history/:battleId. |
| `client/features/battle/hooks/useLiveBattle.ts` | `.ts` | 308 | No | Standard Source | Real-time hook managing live battle state, socket subscriptions, question progression, and answer submission. |
| `client/features/battle/hooks/useLobbySocket.ts` | `.ts` | 228 | No | Standard Source | Socket hook managing lobby coordination, player join events, settings broadcasts, and battle start. |
| `client/features/battle/hooks/useRoom.ts` | `.ts` | 30 | No | Standard Source | React Query hook fetching current room metadata from GET /api/v1/rooms/:code. |
| `client/features/battle/index.ts` | `.ts` | 17 | No | Standard Source | Barrel export for battle components, hooks, and types. |
| `client/features/match/components/MatchHeader.tsx` | `.tsx` | 155 | No | Standard Source | Match arena header displaying opponent info and synchronized countdown clock. |
| `client/features/match/components/ProblemPanel.tsx` | `.tsx` | 112 | No | Standard Source | Left-side panel displaying problem description, constraints, and test examples in match arena. |
| `client/features/match/hooks/useMatch.ts` | `.ts` | 31 | No | Standard Source | React Query hook fetching legacy match details from GET /api/v1/matches/:matchId. |
| `client/features/match/hooks/useMatchSocket.ts` | `.ts` | 78 | No | Standard Source | Socket hook synchronizing match arena connection state with backend. |
| `client/features/match/index.ts` | `.ts` | 6 | No | Standard Source | Barrel export for legacy match components and hooks. |

### 3.16 Client Features: Auth, Dashboard & History (15 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/features/auth/hooks/useCurrentUser.ts` | `.ts` | 29 | No | Standard Source | React Query hook fetching the active user profile from GET /api/v1/users/me. |
| `client/features/auth/clerkTheme.ts` | `.ts` | 28 | No | Standard Source | Tailored dark mode appearance theme configuration for Clerk authentication widgets. |
| `client/features/auth/index.ts` | `.ts` | 3 | No | Very Small / Placeholder | Barrel export for the client authentication feature. |
| `client/features/dashboard/components/CreateBattleModal.tsx` | `.tsx` | 67 | No | Standard Source | Application source file. |
| `client/features/dashboard/components/JoinBattleModal.tsx` | `.tsx` | 138 | No | Standard Source | Application source file. |
| `client/features/dashboard/components/QuickActions.tsx` | `.tsx` | 97 | No | Standard Source | Quick action buttons for Host Battle, Join Battle, Browse Problems, and View Leaderboard. |
| `client/features/dashboard/components/RecentBattles.tsx` | `.tsx` | 191 | No | Standard Source | Dashboard card listing the user's last 5 completed battles with results and review links. |
| `client/features/dashboard/components/StatsOverview.tsx` | `.tsx` | 93 | No | Standard Source | Metric cards showing Battles Played, Total Wins, Accuracy Percentage, and Current Streak. |
| `client/features/dashboard/components/WelcomeHeader.tsx` | `.tsx` | 56 | No | Standard Source | Application source file. |
| `client/features/dashboard/hooks/useDashboardStats.ts` | `.ts` | 30 | No | Standard Source | React Query hook aggregating overall user statistics for dashboard display. |
| `client/features/dashboard/hooks/useRecentMatches.ts` | `.ts` | 62 | No | Standard Source | React Query hook retrieving the authenticated user's most recent match records. |
| `client/features/dashboard/index.ts` | `.ts` | 8 | No | Standard Source | Barrel export for dashboard widgets and statistics hooks. |
| `client/features/history/components/MatchHistoryTable.tsx` | `.tsx` | 293 | No | Standard Source | Paginated table listing past battles with opponent info, score, outcome, and review links. |
| `client/features/history/hooks/useMatchHistory.ts` | `.ts` | 79 | No | Standard Source | React Query hook fetching paginated match history from GET /api/v1/history. |
| `client/features/history/index.ts` | `.ts` | 3 | No | Very Small / Placeholder | Barrel export for match history table and filters. |

### 3.17 Client Features: Leaderboard, Problems & Profile (16 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/features/leaderboard/components/LeaderboardTable.tsx` | `.tsx` | 321 | No | Standard Source | Paginated global ranking table displaying rank, player, wins, battles played, and accuracy. |
| `client/features/leaderboard/hooks/useLeaderboard.ts` | `.ts` | 28 | No | Standard Source | React Query hook fetching global player rankings from GET /api/v1/users/leaderboard. |
| `client/features/problems/components/DifficultyBadge.tsx` | `.tsx` | 36 | No | Standard Source | Stylized badge displaying problem difficulty level (Easy, Medium, Hard). |
| `client/features/problems/components/EmptyState.tsx` | `.tsx` | 37 | No | Standard Source | Empty state card displayed when no coding problems match current search filters. |
| `client/features/problems/components/ProblemFilters.tsx` | `.tsx` | 115 | No | Standard Source | Search input, topic dropdown, and difficulty filter selectors for problems browser. |
| `client/features/problems/components/ProblemsSkeleton.tsx` | `.tsx` | 37 | No | Standard Source | Skeleton loader displayed while problem lists are being fetched from API. |
| `client/features/problems/components/ProblemTable.tsx` | `.tsx` | 109 | No | Standard Source | Table listing coding problems with title, topic, difficulty, and solve links. |
| `client/features/problems/hooks/useProblemAvailability.ts` | `.ts` | 28 | No | Standard Source | React Query hook fetching problem count matrix by topic and difficulty. |
| `client/features/problems/hooks/useProblemBySlug.ts` | `.ts` | 29 | No | Standard Source | React Query hook fetching detailed problem specifications by URL slug. |
| `client/features/problems/hooks/useProblems.ts` | `.ts` | 54 | No | Standard Source | React Query hook fetching paginated, filtered coding problems list. |
| `client/features/problems/index.ts` | `.ts` | 8 | No | Standard Source | Barrel export for coding problem components and hooks. |
| `client/features/profile/components/ProfileStats.tsx` | `.tsx` | 449 | No | Standard Source | Profile dashboard with stats grid, win rate charts, and editable settings form. |
| `client/features/profile/components/PublicProfileView.tsx` | `.tsx` | 315 | No | Standard Source | Read-only profile card for inspecting another player's stats and battle history. |
| `client/features/profile/hooks/useUpdateProfile.ts` | `.ts` | 24 | No | Standard Source | React Query mutation hook submitting profile updates to PUT /api/v1/users/me. |
| `client/features/profile/hooks/useUserProfile.ts` | `.ts` | 29 | No | Standard Source | React Query hook fetching public or personal profile from GET /api/v1/users/profile/:username. |
| `client/features/profile/index.ts` | `.ts` | 3 | No | Very Small / Placeholder | Barrel export for player profile components and hooks. |

### 3.18 Client Hooks, Lib, Providers, Store, Types, Utils & Public Assets (20 files)
| Relative Path | Ext | Lines | Empty? | Special Tags | Responsibility Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `client/hooks/index.ts` | `.ts` | 3 | No | Very Small / Placeholder | Barrel export for client custom hooks. |
| `client/hooks/useApiClient.ts` | `.ts` | 50 | No | Standard Source | Pre-authenticated API client hook automatically attaching Clerk JWT bearer tokens to requests. |
| `client/lib/api.ts` | `.ts` | 35 | No | Standard Source | Base HTTP request utility function handling JSON headers, error unwrapping, and bearer tokens. |
| `client/lib/index.ts` | `.ts` | 4 | No | Very Small / Placeholder | Barrel export for client utility libraries. |
| `client/lib/socket.ts` | `.ts` | 82 | No | Standard Source | Singleton SocketManager class managing Socket.IO client connection lifecycle and event routing. |
| `client/lib/utils.ts` | `.ts` | 7 | No | Standard Source | Utility function merging Tailwind CSS classes with clsx and twMerge. |
| `client/providers/AuthSyncProvider.tsx` | `.tsx` | 32 | No | Standard Source | React context provider automatically synchronizing authenticated Clerk users with backend. |
| `client/providers/index.tsx` | `.tsx` | 21 | No | Standard Source | Master provider tree wrapping children with Clerk, React Query, and Socket providers. |
| `client/providers/QueryProvider.tsx` | `.tsx` | 25 | No | Standard Source | Configures TanStack React Query QueryClient with default caching policies. |
| `client/providers/SocketProvider.tsx` | `.tsx` | 76 | No | Standard Source | React context provider managing global Socket.IO connection and disconnection upon authentication. |
| `client/public/file.svg` | `.svg` | 1 | No | Standard Source | SVG icon asset for generic document display. |
| `client/public/globe.svg` | `.svg` | 1 | No | Standard Source | SVG icon asset for global/networking indicators. |
| `client/public/next.svg` | `.svg` | 1 | No | Standard Source | Next.js framework brand logo SVG asset. |
| `client/public/vercel.svg` | `.svg` | 1 | No | Standard Source | Vercel platform brand logo SVG asset. |
| `client/public/window.svg` | `.svg` | 1 | No | Standard Source | SVG icon asset for desktop/window display. |
| `client/store/battleStore.ts` | `.ts` | 116 | No | Standard Source | Zustand store maintaining live battle progression, timers, player answers, and scores. |
| `client/store/uiStore.ts` | `.ts` | 41 | No | Standard Source | Zustand store managing modal visibility (create room, join room, invite modal, sidebar). |
| `client/types/index.ts` | `.ts` | 312 | No | Standard Source | Complete TypeScript type definitions for users, rooms, battles, questions, problems, and socket contracts. |
| `client/utils/formatters.ts` | `.ts` | 146 | No | Standard Source | Formatting helper utilities for dates, durations, percentages, and topic display names. |
| `client/utils/index.ts` | `.ts` | 2 | No | Very Small / Placeholder | Barrel export for frontend utility formatters. |

---

## 4. Special Cases Analysis

### 4.1 Empty Files (0 bytes)
- **Count:** 0 files.
- **Finding:** No empty files exist in the repository. All files contain valid code, documentation, or configuration.

### 4.2 Very Small / Potential Placeholder Files (≤ 100 bytes)
The following files are very small and serve specific architectural roles:
1. `server/src/modules/history/history.model.ts` (20 bytes, 1 line):
   - **Content:** `// TODO: Implement`
   - **Reason:** `HistoryService` and `HistoryRepository` intentionally query `BattleModel` from `modules/battle/battle.model.ts` directly. No separate MongoDB collection for history exists. This file is retained to maintain structural uniformity with other modules.
2. `server/src/shared/errors/index.ts` (32 bytes, 1 line):
   - **Content:** `export * from './api-error.js';`
   - **Reason:** Standard barrel export forwarding centralized error classes.
3. `server/src/sockets/index.ts` (63 bytes, 2 lines):
   - **Content:** Barrel export forwarding socket initialization routines.
4. `server/.dockerignore` (79 bytes, 8 lines):
   - **Content:** Standard docker ignore list.
5. `client/CLAUDE.md` (12 bytes, 1 line):
   - **Content:** Placeholder development prompt file.
6. `client/utils/index.ts` (30 bytes, 1 line):
   - **Content:** `export * from "./formatters";`
   - **Reason:** Clean barrel export exposing formatting utilities.
7. `client/hooks/index.ts` (33 bytes, 1 line):
   - **Content:** `export * from "./useApiClient";`
   - **Reason:** Barrel export exposing pre-authenticated API client hook.
8. `client/features/auth/index.ts` (70 bytes, 2 lines), `client/features/history/index.ts` (89 bytes, 2 lines), `client/features/profile/index.ts` (85 bytes, 2 lines):
   - **Reason:** Lightweight feature-level barrel index exports.
9. `client/lib/index.ts` (74 bytes, 3 lines):
   - **Content:** Clean barrel export for `utils`, `api`, and `socket`.
10. `client/postcss.config.mjs` (94 bytes, 6 lines):
    - **Content:** PostCSS v4 configuration file.

### 4.3 Duplicate-Looking or Dual Implementations
1. **Match vs Battle (`server/src/modules/match` vs `server/src/modules/battle`):**
   - The backend contains both `modules/battle` (the active real-time MCQ battle engine) and `modules/match` (legacy wrapper delegating to `battleService.startBattle`).
   - The client invokes `POST /api/v1/matches/start` during lobby start mutations. Both modules exist concurrently to maintain API contract compatibility.
2. **Match Results Pages (`client/app/(match)/results/[matchId]`):**
   - The redundant duplicate results page at `(protected)/battle/results/[battleId]` was previously removed. The sole canonical results view now lives cleanly at `client/app/(match)/results/[matchId]/page.tsx`.

### 4.4 Configuration Files
- **Root:** `.gitignore`
- **Server:** `server/.env`, `server/.env.example`, `server/.dockerignore`, `server/docker-compose.yml`, `server/Dockerfile`, `server/package.json`, `server/package-lock.json`, `server/tsconfig.json`
- **Client:** `client/.env`, `client/.env.example`, `client/.env.local`, `client/.gitignore`, `client/eslint.config.mjs`, `client/next.config.ts`, `client/package.json`, `client/package-lock.json`, `client/postcss.config.mjs`, `client/tsconfig.json`, `client/tsconfig.tsbuildinfo`

### 4.5 Entry Points
- **Backend Application Entry:** `server/src/app.ts` (Express application configuration, security middleware, and route mounting).
- **Backend Runtime Entry:** `server/src/server.ts` (Server bootstrapping, HTTP listener, and Socket.IO initialization).
- **Frontend Root Layout:** `client/app/layout.tsx` (Top-level HTML structure, Clerk authentication wrapper, React Query provider, and Socket provider).
- **Frontend Edge Proxy:** `client/middleware.ts` (Clerk edge authentication middleware).
- **Frontend Landing Page:** `client/app/(public)/page.tsx` (Default route `/` landing view).

### 4.6 Test Files
Automated integration and battle flow testing scripts located in `client/`:
1. `client/test-complete-game.ts`: Full 2-player battle execution flow.
2. `client/test-flow.ts`: Lobby creation, joining, and player readiness tests.
3. `client/test-step5-history-results.ts`: Match history and solution breakdown verification.
4. `client/test-step6-leaderboard-profile.ts`: Player rating updates and leaderboard queries.
5. `client/test-step7-comprehensive.ts`: Disconnection handling, error states, and security checks.
6. `client/test-timeout.ts`: Question timer expiration and auto-progression tests.

### 4.7 Documentation Files
- **Repository Root:** `README.md`, `CODEBASE_AUDIT.md`
- **Client Documentation:** `client/README.md`, `client/CLAUDE.md`, `client/AGENTS.md`
- **System Specifications:** `docs/PRD.md`, `docs/ProgressTracker.md`
- **Backend Architecture Docs:** `docs/backend/01-BACKEND-ARCHITECTURE.md`, `02-DATABASE.md`, `03-API.md`, `04-SOCKETS.md`, `05-IMPLEMENTATION-ROADMAP.md`
- **Frontend Architecture Docs:** `docs/frontend/01-FRONTEND-VISION.md`, `02-FRONTEND-ARCHITECTURE.md`, `03-DESIGN-SYSTEM.md`, `04-IMPLEMENTATION-ROADMAP.md`, `05-WIREFRAMES.md`

---

## 5. Folder Summaries & Architectural Relationships

### 5.1 Frontend Structure (`client/`)
- **`app/`**: Next.js 16 App Router hierarchy organized into route groups:
  - `(public)`: Unprotected views (landing page, Clerk login, Clerk register).
  - `(protected)`: Authenticated views (dashboard, battle arena, lobby, problems, leaderboard, history, profile).
  - `(match)`: Full-screen focused match environment and battle results breakdown.
- **`components/`**: Shared UI primitives (`ui/button.tsx`, `card.tsx`, `input.tsx`) and global navigation bar (`shared/Navbar.tsx`).
- **`features/`**: Domain-driven feature modules isolating UI components and React Query hooks:
  - `auth`: Clerk authentication hooks and user sync handlers.
  - `battle`: MCQ question cards, live scoreboard, lobby sockets, countdown timer.
  - `dashboard`: Player combat metrics, quick actions, and recent match cards.
  - `history`: Match history table with outcome filters.
  - `leaderboard`: Global ranking table and top 3 podium.
  - `match`: Legacy match arena problem description and header.
  - `problems`: DSA coding problems browser with difficulty badges.
  - `profile`: Player profile views, stats cards, and display name settings.
- **`hooks/`**: Reusable hooks (pre-authenticated `useApiClient`).
- **`lib/`**: API fetch helper, `SocketManager` singleton, and Tailwind class merging utility.
- **`providers/`**: React context providers for Clerk, TanStack React Query, and Socket.IO.
- **`store/`**: Zustand global stores: `battleStore.ts` (live battle progression) and `uiStore.ts` (modal states).
- **`types/`**: Comprehensive client TypeScript interfaces.

### 5.2 Backend Structure (`server/`)
- **`src/config/`**: External system adapters (Clerk SDK, MongoDB Mongoose connection, Pino logger, validated environment variables).
- **`src/middleware/`**: Express middleware pipeline (JWT authentication, rate limiting, request logging, Zod validation, error handling, 404).
- **`src/modules/`**: Layered business modules (`routes` -> `controller` -> `service` -> `repository` -> `model`):
  - `battle`: Live battle orchestration, question assignments, timers, and scoring.
  - `docs`: OpenAPI documentation endpoints.
  - `history`: User battle history retrieval and question-by-question performance analysis.
  - `match`: Compatibility adapter for starting battles from room lobbies.
  - `problem`: DSA coding problems repository.
  - `question`: MCQ question bank querying and randomized selection.
  - `room`: 6-character room code generation, lobby membership, and readiness.
  - `user`: Clerk user sync, public profiles, and leaderboard ranking aggregation.
- **`src/sockets/`**: Socket.IO connection gateway and event handlers (`room.socket.ts`, `battle.socket.ts`).
- **`src/shared/`**: Shared backend primitives (`ApiError`, `AppError`, `ApiResponse`, `asyncHandler`, Zod schemas).
- **`src/scripts/`**: Database seeding utilities and JSON question banks for DBMS, DSA, and JavaScript.

### 5.3 Shared Code & Contracts
- **Socket.IO Event Contracts:** Events like `room:join`, `room:update`, `room:start_battle`, `battle:init`, `battle:answer`, and `battle:results` coordinate real-time state between `server/src/sockets/` and client hooks (`useLiveBattle`, `useLobbySocket`).
- **Data Shapes:** Both client (`client/types/index.ts`) and server (`modules/*/*.types.ts`) conform to identical room settings, question formats, player records, and battle results structures.
- **Standardized API Payloads:** All endpoints return `ApiResponse<T>` containing `{ success: boolean, message: string, data: T }`.

### 5.4 How Major Folders Relate
1. **Lobby Flow:** A player creates a room via `client/features/battle` -> calls `POST /api/v1/rooms` -> `server/src/modules/room` creates a Room record -> client navigates to `/lobby/[roomCode]` -> connects to `server/src/sockets/room.socket.ts`.
2. **Battle Flow:** Host clicks Start Battle -> emits `room:start_battle` or posts to `/api/v1/matches/start` -> `server/src/modules/battle/battle.service.ts` initializes Battle, selects balanced questions from `modules/question`, assigns timers, and emits `battle:init` -> client receives event and navigates to `/battle/[roomCode]`.
3. **Completion & Review Flow:** On last question or timeout -> `battleService` computes winner, saves scores to MongoDB -> emits `battle:results` -> client displays results modal -> player navigates to `/results/[matchId]` -> queries `server/src/modules/history` for question-by-question breakdown.
4. **Leaderboard & Profile Flow:** Player navigates to `/leaderboard` or `/profile` -> queries `server/src/modules/user` -> service calculates completed battle wins, total matches, and accuracy from `BattleModel` records.
