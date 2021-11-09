import { USERS, USER } from '@config/types';
import { Socket } from 'socket.io';
import status_codes from '@config/status_codes';

/**
 * @description User registry
 */
 class Registry {
  /**
   * @description All connected users
   * @type {USERS}
   * @protected
   */
  protected _users: USERS = {};

  /**
   * @description Add user to registry
   * @param {Socket} socket
   * @param {String} username
   * @returns {void}
   */
  public add(username: string, socket: Socket): void {
    this._users[username] = { 
      username,
      socket
    };
  }

  /**
   * @description Remove user from registry
   * @param {String} username
   * @returns {void}
   */
  public remove(username: string): void {
    delete this._users[username];
  }

  /**
   * @description Get user socket
   * @param {String} username
   * @returns {Socket}
   */
  public get(username: string): USER {
    return this._users[username];
  }

  /**
   * @description Check if user is in registry
   * @param {String} username
   * @returns {boolean}
   */
  public has(username: string): boolean {
    return this._users[username] !== undefined;
  }

  /**
   * @description Remove user from registry
   * @param {String} username
   * @returns {void}
   */
  public delete(username: string): void {
    delete this._users[username];
  }

  /**
   * @description Get all users
   * @returns {USERS}
   */
  public getAll(): USERS {
    return this._users;
  }
}

export default new class UserRegistry {
  /**
   * @description All connected users
   * @type {USERS}
   */
  Registry = new Registry;

  /**
   * @description User disconnection handler
   * @param {Socket} socket
   * @param {string} username
   */
  onDisconnect(socket: Socket, username: string) {
    const user: USER = this.Registry.get(username);

    if (user)
      this.Registry.delete(username);

    console.log('Session ended: ' + username);
  }

  /**
   * @description User connection handler
   * @param {Socket} socket
   * @param {string} username
   */
  onConnect(socket: Socket) {
    const username: string | undefined = socket.handshake.query.username?.toString();

    // Close socket connection and return an error
    function error(status_code: any) {
      socket.emit('error', {
        code: status_code[0],
        message: status_code[1],
      });
      socket.disconnect();
      return;
    }

    // Check connection validity
    if (!username)
      return error(status_codes.NO_USERNAME)

    if (this.Registry.has(username))
      return error(status_codes.MULTIPLE_SESSIONS)

    // TODO: Authenticate

    this.Registry.add(username, socket);

    console.log('New session: ' + username);

    return username;
  }
}