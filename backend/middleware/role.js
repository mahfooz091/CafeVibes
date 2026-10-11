import ApiError from '../utils/ApiError.js';

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authorized'));
  }

  // Grant read-only exploration access to demo visitors across all modules
  if (req.user.role === 'demo_viewer') {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      return next();
    }
    return next(new ApiError(403, 'Read-only demo: changes are disabled in demo mode.'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, `Role '${req.user.role}' is not authorized`));
  }

  next();
};

export default authorize;
