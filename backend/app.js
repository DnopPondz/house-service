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

// ✅ Middleware CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://house-service-five.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

const allowedOrigins = [
    "http://localhost:3000",
    "https://house-service-five.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // ✅ สำคัญสำหรับ cookie หรือ JWT
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
