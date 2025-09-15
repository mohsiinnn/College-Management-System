import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import superAdminRouter from './routes/superAdminRouter.js';
import classRouter from './routes/classRoutes.js';
import subjectRouter from './routes/subjectRouter.js';
import { teacherRouter } from './routes/teacherRouter.js';
import studentRouter from './routes/studentRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ['https://college-managemnt-system.netlify.app']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the College Management System API');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/super-admin', superAdminRouter);
app.use('/api/class', classRouter);
app.use('/api/subject', subjectRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRouter);

app.listen(Number(PORT), () => console.log(`Server running on port ${PORT}`));