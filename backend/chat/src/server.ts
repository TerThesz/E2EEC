import * as io from 'socket.io';
import status_codes from '@config/status_codes';

const server = new io.Server();

const clients: { [username: string]: io.Socket } = {};
const pipeline: Array<{ id: string, sockets: Array<io.Socket> }> = new Array<{ id: string, sockets: Array<io.Socket> }>();

// TODO: store username

server.on('connection', (socket) => {
  initializeSession(socket);

  socket.on('chat-start', (data, cb) => {
    if (pipeline.find(pipe => pipe.sockets.includes(socket))) {
      socket.emit('chat-error', status_codes.ALREADY_IN_PIPE);
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
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    pipe.sockets.forEach((client) => {
      if (client.id !== socket.id) {
        client.emit('chat-message', message);
      }
    });

    console.log(`[${pipe.id}] ${(socket.handshake.query.username as string)}: ${message}`);
  });

  socket.on('chat-end', () => {
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    for (const client of pipe.sockets) {
      client.emit('chat-error', status_codes.PIPE_ENDED);
    }

    pipeline.splice(pipeline.indexOf(pipe), 1);

    console.log(`${pipe.id} was deleted`);
  });

  socket.on('chat-join', (data, cb) => {
    const pipe = pipeline.find(pipe => pipe.id === data.toString());

    if (!pipe) {
      socket.emit('chat-error', status_codes.PIPE_NOT_FOUND);
      return;
    }

    if (pipe.sockets.includes(socket)) {
      socket.emit('chat-error', status_codes.ALREADY_IN_PIPE);
      return;
    }

    for (const client of pipe.sockets) {
      client.emit('chat-join', status_codes.JOINED_PIPE((socket.handshake.query.username as string).toString()));
    }

    pipe.sockets.push(socket);

    console.log(`${(socket.handshake.query.username as string)} joined ${pipe.id}`);

    cb();
  });

  socket.on('remove-from-chat', (data) => {
    const target_username = data.toString();
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    const target = clients[target_username];

    if (!target) {
      socket.emit('chat-error', status_codes.TARGET_NOT_FOUND);
      return;
    }

    if (!pipe.sockets.find(client => client === target)) {
      socket.emit('chat-error', status_codes.TARGET_NOT_IN_PIPE);
      return;
    }

    pipe.sockets.splice(pipe.sockets.indexOf(target), 1);

    for (const client of pipe.sockets) {
      client.emit('chat-removed', status_codes.TARGET_REMOVED(target_username));
    }

    console.log(`${target_username} was removed from ${pipe.id}`);

    target.emit('chat-error', status_codes.REMOVED_FROM_PIPE);
  });

  socket.on('chat-leave', (data, cb) => {
    const pipe = pipeline.find(pipe => pipe.sockets.includes(socket));

    if (!pipe) {
      socket.emit('chat-error', status_codes.NOT_IN_PIPE);
      return;
    }

    pipe.sockets.splice(pipe.sockets.indexOf(socket), 1);

    for (const client of pipe.sockets) {
      client.emit('chat-leave', status_codes.LEFT_PIPE((socket.handshake.query.username as string).toString()));
    }

    console.log(`${(socket.handshake.query.username as string)} left ${pipe.id}`);
  
    cb();
  });

  function removeSocketFromClients(socket: io.Socket) {
    const username = socket.handshake.query.username?.toString();
    if (username) {
      delete clients[username];

      console.log('Session ended: ' + username);
    }
  }

  socket.on('disconnect', () => removeSocketFromClients(socket));
  socket.on('error', () => removeSocketFromClients(socket));
});

function initializeSession(socket: io.Socket) {
  const username: string | undefined = socket.handshake.query.username?.toString();

  if (!username) {
    socket.emit('error', {
      code: status_codes.NO_USERNAME[0],
      message: status_codes.NO_USERNAME[1],
    });
    socket.disconnect();
    return;
  }

  if (clients[username]) {
    socket.emit('error', {
      code: status_codes.USERNAME_IN_USE[0],
      message: status_codes.USERNAME_IN_USE[1],
    });
    socket.disconnect();
    return;
  }

  if (Object.values(clients).includes(socket)) {
    socket.emit('error', {
      code: status_codes.SESSION_ALREADY_INITIALIZED[0],
      message: status_codes.SESSION_ALREADY_INITIALIZED[1],
    });
    socket.disconnect();
    return;
  }

  clients[username] = socket;
  
  console.log('New session: ' + username);

  socket.emit('chat-error', status_codes.SESSION_INITIALIZED);
}

server.listen(8080);
console.log('🏃 on port 8080.');