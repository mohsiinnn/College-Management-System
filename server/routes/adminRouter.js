import express from 'express';
import { approveUser, pendingApprovals, rejectUser } from '../controller/adminController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';

export const adminRouter = express.Router();

adminRouter.get('/pending-approvals', isAuthenticated, restrictAdmin, pendingApprovals);
adminRouter.post('/approve-user/:id', isAuthenticated, restrictAdmin, approveUser);
adminRouter.post('/reject-user/:id', isAuthenticated, restrictAdmin, rejectUser);

export default adminRouter;