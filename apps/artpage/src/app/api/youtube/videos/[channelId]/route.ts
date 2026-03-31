// src/app/api/youtube/videos/[channelId]/route.ts
// GET: 유튜브 채널 최신 영상 목록 (1시간 캐싱)
import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 캐시 저장소 (메모리 캐싱 — 프로덕션에서는 Redis 추천)
const cache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;

    if (!channelId) {
      return NextResponse.json(
        { success: false, error: "channelId가 필요합니다." },
        { status: 400 }
      );
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "YouTube API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 캐시 확인
    const cached = cache.get(channelId);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    // 유튜브 API 호출 — 최신 영상 12개
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&channelId=${channelId}&order=date&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
    );
    const searchData = await searchRes.json();

    if (searchData.error) {
      console.error("YouTube API 에러:", searchData.error);
      return NextResponse.json(
        { success: false, error: "YouTube API 호출에 실패했습니다." },
        { status: 502 }
      );
    }

    // 통합 피드 형식으로 정규화
    const videos = (searchData.items || []).map((item: any) => ({
      id: item.id.videoId,
      type: "youtube" as const,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      date: item.snippet.publishedAt,
    }));

    // 캐시 저장
    cache.set(channelId, {
      data: videos,
      expiresAt: Date.now() + CACHE_DURATION,
    });

    return NextResponse.json({
      success: true,
      data: videos,
      cached: false,
    });
  } catch (error: any) {
    console.error("유튜브 영상 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "영상 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
