# CodeArena Backend Architecture (v1.0)

## Overview

This document defines the backend architecture of CodeArena.

The goal is to build a **scalable**, **maintainable**, and **production-ready** backend using a **Modular Layered Monolith** architecture.

---

# Tech Stack

| Layer          | Technology |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Framework      | Express.js |
| Language       | TypeScript |
| Database       | MongoDB    |
| ODM            | Mongoose   |
| Authentication | Clerk      |
| Validation     | Zod        |
| Realtime       | Socket.IO  |
| Code Execution | Judge0     |
| Logging        | Pino       |
| Environment    | dotenv     |

---

# Architecture Style

We will use a **Modular Layered Monolith**.

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MongoDB
```

### Layer Responsibilities

#### Routes

* Define API endpoints
* Attach middleware
* Forward requests to controllers

No business logic.

---

#### Controllers

Responsible for:

* Reading request data
* Calling services
* Returning HTTP responses

No database queries.

---

#### Services

Responsible for:

* Business logic
* Match rules
* Winner calculation
* Judge0 integration
* Room validation

This is where most application logic lives.

---

#### Repositories

Responsible for:

* MongoDB queries
* CRUD operations
* Aggregation pipelines

No business logic.

---

#### Models

Contain only Mongoose schemas.

---

#### Validators

Contain Zod validation schemas.

---

# Folder Structure

```text
server/
│
├── src/
│
│   ├── app.ts
│   ├── server.ts
│
│   ├── config/
│   │     ├── database.ts
│   │     ├── env.ts
│   │     ├── logger.ts
│   │     └── clerk.ts
│   │
│   ├── modules/
│   │
│   │     ├── user/
│   │     ├── problem/
│   │     ├── room/
│   │     ├── match/
│   │     └── submission/
│   │
│   ├── sockets/
│   │
│   ├── middleware/
│   │
│   ├── shared/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   └── constants/
│
└── package.json
```

---

# Module Structure

Every module follows exactly the same structure.

Example

```text
problem/

├── problem.controller.ts

├── problem.service.ts

├── problem.repository.ts

├── problem.model.ts

├── problem.routes.ts

├── problem.validation.ts

├── problem.types.ts
```

This consistency makes the project easier to maintain.

---

# Request Flow

```text
HTTP Request
      │
      ▼
Express Route
      │
      ▼
Authentication Middleware
      │
      ▼
Validation Middleware
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
MongoDB
      │
      ▼
Controller
      │
      ▼
HTTP Response
```

---

# Authentication Flow

Authentication is handled by Clerk.

```text
Client

↓

Clerk Login

↓

JWT

↓

Authorization Header

↓

Backend

↓

Verify Token

↓

req.user

↓

Continue Request
```

Backend never handles:

* Passwords
* Login
* Registration
* Sessions

---

# Validation Flow

Every request is validated using Zod.

```text
Request

↓

Zod Validation

↓

Valid

↓

Controller

↓

Service
```

If validation fails:

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": []
}
```

---

# Error Handling

Centralized error handling.

```text
Route

↓

Controller

↓

Service

↓

Throw Error

↓

Global Error Middleware

↓

JSON Response
```

Controllers should not contain try/catch blocks unless necessary.

---

# Logging

Use **Pino** for structured logging.

Log:

* Server start
* Database connection
* Room creation
* Match creation
* Judge0 failures
* Unexpected errors

Never log:

* JWT tokens
* Source code
* Hidden test cases

---

# Socket.IO Architecture

```text
Socket Connected
        │
        ▼
Authenticate
        │
        ▼
Join Socket Room
        │
        ▼
Listen Events
        │
        ▼
Emit Updates
```

Socket handlers should be separated by module.

Example

```text
sockets/

├── room.socket.ts

├── match.socket.ts

├── submission.socket.ts

└── socket.ts
```

Avoid putting every event in one huge file.

---

# Judge0 Integration

Judge0 is used only for code execution.

```text
Submission

↓

Service

↓

Judge0

↓

Execution Result

↓

Evaluate Hidden Test Cases

↓

Save Submission

↓

Emit Result
```

Judge0 never decides:

* Winner
* Match result

Those decisions belong to the backend.

---

# Database Access Rule

Only repositories communicate with MongoDB.

```text
Controller

❌ No database query

Service

❌ No database query

Repository

✅ Database query
```

This keeps responsibilities clear.

---

# Business Logic Rule

Business logic belongs only inside Services.

Examples:

* Can the match start?
* Is the room full?
* Has the player already joined?
* Did someone win?
* Should the room be deleted?

Never place these rules in controllers.

---

# Configuration

All configuration comes from environment variables.

Example

```text
PORT

MONGODB_URI

CLERK_SECRET_KEY

JUDGE0_URL

JUDGE0_API_KEY

NODE_ENV
```

Never hardcode secrets.

---

# Coding Standards

* Use TypeScript everywhere.
* Use async/await.
* No callback-based code.
* Keep functions small.
* Prefer dependency injection where practical.
* Write meaningful variable names.
* Avoid duplicated logic.

---

# Module Dependencies

```text
User

Problem

Room

Match

Submission
```

Dependency graph

```text
Submission

↓

Match

↓

Room

↓

Problem

↓

User
```

Avoid circular dependencies.

---

# Design Principles

## Single Responsibility

Each module has one responsibility.

---

## Separation of Concerns

Routes

↓

Controllers

↓

Services

↓

Repositories

Each layer has one job.

---

## Consistency

Every module follows the same structure.

Developers should know exactly where to find:

* Routes
* Services
* Validation
* Repository

---

## Scalability

The architecture should support future features without major restructuring.

Possible future modules:

```text
Tournament

Leaderboard

Organization

Notification

Chat

Achievements

Editorial

Admin
```

These can be added without affecting existing modules.

---

# Final Backend Flow

```text
Client
    │
    ▼
REST API / Socket.IO
    │
    ▼
Authentication
    │
    ▼
Validation
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
MongoDB

             │
             ▼

         Judge0

             │
             ▼

      Socket.IO Events

             │
             ▼

          Client
```

---

# Architecture Goals

* Maintainable
* Scalable
* Testable
* Modular
* Easy to understand
* Production-ready
* Consistent across all modules

This architecture forms the implementation blueprint for CodeArena Version 1.
