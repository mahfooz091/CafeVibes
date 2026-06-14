import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const settings = await Settings.findOne();
  console.log('Settings in DB:', settings);

  await mongoose.disconnect();
};

run().catch(console.error);
