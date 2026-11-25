import type { Request } from 'express';
export type Role = 'user' | 'admin';
export interface AuthUser { id: string; email: string; role: Role; name: string }
export interface AuthRequest extends Request { user?: AuthUser }
