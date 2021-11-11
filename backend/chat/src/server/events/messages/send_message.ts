import { USER, USERS } from "@config/types";
import { EventInterface } from "server/interfaces";
import { RequestTypeMiddleware } from "server/middleware";
import { Socket } from "socket.io";

const send_message: EventInterface = {
  name: 'send message',
  data_types: [ 'JSON', 'string' ],

  middleware: RequestTypeMiddleware,

  handler(data: any, cb: Function, socket: Socket, users: USERS, user: USER): void {
    console.log(data);
  }
};

export default send_message; 