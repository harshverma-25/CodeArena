# Quizzy (CodeArena) — Active Issues & Technical Problems Register

**Document Version**: 8.0.0  
**Updated**: October 2026  
**Status**: All Technical Debt & Architecture Issues Resolved  
**Scope**: Full-stack application (`client/`, `server/`, database schemas, configuration, and real-time multiplayer engine).

> [!NOTE]
> Per project directives, Category and Quiz Question population tasks are managed separately via Admin UI / CLI seeder and intentionally excluded from this register. All identified technical defects, security risks, and architecture debt have been resolved.

---

## 1. System Health & Issue Status

| Issue Area | Previous Problem | Resolution | Current Status |
| :--- | :--- | :--- | :---: |
| **API Rate Limiting** | Health check probes exhausted 500-req limit | Explicit `/health` and `/api/v1/health` bypass added | ✅ **Resolved** |
| **CORS Security** | Wildcard `*` reflection with credentials in production | Zod `CORS_ORIGIN` validation & strict origin parsing | ✅ **Resolved** |
| **Client Configuration** | Hardcoded localhost fallbacks in client bundles | Centralized `clientConfig` with origin fallback | ✅ **Resolved** |
| **Socket Horizontal Scaling** | In-memory adapter isolated across cluster instances | Added `@socket.io/redis-adapter` with `REDIS_URI` | ✅ **Resolved** |
| **Avatar Privacy & Offline** | External Dicebear CDN dependency failed offline | Offline-resilient inline SVG data URI generators | ✅ **Resolved** |
| **Database Scalability** | Unbounded room growth and code collision risk | Pruning completed rooms older than 7d in GC | ✅ **Resolved** |
| **Mobile Web Resilience** | Mobile Safari backgrounding froze turn sync | Visibility & online hooks with proactive recovery | ✅ **Resolved** |

---

## 2. Architecture & Operational Standards

### 2.1 Multi-Node Cluster Scaling
* **Single-Node Mode**: Zero-configuration default; uses high-performance in-memory adapter.
* **Clustered / PM2 / Container Replica Mode**: Set `REDIS_URI=redis://username:password@host:port` in `server/.env`. Socket.IO automatically bridges room broadcasts and player state across all nodes.

### 2.2 Offline Avatar Generation
* Registered users and guest accounts receive self-contained SVG avatars encoded as `data:image/svg+xml;utf8,...`.
* Zero third-party network requests are made, ensuring complete data privacy and 100% offline functionality.

### 2.3 Room Lifecycle & Code Garbage Collection
* Active games and matchmaking remain transient in the `rooms` collection.
* WAITING rooms older than 2 hours are cleaned up automatically.
* FINISHED and CANCELLED rooms older than 7 days are automatically pruned, keeping MongoDB lightweight and freeing room codes for reuse.
* Complete match history, answers, scores, and timestamps are permanently preserved in `battles`.

### 2.4 Mobile OS Backgrounding Resilience
* Mobile Safari and Android Chrome tab backgrounding/screen locking events are captured via `visibilitychange` and `online` event handlers.
* When the mobile device is foregrounded, the client proactively verifies socket health and re-synchronizes the current question turn with the server.
