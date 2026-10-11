import crypto from 'crypto';
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
  clearTokenCookies,
} from '../utils/generateTokens.js';

const sendAuthResponse = async (user, req, res, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

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
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(400, 'Email already registered');

  // Prevent privilege escalation: self-registration never grants admin unless system has 0 users
  const userCount = await User.countDocuments();
  const userRole = userCount === 0 ? 'admin' : 'employee';

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: userRole,
    isVerified: true,
  });
  await sendAuthResponse(user, req, res, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
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

  clearTokenCookies(res);
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
  const accessToken = generateAccessToken(req.user._id, req.user.role);
  const refreshToken = generateRefreshToken(req.user._id, req.user.role);
  await createSession(req.user._id, refreshToken, req.headers['user-agent'], req.ip);
  const clientUrl = process.env.CLIENT_URL || '';
  res.redirect(`${clientUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
});

export const demoLogin = asyncHandler(async (req, res) => {
  const demoEmail = 'demo.visitor@cafevibes.com';
  const demoName = 'Demo Visitor';

  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    const randomPassword = crypto.randomBytes(24).toString('hex') + 'A1!';
    user = await User.create({
      name: demoName,
      email: demoEmail,
      password: randomPassword,
      role: 'demo_viewer',
      isVerified: true,
      isActive: true,
    });
  } else {
    let needsSave = false;
    if (!user.isActive) {
      user.isActive = true;
      needsSave = true;
    }
    if (user.role !== 'demo_viewer') {
      user.role = 'demo_viewer';
      needsSave = true;
    }
    if (needsSave) {
      await user.save();
    }
  }

  await sendAuthResponse(user, req, res);
});

