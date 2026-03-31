// src/app/api/stats/global/route.ts
// GET: 전체 실험 통계 — Live Stats (The Experiment)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. 전체 참여 아티스트 수 (활성 사이트 수)
    const totalArtists = await prisma.site_settings.count({
      where: { is_active: true },
    });

    // 2. 평균 자율 수수료율
    const avgShareResult = await prisma.valueSettings.aggregate({
      _avg: { revenue_share_ratio: true },
    });
    const avgShareRatio = Math.round(avgShareResult._avg.revenue_share_ratio ?? 10);

    // 3. 평균 자율 구독료
    const avgSubResult = await prisma.valueSettings.aggregate({
      _avg: { subscription_fee: true },
    });
    const avgSubscriptionFee = Math.round(avgSubResult._avg.subscription_fee ?? 0);

    // 4. 누적 후원금 (completed)
    const totalSupportResult = await prisma.support.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });
    const totalSupportAmount = totalSupportResult._sum.amount ?? 0;

    // 5. 누적 작품 판매액
    const totalSalesResult = await prisma.artTransaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });
    const totalSalesAmount = totalSalesResult._sum.amount ?? 0;

    // 6. 아티스트에게 돌아간 총액
    const totalArtistPayout = await prisma.support.aggregate({
      where: { status: "completed" },
      _sum: { artist_amount: true },
    });
    const totalPayoutAmount = (totalArtistPayout._sum.artist_amount ?? 0)
      + ((await prisma.artTransaction.aggregate({
        where: { status: "completed" },
        _sum: { artist_payout: true },
      }))._sum.artist_payout ?? 0);

    return NextResponse.json({
      success: true,
      data: {
        total_artists: totalArtists,
        avg_share_ratio: avgShareRatio,
        avg_subscription_fee: avgSubscriptionFee,
        total_support_amount: totalSupportAmount,
        total_sales_amount: totalSalesAmount,
        total_artist_payout: totalPayoutAmount,
        total_circulation: totalSupportAmount + totalSalesAmount,
      },
    });
  } catch (error: any) {
    console.error("전체 통계 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "통계 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
