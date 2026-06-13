// Schema representing loyal customers
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  points: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
