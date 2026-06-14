import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

const checkDb = async () => {
  console.log('Connecting to:', process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const ordersCount = await Order.countDocuments();
  console.log('Total orders count:', ordersCount);

  const paidOrdersCount = await Order.countDocuments({ status: 'paid' });
  console.log('Paid orders count:', paidOrdersCount);

  const draftOrdersCount = await Order.countDocuments({ status: 'draft' });
  console.log('Draft orders count:', draftOrdersCount);

  const sampleOrder = await Order.findOne().populate('customer', 'name');
  if (sampleOrder) {
    console.log('Sample Order:', {
      orderNumber: sampleOrder.orderNumber,
      status: sampleOrder.status,
      total: sampleOrder.total,
      paidAt: sampleOrder.paidAt,
      createdAt: sampleOrder.createdAt,
    });
  }

  await mongoose.disconnect();
};

checkDb().catch(console.error);
