// Schema representing Cafe App Configurations
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  cafeName: { type: String, required: true, default: 'CafeVibes' },
  currency: { type: String, default: 'USD' },
  taxRate: { type: Number, default: 0.08 }, // 8% default
  serviceCharge: { type: Number, default: 0.05 }, // 5% default
  receiptHeader: { type: String },
  receiptFooter: { type: String, default: 'Thank you for choosing CafeVibes!' },
  enabledPaymentMethods: {
    cash: { type: Boolean, default: true },
    card: { type: Boolean, default: true },
    mobile: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
