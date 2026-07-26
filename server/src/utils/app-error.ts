import { ApiError } from '../shared/errors/api-error.js';

export class AppError extends ApiError {
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(statusCode, message);
    this.isOperational = isOperational;
    
    // Capture stack trace for this subclass
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
