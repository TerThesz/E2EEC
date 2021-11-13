import { Socket } from "socket.io";

export default function eventError(socket: Socket, message: (number | string)[], cb: Function) {  
  socket.emit('chat error', message);
  if (cb) cb(false); 
}