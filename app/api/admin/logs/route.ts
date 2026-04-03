import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 시스템 로그나 DB 로그를 조회하는 로직
  return NextResponse.json([
    { id: 'v1', title: '새로운 CTO 서비스 문의 접수', time: '방금 전', type: 'info' },
    { id: 'v2', title: '관리자 페이지 가입 승인 대기', time: '15분 전', type: 'warning' },
    { id: 'v3', title: 'GitHub Action 빌드 성공 (vibers-main)', time: '1시간 전', type: 'info' },
  ]);
}
