require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

initSockets(io);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`[CafeVibes] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[CafeVibes] Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
