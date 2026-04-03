import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { config, validateConfig } from './config.js';
import { logger } from './utils/logger.js';

// Handlers
import { handleStart } from './handlers/start.js';
import { handleHelp } from './handlers/help.js';
import { handleApiKey } from './handlers/apiKey.js';
import { handleGenerate } from './handlers/generate.js';
import { handleProductPage } from './handlers/productPage.js';
import { handleStyle } from './handlers/style.js';
import { handleUsage } from './handlers/usage.js';

// Validate configuration
validateConfig();

// Initialize bot
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

logger.info('🤖 vibers-nanobot 시작 중...');

// Register command handlers
bot.command('시작', handleStart);
bot.command('도움말', handleHelp);
bot.command('키등록', handleApiKey.register);
bot.command('키확인', handleApiKey.check);
bot.command('생성', handleGenerate);
bot.command('상세페이지', handleProductPage);
bot.command('스타일', handleStyle);
bot.command('사용량', handleUsage);

// Handle regular messages
bot.on(message('text'), async (ctx) => {
  await ctx.reply(
    '💡 명령어를 입력해주세요.\n\n' +
    '사용 가능한 명령어는 /도움말 을 입력하여 확인할 수 있습니다.'
  );
});

// Error handler
bot.catch((err, ctx) => {
  logger.error(`❌ Error for ${ctx.updateType}:`, err);
  ctx.reply('❌ 오류가 발생했습니다. 관리자에게 문의해주세요.')
    .catch(e => logger.error('Failed to send error message:', e));
});

// Start the bot
console.log('');
console.log('═══════════════════════════════════════════');
console.log('✨ vibers-nanobot 실행 중');
console.log('═══════════════════════════════════════════');
console.log('');

bot.launch()
  .then(() => {
    logger.info('✅ 봇이 실행 중입니다.');
    logger.info('💡 Telegram에서 /시작 을 입력하여 시작하세요.');
    logger.info('');
    logger.info('종료하려면 Ctrl+C를 누르세요.');
  })
  .catch(err => {
    logger.error('❌ 봇 시작 실패:', err);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n👋 봇을 종료하는 중...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n👋 봇을 종료하는 중...');
  bot.stop('SIGTERM');
});
