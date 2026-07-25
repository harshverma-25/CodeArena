import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { userRoutes } from './modules/user/user.routes.js';

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Global Clerk middleware for parsing authentication headers
app.use(clerkMiddleware());

// Health check API
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CodeArena Backend Service is running and healthy.',
    timestamp: new Date().toISOString(),
  });
});

// Register Module Routes
app.use('/users', userRoutes);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
