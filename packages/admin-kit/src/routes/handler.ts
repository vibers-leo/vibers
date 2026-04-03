/**
 * @vibers/admin-kit — /api/vibers-admin 핸들러
 *
 * 사용법 (Next.js App Router):
 *   // app/api/vibers-admin/route.ts
 *   export { GET, POST } from '@vibers/admin-kit/handler';
 */

import { collectReport } from '../core/reporter';
import { detectStack } from '../core/detector';

/** 요청 인증 확인 */
function isAuthorized(req: Request): boolean {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get('x-vibers-secret');
  const query = new URL(req.url).searchParams.get('secret');
  return header === secret || query === secret;
}

/** GET /api/vibers-admin — 프로젝트 상태 반환 */
export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const report = collectReport();
  return Response.json(report);
}

/** POST /api/vibers-admin — 원격 명령 수신 (vibers 중앙 어드민에서 호출) */
export async function POST(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'ping':
        return Response.json({ pong: true, ts: Date.now() });

      case 'stack':
        return Response.json(detectStack());

      case 'report':
        return Response.json(collectReport());

      default:
        return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (e) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
}
