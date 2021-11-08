import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-message',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    pipe.sockets.splice(pipe.sockets.indexOf(socket), 1);

    for (const client of pipe.sockets) {
      client.emit('chat-leave', status_codes.LEFT_PIPE(username));
    }

    console.log(`${username} left ${pipe.id}`);
  
    cb();
  }
}