import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw new ApiError(400, 'Validation failed', formatted);
  }
  next();
};

export default validate;
