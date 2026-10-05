import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { userService } from '../modules/user/user.service.js';
import { UserModel } from '../modules/user/user.model.js';
import { authService } from '../modules/auth/auth.service.js';
import { registerRoomHandlers } from './room.socket.js';
import { registerBattleHandlers } from './battle.socket.js';

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

    // 1. Native Access Token
    const accessPayload = authService.verifyAccessToken(token);
    if (accessPayload && accessPayload.sub) {
      const dbUser = await UserModel.findById(accessPayload.sub);
      if (dbUser) {
        socket.data.user = dbUser;
        return next();
      }
    }

    // 2. Guest JWT Token
    const guestPayload = authService.verifyGuestToken(token);
    if (guestPayload) {
      if (guestPayload.sub) {
        const guestUser = await UserModel.findById(guestPayload.sub);
        if (guestUser) {
          socket.data.user = guestUser;
          return next();
        }
      }
      if (guestPayload.guestId) {
        const guestUser = await userService.getUserByClerkId(guestPayload.guestId);
        if (guestUser && guestUser.isGuest) {
          socket.data.user = guestUser;
          return next();
        }
      }
    }

    // 3. Automated test suite bypass strictly in NODE_ENV === 'test'
    if (env.NODE_ENV === 'test' && token.startsWith('mock_test_token_')) {
      const clerkId = token.replace('mock_test_token_', '');
      const dbUser = await userService.getOrCreateUser(clerkId);
      socket.data.user = dbUser;
      return next();
    }

    return next(new Error('Authentication error: Invalid or expired token'));
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
    registerBattleHandlers(io!, socket);

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
