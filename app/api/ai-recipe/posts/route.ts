import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분 캐시

export async function GET() {
  try {
    const { rows } = await query(
      `SELECT id, source_id, title, description, category, tags, image_url, synced_at
       FROM vibers.ai_recipe_posts
       ORDER BY synced_at DESC
       LIMIT 12`,
    );
    return NextResponse.json({ posts: rows });
  } catch (e) {
    console.error('[ai-recipe/posts]', e);
    return NextResponse.json({ posts: [] });
  }
}
