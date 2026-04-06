"use client";

import React, { useEffect, useState } from "react";
import { Activity, RefreshCw, AlertCircle, CheckCircle2, Info, Zap, UserPlus, FileText, MessageSquare } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface ActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  type: string;
  label: string;
  timestamp: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  signup: { icon: <UserPlus className="w-3.5 h-3.5" />, color: "text-blue-600", bg: "bg-blue-50", label: "신규 가입" },
  content: { icon: <FileText className="w-3.5 h-3.5" />, color: "text-emerald-600", bg: "bg-emerald-50", label: "콘텐츠" },
  content_created: { icon: <FileText className="w-3.5 h-3.5" />, color: "text-emerald-600", bg: "bg-emerald-50", label: "콘텐츠 생성" },
  project_created: { icon: <Zap className="w-3.5 h-3.5" />, color: "text-purple-600", bg: "bg-purple-50", label: "프로젝트" },
  inquiry: { icon: <MessageSquare className="w-3.5 h-3.5" />, color: "text-amber-600", bg: "bg-amber-50", label: "문의" },
  deploy: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-slate-600", bg: "bg-slate-50", label: "배포" },
  error: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-red-600", bg: "bg-red-50", label: "오류" },
  info: { icon: <Info className="w-3.5 h-3.5" />, color: "text-slate-600", bg: "bg-slate-50", label: "정보" },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}일 전`;
  if (h > 0) return `${h}시간 전`;
  if (m > 0) return `${m}분 전`;
  return "방금";
}

export default function ActivityPage() {
  const { currentProject } = useProject();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isGlobal = currentProject.slug === "total";

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/aggregate");
      const data = await res.json();

      const projects = isGlobal
        ? (data.projects ?? [])
        : (data.projects ?? []).filter((p: any) => p.projectId === currentProject.slug);

      const all: ActivityItem[] = projects.flatMap((p: any) =>
        (p.recentActivity ?? []).map((a: any) => ({
          id: `${p.projectId}-${a.id}`,
          projectId: p.projectId,
          projectName: p.projectName,
          type: a.type,
          label: a.label,
          timestamp: a.timestamp,
        }))
      );

      all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(all);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("activity fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">
            {isGlobal ? "전체 활동 로그" : `${currentProject.name} 활동 로그`}
          </h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            {isGlobal ? "모든 프로젝트의 최근 활동을 통합 표시합니다." : "이 프로젝트의 주요 활동을 시간순으로 확인합니다."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-[var(--admin-text-muted)]">
              {lastUpdated.toLocaleTimeString("ko-KR")} 업데이트
            </span>
          )}
          <button
            onClick={fetchActivity}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg hover:bg-[var(--admin-hover)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-[var(--admin-accent)]" />
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-16 text-center">
          <Activity className="w-12 h-12 text-[var(--admin-text-muted)] mx-auto mb-4 opacity-30" />
          <p className="text-[var(--admin-text-muted)] text-base font-medium">최근 활동이 없습니다</p>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1 opacity-70">
            각 프로젝트에 활동이 발생하면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--admin-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--admin-accent)]" />
              <span className="text-sm font-semibold text-[var(--admin-text)]">최근 활동</span>
            </div>
            <span className="text-xs text-[var(--admin-text-muted)] bg-[var(--admin-hover)] px-2 py-0.5 rounded-full">
              {activities.length}건
            </span>
          </div>

          <div className="divide-y divide-[var(--admin-border)]">
            {activities.map((item) => {
              const cfg = getTypeConfig(item.type);
              return (
                <div key={item.id} className="px-5 py-3.5 flex items-start gap-4 hover:bg-[var(--admin-hover)] transition-colors">
                  <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isGlobal && (
                        <span className="text-xs font-bold text-[var(--admin-accent)] bg-[var(--admin-hover)] px-1.5 py-0.5 rounded">
                          {item.projectName}
                        </span>
                      )}
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--admin-text)] mt-0.5 truncate">{item.label}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-[var(--admin-text-muted)]">{timeAgo(item.timestamp)}</p>
                    <p className="text-[10px] text-[var(--admin-text-muted)] opacity-60">
                      {new Date(item.timestamp).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
