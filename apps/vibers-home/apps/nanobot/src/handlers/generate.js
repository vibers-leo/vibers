import { getOrCreateUser, updateUser, addUsageLog } from '../services/storage.js';
import { generateImage } from '../services/gemini.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

export async function handleGenerate(ctx) {
  const telegramId = ctx.from.id.toString();
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    await ctx.reply(
      '사용 방법: /생성 [프롬프트]\n\n' +
      '예: /생성 현대적인 카페 인테리어, 자연광, 미니멀 디자인'
    );
    return;
  }

  const prompt = args.join(' ');

  // Send loading message
  const loadingMsg = await ctx.reply('⏳ 이미지를 생성 중입니다... (약 30초 소요)');

  try {
    const user = await getOrCreateUser(telegramId);

    // Check rate limit
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const usageLogs = await getUsageLogsForDay(telegramId, year, month, day);
    if (usageLogs.length >= config.DAILY_LIMIT_PER_USER) {
      await ctx.editMessageText(
        `❌ 오늘의 생성 한도를 초과했습니다.\n\n` +
        `일일 한도: ${config.DAILY_LIMIT_PER_USER}장\n` +
        `내일 다시 시도해주세요.`
      );
      return;
    }

    // Get API key
    let apiKey;
    const { decryptApiKey } = await import('../services/crypto.js');
    if (user.encryptedApiKey) {
      apiKey = decryptApiKey(user.encryptedApiKey);
    } else if (user.freeCreditsRemaining > 0) {
      apiKey = config.SHARED_API_KEY;
      user.freeCreditsRemaining--;
      await updateUser(telegramId, user);
    } else {
      await ctx.editMessageText(
        `❌ API 키가 등록되지 않았고 무료 크레딧이 없습니다.\n\n` +
        `/키등록 [API_KEY] 를 입력해 API 키를 등록해주세요.`
      );
      return;
    }

    // Add style preset if user has one
    let finalPrompt = prompt;
    if (user.currentStylePreset && user.currentStylePreset !== 'casual') {
      const { getStylePrompt } = await import('../presets/prompts.js');
      const stylePrompt = getStylePrompt(user.currentStylePreset);
      finalPrompt = `${prompt}${stylePrompt}`;
    }

    // Generate image
    const imageBuffer = await generateImage(apiKey, finalPrompt);

    if (!imageBuffer) {
      await ctx.editMessageText('❌ 이미지 생성에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // Send image
    await ctx.deleteMessage();
    await ctx.replyWithPhoto(
      { source: imageBuffer },
      {
        caption:
          `✅ 완료!\n\n` +
          `📊 이번 달 남은 생성 횟수: ${config.DAILY_LIMIT_PER_USER - usageLogs.length - 1}/${config.DAILY_LIMIT_PER_USER}`,
      }
    );

    // Log usage
    await addUsageLog(telegramId, {
      command: '/생성',
      prompt,
      apiProvider: user.encryptedApiKey ? 'user' : 'leo_shared_pool',
      year,
      month,
      day,
      timestamp: new Date().toISOString(),
    });

    logger.info(`[/생성] Image generated for user ${telegramId}`);
  } catch (error) {
    logger.error('[/생성] Error:', error);
    await ctx.editMessageText(
      `❌ 이미지 생성 중 오류가 발생했습니다.\n\n` +
      `오류: ${error.message || '알 수 없는 오류'}`
    );
  }
}

async function getUsageLogsForDay(telegramId, year, month, day) {
  const usageFile = `data/usage_${telegramId}.json`;
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(usageFile, 'utf-8');
    const logs = JSON.parse(data);
    return logs.filter(log => log.year === year && log.month === month && log.day === day);
  } catch (error) {
    return [];
  }
}
