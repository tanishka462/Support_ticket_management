import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import type { AuthRequest } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';
function tokenFor(id:string){return jwt.sign({id},process.env.JWT_SECRET!,{expiresIn:(process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']});}
export const register = asyncHandler(async(req,res)=>{
 const data=registerSchema.parse(req.body);
 if(await User.exists({email:data.email.toLowerCase()})) throw new AppError('Email is already registered',409);
 const user=await User.create({name:data.name,email:data.email,passwordHash:await bcrypt.hash(data.password,12),role:'user'});
 res.status(201).json({success:true,data:{token:tokenFor(user.id),user:{id:user.id,name:user.name,email:user.email,role:user.role}}});
});
export const login = asyncHandler(async(req,res)=>{
 const data=loginSchema.parse(req.body);
 const user=await User.findOne({email:data.email.toLowerCase()}).select('+passwordHash');
 if(!user || !(await bcrypt.compare(data.password,user.passwordHash))) throw new AppError('Invalid email or password',401);
 res.json({success:true,data:{token:tokenFor(user.id),user:{id:user.id,name:user.name,email:user.email,role:user.role}}});
});
export const me = asyncHandler(async(req:AuthRequest,res:Response)=>{
 res.json({success:true,data:{user:req.user}});
});
