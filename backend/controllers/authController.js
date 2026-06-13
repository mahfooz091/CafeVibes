const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');
const { verifyGoogleToken } = require('../config/googleOAuth');

// Cookie options for refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
};

const buildAuthTokens = async (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

// @desc    Register a new user (defaults to employee role; first user becomes admin)
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // First registered user becomes admin automatically
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'employee';

  const user = await User.create({ name, email, password, role });

  const { accessToken, refreshToken } = await buildAuthTokens(user);

  res
    .status(201)
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: user.toSafeObject(), accessToken, refreshToken },
        'Account created successfully'
      )
    );
});

// @desc    Login with email & password
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been archived. Contact your admin.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = await buildAuthTokens(user);

  res
    .status(200)
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: user.toSafeObject(), accessToken, refreshToken },
        'Login successful'
      )
    );
});

// @desc    Login / Signup with Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(400, 'Google ID token is required');
  }

  const payload = await verifyGoogleToken(idToken);
  const { email, name, picture, sub: googleId } = payload;

  let user = await User.findOne({ email }).select('+refreshToken');

  if (!user) {
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'employee';

    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture,
      role,
    });
  } else if (!user.googleId) {
    // Link existing account to Google
    user.googleId = googleId;
    if (!user.avatar) user.avatar = picture;
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been archived. Contact your admin.');
  }

  const { accessToken, refreshToken } = await buildAuthTokens(user);

  res
    .status(200)
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: user.toSafeObject(), accessToken, refreshToken },
        'Google authentication successful'
      )
    );
});

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Refresh token is invalid or has been revoked');
  }

  const { accessToken, refreshToken } = await buildAuthTokens(user);

  res
    .status(200)
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken }, 'Token refreshed'));
});

// @desc    Logout user - clears refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (err) {
      // token already invalid - nothing to do
    }
  }

  res
    .status(200)
    .clearCookie('accessToken', { path: '/' })
    .clearCookie('refreshToken', { path: '/api/auth' })
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user.toSafeObject() }, 'User fetched'));
});

module.exports = {
  signup,
  login,
  googleAuth,
  refresh,
  logout,
  getMe,
};
