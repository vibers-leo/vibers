import { getOrCreateUser, updateUser, addUsageLog } from '../services/storage.js';
import { generateImage } from '../services/gemini.js';
import { getProductPreset } from '../presets/prompts.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

const PRODUCT_CATEGORIES = {
  의류: '패션 의류',
  식품: '식품',
  전자제품: '전자제품',
  뷰티: '뷰티 & 화장품',
  생활용품: '생활용품',
};

export async function handleProductPage(ctx) {
  const telegramId = ctx.from.id.toString();
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length < 2) {
    const categories = Object.keys(PRODUCT_CATEGORIES).join(', ');
    await ctx.reply(
      `사용 방법: /상세페이지 [카테고리] [상품명]\n\n` +
      `가능한 카테고리: ${categories}\n\n` +
      `예: /상세페이지 의류 청바지`
    );
    return;
  }

  const category = args[0];
  const productName = args.slice(1).join(' ');

  if (!PRODUCT_CATEGORIES[category]) {
    const categories = Object.keys(PRODUCT_CATEGORIES).join(', ');
    await ctx.reply(
      `❌ 없는 카테고리입니다.\n\n` +
      `가능한 카테고리: ${categories}`
    );
    return;
  }

  // Send loading message
  const loadingMsg = await ctx.reply(
    `🛒 상세페이지 이미지 생성 중...\n\n` +
    `카테고리: ${category}\n` +
    `상품명: ${productName}\n\n` +
    `⏳ 약 30초 소요...`
  );

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

    // Get preset prompt
    const preset = getProductPreset(category);
    let prompt = preset.basePrompt.replace('{{productName}}', productName);

    // Add style preset if user has one
    if (user.currentStylePreset && user.currentStylePreset !== 'casual') {
      const { getStylePrompt } = await import('../presets/prompts.js');
      const stylePrompt = getStylePrompt(user.currentStylePreset);
      prompt = `${prompt}${stylePrompt}`;
    }

    // Generate image
    const imageBuffer = await generateImage(apiKey, prompt);

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
          `✅ 완료! "${category} - ${productName}" 상세페이지 이미지가 생성되었습니다.\n\n` +
          `📊 이번 달 남은 생성 횟수: ${config.DAILY_LIMIT_PER_USER - usageLogs.length - 1}/${config.DAILY_LIMIT_PER_USER}`,
      }
    );

    // Log usage
    await addUsageLog(telegramId, {
      command: '/상세페이지',
      category,
      productName,
      apiProvider: user.encryptedApiKey ? 'user' : 'leo_shared_pool',
      year,
      month,
      day,
      timestamp: new Date().toISOString(),
    });

    logger.info(`[/상세페이지] Product page generated for user ${telegramId}: ${category} - ${productName}`);
  } catch (error) {
    logger.error('[/상세페이지] Error:', error);
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
