import { logger } from '../utils/logger.js';

export async function handleHelp(ctx) {
  const helpText =
    `🤖 나노바나나 이미지 생성 봇 - 명령어 가이드\n\n` +
    `📖 기본 명령어:\n` +
    `• /시작 - 봇 시작 및 사용법 안내\n` +
    `• /도움말 - 이 메시지 표시\n` +
    `• /키확인 - 등록된 API 키 상태 확인\n\n` +
    `🎨 이미지 생성:\n` +
    `• /생성 [프롬프트] - 자유로운 프롬프트로 이미지 생성\n` +
    `예: /생성 현대적인 카페 인테리어\n\n` +
    `• /상세페이지 [카테고리] [상품명] - 쇼핑몰 상품 상세페이지 이미지\n` +
    `예: /상세페이지 의류 청바지\n\n` +
    `가능한 카테고리: 의류, 식품, 전자제품, 뷰티, 생활용품\n\n` +
    `⚙️ 설정:\n` +
    `• /키등록 [API_KEY] - Gemini API 키 등록\n` +
    `• /스타일 [프리셋] - 이미지 스타일 변경\n` +
    `  - minimalist (미니멀)\n` +
    `  - luxury (럭셔리)\n` +
    `  - casual (캐주얼)\n` +
    `  - natural (내추럴)\n\n` +
    `📊 통계:\n` +
    `• /사용량 - 현재 달 API 사용량 확인\n\n` +
    `🆓 무료 체험:\n` +
    `신규 사용자는 무료로 5장까지 생성할 수 있습니다.\n` +
    `그 이후로는 자신의 API 키를 등록해주세요.\n\n` +
    `❓ 도움이 필요하신가요?\n` +
    `관리자에게 문의해주세요.`;

  try {
    await ctx.reply(helpText);
    logger.info(`[/도움말] Help displayed to user ${ctx.from.id}`);
  } catch (error) {
    logger.error('[/도움말] Error:', error);
    await ctx.reply('❌ 오류가 발생했습니다.');
  }
}
