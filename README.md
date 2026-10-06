# CodeArena — Real-Time Multiplayer Quiz Platform

CodeArena is a production-ready, real-time 1–4 player competitive quiz platform. Players compete across curated categories (Programming, Aptitude, and General Knowledge) or Mixed Category pools with configurable question counts (10, 15, or 20) and category-derived server-authoritative timers.

---

## 🚀 Key Features

* **1–4 Player Real-Time Multiplayer**: Low-latency lobby coordination, room PIN sharing, host controls, and synchronized gameplay via Socket.IO.
* **Solo Practice Mode**: Instant solo drills without waiting for room lobbies.
* **Category & Subject Hierarchy**:
  * **Programming** (30s timer): Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, OOP, JavaScript, TypeScript, Python, React, Pseudocode.
  * **Aptitude** (60s timer): Logical Reasoning, Quantitative Aptitude, Verbal Ability, Data Interpretation.
  * **General Knowledge** (30s timer): History, Geography, Science, Current Affairs, General Trivia.
  * **Mixed Category Mode**: Balanced random sampling across all active subjects within a category.
* **Server-Authoritative Anti-Cheat**: Questions are dispatched round-by-round. Correct answers and explanations are strictly withheld on the server until round reveal and match completion. Client timers are purely representational.
* **Dynamic Speed Scoring**: Correct answers award points on a decaying scale: $1000 - (\text{elapsedSeconds} \times 30)$ with a minimum floor of 100 points. Incorrect or timed-out submissions earn 0 points.
* **Synchronized Round Reveals & Podium Rankings**: Real-time round reveal showing explanations, scores, and intermediate standings, culminating in a 1st–4th place podium celebration.
* **Dual-Authentication Architecture**:
  * **Native JWT**: Registration/login with PBKDF2 password hashing (100,000 iterations, SHA-512), short-lived Access Tokens (15m), and rotated Refresh Tokens (7d) stored as SHA-256 hashes in MongoDB and HttpOnly cookies.
  * **Cryptographic Guest Sessions**: Instant zero-friction entry with HMAC-SHA256 timing-safe guest JWT tokens.
* **Match History & Analytics**: Post-match question-by-question review with participant-only authorization, accuracy tracking, and global leaderboards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TailwindCSS v4, Zustand v5, TanStack Query v5, Lucide Icons |
| **Backend** | Node.js (v20+), Express.js v4, TypeScript v5, Mongoose v8, Socket.IO v4, Zod v3, Pino v9 |
| **Database** | MongoDB (Mongoose ODM) with compound indexing for $O(\log N)$ leaderboard and ranking queries |
| **Security** | Node.js `crypto` (PBKDF2, HMAC-SHA256, timingSafeEqual), HttpOnly cookies, custom security headers |

---

## ⚙️ Architecture Overview

The system operates as a layered modular monolith with dual transport:
* **HTTP / REST (`/api/v1`)**: Handles stateless queries and transactional operations (authentication, room creation, category discovery, paginated history, and OpenAPI docs).
* **WebSocket (Socket.IO)**: Manages low-latency real-time events (`room:join`, `room:ready`, `room:update_settings`, `room:start_battle`, `battle:init`, `battle:submit_answer`, `battle:reveal`, `battle:completed`).

---

## 🏁 Local Development Setup

### 1. Prerequisites
* **Node.js**: v20 or higher
* **npm**: v10 or higher
* **MongoDB**: Local instance on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection URI

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/harshverma-25/CodeArena.git
cd CodeArena

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables
Set up environment files in both folders based on their templates:
```bash
# In server/
cp .env.example .env

# In client/
cp .env.example .env.local
```

### 4. Seed Categories & Questions
Initialize the database with master categories, subjects, and curated question banks:
```bash
cd server

# Seed master categories and subjects
npx tsx src/scripts/seed-categories.ts

# Seed initial question bank
npm run seed:questions
```

### 5. Start Development Servers
Run the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd client
npm run dev
```

* **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* **Interactive API Documentation (Swagger)**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
* **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🧪 Verification & Testing

Run the automated verification test suites:
```bash
cd server

# 1. Native JWT & Guest Authentication Suite (30 checkpoints)
npm run test:native-auth

# 2. Multiplayer Quiz Engine Suite (1-4 players, tie-breaking, answer secrecy)
npx tsx src/scripts/verify-multiplayer-quiz.ts

# 3. Category & Subject System Suite (hierarchy, mixed pools, idempotency)
npx tsx src/scripts/verify-category-subject-system.ts

# 4. Quiz Configuration & Category Timer Suite (10/15/20 Qs, 30s/60s timers)
npx tsx src/scripts/verify-quiz-configuration.ts

# 5. End-to-End Product Flow Suite (12 real-world scenarios)
npx tsx src/scripts/verify-product-flow.ts

# 6. Typecheck builds
npm run build
cd ../client && npm run build
```

---

## 📖 Documentation Quick Links

Comprehensive specifications are maintained in the [`docs/`](docs/) directory:
* [00 — Project Overview](docs/00-project-overview.md)
* [01 — Product Requirements](docs/01-product-requirements.md)
* [02 — System Architecture](docs/02-system-architecture.md)
* [03 — Frontend Architecture](docs/03-frontend-architecture.md)
* [04 — Backend Architecture](docs/04-backend-architecture.md)
* [05 — Database Architecture](docs/05-database-architecture.md)
* [06 — Authentication & Security](docs/06-authentication-security.md)
* [07 — Real-Time Socket Architecture](docs/07-realtime-socket-architecture.md)
* [08 — Quiz & Battle Engine](docs/08-battle-engine.md)
* [09 — API Reference](docs/09-api-reference.md)
* [10 — Environment Configuration](docs/10-environment-configuration.md)
* [11 — Development Guide](docs/11-development-guide.md)
* [12 — Testing Guide](docs/12-testing-guide.md)
* [13 — Deployment Guide](docs/13-deployment-guide.md)
* [14 — Coding Standards](docs/14-coding-standards.md)
* [15 — Known Issues & Technical Debt](docs/15-known-issues-and-technical-debt.md)

---

## 📄 License
ISC
