import { Server } from "socket.io";

const handleSocketConnection = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('join', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
  
    socket.on('calling', (message) => {
      const { room, data } = message;
      socket.to(room).emit('calling', data);
    });
  
    socket.on('ignoredStatus', (room) => {
      socket.to(room).emit('ignoredStatus');
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});
}
export default handleSocketConnection;
