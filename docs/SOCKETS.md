# CodeArena Socket.IO Event Design (v1.0)

## Overview

This document defines the real-time communication protocol between the frontend and backend.

Unlike REST APIs, Socket.IO is responsible for sending instant updates without requiring the client to refresh the page.

---

# Connection Flow

```text
Client
    │
    ▼
Connect Socket
    │
    ▼
Authenticate User
    │
    ▼
Join Room Channel
    │
    ▼
Listen For Events
```

---

# Naming Convention

Events follow this pattern:

```text
module:action
```

Examples

```text
room:join
room:leave
room:update

match:start
match:end

submission:create
submission:result
```

---

# Socket Rooms

Each CodeArena room maps to one Socket.IO room.

Example

```text
Room Code

AB7XQ2
```

Socket Room

```text
room:AB7XQ2
```

Every player inside the room joins this Socket.IO room.

---

# Room Events

## room:join

### Client → Server

Emitted when a player joins.

Payload

```json
{
    "roomCode": "AB7XQ2"
}
```

---

## room:joined

### Server → Room

Broadcast after successful join.

Payload

```json
{
    "players": [],
    "hostId": "...",
    "status": "WAITING"
}
```

---

## room:leave

### Client → Server

```json
{
    "roomCode": "AB7XQ2"
}
```

---

## room:left

### Server → Room

Updates remaining players.

---

## room:update

### Server → Room

Sent whenever room state changes.

Examples

* Player joined
* Player left
* Settings changed
* Ready state changed

Payload

```json
{
    "players": [],
    "settings": {},
    "status": "READY"
}
```

---

# Ready Events

## room:ready

### Client → Server

```json
{
    "isReady": true
}
```

---

## room:ready:update

### Server → Room

```json
{
    "userId": "...",
    "isReady": true
}
```

---

# Match Events

## match:start

### Server → Room

Sent after host starts the match.

Payload

```json
{
    "matchId": "...",
    "problem": {},
    "duration": 1800
}
```

The problem object contains:

* Title
* Description
* Examples
* Constraints
* Starter Code

Hidden test cases are **never** sent.

---

## match:timer

### Server → Room

Broadcast every second (or every few seconds).

Payload

```json
{
    "remainingTime": 1724
}
```

---

## match:end

### Server → Room

Payload

```json
{
    "winnerId": "...",
    "status": "COMPLETED"
}
```

---

# Submission Events

## submission:create

### Client → Server

```json
{
    "matchId": "...",
    "language": "java",
    "sourceCode": "..."
}
```

The server:

1. Saves submission
2. Sends code to Judge0
3. Evaluates hidden test cases

---

## submission:queued

### Server → Client

```json
{
    "submissionId": "...",
    "status": "QUEUED"
}
```

---

## submission:running

### Server → Client

```json
{
    "submissionId": "...",
    "status": "RUNNING"
}
```

---

## submission:result

### Server → Client

```json
{
    "submissionId": "...",
    "verdict": "ACCEPTED",
    "executionTime": 42,
    "memoryUsed": 18,
    "passedTestCases": 20,
    "totalTestCases": 20
}
```

---

# Player Status Events

## player:connected

Server → Room

Sent when a disconnected player reconnects.

---

## player:disconnected

Server → Room

Payload

```json
{
    "userId": "..."
}
```

The frontend displays

```text
Player disconnected.
Waiting for reconnection...
```

---

## player:reconnected

Server → Room

```json
{
    "userId": "..."
}
```

---

# Error Events

## error

Server → Client

```json
{
    "code": "ROOM_FULL",
    "message": "Room is already full."
}
```

Possible codes

```text
INVALID_ROOM

ROOM_FULL

MATCH_STARTED

NOT_HOST

UNAUTHORIZED

SUBMISSION_FAILED

JUDGE_ERROR
```

---

# Disconnect Flow

```text
Player Disconnects
        │
        ▼
Mark Offline
        │
        ▼
Start Reconnect Timer
        │
        ├───────────────┐
        │               │
Reconnect         Timer Expired
        │               │
        ▼               ▼
Resume Match     End Match
```

---

# Event Summary

| Event               | Direction       |
| ------------------- | --------------- |
| room:join           | Client → Server |
| room:joined         | Server → Room   |
| room:leave          | Client → Server |
| room:left           | Server → Room   |
| room:update         | Server → Room   |
| room:ready          | Client → Server |
| room:ready:update   | Server → Room   |
| match:start         | Server → Room   |
| match:timer         | Server → Room   |
| match:end           | Server → Room   |
| submission:create   | Client → Server |
| submission:queued   | Server → Client |
| submission:running  | Server → Client |
| submission:result   | Server → Client |
| player:connected    | Server → Room   |
| player:disconnected | Server → Room   |
| player:reconnected  | Server → Room   |
| error               | Server → Client |

**Total Events:** 18

---

# Responsibilities

## REST API

Responsible for:

* CRUD operations
* Authentication
* Validation
* Database updates

## Socket.IO

Responsible for:

* Live room updates
* Match synchronization
* Timer updates
* Player connection state
* Submission progress
* Match completion

---

# Design Principles

* Never send hidden test cases to the client.
* Keep Socket events focused on real-time updates only.
* Use REST for data retrieval and persistence.
* Broadcast only to the relevant room instead of all connected clients.
* Make all event names consistent using the `module:action` pattern.
