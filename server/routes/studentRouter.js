import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js'
import { restrictAdmin } from '../middleware/adminMiddleware.js'
import { addAttendance, createStudentProfile, deleteAllStudents, deleteStudent, deleteStudentsFromClass, getStudentDetail, getStudents, removeAllStudentAttendanceFromSubject, removeAllStudentsAttendance, removeStudentAttendance, removeStudentAttendanceFromSubject } from '../controller/studentController.js'

export const studentRouter = express.Router()

studentRouter.post('/add-student/:id', isAuthenticated, restrictAdmin, createStudentProfile);
studentRouter.get('/all-students', isAuthenticated, restrictAdmin, getStudents);
studentRouter.get('/getStudent/:id', isAuthenticated, restrictAdmin, getStudentDetail);
studentRouter.post('/delete-student/:id', isAuthenticated, restrictAdmin, deleteStudent);
studentRouter.post('/delete-allStudents', isAuthenticated, restrictAdmin, deleteAllStudents);
studentRouter.post('/delete-classStudents/:id', isAuthenticated, restrictAdmin, deleteStudentsFromClass);
studentRouter.post('/add-attendance/:id', isAuthenticated, addAttendance);
studentRouter.post('/remove-attendance/:id', isAuthenticated, removeStudentAttendance);
studentRouter.post('/remove-allAttendance', isAuthenticated, removeAllStudentsAttendance);
studentRouter.post('/clear-stuSubAttendance/:id', isAuthenticated, removeStudentAttendanceFromSubject);
studentRouter.post('/clear-allStuSubAttendance/:id', isAuthenticated, removeAllStudentAttendanceFromSubject);

export default studentRouter;