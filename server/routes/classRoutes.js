import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware';
import { restrictAdmin } from '../middleware/adminMiddleware';
import { addStudent, addTeacher, createClass } from '../controller/classController';

export const classRouter = express.Router();

classRouter.post('/:name', isAuthenticated, restrictAdmin, createClass);
classRouter.post('/add-teacher', isAuthenticated, restrictAdmin, addTeacher);
classRouter.post('/add-student', isAuthenticated, restrictAdmin, addStudent);

export default classRouter;
