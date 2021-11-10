import { USER, USERS } from "@config/types";
import { EventInterface } from "server/interfaces";
import { Socket } from "socket.io";

const test: EventInterface = {
  name: 'test',

  handler(data: Buffer, cb: Function, socket: Socket, users: USERS, user: USER): void {
    socket.emit('chat-message', 'hello world!');
  }
};

export default test;