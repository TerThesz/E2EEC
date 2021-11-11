import status_codes from "@config/status_codes";
import { REQUEST } from "@config/types";
import { Socket } from "socket.io";

const ParseRequestMiddleware = (buffer: Buffer, socket: Socket): REQUEST | null => {
  if (typeof buffer === 'object') {
    try {
      JSON.parse(JSON.stringify(buffer));
    } catch (e) {
      socket.emit('chat error', status_codes.BAD_REQUEST_TYPE);
      return null;
    }
  } else {
    socket.emit('chat error', status_codes.BAD_REQUEST_TYPE);
    return null;
  }

  const { headers, data } = (buffer as { [key: string]: any });
  if (!headers) {
    socket.emit('chat error', status_codes.BAD_REQUEST_FORMAT);
    return null;
  }

  return { headers, data };
}

export default ParseRequestMiddleware;