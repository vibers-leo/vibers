// src/app/api/payment/artwork/verify/route.ts
// POST: PortOne 결제 검증 콜백
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction_id, payment_id, status } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { success: false, error: "거래 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 거래 조회
    const transaction = await prisma.artTransaction.findUnique({
      where: { id: transaction_id },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "거래를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // TODO: PortOne API로 실제 결제 검증
    // const verified = await verifyPortOnePayment(payment_id, transaction.amount);

    if (status === "paid") {
      // 거래 상태 업데이트
      await prisma.artTransaction.update({
        where: { id: transaction_id },
        data: {
          status: "paid",
          payment_id: payment_id || null,
          paid_at: new Date(),
        },
      });

      // 작품 판매완료 처리
      await prisma.artwork.update({
        where: { id: transaction.artwork_id },
        data: {
          is_sold: true,
          buyer_email: transaction.buyer_email,
        },
      });

      return NextResponse.json({
        success: true,
        message: "결제가 확인되었습니다.",
      });
    } else {
      // 결제 실패
      await prisma.artTransaction.update({
        where: { id: transaction_id },
        data: {
          status: "failed",
          payment_id: payment_id || null,
        },
      });

      return NextResponse.json({
        success: false,
        error: "결제가 실패했습니다.",
      });
    }
  } catch (error: any) {
    console.error("결제 검증 API 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
