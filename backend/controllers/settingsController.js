import Settings from '../models/Settings.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      paymentMethods: { cash: true, card: true, upi: true },
      upiId: 'cafevibes@upi',
    });
  }
  res.json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { paymentMethods, upiId } = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  if (paymentMethods !== undefined) {
    settings.paymentMethods = {
      cash: paymentMethods.cash ?? settings.paymentMethods.cash,
      card: paymentMethods.card ?? settings.paymentMethods.card,
      upi: paymentMethods.upi ?? settings.paymentMethods.upi,
    };
  }

  if (upiId !== undefined) {
    settings.upiId = upiId;
  }

  await settings.save();
  res.json({ success: true, data: settings });
});
