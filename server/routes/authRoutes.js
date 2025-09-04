import express from 'express'
import { getUserData, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/authController.js';
import { isAuthenticated } from '../middleware/userMiddleware.js';

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", isAuthenticated, sendVerifyOtp);
authRouter.post("/verify-account", isAuthenticated, verifyEmail);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/getUserData", isAuthenticated, getUserData);

export default authRouter;