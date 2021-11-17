import { Socket } from "socket.io";

export default function eventError(socket: Socket, message: (number | string)[], cb: Function | null = () => {}, error_event: string = 'chat error') {  
  socket.emit(error_event, message);
  if (cb) cb(false); 
}