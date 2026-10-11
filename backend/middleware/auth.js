import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { demoSecurityMiddleware } from './demoReadOnly.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    throw new ApiError(401, 'Not authorized, please login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id).select('-password');

    // Resilient fallback for demo visitor tokens during cold start
    if (!user && decoded.role === 'demo_viewer') {
      user = {
        _id: decoded.id,
        name: 'Demo Visitor',
        email: 'demo.visitor@cafevibes.com',
        role: 'demo_viewer',
        isActive: true,
      };
    }

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or deactivated');
    }

    req.user = user;
    return demoSecurityMiddleware(req, res, next);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired, please refresh');
    }
    throw new ApiError(401, 'Not authorized, invalid token');
  }
});

export default protect;
