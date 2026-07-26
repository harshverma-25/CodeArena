import pino from 'pino';
import { env } from './env.js';

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'headers.authorization',
      'headers.cookie',
      'body.password',
      'body.token',
      'body.secret',
      'body.apiKey',
      'password',
      'token',
      'secret',
      'apiKey',
      'clerkSecretKey',
      'clerkPublishableKey',
      'judge0ApiKey',
    ],
    censor: '[REDACTED]',
  },
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;
