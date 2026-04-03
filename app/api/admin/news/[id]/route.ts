import type { NextRequest } from 'next/server';
import { newsStore } from '@/lib/news-store';

function isAuthorized(req: NextRequest) {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-vibers-secret') === secret;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const patch = await req.json();
    const updated = newsStore.update(id, patch);
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ ok: true, item: updated });
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const ok = newsStore.delete(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ ok: true });
}
