import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-remove',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    const target_username = data.toString();
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    const target = clients[target_username];

    if (!target) {
      socket.emit('chat-error', status_codes.TARGET_NOT_FOUND);
      return;
    }

    if (!pipe.sockets.find(client => client === target)) {
      socket.emit('chat-error', status_codes.TARGET_NOT_IN_PIPE);
      return;
    }

    pipe.sockets.splice(pipe.sockets.indexOf(target), 1);

    for (const client of pipe.sockets) {
      client.emit('chat-removed', status_codes.TARGET_REMOVED(target_username));
    }

    console.log(`${target_username} was removed from ${pipe.id}`);

    target.emit('chat-error', status_codes.REMOVED_FROM_PIPE);
  }
}