import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'g1',
      name: '관리자',
      description: '시스템 전체 관리 권한을 가진 그룹',
      memberCount: 3,
      isDefault: false,
      status: 'active'
    },
    {
      id: 'g2',
      name: '일반회원',
      description: '가입 시 기본으로 부여되는 그룹',
      memberCount: 1250,
      isDefault: true,
      status: 'active'
    },
    {
      id: 'g3',
      name: '우수회원',
      description: '누적 구매액 100만원 이상 회원',
      memberCount: 85,
      isDefault: false,
      status: 'active'
    }
  ]);
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log("Updating Group:", data);
  return NextResponse.json({ success: true });
}
