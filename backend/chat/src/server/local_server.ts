import status_codes from '@config/status_codes';
import server from '@server';
import * as io from 'socket.io';
import { UserRegistry } from './registries';
import { callbackTimeout, eventError, preEventError } from './utils';

const local_server = new io.Server();

const available_events = [ 'friend_request' ];

local_server.on('connection', (socket) => {
  if (socket.handshake.address.replace('::ffff:', '') !== process.env.LOCAL_SERVER_IP)
    return preEventError(socket, status_codes.FORBIDDEN);

  socket.on('send event', (data) => {
    const { event, payload, uuid } = data;

    if (!event || !payload || !uuid) return eventError(socket, status_codes.BAD_DATA_FORMAT);

    const user = UserRegistry.get(uuid);
    if (!user) return eventError(socket, status_codes.TARGET_NOT_FOUND);

    if (!available_events.includes(event)) return eventError(socket, status_codes.EVENT_NOT_FOUND);

    server.sockets.sockets.get(user.socket_id)?.emit(event.replace('_', ' '), payload, callbackTimeout(3 * 1000, send_event_callback));
  });
});

local_server.listen(8080);
console.log('🏃 on port 8080.');

function send_event_callback(status: boolean | Error) {
  if (status === true) return;

  // offline event handling
}