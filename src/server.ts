import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './router/userRouter';
import proRouter from './router/professionalRouter';
import adminRouter from './router/adminRouter';
import connectDB from './config/database';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import handleSocketConnection from './helper/socketHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(userRouter);
app.use(proRouter);
app.use(adminRouter);
app.use('/public', express.static(path.join(__dirname, '../public')));

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

handleSocketConnection(io);  


