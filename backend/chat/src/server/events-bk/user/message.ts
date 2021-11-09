import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-message',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    const message = data.toString();
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    pipe.sockets.forEach((client) => {
      if (client.id !== socket.id) {
        client.emit('chat-message', message);
      }
    });

    console.log(`[${pipe.id}] ${username}: ${message}`);
  }
}