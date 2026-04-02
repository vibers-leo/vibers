// src/app/api/youtube/connect/route.ts
// POST: 유튜브 채널 연동 등록
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { site_slug, channel_id } = body;

    if (!site_slug || !channel_id) {
      return NextResponse.json(
        { success: false, error: "site_slug와 channel_id가 필요합니다." },
        { status: 400 }
      );
    }

    // 유튜브 채널 정보 조회
    let channelTitle = null;
    let thumbnailUrl = null;

    if (YOUTUBE_API_KEY) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channel_id}&key=${YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items?.[0]) {
          channelTitle = data.items[0].snippet.title;
          thumbnailUrl = data.items[0].snippet.thumbnails?.default?.url;
        }
      } catch (e) {
        console.warn("유튜브 채널 정보 조회 실패 (연동은 계속 진행):", e);
      }
    }

    const connection = await prisma.youTubeConnection.upsert({
      where: { site_slug },
      update: {
        channel_id,
        channel_title: channelTitle,
        thumbnail_url: thumbnailUrl,
        is_active: true,
        last_synced: new Date(),
      },
      create: {
        site_slug,
        channel_id,
        channel_title: channelTitle,
        thumbnail_url: thumbnailUrl,
        is_active: true,
        last_synced: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: connection,
      message: channelTitle
        ? `"${channelTitle}" 채널이 연동되었습니다.`
        : "유튜브 채널이 연동되었습니다.",
    });
  } catch (error: any) {
    console.error("유튜브 연동 오류:", error);
    return NextResponse.json(
      { success: false, error: "유튜브 연동에 실패했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 유튜브 연동 해제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug가 필요합니다." },
        { status: 400 }
      );
    }

    await prisma.youTubeConnection.delete({
      where: { site_slug: slug },
    });

    return NextResponse.json({
      success: true,
      message: "유튜브 연동이 해제되었습니다.",
    });
  } catch (error: any) {
    console.error("유튜브 연동 해제 오류:", error);
    return NextResponse.json(
      { success: false, error: "유튜브 연동 해제에 실패했습니다." },
      { status: 500 }
    );
  }
}
