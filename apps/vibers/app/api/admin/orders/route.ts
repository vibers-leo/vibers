import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'VB-2026-001', customerName: '이준호', amount: 500000, status: 'paid', date: '2026-03-29' },
    { id: 'VB-2026-002', customerName: '주식회사 디어스', amount: 2000000, status: 'pending', date: '2026-03-29' },
  ]);
}
