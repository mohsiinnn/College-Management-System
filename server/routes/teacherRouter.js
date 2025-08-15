import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { createTeacherProfile, deleteAllTeachers, deleteTeacher, getOneTeacher, getTeacherDetail, getTeachers, updateTeacherSubject } from '../controller/teacherController.js';
import { checkAdminApproval } from '../middleware/requestMiddleware.js';

export const teacherRouter = express.Router();

teacherRouter.post('/add-teacher/:id', isAuthenticated, restrictAdmin, checkAdminApproval, createTeacherProfile);
teacherRouter.get('/all-teachers', isAuthenticated, restrictAdmin, checkAdminApproval, getTeachers);
teacherRouter.get('/getTeacher/:id', isAuthenticated, restrictAdmin, checkAdminApproval, getTeacherDetail);
teacherRouter.get('/getOneTeacher/:id', isAuthenticated, checkAdminApproval, getOneTeacher);
teacherRouter.post('/update-teacher/:id', isAuthenticated, restrictAdmin, checkAdminApproval, updateTeacherSubject)
teacherRouter.post('/delete-teacher/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteTeacher)
teacherRouter.post('/delete-teachers', isAuthenticated, restrictAdmin, checkAdminApproval, deleteAllTeachers)

export default teacherRouter