import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 DB나 GA 등에서 데이터를 가져오는 로직이 들어갈 자리
  // 현재는 애플리케이션 상태를 반영한 실시간 응답 모사
  return NextResponse.json({
    trend: [
      { name: '1일', 방문자: 4200, 페이지뷰: 12000 },
      { name: '10일', 방문자: 5100, 페이지뷰: 15400 },
      { name: '20일', 방문자: 3900, 페이지뷰: 11200 },
      { name: '30일', 방문자: 6200, 페이지뷰: 18900 },
    ],
    summary: {
      mau: "15,420",
      pv: "62,840",
      bounceRate: "38.5%",
      revenue: "₩ 8.2M"
    }
  });
}
