import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '@clerk/express';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { userService } from '../modules/user/user.service.js';
import { registerRoomHandlers } from './room.socket.js';

let io: Server | null = null;

/**
 * Socket.IO authentication middleware utilizing Clerk JWT verifyToken.
 */
export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const authHeader = socket.handshake.headers.authorization || '';
    let token = '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    // Verify token using Clerk
    const decoded = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    const clerkId = decoded.sub;
    if (!clerkId) {
      return next(new Error('Authentication error: Invalid token payload'));
    }

    // Retrieve or auto-sync database user
    const dbUser = await userService.getOrCreateUser(clerkId);
    if (!dbUser) {
      return next(new Error('Authentication error: User sync failed'));
    }

    // Attach user to socket data
    socket.data.user = dbUser;

    next();
  } catch (error: any) {
    logger.error(error, 'Socket authentication failed');
    next(new Error(`Authentication error: ${error.message || 'Invalid token'}`));
  }
};

/**
 * Initialize the Socket.IO server and register connection middleware/handlers.
 */
export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Dynamic client domain fallback, matching REST CORS
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply Auth Middleware
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user?._id?.toString() || 'unknown';
    logger.info(`Socket connected: ${socket.id} for user ${userId}`);

    // Register module-specific handlers
    registerRoomHandlers(io!, socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id} for user ${userId}`);
    });
  });

  logger.info('🔌 Socket.IO server initialized successfully');
  return io;
}

/**
 * Retrieve the initialized Socket.IO server instance.
 */
export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.IO is not initialized');
  }
  return io;
}
