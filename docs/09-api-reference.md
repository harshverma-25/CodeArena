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

Protected endpoints require an `Authorization` header containing either a Native JWT Access Token or a backend-signed Guest Token:
```http
Authorization: Bearer <token>
```
The token refresh endpoint additionally accepts the `refreshToken` HttpOnly cookie.

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

#### `POST /api/v1/auth/register`
Registers a new user account with cryptographic PBKDF2 password hashing.
* **Auth**: None (Public)
* **Request Body**:
  ```json
  {
    "email": "coder@example.com",
    "username": "codemaster",
    "password": "StrongPassword123!",
    "displayName": "Code Master"
  }
  ```
* **Response (201 Created)**: Returns access token, user profile, and sets HttpOnly `refreshToken` cookie.

#### `POST /api/v1/auth/login`
Authenticates an existing user via email or username.
* **Auth**: None (Public)
* **Request Body**:
  ```json
  {
    "login": "coder@example.com",
    "password": "StrongPassword123!"
  }
  ```
* **Response (200 OK)**: Returns access token, user profile, and sets HttpOnly `refreshToken` cookie.

#### `POST /api/v1/auth/refresh`
Refreshes an expired access token using the valid refresh token from cookie or body.
* **Auth**: None (Cookie or Body)
* **Response (200 OK)**: Returns new `accessToken`.

#### `POST /api/v1/auth/logout`
Logs out the user, invalidating the refresh token in the database and clearing the cookie.
* **Auth**: Optional
* **Response (200 OK)**: Confirms logout.

#### `GET /api/v1/auth/me`
Retrieves the currently authenticated user's session record.
* **Auth**: Required (`Bearer <token>`)
* **Response (200 OK)**: Returns current user object.

#### `POST /api/v1/auth/guest`
Creates a temporary, zero-credential guest session signed with HMAC-SHA256.
* **Auth**: None (Public, rate limited: 20 per 15 min per IP)
* **Request Body** (optional):
  ```json
  {
    "displayName": "QuizNinja"
  }
  ```
* **Response (201 Created)**: Returns guest token and guest user profile.

---

### 3.3 Categories & Subjects (`/api/v1/categories`)

#### `GET /api/v1/categories`
Retrieves active quiz categories (`programming`, `aptitude`, `general-knowledge`).
* **Auth**: None (Public)
* **Response (200 OK)**: Returns list of categories with IDs, names, slugs, and icons.

#### `GET /api/v1/categories/:categoryId/subjects`
Retrieves active subjects under a specific category.
* **Auth**: None (Public)
* **Response (200 OK)**: Returns array of subjects for the specified category.

---

### 3.4 Users & Leaderboard (`/api/v1/users` & `/api/v1/leaderboard`)

#### `GET /api/v1/users/me`
Retrieves the full authenticated user record.
* **Auth**: Required (`Bearer <token>`)

#### `GET /api/v1/users/profile/me`
Retrieves authenticated user's calculated statistics and match history.
* **Auth**: Required (`Bearer <token>`)

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
* **Auth**: Optional (`Bearer <token>` resolves `currentUserRank`)
* **Query Parameters**: `page` (default: 1), `limit` (default: 10, max: 100)

#### `GET /api/v1/users/profile/:username`
Retrieves the public profile and recent completed battles for any user.
* **Auth**: Optional / Required

---

### 3.5 Questions (`/api/v1/questions`)

#### `GET /api/v1/questions`
Retrieves a paginated list of published questions (answers and explanations stripped).
* **Auth**: Required (`Bearer <token>`)
* **Query Parameters**: `categoryId`, `subjectId`, `difficulty`, `page`, `limit`.

#### `GET /api/v1/questions/:questionId`
Retrieves a single sanitized question by its unique ID.
* **Auth**: Required (`Bearer <token>`)

---

### 3.6 Rooms (`/api/v1/rooms`)

#### `POST /api/v1/rooms`
Creates a new matchmaking room (supports 1–4 players).
* **Auth**: Required (`Bearer <token>`)
* **Request Body**:
  ```json
  {
    "categoryId": "67...",
    "subjectId": "67...",
    "isMixedCategory": false,
    "difficulty": "Medium",
    "questionCount": 10
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

#### `GET /api/v1/rooms/:roomCode`
Retrieves current room details and player list (1–4 players).
* **Auth**: Required (`Bearer <token>`)

#### `PATCH /api/v1/rooms/:roomCode/settings`
Updates room configurations (Host only).
* **Auth**: Required (`Bearer <token>`, must be Room Host)

#### `PATCH /api/v1/rooms/:roomCode/ready`
Toggles ready status for the authenticated player in the room.
* **Auth**: Required (`Bearer <token>`)

#### `POST /api/v1/rooms/:roomCode/leave`
Gracefully leaves a room lobby.
* **Auth**: Required (`Bearer <token>`)

#### `DELETE /api/v1/rooms/:roomCode`
Closes and deletes the room (Host only).
* **Auth**: Required (`Bearer <token>`, must be Room Host)

---

### 3.7 Battles (`/api/v1/battles` & `/api/v1/matches`)

#### `POST /api/v1/battles/start` (Compatibility Alias: `POST /api/v1/matches/start`)
Initiates and creates the real-time battle for the specified room.
* **Auth**: Required (`Bearer <token>`, must be Room Host)
* **Request Body**:
  ```json
  {
    "roomCode": "K8L9M0"
  }
  ```
* **Response (200 OK)**: Returns initialized battle document, transitions room status to `IN_PROGRESS`, and triggers `battle:init` over Socket.IO.

---

### 3.8 Match History (`/api/v1/history`)

#### `GET /api/v1/history`
Retrieves paginated battle history for the authenticated user (queried from `BattleModel`).
* **Auth**: Required (`Bearer <token>`)
* **Query Parameters**: `page` (default: 1), `limit` (default: 10).

#### `GET /api/v1/history/:battleId`
Retrieves detailed, post-match question-by-question review with correct answers and explanations.
* **Auth**: Required (**Must be a battle participant, and battle must be `COMPLETED`**).

---

### 3.9 Interactive Documentation (`/api`)

* **`GET /api/docs`**: Serves Swagger UI web interface.
* **`GET /api/swagger.json`**: Serves raw OpenAPI 3.0 specification.

---

## 4. Document Cross-References
* For environment variables required to run these endpoints, see [10 — Environment Configuration](10-environment-configuration.md).
* For authentication implementation details, see [06 — Authentication & Security](06-authentication-security.md).
* For WebSocket events corresponding to these operations, see [07 — Real-Time Socket Architecture](07-realtime-socket-architecture.md).
