import ApiError from '../utils/ApiError.js';

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authorized'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, `Role '${req.user.role}' is not authorized`));
  }

  next();
};

export default authorize;
