import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { createClass, deleteClass, deleteClassStudents, getAllClasses, getSingleClass } from '../controller/classController.js';
import { checkAdminApproval } from '../middleware/requestMiddleware.js';

export const classRouter = express.Router();

classRouter.post('/register-class', isAuthenticated, restrictAdmin, checkAdminApproval, createClass);
classRouter.get('/all-classes', isAuthenticated, restrictAdmin, checkAdminApproval, getAllClasses);
classRouter.get('/:id', isAuthenticated, restrictAdmin, checkAdminApproval, getSingleClass);
classRouter.post('/delete-classStudents/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteClassStudents);
classRouter.post('/delete-class/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteClass)

export default classRouter;
