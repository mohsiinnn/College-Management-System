import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import userReducer from './user/userSlice';
import adminReducer from './admin/adminSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        users: adminReducer,
        
    }
}); 