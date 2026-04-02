import { NextRequest, NextResponse } from 'next/server';

/**
 * 사이트의 실제 OG/메타 데이터를 가져오는 API
 * GET /api/site-meta?url=https://yahwa.faneasy.kr
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'url 파라미터 필요' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FanEasy-Bot/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();

    // 메타 태그 파싱
    const getMeta = (name: string): string => {
      // og:title, og:description, og:image 등
      const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${name}["']`, 'i'));
      if (ogMatch) return ogMatch[1];

      // name= 방식 (description, naver-site-verification 등)
      const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
      if (nameMatch) return nameMatch[1];

      return '';
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    const meta = {
      title: titleMatch?.[1]?.trim() || '',
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      description: getMeta('description'),
      naverVerification: getMeta('naver-site-verification'),
      canonical: (() => {
        const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
        return m?.[1] || '';
      })(),
    };

    return NextResponse.json({ success: true, meta });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
