import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { initializeSocket } from './sockets/index.js';
import { battleService } from './modules/battle/battle.service.js';
import { roomService } from './modules/room/room.service.js';

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();

    // Start background garbage collector for stale rooms & abandoned battles
    roomService.startGarbageCollector();

    // Initialize Socket.IO server
    initializeSocket(server);

    // Start HTTP server
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown helper
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  // Stop background sweeper and garbage collector
  battleService.stopSweeper();
  roomService.stopGarbageCollector();

  server.close(async () => {
    logger.info('HTTP server closed.');
    
    // Disconnect from MongoDB
    await disconnectDatabase();
    
    logger.info('Graceful shutdown completed successfully.');
    process.exit(0);
  });

  // Set a fallback timeout to force exit if connections don't close in 10s
  setTimeout(() => {
    logger.error('Shutdown timed out, forcefully terminating process.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

startServer();
