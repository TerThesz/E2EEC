import { REQUEST, USER, USERS } from "@config/types";
import { Socket } from "socket.io";

export default interface MiddlewareInterface {
  values?: string | string[],

  run(request: REQUEST, socket: Socket, users: USERS, user: USER, values: { [key: string]: any }): boolean
}