import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/connectdb.js';
import passport from 'passport';
import userRoutes from './routes/userRoutes.js';
import './config/passport-jwt-strategy.js'

dotenv.config()
const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.MONGO_URI

// This will solve CORS Policy Error 
const corOptions = {
    // Set origin to a Specific orgin
    origin: process.env.FRONTEND_HOST,
    Credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corOptions))

// Darabase Connection 
connectDB(DATABASE_URL)

// JSON 
app.use(express.json())

// Passport Middleware
app.use(passport.initialize())

// Cookie Parser
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));

//  Load Routes API
app.use("/api/user", userRoutes)








app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    
})