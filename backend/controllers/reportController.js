import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateExcelReport, generatePDFReport } from '../services/reportService.js';
import mongoose from 'mongoose';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

// Helper to construct reports filters
const buildReportFilter = (query) => {
  const { startDate, endDate, employee, session, product } = query;
  const match = { status: 'paid' };

  if (startDate || endDate) {
    match.paidAt = {};
    if (startDate) {
      const startStr = startDate.includes('T') ? startDate : `${startDate}T00:00:00`;
      match.paidAt.$gte = new Date(startStr);
    }
    if (endDate) {
      const endStr = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999`;
      match.paidAt.$lte = new Date(endStr);
    }
  }

  if (employee) {
    match.createdBy = new mongoose.Types.ObjectId(employee);
  }

  if (session) {
    match.posSession = new mongoose.Types.ObjectId(session);
  }

  if (product) {
    match['items.product'] = new mongoose.Types.ObjectId(product);
  }

  return match;
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const match = buildReportFilter(req.query);

  if (req.query.product) {
    const pipeline = [
      { $match: match },
      { $unwind: '$items' },
      { $match: { 'items.product': new mongoose.Types.ObjectId(req.query.product) } },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          revenue: 1,
          totalOrders: { $size: '$totalOrders' },
          _id: 0
        }
      }
    ];

    const result = await Order.aggregate(pipeline);
    const stats = result[0] || { revenue: 0, totalOrders: 0 };
    const avgOrderValue = stats.totalOrders > 0 ? stats.revenue / stats.totalOrders : 0;

    // Calculate today's stats for this product
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayPipeline = [
      { $match: { ...match, paidAt: { ...match.paidAt, $gte: today } } },
      { $unwind: '$items' },
      { $match: { 'items.product': new mongoose.Types.ObjectId(req.query.product) } },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          revenue: 1,
          totalOrders: { $size: '$totalOrders' },
          _id: 0
        }
      }
    ];
    const todayResult = await Order.aggregate(todayPipeline);
    const todayStats = todayResult[0] || { revenue: 0, totalOrders: 0 };

    res.json({
      success: true,
      data: {
        revenue: Math.round(stats.revenue * 100) / 100,
        totalOrders: stats.totalOrders,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        todayRevenue: Math.round(todayStats.revenue * 100) / 100,
        todayOrders: todayStats.totalOrders,
      }
    });
  } else {
    const orders = await Order.find(match);
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.paidAt >= today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      success: true,
      data: {
        revenue: Math.round(revenue * 100) / 100,
        totalOrders,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        todayRevenue: Math.round(todayRevenue * 100) / 100,
        todayOrders: todayOrders.length,
      },
    });
  }
});

export const getSalesTrend = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const match = buildReportFilter(req.query);

  if (!req.query.startDate && !req.query.endDate) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    match.paidAt = { $gte: startDate };
  }

  const pipeline = [
    { $match: match }
  ];

  if (req.query.product) {
    pipeline.push(
      { $unwind: '$items' },
      { $match: { 'items.product': new mongoose.Types.ObjectId(req.query.product) } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt', timezone } },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          date: '$_id',
          revenue: 1,
          orders: { $size: '$orders' },
          _id: 0
        }
      }
    );
  } else {
    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt', timezone } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $project: { date: '$_id', revenue: 1, orders: 1, _id: 0 } }
    );
  }

  pipeline.push({ $sort: { date: 1 } });

  const trend = await Order.aggregate(pipeline);
  res.json({ success: true, data: trend });
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const match = buildReportFilter(req.query);

  const pipeline = [
    { $match: match },
    { $unwind: '$items' }
  ];

  if (req.query.product) {
    pipeline.push({
      $match: { 'items.product': new mongoose.Types.ObjectId(req.query.product) }
    });
  }

  pipeline.push(
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    { $project: { productId: '$_id', name: 1, quantity: 1, revenue: 1, _id: 0 } }
  );

  const topProducts = await Order.aggregate(pipeline);
  res.json({ success: true, data: topProducts });
});

export const getTopCategories = asyncHandler(async (req, res) => {
  const match = buildReportFilter(req.query);

  const pipeline = [
    { $match: match },
    { $unwind: '$items' }
  ];

  if (req.query.product) {
    pipeline.push({
      $match: { 'items.product': new mongoose.Types.ObjectId(req.query.product) }
    });
  }

  pipeline.push(
    {
      $group: {
        _id: '$items.category',
        color: { $first: '$items.categoryColor' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        quantity: { $sum: '$items.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' },
    },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        categoryId: '$_id',
        name: '$category.name',
        color: { $ifNull: ['$color', '$category.color'] },
        revenue: 1,
        quantity: 1,
        _id: 0,
      },
    },
  );

  const topCategories = await Order.aggregate(pipeline);
  res.json({ success: true, data: topCategories });
});

export const getTopOrders = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const match = buildReportFilter(req.query);

  const topOrders = await Order.find(match)
    .sort({ total: -1 })
    .limit(limit)
    .select('orderNumber total paidAt customer payment')
    .populate('customer', 'name');

  res.json({ success: true, data: topOrders });
});

export const getReportEmployees = asyncHandler(async (req, res) => {
  const User = mongoose.model('User');
  const users = await User.find({ isActive: true }).select('name email role');
  res.json({ success: true, data: users });
});

export const getReportSessions = asyncHandler(async (req, res) => {
  const POSSession = mongoose.model('POSSession');
  const sessions = await POSSession.find()
    .populate('user', 'name')
    .sort({ openedAt: -1 });
  res.json({ success: true, data: sessions });
});

export const exportExcel = asyncHandler(async (req, res) => {
  const match = buildReportFilter(req.query);
  const orders = await Order.find(match).populate('customer', 'name').sort({ paidAt: -1 });
  const buffer = await generateExcelReport(orders);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=cafevibes-report.xlsx');
  res.send(buffer);
});

export const exportPDF = asyncHandler(async (req, res) => {
  const match = buildReportFilter(req.query);
  const orders = await Order.find(match).populate('customer', 'name').sort({ paidAt: -1 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=cafevibes-report.pdf');
  generatePDFReport(orders, res);
});
