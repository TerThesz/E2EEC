import os from 'os';

export default function getHostIp(): string {
  let ip = '';

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

  return ip;
}