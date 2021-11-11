import status_codes from '@config/status_codes';
import { USER } from '@config/types';
import { UserRegistry } from 'server/registries';
import { GenerateGuid, PreEventError } from 'server/utils';
import { Socket } from 'socket.io';

export default class User implements USER {
  readonly guid: string;
  readonly username: string;
  readonly name: string;
  readonly socket_id: string;
  unseen_messages: string[];

  protected constructor(guid: string, username: string, name: string, socket_id: string, unseen_messages: string[]) {
    this.guid = guid;
    this.username = username;
    this.name = name;
    this.socket_id = socket_id;
    this.unseen_messages = unseen_messages;
  }

  add_unseen_message(username: string) {
    if (!this.unseen_messages.includes(username))
      this.unseen_messages.push(username);
  }

  remove_unseen_message(username: string) {
    if (this.unseen_messages.includes(username))
      this.unseen_messages.splice(this.unseen_messages.indexOf(username), 1);
  }

  static handleConnection(socket: Socket): User | null {
    const username = socket.handshake.query.username?.toString().normalize('NFC');
    if (!username) {
      PreEventError(socket, status_codes.NO_USERNAME)
      return null;
    };

    const name = username.toLowerCase();
    const guid = GenerateGuid(username);
    const socket_id = socket.id;

    // TODO: client validation

    const user_instance = new User(guid, username, name, socket_id, []);

    if (UserRegistry.has(guid)) {
      PreEventError(socket, status_codes.MULTIPLE_SESSIONS)
      return null;
    }

    UserRegistry.add(user_instance);

    console.log(`${username} has connected`);

    return user_instance;
  }

  static handleDisconnection(socket: Socket): void {
    let user;
    const guid = UserRegistry.get_by_socket_id(socket.id)?.guid;
    if (guid) {
      user = UserRegistry.get(guid);
      if (user)
        UserRegistry.remove(guid);
    }

    console.log(`${user?.username} has disconnected`);
  }
}