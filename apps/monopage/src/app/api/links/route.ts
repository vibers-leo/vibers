// src/app/api/links/route.ts
// CRUD: 프로필 링크 관리
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: 특정 사이트의 프로필 링크 목록
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

    const links = await prisma.profileLink.findMany({
      where: { site_slug: slug, is_active: true },
      orderBy: { sort_order: "asc" },
    });

    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("프로필 링크 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "링크 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST: 프로필 링크 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { site_slug, title, url, icon } = body;

    if (!site_slug || !title || !url) {
      return NextResponse.json(
        { success: false, error: "site_slug, title, url이 필요합니다." },
        { status: 400 }
      );
    }

    // 현재 최대 sort_order 조회
    const maxOrder = await prisma.profileLink.aggregate({
      where: { site_slug },
      _max: { sort_order: true },
    });

    const link = await prisma.profileLink.create({
      data: {
        site_slug,
        title,
        url,
        icon: icon || null,
        sort_order: (maxOrder._max.sort_order ?? 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error: any) {
    console.error("프로필 링크 추가 오류:", error);
    return NextResponse.json(
      { success: false, error: "링크 추가에 실패했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 프로필 링크 수정 (개별 또는 순서 일괄 업데이트)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 순서 일괄 업데이트
    if (body.reorder && Array.isArray(body.items)) {
      const updates = body.items.map((item: { id: string; sort_order: number }) =>
        prisma.profileLink.update({
          where: { id: item.id },
          data: { sort_order: item.sort_order },
        })
      );
      await Promise.all(updates);
      return NextResponse.json({ success: true, message: "순서가 업데이트되었습니다." });
    }

    // 개별 수정
    const { id, title, url, icon, is_active } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "id가 필요합니다." },
        { status: 400 }
      );
    }

    const link = await prisma.profileLink.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error: any) {
    console.error("프로필 링크 수정 오류:", error);
    return NextResponse.json(
      { success: false, error: "링크 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 프로필 링크 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id가 필요합니다." },
        { status: 400 }
      );
    }

    await prisma.profileLink.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "링크가 삭제되었습니다." });
  } catch (error: any) {
    console.error("프로필 링크 삭제 오류:", error);
    return NextResponse.json(
      { success: false, error: "링크 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
