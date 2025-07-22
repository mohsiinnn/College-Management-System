import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { createTeacherProfile, deleteAllTeachers, deleteTeacher, getTeacherDetail, getTeachers, updateTeacherSubject } from '../controller/teacherController.js';

export const teacherRouter = express.Router();

teacherRouter.post('/add-teacher/:id', isAuthenticated, restrictAdmin, createTeacherProfile);
teacherRouter.get('/all-teachers', isAuthenticated, restrictAdmin, getTeachers);
teacherRouter.get('/getTeacher/:id', isAuthenticated, restrictAdmin, getTeacherDetail);
teacherRouter.post('/update-teacher/:id', isAuthenticated, restrictAdmin, updateTeacherSubject)
teacherRouter.post('/delete-teacher/:id', isAuthenticated, restrictAdmin, deleteTeacher)
teacherRouter.post('/delete-teachers', isAuthenticated, restrictAdmin, deleteAllTeachers)

export default teacherRouter