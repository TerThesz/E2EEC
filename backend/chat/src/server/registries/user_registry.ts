import { USERS, USER } from '@config/types';
import { User } from 'server/classes';

export default new class UserRegistry {
  readonly users: USERS = {};

  public add(user: User): void {
    this.users[user.guid] = user;
  }

  public remove(guid: string): void {
    delete this.users[guid];
  }

  public get(guid: string): USER {
    return this.users[guid];
  }

  public get_by_name(name: string): USER | null {
    for (const guid in this.users) {
      if (this.users[guid].name === name) {
        return this.users[guid];
      }
    }
    return null;
  }

  public has(guid: string): boolean {
    return this.users[guid] !== undefined;
  }

  public get_by_socket_id(socket_id: string): USER | null {
    for (const guid in this.users) {
      if (this.users[guid].socket_id === socket_id) {
        return this.users[guid];
      }
    }
    return null;
  }
}