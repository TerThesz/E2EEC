import status_codes from "@config/status_codes";
import { REQUEST, USER, USERS } from "@config/types";
import { MiddlewareInterface } from "server/interfaces";
import { Socket } from "socket.io";

const RequestTypeMiddleware: MiddlewareInterface = {
  values: 'data_types',

  run(request: REQUEST, socket: Socket, users: USERS, user: USER, values: { [key: string]: any }): boolean {
    const { data_types } = values;
    const { data } = request;

    if (!data_types) return true;
    if (!data) {
      socket.emit('chat error', status_codes.BAD_REQUEST_FORMAT);
      return false;
    }

    let found_match = false;

    function findMatch(value: string) {
      if (typeof data === value) {
        found_match = true;
        return;
      }

      switch(value) {
        case 'JSON':
          if (typeof data === 'object') {
            try {
              JSON.parse(JSON.stringify(data));
              found_match = true;
            } catch (e) {}
          }
        // Will add more cases when needed
      }
    }

    if (Array.isArray(data_types))
      data_types.forEach(findMatch);
    else
      findMatch(data_types);

    if (!found_match)
      socket.emit('chat error', status_codes.BAD_DATA_TYPE)

    return found_match;
  }
}

export default RequestTypeMiddleware;