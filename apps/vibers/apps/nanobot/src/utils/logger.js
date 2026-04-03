import { config } from '../config.js';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const LEVEL_NAMES = {
  0: 'ERROR',
  1: 'WARN',
  2: 'INFO',
  3: 'DEBUG',
};

const COLORS = {
  error: '\x1b[31m',   // Red
  warn: '\x1b[33m',    // Yellow
  info: '\x1b[36m',    // Cyan
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m',
};

class Logger {
  constructor(level = 'info') {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.info;
  }

  log(level, message, meta = null) {
    if (LOG_LEVELS[level] > this.level) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LEVEL_NAMES[LOG_LEVELS[level]];
    const color = COLORS[level];

    let logMessage = `${color}[${timestamp}] [${levelName}]${COLORS.reset} ${message}`;

    if (meta) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }

    console.log(logMessage);
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger(config.LOG_LEVEL);
