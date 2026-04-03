import { NextResponse } from 'next/server';
import { fetchProjectHealth, VIBERS_PROJECTS } from '@/lib/admin/projects';

export async function GET() {
  try {
    // 병렬로 모든 프로젝트의 헬스체크 상태 수집
    const healthPromises = VIBERS_PROJECTS.map(project => fetchProjectHealth(project.slug));
    const results = await Promise.all(healthPromises);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      projects: results,
      summary: {
        total: results.length,
        healthy: results.filter(r => r.status === 'healthy').length,
        warning: results.filter(r => r.status === 'warning').length,
        error: results.filter(r => r.status === 'error').length,
        offline: results.filter(r => r.status === 'offline').length,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch overall health status' }, { status: 500 });
  }
}
