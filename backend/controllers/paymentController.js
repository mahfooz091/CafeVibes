import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';
import POSSession from '../models/POSSession.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generatePaymentQR } from '../services/qrService.js';
import { sendReceiptEmail } from '../services/receiptService.js';
import { updateCustomerStats } from './orderController.js';

export const processPayment = asyncHandler(async (req, res) => {
  const { method, amount, transactionRef } = req.body;
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('table', 'name');

  if (!order) throw new ApiError(404, 'Order not found');

  const activeSession = await POSSession.findOne({ user: req.user._id, status: 'open' });
  if (activeSession) {
    order.posSession = activeSession._id;
  }
  if (order.status === 'paid') throw new ApiError(400, 'Order already paid');
  if (order.status === 'cancelled') throw new ApiError(400, 'Order is cancelled');

  const settings = await Settings.findOne() || {
    paymentMethods: { cash: true, card: true, upi: true },
    upiId: 'cafevibes@upi'
  };

  // Validate that the payment method is enabled
  if (method === 'cash' && !settings.paymentMethods?.cash) {
    throw new ApiError(400, 'Cash payments are currently disabled');
  }
  if (method === 'card' && !settings.paymentMethods?.card) {
    throw new ApiError(400, 'Card/Digital payments are currently disabled');
  }
  if (method === 'upi' && !settings.paymentMethods?.upi) {
    throw new ApiError(400, 'UPI payments are currently disabled');
  }

  let qrCode = null;
  let changeGiven = 0;

  if (method === 'upi') {
    qrCode = await generatePaymentQR(order.total, order.orderNumber, settings.upiId);
  }

  if (method === 'cash') {
    if (amount < order.total) throw new ApiError(400, 'Insufficient cash amount');
    changeGiven = Math.round((amount - order.total) * 100) / 100;
  }

  order.payment = {
    method,
    amount: method === 'cash' ? amount : order.total,
    transactionRef,
    qrCode,
    changeGiven,
    paidAt: new Date(),
  };
  order.status = 'paid';
  order.paidAt = new Date();
  order.kitchenStatus = 'pending';

  if (order.coupon) {
    await Coupon.findByIdAndUpdate(order.coupon, { $inc: { usedCount: 1 } });
  }

  await order.save();
  await updateCustomerStats(order.customer, order.total);

  // Automatically send receipt email to customer if email is configured
  if (order.customer?.email) {
    sendReceiptEmail(order.customer.email, order).catch((err) => {
      console.error('Failed to send automatic receipt email:', err);
    });
  }

  if (order.table) {
    await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
  }

  req.app.get('io')?.emit('kitchen:new_order', order);
  req.app.get('io')?.emit('order:paid', order);

  res.json({ success: true, data: order });
});

export const generateQR = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const settings = await Settings.findOne() || { upiId: 'cafevibes@upi' };
  const qrCode = await generatePaymentQR(order.total, order.orderNumber, settings.upiId);
  res.json({ success: true, data: { qrCode, amount: order.total, orderNumber: order.orderNumber } });
});
