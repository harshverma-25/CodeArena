# CodeArena — Agent Operating Directives

Welcome to **CodeArena**, a real-time 1v1 competitive technical MCQ battle platform.

---

## 📌 Critical Directives for AI Agents

1. **Product Truth**:
   * CodeArena is a **real-time 1v1 MCQ trivia battle platform**, NOT a coding sandbox platform.
   * Do NOT invent or restore legacy coding execution / Judge0 compilers.
2. **Single Source of Truth**:
   * All architecture, API, database, and gameplay documentation is strictly organized in the [`docs/`](docs/) directory.
   * Start by reading [`docs/INDEX.md`](docs/INDEX.md).
3. **Layered Monolith Etiquette**:
   * **Backend**: Routes $\rightarrow$ Zod Validation $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories $\rightarrow$ Mongoose Models.
   * **Module imports**: Must explicitly include `.js` extension (e.g. `import { UserModel } from './user.model.js';`).
   * **Error handling**: Always throw `AppError` / `ApiError`. Controllers must wrap handlers in `asyncHandler`.
   * **Response contract**: Always return `ApiResponse(statusCode, data, message)`.
4. **Anti-Cheat Integrity**:
   * Never expose full question lists, correct answers, or explanations to live battle clients. Questions are dispatched one by one.
   * Never trust client deadlines; timers are strictly server-authoritative.
   * Battle completion and user statistics updates must remain atomic and idempotent.
5. **Dual-Authentication**:
   * Support both registered Clerk accounts and HMAC-signed guest sessions.
   * Mock test tokens are strictly restricted to `NODE_ENV === 'test'`. Never allow backdoor tokens in `development` or `production`.

---

## 🗺️ Documentation Quick Map

| When Working On... | Read This Document First |
| :--- | :--- |
| **Overview & Product Scope** | [`docs/00-project-overview.md`](docs/00-project-overview.md) & [`docs/01-product-requirements.md`](docs/01-product-requirements.md) |
| **System Architecture & Dual Transport** | [`docs/02-system-architecture.md`](docs/02-system-architecture.md) |
| **Frontend UI, Pages & Zustand State** | [`docs/03-frontend-architecture.md`](docs/03-frontend-architecture.md) |
| **Backend Modules, Services & Error Handling** | [`docs/04-backend-architecture.md`](docs/04-backend-architecture.md) |
| **MongoDB Collections, Schemas & Indexes** | [`docs/05-database-architecture.md`](docs/05-database-architecture.md) |
| **Authentication, Clerk & Guest Tokens** | [`docs/06-authentication-security.md`](docs/06-authentication-security.md) |
| **Socket.IO Gateway & Real-Time Events** | [`docs/07-realtime-socket-architecture.md`](docs/07-realtime-socket-architecture.md) |
| **1v1 Battle Mechanics, Timers & Scoring** | [`docs/08-battle-engine.md`](docs/08-battle-engine.md) |
| **REST API Endpoints & Schemas** | [`docs/09-api-reference.md`](docs/09-api-reference.md) |
| **Environment Variables & Zod Validation** | [`docs/10-environment-configuration.md`](docs/10-environment-configuration.md) |
| **Local Development & Question Seeding** | [`docs/11-development-guide.md`](docs/11-development-guide.md) |
| **Testing Suites & Integrity Verification** | [`docs/12-testing-guide.md`](docs/12-testing-guide.md) |
| **Production Deployment & Reverse Proxy** | [`docs/13-deployment-guide.md`](docs/13-deployment-guide.md) |
| **Coding Standards & Conventions** | [`docs/14-coding-standards.md`](docs/14-coding-standards.md) |
| **Known Issues, Backlog & Technical Debt** | [`docs/15-known-issues-and-technical-debt.md`](docs/15-known-issues-and-technical-debt.md) |

---

## 🧪 Verification Commands

Before concluding any task:
```bash
# 1. Type-check backend
cd server && npm run build

# 2. Run test suites
npm run test:security
npm run test:guest
npm run test:task2-1

# 3. Type-check frontend
cd ../client && npm run build
```
