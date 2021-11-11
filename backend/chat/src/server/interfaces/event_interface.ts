import { REQUEST, USER, USERS } from "@config/types";
import { Socket } from "socket.io";

export default interface EventInterface {
  name: string;
  data_types: string | Array<string>;

  middleware?: Object | Array<Object>;

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void;
}