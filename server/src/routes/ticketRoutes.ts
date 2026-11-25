import {Router} from 'express';
import {protect,authorize} from '../middleware/auth.js';
import {listTickets,createTicket,getTicket,updateTicket,deleteTicket,addComment,adminUpdateTicket} from '../controllers/ticketController.js';
const router=Router();
router.use(protect);
router.get('/',listTickets);router.post('/',createTicket);router.get('/:id',getTicket);router.patch('/:id',updateTicket);router.delete('/:id',deleteTicket);
router.post('/:id/comments',addComment);router.patch('/:id/admin',authorize('admin'),adminUpdateTicket);
export default router;
