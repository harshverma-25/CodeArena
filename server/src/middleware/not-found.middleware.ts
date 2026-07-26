import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/errors/api-error.js';
import { HTTP_STATUS } from '../shared/utils/http-status.js';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundHandler;
