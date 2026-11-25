import { Ticket } from '../models/Ticket.js';
import { Notification } from '../models/Notification.js';
import { ActivityLog } from '../models/ActivityLog.js';
import type { AuthRequest } from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const stats=asyncHandler(async(req:AuthRequest,res)=>{
 const match=req.user!.role==='admin'?{}:{owner:req.user!.id};
 const [total,open,inProgress,resolved,urgent,recent]=await Promise.all([
  Ticket.countDocuments(match),Ticket.countDocuments({...match,status:'open'}),Ticket.countDocuments({...match,status:'in_progress'}),
  Ticket.countDocuments({...match,status:'resolved'}),Ticket.countDocuments({...match,priority:'urgent'}),
  Ticket.find(match).sort({createdAt:-1}).limit(5).populate('owner','name')
 ]);
 res.json({success:true,data:{stats:{total,open,inProgress,resolved,urgent},recent}});
});
export const notifications=asyncHandler(async(req:AuthRequest,res)=>{
 const items=await Notification.find({recipient:req.user!.id}).populate('ticket','title').sort({createdAt:-1}).limit(30);
 res.json({success:true,data:{notifications:items}});
});
export const markNotificationRead=asyncHandler(async(req:AuthRequest,res)=>{
 const item=await Notification.findOneAndUpdate({_id:req.params.id,recipient:req.user!.id},{readAt:new Date()},{new:true});
 res.json({success:true,data:{notification:item}});
});
export const activity=asyncHandler(async(_req,res)=>{
 const logs=await ActivityLog.find().populate('actor','name role').populate('ticket','title').sort({createdAt:-1}).limit(50);
 res.json({success:true,data:{activity:logs}});
});
