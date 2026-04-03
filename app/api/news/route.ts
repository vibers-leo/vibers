/**
 * /api/news — 공개 소식 피드
 * 어드민에서 추가한 아이템 + 정적 seed 데이터를 합쳐 반환
 */
import { newsStore } from '@/lib/news-store';

export async function GET() {
  const items = newsStore.list();
  return Response.json(
    { items },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
  );
}
