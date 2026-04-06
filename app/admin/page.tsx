"use client";

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import DataTable, { Column } from '@/components/admin/DataTable';
import { AreaChart, Server, Link2, AlertTriangle, Loader2, Activity } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminLog, AdminSummary } from '@/lib/admin/api';
import { discoverSite, SiteDiscovery } from '@/lib/admin/discovery';
import TrendChart from '@/components/admin/TrendChart';

// Dummy data for global projects table
const allProjects = [
  { slug: 'dus', name: 'DUS (커머스)', status: 'healthy', version: 'v3.0.1', traffic: '+12%', error: 0 },
  { slug: 'nusucheck', name: '누수체크 (O2O)', status: 'healthy', version: 'v2.1.0', traffic: '+5%', error: 0 },
  { slug: 'faneasy', name: 'FanEasy', status: 'warning', version: 'v1.5.2', traffic: '-', error: 1 },
  { slug: 'vibefolio', name: 'Vibefolio', status: 'healthy', version: 'v0.9.3', traffic: '+2%', error: 0 },
];

const projectColumns: Column[] = [
  { key: 'name', header: '프로젝트' },
  { 
    key: 'status', 
    header: '상태', 
    render: (row) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        row.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
        row.status === 'error' ? 'bg-red-100 text-red-700' :
        'bg-amber-100 text-amber-700'
      }`}>
        {row.status === 'healthy' ? '🟢 정상' : row.status === 'error' ? '🔴 오류' : '🟡 경고'}
      </span>
    )
  },
  { key: 'version', header: '버전' },
  { key: 'traffic', header: '트래픽 트렌드' },
  { 
    key: 'error', 
    header: '오류 내역',
    render: (row) => (
      row.error > 0 ? <span className="text-red-500 font-bold">{row.error}건 경고</span> : <span className="text-slate-400">-</span>
    )
  },
];

export default function AdminDashboard() {
  const { currentProject } = useProject();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [discovery, setDiscovery] = useState<SiteDiscovery | null>(null);
  const [isApiLive, setIsApiLive] = useState<boolean | null>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<number>(0);

  const isGlobal = currentProject.slug === 'total';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!isGlobal) {
          const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
          
          // Initializing discovery and probe
          const [statsData, logsData, siteInfo, apiLive] = await Promise.all([
            adapter.fetchStats(),
            adapter.fetchRecentLogs(),
            currentProject.domain ? discoverSite(`https://${currentProject.domain}`) : Promise.resolve(null),
            adapter.probe()
          ]);
          
          setSummary(statsData.summary);
          setLogs(logsData);
          setDiscovery(siteInfo);
          setIsApiLive(apiLive);
        } else {
          // Global: Fetch aggregated data from all projects
          const aggRes = await fetch('/api/admin/aggregate');
          const aggData = await aggRes.json();

          setAllProjects(
            (aggData.projects ?? []).map((p: any) => ({
              slug: p.projectId,
              name: p.projectName,
              status: p.health,
              version: '-',
              traffic: p.stats.mau > 0 ? `${p.stats.mau.toLocaleString()} MAU` : '-',
              error: p.health === 'error' ? 1 : 0,
            }))
          );

          const totals = aggData.totals ?? {};
          setSummary({
            mau: totals.mau?.toLocaleString() ?? "0",
            pv: totals.contentCount?.toLocaleString() ?? "0",
            bounceRate: `${aggData.health?.healthy ?? 0} / ${aggData.health?.total ?? 0}`,
            revenue: `+${totals.recentSignups ?? 0}명 (7일)`,
          });

          // Recent activity log from all projects
          const allActivity = (aggData.projects ?? []).flatMap((p: any) =>
            (p.recentActivity ?? []).map((a: any) => ({
              id: a.id,
              title: `[${p.projectName}] ${a.label}`,
              time: new Date(a.timestamp).toLocaleString('ko-KR'),
              type: a.type === 'signup' ? 'info' : 'info',
            }))
          ).slice(0, 10);

          setLogs(allActivity.length > 0 ? allActivity : [{ id: 'idle', title: '최근 활동 없음', time: '-', type: 'info' }]);
          setTrends(
            (aggData.projects ?? [])
              .filter((p: any) => p.stats.mau > 0)
              .map((p: any) => ({ name: p.projectName, activity: p.stats.mau }))
          );

          setDiscovery(null);
          setIsApiLive(true);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentProject, isGlobal]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">
            {isGlobal ? "Vibers 통합 총괄 대시보드" : `${currentProject.name} 프로젝트 대시보드`}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-[var(--admin-text-muted)] text-sm">
              {isGlobal ? "모든 프로젝트의 헬스체크와 주요 통계를 한눈에 확인하세요." : "개별 프로젝트의 헬스체크와 최근 발생 이슈를 관제합니다."}
            </p>
            {!isGlobal && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${isApiLive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                API: {isApiLive ? 'ONLINE' : 'OFFLINE'}
                {discovery && (
                  <>
                    <span className="w-px h-2 bg-slate-300 mx-1" />
                    <span className={`w-1.5 h-1.5 rounded-full ${discovery.online ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    SITE: {discovery.online ? 'LIVE' : 'DOWN'} ({discovery.responseTime}ms)
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm font-medium text-[var(--admin-text-muted)] bg-[var(--admin-card)] px-4 py-2 rounded-lg border border-[var(--admin-border)] shadow-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
        {loading && <div className="absolute inset-0 bg-white/50 z-10 rounded-xl flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--admin-accent)]" /></div>}
        <StatCard 
          title={isGlobal ? "활성 사이트" : "서버 상태"} 
          value={isGlobal ? `${allProjects.length} / 30` : (isApiLive ? "Healthy" : "Offline")} 
          icon={<Server className={`w-5 h-5 ${isGlobal ? 'text-blue-500' : (isApiLive ? 'text-emerald-500' : 'text-red-500')}`} />} 
          subtitle={isGlobal ? `${30 - allProjects.length}개 사이트 비활성 (보류/종료)` : `Uptime: ${isApiLive ? '99.9%' : '0%'}`}
        />
        <StatCard
          title={isGlobal ? "전체 MAU" : "월간 방문 (MAU)"}
          value={summary?.mau || "0"}
          trend="12.5%"
          trendUp={true}
          icon={<AreaChart className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title={isGlobal ? "정상 / 전체 앱" : "이탈률"}
          value={summary?.bounceRate || "0%"}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          subtitle={isGlobal ? "healthy / total" : "이탈률 기준"}
        />
        <StatCard
          title={isGlobal ? "최근 가입 (7일)" : "매출 현황"}
          value={summary?.revenue || "0"}
          icon={<Link2 className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Project Health Grid and Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden shadow-sm p-6">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-[var(--admin-text-muted)]">시간별 활동 트렌드 (실시간 Push 기반)</h4>
            </div>
            {isGlobal ? (
              <TrendChart 
                data={trends} 
                dataKey="name" 
                categories={["activity"]} 
                height={220} 
                colors={['#8B5CF6']} 
              />
            ) : (
              <div className="p-10 text-center text-[var(--admin-text-muted)] italic">
                {isApiLive ? "트래픽 상세 데이터는 '분석 > 통합 통계' 메뉴에서 확인 가능합니다." : "백엔드 연결이 오프라인 상태입니다. API 엔드포인트를 확인해주세요."}
              </div>
            )}
          </div>
          
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden shadow-sm">
            {isGlobal && <DataTable data={allProjects} columns={projectColumns} />}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-1">최근 경고/활동 로그</h3>
            {notifications > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                NEW {notifications}
              </span>
            )}
          </div>
          <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-5 space-y-5 shadow-sm min-h-[300px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--admin-accent)]" /></div>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className={`border-l-[3px] ${
                  log.type === 'error' ? 'border-red-500' : 
                  log.type === 'warning' ? 'border-amber-500' : 'border-blue-500'
                } pl-4 animate-in fade-in slide-in-from-left-2`}>
                  <p className="text-sm font-semibold text-[var(--admin-text)]">{log.title}</p>
                  <p className="text-xs text-[var(--admin-text-muted)] mt-1.5 font-medium">{log.time} • 실시간 보고</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[var(--admin-text-muted)] text-sm italic">최근 로그가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
