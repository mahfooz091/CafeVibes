const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

exports.getSalesReport = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    const salesByPaymentMethod = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$total' } } }
    ]);

    res.status(200).json({
      revenue: totalSales[0]?.total || 0,
      ordersCount: totalSales[0]?.count || 0,
      paymentBreakdown: salesByPaymentMethod
    });
  } catch (error) {
    next(error);
  }
};
