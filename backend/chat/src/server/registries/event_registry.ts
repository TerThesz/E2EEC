import { sync } from 'glob';
import { resolve } from 'path';
import { USERS } from '@config/types';
import { Socket } from 'socket.io';
import user_registry from './user_registry';

const files = sync(resolve(`./src/server/events/**/*.ts`));

/**
 * @description Event registry
 */
 class Registry {
  /**
   * @description All event files
   * @type {string[]}
   * @protected
   */
  protected _events: Array<any> = new Array<any>();

  /**
   * @description Add event file
   * @param {any} event
   * @returns {void}
   */
  public add(event: any): void {
    this._events.push(event);
  }

  /**
   * @description Register all event files
   * @param {string[]} files
   * @returns {void}
   */
  public registerAll(files: string[]): void {
    files.forEach((file) => {
      this.add(file);
    });
  }
}

export default new class EventRegistry {
    /**
   * @description All event files
   * @type {string[]}
   */
  Registry = new Registry;

  /**
   * @description Initialize events
   * @param {Socket} socket
   * @param {string} username
   * @returns {void}
   */
  initializeEvents(socket: Socket, username: string): void {
    files.forEach((file: any) => {
      const event = require(file);
      this.Registry.add(event);

      socket.on(event.name, (data: Buffer, cb: Function) => {
        event.handler(data, cb, socket, user_registry.Registry.getAll(), username);
      });
    });
  }
}