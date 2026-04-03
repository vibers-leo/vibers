/**
 * @vibers/admin-kit — 상태 리포터
 * 프로젝트 상태를 vibers.co.kr/admin으로 주기적으로 보고한다.
 */

import { detectStack, type StackInfo } from './detector';

export interface ProjectReport {
  projectName: string;
  reportedAt: string;
  status: 'healthy' | 'warning' | 'error';
  stack: StackInfo;
  uptime: number;         // process.uptime()
  memoryMB: number;
  env: 'production' | 'preview' | 'development';
  deploymentUrl: string | null;
  version: string | null;
}

/** 현재 프로젝트 상태 수집 */
export function collectReport(): ProjectReport {
  const stack = detectStack();
  const mem = process.memoryUsage();

  const env = process.env.VERCEL_ENV === 'production'
    ? 'production'
    : process.env.VERCEL_ENV === 'preview'
    ? 'preview'
    : 'development';

  // 경고/오류 판단
  const memMB = Math.round(mem.heapUsed / 1024 / 1024);
  const status: ProjectReport['status'] =
    memMB > 400 ? 'warning' : 'healthy';

  return {
    projectName: stack.projectName,
    reportedAt: new Date().toISOString(),
    status,
    stack,
    uptime: Math.round(process.uptime()),
    memoryMB: memMB,
    env,
    deploymentUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    version: process.env.npm_package_version ?? null,
  };
}

/** vibers 중앙 어드민으로 리포트 전송 */
export async function pushReport(
  adminUrl: string = 'https://vibers.co.kr/api/admin/reports',
  secret: string = process.env.VIBERS_ADMIN_SECRET ?? ''
): Promise<boolean> {
  if (!secret) return false;

  try {
    const report = collectReport();
    const res = await fetch(adminUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vibers-secret': secret,
      },
      body: JSON.stringify(report),
    });
    return res.ok;
  } catch {
    return false;
  }
}
