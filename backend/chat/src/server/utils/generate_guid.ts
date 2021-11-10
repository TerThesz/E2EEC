import crypto from 'crypto';

export default function generateUUID(username: string): string {
  const guid = crypto.createHash('sha1').update(username).digest('hex');
  return guid.substring(0, 8) + '-' + guid.substring(8, 12) + '-' + guid.substring(12, 16) + '-' + guid.substring(16, 20) + '-' + guid.substring(20);
}