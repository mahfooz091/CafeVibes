// Schema representing a POS transaction order
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String } // E.g., 'Less sugar', 'Soy milk'
});

const orderSchema = new mongoose.Schema({
  type: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'] },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
