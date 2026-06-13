const Order = require('../models/Order');
const Table = require('../models/Table');

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const order = new Order({
      ...orderData,
      staff: req.user?.id // Set by authMiddleware
    });
    await order.save();

    // If it is dine-in, link to table and set table occupied
    if (order.type === 'dine-in' && order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: 'occupied',
        activeOrder: order._id
      });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.completeOrderPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'completed', paymentMethod },
      { new: true }
    );

    if (order.type === 'dine-in' && order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: 'available',
        activeOrder: null
      });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
