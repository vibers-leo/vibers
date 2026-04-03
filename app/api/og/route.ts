/**
 * /api/og?url=https://...
 * 외부 URL의 og:image 메타태그를 서버사이드로 추출해 반환
 * 24시간 캐싱
 */
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'url required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Vibers/1.0)' },
      next: { revalidate: 86400 }, // 24시간 캐시
    });

    const html = await res.text();

    // og:image 추출
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const imageUrl = match?.[1] ?? null;

    return Response.json(
      { imageUrl },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch {
    return Response.json({ imageUrl: null });
  }
}
