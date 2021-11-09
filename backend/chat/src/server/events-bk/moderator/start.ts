import { Socket } from 'socket.io';
import { CLIENTS, PIPELINE } from '@config/types';
import status_codes from '@config/status_codes';

export = {
  name: 'chat-start',

  handler(data: Buffer, cb: Function, socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
    if (pipeline.find(pipe => pipe.sockets.includes(socket))) {
      socket.emit('chat-error', status_codes.ALREADY_IN_PIPE);
      return
    }

    let pipelineId: string = Math.random().toString(36).substring(2, 15);
    while (pipeline.find(pipe => pipe.id === pipelineId)) {
      pipelineId = Math.random().toString(36).substring(2, 15);
    }

    pipeline.push({
      id: pipelineId,
      sockets: [socket],
      owner: username,
      admins: []
    });

    console.log('New pipe: ' + pipelineId);

    cb(pipelineId);
  }
}