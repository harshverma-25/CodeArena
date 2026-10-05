# 10 — Environment Configuration

## 1. Overview & Validation Strategy

CodeArena employs **strict startup schema validation** for backend configurations using **Zod**. If any required environment variable is missing, malformed, or of an incorrect type, the server fails fast at boot with formatted validation errors before accepting connections or opening database pools.

---

## 2. Server Environment Variables (`server/.env`)

| Variable | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| **`PORT`** | `number` | Yes | `5000` | Port on which Express and Socket.IO listen. Automatically parsed and type-cast to integer. |
| **`NODE_ENV`** | `enum` | Yes | `development` | Runtime mode. Must be one of: `development`, `production`, `test`. Regulates stack traces and mock token acceptance. |
| **`MONGODB_URI`** | `string` | Yes | None | Full MongoDB connection string (local or Atlas URI). |
| **`JWT_ACCESS_SECRET`** | `string` | No | Fallback string | High-entropy secret for signing short-lived (15 min) Native JWT access tokens. |
| **`JWT_REFRESH_SECRET`** | `string` | No | Fallback string | High-entropy secret for signing long-lived (7 days) Native JWT refresh tokens. |
| **`GUEST_JWT_SECRET`** | `string` | No | Fallback string | High-entropy secret used for HMAC SHA-256 signing of guest session tokens. Minimum 32 bytes recommended in production. |
| **`JWT_ACCESS_EXPIRES_IN`** | `string` | No | `900` | Access Token expiration in seconds (default: 15 minutes). |
| **`JWT_REFRESH_EXPIRES_IN`** | `string` | No | `604800` | Refresh Token expiration in seconds (default: 7 days). |
| **`CORS_ORIGIN`** | `string` | No | `*` | Allowed origin for Cross-Origin Resource Sharing. In production, restrict to frontend domain. |
| **`LOG_LEVEL`** | `string` | No | `info` | Logging verbosity for Pino logger (`debug`, `info`, `warn`, `error`). |

### 2.1 Backend Schema Definition (`server/src/config/env.ts`)
```typescript
const envSchema = z.object({
  PORT: z.string().transform((val) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) throw new Error('PORT must be a valid number');
    return parsed;
  }),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  GUEST_JWT_SECRET: z.string().default(process.env.GUEST_JWT_SECRET || 'codearena_secure_guest_jwt_secret_key_32_bytes_min'),
  JWT_ACCESS_SECRET: z.string().default(process.env.JWT_ACCESS_SECRET || 'codearena_secure_access_jwt_secret_key_32_bytes_min'),
  JWT_REFRESH_SECRET: z.string().default(process.env.JWT_REFRESH_SECRET || 'codearena_secure_refresh_jwt_secret_key_32_bytes_min'),
  JWT_ACCESS_EXPIRES_IN: z.string().default(process.env.JWT_ACCESS_EXPIRES_IN || '900'),
  JWT_REFRESH_EXPIRES_IN: z.string().default(process.env.JWT_REFRESH_EXPIRES_IN || '604800'),
});
```

---

## 3. Client Environment Variables (`client/.env.local`)

| Variable | Exposure | Required | Example Value | Description |
| :--- | :---: | :---: | :--- | :--- |
| **`NEXT_PUBLIC_API_URL`** | Browser | Yes | `http://localhost:5000/api/v1` | Base REST API target URL for frontend HTTP requests. |
| **`NEXT_PUBLIC_WS_URL`** | Browser | Yes | `http://localhost:5000` | Target URL for Socket.IO client connections. |

---

## 4. Setup Instructions & Sample Files

### 4.1 Server `.env` Setup
Copy the template and configure your secrets:
```bash
cd server
cp .env.example .env
```
Sample `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/codearena
JWT_ACCESS_SECRET=your_super_secret_access_token_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_min_32_chars
GUEST_JWT_SECRET=super_secret_guest_hmac_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

### 4.2 Client `.env.local` Setup
```bash
cd client
cp .env.example .env.local
```
Sample `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## 5. Security & Best Practices

1. **Never Commit Secrets**: Ensure `.env` and `.env.local` remain in `.gitignore`.
2. **Environment Separation**: Maintain isolated MongoDB databases for `development` versus `production`.
3. **No Backdoor Tokens in Production**: Setting `NODE_ENV=production` automatically disables any mock token acceptance in authentication middleware.

---

## 6. Document Cross-References
* For local development steps, see [11 — Development Guide](11-development-guide.md).
* For testing configurations, see [12 — Testing Guide](12-testing-guide.md).
* For production deployment recommendations, see [13 — Deployment Guide](13-deployment-guide.md).
