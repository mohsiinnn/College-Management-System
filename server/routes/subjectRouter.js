import express from 'express'
import { allSubjects, classSubjects, createSubjects, freeSubjectList, getSubjectDetail } from '../controller/subjectController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';

export const subjectRouter = express.Router();

subjectRouter.post('/add-subject',isAuthenticated, restrictAdmin, createSubjects);
subjectRouter.get('/all-subjects',isAuthenticated, restrictAdmin, allSubjects);
subjectRouter.get('/class-subjects/:id',isAuthenticated, restrictAdmin, classSubjects);
subjectRouter.get('/free-subjects/:id',isAuthenticated, restrictAdmin, freeSubjectList);
subjectRouter.get('/subject-details/:id',isAuthenticated, restrictAdmin, getSubjectDetail);

export default subjectRouter;