// src/app/api/feed/integrated/[slug]/route.ts
// GET: 인스타그램 + 유튜브 통합 피드 (날짜순 정렬)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 통합 피드 아이템 타입
interface FeedItem {
  id: string;
  type: "instagram" | "youtube";
  thumbnail: string;
  title?: string;
  link: string;
  date: string;
}

// 메모리 캐시 (1시간)
const feedCache = new Map<string, { data: FeedItem[]; expiresAt: number }>();
const CACHE_DURATION = 60 * 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug가 필요합니다." },
        { status: 400 }
      );
    }

    // 캐시 확인
    const cached = feedCache.get(slug);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    // 사이트 설정에서 표시 토글 확인
    const settings = await prisma.site_settings.findUnique({
      where: { site_slug: slug },
    });

    const feed: FeedItem[] = [];

    // 1. 인스타그램 피드 가져오기
    if (settings?.show_instagram !== false) {
      const igConnection = await prisma.instagramConnection.findUnique({
        where: { site_slug: slug },
      });

      if (igConnection?.access_token) {
        try {
          const igRes = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${igConnection.access_token}&limit=12`
          );
          const igData = await igRes.json();

          if (igData.data) {
            for (const item of igData.data) {
              feed.push({
                id: `ig_${item.id}`,
                type: "instagram",
                thumbnail: item.media_type === "VIDEO"
                  ? item.thumbnail_url || item.media_url
                  : item.media_url,
                title: item.caption?.substring(0, 100),
                link: item.permalink,
                date: item.timestamp,
              });
            }
          }
        } catch (e) {
          console.warn("인스타그램 피드 조회 실패:", e);
        }
      }
    }

    // 2. 유튜브 피드 가져오기
    if (settings?.show_youtube !== false && YOUTUBE_API_KEY) {
      const ytConnection = await prisma.youTubeConnection.findUnique({
        where: { site_slug: slug },
      });

      if (ytConnection?.channel_id && ytConnection.is_active) {
        try {
          const ytRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
              `part=snippet&channelId=${ytConnection.channel_id}&order=date&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
          );
          const ytData = await ytRes.json();

          if (ytData.items) {
            for (const item of ytData.items) {
              feed.push({
                id: `yt_${item.id.videoId}`,
                type: "youtube",
                thumbnail:
                  item.snippet.thumbnails?.high?.url ||
                  item.snippet.thumbnails?.default?.url,
                title: item.snippet.title,
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                date: item.snippet.publishedAt,
              });
            }
          }
        } catch (e) {
          console.warn("유튜브 피드 조회 실패:", e);
        }
      }
    }

    // 3. 날짜순 정렬 (최신순)
    feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 고정 피드 처리 (pinned_feed_id)
    if (settings?.pinned_feed_id) {
      const pinnedIdx = feed.findIndex((f) => f.id === settings.pinned_feed_id);
      if (pinnedIdx > 0) {
        const [pinned] = feed.splice(pinnedIdx, 1);
        feed.unshift(pinned);
      }
    }

    // 캐시 저장
    feedCache.set(slug, {
      data: feed,
      expiresAt: Date.now() + CACHE_DURATION,
    });

    return NextResponse.json({
      success: true,
      data: feed,
      total: feed.length,
      cached: false,
    });
  } catch (error: any) {
    console.error("통합 피드 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "피드 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
