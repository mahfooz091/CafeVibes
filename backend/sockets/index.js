/**
 * Initializes Socket.io event handlers.
 * Kitchen Display System (Phase 8) and live order updates will hook in here.
 */
const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`[CafeVibes] Socket connected: ${socket.id}`);

    // KDS clients join a shared room to receive order broadcasts
    socket.on('join:kds', () => {
      socket.join('kds-room');
    });

    // POS terminals join a shared room for table/order status sync
    socket.on('join:pos', () => {
      socket.join('pos-room');
    });

    socket.on('disconnect', () => {
      console.log(`[CafeVibes] Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSockets;
