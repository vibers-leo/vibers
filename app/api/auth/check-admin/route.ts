import { NextResponse } from 'next/server';

/**
 * 서버사이드 관리자 확인 API
 *
 * ADMIN_EMAILS 환경변수(NEXT_PUBLIC_ 아님)를 사용하여
 * 브라우저에 관리자 이메일 목록이 노출되지 않도록 합니다.
 *
 * 환경변수 설정: ADMIN_EMAILS=admin1@example.com,admin2@example.com
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ isAdmin: false }, { status: 400 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    const isAdmin = adminEmails.includes(email);

    return NextResponse.json({ isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
