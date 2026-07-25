import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/app-error.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed.';
    errors = err.errors; // Zod validation errors list
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.status && typeof err.status === 'number') {
    // Handling standard HTTP errors from libraries
    statusCode = err.status;
    message = err.message;
  }

  if (statusCode === 500) {
    logger.error(`[Unexpected Error] ${err.stack || err.message}`);
  } else {
    logger.warn(`[Client Error] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
