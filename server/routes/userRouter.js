import express from 'express'
import { isAuthenticated, requireRole } from '../middleware/userMiddleware.js';
import { adminDashBoard, studentDashBoard, superAdminDashBoard, teacherDashBoard } from '../controller/userController.js';
import { checkAdminApproval, checkStudentApproval, checkTeacherApproval } from '../middleware/requestMiddleware.js';

export const userRouter = express.Router();

userRouter.get("/superAdmin-dashboard", isAuthenticated, requireRole('superAdmin'), superAdminDashBoard);
userRouter.get("/admin-dashboard", isAuthenticated, requireRole('admin'), checkAdminApproval, adminDashBoard);
userRouter.get("/teacher-dashboard", isAuthenticated, requireRole('teacher'), checkTeacherApproval, teacherDashBoard)
userRouter.get("/student-dashboard", isAuthenticated, requireRole('student'), checkStudentApproval, studentDashBoard)

export default userRouter;