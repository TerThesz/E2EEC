import { Socket } from "socket.io";

export default function eventError(message: (number | string)[], socket: Socket, cb: Function) {
  socket.emit('chat error', message);
  cb(false);
}