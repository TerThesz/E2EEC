import status_codes from "@config/status_codes";
import { USER, USERS } from "@config/types";
import { MiddlewareInterface } from "server/interfaces";
import { Socket } from "socket.io";

const RequestTypeMiddleware: MiddlewareInterface = {
  values: 'data_types',

  run(data: any, socket: Socket, users: USERS, user: USER, values: { [key: string]: any }): boolean {
    const { data_types } = values;

    if (!data_types) return true;

    let found_match = false;

    function findMatch(value: string) {
      switch(value) {
        case 'JSON':
          try {
            JSON.parse(JSON.stringify(data));
            found_match = true;
          } catch (e) {}
        // Will add more cases when needed
      }
    }

    if (Array.isArray(data))
      data.forEach(findMatch);
    else
      findMatch(data_types);

    if (!found_match)
      socket.emit('chat error', status_codes.INVALID_REQUEST_TYPE)

    return found_match;
  }
}

export default RequestTypeMiddleware;