import mongoose, { Schema } from 'mongoose';
const schema = new Schema({ recipient:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, ticket:{type:Schema.Types.ObjectId,ref:'Ticket'}, message:{type:String,required:true}, readAt:{type:Date,default:null} },{timestamps:true});
export const Notification = mongoose.model('Notification',schema);
