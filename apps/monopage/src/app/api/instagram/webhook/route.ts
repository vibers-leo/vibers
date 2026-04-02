import { NextResponse } from "next/server";

/**
 * 인스타그램 Webhook 엔드포인트 — 새 게시물 감지 및 자동 알람 로직
 * 페이스북 개발자 센터 > 앱 설정 > Webhooks 에 이 URL을 등록하면 실시간 감지가 가능합니다.
 */
export async function GET(request: Request) {
  // Webhook 검증 (Hub Challenge)
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
      return new Response(challenge);
    }
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const body = await request.json();

  // 여기에 알람 로직 구현 (예: 알림톡, 슬랙, 이메일 등)
  console.log("Instagram Webhook Received:", JSON.stringify(body, null, 2));

  // 새 게시물인 경우 revalidate 처리하여 실시간 업데이트 반영
  // TODO: site_slug 매핑 로직 추가 필요

  return NextResponse.json({ received: true });
}
