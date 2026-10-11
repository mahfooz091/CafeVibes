export const initKitchenSocket = (io) => {
  io.on('connection', (socket) => {
    socket.join('kitchen');

    socket.on('kitchen:join', () => socket.join('kitchen'));

    // Guard socket write/mutation events against demo tampering
    socket.on('order:update_status', (data, callback) => {
      const isDemo = socket.handshake?.auth?.isDemo || socket.handshake?.query?.isDemo;
      if (isDemo) {
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Read-only demo: changes are disabled in this environment.',
            isDemoMode: true,
          });
        }
        return;
      }
      // Broadcast valid order status updates to kitchen listeners
      io.to('kitchen').emit('order:status_updated', data);
      if (typeof callback === 'function') callback({ success: true });
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });
};
