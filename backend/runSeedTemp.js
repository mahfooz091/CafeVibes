import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Table from './models/Table.js';
import Floor from './models/Floor.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const floors = await Floor.find();
  console.log('All floors:');
  floors.forEach(f => console.log(` - Floor ID: ${f._id}, Name: ${f.name}`));

  const tables = await Table.find().populate('floor', 'name');
  console.log('\nAll tables:');
  tables.forEach(t => {
    console.log(` - Table ID: ${t._id}, Name: "${t.name}", Floor: ${t.floor ? t.floor.name : 'None'}, Capacity: ${t.seatCount}, Status: ${t.status}`);
  });

  await mongoose.disconnect();
};

run().catch(console.error);
