import express from 'express'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { createClass, getAllClasses, getSingleClass } from '../controller/classController.js';

export const classRouter = express.Router();

classRouter.post('/register-class', isAuthenticated, restrictAdmin, createClass);
classRouter.get('/all-classes', isAuthenticated, restrictAdmin, getAllClasses);
classRouter.get('/:id', isAuthenticated, restrictAdmin, getSingleClass);

export default classRouter;
