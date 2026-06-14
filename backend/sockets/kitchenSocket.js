export const initKitchenSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Kitchen client connected: ${socket.id}`);
    socket.join('kitchen');

    socket.on('kitchen:join', () => socket.join('kitchen'));

    socket.on('disconnect', () => {
      console.log(`Kitchen client disconnected: ${socket.id}`);
    });
  });
};
