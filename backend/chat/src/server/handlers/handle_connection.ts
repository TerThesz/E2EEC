import { CLIENTS, PIPELINE } from '@config/types';
import { Socket } from 'socket.io';
import status_codes from '@config/status_codes';

export default function handleConnection(socket: Socket, clients: CLIENTS, pipeline: PIPELINE) {
  const username: string | undefined = socket.handshake.query.username?.toString();

  if (!username) {
    socket.emit('error', {
      code: status_codes.NO_USERNAME[0],
      message: status_codes.NO_USERNAME[1],
    });
    socket.disconnect();
    return;
  }

  if (clients[username]) {
    socket.emit('error', {
      code: status_codes.USERNAME_IN_USE[0],
      message: status_codes.USERNAME_IN_USE[1],
    });
    socket.disconnect();
    return;
  }

  if (Object.values(clients).includes(socket)) {
    socket.emit('error', {
      code: status_codes.SESSION_ALREADY_INITIALIZED[0],
      message: status_codes.SESSION_ALREADY_INITIALIZED[1],
    });
    socket.disconnect();
    return;
  }

  clients[username] = socket;
  
  console.log('New session: ' + username);

  socket.emit('chat-error', status_codes.SESSION_INITIALIZED);

  return username;
}