import {Router} from 'express';
import {protect,authorize} from '../middleware/auth.js';
import {stats,notifications,markNotificationRead,activity} from '../controllers/dashboardController.js';
const router=Router();router.use(protect);
router.get('/stats',stats);router.get('/notifications',notifications);router.patch('/notifications/:id/read',markNotificationRead);router.get('/activity',authorize('admin'),activity);
export default router;
