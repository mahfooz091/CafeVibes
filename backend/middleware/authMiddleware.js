const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Protects routes - verifies access token from Authorization header or cookie.
 * Attaches the authenticated user (without password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user not found');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been archived');
  }

  req.user = user;
  next();
});

/**
 * Role-based access control middleware.
 * Usage: authorize('admin') or authorize('admin', 'employee')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user?.role}' is not allowed to access this resource`);
    }
    next();
  };
};

module.exports = { protect, authorize };
