import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js'
import { restrictAdmin } from '../middleware/adminMiddleware.js'
import { createStudentProfile, deleteAllStudents, deleteStudent, deleteStudentsFromClass, getStudentDetail, getStudents } from '../controller/studentController.js'

export const studentRouter = express.Router()

studentRouter.post('/add-student/:id', isAuthenticated, restrictAdmin, createStudentProfile);
studentRouter.get('/all-students', isAuthenticated, restrictAdmin, getStudents);
studentRouter.get('/getTeacher/:id', isAuthenticated, restrictAdmin, getStudentDetail);
studentRouter.post('/delete-student/:id', isAuthenticated, restrictAdmin, deleteStudent);
studentRouter.post('/delete-allStudents', isAuthenticated, restrictAdmin, deleteAllStudents);
studentRouter.post('/delete-classStudents/:id', isAuthenticated, restrictAdmin, deleteStudentsFromClass);

export default studentRouter;