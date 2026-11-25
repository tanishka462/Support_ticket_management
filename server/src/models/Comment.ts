import mongoose, { Schema } from 'mongoose';
const schema = new Schema({ ticket:{type:Schema.Types.ObjectId,ref:'Ticket',required:true,index:true}, author:{type:Schema.Types.ObjectId,ref:'User',required:true}, body:{type:String,required:true,trim:true,maxlength:2000} },{timestamps:true});
export const Comment = mongoose.model('Comment',schema);
