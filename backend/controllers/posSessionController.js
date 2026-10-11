import POSSession from '../models/POSSession.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getActiveSession = asyncHandler(async (req, res) => {
  const session = await POSSession.findOne({ user: req.user._id, status: 'open' });
  if (!session) {
    return res.json({ success: true, data: null });
  }

  // Find all paid orders linked to this POS session to calculate stats dynamically
  const orders = await Order.find({ posSession: session._id, status: 'paid' });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersCount = orders.length;

  const salesBreakdown = { cash: 0, card: 0, upi: 0 };
  orders.forEach((o) => {
    const method = o.payment?.method?.toLowerCase();
    if (method && method in salesBreakdown) {
      salesBreakdown[method] = Math.round((salesBreakdown[method] + o.total) * 100) / 100;
    }
  });

  const sessionObj = session.toObject();
  sessionObj.totalSales = Math.round(totalSales * 100) / 100;
  sessionObj.ordersCount = ordersCount;
  sessionObj.salesBreakdown = salesBreakdown;

  res.json({ success: true, data: sessionObj });
});

export const getLastClosedSession = asyncHandler(async (req, res) => {
  const session = await POSSession.findOne({ status: 'closed' }).sort({ closedAt: -1 }).populate('user', 'name');
  res.json({ success: true, data: session });
});

export const openSession = asyncHandler(async (req, res) => {
  const existing = await POSSession.findOne({ user: req.user._id, status: 'open' });
  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const { openingBalance } = req.body;

  const session = await POSSession.create({
    user: req.user._id,
    openedAt: new Date(),
    status: 'open',
    openingBalance: Number(openingBalance) || 0,
  });

  res.status(201).json({ success: true, data: session });
});

export const closeSession = asyncHandler(async (req, res) => {
  const session = await POSSession.findOne({ _id: req.params.id, user: req.user._id, status: 'open' });
  if (!session) throw new ApiError(404, 'Active POS session not found');

  const { closingBalance } = req.body;

  // Find all paid orders linked to this POS session
  const orders = await Order.find({ posSession: session._id, status: 'paid' });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersCount = orders.length;

  const salesBreakdown = { cash: 0, card: 0, upi: 0 };
  orders.forEach((o) => {
    const method = o.payment?.method?.toLowerCase();
    if (method && method in salesBreakdown) {
      salesBreakdown[method] = Math.round((salesBreakdown[method] + o.total) * 100) / 100;
    }
  });

  session.closedAt = new Date();
  session.status = 'closed';
  session.totalSales = Math.round(totalSales * 100) / 100;
  session.ordersCount = ordersCount;
  session.salesBreakdown = salesBreakdown;
  if (closingBalance !== undefined) {
    session.closingBalance = Number(closingBalance) || 0;
  }

  await session.save();

  res.json({ success: true, data: session });
});

export const addCashTransaction = asyncHandler(async (req, res) => {
  const session = await POSSession.findOne({ user: req.user._id, status: 'open' });
  if (!session) throw new ApiError(404, 'Active POS session not found');

  const { type, amount, reason } = req.body;
  if (!type || !['in', 'out'].includes(type)) {
    throw new ApiError(400, 'Invalid transaction type. Must be "in" or "out"');
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    throw new ApiError(400, 'Valid amount greater than 0 is required');
  }
  if (!reason || reason.trim() === '') {
    throw new ApiError(400, 'Reason is required');
  }

  session.cashTransactions.push({
    type,
    amount: Number(amount),
    reason: reason.trim(),
    createdAt: new Date(),
  });

  await session.save();

  // Return the active session with dynamic stats
  const orders = await Order.find({ posSession: session._id, status: 'paid' });
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersCount = orders.length;
  const salesBreakdown = { cash: 0, card: 0, upi: 0 };
  orders.forEach((o) => {
    const method = o.payment?.method?.toLowerCase();
    if (method && method in salesBreakdown) {
      salesBreakdown[method] = Math.round((salesBreakdown[method] + o.total) * 100) / 100;
    }
  });

  const sessionObj = session.toObject();
  sessionObj.totalSales = Math.round(totalSales * 100) / 100;
  sessionObj.ordersCount = ordersCount;
  sessionObj.salesBreakdown = salesBreakdown;

  res.json({ success: true, data: sessionObj });
});
