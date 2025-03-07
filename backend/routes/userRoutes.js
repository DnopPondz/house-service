import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Define the registration route
router.post('/register', UserController.userRegistration);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.userLogin);



export default router;
