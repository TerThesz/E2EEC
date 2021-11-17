const io = require('socket.io-client');
const socket = io('http://127.0.0.1:8080', { query: "username=patrik" });

socket.on('connect', () => {
  console.log('Connected to server.');

  socket.emit('test', 'patrik', () => { socket.emit('chat-message', 'prd') });
});

socket.on('test', (data) => {
  console.log(data.toString());
});

socket.on('chat-error', (data) => {
  console.log(data);
  console.log(data.toString());
});

socket.on('chat-message', (data) => {
  console.log(data.toString());
})