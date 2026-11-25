import { z } from 'zod';
export const registerSchema = z.object({name:z.string().trim().min(2).max(80),email:z.string().email(),password:z.string().min(8).max(72)});
export const loginSchema = z.object({email:z.string().email(),password:z.string().min(1)});
export const ticketSchema = z.object({
 title:z.string().trim().min(4).max(120),description:z.string().trim().min(10).max(5000),
 category:z.enum(['technical','billing','account','general','other']).default('general'),
 priority:z.enum(['low','medium','high','urgent']).default('medium')
});
export const updateTicketSchema = ticketSchema.partial();
export const commentSchema = z.object({body:z.string().trim().min(1).max(2000)});
export const adminTicketSchema = z.object({status:z.enum(['open','in_progress','waiting_for_user','resolved','closed']).optional(),priority:z.enum(['low','medium','high','urgent']).optional()}).refine(v=>Object.keys(v).length>0);
