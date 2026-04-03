import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'build-1',
      platform: 'ios',
      version: '1.0.5',
      status: 'success',
      deployedAt: '2026-03-28T10:00:00Z'
    },
    {
      id: 'build-2',
      platform: 'android',
      version: '1.0.5',
      status: 'running',
      deployedAt: '2026-03-29T14:30:00Z'
    }
  ]);
}
