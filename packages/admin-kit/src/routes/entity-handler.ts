import type { App } from 'firebase-admin/app';
import { queryInquiries, queryUsers, queryOrders, queryStats } from '../firebase/queries';

function isAuthorized(req: Request): boolean {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get('x-vibers-secret');
  return header === secret;
}

export function createEntityHandler(getApp: () => App) {
  return async function GET(
    req: Request,
    { params }: { params: Promise<{ entity: string }> }
  ): Promise<Response> {
    if (!isAuthorized(req)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entity } = await params;
    const app = getApp();

    try {
      switch (entity) {
        case 'inquiries':
          return Response.json(await queryInquiries(app));
        case 'users':
          return Response.json(await queryUsers(app));
        case 'orders':
          return Response.json(await queryOrders(app));
        case 'stats':
          return Response.json(await queryStats(app));
        default:
          return Response.json({ error: `Unknown entity: ${entity}` }, { status: 400 });
      }
    } catch (e: any) {
      return Response.json({ error: e?.message ?? 'Internal error' }, { status: 500 });
    }
  };
}
