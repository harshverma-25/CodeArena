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

const app = express();


// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Global Clerk middleware for parsing authentication headers
app.use(clerkMiddleware());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running.',
    data: {
      status: 'OK',
    },
  });
});

// Register API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/submissions', submissionRoutes);

// Unmatched route handler (404)
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
