// Schema representing Item Categories
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '☕' }, // Emoji or icon tag
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
