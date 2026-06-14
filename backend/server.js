import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import app from './app.js';
import connectDB from './config/db.js';
import seedDatabase from './utils/seedData.js';
import { initKitchenSocket } from './sockets/kitchenSocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

// Start the Express HTTP and WebSocket server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  app.set('io', io);
  initKitchenSocket(io);

  server.listen(PORT, () => {
    console.log(`CafeVibes server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
