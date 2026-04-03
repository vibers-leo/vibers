'use client';

import { useEffect, useState } from 'react';
import { Activity, Database, Shield, HardDrive, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StackInfo {
  framework: string;
  frameworkVersion: string | null;
  database: { type: string; label: string; connected: boolean }[];
  auth: { type: string; provider: string[]; label: string }[];
  storage: { type: string; bucket: string | null; label: string }[];
  projectName: string;
}

interface ProjectReport {
  projectName: string;
  reportedAt: string;
  receivedAt: string;
  status: 'healthy' | 'warning' | 'error';
  stack: StackInfo;
  uptime: number;
  memoryMB: number;
  env: string;
  deploymentUrl: string | null;
}

const statusIcon = {
  healthy: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
};

const statusBg = {
  healthy: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-yellow-500/20 bg-yellow-500/5',
  error: 'border-red-500/20 bg-red-500/5',
};

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function ProjectReportsPage() {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { 'x-vibers-secret': process.env.NEXT_PUBLIC_VIBERS_ADMIN_SECRET ?? '' },
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports ?? []);
        setLastFetch(new Date());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30_000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">프로젝트 상태 리포트</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            @vibers/admin-kit 연동된 프로젝트 실시간 현황
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm text-neutral-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        {(['healthy', 'warning', 'error'] as const).map((s) => {
          const count = reports.filter((r) => r.status === s).length;
          return (
            <div key={s} className={`rounded-xl border p-4 ${statusBg[s]}`}>
              <div className="flex items-center gap-2 mb-1">
                {statusIcon[s]}
                <span className="text-sm font-medium text-neutral-300 capitalize">
                  {s === 'healthy' ? '정상' : s === 'warning' ? '경고' : '오류'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">{count}</div>
            </div>
          );
        })}
      </div>

      {/* 리포트 목록 */}
      {loading && reports.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">불러오는 중...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-neutral-400">아직 수신된 리포트가 없습니다.</p>
          <p className="text-sm text-neutral-600">
            각 프로젝트에 <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">@vibers/admin-kit</code>을 설치하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.projectName}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {statusIcon[r.status]}
                  <div>
                    <div className="font-semibold text-white">{r.projectName}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {r.deploymentUrl ?? r.env} · 보고: {new Date(r.reportedAt).toLocaleTimeString('ko-KR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-400 shrink-0">
                  <span>메모리 {r.memoryMB}MB</span>
                  <span>업타임 {formatUptime(r.uptime)}</span>
                  <span className="capitalize px-2 py-0.5 rounded-full bg-neutral-800">{r.env}</span>
                </div>
              </div>

              {/* 스택 정보 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {/* Framework */}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                  <Activity className="w-3 h-3" />
                  {r.stack.framework} {r.stack.frameworkVersion}
                </span>
                {/* DB */}
                {r.stack.database.map((db) => (
                  <span key={db.type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                    <Database className="w-3 h-3" />
                    {db.label}
                  </span>
                ))}
                {/* Auth */}
                {r.stack.auth.map((a) => (
                  <span key={a.type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                    <Shield className="w-3 h-3" />
                    {a.label}
                  </span>
                ))}
                {/* Storage */}
                {r.stack.storage.map((s) => (
                  <span key={s.type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
                    <HardDrive className="w-3 h-3" />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {lastFetch && (
        <p className="text-xs text-neutral-600 text-center">
          마지막 갱신: {lastFetch.toLocaleTimeString('ko-KR')} · 30초마다 자동 갱신
        </p>
      )}
    </div>
  );
}
