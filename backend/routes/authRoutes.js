import express from 'express';
import passport from 'passport';
import { register, login, refreshToken, logout, getMe, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidation, loginValidation } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', (req, res, next) => {
  const failureUrl = `${process.env.CLIENT_URL || ''}/login`;
  passport.authenticate('google', { session: false, failureRedirect: failureUrl })(req, res, next);
}, googleCallback);



export default router;
