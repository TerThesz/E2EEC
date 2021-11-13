import { REQUEST, USER, USERS, USER_REGISTRY } from "@config/types";
import { Socket } from "socket.io";

export default interface EventInterface {
  name: string;
  data_types?: string | Array<string>;

  middleware?: Object | Array<Object>;

  handler(request: REQUEST, cb: Function, socket: Socket, sender: USER_REGISTRY, user: USER): void;
}