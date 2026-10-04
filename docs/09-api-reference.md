# 09 — API Reference

## 1. Overview & Base URL

All REST API endpoints in CodeArena are versioned under the `/api/v1` prefix (with the exception of top-level health checks and Swagger documentation).

* **Base URL (Local)**: `http://localhost:5000/api/v1`
* **Content-Type**: `application/json`
* **Response Format**: All endpoints return responses wrapped in the [`ApiResponse`](file:///h:/Project/code-arena/server/src/shared/utils/api-response.ts) structure:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Human-readable message",
    "data": { ... }
  }
  ```

---

## 2. Authentication Headers

Protected endpoints require an `Authorization` header containing either a Clerk Session JWT or a backend-signed Guest Token:
```http
Authorization: Bearer <token>
```

---

## 3. Endpoints Catalogue

### 3.1 Health Diagnostics

#### `GET /health` or `GET /api/v1/health`
Checks server uptime, environment, and MongoDB connection status.
* **Auth**: None (Public)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Health status retrieved successfully.",
    "data": {
      "status": "OK",
      "database": "connected",
      "uptime": 1420,
      "environment": "development",
      "version": "1.0.0"
    }
  }
  ```

---

### 3.2 Authentication (`/api/v1/auth`)

#### `POST /api/v1/auth/guest`
Creates a temporary, zero-credential guest session.
* **Auth**: None (Public)
* **Request Body** (optional):
  ```json
  {
    "displayName": "CustomNinja"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Guest session created successfully.",
    "data": {
      "token": "header.payload.signature",
      "expiresIn": 86400,
      "user": {
        "userId": "6a6e1d0fc4f7b7170e2a6fca",
        "username": "guest_40a9f2",
        "displayName": "Guest 40A9F2",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=guest_40a9f2",
        "role": "guest",
        "isGuest": true
      }
    }
  }
  ```

---

### 3.3 Users & Leaderboard (`/api/v1/users` & `/api/v1/leaderboard`)

#### `GET /api/v1/users/me`
Retrieves the full authenticated user record.
* **Auth**: Required (`Bearer <token>`)
* **Response (200 OK)**: Returns full `IUserDocument`.

