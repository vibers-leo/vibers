import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'p1',
      title: '봄 맞이 할인 쿠폰',
      content: '전 품목 10% 할인 쿠폰 발급 중!',
      status: 'active',
      targetPages: ['/shop'],
      startDate: '2026-03-01',
      endDate: '2026-04-30'
    }
  ]);
}
