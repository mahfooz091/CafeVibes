import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Floor from '../models/Floor.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import POSSession from '../models/POSSession.js';

const defaultCategories = [
  { name: 'Coffee', color: '#6F4E37' },
  { name: 'Beverages', color: '#0F766E' },
  { name: 'Pastries', color: '#D4A373' },
  { name: 'Sandwiches', color: '#14B8A6' },
  { name: 'Desserts', color: '#B45309' },
];

const defaultProducts = [
  { name: 'Espresso', categoryName: 'Coffee', price: 120, tax: 5, unit: 'cup', description: 'Rich single shot espresso' },
  { name: 'Cappuccino', categoryName: 'Coffee', price: 180, tax: 5, unit: 'cup', description: 'Espresso with steamed milk foam' },
  { name: 'Latte', categoryName: 'Coffee', price: 200, tax: 5, unit: 'cup', description: 'Smooth espresso with steamed milk' },
  { name: 'Iced Tea', categoryName: 'Beverages', price: 150, tax: 5, unit: 'glass', description: 'Refreshing chilled tea' },
  { name: 'Fresh Juice', categoryName: 'Beverages', price: 180, tax: 5, unit: 'glass', description: 'Seasonal fresh fruit juice' },
  { name: 'Croissant', categoryName: 'Pastries', price: 90, tax: 5, unit: 'piece', description: 'Buttery flaky croissant' },
  { name: 'Blueberry Muffin', categoryName: 'Pastries', price: 110, tax: 5, unit: 'piece', description: 'Fresh baked muffin' },
  { name: 'Club Sandwich', categoryName: 'Sandwiches', price: 250, tax: 5, unit: 'plate', description: 'Triple layer club sandwich' },
  { name: 'Grilled Cheese', categoryName: 'Sandwiches', price: 180, tax: 5, unit: 'plate', description: 'Classic grilled cheese' },
  { name: 'Chocolate Brownie', categoryName: 'Desserts', price: 130, tax: 5, unit: 'piece', description: 'Rich chocolate brownie' },
];

