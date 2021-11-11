import { sync } from 'glob';
import { resolve } from 'path';
import { USER, USERS } from '@config/types';
import { Socket } from 'socket.io';
import { UserRegistry } from './';

const files = sync(resolve(`./src/server/events/**/*.ts`));

export default new class EventRegistry {
  readonly events: Array<any> = new Array<any>();

  public add(event: any): void {
    this.events.push(event);
  }

  public registerAll(files: string[]): void {
    files.forEach((file) => {
      this.add(file);
    });
  }

  initializeEvents(socket: Socket, user: USER): void {
    files.forEach((file: any) => {
      const event = require(file).default;
      this.add(event);

      socket.on(event.name, (data: Buffer, cb: Function) => {
        const { middleware } = event;
        if (middleware) {
          if (Array.isArray(middleware))
            middleware.forEach((middleware) => 
              middleware(data, cb, socket, UserRegistry.users, user));
          else if (typeof middleware === 'function')
            middleware(data, cb, socket, UserRegistry.users, user);
        }

        event.handler(data, cb, socket, UserRegistry.users, user);
      });
    });
  }
}