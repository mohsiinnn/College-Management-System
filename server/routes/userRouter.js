import express from 'express'
import { isAuthenticated, requireRole } from '../middleware/userMiddleware.js';
import { adminDashBoard, studentDashBoard, teacherDashBoard } from '../controller/userController.js';

export const userRouter = express.Router();

userRouter.get("/admin-dashboard", isAuthenticated, requireRole('admin'), adminDashBoard);
userRouter.get("/teacher-dashboard", isAuthenticated, requireRole('teacher'), teacherDashBoard)
userRouter.get("/student-dashboard", isAuthenticated, requireRole('student'), studentDashBoard)

export default userRouter;