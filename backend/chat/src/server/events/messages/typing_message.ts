import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS, USER_REGISTRY } from "@config/types";
import server from "@server";
import { EventInterface } from "server/interfaces";
import { eventError } from "server/utils";
import { Socket } from "socket.io";

const typing_messages: EventInterface = {
  name: 'typing message',

  handler(request: REQUEST, cb: Function, socket: Socket, users: USER_REGISTRY, sender: USER): void {
    const { target } = request.headers;
    if (!target) return eventError(socket, status_codes.BAD_DATA_FORMAT, cb);

    const target_user = users.get_by_name(target.toLowerCase());

    if (!target_user) return eventError(socket, status_codes.TARGET_NOT_FOUND, cb);

    server.sockets.sockets.get(target_user.socket_id)?.emit('typing', { sender: sender.username });
  }
};

export default typing_messages; 