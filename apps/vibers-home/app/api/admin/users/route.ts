import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: '이준호 (CEO)', email: 'ceo@vibers.co.kr', role: 'owner', status: '활성', createdAt: '2026-01-01' },
    { id: 2, name: '김정원 (CTO)', email: 'cto@vibers.co.kr', role: 'admin', status: '활성', createdAt: '2026-01-05' },
    { id: 3, name: '운영자A', email: 'op@vibers.co.kr', role: 'operator', status: '활성', createdAt: '2026-03-20' },
  ]);
}
