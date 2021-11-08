import * as io from 'socket.io';
import status_codes from '@config/status_codes';

const server = new io.Server();

const clients: { [key: string]: io.Socket | { [key: string]: any } } = { };

server.on('connection', (socket) => {
  socket.on('initialize-session', (data) => {
    const username = data.toString();

    if (Object.values(clients).find((client) => client.id === socket.id)) {
      socket.emit('chat-error', status_codes.SESSION_EXISTS);
      return;
    }

    if (clients[username]) {
      socket.emit('chat-error', status_codes.USERNAME_IN_USE);
      return;
    }

    clients[username] = socket;
    console.log('New session: ' + username);

    socket.emit('chat-error', status_codes.SESSION_INITIALIZED);
  });

  socket.on('start-chat', (data) => {
    const target = data.toString();

    if (!clients[target]) {
      socket.emit('chat-error', 'Target user does not exist');
      return;
    }
  });

  function removeSocketFromClients(socket: io.Socket) {
    const username = Object.keys(clients).find((username) => clients[username] === socket);
    if (username) {
      delete clients[username];

      console.log('Session ended: ' + username);
    }
  }

  socket.on('disconnect', () => removeSocketFromClients(socket));
  socket.on('error', () => removeSocketFromClients(socket));
});

server.listen(8080);
console.log('🏃 on port 8080.');