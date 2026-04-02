// Instagram 동기화 크론 — 연결된 계정의 최신 게시물을 포트폴리오에 저장
// 매일 1회 실행 (Vercel Cron 또는 외부 스케줄러)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserMedia, refreshToken } from "@/lib/instagram";

// 크론 시크릿 검증
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // 시크릿 검증 (선택적)
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 모든 Instagram 연결 가져오기
    const connections = await prisma.instagramConnection.findMany();
    const results: { slug: string; synced: number; error?: string }[] = [];

    for (const conn of connections) {
      try {
        // 토큰 만료 7일 전이면 갱신
        const daysUntilExpiry = (conn.token_expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        let currentToken = conn.access_token;

        if (daysUntilExpiry < 7) {
          const refreshed = await refreshToken(conn.access_token);
          if (refreshed) {
            currentToken = refreshed.access_token;
            await prisma.instagramConnection.update({
              where: { id: conn.id },
              data: {
                access_token: refreshed.access_token,
                token_expires: new Date(Date.now() + refreshed.expires_in * 1000),
              },
            });
          }
        }

        // 최신 게시물 가져오기
        const media = await getUserMedia(currentToken, 20);
        if (!media) {
          results.push({ slug: conn.site_slug, synced: 0, error: "미디어 조회 실패" });
          continue;
        }

        // 이미지만 필터링 후 포트폴리오에 저장
        let syncedCount = 0;
        for (const item of media) {
          if (item.media_type !== "IMAGE" && item.media_type !== "CAROUSEL_ALBUM") continue;

          // 중복 확인 (같은 이미지 URL이 이미 있으면 스킵)
          const existing = await prisma.portfolio.findFirst({
            where: {
              site_slug: conn.site_slug,
              image_url: item.media_url,
            },
          });

          if (existing) continue;

          // 포트폴리오에 추가
          await prisma.portfolio.create({
            data: {
              site_slug: conn.site_slug,
              title: item.caption?.substring(0, 100) || "Instagram",
              description: item.caption || "",
              image_url: item.media_url,
              category: "instagram",
            },
          });
          syncedCount++;
        }

        // 마지막 동기화 시간 업데이트
        await prisma.instagramConnection.update({
          where: { id: conn.id },
          data: { last_synced: new Date() },
        });

        results.push({ slug: conn.site_slug, synced: syncedCount });
      } catch (err) {
        console.error(`Sync error for ${conn.site_slug}:`, err);
        results.push({ slug: conn.site_slug, synced: 0, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      total_connections: connections.length,
      results,
      synced_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Instagram sync cron error:", error);
    return NextResponse.json({ error: "동기화 실패" }, { status: 500 });
  }
}
