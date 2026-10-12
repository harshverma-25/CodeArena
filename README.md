# QUIZZY — Real-Time Multiplayer Quiz Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-gray?logo=express)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-green?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**QUIZZY** is a high-performance, real-time multiplayer quiz and trivia platform built with Next.js 16, Node.js, Express, Socket.IO, and MongoDB. Players can join 1–4 player competitive rooms via shareable room codes or practice in solo mode, answering questions against server-authoritative timers with dynamic speed scoring and synchronized round reveals.

---

## Table of Contents

- [Key Features](#key-features)
- [Quiz Modes & Categories](#quiz-modes--categories)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Local Installation & Setup](#local-installation--setup)
- [Environment Variables](#environment-variables)
- [Running in Development](#running-in-development)
- [Build & Verification Scripts](#build--verification-scripts)
- [Deployment Overview](#deployment-overview)
- [Security Features](#security-features)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Key Features

- **1–4 Player Real-Time Multiplayer**: Room creation, 6-character room codes, shareable invite links, host controls, real-time participant readiness toggles, and live room state synchronization via Socket.IO.
- **Solo Practice Mode**: Immediate single-player drills without waiting for room lobbies.
- **Server-Authoritative Anti-Cheat**: Questions are dispatched round-by-round. Correct answers and explanations remain strictly on the server until the synchronized round reveal. Client timers are representational, and all deadlines and scores are verified server-side.
- **Dynamic Speed Scoring**: Correct answers award points on a decaying curve:
  $$\text{Score} = \max(100, 1000 - (\text{elapsedSeconds} \times 30))$$
  Incorrect or timed-out submissions award 0 points.
- **Synchronized Round Reveals & Podium**: Displays question explanations, answer distributions, player responses, and cumulative leaderboard standings after each round, ending in a 1st–4th place podium celebration.
- **Dual Authentication**:
  - **Native JWT**: User registration and login with PBKDF2 password hashing (100,000 iterations, SHA-512), 15-minute access tokens, and rotating 7-day refresh tokens stored as SHA-256 hashes in MongoDB and HttpOnly cookies.
  - **Cryptographic Guest Sessions**: Instant one-click play using timing-safe HMAC-SHA256 guest tokens without email registration.
  - **Procedural SVG Avatars**: Deterministic, lightweight inline SVG avatars generated without external CDN dependencies.
- **Match History & Global Leaderboards**: Match review detailing question-by-question breakdown, personal accuracy tracking, win rates, and global leaderboard rankings.
- **Admin Management Suite**: Protected `/admin` panel for managing categories and subjects, creating/editing questions, reviewing match histories, and batch-importing questions via JSON or CSV with preview validation.
- **Interactive OpenAPI / Swagger Documentation**: Self-hosted Swagger UI available at `/api/docs`.

---

## Quiz Modes & Categories

### Game Modes

1. **Multiplayer Arena (1–4 Players)**: Competitive lobby where the host selects category/subject, question count, and difficulty. All players answer the same questions synchronously.
2. **Solo Practice**: Instant single-player session to practice specific topics at your own pace.

### Question Counts & Difficulty
- **Question Counts**: 10, 15, or 20 questions per match.
- **Difficulties**: Easy, Medium, Hard, or Random.

### Categories, Subjects & Timers

Timer limits are server-derived per category to match the complexity of the subject:

| Category | Time Limit | Subjects |
| :--- | :---: | :--- |
| **Programming** | 30s / question | Data Structures & Algorithms (DSA), Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Programming (OOP), JavaScript, TypeScript, Python, React, Pseudocode |
| **Aptitude** | 60s / question | Logical Reasoning, Quantitative Aptitude, Verbal Ability, Data Interpretation |
| **General Knowledge** | 30s / question | History, Geography, Science, Current Affairs, General Trivia |
| **Science** | 30s / question | Physics, Chemistry, Biology |

> **Mixed Category Mode**: When selected, the engine balances question sampling across all subjects within that category for diverse matchups.

---

## Screenshots

> *Screenshots below illustrate the core interface. Replace placeholders with actual application captures as new theme updates are deployed.*

| Screen | Preview Placeholder |
| :--- | :--- |
| **Home & Category Discovery** | ![Home Screen Placeholder](https://via.placeholder.com/800x450/1e293b/ffffff?text=Quizzy+-+Home+%26+Categories) |
| **Multiplayer Lobby** | ![Lobby Screen Placeholder](https://via.placeholder.com/800x450/1e293b/ffffff?text=Quizzy+-+Lobby+%26+Room+Code) |
| **Live Battle Arena** | ![Battle Arena Placeholder](https://via.placeholder.com/800x450/1e293b/ffffff?text=Quizzy+-+Live+Battle+Arena) |
| **Round Reveal & Podium** | ![Round Reveal Placeholder](https://via.placeholder.com/800x450/1e293b/ffffff?text=Quizzy+-+Round+Reveal+%26+Podium) |
| **Admin Management** | ![Admin Screen Placeholder](https://via.placeholder.com/800x450/1e293b/ffffff?text=Quizzy+-+Admin+Dashboard) |

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.js.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand v5](https://github.com/pmndrs/zustand)
- **Server State & Caching**: [TanStack React Query v5](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v20+)
- **Framework**: [Express.js v4](https://expressjs.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Validation**: [Zod v3](https://zod.dev/)
- **Logging**: [Pino v9](https://getpino.io/) & `pino-pretty`
- **Security**: Native Node.js `crypto` (PBKDF2, HMAC-SHA256, timingSafeEqual)

### Real-Time Communication
- **Engine**: [Socket.IO v4](https://socket.io/) (WebSockets with polling fallback)
- **Clustering (Optional)**: `@socket.io/redis-adapter` with `ioredis` for multi-instance scaling

### Database & Storage
- **Primary Database**: [MongoDB](https://www.mongodb.com/) (Mongoose v8 ODM)
- **Indexing**: Compound indexes on match histories, user statistics, and categories for fast leaderboards and queries

---

## Architecture Overview

QUIZZY is structured as a full-stack TypeScript project with distinct client and server applications:

```text
code-arena/
├── client/                     # Next.js 16 App Router Frontend
│   ├── app/
│   │   ├── (admin)/admin/      # Category, question & import management
│   │   ├── (match)/results/    # Match results, podium & review
│   │   ├── (protected)/        # Lobby, battle arena, history, leaderboard, profile
│   │   └── (public)/           # Landing page, category catalogue, login, register
│   ├── components/             # Reusable UI, battle, lobby, and navbar components
│   ├── hooks/                  # Custom React hooks (sockets, auth, timers)
│   ├── lib/                    # API client, socket connection, utilities
│   ├── providers/              # React Query and app context providers
│   └── stores/                 # Zustand global client stores
│
└── server/                     # Express & Socket.IO Backend Service
    ├── src/
    │   ├── config/             # Environment validation, database, logger
    │   ├── middlewares/        # Auth guards, error handlers, rate limiting
    │   ├── modules/            # Domain modules (admin, auth, battle, category,
    │   │                       # question, room, user, history, leaderboard, docs)
    │   ├── scripts/            # Database seeders and test verification suites
    │   ├── sockets/            # Socket.IO connection handlers & battle gateway
    │   └── server.ts           # HTTP server and WebSocket initialization
```

### Communication Flow
1. **REST API (`/api/v1`)**: Handles stateless queries and transactional workflows (authentication, user profile, category exploration, room initialization, and OpenAPI docs).
2. **WebSocket Gateway**: Handles real-time lobby state changes (`room:join`, `room:ready`, `room:update_settings`, `room:start_battle`) and round-by-round quiz progression (`battle:init`, `battle:submit_answer`, `battle:reveal`, `battle:completed`).

---

## Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- **Git**

---

## Local Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/harshverma-25/CodeArena.git
cd CodeArena
```

### 2. Install Dependencies

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## Environment Variables

### Server Configuration (`server/.env`)

Create a `.env` file in the `server/` directory:

```bash
# Server Port & Runtime
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/codearena

# JWT Secrets (Minimum 32 characters for production)
JWT_ACCESS_SECRET=your_native_access_jwt_secret_key_32_bytes_min
JWT_REFRESH_SECRET=your_native_refresh_jwt_secret_key_32_bytes_min
GUEST_JWT_SECRET=your_secure_guest_jwt_secret_key_32_bytes_min

# Token Lifespans (in seconds)
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800

# CORS & Allowed Origins
CORS_ORIGIN=http://localhost:3000

# Logging Level ('debug' | 'info' | 'warn' | 'error')
LOG_LEVEL=info

# Optional: Redis Pub/Sub URI (for multi-instance clustering)
# REDIS_URI=redis://127.0.0.1:6379
```

### Client Configuration (`client/.env.local`)

Create a `.env.local` file in the `client/` directory:

```bash
# Backend REST API and WebSocket Gateway
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## Running in Development

### 1. Seed the Database

Initialize categories, subjects, an initial admin user, and the question bank:

```bash
cd server

# Seed master categories and subjects
npx tsx src/scripts/seed-categories.ts

# Seed initial admin account
npx tsx src/scripts/seed-admin.ts

# Seed initial question bank
npm run seed:questions
```

### 2. Start the Backend Server

```bash
cd server
npm run dev
```
- Backend server runs at: `http://localhost:5000`
- Interactive Swagger API docs: `http://localhost:5000/api/docs`
- Health check: `http://localhost:5000/health`

### 3. Start the Frontend Application

In a separate terminal:

```bash
cd client
npm run dev
```
- Frontend application runs at: `http://localhost:3000`

---

## Build & Verification Scripts

### Production Builds

```bash
# Build backend (TypeScript compilation to dist/)
cd server
npm run build

# Build frontend (Next.js production bundle)
cd ../client
npm run build
```

### Run in Production Mode

```bash
# Start backend service
cd server
npm run start

# Start frontend service
cd ../client
npm run start
```

### Automated Verification Scripts

The project includes specialized verification test suites in `server/src/scripts/` to validate engine logic without requiring external runners:

```bash
cd server

# Verify native JWT and guest session flows
npm run test:native-auth
npm run test:guest

# Verify environment variable security rules
npm run test:security

# Verify multiplayer quiz engine (scoring, timer integrity, answer withholding)
npx tsx src/scripts/verify-multiplayer-quiz.ts

# Verify category and subject hierarchy
npx tsx src/scripts/verify-category-subject-system.ts

# Verify quiz configuration rules (question counts, timer mapping)
npx tsx src/scripts/verify-quiz-configuration.ts

# Verify end-to-end product flow
npx tsx src/scripts/verify-product-flow.ts
```

---

## Deployment Overview

### 1. Frontend on Vercel
1. Import the repository into [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `client`.
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend API URL (e.g., `https://api.yourdomain.com/api/v1`)
   - `NEXT_PUBLIC_WS_URL`: Your deployed WebSocket URL (e.g., `https://api.yourdomain.com`)
5. Deploy.

### 2. Backend on Render / Railway
1. Create a new **Web Service** pointing to the repository.
2. Set the **Root Directory** to `server`.
3. Set the **Build Command** to: `npm install && npm run build`
4. Set the **Start Command** to: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or the port provided by the host)
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `CORS_ORIGIN`: Your deployed frontend origin (e.g., `https://your-app.vercel.app`)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `GUEST_JWT_SECRET`: Secure 32+ character random strings

### 3. Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. In **Network Access**, whitelist your hosting provider's IP address (or `0.0.0.0/0` with strong authentication).
3. In **Database Access**, create a user with read/write privileges.
4. Copy the connection string into your backend `MONGODB_URI`.

---

## Security Features

- **Strict Answer Secrecy**: The server removes correct option indices and explanations from question payloads before sending them to clients. Answers and explanations are emitted only during the round reveal event after all submissions are locked or time expires.
- **Server-Authoritative Timing**: Round deadlines are stored and evaluated on the server. Client-reported durations are validated against server round timestamps to prevent client-side timer manipulation.
- **Cryptographic Password Storage**: Native user passwords are encrypted using PBKDF2 with 100,000 iterations, 64-byte keys, SHA-512, and unique salts.
- **Token Rotation & Revocation**: Refresh tokens are stored as SHA-256 hashes in MongoDB and delivered via HttpOnly, SameSite cookies. Refresh tokens rotate on each issuance.
- **Timing-Safe Guest Verification**: Guest tokens use HMAC-SHA256 and are validated using `crypto.timingSafeEqual` to prevent timing attacks.
- **Schema Validation**: All HTTP route bodies, queries, and params are validated with Zod schemas.

---

## Contribution Guidelines

Contributions, issues, and feature proposals are welcome:

1. **Fork the Repository** and create your branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Implement your changes**:
   - Adhere to the existing TypeScript and ESLint formatting.
   - Maintain modular architecture inside `server/src/modules/` and `client/app/`.
3. **Validate**:
   - Ensure `npm run build` succeeds in both `client/` and `server/`.
   - Run relevant verification suites in `server/`.
4. **Commit & Open a Pull Request**:
   - Write clear, descriptive commit messages.
   - Open a PR against the `main` branch.

---

## License

This project is licensed under the [ISC License](LICENSE).
