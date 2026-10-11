import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:5001' : '');

let socket = null;

// Fallback dummy socket when WebSockets are not configured in production
const noopSocket = {
  connected: false,
  connect: () => {},
  disconnect: () => {},
  emit: () => {},
  on: () => {},
  off: () => {},
};

export const getSocket = () => {
  if (!socket) {
    if (!SOCKET_URL) {
      return noopSocket;
    }
    try {
      socket = io(SOCKET_URL, {
        autoConnect: false,
        reconnectionAttempts: 3,
        timeout: 8000,
        transports: ['websocket', 'polling'],
      });
    } catch {
      return noopSocket;
    }
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (s && !s.connected && typeof s.connect === 'function') {
    try {
      s.connect();
      if (typeof s.emit === 'function') {
        s.emit('kitchen:join');
      }
    } catch (err) {
      console.warn('Socket connect error:', err);
    }
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected && typeof socket.disconnect === 'function') {
    socket.disconnect();
  }
};

