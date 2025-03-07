import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()


let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // ture for 456, false other ports 
    auth: {
        user: process.env.EMAIL_USER,  // Admin Gmail ID
        pass: process.env.EMAIL_PASS, //Admin Gmail Password
    },

})

export default transporter;