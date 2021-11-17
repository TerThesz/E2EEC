const io = require('socket.io-client');
const socket = io('http://127.0.0.1:8080', { query: "username=bob" });

let sentAt = 0;

socket.on('connected', () => {
  console.log('Connected to server.');

  socket.emit('find user', request('al'), console.log);

  socket.emit('typing message', request(null, { target: 'alice' }));

  socket.emit('send message', request('sussy baka', {sent_to: 'alice'}), (response, id) => socket.emit('remove message', request(null, { target: 'alice', message: id })));
});

socket.on('error', err => console.error(err));

socket.on('chat error', (data) => {
  console.log(data);
});

socket.on('message', (data, cb) => {
  console.log((data.headers.response ? '(response) ' : '') + data.headers.sent_by + ': ' + data.data);
  cb(false, { dt: data.headers.id });
});

socket.on('delete', (data) => {
  console.log('message [' + data.message + '] deleted by: ' + data.sender);
});

socket.on('respond', data => {
  console.log(data.sender + ' responded to: ' + data.message + ' saying: ' + data.content);
});

socket.on('seen', (data) => {
  console.log('message seen by: ' + data.target);
});

socket.on('typing', (data) => {
  console.log(data.sender + ' is typing. . .');
});

socket.on('delivered', (data) => {
  console.log('message delivered to: ' + data.target);
});

function request(data, headers = {}) {
  return {
    headers,
    data
  }
}