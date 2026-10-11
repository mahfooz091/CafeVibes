import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import configurePassport from './config/passport.js';
import connectDB from './config/db.js';
import seedDatabase from './utils/seedData.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import posSessionRoutes from './routes/posSessionRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Trust reverse proxy (Vercel, AWS, Nginx) for accurate IP resolution in rateLimiter
app.set('trust proxy', 1);

// Configure dynamic CORS for local dev, Vercel deployments, and custom domains
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:5001',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowedLocal = /^https?:\/\/localhost(:\d+)?$/.test(origin);
      const isAllowedVercel = /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);
      const isConfiguredOrigin = allowedOrigins.includes(origin);

      if (isConfiguredOrigin || isAllowedLocal || isAllowedVercel) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

configurePassport();
app.use(passport.initialize());

// Ensure database connection for all incoming API requests (critical for serverless)
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health' || req.path === '/' || req.path === '/api') {
    return next();
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Database connection error in request middleware:', err);
    res.status(500).json({ success: false, message: 'Database connection failed. Please check MONGODB_URI.' });
  }
});

// Root & Health check endpoints
app.get(['/', '/api', '/api/health', '/health'], (_req, res) => {
  res.json({
    success: true,
    message: 'CafeVibes API is running',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'production',
  });
});

// Seed endpoint: Protected by secret key (ADMIN_SEED_SECRET) in production or restricted to development
app.all(['/api/seed', '/seed'], async (req, res) => {
  if (req.user?.role === 'demo_viewer') {
    return res.status(403).json({
      success: false,
      message: 'Read-only demo: database seeding is disabled in demo mode.',
      isDemoMode: true,
    });
  }

  const seedSecret = process.env.ADMIN_SEED_SECRET;
  const providedKey = req.headers['x-seed-key'] || req.query.key;

  if (process.env.NODE_ENV === 'production') {
    if (!seedSecret || providedKey !== seedSecret) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access to database seeding endpoint requires a valid secret key.',
      });
    }
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    await seedDatabase();
    res.json({ success: true, message: 'Database successfully seeded with default data!' });
  } catch (error) {
    console.error('Database seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', floorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pos-sessions', posSessionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
