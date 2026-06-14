import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

const checkUsersAndOrders = async () => {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const users = await User.find();
  console.log('All users:');
  users.forEach(u => console.log(` - User ID: ${u._id}, Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`));

  const ordersCount = await Order.countDocuments();
  console.log('\nTotal orders count:', ordersCount);

  // Group orders by createdBy
  const groupResult = await Order.aggregate([
    {
      $group: {
        _id: '$createdBy',
        count: { $sum: 1 },
        statusCount: { $push: '$status' }
      }
    }
  ]);
  console.log('\nOrders grouped by createdBy:');
  for (const group of groupResult) {
    const user = users.find(u => u._id.toString() === (group._id ? group._id.toString() : ''));
    console.log(` - CreatedBy: ${group._id} (${user ? user.name : 'Unknown'}), Count: ${group.count}`);
  }

  await mongoose.disconnect();
};

checkUsersAndOrders().catch(console.error);
