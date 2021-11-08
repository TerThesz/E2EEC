import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-message',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    const pipe = pipeline.find(pipe => pipe.id === data.toString());

    if (!pipe) {
      socket.emit('chat-error', status_codes.PIPE_NOT_FOUND);
      return;
    }

    if (pipe.sockets.includes(socket)) {
      socket.emit('chat-error', status_codes.ALREADY_IN_PIPE);
      return;
    }

    for (const client of pipe.sockets) {
      client.emit('chat-join', status_codes.JOINED_PIPE(username.toString()));
    }

    pipe.sockets.push(socket);

    console.log(`${username} joined ${pipe.id}`);

    cb();
  }
}