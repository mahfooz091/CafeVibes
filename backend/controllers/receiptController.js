import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateReceiptPDF, generateReceiptHTML, sendReceiptEmail } from '../services/receiptService.js';

export const getReceiptHTML = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('createdBy', 'name');

  if (!order) throw new ApiError(404, 'Order not found');
  const html = generateReceiptHTML(order);
  res.json({ success: true, data: { html } });
});

export const downloadReceiptPDF = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('createdBy', 'name');

  if (!order) throw new ApiError(404, 'Order not found');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=receipt-${order.orderNumber}.pdf`);
  generateReceiptPDF(order, res);
});

export const emailReceipt = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('createdBy', 'name');

  if (!order) throw new ApiError(404, 'Order not found');

  const recipientEmail = email || order.customer?.email;
  if (!recipientEmail) throw new ApiError(400, 'Email address required');

  await sendReceiptEmail(recipientEmail, order);
  res.json({ success: true, message: `Receipt sent to ${recipientEmail}` });
});
