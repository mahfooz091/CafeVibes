import app from '../backend/app.js';
import connectDB from '../backend/config/db.js';

/**
 * Vercel Serverless Function entry point
 * Dispatches all /api/* requests to the Express application
 */
export default async function handler(req, res) {
  // Ensure database connection is active or retrieved from cache
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in Vercel serverless handler:', err);
  }

  // Normalize request URL: if Vercel rewrite strips the /api prefix, restore it
  // so Express routes mounted under app.use('/api/...') match reliably.
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return app(req, res);
}
