import status_codes from "@config/status_codes";
import server from "@server";
import { Socket } from "socket.io";

const cooldowns: string[] = [];

const CooldownMiddleware = (socket: Socket) => {
  const cooldown_info = server.cooldown_information[socket.id];
  if (!cooldown_info || cooldowns.includes(socket.handshake.address.toString())) {
    socket.disconnect();
    return;
  }

  if (new Date().getTime() - cooldown_info.last_call >= server.cooldown_threshold) {
    cooldown_info.events_over_threshold += 1;
    if (cooldown_info.events_over_threshold >= server.max_events_over_threshold) {
      socket.emit('chat error', status_codes.TOO_MANY_CALLS);

      cooldowns.push(socket.handshake.address.toString());
      console.log(1);

      socket.disconnect();

      setTimeout(() => {
        cooldowns.splice(cooldowns.indexOf(socket.handshake.address.toString()), 1);
      }, (server.threshold_clears_after as number));
    }
  }
}

export default CooldownMiddleware;