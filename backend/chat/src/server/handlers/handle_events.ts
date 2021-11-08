import { sync } from 'glob';
import { resolve } from 'path';
import { CLIENTS, PIPELINE } from '@config/types';
import { Socket } from 'socket.io';

const files = sync(resolve('./src/server/events/**/*.ts'));

export default function handleEvents(socket: Socket, clients: CLIENTS, pipeline: PIPELINE, username: string) {
  files.forEach((file) => {
    const event = require(file);
    socket.on(event.name, (data: Buffer, cb: Function) => {
      event.handler(data, cb, socket, clients, pipeline, username);
    });
  });
}