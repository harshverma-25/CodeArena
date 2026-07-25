# CodeArena REST API Design (v1.0)

## Overview

This document defines the REST API for the CodeArena backend.

### Base URL

```text
/api/v1
```

### Authentication

All protected endpoints require a valid Clerk JWT.

```
Authorization: Bearer <token>
```

---

# API Modules

```
Authentication
Users
Problems
Rooms
Matches
Submissions
```

---

# Authentication

Authentication is handled by **Clerk**.

The backend only verifies tokens.

No login/register endpoints are required.

---

# User APIs

## Get Current User

### GET

```
/users/me
```

### Response

```json
{
  "id": "...",
  "username": "harsh",
  "displayName": "Harsh Verma",
  "wins": 10,
  "losses": 4,
  "matchesPlayed": 14
}
```

---

## Update Profile

### PATCH

```
/users/me
```

### Request

```json
{
  "displayName": "Harsh",
  "preferredLanguage": "java"
}
```

---

## Get Public Profile

### GET

```
/users/:username
```

---

# Problem APIs

## Get Problems

### GET

```
/problems
```

### Query Parameters

```
?page=1

?limit=20

?topic=Arrays

?difficulty=Easy

?search=two
```

---

## Get Problem

### GET

```
/problems/:slug
```

Returns

* Description
* Examples
* Constraints
* Starter code

**Never returns hidden test cases.**

---

## Get Random Problem

Used internally when starting a match.

### GET

```
/problems/random
```

Example

```
?topic=Arrays

&difficulty=Medium
```

---

# Room APIs

## Create Room

### POST

```
/rooms
```

### Request

```json
{
  "topic": "Arrays",
  "difficulty": "Medium",
  "duration": 30
}
```

### Response

```json
{
  "roomCode": "AB7XQ2"
}
```

---

## Join Room

### POST

```
/rooms/join
```

### Request

```json
{
  "roomCode": "AB7XQ2"
}
```

---

## Get Room

### GET

```
/rooms/:roomCode
```

Returns

* Players
* Ready state
* Settings
* Status

---

## Update Ready Status

### PATCH

```
/rooms/:roomCode/ready
```

Request

```json
{
  "isReady": true
}
```

---

## Update Room Settings

Host only.

### PATCH

```
/rooms/:roomCode/settings
```

---

## Leave Room

### POST

```
/rooms/:roomCode/leave
```

---

## Delete Room

Host only.

### DELETE

```
/rooms/:roomCode
```

---

# Match APIs

## Start Match

Host only.

### POST

```
/matches/start
```

### Request

```json
{
  "roomCode": "AB7XQ2"
}
```

Backend will:

* Validate players
* Select random problem
* Create Match
* Update Room
* Emit Socket Event

---

## Get Match

### GET

```
/matches/:matchId
```

Returns

* Players
* Winner
* Problem
* Timeline

---

## Get Match History

### GET

```
/matches/history
```

Supports

```
?page

?limit
```

---

# Submission APIs

## Submit Code

### POST

```
/submissions
```

### Request

```json
{
  "matchId": "...",
  "language": "java",
  "sourceCode": "class Solution {...}"
}
```

Backend Flow

```
Receive Code
      ↓
Judge0
      ↓
Hidden Test Cases
      ↓
Verdict
      ↓
Save Submission
      ↓
Emit Socket Event
```

---

## Get Submission

### GET

```
/submissions/:submissionId
```

---

## Get Match Submissions

### GET

```
/matches/:matchId/submissions
```

Returns every submission for that match.

---

# Health Check

### GET

```
/health
```

Response

```json
{
  "status": "OK"
}
```

---

# Error Responses

## 400

```json
{
  "success": false,
  "message": "Invalid request."
}
```

---

## 401

```json
{
  "success": false,
  "message": "Unauthorized."
}
```

---

## 403

```json
{
  "success": false,
  "message": "Forbidden."
}
```

---

## 404

```json
{
  "success": false,
  "message": "Resource not found."
}
```

---

## 409

```json
{
  "success": false,
  "message": "Room is full."
}
```

---

## 500

```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

# API Summary

| Module      | Endpoints |
| ----------- | --------: |
| Users       |         3 |
| Problems    |         3 |
| Rooms       |         6 |
| Matches     |         3 |
| Submissions |         3 |
| Health      |         1 |

**Total:** 19 REST endpoints

---

# Responsibilities

## REST APIs

REST endpoints are responsible for:

* CRUD operations
* Authentication
* Validation
* Database access
* Returning HTTP responses

## Socket.IO

Real-time updates such as:

* Player joined
* Player ready
* Match started
* Timer updates
* Submission results
* Match finished

are **not** handled by REST APIs. They are handled through Socket.IO events, which are defined in the next document (`05-SOCKETS.md`).
