import mongoose, { Schema } from 'mongoose';
const schema = new Schema({ actor:{type:Schema.Types.ObjectId,ref:'User'}, ticket:{type:Schema.Types.ObjectId,ref:'Ticket',index:true}, action:{type:String,required:true}, message:{type:String,required:true}, metadata:{type:Schema.Types.Mixed,default:{} } },{timestamps:true});
export const ActivityLog = mongoose.model('ActivityLog',schema);
