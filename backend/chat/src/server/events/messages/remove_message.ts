import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS } from "@config/types";
import server from "@server";
import { EventInterface } from "server/interfaces";
import { UserRegistry } from "server/registries";
import { eventError } from "server/utils";
import { Socket } from "socket.io";

const remove_messages: EventInterface = {
  name: 'remove message',

  handler(request: REQUEST, cb: Function, socket: Socket, users: USERS, user: USER): void {
    const { target, message } = request.headers;
    if (!target || !message) return eventError(socket, status_codes.BAD_DATA_FORMAT, cb);


    const target_user = UserRegistry.get_by_name(target.toLowerCase());
    const sender = UserRegistry.get_by_socket_id(socket.id);

    if (!target_user) return eventError(socket, status_codes.TARGET_NOT_FOUND, cb);
    if (!sender) return;

    server.sockets.sockets.get(target_user.socket_id)?.emit('chat delete', { sender: sender.username, message });
  
    cb(true);
  }
};

export default remove_messages; 