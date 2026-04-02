// src/app/api/settings/value/route.ts
// GET/POST: 자율 수수료/구독료 설정 — The Value Setting
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: 특정 아티스트의 가치 설정 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug가 필요합니다." },
        { status: 400 }
      );
    }

    const settings = await prisma.valueSettings.findUnique({
      where: { site_slug: slug },
    });

    // 설정이 없으면 기본값 반환
    return NextResponse.json({
      success: true,
      data: settings ?? {
        site_slug: slug,
        subscription_fee: 0,
        revenue_share_ratio: 10,
      },
    });
  } catch (error: any) {
    console.error("가치 설정 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "설정 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST: 자율 수수료/구독료 업데이트 (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { site_slug, subscription_fee, revenue_share_ratio } = body;

    if (!site_slug) {
      return NextResponse.json(
        { success: false, error: "site_slug가 필요합니다." },
        { status: 400 }
      );
    }

    // 비율 유효성 검증 (0~100)
    const ratio = Math.min(100, Math.max(0, Number(revenue_share_ratio) || 10));
    const fee = Math.max(0, Number(subscription_fee) || 0);

    const settings = await prisma.valueSettings.upsert({
      where: { site_slug },
      update: {
        subscription_fee: fee,
        revenue_share_ratio: ratio,
      },
      create: {
        site_slug,
        subscription_fee: fee,
        revenue_share_ratio: ratio,
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
      message: `수수료 비율 ${ratio}%, 월 구독료 ${fee.toLocaleString()}원으로 설정되었습니다.`,
    });
  } catch (error: any) {
    console.error("가치 설정 업데이트 오류:", error);
    return NextResponse.json(
      { success: false, error: "설정 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
