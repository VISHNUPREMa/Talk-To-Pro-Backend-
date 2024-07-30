import { Server } from "socket.io";

const handleSocketConnection = (io: Server) => {
  let connectedClients: { [key: string]: any } = {};
  io.on('connection', (socket) => {
    console.log("socet id: ",socket.id);
    socket.on('on',(a)=>{
  console.log("data of user id ",a.userid);
  connectedClients[a.userid] = socket.id
    })
    
    
    console.log('A user connected');
  
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
  
    socket.on('call-request', (data) => {
      const { from, room ,to } = data;

    
    
      console.log("emit a call requsest !!! ");
      
      io.to(connectedClients[data.to]).emit('call-request', { from, room,to });
    });

    socket.on('cut-call',(a)=>{
      console.log("cal cut" , a.from);
      io.to(connectedClients[a.from]).emit('cut-call')
      
    })
          
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

export default handleSocketConnection;
