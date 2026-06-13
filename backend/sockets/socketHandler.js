// Real-time communication handler for order and table layout updates
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A terminal/device connected:', socket.id);

    // Join floor tracking room
    socket.on('join_floor', (floorId) => {
      socket.join(`floor_${floorId}`);
      console.log(`Socket ${socket.id} joined floor: ${floorId}`);
    });

    // Notify of table status changes (e.g. waiter marks occupied, cashier marks ready/billed)
    socket.on('table_status_change', (data) => {
      socket.broadcast.emit('table_status_updated', data);
    });

    // Notify of new kitchen orders
    socket.on('new_order', (order) => {
      socket.to('kitchen').emit('order_received', order);
    });

    socket.on('disconnect', () => {
      console.log('Terminal/device disconnected:', socket.id);
    });
  });
};
