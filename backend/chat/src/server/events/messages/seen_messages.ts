import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS } from "@config/types";
import server from "@server";
import { EventInterface } from "server/interfaces";
import { RequestTypeMiddleware } from "server/middleware";
import { UserRegistry } from "server/registries";
import { eventError } from "server/utils";
import { Socket } from "socket.io";
const seen_messages: EventInterface = {
  name: 'seen messages',
  data_types: 'string',

  middleware: RequestTypeMiddleware,

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void {
    const { data } = request;

    const target = UserRegistry.get_by_name(data.toLowerCase());
    const sender = UserRegistry.get_by_socket_id(socket.id);

    if (!target) return eventError(socket, status_codes.TARGET_NOT_FOUND, cb);
    if (!sender) return;

    sender.remove_unread_message(target.username);

    server.sockets.sockets.get(target.socket_id)?.emit('chat seen', sender.username);
  }
};

export default seen_messages; 