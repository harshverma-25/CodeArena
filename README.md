# CodeArena Backend — Competitive Coding Platform

CodeArena is a production-ready, highly modular real-time competitive coding platform backend built on a layered monolith architecture using Node.js, TypeScript, Mongoose, and Socket.IO. It integrates with the Judge0 API for secure, multi-language sandbox code execution.

---

## 🚀 Features
* **Modular Monolith Architecture**: Strict decoupling of User, Problem, Room, Match, and Submission domains.
* **Clerk Authentication**: Advanced, session-based JWT verification middleware.
* **Sandbox Execution Layer**: Integrates with Judge0 to execute code (JavaScript, TypeScript, Python, Java, C++) securely.
* **Real-time Lobby Infrastructure**: Full Socket.IO integration supporting real-time matchmaking, readiness updates, and live submission telemetry.
* **Production-Grade Configs**: Clean error wrappers, in-memory rate limiting, security headers, graceful shutdowns, and custom Swagger API references.

---

## 🛠️ Technology Stack
* **Runtime**: Node.js (v20+)
* **Language**: TypeScript
* **Server Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Real-time Sockets**: Socket.IO
* **Validator**: Zod (Request parsing & Env sanitation)
* **Logging**: Pino (and Pino-Pretty for Dev)

---

## ⚙️ Local Development Setup

### 1. Prerequisite Installations
* Node.js v20 or higher
* MongoDB Server (locally on `127.0.0.1:27017` or Atlas connection string)
* Docker & Docker Compose (optional, for containerized run)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/harshverma-25/DSA-Tracker.git
cd DSA-Tracker/server
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `server` directory and configure the variables based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/codearena
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
JUDGE0_URL=http://127.0.0.1:2358
JUDGE0_API_KEY=judge0_api_key_placeholder
```

### 4. Run Server
```bash
# Starts development watch mode using tsx
npm run dev

# Builds production bundle
npm run build

# Runs production build
npm start
```

---

## 🐳 Docker Deployment Setup

You can run the entire backend and database stack with one command using Docker Compose:

```bash
# From the server folder
docker-compose up --build
```

This starts:
1. **`backend`**: Node.js container listening on port `5000` with native healthchecks.
2. **`mongodb`**: MongoDB v6 database container persisting data in a volume named `mongodb_data`.

---

## 📖 API Documentation & Reference

The API endpoints are documented using the OpenAPI 3.0 specification.
When the server is running, visit:
* **Interactive API Reference**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
* **OpenAPI Raw Specification JSON**: [http://localhost:5000/api/swagger.json](http://localhost:5000/api/swagger.json)

---

## 🔍 Health Diagnostics
Query the health check endpoint to verify database connectivity, uptime, environment settings, and build version:
```bash
curl http://localhost:5000/health
```
**Response Format**:
```json
{
  "success": true,
  "message": "Health status retrieved successfully.",
  "data": {
    "status": "OK",
    "database": "connected",
    "uptime": 12,
    "environment": "development",
    "version": "1.0.0"
  }
}
```

---

## 🤝 Contribution & Contact
* **Author**: Harsh Verma
* **GitHub**: [https://github.com/harshverma-25](https://github.com/harshverma-25)
* **LinkedIn**: [https://linkedin.com/in/harshverma616](https://linkedin.com/in/harshverma616)
