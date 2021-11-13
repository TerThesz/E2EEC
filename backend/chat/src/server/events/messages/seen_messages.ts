import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS, USER_REGISTRY } from "@config/types";
import server from "@server";
import { EventInterface } from "server/interfaces";
import { eventError } from '@utils';
import { Socket } from "socket.io";

const seen_messages: EventInterface = {
  name: 'seen messages',

  handler(request: REQUEST, cb: Function, socket: Socket, users: USER_REGISTRY, sender: USER): void {
    const { sender_of_messages } = request.headers;
    if (!sender_of_messages) return eventError(socket, status_codes.BAD_DATA_FORMAT, cb);

    const target = users.get_by_name(sender_of_messages.toLowerCase());

    if (!target) return eventError(socket, status_codes.TARGET_NOT_FOUND, cb);

    sender.remove_unread_message(target.username);

    server.sockets.sockets.get(target.socket_id)?.emit('seen', sender.username);
  }
};

export default seen_messages; 