import { sync } from 'glob';
import { resolve } from 'path';
import { USER, USERS } from '@config/types';
import { Socket } from 'socket.io';
import { UserRegistry } from './';
import { MiddlewareInterface } from 'server/interfaces';

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
        let result: boolean = false;

        if (middleware) {
          let { values } = middleware;
          let matched_values: { [key: string]: any } = {};

          if (values) {
            if (!Array.isArray(values)) 
              values = [ values ];

            values.forEach((value: any) => {
              matched_values[value] = event[value];
            });
          }

          const call_middleware = (mdw: any) => result = mdw.run(data, socket, UserRegistry.users, user, matched_values);

          if (Array.isArray(middleware))
            middleware.forEach(call_middleware);
          else if (typeof middleware === 'object') call_middleware(middleware);
        }

        if (!result) {
          if (cb) cb(false);
          return;
        }

        event.handler(data, cb, socket, UserRegistry.users, user);
      });
    });
  }
}