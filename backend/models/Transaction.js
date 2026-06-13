// Schema representing completed sales/payment details (for analytics)
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'], required: true },
  amountReceived: { type: Number },
  changeReturned: { type: Number },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
