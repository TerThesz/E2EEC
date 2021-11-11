import { USER, USERS } from "@config/types";
import { Socket } from "socket.io";

export default interface MiddlewareInterface {
  values?: string | string[],

  run(data: any, socket: Socket, users: USERS, user: USER, values: { [key: string]: any }): boolean
}