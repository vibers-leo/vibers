import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // 1. 보안 검증 (API Key)
    const apiKey = req.headers.get('x-vibers-apikey');
    const adminKey = process.env.NEXT_PUBLIC_VIBERS_ADMIN_KEY || 'vibers-internal-key';

    if (apiKey !== adminKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { project, type, data, timestamp } = body;

    if (!project || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 2. DB에 이벤트 저장 (Vibers Admin 전용 로그 테이블)
    // 테이블이 없을 경우를 대비해 초기화 쿼리 포함 (실제 운영 시에는 별도 마이그레이션 권장)
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS project_events (
          id SERIAL PRIMARY KEY,
          project_slug TEXT NOT NULL,
          event_type TEXT NOT NULL,
          event_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(
        'INSERT INTO project_events (project_slug, event_type, event_data, created_at) VALUES ($1, $2, $3, $4)',
        [project, type, JSON.stringify(data), timestamp || new Date().toISOString()]
      );

      // 3. (옵션) 프로젝트 메타데이터 업데이트 (최근 활동 시간 등)
      await query(
        'UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE slug = $1',
        [project]
      );
    } catch (dbError) {
      console.error("Failed to save event to DB:", dbError);
      // DB 저장 실패 시에도 일단 성공 응답을 보낼 수 있으나(큐잉), 여기서는 에러 반환
      return NextResponse.json({ success: false, error: 'Database save failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Event reported successfully' });
  } catch (error) {
    console.error("Report processing error:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