#### `GET /api/v1/users/profile/me`
Retrieves authenticated user's calculated statistics and match history.
* **Auth**: Required (`Bearer <token>`)
* **Response (200 OK)**: Returns [`IPublicUserProfile`](file:///h:/Project/code-arena/server/src/modules/user/user.types.ts#L46-L80).

#### `PATCH /api/v1/users/me`
Updates display fields of the user profile.
* **Auth**: Required (Registered users only; **Guests receive 403 Forbidden**)
* **Request Body**:
  ```json
  {
    "displayName": "New Name",
    "avatar": "https://example.com/avatar.png"
  }
  ```

#### `GET /api/v1/leaderboard` or `GET /api/v1/users/leaderboard`
Retrieves the paginated global leaderboard.
* **Auth**: Required (`Bearer <token>` — Clerk or Guest). Resolves `currentUserRank` for the calling user.
* **Query Parameters**:
  * `page` (integer, default: 1)
  * `limit` (integer, default: 10, max: 100)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Leaderboard retrieved successfully.",
    "data": {
      "leaderboard": [
        {
          "rank": 1,
          "userId": "6a6e1d0fc4f7b7170e2a6fca",
          "username": "alice",
          "displayName": "Alice",
          "avatar": "...",
          "wins": 15,
          "losses": 2,
          "draws": 1,
          "battlesPlayed": 18,
          "totalCorrect": 82,
          "totalQuestions": 90,
          "accuracy": 91,
          "isCurrentUser": false
        }
      ],
      "total": 45,
      "page": 1,
      "limit": 10,
      "currentUserRank": { ... }
    }
  }
  ```

#### `GET /api/v1/users/profile/:username`
Retrieves the public profile and recent completed battles for any user.
* **Auth**: Required (`Bearer <token>` — Clerk or Guest)
* **Response (200 OK)**: Returns user public stats and latest 10 battles.

---

### 3.4 Questions (`/api/v1/questions`)

#### `GET /api/v1/questions`
Retrieves a paginated list of published questions.
* **Auth**: Required (`Bearer <token>` — Clerk or Guest)
* **Query Parameters**: `topic`, `difficulty`, `page`, `limit`.
* **Note**: Correct answers and explanations are stripped (`ISanitizedQuestion`).

#### `GET /api/v1/questions/:questionId`
Retrieves a single sanitized question by its unique ID.
* **Auth**: Required (`Bearer <token>` — Clerk or Guest)

---

### 3.5 Rooms (`/api/v1/rooms`)

#### `POST /api/v1/rooms`
Creates a new matchmaking room.
* **Auth**: Required (`Bearer <token>`)
* **Request Body**:
  ```json
  {
    "topic": "javascript",
    "difficulty": "Medium",
    "questionCount": 10,
    "duration": 30
  }
  ```
* **Response (201 Created)**: Returns created room with unique `roomCode`.

#### `POST /api/v1/rooms/join`
Joins an existing matchmaking room.
* **Auth**: Required (`Bearer <token>`)
* **Request Body**:
  ```json
  {
    "roomCode": "K8L9M0"
  }
  ```
* **Response (200 OK)**: Returns joined room with current player list.

#### `GET /api/v1/rooms/:roomCode`
Retrieves current room details and player list.
* **Auth**: Required (`Bearer <token>`)
* **Response (200 OK)**: Returns current `IRoomDocument`.

#### `PATCH /api/v1/rooms/:roomCode/settings`
Updates room configurations (Host only).
* **Auth**: Required (`Bearer <token>`, must be Room Host)
* **Request Body**:
  ```json
  {
    "topic": "javascript",
    "difficulty": "Hard",
    "duration": 45,
    "questionCount": 15
  }
  ```
* **Response (200 OK)**: Returns updated room document and broadcasts `room:update` via Socket.IO.

#### `PATCH /api/v1/rooms/:roomCode/ready`
Toggles ready status for the authenticated player in the room.
* **Auth**: Required (`Bearer <token>`)
* **Request Body**:
  ```json
  {
    "isReady": true
  }
  ```
* **Response (200 OK)**: Returns updated room document with modified readiness status and emits `room:update`.

#### `POST /api/v1/rooms/:roomCode/leave`
Gracefully leaves a room lobby. If the host leaves, host role is transferred; if empty, the room is deleted.
* **Auth**: Required (`Bearer <token>`)
* **Response (200 OK)**: Returns updated room state or deletion message.

#### `DELETE /api/v1/rooms/:roomCode`
Closes and deletes the room (Host only).
* **Auth**: Required (`Bearer <token>`, must be Room Host)
* **Response (200 OK)**: Confirms room deletion.

---

### 3.6 Battles (`/api/v1/battles` & `/api/v1/matches`)

#### `POST /api/v1/battles/start` (Alias: `POST /api/v1/matches/start`)
Initiates and creates the real-time battle for the specified room.
* **Auth**: Required (`Bearer <token>`, must be Room Host, room status must be `READY`, both players must be ready)
* **Request Body**:
  ```json
  {
    "roomCode": "K8L9M0"
  }
  ```
* **Response (200 OK)**: Returns initialized battle document, transitions room status to `IN_PROGRESS`, and triggers `battle:init` to each connected player over Socket.IO.

---

### 3.7 Match History (`/api/v1/history`)

#### `GET /api/v1/history`
Retrieves paginated battle history for the authenticated user.
* **Auth**: Required (`Bearer <token>`)
* **Query Parameters**: `page` (default: 1), `limit` (default: 10).

#### `GET /api/v1/history/:battleId`
Retrieves detailed, post-match question-by-question review with correct answers and explanations.
* **Auth**: Required (**Must be a battle participant, and battle must be `COMPLETED`**).

---

### 3.8 Interactive Documentation (`/api`)

* **`GET /api/docs`**: Serves Swagger UI web interface.
* **`GET /api/swagger.json`**: Serves raw OpenAPI 3.0 specification.

---

## 4. Document Cross-References
* For environment variables required to run these endpoints, see [10 — Environment Configuration](10-environment-configuration.md).
* For authentication implementation details, see [06 — Authentication & Security](06-authentication-security.md).
* For WebSocket events corresponding to these operations, see [07 — Real-Time Socket Architecture](07-realtime-socket-architecture.md).
