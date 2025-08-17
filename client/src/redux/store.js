import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import userReducer from './user/userSlice';
import adminReducer from './admin/adminSlice'
import SAdminReducer from './superAdmin/SAdminSlice'
import classReducer from './class/classSlice'
import subjectReducer from './subject/subjectSlice'
import teacherReducer from './teacher/teacherSlice'
import studentReducer from './student/studentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        users: adminReducer,
        sUsers: SAdminReducer,
        class: classReducer,
        subject: subjectReducer,
        teacher: teacherReducer,
        student: studentReducer
    }
}); 