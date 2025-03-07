import express from 'express';
import UserController from '../controllers/userController.js';
import passport from 'passport'
import setAuthHeader from '../middlewares/setAuthHeader.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js'

const router = express.Router();

// Define the registration route
router.post('/register', UserController.userRegistration);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.userLogin);
router.post('/refresh-token', UserController.getNewAccessToken);

// ✅ Protected Route: /me
router.get('/me', accessTokenAutoRefresh, passport.authenticate('jwt', { session: false }), UserController.userProfile);




export default router;
