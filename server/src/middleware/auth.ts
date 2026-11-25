import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import type { AuthRequest, Role } from '../types/index.js';
import { AppError } from '../utils/errors.js';
export async function protect(req:AuthRequest,res:Response,next:NextFunction) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
    if (!token) throw new AppError('Authentication required',401);
    const decoded = jwt.verify(token,process.env.JWT_SECRET!) as {id:string};
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('Account not found',401);
    req.user = {id:user.id,email:user.email,role:user.role as Role,name:user.name};
    next();
  } catch (e) { next(e instanceof AppError ? e : new AppError('Invalid or expired token',401)); }
}
export const authorize = (...roles:Role[]) => (req:AuthRequest,_res:Response,next:NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action',403));
  next();
};
