import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { logger } from '../utils/logger.js';

const DATA_DIR = 'data';

// Ensure data directory exists
try {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
} catch (error) {
  logger.error('Failed to create data directory:', error);
}

export async function getOrCreateUser(telegramId, initialData = {}) {
  const usersFile = `${DATA_DIR}/users.json`;

  try {
    let users = {};

    try {
      const data = await readFile(usersFile, 'utf-8');
      users = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    if (!users[telegramId]) {
      users[telegramId] = {
        telegramId,
        username: initialData.username || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        encryptedApiKey: null,
        hasOwnApiKey: false,
        freeCreditsRemaining: 5,
        currentStylePreset: 'casual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...initialData,
      };

      await writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');
    }

    return users[telegramId];
  } catch (error) {
    logger.error('[Storage] Error getting/creating user:', error);
    throw new Error('사용자 정보 로드 실패');
  }
}

export async function updateUser(telegramId, userData) {
  const usersFile = `${DATA_DIR}/users.json`;

  try {
    let users = {};

    try {
      const data = await readFile(usersFile, 'utf-8');
      users = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    users[telegramId] = {
      ...users[telegramId],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    await writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');

    return users[telegramId];
  } catch (error) {
    logger.error('[Storage] Error updating user:', error);
    throw new Error('사용자 정보 업데이트 실패');
  }
}

export async function addUsageLog(telegramId, logData) {
  const usageFile = `${DATA_DIR}/usage_${telegramId}.json`;

  try {
    let logs = [];

    try {
      const data = await readFile(usageFile, 'utf-8');
      logs = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    logs.push({
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
    });

    // Keep only last 1000 logs per user
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }

    await writeFile(usageFile, JSON.stringify(logs, null, 2), 'utf-8');

    return logData;
  } catch (error) {
    logger.error('[Storage] Error adding usage log:', error);
    throw new Error('사용량 기록 저장 실패');
  }
}

export async function getUsageLogs(telegramId) {
  const usageFile = `${DATA_DIR}/usage_${telegramId}.json`;

  try {
    const data = await readFile(usageFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
