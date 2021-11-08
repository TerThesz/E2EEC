import * as io from 'socket.io';
import status_codes from '@config/status_codes';
import { CLIENTS, PIPELINE, PIPELINE_OBJ } from '@config/types';
import { handleEvents, handleDisconnection, handleConnection } from './server/handlers';

const server = new io.Server();

const clients: CLIENTS = {};
const pipeline: PIPELINE = new Array<PIPELINE_OBJ>();

// TODO: normalize(normalization... thing);

server.on('connection', (socket) => {
  // Handle connection
  const username = handleConnection(socket, clients, pipeline);
  if (!username) return;

  // Load event handlers
  handleEvents(socket, clients, pipeline, username);

  // Handle disconnection
  socket.on('disconnect', () => handleDisconnection(socket, clients, pipeline, username));
  socket.on('error', () => handleDisconnection(socket, clients, pipeline, username));
});

server.listen(8080);
console.log('🏃 on port 8080.');