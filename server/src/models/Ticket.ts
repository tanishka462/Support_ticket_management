import mongoose, { Schema } from 'mongoose';
const ticketSchema = new Schema({
  title:{type:String,required:true,trim:true,maxlength:120},
  description:{type:String,required:true,trim:true,maxlength:5000},
  category:{type:String,enum:['technical','billing','account','general','other'],default:'general'},
  priority:{type:String,enum:['low','medium','high','urgent'],default:'medium'},
  status:{type:String,enum:['open','in_progress','waiting_for_user','resolved','closed'],default:'open'},
  owner:{type:Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true});
ticketSchema.index({owner:1,createdAt:-1});
ticketSchema.index({status:1,priority:1,createdAt:-1});
ticketSchema.index({title:'text',description:'text'});
export const Ticket = mongoose.model('Ticket',ticketSchema);
