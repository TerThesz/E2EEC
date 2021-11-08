import * as io from 'socket.io';

const server = new io.Server();

const clients: { [key: string]: io.Socket | { [key: string]: any } } = { };

server.on('connection', (socket) => {
  clients["patrik"] = { id: "cc" };
  socket.on('initialize-session', (data, cb) => {
    const username = data.toString();

    // callback codes:
    // 0: success
    // 1: session already exists
    // 2: username already taken

    if (Object.values(clients).find((client) => client.id === socket.id)) {
      cb('Session already exists', 1);
      return;
    }

    if (clients[username]) {
      cb('Username is already in use', 2);
      return;
    }

    clients[username] = socket;
    console.log('New session: ' + username);

    cb('Session successfully initialized', 3);
  });

  socket.on('start-chat', (data) => {

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