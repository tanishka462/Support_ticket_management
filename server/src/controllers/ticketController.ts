import type { Response } from 'express';
import { Ticket } from '../models/Ticket.js';
import { Comment } from '../models/Comment.js';
import { User } from '../models/User.js';
import { eventBus } from '../events/eventBus.js';
import type { AuthRequest } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ticketSchema,updateTicketSchema,commentSchema,adminTicketSchema } from '../validation/schemas.js';

async function getAccessibleTicket(id:string,user:NonNullable<AuthRequest['user']>) {
 const ticket=await Ticket.findById(id).populate('owner','name email');
 if(!ticket) throw new AppError('Ticket not found',404);
 if(user.role!=='admin' && ticket.owner._id.toString()!==user.id) throw new AppError('You cannot access this ticket',403);
 return ticket;
}
export const listTickets=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const admin=req.user!.role==='admin';
 const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(50,Math.max(1,Number(req.query.limit)||10));
 const filter:any={};
 if(!admin) filter.owner=req.user!.id;
 if(req.query.status) filter.status=req.query.status;
 if(req.query.priority) filter.priority=req.query.priority;
 if(req.query.category) filter.category=req.query.category;
 if(req.query.q) filter.$text={$search:String(req.query.q)};
 const [tickets,total]=await Promise.all([
  Ticket.find(filter).populate('owner','name email').sort({createdAt:-1}).skip((page-1)*limit).limit(limit),
  Ticket.countDocuments(filter)
 ]);
 res.json({success:true,data:{tickets,pagination:{page,limit,total,pages:Math.ceil(total/limit)}}});
});
export const createTicket=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const data=ticketSchema.parse(req.body);
 const ticket=await Ticket.create({...data,owner:req.user!.id});
 eventBus.emit('domain:event',{actorId:req.user!.id,ticketId:ticket.id,action:'ticket.created',message:`Ticket "${ticket.title}" was created`});
 res.status(201).json({success:true,data:{ticket}});
});
export const getTicket=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const ticket=await getAccessibleTicket(req.params.id,req.user!);
 const comments=await Comment.find({ticket:ticket.id}).populate('author','name role').sort({createdAt:1});
 res.json({success:true,data:{ticket,comments}});
});
export const updateTicket=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const ticket=await getAccessibleTicket(req.params.id,req.user!);
 if(req.user!.role!=='admin' && ticket.status!=='open') throw new AppError('Only open tickets can be edited',400);
 const data=updateTicketSchema.parse(req.body);
 Object.assign(ticket,data); await ticket.save();
 eventBus.emit('domain:event',{actorId:req.user!.id,ticketId:ticket.id,action:'ticket.updated',message:`Ticket "${ticket.title}" was updated`});
 res.json({success:true,data:{ticket}});
});
export const deleteTicket=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const ticket=await getAccessibleTicket(req.params.id,req.user!);
 if(req.user!.role!=='admin' && ticket.status!=='open') throw new AppError('Only open tickets can be deleted',400);
 await Promise.all([Comment.deleteMany({ticket:ticket.id}),ticket.deleteOne()]);
 res.json({success:true,message:'Ticket deleted'});
});
export const addComment=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const ticket=await getAccessibleTicket(req.params.id,req.user!);
 const {body}=commentSchema.parse(req.body);
 const comment=await Comment.create({ticket:ticket.id,author:req.user!.id,body});
 const ownerId=(ticket.owner as any)._id?.toString() || (ticket.owner as any).toString();
 eventBus.emit('domain:event',{actorId:req.user!.id,ticketId:ticket.id,action:'comment.added',message:`New comment on "${ticket.title}"`,notifyUserId:req.user!.role==='admin'?ownerId:undefined});
 const populated=await comment.populate('author','name role');
 res.status(201).json({success:true,data:{comment:populated}});
});
export const adminUpdateTicket=asyncHandler(async(req:AuthRequest,res:Response)=>{
 const ticket=await Ticket.findById(req.params.id);
 if(!ticket) throw new AppError('Ticket not found',404);
 const data=adminTicketSchema.parse(req.body);
 const oldStatus=ticket.status;
 Object.assign(ticket,data); await ticket.save();
 const action=data.status && data.status!==oldStatus ? (data.status==='resolved'?'ticket.resolved':'ticket.status_changed') : 'ticket.updated';
 eventBus.emit('domain:event',{actorId:req.user!.id,ticketId:ticket.id,action,message:`Admin updated "${ticket.title}"${data.status?` to ${data.status.replaceAll('_',' ')}`:''}`});
 res.json({success:true,data:{ticket}});
});
