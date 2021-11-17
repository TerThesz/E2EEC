const os = require('os');
const crypto = require('crypto');

const username = 'cajko';

let uuid, ip;
  
Object.keys(os.networkInterfaces()).forEach((key) => {
  os.networkInterfaces()[key]?.forEach((address) => {
    if (address.family === 'IPv4' && !address.internal) {
      ip = address.address;
    }
  });
});

if (!ip) {
  throw new Error('Could not get ip address of host machine');
}

uuid = crypto.createHash('sha1').update(`${username}${ip}${new Date().getTime()}${Math.floor(Math.random() * 100000)}`).digest('hex');

uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20, 32);

console.log(ip);