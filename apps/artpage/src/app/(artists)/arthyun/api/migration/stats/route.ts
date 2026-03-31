// [DEPRECATED] 이전 마이그레이션 라우트 — 자체 PostgreSQL로 이전 완료
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "이 마이그레이션 라우트는 더 이상 사용되지 않습니다. DB는 자체 PostgreSQL(Prisma)로 이전 완료.",
  });
}
