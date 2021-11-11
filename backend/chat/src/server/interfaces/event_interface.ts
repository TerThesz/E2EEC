import { USER, USERS } from "@config/types";
import { Socket } from "socket.io";

interface _EventInterface {
  name: string;
  data_types: string;

  middleware?: Function | Array<Function>;

  handler(data: any, cb: Function, socket: Socket, users: USERS, user: USER): void;
}