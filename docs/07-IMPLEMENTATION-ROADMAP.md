# CodeArena Implementation Roadmap (v1.0)

## Overview

This roadmap defines the recommended order for implementing CodeArena. Each phase builds on the previous one, minimizing rework and keeping the project deployable throughout development.

---

# Development Phases

| Phase | Module               | Status |
| ----- | -------------------- | ------ |
| 1     | Project Setup        | ⬜      |
| 2     | Database & Models    | ⬜      |
| 3     | Authentication       | ⬜      |
| 4     | User Module          | ⬜      |
| 5     | Problem Module       | ⬜      |
| 6     | Room Module          | ⬜      |
| 7     | Socket.IO            | ⬜      |
| 8     | Match Module         | ⬜      |
| 9     | Judge0 Integration   | ⬜      |
| 10    | Submission Module    | ⬜      |
| 11    | Frontend Integration | ⬜      |
| 12    | Testing & Deployment | ⬜      |

---

# Phase 1 — Project Setup

## Objectives

* Initialize backend project
* Configure TypeScript
* Configure Express
* Configure environment variables
* Configure logging

## Tasks

* Initialize Node.js project
* Install dependencies
* Configure TypeScript
* Configure ESLint
* Configure Prettier
* Configure Husky (optional)
* Create folder structure
* Configure Pino
* Configure dotenv

### Deliverables

* Express server running
* Health API working
* Logger configured
* Environment validation

---

# Phase 2 — Database & Models

## Objectives

Create MongoDB schemas.

### Tasks

* Connect MongoDB
* Create User model
* Create Problem model
* Create Room model
* Create Match model
* Create Submission model

### Deliverables

* Database connected
* All schemas created
* Indexes added

---

# Phase 3 — Authentication

## Objectives

Integrate Clerk.

### Tasks

* Verify JWT
* Authentication middleware
* Protected routes
* Current user extraction

### Deliverables

* Authentication working
* Unauthorized requests blocked

---

# Phase 4 — User Module

## APIs

```text
GET    /users/me

PATCH  /users/me

GET    /users/:username
```

### Tasks

* User repository
* User service
* User controller
* Validation
* Profile updates

### Deliverables

* User profile APIs complete

---

# Phase 5 — Problem Module

## APIs

```text
GET /problems

GET /problems/:slug

GET /problems/random
```

### Tasks

* CRUD (admin/internal)
* Pagination
* Search
* Topic filter
* Difficulty filter

### Deliverables

* Problem APIs complete

---

# Phase 6 — Room Module

## APIs

```text
POST   /rooms

POST   /rooms/join

GET    /rooms/:roomCode

PATCH  /rooms/:roomCode/ready

PATCH  /rooms/:roomCode/settings

POST   /rooms/:roomCode/leave

DELETE /rooms/:roomCode
```

### Tasks

* Room creation
* Join validation
* Leave room
* Host validation
* Ready system
* Room cleanup

### Deliverables

* Room management complete

---

# Phase 7 — Socket.IO

## Objectives

Implement real-time communication.

### Tasks

* Socket server
* Authentication
* Room joining
* Room broadcasting
* Ready events
* Reconnection handling
* Timer events

### Deliverables

* Real-time lobby working

---

# Phase 8 — Match Module

## APIs

```text
POST /matches/start

GET /matches/:matchId

GET /matches/history
```

### Tasks

* Match creation
* Random problem selection
* Winner calculation
* Match completion
* Match history

### Deliverables

* Match lifecycle complete

---

# Phase 9 — Judge0 Integration

## Objectives

Execute submitted code.

### Tasks

* Judge0 client
* Submit code
* Poll execution result
* Parse verdict
* Handle execution errors

### Deliverables

* Code execution working

---

# Phase 10 — Submission Module

## APIs

```text
POST /submissions

GET /submissions/:submissionId

GET /matches/:matchId/submissions
```

### Tasks

* Save submissions
* Judge integration
* Verdict processing
* Statistics updates
* Winner detection

### Deliverables

* Submission workflow complete

---

# Phase 11 — Frontend Integration

## Objectives

Connect Next.js frontend.

### Tasks

* Clerk authentication
* Axios client
* Socket.IO client
* Match screen
* Lobby
* Code editor
* Timer
* Result screen

### Deliverables

* End-to-end gameplay working

---

# Phase 12 — Testing & Deployment

## Testing

### Unit Testing

* Services
* Validation
* Utilities

### Integration Testing

* API endpoints
* Socket events
* Database

### Manual Testing

* Create room
* Join room
* Disconnect
* Reconnect
* Submit code
* Finish match

---

## Deployment

### Backend

* Railway / Render

### Frontend

* Vercel

### Database

* MongoDB Atlas

### Environment Variables

```text
PORT

NODE_ENV

MONGODB_URI

CLERK_SECRET_KEY

CLERK_PUBLISHABLE_KEY

JUDGE0_URL

JUDGE0_API_KEY
```

---

# Milestones

## Milestone 1

✅ Backend boots successfully

Includes:

* Express
* MongoDB
* Clerk
* Logger

---

## Milestone 2

✅ Lobby system works

Includes:

* Room creation
* Join room
* Ready state
* Socket updates

---

## Milestone 3

✅ Match system works

Includes:

* Start match
* Random problem
* Timer
* End match

---

## Milestone 4

✅ Judge0 integration

Includes:

* Code execution
* Verdict
* Submission storage

---

## Milestone 5

✅ MVP Complete

Includes:

* Full gameplay
* Match history
* Stable deployment

---

# Recommended Git Workflow

Use feature branches for every module.

```text
main

├── feature/auth

├── feature/user

├── feature/problem

├── feature/room

├── feature/socket

├── feature/match

├── feature/submission

└── feature/frontend
```

Merge only after:

* Code review
* Local testing
* Build passes

---

# MVP Checklist

## Backend

* [ ] Express setup
* [ ] MongoDB
* [ ] Clerk
* [ ] User module
* [ ] Problem module
* [ ] Room module
* [ ] Match module
* [ ] Submission module
* [ ] Socket.IO
* [ ] Judge0 integration

## Frontend

* [ ] Authentication
* [ ] Dashboard
* [ ] Create room
* [ ] Join room
* [ ] Lobby
* [ ] Code editor
* [ ] Match timer
* [ ] Result page
* [ ] Match history

---

# Definition of Done

CodeArena MVP is considered complete when:

* Users can authenticate with Clerk.
* A host can create a private room.
* Another player can join using a room code.
* Both players can mark themselves ready.
* The host can start the match.
* A random problem is assigned.
* Both players can write and submit code.
* Judge0 evaluates submissions.
* The backend determines the winner.
* Match history is stored.
* The application is deployed and playable online.

---

# Final Roadmap

```text
Planning
    │
    ▼
Backend Setup
    │
    ▼
Database
    │
    ▼
Authentication
    │
    ▼
Problem Module
    │
    ▼
Room Module
    │
    ▼
Socket.IO
    │
    ▼
Match Module
    │
    ▼
Judge0
    │
    ▼
Submission Module
    │
    ▼
Frontend Integration
    │
    ▼
Testing
    │
    ▼
Deployment
    │
    ▼
🚀 CodeArena MVP
```
