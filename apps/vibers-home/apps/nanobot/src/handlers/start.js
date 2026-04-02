import { getOrCreateUser } from '../services/storage.js';
import { logger } from '../utils/logger.js';

export async function handleStart(ctx) {
  const telegramId = ctx.from.id.toString();

  try {
    // Create or get user
    const user = await getOrCreateUser(telegramId, {
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
    });

    const welcomeText =
      `🤖 안녕하세요! 나노바나나 이미지 생성 봇입니다.\n\n` +
      `이 봇은 Gemini AI를 이용해 쇼핑몰 상세페이지, SNS 콘텐츠 등의 이미지를\n` +
      `자동으로 생성해줍니다.\n\n` +
      `📋 사용 방법:\n` +
      `1️⃣ /키등록 [API_KEY] - 자신의 Gemini API 키 등록\n` +
      `2️⃣ /생성 [프롬프트] - 자유로운 이미지 생성\n` +
      `3️⃣ /상세페이지 [카테고리] [상품명] - 쇼핑몰 상세페이지 이미지\n` +
      `4️⃣ /도움말 - 전체 명령어 확인\n\n` +
      `💡 API 키 없이도 무료로 ${user.freeCreditsRemaining}장까지 생성 가능합니다!\n\n` +
      `시작할까요? /도움말 을 입력해보세요.`;

    await ctx.reply(welcomeText);

    logger.info(`[/시작] User registered: ${telegramId}`);
  } catch (error) {
    logger.error('[/시작] Error:', error);
    await ctx.reply('❌ 오류가 발생했습니다. 다시 시도해주세요.');
  }
}
