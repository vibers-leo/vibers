import { getOrCreateUser } from '../services/storage.js';
import { logger } from '../utils/logger.js';

export async function handleUsage(ctx) {
  const telegramId = ctx.from.id.toString();

  try {
    const user = await getOrCreateUser(telegramId);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const usageLogs = await getUsageLogsForMonth(telegramId, year, month);
    const monthlyUsage = usageLogs.length;

    // Calculate weekly usage
    const weeklyUsage = [];
    for (let week = 1; week <= 4; week++) {
      const startDay = (week - 1) * 7 + 1;
      const endDay = week * 7;
      const weekCount = usageLogs.filter(
        log => log.day >= startDay && log.day <= endDay
      ).length;
      weeklyUsage.push(`${week}주: ${weekCount} 이미지`);
    }

    const usageText =
      `📊 ${month}월 사용량 통계\n\n` +
      `이미지 생성: ${monthlyUsage} / 30 개\n` +
      `API 키 상태: ${user.encryptedApiKey ? '등록됨 ✅' : '미등록 ❌'}\n\n` +
      `🆓 무료 크레딧: ${user.freeCreditsRemaining} / 5 개\n` +
      `💳 유료 API: ${user.encryptedApiKey ? '사용 중' : '미사용'}\n\n` +
      `📈 주간 추이:\n` +
      `${weeklyUsage.join('\n')}\n\n` +
      `${monthlyUsage >= 25 ? '💡 한 달 한도를 거의 다 사용하셨습니다!' : ''}`;

    await ctx.reply(usageText);

    logger.info(`[/사용량] Usage checked for user ${telegramId}`);
  } catch (error) {
    logger.error('[/사용량] Error:', error);
    await ctx.reply('❌ 사용량 확인 중 오류가 발생했습니다.');
  }
}

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
