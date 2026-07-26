import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import { ApiError } from '../shared/errors/api-error.js';
import { HTTP_STATUS } from '../shared/utils/http-status.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors && err.errors.length > 0 ? err.errors : undefined;
  } else if (err.name === 'ZodError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation failed.';
    errors = err.errors; // Zod validation errors list
  } else if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err.status && typeof err.status === 'number') {
    statusCode = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(err, `[Unexpected Error] ${err.message}`);
  } else {
    logger.warn(`[Client Error] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDevelopment && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR && { stack: err.stack }),
  });
};

export default errorHandler;
