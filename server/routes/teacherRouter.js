import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { createTeacherProfile, getTeacherDetail, getTeachers, updateTeacherSubject } from '../controller/teacherController.js';

export const teacherRouter = express.Router();

teacherRouter.post('/add-teacher', isAuthenticated, restrictAdmin, createTeacherProfile);
teacherRouter.get('/all-teachers', isAuthenticated, restrictAdmin, getTeachers);
teacherRouter.get('/getTeacher/:id', isAuthenticated, restrictAdmin, getTeacherDetail);
teacherRouter.post('/update-teacher', isAuthenticated, restrictAdmin, updateTeacherSubject)