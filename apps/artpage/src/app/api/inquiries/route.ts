// 문의 상태 업데이트 API (Prisma → 자체 PostgreSQL)
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// PATCH: 문의 상태 변경
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "id와 status는 필수입니다." },
        { status: 400 }
      );
    }

    const validStatuses = ["new", "read", "done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태값입니다." },
        { status: 400 }
      );
    }

    await prisma.inquiries.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("문의 상태 업데이트 실패:", error);
    return NextResponse.json(
      { error: error.message || "서버 오류" },
      { status: 500 }
    );
  }
}
