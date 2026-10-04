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
| **`CLERK_SECRET_KEY`** | `string` | Yes | None | Secret API key provided by Clerk Dashboard for backend token verification and user sync. |
| **`CLERK_PUBLISHABLE_KEY`** | `string` | Yes | None | Public key for Clerk integration. |
| **`GUEST_JWT_SECRET`** | `string` | No | Fallback string | High-entropy secret used for HMAC SHA-256 signing of guest session tokens. Minimum 32 bytes recommended in production. |
| **`CORS_ORIGIN`** | `string` | No | `*` | Allowed origin for Cross-Origin Resource Sharing. In production, restrict to frontend domain. |

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
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY is required'),
  GUEST_JWT_SECRET: z.string().default(process.env.GUEST_JWT_SECRET || process.env.CLERK_SECRET_KEY || '...'),
});
```

---

## 3. Client Environment Variables (`client/.env.local`)

| Variable | Exposure | Required | Example Value | Description |
| :--- | :---: | :---: | :--- | :--- |
| **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** | Browser | Yes | `pk_test_...` | Public key used by Clerk Next.js frontend SDK. |
| **`CLERK_SECRET_KEY`** | Server | Yes | `sk_test_...` | Secret key used by Next.js middleware during SSR authentication checks. |
| **`NEXT_PUBLIC_API_URL`** | Browser | Yes | `http://localhost:5000/api/v1` | Base REST API target URL for frontend HTTP requests. |
| **`NEXT_PUBLIC_WS_URL`** | Browser | Yes | `http://localhost:5000` | Target URL for Socket.IO client connections. |
| **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`** | Browser | Yes | `/login` | Route redirect path for Clerk sign-in. |
| **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`** | Browser | Yes | `/register` | Route redirect path for Clerk sign-up. |

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
CLERK_SECRET_KEY=sk_test_exampleKey123
CLERK_PUBLISHABLE_KEY=pk_test_exampleKey123
GUEST_JWT_SECRET=super_secret_guest_hmac_key_min_32_chars
CORS_ORIGIN=http://localhost:3000
```

### 4.2 Client `.env.local` Setup
```bash
cd client
cp .env.example .env.local
```
Sample `client/.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_exampleKey123
CLERK_SECRET_KEY=sk_test_exampleKey123
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
```

---

## 5. Security & Best Practices

1. **Never Commit Secrets**: Ensure `.env` and `.env.local` remain in `.gitignore`.
2. **Environment Separation**: Maintain isolated MongoDB databases and Clerk applications for `development` versus `production`.
3. **No Backdoor Tokens in Production**: Setting `NODE_ENV=production` automatically disables any mock token acceptance in authentication middleware.

---

## 6. Document Cross-References
* For local development steps, see [11 — Development Guide](11-development-guide.md).
* For testing configurations, see [12 — Testing Guide](12-testing-guide.md).
* For production deployment recommendations, see [13 — Deployment Guide](13-deployment-guide.md).
