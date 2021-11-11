import * as io from 'socket.io';
import { User } from '@classes';
import { COOLDOWNS, USER } from '@config/types';
import { EventRegistry } from 'server/registries';
import { Socket } from 'socket.io';

const server = new io.Server();

const cooldown_threshold = process.env.COOLDOWN_THRESHOLD || 500;
const max_events_over_threshold = process.env.MAX_EVENTS_OVER_THRESHOLD || 10;
const cooldown = process.env.COOLDOWN || 10 * 1000;
const threshold_clears_after = process.env.THRESHOLD_CLEARS_AFTER || 10 * 1000;

const cooldown_information: COOLDOWNS = {};

// TODO: Redo naming (AND MAKE IT CONSISTENT)
// TODO: Rename events

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

export default {
  sockets: server.sockets,
  cooldown_threshold,
  max_events_over_threshold,
  cooldown,
  threshold_clears_after,
  cooldown_information
}