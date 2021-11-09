import * as io from 'socket.io';
import status_codes from '@config/status_codes';
import { event_registry, user_registry } from 'server/registries';

const server = new io.Server();

// TODO: normalize(normalization... thing);

server.on('connection', (socket) => {
  // Handle connection
  const username = user_registry.onConnect(socket);
  if (!username) return;

  // Load event handlers
  event_registry.initializeEvents(socket, username);

  // Handle disconnection
  socket.on('disconnect', () => user_registry.onDisconnect(socket, username));
  socket.on('error', () => user_registry.onDisconnect(socket, username));
});

server.listen(8080);
console.log('🏃 on port 8080.');