// src/app/api/support/checkout/route.ts
// POST: 후원 결제 시작 + 수익 분배 처리
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PG 수수료율 (토스페이먼츠 기준)
const PG_FEE_RATE = 0.033;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      site_slug,
      amount,
      supporter_name,
      supporter_email,
      message,
      is_public = true,
    } = body;

    if (!site_slug || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "site_slug와 유효한 금액(amount)이 필요합니다." },
        { status: 400 }
      );
    }

    // 1. 아티스트의 가치 설정 조회
    const valueSettings = await prisma.valueSettings.findUnique({
      where: { site_slug },
    });
    const shareRatio = valueSettings?.revenue_share_ratio ?? 10;

    // 2. 수익 분배 계산
    //    총 후원금 → PG 수수료 제외 → 쉐어 비율로 분배
    const platformFee = Math.floor(amount * PG_FEE_RATE);       // PG 결제 원가
    const netAmount = amount - platformFee;                       // 순수익
    const platformShare = Math.floor(netAmount * (shareRatio / 100)); // 플랫폼 몫
    const artistAmount = netAmount - platformShare;               // 아티스트 몫

    // 3. 후원 기록 생성 (pending — 결제 확인 후 completed로 전환)
    const support = await prisma.support.create({
      data: {
        site_slug,
        supporter_name: supporter_name || null,
        supporter_email: supporter_email || null,
        amount,
        platform_fee: platformFee,
        platform_share: platformShare,
        artist_amount: artistAmount,
        message: message || null,
        is_public,
        status: "pending",
      },
    });

    // TODO: 토스페이먼츠 결제 URL 생성
    // import { requestPayment } from "@/lib/toss-bridge";
    // const paymentResult = await requestPayment({...});

    return NextResponse.json({
      success: true,
      data: {
        support_id: support.id,
        breakdown: {
          total: amount,
          pg_fee: platformFee,
          platform_share: platformShare,
          artist_amount: artistAmount,
          share_ratio: shareRatio,
        },
        // payment_url: paymentResult.url (토스 연동 시)
      },
    });
  } catch (error: any) {
    console.error("후원 결제 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "후원 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}

// GET: 특정 아티스트의 후원 방명록 조회
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

    const supports = await prisma.support.findMany({
      where: {
        site_slug: slug,
        status: "completed",
        is_public: true,
      },
      select: {
        id: true,
        supporter_name: true,
        message: true,
        amount: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: supports,
    });
  } catch (error: any) {
    console.error("후원 내역 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "후원 내역 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
