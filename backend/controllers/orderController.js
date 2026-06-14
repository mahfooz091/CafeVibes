import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Customer from '../models/Customer.js';
import Coupon from '../models/Coupon.js';
import Promotion from '../models/Promotion.js';
import POSSession from '../models/POSSession.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { calculateOrderTotals, getActivePromotions } from '../utils/orderHelpers.js';

const populateOrder = (query) =>
  query
    .populate('customer', 'name email phone')
    .populate('table', 'name seatCount')
    .populate('createdBy', 'name')
    .populate('coupon', 'code')
    .populate('promotion', 'name');

const buildOrderItems = async (items) => {
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product).populate('category', 'name color');
    if (!product || !product.isActive) throw new ApiError(404, `Product not found: ${item.product}`);

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      tax: product.tax,
      unit: product.unit,
      category: product.category?._id,
      categoryColor: product.category?.color,
      notes: item.notes,
    });
  }
  return orderItems;
};

const applyDiscounts = async (orderItems, subtotal, couponCode) => {
  let discount = 0;
  let discountType = 'fixed';
  let coupon = null;
  let promotion = null;
  let discountSource = null;

  if (couponCode) {
    const couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!couponDoc) throw new ApiError(400, 'Invalid coupon');
    discountType = couponDoc.type;
    discount = couponDoc.type === 'percentage' ? couponDoc.value : couponDoc.value;
    if (couponDoc.type === 'fixed') discountType = 'fixed';
    coupon = couponDoc._id;
    discountSource = couponDoc.code;
  } else {
    const promoResult = await getActivePromotions(Promotion, orderItems, subtotal);
    if (promoResult.promotion) {
      discount = promoResult.discount;
      discountType = promoResult.promotion.type;
      promotion = promoResult.promotion._id;
      discountSource = promoResult.promotion.name;
    }
  }

  return { discount, discountType, coupon, promotion, discountSource };
};

export const getOrders = asyncHandler(async (req, res) => {
  const { status, search, startDate, endDate } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (search) filter.orderNumber = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      const startStr = startDate.includes('T') ? startDate : `${startDate}T00:00:00`;
      filter.createdAt.$gte = new Date(startStr);
    }
    if (endDate) {
      const endStr = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999`;
      filter.createdAt.$lte = new Date(endStr);
    }
  }

  const orders = await populateOrder(Order.find(filter).sort({ createdAt: -1 }));
  res.json({ success: true, count: orders.length, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await populateOrder(Order.findById(req.params.id));
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, customer, table, notes, couponCode } = req.body;
  if (!items?.length) throw new ApiError(400, 'Order must have at least one item');

  const activeSession = await POSSession.findOne({ user: req.user._id, status: 'open' });
  if (!activeSession) throw new ApiError(400, 'No open POS session found. Please open a session first.');

  const orderItems = await buildOrderItems(items);
  const { subtotal } = calculateOrderTotals(orderItems);
  const discountInfo = await applyDiscounts(orderItems, subtotal, couponCode);
  const totals = calculateOrderTotals(orderItems, discountInfo.discount, discountInfo.discountType);

  const order = await Order.create({
    items: orderItems,
    customer,
    table,
    notes,
    ...totals,
    ...discountInfo,
    posSession: activeSession._id,
    createdBy: req.user._id,
  });

  if (table) {
    await Table.findByIdAndUpdate(table, { status: 'occupied', currentOrder: order._id });
  }

  const populated = await populateOrder(Order.findById(order._id));
  req.app.get('io')?.emit('kitchen:new_order', populated);
  res.status(201).json({ success: true, data: populated });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'draft') throw new ApiError(400, 'Only draft orders can be edited');

  const { items, customer, table, notes, couponCode } = req.body;

  if (items) {
    order.items = await buildOrderItems(items);
  }
  if (customer !== undefined) order.customer = customer;
  if (table !== undefined) order.table = table;
  if (notes !== undefined) order.notes = notes;

  const { subtotal } = calculateOrderTotals(order.items);
  const discountInfo = await applyDiscounts(order.items, subtotal, couponCode);
  const totals = calculateOrderTotals(order.items, discountInfo.discount, discountInfo.discountType);

  Object.assign(order, totals, discountInfo);
  await order.save();

  const populated = await populateOrder(Order.findById(order._id));
  res.json({ success: true, data: populated });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status === 'paid') throw new ApiError(400, 'Cannot cancel paid order');

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason;
  await order.save();

  if (order.table) {
    await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
  }

  res.json({ success: true, data: order });
});

export const updateKitchenItemStatus = asyncHandler(async (req, res) => {
  const { itemId, kitchenStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const item = order.items.id(itemId);
  if (!item) throw new ApiError(404, 'Order item not found');

  item.kitchenStatus = kitchenStatus;

  const allCompleted = order.items.every((i) => i.kitchenStatus === 'completed');
  const anyPreparing = order.items.some((i) => i.kitchenStatus === 'preparing');
  order.kitchenStatus = allCompleted ? 'completed' : anyPreparing ? 'in_progress' : 'pending';

  await order.save();
  const populated = await populateOrder(Order.findById(order._id));
  req.app.get('io')?.emit('kitchen:update', populated);

  res.json({ success: true, data: populated });
});

export const getKitchenOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = { status: { $in: ['draft', 'paid'] }, kitchenStatus: { $ne: 'completed' } };

  if (status) filter.kitchenStatus = status;
  if (search) filter.orderNumber = { $regex: search, $options: 'i' };

  const orders = await populateOrder(Order.find(filter).sort({ createdAt: 1 }));
  res.json({ success: true, count: orders.length, data: orders });
});

export const updateCustomerStats = async (customerId, total) => {
  if (!customerId) return;
  await Customer.findByIdAndUpdate(customerId, {
    $inc: { totalOrders: 1, totalSpent: total },
  });
};
