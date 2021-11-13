import server from '@server';
import crypto from 'crypto';

export default function generateUUID(text: string): string {
  let uuid;

  uuid = crypto.createHash('sha1').update(`${text}${server.host_ip}${new Date().getTime()}${Math.floor(Math.random() * 100000)}`).digest('hex');

  uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20, 32);

  return uuid;
}