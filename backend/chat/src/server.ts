import * as io from 'socket.io';
import status_codes from '@config/status_codes';

const server = new io.Server();

const clients: { [username: string]: io.Socket } = {};
const pipeline: Array<{ id: string, sockets: Array<io.Socket> }> = new Array<{ id: string, sockets: Array<io.Socket> }>();

// TODO: socket.handshake.query.username

server.on('connection', (socket) => {
  socket.on('initialize-session', (data) => {
    const username: string = data.toString();

    if (clients[username]) {
      socket.emit('initialize-session', status_codes.USERNAME_IN_USE);
      return;
    }

    if (Object.values(clients).includes(socket)) {
      socket.emit('initialize-session', status_codes.SESSION_ALREADY_INITIALIZED);
      return;
    }

    clients[username] = socket;
    
    console.log('New session: ' + username);

    socket.emit('chat-error', status_codes.SESSION_INITIALIZED);
  });

  socket.on('start-chat', (data, cb) => {
    if (pipeline.find(pipe => pipe.sockets.includes(socket))) {
      socket.emit('chat-error', status_codes.ALREADY_IN_PIPELINE);
      return
    }

    let pipelineId: string = Math.random().toString(36).substring(2, 15);
    while (pipeline.find(pipe => pipe.id === pipelineId)) {
      pipelineId = Math.random().toString(36).substring(2, 15);
    }

    pipeline.push({
      id: pipelineId,
      sockets: [socket]
    });

    console.log('New pipe: ' + pipelineId);

    cb(pipelineId);
  });

  socket.on('chat-message', (data) => {
    const message = data.toString();
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPELINE);
      return;
    }

    pipe.sockets.forEach((client) => {
      if (client.id !== socket.id) {
        client.emit('chat-message', message);
      }
    });

    console.log(`[${pipe.id}] ${message}`);
  });

  socket.on('end-chat', () => {
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPELINE);
      return;
    }

    pipe.sockets.forEach((client) => {
      if (client.id !== socket.id) {
        client.emit('chat-error', status_codes.PIPELINE_ENDED);
      }
    });

    pipeline.splice(pipeline.indexOf(pipe), 1);

    console.log(`${pipe.id} was deleted`);
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