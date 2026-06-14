import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    paymentMethods: {
      cash: { type: Boolean, default: true },
      card: { type: Boolean, default: true },
      upi: { type: Boolean, default: true },
    },
    upiId: { type: String, default: 'cafevibes@upi' },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
