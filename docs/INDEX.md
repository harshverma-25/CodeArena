# CodeArena — Documentation Index

Welcome to the comprehensive, single-source-of-truth documentation repository for **CodeArena**, a real-time 1–4 player multiplayer competitive general-purpose quiz platform.

---

## 📚 Complete Documentation Catalogue

| # | Document | Primary Scope |
| :-: | :--- | :--- |
| **00** | [Project Overview](00-project-overview.md) | Platform mission, executive summary, high-level feature matrix, and core tech stack. |
| **01** | [Product Requirements](01-product-requirements.md) | User personas, core user stories, functional flows, anti-cheat guarantees, and non-functional requirements. |
| **02** | [System Architecture](02-system-architecture.md) | High-level topology, client-server interaction models, dual transport design (HTTP/WebSocket), and fault tolerance. |
| **03** | [Frontend Architecture](03-frontend-architecture.md) | Next.js 16 App Router hierarchy, route groups, feature modules, Zustand state management, and UI design tokens. |
| **04** | [Backend Architecture](04-backend-architecture.md) | Layered modular monolith (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories), centralized error handling, and middleware pipelines. |
| **05** | [Database Architecture](05-database-architecture.md) | MongoDB collections (`users`, `categories`, `subjects`, `rooms`, `questions`, `battles`), Mongoose schemas, compound indexes, and atomic updates. |
| **06** | [Authentication & Security](06-authentication-security.md) | Native JWT authentication (Access + Refresh tokens), custom guest sessions via timing-safe HMAC JWTs, RBAC policies, and rate limiting. |
| **07** | [Real-Time Socket Architecture](07-realtime-socket-architecture.md) | Socket.IO gateway, handshake authentication, room coordination (`room:*`), live battle telemetry (`battle:*`), and connection recovery. |
| **08** | [Quiz & Battle Engine](08-battle-engine.md) | 1–4 player match orchestrator, category/subject question selection, server timers, scoring logic, and atomic quiz completion. |
| **09** | [API Reference](09-api-reference.md) | Complete REST API catalogue (`/auth`, `/users`, `/leaderboard`, `/questions`, `/rooms`, `/battles`, `/history`), payload schemas, and responses. |
| **10** | [Environment Configuration](10-environment-configuration.md) | Client and server environment variable schemas, Zod validation rules, defaults, and secrets management. |
| **11** | [Development Guide](11-development-guide.md) | Local development setup, prerequisite tooling, monorepo run commands, database seeding, and workflow etiquette. |
| **12** | [Testing Guide](12-testing-guide.md) | Test suites (`test:security`, `test:guest`, `test:task2-1`), standalone integration scripts, and dry-run reconciliation. |
| **13** | [Deployment Guide](13-deployment-guide.md) | Production build preparation, process lifecycle, reverse proxy configuration, health diagnostics, and containerization. |
| **14** | [Coding Standards](14-coding-standards.md) | TypeScript conventions, strict naming rules, API response wrappers, error propagation, and architectural guidelines. |
| **15** | [Known Issues & Technical Debt](15-known-issues-and-technical-debt.md) | Audit findings, rate limiter cleanup requirements (Task 2.2), legacy artifacts, and optimization backlog. |
| **Audit** | [Project Issues Register](issue.md) | Comprehensive audit register of UI/UX, authentication, real-time, database, and feature issues. |

---

## 🧭 Navigation & AI Agent Directives

* For AI agents and developers seeking guidelines on how to navigate the repository, see the root [`AGENTS.md`](../AGENTS.md).
* All documentation files contain cross-document relative links to enable fast contextual traversal.
