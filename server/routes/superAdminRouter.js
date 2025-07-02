import express from 'express'
import { approveAdmin, pendingAdmins, rejectAdmin } from '../controller/superAdminController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictSuperAdmin } from '../middleware/adminMiddleware.js';

export const superAdminRouter = express.Router();

superAdminRouter.get('/pending-admins', isAuthenticated, restrictSuperAdmin, pendingAdmins);
superAdminRouter.post('/approve-admin/:id', isAuthenticated, restrictSuperAdmin, approveAdmin);
superAdminRouter.post('/reject-admin/:id', isAuthenticated, restrictSuperAdmin, rejectAdmin);

export default superAdminRouter;