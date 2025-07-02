import express from 'express';
import { approveUser, pendindApprovals, rejectUser } from '../controller/adminController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';

export const adminRouter = express.Router();

adminRouter.get('/pending-approvals', isAuthenticated, restrictAdmin, pendindApprovals);
adminRouter.post('/approve-user/:id', isAuthenticated, restrictAdmin, approveUser);
adminRouter.post('/reject-user/:id', isAuthenticated, restrictAdmin, rejectUser);

export default adminRouter;