import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-end',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    for (const client of pipe.sockets) {
      client.emit('chat-error', status_codes.PIPE_ENDED);
    }

    pipeline.splice(pipeline.indexOf(pipe), 1);

    console.log(`${pipe.id} was deleted`);
  }
}