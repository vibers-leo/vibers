import { NextResponse } from 'next/server';

let seoData = {
  title: "계발자들(Vibers) - 당신의 CTO 파트너",
  description: "IT 기술 전략부터 개발, 배포까지 한 번에 해결하는 계발자들입니다."
};

export async function GET() {
  return NextResponse.json(seoData);
}

export async function POST(req: Request) {
  const data = await req.json();
  seoData = { ...seoData, ...data };
  return NextResponse.json({ success: true, data: seoData });
}
