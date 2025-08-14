import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js'
import { restrictAdmin } from '../middleware/adminMiddleware.js'
import { addAttendance, createStudentProfile, deleteAllStudents, deleteStudent, deleteStudentsFromClass, getStudentDetail, getStudentOnly, getStudents, removeAllStudentAttendanceFromSubject, removeAllStudentsAttendance, removeStudentAttendance, removeStudentAttendanceFromSubject } from '../controller/studentController.js'
import { checkAdminApproval } from '../middleware/requestMiddleware.js'

export const studentRouter = express.Router()

studentRouter.post('/add-student/:id', isAuthenticated, restrictAdmin, checkAdminApproval, createStudentProfile);
studentRouter.get('/all-students', isAuthenticated, restrictAdmin, checkAdminApproval, getStudents);
studentRouter.get('/getStudent/:id', isAuthenticated, checkAdminApproval, getStudentDetail);
studentRouter.get('/getStudentOnly/:id', isAuthenticated, checkAdminApproval, getStudentOnly);
studentRouter.post('/delete-student/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteStudent);
studentRouter.post('/delete-allStudents', isAuthenticated, restrictAdmin, checkAdminApproval, deleteAllStudents);
studentRouter.post('/delete-classStudents/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteStudentsFromClass);
studentRouter.post('/add-attendance/:id', isAuthenticated, addAttendance);
studentRouter.post('/remove-attendance/:id', isAuthenticated, removeStudentAttendance);
studentRouter.post('/remove-allAttendance', isAuthenticated, removeAllStudentsAttendance);
studentRouter.post('/clear-stuSubAttendance/:id', isAuthenticated, removeStudentAttendanceFromSubject);
studentRouter.post('/clear-allStuSubAttendance/:id', isAuthenticated, removeAllStudentAttendanceFromSubject);

export default studentRouter;