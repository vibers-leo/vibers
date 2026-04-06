"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Activity, RefreshCw, AlertCircle, CheckCircle2, Info, Zap,
  UserPlus, FileText, MessageSquare, Shield, Palette, DollarSign,
  Database, Rocket, ChevronDown
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { historyToActivityItems } from "@/lib/admin/activity-history";

interface ActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  type: string;
  label: string;
  timestamp: string;
  isHistorical?: boolean;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  signup:          { icon: <UserPlus className="w-3.5 h-3.5" />,      color: "text-blue-600",    bg: "bg-blue-50",    label: "신규 가입" },
  content:         { icon: <FileText className="w-3.5 h-3.5" />,      color: "text-emerald-600", bg: "bg-emerald-50", label: "콘텐츠" },
  content_created: { icon: <FileText className="w-3.5 h-3.5" />,      color: "text-emerald-600", bg: "bg-emerald-50", label: "콘텐츠" },
  feature_major:   { icon: <Rocket className="w-3.5 h-3.5" />,        color: "text-purple-600",  bg: "bg-purple-50",  label: "신기능 출시" },
  project_created: { icon: <Zap className="w-3.5 h-3.5" />,           color: "text-violet-600",  bg: "bg-violet-50",  label: "프로젝트" },
  integration:     { icon: <CheckCircle2 className="w-3.5 h-3.5" />,  color: "text-teal-600",    bg: "bg-teal-50",    label: "통합 완료" },
  inquiry:         { icon: <MessageSquare className="w-3.5 h-3.5" />, color: "text-amber-600",   bg: "bg-amber-50",   label: "문의" },
  deploy:          { icon: <CheckCircle2 className="w-3.5 h-3.5" />,  color: "text-slate-600",   bg: "bg-slate-100",  label: "배포" },
  security:        { icon: <Shield className="w-3.5 h-3.5" />,        color: "text-orange-600",  bg: "bg-orange-50",  label: "보안" },
  design:          { icon: <Palette className="w-3.5 h-3.5" />,       color: "text-pink-600",    bg: "bg-pink-50",    label: "디자인" },
  monetization:    { icon: <DollarSign className="w-3.5 h-3.5" />,    color: "text-green-600",   bg: "bg-green-50",   label: "수익화" },
  architecture:    { icon: <Database className="w-3.5 h-3.5" />,      color: "text-indigo-600",  bg: "bg-indigo-50",  label: "아키텍처" },
  error:           { icon: <AlertCircle className="w-3.5 h-3.5" />,   color: "text-red-600",     bg: "bg-red-50",     label: "오류" },
  info:            { icon: <Info className="w-3.5 h-3.5" />,          color: "text-slate-600",   bg: "bg-slate-100",  label: "정보" },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  const mo = Math.floor(d / 30);
  if (mo > 0) return `${mo}개월 전`;
  if (d > 0) return `${d}일 전`;
  if (h > 0) return `${h}시간 전`;
  if (m > 0) return `${m}분 전`;
  return "방금";
}

const SOURCE_LABELS: Record<string, string> = {
  all: "전체",
  live: "실시간",
  history: "마일스톤",
};

export default function ActivityPage() {
  const { currentProject } = useProject();
  const [liveActivities, setLiveActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 필터 상태
  const [sourceFilter, setSourceFilter] = useState<"all" | "live" | "history">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const isGlobal = currentProject.slug === "total";
  const historicalItems = historyToActivityItems(isGlobal ? undefined : currentProject.slug);

  const fetchLive = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/aggregate");
      const data = await res.json();
      const projects = isGlobal
        ? (data.projects ?? [])
        : (data.projects ?? []).filter((p: any) => p.projectId === currentProject.slug);

      const all: ActivityItem[] = projects.flatMap((p: any) =>
        (p.recentActivity ?? []).map((a: any) => ({
          id: `live-${p.projectId}-${a.id}`,
          projectId: p.projectId,
          projectName: p.projectName,
          type: a.type,
          label: a.label,
          timestamp: a.timestamp,
          isHistorical: false,
        }))
      );
      all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLiveActivities(all);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("activity fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();
  }, [currentProject]);

  // 전체 통합 + 정렬
  const allItems = useMemo(() => {
    const merged = [
      ...liveActivities,
      ...historicalItems.map((h) => ({ ...h, isHistorical: true })),
    ];
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return merged;
  }, [liveActivities, historicalItems]);

  // 필터 적용
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (sourceFilter === "live" && item.isHistorical) return false;
      if (sourceFilter === "history" && !item.isHistorical) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      return true;
    });
  }, [allItems, sourceFilter, typeFilter]);

  // 타입 목록 (현재 데이터 기반)
  const availableTypes = useMemo(() => {
    const types = new Set(allItems.map((i) => i.type));
    return Array.from(types);
  }, [allItems]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">
            {isGlobal ? "전체 활동 로그" : `${currentProject.name} 활동 로그`}
          </h1>
          <p className="text-[var(--admin-text-muted)] text-sm mt-1">
            실시간 활동과 주요 마일스톤 이력을 통합하여 표시합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-[var(--admin-text-muted)]">
              {lastUpdated.toLocaleTimeString("ko-KR")} 업데이트
            </span>
          )}
          <button
            onClick={fetchLive}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg hover:bg-[var(--admin-hover)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 출처 필터 */}
        <div className="flex gap-1 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-1">
          {(["all", "live", "history"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                sourceFilter === s
                  ? "bg-[var(--admin-accent)] text-white"
                  : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)]"
              }`}
            >
              {SOURCE_LABELS[s]}
            </button>
          ))}
        </div>

        {/* 타입 필터 */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-hover)] transition-colors cursor-pointer focus:outline-none"
          >
            <option value="all">모든 유형</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {getTypeConfig(t).label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--admin-text-muted)] pointer-events-none" />
        </div>

        <span className="text-xs text-[var(--admin-text-muted)] ml-1">
          {filteredItems.length}건
        </span>
      </div>

      {/* 리스트 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-[var(--admin-accent)]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-16 text-center">
          <Activity className="w-12 h-12 text-[var(--admin-text-muted)] mx-auto mb-4 opacity-30" />
          <p className="text-[var(--admin-text-muted)] text-base font-medium">해당 조건의 활동이 없습니다</p>
        </div>
      ) : (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
          <div className="divide-y divide-[var(--admin-border)]">
            {filteredItems.map((item) => {
              const cfg = getTypeConfig(item.type);
              const ts = new Date(item.timestamp);
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
                      {item.isHistorical && (
                        <span className="text-[10px] text-[var(--admin-text-muted)] border border-[var(--admin-border)] px-1.5 py-0.5 rounded">
                          마일스톤
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--admin-text)] mt-1 leading-relaxed">{item.label}</p>
                  </div>
                  <div className="flex-shrink-0 text-right min-w-[60px]">
                    <p className="text-xs font-medium text-[var(--admin-text-muted)]">{timeAgo(item.timestamp)}</p>
                    <p className="text-[10px] text-[var(--admin-text-muted)] opacity-60 mt-0.5">
                      {ts.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
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
