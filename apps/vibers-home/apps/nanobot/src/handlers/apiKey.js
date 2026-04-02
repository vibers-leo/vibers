import { getOrCreateUser, updateUser } from '../services/storage.js';
import { encryptApiKey, decryptApiKey } from '../services/crypto.js';
import { logger } from '../utils/logger.js';

export const handleApiKey = {
  register: async (ctx) => {
    const telegramId = ctx.from.id.toString();
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length === 0) {
      await ctx.reply(
        '사용 방법: /키등록 [API_KEY]\n\n' +
        '예: /키등록 AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n\n' +
        '💡 API 키는 https://aistudio.google.com 에서 발급받을 수 있습니다.'
      );
      return;
    }

    const apiKey = args[0];

    // Validate API key format
    if (!apiKey.startsWith('AIza')) {
      await ctx.reply(
        '❌ 유효하지 않은 API 키입니다.\n\n' +
        'Google AI Studio에서 발급받은 키를 사용해주세요.\n' +
        'https://aistudio.google.com'
      );
      return;
    }

    try {
      // Delete the message for security
      try {
        await ctx.deleteMessage();
      } catch (e) {
        // Ignore if can't delete
      }

      // Get or create user
      let user = await getOrCreateUser(telegramId);

      // Encrypt and save API key
      const encryptedKey = encryptApiKey(apiKey);
      user.encryptedApiKey = encryptedKey;
      user.hasOwnApiKey = true;
      user.freeCreditsRemaining = 0; // Reset free credits once user registers own key
      user.updatedAt = new Date().toISOString();

      await updateUser(telegramId, user);

      await ctx.reply(
        '✅ API 키가 안전하게 등록되었습니다!\n\n' +
        '이제 무제한으로 이미지를 생성할 수 있습니다.\n' +
        '(월간 API 사용량은 Google Cloud에서 자동 청구됩니다)\n\n' +
        '궁금한 점이 있으면 /도움말 을 입력하세요.'
      );

      logger.info(`[/키등록] API key registered for user ${telegramId}`);
    } catch (error) {
      logger.error('[/키등록] Error:', error);
      await ctx.reply('❌ 키 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  },

  check: async (ctx) => {
    const telegramId = ctx.from.id.toString();

    try {
      const user = await getOrCreateUser(telegramId);

      if (!user.encryptedApiKey) {
        await ctx.reply(
          '❌ 등록된 API 키가 없습니다.\n\n' +
          '/키등록 [API_KEY] 를 입력해 API 키를 등록해주세요.\n\n' +
          `🆓 남은 무료 크레딧: ${user.freeCreditsRemaining} / 5 장`
        );
        return;
      }

      // Decrypt and mask API key
      const apiKey = decryptApiKey(user.encryptedApiKey);
      const maskedKey = apiKey.substring(0, 4) + '***...' + apiKey.substring(apiKey.length - 4);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const usageLogs = await getUsageLogsForMonth(telegramId, year, month);
      const monthlyUsage = usageLogs.length;

      const statusText =
        `현재 API 키 상태:\n\n` +
        `📍 상태: 등록됨 ✅\n` +
        `🔐 키: ${maskedKey}\n` +
        `📊 이번 달 사용량: ${monthlyUsage} 이미지\n` +
        `🆓 남은 무료 크레딧: ${user.freeCreditsRemaining} 장\n\n` +
        `API 키를 변경하려면: /키등록 [새_API_KEY]`;

      await ctx.reply(statusText);

      logger.info(`[/키확인] Status checked for user ${telegramId}`);
    } catch (error) {
      logger.error('[/키확인] Error:', error);
      await ctx.reply('❌ 상태 확인 중 오류가 발생했습니다.');
    }
  },
};

async function getUsageLogsForMonth(telegramId, year, month) {
  const usageFile = `data/usage_${telegramId}.json`;
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(usageFile, 'utf-8');
    const logs = JSON.parse(data);
    return logs.filter(log => log.year === year && log.month === month);
  } catch (error) {
    return [];
  }
}
