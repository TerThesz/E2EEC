import { sync } from 'glob';
import { resolve } from 'path';
import { REQUEST, USER, USERS } from '@config/types';
import { Socket } from 'socket.io';
import { UserRegistry } from './';
import { ParseRequestMiddleware } from 'server/middleware';

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

      socket.on(event.name, (buffer: Buffer, cb: Function) => {
        let { middleware } = event;
        let result: boolean = false;

        const parsedRequest: REQUEST | null = ParseRequestMiddleware(buffer, socket);
        if (!parsedRequest) return;

        if (middleware) {
          function runMiddleware(mdw: any) {
            let { values } = mdw;
            let matched_values: { [key: string]: any } = {};

            if (values) {
              if (!Array.isArray(values)) 
                values = [ values ];

              values.forEach((value: any) => {
                matched_values[value] = event[value];
              });
            }

            if (typeof middleware === 'object') result = mdw.run(parsedRequest, socket, UserRegistry.users, user, matched_values);
          }

          if (!Array.isArray(middleware))
            middleware = [ middleware ];

          middleware.forEach(runMiddleware);
        }

        if (!result) {
          if (cb) cb(false);
          return;
        }

        event.handler(parsedRequest, cb, socket, UserRegistry.users, user);
      });
    });
  }
}