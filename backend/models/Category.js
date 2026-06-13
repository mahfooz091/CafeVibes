const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      required: [true, 'Category color is required'],
      default: '#0F766E', // CafeVibes primary teal
      match: [/^#([0-9A-Fa-f]{3}){1,2}$/, 'Color must be a valid hex code'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
