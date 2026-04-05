import { NextResponse } from 'next/server';

// 아이콘 URL을 in-memory로 관리 (SEO 데이터와 동일한 패턴)
let iconData: {
  favicon?: string;        // 32×32 브라우저 탭용
  appleTouchIcon?: string; // 180×180 iOS 홈화면
  androidIcon192?: string; // 192×192 안드로이드
  androidIcon512?: string; // 512×512 PWA / 플레이스토어
  ogImage?: string;        // 1200×630 SNS 공유
} = {};

export async function GET() {
  return NextResponse.json(iconData);
}

export async function POST(req: Request) {
  const data = await req.json();
  iconData = { ...iconData, ...data };
  return NextResponse.json({ success: true, data: iconData });
}
