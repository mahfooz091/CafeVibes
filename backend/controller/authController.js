const User = require('../models/User');

// Handles login using quick terminal access code (PIN)
exports.loginWithPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ message: 'PIN code is required' });
    }

    // In a real application, PINs should be hashed and compared.
    const user = await User.findOne({ pin, status: 'active' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid PIN code' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
