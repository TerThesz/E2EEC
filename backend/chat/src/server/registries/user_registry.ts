import { USERS, USER } from '@config/types';
import { User } from 'server/classes';

export default class UserRegistry {
  readonly users: USERS = {};

  public add(user: User): void {
    this.users[user.uuid] = user;
  }

  public remove(uuid: string): void {
    delete this.users[uuid];
  }

  public get(uuid: string): USER {
    return this.users[uuid];
  }

  public get_by_name(name: string): USER | null {
    for (const uuid in this.users) {
      if (this.users[uuid].name === name) {
        return this.users[uuid];
      }
    }
    return null;
  }

  public has(uuid: string): boolean {
    return this.users[uuid] !== undefined;
  }

  public get_by_socket_id(socket_id: string): USER | null {
    for (const uuid in this.users) {
      if (this.users[uuid].socket_id === socket_id) {
        return this.users[uuid];
      }
    }
    return null;
  }
}