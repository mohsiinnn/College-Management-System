import express from 'express'
import { approveUser, pendindApprovals, rejectUser } from '../controller/adminController.js';

export const adminRouter = express.Router();

adminRouter.get('/pending-approvals', pendindApprovals);
adminRouter.post('/approve-user/:id', approveUser);
adminRouter.post('/reject-user/:id', rejectUser)

export default adminRouter;