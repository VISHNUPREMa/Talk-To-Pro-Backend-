import { Server } from "socket.io";

const handleSocketConnection = (io: Server) => {
  let connectedClients: { [key: string]: string } = {}; // Mapping of user IDs to socket IDs

  io.on('connection', (socket) => {
   
    socket.on('on', ({ userid }) => {
      console.log("connection is on : ");
      
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
      console.log("reached here : ");
      
      const { from, room, to } = data;
      console.log("data from call request : ",[from, room, to]);
      
      io.to(connectedClients[to]).emit('call-request', { from, room, to });
    });

    socket.on('cut-call', (a) => {
      io.to(connectedClients[a.from]).emit('cut-call');
    });

    socket.on('chat-message', (data) => {
      const { message, sender, room } = data;
      socket.to(room).emit('chat-message', { message, fromId: sender });
    });

    socket.on('review',(data)=>{
      const {room,customerId} = data
      console.log("review message from ");
      io.to(connectedClients[customerId]).emit('review')
      
    })

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
