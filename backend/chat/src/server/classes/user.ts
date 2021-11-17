import status_codes from '@config/status_codes';
import { USER } from '@config/types';
import server from '@server';
import { UserRegistry } from 'server/registries';
import { generateUUID, preEventError } from 'server/utils';
import { Socket } from 'socket.io';

export default class User implements USER {
  readonly uuid: string;
  readonly username: string;
  readonly name: string;
  readonly socket_id: string;
  unread_messages: string[];

  protected constructor(uuid: string, username: string, name: string, socket_id: string, unread_messages: string[]) {
    this.uuid = uuid;
    this.username = username;
    this.name = name;
    this.socket_id = socket_id;
    this.unread_messages = unread_messages;
  }

  add_unread_message(username: string) {
    if (!this.unread_messages.includes(username))
      this.unread_messages.push(username);
  }

  remove_unread_message(username: string) {
    if (this.unread_messages.includes(username))
      this.unread_messages.splice(this.unread_messages.indexOf(username), 1);
  }

  static handleConnection(socket: Socket): User | null {
    const username = socket.handshake.query.username?.toString().normalize('NFC');
    if (!username) {
      preEventError(socket, status_codes.NO_USERNAME)
      return null;
    };

    const name = username.toLowerCase();
    const uuid = generateUUID(username);
    const socket_id = socket.id;

    // TODO: client validation

    const user_instance = new User(uuid, username, name, socket_id, []);

    if (UserRegistry.has(uuid)) {
      preEventError(socket, status_codes.MULTIPLE_SESSIONS)
      return null;
    }

    UserRegistry.add(user_instance);

    console.log(`🔗 ${username} has connected`);

    server.cooldown_information[socket.id] = {
      last_call: 0,
      events_over_threshold: 0
    }

    return user_instance;
  }

  static handleDisconnection(socket: Socket): void {
    let user;
    const uuid = UserRegistry.get_by_socket_id(socket.id)?.uuid;
    if (uuid) {
      user = UserRegistry.get(uuid);
      if (user)
        UserRegistry.remove(uuid);
    }

    delete server.cooldown_information[socket.id];

    console.log(`❌ ${user?.username} has disconnected`);
  }
}