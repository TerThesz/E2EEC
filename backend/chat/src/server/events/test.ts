import { USERS } from "@config/types";
import { EventInterface } from "server/interfaces";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export = {
  name: 'test',

  handler(data: Buffer, cb: Function, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, users: USERS, username: string): void {    
    console.log(data);
    socket.emit('test', {
      message: 'test'
    });
  }
} as EventInterface;