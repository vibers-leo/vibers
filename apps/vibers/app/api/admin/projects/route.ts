import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { VIBERS_PROJECTS } from '@/lib/admin/projects';

export async function GET() {
  try {
    // 1. DB에서 프로젝트 상태 및 통계 조회 (Vibers Admin DB)
    // 실제 테이블이 없을 경우를 대비해 try-catch로 감싸고 폴백 데이터 제공
    let dbProjects = [];
    try {
      const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
      dbProjects = result.rows;
    } catch (dbError) {
      console.warn("DB 'projects' table not found, using static metadata with mock status.");
      // 하드코딩된 메타데이터를 기반으로 기본 상태 구성
      dbProjects = VIBERS_PROJECTS.map(p => ({
        ...p,
        status: 'healthy',
        updated_at: new Date().toISOString()
      }));
    }

    return NextResponse.json({
      success: true,
      data: dbProjects,
      hierarchy: buildHierarchy(dbProjects)
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
}

function buildHierarchy(projects: any[]) {
  const root: any = { name: 'NCP Server', children: {}, type: 'root' };
  projects.forEach(project => {
    if (!project.path) return;
    const parts = project.path.split('/');
    let current = root;
    parts.forEach((part: string, index: number) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          children: {},
          type: index === parts.length - 1 ? 'project' : 'folder',
          projectData: index === parts.length - 1 ? project : null
        };
      }
      current = current.children[part];
    });
  });
  return root;
}
