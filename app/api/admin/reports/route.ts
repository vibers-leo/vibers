/**
 * vibers.co.kr/api/admin/reports
 * 각 프로젝트에서 @vibers/admin-kit이 보내는 리포트를 수신/저장한다.
 */

import type { ProjectReport } from '@vibers/admin-kit';

// 인메모리 저장 (추후 Firebase Firestore로 교체)
const reports = new Map<string, ProjectReport & { receivedAt: string }>();

function isAuthorized(req: Request): boolean {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-vibers-secret') === secret;
}

/** GET — 수신된 모든 프로젝트 리포트 목록 반환 */
export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const list = Array.from(reports.values()).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  return Response.json({ count: list.length, reports: list });
}

/** POST — 프로젝트 리포트 수신 */
export async function POST(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const report = (await req.json()) as ProjectReport;
    if (!report.projectName) {
      return Response.json({ error: 'projectName required' }, { status: 400 });
    }

    reports.set(report.projectName, {
      ...report,
      receivedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true, project: report.projectName });
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
