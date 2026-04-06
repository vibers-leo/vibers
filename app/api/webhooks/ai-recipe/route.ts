import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  // 시크릿 검증
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { event, data } = await req.json();

    if (event === 'upsert') {
      await query(
        `INSERT INTO vibers.ai_recipe_posts
           (source_id, title, description, category, tags, image_url, content, synced_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (source_id) DO UPDATE SET
           title      = EXCLUDED.title,
           description = EXCLUDED.description,
           category   = EXCLUDED.category,
           tags       = EXCLUDED.tags,
           image_url  = EXCLUDED.image_url,
           content    = EXCLUDED.content,
           synced_at  = NOW(),
           updated_at = NOW()`,
        [
          data.id,
          data.title,
          data.description ?? null,
          data.category ?? null,
          data.tags ?? null,
          data.image_url ?? null,
          data,
        ]
      );
    } else if (event === 'delete') {
      await query(
        `DELETE FROM vibers.ai_recipe_posts WHERE source_id = $1`,
        [data.id]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[webhooks/ai-recipe] error:', e);
    return NextResponse.json({ error: '처리 실패' }, { status: 500 });
  }
}
