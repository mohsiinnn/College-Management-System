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

const app = express();
const port = 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res) => {
    res.send('Welcome to the College Management System API');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter);
app.use('/api/super-admin', superAdminRouter);
app.use('/api/class', classRouter);
app.use('/api/subject', subjectRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});