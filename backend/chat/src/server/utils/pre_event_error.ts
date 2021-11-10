import { Socket } from "socket.io";

export default function PreEventError(socket: Socket, status_code: (number | string)[]) {
  socket.emit('error', {
    code: status_code[0],
    message: status_code[1],
  });
  socket.disconnect();
}