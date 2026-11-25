import { eventBus } from './eventBus.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { Notification } from '../models/Notification.js';
import { Ticket } from '../models/Ticket.js';

type DomainEvent = { actorId:string; ticketId:string; action:string; message:string; notifyUserId?:string; metadata?:Record<string,unknown> };
eventBus.on('domain:event', async (event:DomainEvent) => {
  try {
    await ActivityLog.create({actor:event.actorId,ticket:event.ticketId,action:event.action,message:event.message,metadata:event.metadata || {}});
    let recipient = event.notifyUserId;
    if (!recipient) {
      const ticket = await Ticket.findById(event.ticketId).select('owner');
      recipient = ticket?.owner?.toString();
    }
    if (recipient && recipient !== event.actorId) await Notification.create({recipient,ticket:event.ticketId,message:event.message});
  } catch (error) { console.error('Event listener failed:',error); }
});
