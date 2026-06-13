const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const {
  signup,
  login,
  googleAuth,
  refresh,
  logout,
  getMe,
} = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limit auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

// @route   POST /api/auth/signup
router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);

// @route   POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// @route   POST /api/auth/google
router.post(
  '/google',
  authLimiter,
  [body('idToken').notEmpty().withMessage('Google ID token is required')],
  validate,
  googleAuth
);

// @route   POST /api/auth/refresh
router.post('/refresh', refresh);

// @route   POST /api/auth/logout
router.post('/logout', protect, logout);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
