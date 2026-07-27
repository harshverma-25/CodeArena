import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { userRoutes } from './modules/user/user.routes.js';
import { problemRoutes } from './modules/problem/problem.routes.js';
import { roomRoutes } from './modules/room/room.routes.js';
import { matchRoutes } from './modules/match/match.routes.js';
import { submissionRoutes } from './modules/submission/submission.routes.js';
import { docsRoutes } from './modules/docs/docs.routes.js';

import mongoose from 'mongoose';
import { rateLimiter } from './middleware/rate-limiter.middleware.js';

const app = express();

// Trust proxy for production environments (behind Nginx/Load Balancers)
app.set('trust proxy', 1);

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Apply rate limiting to all requests
app.use(rateLimiter);

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Global Clerk middleware for parsing authentication headers
app.use(clerkMiddleware());

// Health check endpoint
const getHealthStatus = () => {
  const readyState = mongoose.connection.readyState;
  let database = 'disconnected';
  if (readyState === 1) database = 'connected';
  else if (readyState === 2) database = 'connecting';
  else if (readyState === 3) database = 'disconnecting';

  return {
    status: readyState === 1 ? 'OK' : 'DEGRADED',
    database,
    uptime: Math.floor(process.uptime()), // in seconds
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };
};

app.get('/health', (req, res) => {
  const health = getHealthStatus();
  res.status(health.status === 'OK' ? 200 : 503).json({
    success: true,
    message: 'Health status retrieved successfully.',
    data: health,
  });
});

app.get('/api/v1/health', (req, res) => {
  const health = getHealthStatus();
  res.status(health.status === 'OK' ? 200 : 503).json({
    success: true,
    message: 'Health status retrieved successfully.',
    data: health,
  });
});

// Register API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api', docsRoutes);

// Unmatched route handler (404)
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
