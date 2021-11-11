import { REQUEST, USER, USERS } from "@config/types";
import { EventInterface } from "server/interfaces";
import { RequestTypeMiddleware } from "server/middleware";
import { UserRegistry } from "server/registries";
import { Socket } from "socket.io";
import server from '@server';
import status_codes from "@config/status_codes";
import { callbackTimeout, eventError } from "server/utils";

const send_message: EventInterface = {
  name: 'send message',
  data_types: 'string',

  middleware: RequestTypeMiddleware,

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void {
    const { headers, data } = request;

    const { sent_at, sent_to } = headers;

    if (!sent_to || !sent_at) return eventError(socket, status_codes.BAD_DATA_FORMAT, cb);

    const target = UserRegistry.get_by_name(sent_to.toLowerCase());
    const sender = UserRegistry.get_by_socket_id(socket.id);
    if (!sender) return;

    if (!target) return eventError(socket, status_codes.TARGET_NOT_FOUND, cb);

    const message = {
      headers: {
        sent_by: sender.username,
        sent_at
      },
      data
    };

    if (sender.unread_messages.includes(target.username)) {
      sender.remove_unread_message(target.username);
      server.sockets.sockets.get(target.socket_id)?.emit('chat seen', sender.username);
    }

    server.sockets.sockets.get(target.socket_id)?.emit('chat message', message, callbackTimeout(3 * 1000, (response: any) => {
      // TODO: opened_chat ->
      //          true: seen
      //          false: received
      
      if (response instanceof Error) {
        target.add_unread_message(sender.username);
        return;
      }

      target.remove_unread_message(sender.username);
      
      server.sockets.sockets.get(sender.socket_id)?.emit('chat seen', target.username);
    }));

    // Other shenanigans
  }
};

export default send_message; 