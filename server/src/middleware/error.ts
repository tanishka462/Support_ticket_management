import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
export function notFound(_req: Request, res: Response) { res.status(404).json({ success:false, message:'Route not found' }); }
export function errorHandler(err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof AppError ? err.statusCode : err.statusCode || 500;
  if (process.env.NODE_ENV !== 'test') console.error(err);
  res.status(status).json({ success:false, message: status === 500 ? 'Internal server error' : err.message });
}
