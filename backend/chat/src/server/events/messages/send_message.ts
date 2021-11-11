import { REQUEST, USER, USERS } from "@config/types";
import { EventInterface } from "server/interfaces";
import { RequestTypeMiddleware } from "server/middleware";
import { UserRegistry } from "server/registries";
import { Socket } from "socket.io";
import server from '@server';

const send_message: EventInterface = {
  name: 'send message',
  data_types: 'string',

  middleware: RequestTypeMiddleware,

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void {
    const { headers, data } = request;

    const target_socket_id = UserRegistry.get_by_name(headers.name)?.socket_id;
    if (!target_socket_id) return;

    server.sockets.sockets.get(target_socket_id)?.emit('chat message', data);
  }
};

export default send_message; 