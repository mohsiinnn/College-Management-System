import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js'
import { restrictAdmin } from '../middleware/adminMiddleware.js'
import { addAttendance, createStudentProfile, deleteAllStudents, deleteStudent, deleteStudentsFromClass, getStudentDetail, getStudents, removeAllStudentAttendanceFromSubject, removeAllStudentsAttendance, removeStudentAttendance, removeStudentAttendanceFromSubject } from '../controller/studentController.js'
import { checkAdminApproval, checkTeacherApproval } from '../middleware/requestMiddleware.js'

export const studentRouter = express.Router()

studentRouter.post('/add-student/:id', isAuthenticated, restrictAdmin, checkAdminApproval, createStudentProfile);
studentRouter.get('/all-students', isAuthenticated, restrictAdmin, checkAdminApproval, getStudents);
studentRouter.get('/getStudent/:id', isAuthenticated, restrictAdmin, checkAdminApproval, getStudentDetail);
studentRouter.post('/delete-student/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteStudent);
studentRouter.post('/delete-allStudents', isAuthenticated, restrictAdmin, checkAdminApproval, deleteAllStudents);
studentRouter.post('/delete-classStudents/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteStudentsFromClass);
studentRouter.post('/add-attendance/:id', isAuthenticated, checkTeacherApproval, addAttendance);
studentRouter.post('/remove-attendance/:id', isAuthenticated, checkTeacherApproval, removeStudentAttendance);
studentRouter.post('/remove-allAttendance', isAuthenticated, checkTeacherApproval, removeAllStudentsAttendance);
studentRouter.post('/clear-stuSubAttendance/:id', isAuthenticated, checkTeacherApproval, removeStudentAttendanceFromSubject);
studentRouter.post('/clear-allStuSubAttendance/:id', checkTeacherApproval, isAuthenticated, removeAllStudentAttendanceFromSubject);

export default studentRouter;