# CodeArena Database Design (v1.0)

## Overview

This document defines the MongoDB database design for **CodeArena**, a real-time 1v1 coding battle platform.

### Database

* MongoDB
* Mongoose ODM
* Clerk Authentication

---

# Collections

CodeArena consists of **5 collections**.

| Collection | Purpose                                               |
| ---------- | ----------------------------------------------------- |
| User       | Stores CodeArena-specific user profile and statistics |
| Problem    | Stores coding problems and hidden test cases          |
| Room       | Temporary multiplayer lobby before and during a match |
| Match      | Permanent record of completed matches                 |
| Submission | Stores every code submission made by players          |

---

# Database Relationships

```text
                User
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
      Room              Submission
        │                   │
        ▼                   │
      Match ────────────────┘
        │
        ▼
     Problem
```

---

# 1. User Collection

## Purpose

Stores user information specific to CodeArena.

Authentication is managed by **Clerk**, so passwords and sessions are **not** stored.

---

### Fields

| Field               | Type     | Required | Description              |
| ------------------- | -------- | -------- | ------------------------ |
| _id                 | ObjectId | Yes      | MongoDB ID               |
| clerkId             | String   | Yes      | Clerk user identifier    |
| username            | String   | Yes      | Unique username          |
| displayName         | String   | Yes      | User display name        |
| avatar              | String   | No       | Profile image URL        |
| matchesPlayed       | Number   | Yes      | Total matches played     |
| wins                | Number   | Yes      | Total wins               |
| losses              | Number   | Yes      | Total losses             |
| draws               | Number   | Yes      | Total draws              |
| totalSubmissions    | Number   | Yes      | Total submissions        |
| acceptedSubmissions | Number   | Yes      | Accepted submissions     |
| highestWinStreak    | Number   | Yes      | Highest consecutive wins |
| preferredLanguage   | String   | Yes      | Default editor language  |
| createdAt           | Date     | Yes      | Creation timestamp       |
| updatedAt           | Date     | Yes      | Last update timestamp    |

---

## Indexes

* clerkId (Unique)
* username (Unique)

---

# 2. Problem Collection

## Purpose

Stores coding problems, examples, starter code, hidden test cases and reference solutions.

---

### Fields

| Field              | Type            | Description                    |
| ------------------ | --------------- | ------------------------------ |
| _id                | ObjectId        | Problem ID                     |
| title              | String          | Problem title                  |
| slug               | String          | URL-friendly identifier        |
| topic              | Enum            | Arrays, Strings, Trees, etc.   |
| difficulty         | Enum            | Easy, Medium, Hard             |
| status             | Enum            | Draft, Published, Archived     |
| description        | Markdown String | Complete problem statement     |
| inputFormat        | String          | Input description              |
| outputFormat       | String          | Output description             |
| constraints        | String          | Constraints in Markdown        |
| examples           | Array           | Visible examples               |
| starterCode        | Object          | Starter code for each language |
| hiddenTestCases    | Array           | Hidden judge test cases        |
| referenceSolutions | Object          | Official solutions             |
| timeLimit          | Number          | Seconds                        |
| memoryLimit        | Number          | MB                             |
| tags               | Array           | Related concepts               |
| points             | Number          | Match points                   |
| createdAt          | Date            | Creation timestamp             |
| updatedAt          | Date            | Last update timestamp          |

---

### Example Structure

```text
Problem
│
├── title
├── slug
├── topic
├── difficulty
│
├── description (Markdown)
├── inputFormat
├── outputFormat
├── constraints
│
├── examples[]
│
├── starterCode
│     ├── Java
│     ├── C++
│     ├── Python
│     ├── JavaScript
│     └── TypeScript
│
├── hiddenTestCases[]
│
├── referenceSolutions
│
├── tags[]
├── points
├── timeLimit
└── memoryLimit
```

---

## Indexes

* slug (Unique)
* topic
* difficulty
* status

---

# 3. Room Collection

## Purpose

Represents a multiplayer lobby before and during a match.

Rooms are temporary.

---

### Fields

