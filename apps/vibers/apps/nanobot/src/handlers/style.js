import { getOrCreateUser, updateUser } from '../services/storage.js';
import { STYLE_PRESETS } from '../presets/prompts.js';
import { logger } from '../utils/logger.js';

export async function handleStyle(ctx) {
  const telegramId = ctx.from.id.toString();
  const args = ctx.message.text.split(' ').slice(1);

  try {
    if (args.length === 0) {
      // Show available styles
      const styleList = Object.entries(STYLE_PRESETS)
        .map(([key, value]) => `${value.emoji} ${value.label} - ${value.description}`)
        .join('\n');

      await ctx.reply(
        `사용 가능한 스타일:\n\n${styleList}\n\n` +
        `사용법: /스타일 [프리셋명]\n` +
        `예: /스타일 luxury`
      );
      return;
    }

    const preset = args[0];
    if (!STYLE_PRESETS[preset]) {
      await ctx.reply(
        '❌ 없는 스타일입니다.\n\n' +
        '/스타일 을 입력해 사용 가능한 스타일을 확인하세요.'
      );
      return;
    }

    // Update user style preset
    let user = await getOrCreateUser(telegramId);
    user.currentStylePreset = preset;
    user.updatedAt = new Date().toISOString();
    await updateUser(telegramId, user);

    const styleInfo = STYLE_PRESETS[preset];
    await ctx.reply(
      `✅ 스타일이 "${styleInfo.label}" 로 변경되었습니다.\n\n` +
      `이제 생성하는 모든 이미지가 ${styleInfo.label} 스타일로 적용됩니다.\n\n` +
      `현재 스타일: ${styleInfo.emoji} ${styleInfo.label}\n` +
      `설명: ${styleInfo.description}\n\n` +
      `다시 변경하려면: /스타일 [프리셋명]`
    );

    logger.info(`[/스타일] Style changed for user ${telegramId}: ${preset}`);
  } catch (error) {
    logger.error('[/스타일] Error:', error);
    await ctx.reply('❌ 스타일 변경 중 오류가 발생했습니다.');
  }
}
