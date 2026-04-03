import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export const config = {
  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',

  // Gemini API
  SHARED_API_KEY: process.env.SHARED_API_KEY || '',
  GEMINI_API_MODEL: process.env.GEMINI_API_MODEL || 'gemini-2.0-flash-exp',

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',

  // Free Trial
  FREE_CREDITS_PER_USER: parseInt(process.env.FREE_CREDITS_PER_USER || '5'),
  FREE_CREDITS_POOL_TOTAL: parseInt(process.env.FREE_CREDITS_POOL_TOTAL || '50'),

  // Rate Limiting
  DAILY_LIMIT_PER_USER: parseInt(process.env.DAILY_LIMIT_PER_USER || '10'),

  // Operations
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID || '',
};

export function validateConfig() {
  const required = ['TELEGRAM_BOT_TOKEN', 'SHARED_API_KEY', 'ENCRYPTION_KEY'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    console.error('❌ 필수 환경변수가 설정되지 않았습니다:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\n💡 .env 파일을 확인하세요.');
    process.exit(1);
  }
}
