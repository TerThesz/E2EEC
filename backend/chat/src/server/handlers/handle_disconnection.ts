import { CLIENTS, PIPELINE } from '@config/types';
import { Socket } from 'socket.io';
import status_codes from '@config/status_codes';

export default function handleDisconnection(socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
  const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

  if (pipe) {
    pipe.sockets.splice(pipe.sockets.indexOf(socket), 1);

    for (const client of pipe.sockets) {
      client.emit('chat-left', status_codes.LEFT_PIPE(username || "undefined"));
    }

    console.log(`${username} left ${pipe.id}`);
  }

  if (username)
    delete clients[username];

  console.log('Session ended: ' + username);
}