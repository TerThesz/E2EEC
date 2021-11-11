import { USERS, USER } from '@config/types';

export default new class UserRegistry {
  readonly users: USERS = {};

  public add(username: string, name: string, guid: string, socket_id: string): void {
    this.users[guid] = { 
      username,
      name,
      guid,
      socket_id
    };
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

  public get_guid(socket_id: string): string | null {
    for (const guid in this.users) {
      if (this.users[guid].socket_id === socket_id) {
        return this.users[guid].guid;
      }
    }
    return null;
  }
}