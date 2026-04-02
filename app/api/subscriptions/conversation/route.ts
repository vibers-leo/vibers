/**
 * 대화식 구독 추가 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseUserMessage } from '@/lib/subscription/conversation-parser';

export async function POST(req: NextRequest) {
  try {
    const { userMessage } = (await req.json()) as {
      userMessage: string;
    };

    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json({
        error: '메시지를 입력해주세요',
      }, { status: 400 });
    }

    // AI 파싱
    const response = await parseUserMessage(userMessage);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error('[Conversation API] Error:', error);
    return NextResponse.json(
      { error: '대화 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
