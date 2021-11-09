import { USERS } from "@config/types";
import { Socket } from "socket.io";

export default interface EventInterface {
  name: string;

  handler(data: Buffer, cb: Function, socket: Socket, users: USERS, username: string): void;
}