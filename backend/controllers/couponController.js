import Coupon from '../models/Coupon.js';
import Promotion from '../models/Promotion.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, count: coupons.length, data: coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json({ success: true, message: 'Coupon deleted' });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) throw new ApiError(404, 'Invalid coupon code');
  if (coupon.validUntil && coupon.validUntil < new Date()) throw new ApiError(400, 'Coupon expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');
  if (orderAmount < coupon.minOrderAmount) throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount}`);

  let discount = coupon.type === 'percentage' ? (orderAmount * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.json({
    success: true,
    data: { coupon, discount: Math.round(discount * 100) / 100 },
  });
});

export const getPromotions = asyncHandler(async (req, res) => {
  const promotions = await Promotion.find().populate('categories products').sort({ createdAt: -1 });
  res.json({ success: true, count: promotions.length, data: promotions });
});

export const createPromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: promotion });
});

export const updatePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!promotion) throw new ApiError(404, 'Promotion not found');
  res.json({ success: true, data: promotion });
});

export const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findByIdAndDelete(req.params.id);
  if (!promotion) throw new ApiError(404, 'Promotion not found');
  res.json({ success: true, message: 'Promotion deleted' });
});
