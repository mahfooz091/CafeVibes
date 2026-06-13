const User = require('../models/User');

exports.getStaff = async (req, res, next) => {
  try {
    const staff = await User.find().select('-pin'); // Exclude pin in list
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

exports.createStaff = async (req, res, next) => {
  try {
    const { name, email, phone, role, pin, status } = req.body;
    // In a real application, PIN must be hashed
    const staff = new User({ name, email, phone, role, pin, status });
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    next(error);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const staff = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-pin');
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};