| Field      | Type     | Description             |
| ---------- | -------- | ----------------------- |
| _id        | ObjectId | Room ID                 |
| roomCode   | String   | Shareable room code     |
| hostId     | ObjectId | Reference to User       |
| players    | Array    | Joined players          |
| settings   | Object   | Match configuration     |
| maxPlayers | Number   | Maximum allowed players |
| status     | Enum     | Room status             |
| matchId    | ObjectId | Active match reference  |
| createdAt  | Date     | Creation timestamp      |
| updatedAt  | Date     | Last update timestamp   |

---

### Players Structure

```text
players[]
│
├── userId
├── isHost
└── isReady
```

---

### Settings Structure

```text
settings
│
├── topic
├── difficulty
├── duration
├── language (future)
├── allowResubmission (future)
└── maxAttempts (future)
```

---

### Room Status

```text
WAITING

READY

IN_PROGRESS

FINISHED

CANCELLED
```

---

## Indexes

* roomCode (Unique)
* hostId
* status

---

# 4. Match Collection

## Purpose

Permanent record of every coding battle.

---

### Fields

| Field     | Type     | Description              |
| --------- | -------- | ------------------------ |
| _id       | ObjectId | Match ID                 |
| roomId    | ObjectId | Room reference           |
| problemId | ObjectId | Selected problem         |
| players   | Array    | Match participants       |
| winnerId  | ObjectId | Winning player           |
| status    | Enum     | Match result             |
| startedAt | Date     | Match start              |
| endedAt   | Date     | Match end                |
| duration  | Number   | Match duration (seconds) |
| createdAt | Date     | Creation timestamp       |
| updatedAt | Date     | Last update timestamp    |

---

### Match Status

```text
COMPLETED

DRAW

ABANDONED

CANCELLED
```

---

## Indexes

* roomId
* problemId
* winnerId
* startedAt

---

# 5. Submission Collection

## Purpose

Stores every code submission.

Each click on **Submit** creates a new document.

---

### Fields

| Field            | Type     | Description             |
| ---------------- | -------- | ----------------------- |
| _id              | ObjectId | Submission ID           |
| matchId          | ObjectId | Match reference         |
| userId           | ObjectId | User reference          |
| submissionNumber | Number   | Submission order        |
| language         | String   | Programming language    |
| sourceCode       | String   | User code               |
| verdict          | Enum     | Judge result            |
| executionTime    | Number   | Runtime (ms)            |
| memoryUsed       | Number   | Memory (MB)             |
| passedTestCases  | Number   | Passed tests            |
| totalTestCases   | Number   | Total tests             |
| stdout           | String   | Program output          |
| stderr           | String   | Runtime error output    |
| compileOutput    | String   | Compiler output         |
| isFinalAccepted  | Boolean  | Final accepted solution |
| submittedAt      | Date     | Submission time         |
| judgedAt         | Date     | Judge completion time   |

---

### Verdict Enum

```text
QUEUED

RUNNING

ACCEPTED

WRONG_ANSWER

COMPILATION_ERROR

RUNTIME_ERROR

TIME_LIMIT_EXCEEDED

MEMORY_LIMIT_EXCEEDED
```

---

## Indexes

* matchId
* userId
* verdict
* submittedAt

---

# Design Decisions

## Why only 5 collections?

Each collection has a single responsibility.

No redundant collections such as MatchHistory are required because the Match collection itself represents historical records.

---

## Why embed hidden test cases?

Hidden test cases always belong to a single problem.

Embedding them:

* Reduces database queries
* Keeps judging efficient
* Simplifies imports

---

## Why use Markdown?

Problem statements are stored as Markdown because it:

* Supports headings
* Supports lists
* Supports code blocks
* Is easy to render in Next.js
* Is easier to maintain than plain text

---

## Why store starter code per language?

A single problem supports multiple programming languages without duplicating the problem.

---

## Why use references?

User, Match, Room and Problem documents are reused across the system.

Using ObjectId references avoids data duplication and keeps the database normalized.

---

# Future Enhancements

Potential collections or fields for future versions:

* Tournament
* Organization
* Team Battles
* Room Chat
* Leaderboards
* Achievements
* Contest
* Problem Packs
* Editorials
* AI Review
* Notifications

These are intentionally excluded from Version 1 to keep the MVP focused and maintainable.
