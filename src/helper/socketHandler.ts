import { Server } from "socket.io";

const handleSocketConnection = (io: Server) => {
  let connectedClients: { [key: string]: string } = {}; // Mapping of user IDs to socket IDs

  io.on('connection', (socket) => {
    // Store user ID with their socket ID
    socket.on('on', ({ userid }) => {
      connectedClients[userid] = socket.id;
    });

    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('calling', (message) => {
      const { room, data } = message;
      socket.to(room).emit('calling', data);
    });

    socket.on('ignoredStatus', (room) => {
      socket.to(room).emit('ignoredStatus');
    });

    socket.on('call-request', (data) => {
      const { from, room, to } = data;
      io.to(connectedClients[to]).emit('call-request', { from, room, to });
    });

    socket.on('cut-call', (a) => {
      io.to(connectedClients[a.from]).emit('cut-call');
    });

    socket.on('chat-message', (data) => {
      const { message, sender, room } = data;
      socket.to(room).emit('chat-message', { message, fromId: sender });
    });

    socket.on('disconnect', () => {
      // Remove disconnected client
      for (const clientId in connectedClients) {
        if (connectedClients[clientId] === socket.id) {
          delete connectedClients[clientId];
          break;
        }
      }
    });
  });
};

export default handleSocketConnection;
