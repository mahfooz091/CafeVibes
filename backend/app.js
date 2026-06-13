const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Core middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CafeVibes API is running - The Digital Heartbeat of Your Cafe',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 + error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
