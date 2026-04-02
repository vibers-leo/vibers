import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const ALGORITHM = 'aes-256-cbc';

export function encryptApiKey(apiKey) {
  try {
    const key = Buffer.from(config.ENCRYPTION_KEY.padStart(64, '0'), 'hex').slice(0, 32);
    const iv = randomBytes(16);

    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(apiKey, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted data
    const result = iv.toString('hex') + ':' + encrypted;

    return result;
  } catch (error) {
    logger.error('[Crypto] Encryption error:', error);
    throw new Error('API 키 암호화 실패');
  }
}

export function decryptApiKey(encryptedData) {
  try {
    const [ivHex, encrypted] = encryptedData.split(':');
    const key = Buffer.from(config.ENCRYPTION_KEY.padStart(64, '0'), 'hex').slice(0, 32);
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  } catch (error) {
    logger.error('[Crypto] Decryption error:', error);
    throw new Error('API 키 복호화 실패');
  }
}
