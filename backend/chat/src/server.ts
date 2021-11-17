import * as io from 'socket.io';
import { User } from '@classes';
import { COOLDOWNS, USER } from '@config/types';
import { EventRegistry } from 'server/registries';
import { getHostIp } from 'server/utils';
import local_server from 'server/local_server';

const server = new io.Server();
const host_ip = getHostIp();

const cooldown_threshold = process.env.COOLDOWN_THRESHOLD || 500;
const max_events_over_threshold = process.env.MAX_EVENTS_OVER_THRESHOLD || 10;
const cooldown = process.env.COOLDOWN || 10 * 1000;
const threshold_clears_after = process.env.THRESHOLD_CLEARS_AFTER || 10 * 1000;

const cooldown_information: COOLDOWNS = {};

EventRegistry.initializeEvents(); 

server.on('connection', (socket) => {
  // Handle connection
  const user: USER | null = User.handleConnection(socket);
  if (!user) return;

  // Load event handlers
  EventRegistry.listenToEvents(socket, user);

  // Handle disconnection
  socket.on('disconnect', () => User.handleDisconnection(socket));
  socket.on('error', () => User.handleDisconnection(socket));
});

server.listen(8080);
console.log('💬 🏃 on port 8080.');

local_server();

export default {
  sockets: server.sockets,
  cooldown_threshold,
  max_events_over_threshold,
  cooldown,
  threshold_clears_after,
  cooldown_information,
  host_ip
}