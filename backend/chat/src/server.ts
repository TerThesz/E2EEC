import * as io from 'socket.io';
import { User } from '@classes';
import { USER } from '@config/types';
import { EventRegistry } from 'server/registries';

const server = new io.Server();

server.on('connection', (socket) => {
  // Handle connection
  const user: USER | null = User.handleConnection(socket);
  if (!user) return;

  // Load event handlers
  EventRegistry.initializeEvents(socket, user);

  // Handle disconnection
  socket.on('disconnect', () => User.handleDisconnection(socket));
  socket.on('error', () => User.handleDisconnection(socket));
});

server.listen(8080);
console.log('🏃 on port 8080.');