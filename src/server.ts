import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './router/userRouter';
import proRouter from './router/professionalRouter'
import adminRouter from './router/adminRouter'
import connectDB from './config/database';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT ;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(userRouter);
app.use(proRouter);
app.use(adminRouter)
app.use('/public', express.static(path.join(__dirname, '../public')));


connectDB()

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
