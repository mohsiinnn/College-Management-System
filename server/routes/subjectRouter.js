import express from 'express'
import { allSubjects, classSubjects, createSubjects, deleteAllSubjects, deleteSubject, deleteSubjectsFromClass, freeSubjectList, getSubjectDetail } from '../controller/subjectController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { restrictAdmin } from '../middleware/adminMiddleware.js';
import { checkAdminApproval } from '../middleware/requestMiddleware.js';

export const subjectRouter = express.Router();

subjectRouter.post('/add-subject', isAuthenticated, restrictAdmin, checkAdminApproval, createSubjects);
subjectRouter.get('/all-subjects', isAuthenticated, restrictAdmin, checkAdminApproval, allSubjects);
subjectRouter.get('/class-subjects/:id', isAuthenticated, restrictAdmin, checkAdminApproval, classSubjects);
subjectRouter.get('/free-subjects/:id', isAuthenticated, restrictAdmin, checkAdminApproval, freeSubjectList);
subjectRouter.get('/subject-details/:id', isAuthenticated, restrictAdmin, checkAdminApproval, getSubjectDetail);
subjectRouter.post('/delete-subject/:id', isAuthenticated, restrictAdmin, checkAdminApproval, deleteSubject);
subjectRouter.post('/delete-allSubjects', isAuthenticated, restrictAdmin, checkAdminApproval, deleteAllSubjects);
subjectRouter.post('/delete-allClassSubjects/', isAuthenticated, restrictAdmin, checkAdminApproval, deleteSubjectsFromClass);

export default subjectRouter;