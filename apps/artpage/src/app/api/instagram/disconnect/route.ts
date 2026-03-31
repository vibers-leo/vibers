// Instagram 연결 해제
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { site_slug } = await request.json();

    if (!site_slug) {
      return NextResponse.json({ error: "site_slug 필수" }, { status: 400 });
    }

    await prisma.instagramConnection.delete({
      where: { site_slug },
    }).catch(() => {
      // 이미 없으면 무시
    });

    return NextResponse.json({ success: true, message: "인스타그램 연결이 해제되었습니다." });
  } catch (error) {
    console.error("Instagram disconnect error:", error);
    return NextResponse.json({ error: "연결 해제 실패" }, { status: 500 });
  }
}
