// src/app/api/payment/artwork/route.ts
// POST: 작품 구매 요청 처리 — 자율 수수료 모델 (monopage.kr)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PG 결제 수수료 (토스페이먼츠 기준)
const PG_FEE_RATE = 0.033;
// 기본 플랫폼 쉐어 비율 (ValueSettings 없을 때)
const DEFAULT_SHARE_RATIO = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artwork_id, site_slug, buyer_email, buyer_name } = body;

    if (!artwork_id || !site_slug || !buyer_email) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 작품 조회
    const artwork = await prisma.artwork.findUnique({
      where: { id: artwork_id },
    });

    if (!artwork) {
      return NextResponse.json(
        { success: false, error: "작품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (artwork.is_sold) {
      return NextResponse.json(
        { success: false, error: "이미 판매된 작품입니다." },
        { status: 400 }
      );
    }

    // 아티스트의 자율 수수료 설정 조회
    const valueSettings = await prisma.valueSettings.findUnique({
      where: { site_slug },
    });
    const shareRatio = valueSettings?.revenue_share_ratio ?? DEFAULT_SHARE_RATIO;

    // 수익 분배 계산
    // 1. PG 수수료 (결제 원가)
    const commission = Math.floor(artwork.price * PG_FEE_RATE);
    // 2. 순수익에서 플랫폼 쉐어 (아티스트가 설정한 비율)
    const netAmount = artwork.price - commission;
    const platformShare = Math.floor(netAmount * (shareRatio / 100));
    // 3. 아티스트 최종 정산
    const artist_payout = netAmount - platformShare;

    // 거래 생성 (pending 상태)
    const transaction = await prisma.artTransaction.create({
      data: {
        artwork_id: artwork.id,
        site_slug,
        buyer_email,
        buyer_name: buyer_name || null,
        amount: artwork.price,
        commission,
        platform_share: platformShare,
        artist_payout,
        share_ratio: shareRatio,
        status: "pending",
      },
    });

    // TODO: 토스페이먼츠 결제 연동
    // PortOne/토스 연동 시 payment_id를 함께 반환

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: transaction.id,
        amount: artwork.price,
        breakdown: {
          total: artwork.price,
          pg_fee: commission,
          platform_share: platformShare,
          artist_payout,
          share_ratio: shareRatio,
        },
      },
    });
  } catch (error: any) {
    console.error("작품 결제 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
