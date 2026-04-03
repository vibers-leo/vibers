import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    fields: [
      { id: 'f1', label: '아이디(이메일)', type: 'email', required: true, enabled: true },
      { id: 'f2', label: '비밀번호', type: 'text', required: true, enabled: true },
      { id: 'f3', label: '이름', type: 'text', required: true, enabled: true },
      { id: 'f4', label: '휴대폰번호', type: 'phone', required: true, enabled: true },
      { id: 'f5', label: '추천인 아이디', type: 'text', required: false, enabled: false }
    ],
    useSocialLogin: true,
    useApproval: false,
    termsOfService: "Vibers 서비스 이용약관...",
    privacyPolicy: "Vibers 개인정보처리방침..."
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log("Updating Signup Settings:", data);
  return NextResponse.json({ success: true });
}
