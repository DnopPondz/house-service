import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import passport from 'passport';
import userRoutes from './routes/userRoutes.js';
import './config/passport-jwt-strategy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const DATABASE_URL = process.env.MONGO_URI;
const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost:3000";

// ✅ แก้ไข CORS Policy
const corsOptions = {
    origin: FRONTEND_HOST,
    credentials: true, // ✅ ต้องเป็นตัวเล็ก
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ✅ เชื่อมต่อ Database 
connectDB(DATABASE_URL);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// ✅ Routes API
app.use("/api/user", userRoutes);

// ✅ Vercel ต้องการ handler สำหรับ API
import { createServer } from "http";
const server = createServer(app);

server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

export default app; // ✅ สำคัญสำหรับ Vercel
