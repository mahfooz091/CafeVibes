// Schema representing Table maps & occupancy status
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seats: { type: Number, required: true },
  floor: { type: String, required: true, default: 'ground' }, // E.g., ground, terrace
  status: { type: String, enum: ['available', 'occupied', 'billed', 'reserved'], default: 'available' },
  activeOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  coordinates: {
    x: { type: Number },
    y: { type: Number }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);
