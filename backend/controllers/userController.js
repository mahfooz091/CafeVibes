import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'Email is already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
    isVerified: true,
  });

  // Exclude password from response
  const responseData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

  res.status(201).json({ success: true, data: responseData });
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = password;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

export const toggleUserArchive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent self-archiving (lockout safety check)
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot archive your own administrator account');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, data: user, message: `Account successfully ${user.isActive ? 'activated' : 'archived'}` });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent self-deletion (lockout safety check)
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot delete your own administrator account');
  }

  await User.findByIdAndDelete(user._id);
  res.json({ success: true, message: 'User deleted successfully' });
});
