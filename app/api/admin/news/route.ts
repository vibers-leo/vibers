import type { NextRequest } from 'next/server';
import { newsStore } from '@/lib/news-store';
import type { FeedItem } from '@/lib/feed-data';

function isAuthorized(req: NextRequest) {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-vibers-secret') === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ items: newsStore.list() });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as FeedItem;
    if (!body.id || !body.title) {
      return Response.json({ error: 'id, title required' }, { status: 400 });
    }
    const item = newsStore.create(body);
    return Response.json({ ok: true, item }, { status: 201 });
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
