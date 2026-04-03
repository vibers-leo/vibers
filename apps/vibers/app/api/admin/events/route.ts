import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM project_events ORDER BY created_at DESC LIMIT 20');
    
    const logs = result.rows.map((row: any) => ({
      id: row.id.toString(),
      title: `[${row.project_slug}] ${row.event_type}`,
      time: formatRelativeTime(new Date(row.created_at)),
      type: row.event_type.includes('ERROR') ? 'error' : 
            row.event_type.includes('WARN') ? 'warning' : 'info'
    }));

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Events API Error:", error);
    // 테이블이 없거나 조회 실패 시 빈 리스트 반환하여 무한 로딩 방지
    return NextResponse.json({ success: true, data: [] });
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  
  return date.toLocaleDateString();
}
