import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  createSession,
  setTokenCookies,
} from '../utils/generateTokens.js';

const sendAuthResponse = async (user, req, res, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await createSession(user._id, refreshToken, req.headers['user-agent'], req.ip);
  setTokenCookies(res, accessToken, refreshToken);

  res.status(statusCode).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const userCount = await User.countDocuments();
  const userRole = userCount === 0 ? 'admin' : role || 'employee';

  const user = await User.create({ name, email, password, role: userRole, isVerified: true });
  await sendAuthResponse(user, req, res, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) throw new ApiError(403, 'Account deactivated');

  await sendAuthResponse(user, req, res);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');

  const session = await Session.findOne({ refreshToken: token, isRevoked: false });
  if (!session || session.expiresAt < new Date()) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  try {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(session.user);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found');

  session.isRevoked = true;
  await session.save();

  await sendAuthResponse(user, req, res);
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (token) {
    await Session.findOneAndUpdate({ refreshToken: token }, { isRevoked: true });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Google authentication failed');
  const accessToken = generateAccessToken(req.user._id);
  const refreshToken = generateRefreshToken(req.user._id);
  await createSession(req.user._id, refreshToken, req.headers['user-agent'], req.ip);
  setTokenCookies(res, accessToken, refreshToken);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
});