const seedDatabase = async () => {
  // 1. Seed Categories & Products
  const categoryCount = await Category.countDocuments();
  const createdCategories = {};
  
  if (categoryCount === 0) {
    console.log('Seeding default categories...');
    for (const cat of defaultCategories) {
      const category = await Category.create(cat);
      createdCategories[cat.name] = category._id;
    }

    console.log('Seeding default products...');
    for (const product of defaultProducts) {
      const categoryId = createdCategories[product.categoryName];
      if (!categoryId) continue;
      await Product.create({
        name: product.name,
        category: categoryId,
        price: product.price,
        tax: product.tax,
        unit: product.unit,
        description: product.description,
      });
    }
  } else {
    // Populate map if already seeded
    const categories = await Category.find();
    categories.forEach(cat => {
      createdCategories[cat.name] = cat._id;
    });
  }

  // 2. Seed Floors & Tables
  const floorCount = await Floor.countDocuments();
  let defaultFloorId;
  if (floorCount === 0) {
    console.log('Seeding Ground Floor...');
    const floor = await Floor.create({ name: 'Ground Floor', description: 'Main dining area' });
    defaultFloorId = floor._id;
    const tableNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    for (const name of tableNames) {
      await Table.create({ name, floor: floor._id, seatCount: 4 });
    }
  }

  // 3. Seed Default Admin User
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.log('Seeding default admin user...');
    adminUser = await User.create({
      name: 'Default Admin',
      email: 'admin@cafevibes.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });
  }

  // 4. Seed Historical Sessions & Orders for Reports
  const sessionCount = await POSSession.countDocuments();
  const orderCount = await Order.countDocuments();
  if (sessionCount < 10 || orderCount < 20) {
    console.log('Seeding mock historical sessions & orders for reports...');
    // Clean up existing POS sessions and all orders to ensure we reconstruct them correctly
    await POSSession.deleteMany({});
    await Order.deleteMany({});

    // Reset customer order stats to zero
    await Customer.updateMany({}, { totalOrders: 0, totalSpent: 0 });
    
    // Seed default customers first
    let customers = await Customer.find();
    if (customers.length === 0) {
      customers = [
        await Customer.create({ name: 'Mahfooz Alam', email: 'mahfooz@example.com', phone: '9876543210' }),
        await Customer.create({ name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211' }),
        await Customer.create({ name: 'John Doe', email: 'john@example.com', phone: '9876543212' }),
      ];
    }

    const products = await Product.find();
    const tablesList = await Table.find();
    const paymentMethods = ['cash', 'card', 'upi'];
    const now = new Date();
    const totalOrdersToSeed = 60;

    // Create 15 closed sessions (one for today, and one for each of the last 14 days)
    const sessionsByDay = {};
    for (let day = 0; day <= 14; day++) {
      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() - day);
      if (day === 0) {
        sessionDate.setHours(0, 0, 0, 0); // Opened at midnight
      } else {
        sessionDate.setHours(9, 0, 0, 0); // Opened at 9:00 AM
      }

      const closeDate = new Date(sessionDate);
      if (day === 0) {
        closeDate.setTime(now.getTime()); // Closed at now
      } else {
        closeDate.setHours(18, 0, 0, 0); // Closed at 6:00 PM
      }

      const session = await POSSession.create({
        user: adminUser._id,
        openedAt: sessionDate,
        closedAt: closeDate,
        status: 'closed',
        totalSales: 0,
        ordersCount: 0,
        salesBreakdown: { cash: 0, card: 0, upi: 0 }
      });
      sessionsByDay[day] = session;
    }

    for (let i = 0; i < totalOrdersToSeed; i++) {
      // Spread orders over last 15 days (daysAgo from 0 to 14)
      const daysAgo = Math.floor(Math.random() * 15);
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - daysAgo);

      if (daysAgo === 0) {
        const currentHour = now.getHours();
        const hour = currentHour > 0 ? Math.floor(Math.random() * currentHour) : 0;
        const minute = Math.floor(Math.random() * 60);
        orderDate.setHours(hour, minute, 0, 0);
      } else {
        const hoursAgo = Math.floor(Math.random() * 8) + 9; // between 9 AM and 5 PM
        const minutesAgo = Math.floor(Math.random() * 60);
        orderDate.setHours(hoursAgo, minutesAgo, 0, 0);
      }

      // Random items
      const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const orderItems = [];
      let subtotal = 0;
      let taxAmount = 0;

      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

      for (let j = 0; j < Math.min(numItems, shuffledProducts.length); j++) {
        const product = shuffledProducts[j];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2
        const price = product.price;
        const taxPercent = product.tax || 0;

        const itemSubtotal = price * quantity;
        const itemTax = (itemSubtotal * taxPercent) / 100;

        subtotal += itemSubtotal;
        taxAmount += itemTax;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: price,
          quantity: quantity,
          tax: taxPercent,
          unit: product.unit || 'piece',
          category: product.category,
          kitchenStatus: 'completed'
        });
      }

      const total = subtotal + taxAmount;
      const customer = Math.random() > 0.3 ? customers[Math.floor(Math.random() * customers.length)] : null;
      const table = tablesList.length > 0 ? tablesList[Math.floor(Math.random() * tablesList.length)] : null;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const session = sessionsByDay[daysAgo];

      const orderData = {
        items: orderItems,
        customer: customer?._id,
        table: table?._id,
        status: 'paid',
        kitchenStatus: 'completed',
        subtotal,
        taxAmount,
        discount: 0,
        total,
        payment: {
          method: paymentMethod,
          amount: total,
          paidAt: orderDate
        },
        posSession: session._id,
        createdBy: adminUser._id,
        paidAt: orderDate,
        createdAt: orderDate,
        updatedAt: orderDate
      };

      await Order.create(orderData);

      // Update customer stats
      if (customer) {
        await Customer.findByIdAndUpdate(customer._id, {
          $inc: { totalOrders: 1, totalSpent: total }
        });
      }
    }

    // Update POS sessions totals in DB
    for (let day = 0; day <= 14; day++) {
      const session = sessionsByDay[day];
      const orders = await Order.find({ posSession: session._id });
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const salesBreakdown = { cash: 0, card: 0, upi: 0 };
      
      orders.forEach((o) => {
        const method = o.payment?.method?.toLowerCase();
        if (method && method in salesBreakdown) {
          salesBreakdown[method] = Math.round((salesBreakdown[method] + o.total) * 100) / 100;
        }
      });

      session.totalSales = Math.round(totalSales * 100) / 100;
      session.ordersCount = orders.length;
      session.salesBreakdown = salesBreakdown;
      await session.save();
    }
    console.log('Seeded historical sessions & orders successfully!');
  }

  console.log('Seed check complete.');
};

export default seedDatabase;
