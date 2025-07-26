import express from 'express';
import { approveUser, pendingApprovals, rejectUser } from '../controller/adminController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { checkAdminApproval } from '../middleware/requestMiddleware.js';

export const adminRouter = express.Router();

adminRouter.get('/pending-approvals', isAuthenticated, restrictAdmin, checkAdminApproval, pendingApprovals);
adminRouter.post('/approve-user/:id', isAuthenticated, restrictAdmin, checkAdminApproval, approveUser);
adminRouter.post('/reject-user/:id', isAuthenticated, restrictAdmin, checkAdminApproval, rejectUser);

export default adminRouter;